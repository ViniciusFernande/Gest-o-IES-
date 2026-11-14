/**
 * Script diário para verificar aniversariantes ativos no Firestore
 * e enviar notificação gratuita no Telegram com link direto para o WhatsApp.
 */
const https = require('https');
const admin = require('firebase-admin');

function escapeHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatarLinkWhatsapp(telefone, nome) {
  if (!telefone) return null;
  let digitos = String(telefone).replace(/\D/g, '');
  if (digitos.length < 10) return null;
  if (!digitos.startsWith('55') && (digitos.length === 10 || digitos.length === 11)) {
    digitos = '55' + digitos;
  }
  const primeiroNome = String(nome || '').trim().split(/\s+/)[0] || '';
  const saudacao = `Olá${primeiroNome ? ' ' + primeiroNome : ''}! A Igreja Evangélica Sementeira deseja um feliz aniversário! 🎉🙏`;
  return `https://wa.me/${digitos}?text=${encodeURIComponent(saudacao)}`;
}

function postHttpsIpv4(hostname, path, payload) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(payload);
    const req = https.request(
      {
        hostname,
        port: 443,
        path,
        method: 'POST',
        family: 4,
        timeout: 20000,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyStr),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(raw) });
          } catch {
            resolve({ status: res.statusCode, data: raw });
          }
        });
      }
    );

    req.on('timeout', () => {
      req.destroy(new Error('Timeout na requisição HTTPS (20s)'));
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function enviarTelegramComRetry(botToken, chatId, mensagem, tentativas = 3) {
  const path = `/bot${botToken}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: mensagem,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };

  for (let i = 1; i <= tentativas; i++) {
    try {
      const { status, data } = await postHttpsIpv4('api.telegram.org', path, payload);
      if (status >= 200 && status < 300 && data && data.ok) {
        return data;
      }
      console.warn(`Tentativa ${i}/${tentativas} falhou (${status}): ${JSON.stringify(data)}`);
      if (status < 500 && status !== 429) {
        throw new Error(`Erro ao enviar via Telegram (${status}): ${JSON.stringify(data)}`);
      }
    } catch (err) {
      console.warn(`Tentativa ${i}/${tentativas} erro de rede/timeout:`, err.message);
      if (i === tentativas) throw err;
    }

    await new Promise((r) => setTimeout(r, 3000));
  }
}

async function main() {
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!serviceAccountRaw || !botToken || !chatId) {
    throw new Error(
      'Variáveis obrigatórias ausentes: FIREBASE_SERVICE_ACCOUNT, TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID.'
    );
  }

  const serviceAccount = JSON.parse(serviceAccountRaw);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();

  // Data atual no fuso de Brasília (YYYY-MM-DD)
  const hojeBr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const [anoAtual, mesAtual, diaAtual] = hojeBr.split('-').map((n) => parseInt(n, 10));

  const snapshot = await db
    .collection('membros')
    .where('status', '==', 'ativo')
    .get();

  const aniversariantes = [];

  snapshot.forEach((doc) => {
    const m = doc.data();
    if (!m.nascimento || typeof m.nascimento !== 'string') return;

    const partes = m.nascimento.split('-');
    if (partes.length < 3) return;

    const anoNasc = parseInt(partes[0], 10);
    const mesNasc = parseInt(partes[1], 10);
    const diaNasc = parseInt(partes[2], 10);

    if (mesNasc === mesAtual && diaNasc === diaAtual) {
      let idade = !Number.isNaN(anoAtual - anoNasc) ? anoAtual - anoNasc : null;
      if (idade !== null && idade < 0) idade = null;

      aniversariantes.push({
        nome: m.nome || 'Sem nome',
        telefone: m.telefone ? m.telefone.trim() : '',
        temWhatsapp: m.temWhatsapp !== false && m.temWhatsapp !== 'nao',
        idade,
      });
    }
  });

  if (aniversariantes.length === 0) {
    console.log(`Nenhum aniversariante encontrado para hoje (${diaAtual}/${mesAtual}).`);
    return;
  }

  aniversariantes.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  const dataFormatada = `${String(diaAtual).padStart(2, '0')}/${String(mesAtual).padStart(2, '0')}`;
  const linhas = aniversariantes.map((a) => {
    const idadeTxt = a.idade !== null ? ` (${a.idade} anos)` : '';
    const telTxt = a.telefone ? escapeHtml(a.telefone) : 'Sem telefone cadastrado';
    const waLink = a.temWhatsapp ? formatarLinkWhatsapp(a.telefone, a.nome) : null;
    const linkTxt = waLink ? `\n  💬 <a href="${waLink}">Enviar parabéns no WhatsApp</a>` : '';
    return `• <b>${escapeHtml(a.nome)}</b>${idadeTxt}\n  📞 ${telTxt}${linkTxt}`;
  });

  const mensagem = [
    `🎂 <b>Aniversariantes de Hoje (${dataFormatada}) — IES Piedade</b>`,
    '',
    ...linhas,
  ].join('\n');

  await enviarTelegramComRetry(botToken, chatId, mensagem);
  console.log(`Mensagem enviada no Telegram com sucesso para ${aniversariantes.length} aniversariante(s)!`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
/**
 * IGREJA EVANGÉLICA SEMENTEIRA (IES - PIEDADE)
 * Painel Administrativo de Gestão de Membros, Aniversariantes e Eventos
 */

const STORAGE_MEMBROS = 'ies_gestao_membros_v1';
const STORAGE_EVENTOS = 'ies_gestao_eventos_v1';
const STORAGE_CONFIG = 'ies_gestao_config_v1';
const STORAGE_SIDEBAR = 'ies_gestao_sidebar_v1';

// Configurações Padrão
const DEFAULT_CONFIG = {
  nomeIgreja: 'Igreja Evangélica Sementeira Piedade',
  cidade: 'Piedade - SP',
  telAdmin: '(11) 98452-1144',
  msgWhatsapp: 'Graça e paz, {NOME}! Em nome de toda a família da Igreja Evangélica Sementeira, te desejamos um abençoado e Feliz Aniversário! Que o Senhor derrame ricas bênçãos sobre seus passos, renovando sua força e alegria a cada dia. (Salmos 118:24) 🎂🎉🙏'
};

// Estado Global
let membros = [];
let eventos = [];
let config = { ...DEFAULT_CONFIG };
let currentView = 'home';
let donutChartInstance = null;
let currentCalDate = new Date(); // Data do calendário atual
let selectedAnivMonth = new Date().getMonth(); // 0 a 11
let currentMemberFilter = 'todos';
let membroParaParabens = null;

// ================= DADOS DE EXEMPLO REAIS E INICIAIS =================
function getInitialMembers() {
  const hoje = new Date();
  const y = hoje.getFullYear();
  const m = String(hoje.getMonth() + 1).padStart(2, '0');
  const d = String(hoje.getDate()).padStart(2, '0');

  // Gera datas relativas para os cadastros recentes
  const dHoje = new Date(y, hoje.getMonth(), hoje.getDate()).toISOString();
  const d25 = new Date(y, hoje.getMonth(), Math.max(1, hoje.getDate() - 2)).toISOString();
  const d23 = new Date(y, hoje.getMonth(), Math.max(1, hoje.getDate() - 4)).toISOString();
  const dAnt1 = new Date(y, hoje.getMonth() - 1, 10).toISOString();
  const dAnt2 = new Date(y, hoje.getMonth() - 2, 15).toISOString();

  return [
    {
      id: 'ies_1',
      nome: 'Moisés de Oliveira',
      categoria: 'Homem',
      nascimento: `${y - 38}-${m}-${d}`, // Aniversariante de HOJE!
      telefone: '(11) 98452-1144',
      cargo: 'Líder de Louvor',
      status: 'ativo',
      dataCadastro: dHoje
    },
    {
      id: 'ies_2',
      nome: 'Pr. Carlos Eduardo Ramos',
      categoria: 'Homem',
      nascimento: `${y - 52}-11-20`,
      telefone: '(11) 99876-4321',
      cargo: 'Pastor Titular',
      status: 'ativo',
      dataCadastro: dAnt1
    },
    {
      id: 'ies_3',
      nome: 'Mateus Henrique Silva',
      categoria: 'Criança',
      nascimento: `${y - 10}-12-18`,
      telefone: '(11) 97765-4433',
      cargo: 'Coral Infantil',
      status: 'ativo',
      dataCadastro: d23
    },
    {
      id: 'ies_4',
      nome: 'Sarah Cristina Santos',
      categoria: 'Mulher',
      nascimento: `${y - 32}-05-15`,
      telefone: '(11) 97123-5588',
      cargo: 'Professora EBD',
      status: 'ativo',
      dataCadastro: d25
    },
    {
      id: 'ies_5',
      nome: 'Gabriel Souza',
      categoria: 'Homem',
      nascimento: `${y - 24}-09-28`,
      telefone: '(11) 98833-2211',
      cargo: 'Membro',
      status: 'ativo',
      dataCadastro: dHoje
    },
    {
      id: 'ies_6',
      nome: 'Lucas Oliveira',
      categoria: 'Homem',
      nascimento: `${y - 29}-09-30`,
      telefone: '(11) 96544-3322',
      cargo: 'Membro',
      status: 'ativo',
      dataCadastro: d25
    },
    {
      id: 'ies_7',
      nome: 'Mariana Santos',
      categoria: 'Mulher',
      nascimento: `${y - 27}-10-05`,
      telefone: '(11) 97411-8899',
      cargo: 'Membro',
      status: 'ativo',
      dataCadastro: d23
    },
    {
      id: 'ies_8',
      nome: 'Davi Lucca Ribeiro',
      categoria: 'Criança',
      nascimento: `${y - 7}-10-12`,
      telefone: '(11) 98452-1144',
      cargo: 'Departamento Infantil',
      status: 'ativo',
      dataCadastro: dHoje
    },
    {
      id: 'ies_9',
      nome: 'Ester Ferreira Lima',
      categoria: 'Mulher',
      nascimento: `${y - 28}-08-04`,
      telefone: '(11) 96541-2398',
      cargo: 'Diaconisa',
      status: 'ativo',
      dataCadastro: dAnt2
    },
    {
      id: 'ies_10',
      nome: 'Pr. Antônio Carlos',
      categoria: 'Homem',
      nascimento: `${y - 68}-09-15`,
      telefone: '(11) 97711-2233',
      cargo: 'Pastor Emérito',
      status: 'ativo',
      dataCadastro: dAnt2
    },
    {
      id: 'ies_11',
      nome: 'Rebeca Andrade',
      categoria: 'Mulher',
      nascimento: `${y - 21}-10-19`,
      telefone: '(11) 98122-3344',
      cargo: 'Líder dos Jovens',
      status: 'ativo',
      dataCadastro: d25
    },
    {
      id: 'ies_inativo_1',
      nome: 'Priscila Mendes Ramos',
      categoria: 'Mulher',
      nascimento: `${y - 30}-04-18`,
      telefone: '(11) 98112-9988',
      cargo: 'Membro (Afastada)',
      status: 'inativo',
      dataCadastro: dAnt2
    },
    {
      id: 'ies_inativo_2',
      nome: 'Roberto Fagundes',
      categoria: 'Homem',
      nascimento: `${y - 45}-07-22`,
      telefone: '(11) 97722-1144',
      cargo: 'Membro (Transferido)',
      status: 'inativo',
      dataCadastro: dAnt2
    }
  ];
}

function getInitialEvents() {
  const hoje = new Date();
  const y = hoje.getFullYear();
  const m = hoje.getMonth();

  return [
    {
      id: 'ev_1',
      titulo: 'Reunião de líderes',
      tipo: 'Reunião',
      data: new Date(y, m, hoje.getDate() + 1).toISOString().split('T')[0],
      hora: '18:00',
      local: 'Sala Ministerial'
    },
    {
      id: 'ev_2',
      titulo: 'Encontro de jovens',
      tipo: 'Evento',
      data: new Date(y, m, hoje.getDate() + 7).toISOString().split('T')[0],
      hora: '19:30',
      local: 'Templo Central'
    },
    {
      id: 'ev_3',
      titulo: 'Campanha de oração',
      tipo: 'Oração',
      data: new Date(y, m, hoje.getDate() + 10).toISOString().split('T')[0],
      hora: '06:00',
      local: 'Templo Central'
    },
    {
      id: 'ev_4',
      titulo: 'Ceia do Senhor',
      tipo: 'Culto',
      data: new Date(y, m, hoje.getDate() + 14).toISOString().split('T')[0],
      hora: '18:30',
      local: 'Templo Central'
    }
  ];
}

// Carregar & Salvar Dados
function carregarDados() {
  try {
        const rawM = localStorage.getItem(STORAGE_MEMBROS);
    membros = rawM ? JSON.parse(rawM) : getInitialMembers();
    if (!membros.some(m => m.status === 'inativo')) {
      const y = new Date().getFullYear();
      membros.push({
        id: 'ies_inativo_1',
        nome: 'Priscila Mendes Ramos',
        categoria: 'Mulher',
        nascimento: `${y - 30}-04-18`,
        telefone: '(11) 98112-9988',
        cargo: 'Membro (Afastada)',
        status: 'inativo',
        dataCadastro: new Date().toISOString()
      }, {
        id: 'ies_inativo_2',
        nome: 'Roberto Fagundes',
        categoria: 'Homem',
        nascimento: `${y - 45}-07-22`,
        telefone: '(11) 97722-1144',
        cargo: 'Membro (Transferido)',
        status: 'inativo',
        dataCadastro: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_MEMBROS, JSON.stringify(membros));
    }

    const rawE = localStorage.getItem(STORAGE_EVENTOS);
    eventos = rawE ? JSON.parse(rawE) : getInitialEvents();

    const rawC = localStorage.getItem(STORAGE_CONFIG);
    if (rawC) config = { ...DEFAULT_CONFIG, ...JSON.parse(rawC) };
    // Normaliza categorias para apenas Homem, Mulher, Criança
    let mudou = false;
    membros.forEach(m => {
      if (m.categoria === 'Idoso') { m.categoria = 'Homem'; mudou = true; }
      if (m.categoria === 'Jovem') { m.categoria = 'Mulher'; mudou = true; }
    });
    if (mudou) {
      localStorage.setItem(STORAGE_MEMBROS, JSON.stringify(membros));
    }


    const rawSidebar = localStorage.getItem(STORAGE_SIDEBAR);
    if (rawSidebar === 'collapsed') {
      document.body.classList.remove('sidebar-expanded');
      document.body.classList.add('sidebar-collapsed');
      const toggleIcon = document.getElementById('toggleIcon');
      const btnToggle = document.getElementById('btnToggleSidebar');
      if (toggleIcon) toggleIcon.className = 'ph-bold ph-caret-double-right';
      if (btnToggle) btnToggle.title = 'Fazer aparecer menu lateral';
    }
  } catch (e) {
    console.error('Erro ao ler localStorage', e);
    membros = getInitialMembers();
    eventos = getInitialEvents();
  }
}

function salvarMembros() {
  localStorage.setItem(STORAGE_MEMBROS, JSON.stringify(membros));
  atualizarTudo();
}

function salvarEventos() {
  localStorage.setItem(STORAGE_EVENTOS, JSON.stringify(eventos));
  atualizarTudo();
}

function salvarConfig() {
  localStorage.setItem(STORAGE_CONFIG, JSON.stringify(config));
  mostrarToast('Configurações salvas com sucesso!', 'success');
}
// ================= FUNÇÕES UTILITÁRIAS DE DATAS =================
function isAniversarioHoje(dataNasc) {
  if (!dataNasc) return false;
  const parts = dataNasc.split('-');
  if (parts.length < 3) return false;
  const hoje = new Date();
  return parseInt(parts[1], 10) === (hoje.getMonth() + 1) &&
         parseInt(parts[2], 10) === hoje.getDate();
}

function isAniversarioMes(dataNasc, mesZeroIndex) {
  if (!dataNasc) return false;
  const parts = dataNasc.split('-');
  if (parts.length < 3) return false;
  return parseInt(parts[1], 10) === (mesZeroIndex + 1);
}

function isCadastroEsteMes(dataCadastro) {
  if (!dataCadastro) return false;
  const d = new Date(dataCadastro);
  const hoje = new Date();
  return d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear();
}

function getDiasAteAniversario(dataNasc) {
  if (!dataNasc) return 999;
  const parts = dataNasc.split('-');
  if (parts.length < 3) return 999;
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);

  const hoje = new Date();
  hoje.setHours(0,0,0,0);
  let prox = new Date(hoje.getFullYear(), m, d);
  if (prox < hoje) {
    prox.setFullYear(hoje.getFullYear() + 1);
  }
  const diff = prox.getTime() - hoje.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

function calcularIdade(dataNasc) {
  if (!dataNasc) return '';
  const parts = dataNasc.split('-');
  if (parts.length < 3) return '';
  const ano = parseInt(parts[0], 10);
  const mes = parseInt(parts[1], 10) - 1;
  const dia = parseInt(parts[2], 10);
  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;
  const m = hoje.getMonth() - mes;
  if (m < 0 || (m === 0 && hoje.getDate() < dia)) {
    idade--;
  }
  return idade;
}

function getIniciais(nome) {
  if (!nome) return 'ME';
  const parts = nome.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// ================= CONTROLE DA SIDEBAR E TELAS =================
function alternarSidebar() {
  const isCollapsed = document.body.classList.contains('sidebar-collapsed');
  const toggleIcon = document.getElementById('toggleIcon');
  const btnToggle = document.getElementById('btnToggleSidebar');

  if (isCollapsed) {
    document.body.classList.remove('sidebar-collapsed');
    document.body.classList.add('sidebar-expanded');
    localStorage.setItem(STORAGE_SIDEBAR, 'expanded');
    if (toggleIcon) toggleIcon.className = 'ph-bold ph-caret-double-left';
    if (btnToggle) btnToggle.title = 'Suspender menu lateral';
  } else {
    document.body.classList.remove('sidebar-expanded');
    document.body.classList.add('sidebar-collapsed');
    localStorage.setItem(STORAGE_SIDEBAR, 'collapsed');
    if (toggleIcon) toggleIcon.className = 'ph-bold ph-caret-double-right';
    if (btnToggle) btnToggle.title = 'Fazer aparecer menu lateral';
  }
  if (donutChartInstance) {
    setTimeout(() => donutChartInstance.resize(), 300);
  }
}

function alternarMenuMobile(abrir) {
  if (abrir) {
    document.body.classList.add('sidebar-mobile-open');
  } else {
    document.body.classList.remove('sidebar-mobile-open');
  }
}

function trocarVisualizacao(viewName) {
  currentView = viewName;
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(btn => btn.classList.remove('active'));

  const viewMap = {
    'home': 'viewHome',
    'membros': 'viewMembros',
    'aniversariantes-dia': 'viewAniversariantesDia',
    'aniversariantes-mes': 'viewAniversariantesMes',
    'eventos': 'viewEventos',
    'calendario': 'viewCalendario',
    'membros-inativos': 'viewMembrosInativos',
    'relatorios': 'viewRelatorios',
    'configuracoes': 'viewConfiguracoes'
  };

  const targetId = viewMap[viewName] || 'viewHome';
  const activeSec = document.getElementById(targetId);
  if (activeSec) activeSec.classList.add('active');

  const activeBtn = document.querySelector(`.nav-link[data-view="${viewName}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const titulos = {
    'home': 'Painel Geral',
    'membros': 'Membros',
    'aniversariantes-dia': 'Aniversariantes do Dia',
    'aniversariantes-mes': 'Aniversariantes do Mês',
    'eventos': 'Eventos',
    'calendario': 'Calendário',
    'membros-inativos': 'Membros Inativos',
    'relatorios': 'Relatórios',
    'configuracoes': 'Configurações'
  };
  document.getElementById('topbarPageTitle').textContent = titulos[viewName] || 'Painel Geral';

  alternarMenuMobile(false);

  // Visibilidade dinâmica dos botões do Topbar
  // 'Novo Membro': apenas na aba home e membros
  // 'Novo Evento': apenas na aba home e eventos
  const btnTopNovoMembro = document.getElementById('btnTopNovoMembro');
  const btnTopNovoEvento = document.getElementById('btnTopNovoEvento');

  if (btnTopNovoMembro) {
    btnTopNovoMembro.style.display = (viewName === 'home' || viewName === 'membros') ? 'inline-flex' : 'none';
  }
  if (btnTopNovoEvento) {
    btnTopNovoEvento.style.display = (viewName === 'home' || viewName === 'eventos') ? 'inline-flex' : 'none';
  }

  // Renderizações específicas
  if (viewName === 'membros') renderizarTabelaMembros();
  if (viewName === 'aniversariantes-dia') renderizarAniversariantesDia();
  if (viewName === 'aniversariantes-mes') renderizarTabelaAniversariantesMes();
  if (viewName === 'eventos') renderizarTabelaEventos();
  if (viewName === 'calendario') renderizarCalendarioGrande();
  if (viewName === 'membros-inativos') renderizarMembrosInativos();
  if (viewName === 'relatorios') selecionarRelatorio(relatorioAtualTipo || 'aniversariantes');
}

// ================= ATUALIZAÇÃO DE KPIS & ALERTA =================
function atualizarKpisEAlerta() {
  const ativos = membros.filter(m => m.status === 'ativo');
  const hoje = new Date();

    // 1. Total Membros
  const total = ativos.length;
  document.getElementById('kpiTotalMembros').textContent = total;
  document.getElementById('sideBadgeTotalMembros').textContent = total;

  // 2. Aniversariantes do Dia
  const niversHoje = ativos.filter(m => isAniversarioHoje(m.nascimento));
  document.getElementById('kpiNiverHoje').textContent = niversHoje.length;
  const sideDia = document.getElementById('sideBadgeNiverDia');
  if (sideDia) sideDia.textContent = niversHoje.length;

  // 3. Aniversariantes do Mês
  const niversMes = ativos.filter(m => isAniversarioMes(m.nascimento, hoje.getMonth()));
  document.getElementById('kpiNiverMes').textContent = niversMes.length;
  document.getElementById('sideBadgeNiverMes').textContent = niversMes.length;

  // 4. Novos Membros este Mês
  const novosMes = ativos.filter(m => isCadastroEsteMes(m.dataCadastro));
  document.getElementById('kpiNovosMes').textContent = novosMes.length;

  // 5. Inativos
  const inativosCount = membros.filter(m => m.status === 'inativo').length;
  const sideInat = document.getElementById('sideBadgeInativos');
  if (sideInat) sideInat.textContent = inativosCount;

  // Alerta de Aniversariante do Dia (Em cima dos cards)
  const alertBanner = document.getElementById('birthdayAlertBanner');
  if (niversHoje.length > 0) {
    alertBanner.style.display = 'flex';
    const qtd = niversHoje.length;
    const textoQtd = qtd === 1 ? 'Temos 1 aniversariante hoje! 🎂' : `Temos ${qtd} aniversariantes hoje! 🎂`;
    const label = qtd === 1 ? 'Aniversariante' : 'Aniversariantes';
    const nomesComIdade = niversHoje.map(m => {
      const idade = calcularIdade(m.nascimento);
      const idadeStr = (idade !== '') ? ` (${idade} anos)` : '';
      return `<strong>${m.nome}</strong>${idadeStr}`;
    }).join(' e ');

    const countTag = document.getElementById('alertBirthdayCountTag');
    if (countTag) countTag.textContent = textoQtd;

    const namesEl = document.getElementById('alertBirthdayNames');
    if (namesEl) namesEl.innerHTML = `${label}: ${nomesComIdade}`;
  } else {
    alertBanner.style.display = 'none';
  }
}
// ================= GRÁFICO DE ROSCA VAZADA =================
function atualizarGraficoRosca() {
  const ativos = membros.filter(m => m.status === 'ativo');
  const homens = ativos.filter(m => m.categoria === 'Homem').length;
  const mulheres = ativos.filter(m => m.categoria === 'Mulher').length;
  const criancas = ativos.filter(m => m.categoria === 'Criança').length;
  const total = ativos.length;

  document.getElementById('donutCenterCount').textContent = total;
  document.getElementById('qtyHomens').textContent = homens;
  document.getElementById('qtyMulheres').textContent = mulheres;
  document.getElementById('qtyCriancas').textContent = criancas;

  const ctx = document.getElementById('membersDonutChart');
  if (!ctx) return;

  const dataValues = [homens, mulheres, criancas];
  const bgColors = ['#2563eb', '#ec4899', '#16a34a'];

  if (donutChartInstance) {
    donutChartInstance.data.labels = ['Homens', 'Mulheres', 'Crianças'];
    donutChartInstance.data.datasets[0].data = dataValues;
    donutChartInstance.data.datasets[0].backgroundColor = bgColors;
    donutChartInstance.update();
  } else {
    donutChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Homens', 'Mulheres', 'Crianças'],
        datasets: [{
          data: dataValues,
          backgroundColor: bgColors,
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%', // Centro Vazado
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw} (${total > 0 ? Math.round((ctx.raw/total)*100) : 0}%)`
            }
          }
        }
      }
    });
  }
}

// ================= PRÓXIMOS 5 ANIVERSARIANTES =================
function renderizarProximosAniversariantes() {
  const listEl = document.getElementById('homeUpcomingBirthdaysList');
  if (!listEl) return;

  const ativos = membros.filter(m => m.status === 'ativo');
  // Ordena pelos que fazem aniversário mais perto da data de hoje
  const ordenados = [...ativos].sort((a, b) => {
    return getDiasAteAniversario(a.nascimento) - getDiasAteAniversario(b.nascimento);
  }).slice(0, 5);

  if (ordenados.length === 0) {
    listEl.innerHTML = '<p class="text-muted p-3">Nenhum membro ativo cadastrado.</p>';
    return;
  }

  listEl.innerHTML = ordenados.map((m, idx) => {
    const isHoje = isAniversarioHoje(m.nascimento);
    const dias = getDiasAteAniversario(m.nascimento);
    const parts = m.nascimento ? m.nascimento.split('-') : ['','01','01'];
    const diaMesStr = `${parts[2]}/${parts[1]}`;
    
    let tagTexto = `${diaMesStr} 🎂`;
    if (isHoje) tagTexto = `Hoje (${diaMesStr}) 🎂`;
    else if (dias === 1) tagTexto = `Amanhã (${diaMesStr}) 🎂`;

    const avatarCls = ['avatar-mo', 'avatar-pr', 'avatar-ms', 'avatar-ss', 'avatar-es'][idx % 5];
    const iniciais = getIniciais(m.nome);

    return `
      <div class="birthday-row-item">
        <div class="birthday-row-left">
          <div class="avatar-circle-initials ${avatarCls}">${iniciais}</div>
          <div class="birthday-name-group">
            <span class="birthday-member-name">${m.nome}</span>
            <span class="birthday-tag-date ${isHoje ? 'is-today' : ''}">${tagTexto}</span>
          </div>
        </div>
        <button class="btn-send-whatsapp-pill" onclick="prepararMensagemParabens('${m.id}')" title="Enviar mensagem no WhatsApp">
          <i class="ph-fill ph-whatsapp-logo"></i>
          <span>Enviar mensagem</span>
        </button>
      </div>
    `;
  }).join('');
}

// ================= CADASTROS RECENTES =================
function renderizarCadastrosRecentes() {
  const listEl = document.getElementById('homeRecentMembersList');
  if (!listEl) return;

  const ordenados = [...membros].sort((a, b) => {
    const da = new Date(a.dataCadastro || 0).getTime();
    const db = new Date(b.dataCadastro || 0).getTime();
    return db - da;
  }).slice(0, 5);

  listEl.innerHTML = ordenados.map((m, idx) => {
    const d = new Date(m.dataCadastro || Date.now());
    const hoje = new Date();
    let dataStr = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
    if (d.toDateString() === hoje.toDateString()) {
      dataStr = 'Hoje';
    }

    const avatarCls = ['avatar-mo', 'avatar-pr', 'avatar-ms', 'avatar-ss', 'avatar-es'][idx % 5];
    const iniciais = getIniciais(m.nome);

    return `
      <div class="recent-member-item">
        <div class="recent-member-left">
          <div class="avatar-circle-initials ${avatarCls}">${iniciais}</div>
          <div>
            <div class="recent-member-name">${m.nome}</div>
            <div class="recent-member-role">${m.cargo || m.categoria || 'Membro'}</div>
          </div>
        </div>
        <div class="recent-member-date">${dataStr}</div>
      </div>
    `;
  }).join('');
}

// ================= PRÓXIMOS EVENTOS =================
function renderizarProximosEventos() {
  const listEl = document.getElementById('homeUpcomingEventsList');
  if (!listEl) return;

  const ordenados = [...eventos].sort((a, b) => new Date(a.data) - new Date(b.data)).slice(0, 4);

  if (ordenados.length === 0) {
    listEl.innerHTML = '<p class="text-muted p-3">Nenhum evento agendado.</p>';
    return;
  }

  const iconsMap = {
    'Reunião': { cls: 'event-icon-reuniao', icon: 'ph-crown' },
    'Evento': { cls: 'event-icon-jovens', icon: 'ph-users' },
    'Oração': { cls: 'event-icon-oracao', icon: 'ph-hands-praying' },
    'Culto': { cls: 'event-icon-ceia', icon: 'ph-sparkle' },
    'Outro': { cls: 'event-icon-geral', icon: 'ph-calendar-star' }
  };

  listEl.innerHTML = ordenados.map(ev => {
    const cfg = iconsMap[ev.tipo] || iconsMap['Outro'];
    const parts = ev.data.split('-');
    const dObj = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
    const diaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][dObj.getDay()];
    const diaMes = `${parts[2]}/${parts[1]}`;

    return `
      <div class="event-row-item" onclick="abrirModalEditarEvento('${ev.id}')">
        <div class="event-left-wrap">
          <div class="event-icon-circle ${cfg.cls}">
            <i class="ph-fill ${cfg.icon}"></i>
          </div>
          <div class="event-info-text">
            <span class="event-title-text">${ev.titulo}</span>
            <span class="event-date-text">${diaSemana}, ${diaMes}${ev.hora ? ' às ' + ev.hora : ''}</span>
          </div>
        </div>
        <div class="event-arrow-chevron"><i class="ph-bold ph-caret-right"></i></div>
      </div>
    `;
  }).join('');
}

// ================= CALENDÁRIO MINI (CARD DA HOME) =================
function renderizarCalendarioMini() {
  const ano = currentCalDate.getFullYear();
  const mes = currentCalDate.getMonth();

  document.getElementById('calCurrentMonthLabel').textContent = `${NOMES_MESES[mes]} ${ano}`;

  const grid = document.getElementById('calDaysGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const primeiroDiaSemana = new Date(ano, mes, 1).getDay(); // 0 = Dom
  const totalDiasMes = new Date(ano, mes + 1, 0).getDate();
  const totalDiasMesAnterior = new Date(ano, mes, 0).getDate();

  const hoje = new Date();
  const isMesAtual = hoje.getFullYear() === ano && hoje.getMonth() === mes;

  // Dias do mês anterior para preencher
  for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
    const diaNum = totalDiasMesAnterior - i;
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell other-month';
    cell.textContent = diaNum;
    grid.appendChild(cell);
  }

  // Dias do mês atual
  for (let d = 1; d <= totalDiasMes; d++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell';
    cell.textContent = d;

    if (isMesAtual && d === hoje.getDate()) {
      cell.classList.add('is-today');
    }

    // Indicadores de Aniversários e Eventos
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'event-dots-wrap';

    // Tem aniversariante neste dia?
    const temNiver = membros.some(m => {
      if (m.status !== 'ativo' || !m.nascimento) return false;
      const p = m.nascimento.split('-');
      return parseInt(p[1],10) === (mes + 1) && parseInt(p[2],10) === d;
    });

    if (temNiver) {
      const dot = document.createElement('span');
      dot.className = 'cal-dot niver';
      dot.title = 'Aniversário';
      dotsWrap.appendChild(dot);
    }

    // Tem eventos neste dia?
    const evsNoDia = eventos.filter(e => {
      if (!e.data) return false;
      const p = e.data.split('-');
      return parseInt(p[0],10) === ano && parseInt(p[1],10) === (mes + 1) && parseInt(p[2],10) === d;
    });

    evsNoDia.forEach(ev => {
      const dot = document.createElement('span');
      const clsMap = { 'Culto':'culto', 'Reunião':'reuniao', 'Evento':'evento', 'Oração':'outro' };
      dot.className = 'cal-dot ' + (clsMap[ev.tipo] || 'outro');
      dot.title = ev.titulo;
      dotsWrap.appendChild(dot);
    });

    if (dotsWrap.children.length > 0) {
      cell.appendChild(dotsWrap);
    }

    cell.onclick = () => abrirDetalhesDoDia(ano, mes, d);
    grid.appendChild(cell);
  }
}
// ================= TABELA GERAL DE MEMBROS =================
function renderizarTabelaMembros() {
  const tbody = document.getElementById('tbodyMembros');
  const emptyState = document.getElementById('emptyStateMembros');
  const busca = (document.getElementById('filterSearchMembro')?.value || '').toLowerCase();
  if (!tbody) return;

  const filtrados = membros.filter(m => {
    // Filtro de Categoria/Pill
    if (currentMemberFilter === 'Homem' && m.categoria !== 'Homem') return false;
    if (currentMemberFilter === 'Mulher' && m.categoria !== 'Mulher') return false;
    if (currentMemberFilter === 'Criança' && m.categoria !== 'Criança') return false;
    if (currentMemberFilter === 'aniversariantes-mes' && !isAniversarioMes(m.nascimento, new Date().getMonth())) return false;
    if (currentMemberFilter === 'niverHoje' && !isAniversarioHoje(m.nascimento)) return false;
    if (currentMemberFilter === 'novosMes' && !isCadastroEsteMes(m.dataCadastro)) return false;

    // Filtro de Texto
    if (busca) {
      const matchNome = (m.nome || '').toLowerCase().includes(busca);
      const matchCargo = ((m.observacao || m.cargo || '')).toLowerCase().includes(busca);
      const matchTel = (m.telefone || '').includes(busca);
      return matchNome || matchCargo || matchTel;
    }
    return true;
  });

  // Atualiza contadores nas pills com segurança
  const ativos = membros.filter(m => m.status === 'ativo');
  const elTodos = document.getElementById('countPillTodos') || document.getElementById('pillCountTodos');
  const elHomens = document.getElementById('countPillHomens') || document.getElementById('pillCountHomens');
  const elMulheres = document.getElementById('countPillMulheres') || document.getElementById('pillCountMulheres');
  const elCriancas = document.getElementById('countPillCriancas') || document.getElementById('pillCountCriancas');
  const elNiver = document.getElementById('countPillNiverMes') || document.getElementById('pillCountNiverMes');

  if (elTodos) elTodos.textContent = membros.length;
  if (elHomens) elHomens.textContent = ativos.filter(m => m.categoria === 'Homem').length;
  if (elMulheres) elMulheres.textContent = ativos.filter(m => m.categoria === 'Mulher').length;
  if (elCriancas) elCriancas.textContent = ativos.filter(m => m.categoria === 'Criança').length;
  if (elNiver) elNiver.textContent = ativos.filter(m => isAniversarioMes(m.nascimento, new Date().getMonth())).length;

  if (filtrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center p-4 text-muted">Nenhum membro encontrado.</td></tr>';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';

  tbody.innerHTML = filtrados.map(m => {
    const idade = calcularIdade(m.nascimento);
    const isHoje = isAniversarioHoje(m.nascimento);
    const niverParts = m.nascimento ? m.nascimento.split('-') : ['','',''];
    const niverFormatado = niverParts.length === 3 ? `${niverParts[2]}/${niverParts[1]}/${niverParts[0]}` : '-';

    return `
      <tr>
        <td>
          <div class="member-cell-info">
            <div class="avatar-circle-sm">${getIniciais(m.nome)}</div>
            <div>
              <span class="member-name-bold">${m.nome}</span>
              ${isHoje ? '<span class="badge-tag badge-niver-day">Aniversário Hoje! 🎂</span>' : ''}
            </div>
          </div>
        </td>
        <td>
          <strong>${m.categoria}</strong> 
          ${idade !== '' ? `<small class="text-muted">(${idade} anos)</small>` : ''}
        </td>
        <td>${niverFormatado}</td>
        <td>
          ${m.telefone ? `
            <span>${m.telefone}</span>
            ${(m.temWhatsapp !== false && m.temWhatsapp !== 'nao') 
              ? '<i class="ph-fill ph-whatsapp-logo" style="color:var(--whatsapp); margin-left:4px; font-size:14px;" title="Possui WhatsApp"></i>' 
              : '<small class="text-muted" style="display:block; font-size:11px; color:#999;">(Sem WhatsApp)</small>'}
          ` : '<span class="text-muted">Não informado</span>'}
        </td>
        <td>${m.observacao || m.cargo || '-'}</td>
        <td>
          <span class="badge-tag ${m.status === 'ativo' ? 'badge-ativo' : 'badge-inativo'}">
            ${m.status === 'ativo' ? 'Ativo' : 'Inativo'}
          </span>
        </td>
        <td class="text-right">
          ${(m.telefone && m.temWhatsapp !== false && m.temWhatsapp !== 'nao') ? `
            <button class="table-action-btn btn-wapp" onclick="prepararMensagemParabens('${m.id}')" title="Enviar WhatsApp">
              <i class="ph-fill ph-whatsapp-logo"></i>
            </button>
          ` : ''}
          <button class="table-action-btn btn-desativar" onclick="desativarMembro('${m.id}')" title="Mover para Inativos">
            <i class="ph-bold ph-user-minus"></i>
          </button>
          <button class="table-action-btn" onclick="abrirModalEditarMembro('${m.id}')" title="Editar">
            <i class="ph-bold ph-pencil-simple"></i>
          </button>
          <button class="table-action-btn btn-trash" onclick="excluirMembro('${m.id}')" title="Excluir">
            <i class="ph-bold ph-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ================= ANIVERSARIANTES DO MÊS =================
function renderizarTabelaAniversariantesMes() {
  const containerBtns = document.getElementById('monthSelectorButtons');
  if (containerBtns && containerBtns.children.length === 0) {
    containerBtns.innerHTML = NOMES_MESES.map((nome, idx) => `
      <button class="month-btn-pill ${idx === selectedAnivMonth ? 'active' : ''}" onclick="selecionarMesAniversariante(${idx})">
        ${nome}
      </button>
    `).join('');
  }

  document.getElementById('labelAniversariantesMesTitulo').textContent = `Aniversariantes de ${NOMES_MESES[selectedAnivMonth]}`;

  const tbody = document.getElementById('tbodyAniversariantesMes');
  if (!tbody) return;

  const ativos = membros.filter(m => m.status === 'ativo' && isAniversarioMes(m.nascimento, selectedAnivMonth));
  // Ordena por dia
  ativos.sort((a,b) => {
    const da = parseInt(a.nascimento.split('-')[2], 10);
    const db = parseInt(b.nascimento.split('-')[2], 10);
    return da - db;
  });

  if (ativos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-muted p-4 text-center">Nenhum aniversariante encontrado em ${NOMES_MESES[selectedAnivMonth]}.</td></tr>`;
    return;
  }

  tbody.innerHTML = ativos.map(m => {
    const parts = m.nascimento.split('-');
    const dia = parts[2];
    const idade = calcularIdade(m.nascimento);
    const isHoje = isAniversarioHoje(m.nascimento);

    return `
      <tr>
        <td><strong>Dia ${dia}</strong></td>
        <td>
          <span class="member-name-bold">${m.nome}</span>
          ${isHoje ? '<span class="badge-tag badge-niver-day">Hoje 🎂</span>' : ''}
        </td>
        <td>${idade !== '' ? idade + ' anos' : '-'}</td>
        <td>${m.telefone || '-'}</td>
        <td>${m.categoria}</td>
        <td class="text-right">
          ${(m.telefone && m.temWhatsapp !== false && m.temWhatsapp !== 'nao') ? `
            <button class="btn-send-whatsapp-pill" onclick="prepararMensagemParabens('${m.id}')">
              <i class="ph-fill ph-whatsapp-logo"></i>
              <span>Parabenizar</span>
            </button>
          ` : `
            <span class="badge-tag" style="background:#f1f3f0; color:#777; padding:4px 8px; font-size:11px;" title="Membro não possui WhatsApp">
              <i class="ph-bold ph-phone-slash"></i> Sem WhatsApp
            </span>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function selecionarMesAniversariante(idx) {
  selectedAnivMonth = idx;
  document.querySelectorAll('.month-btn-pill').forEach((btn, i) => {
    btn.classList.toggle('active', i === idx);
  });
  renderizarTabelaAniversariantesMes();
}

// ================= GESTÃO DE EVENTOS =================
function renderizarTabelaEventos() {
  const tbody = document.getElementById('tbodyEventos');
  if (!tbody) return;

  if (eventos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-muted p-4 text-center">Nenhum evento agendado.</td></tr>';
    return;
  }

  const ordenados = [...eventos].sort((a, b) => new Date(a.data) - new Date(b.data));

  tbody.innerHTML = ordenados.map(ev => {
    const p = ev.data.split('-');
    const dataStr = `${p[2]}/${p[1]}/${p[0]}`;
    return `
      <tr>
        <td><span class="badge-tag">${ev.tipo}</span></td>
        <td><strong>${ev.titulo}</strong></td>
        <td>${dataStr} às ${ev.hora || '19:00'}</td>
        <td>${ev.local || 'Templo Central'}</td>
        <td class="text-right">
          <button class="table-action-btn" onclick="abrirModalEditarEvento('${ev.id}')"><i class="ph-bold ph-pencil-simple"></i></button>
          <button class="table-action-btn btn-trash" onclick="excluirEvento('${ev.id}')"><i class="ph-bold ph-trash"></i></button>
        </td>
      </tr>
    `;
  }).join('');
}

// ================= CALENDÁRIO COMPLETO =================
function renderizarCalendarioGrande() {
  const ano = currentCalDate.getFullYear();
  const mes = currentCalDate.getMonth();
  const titleEl = document.getElementById('bigCalMonthTitle');
  if (titleEl) titleEl.textContent = `${NOMES_MESES[mes]} ${ano}`;

  const grid = document.getElementById('bigCalDaysGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const primeiroDiaSemana = new Date(ano, mes, 1).getDay(); // 0 = Dom
  const totalDiasMes = new Date(ano, mes + 1, 0).getDate();
  const totalDiasMesAnterior = new Date(ano, mes, 0).getDate();

  const hoje = new Date();
  const isMesAtual = hoje.getFullYear() === ano && hoje.getMonth() === mes;

  // Dias do mês anterior para preencher
  for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
    const diaNum = totalDiasMesAnterior - i;
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell other-month';
    cell.textContent = diaNum;
    grid.appendChild(cell);
  }

  // Dias do mês atual
  for (let d = 1; d <= totalDiasMes; d++) {
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell';
    cell.textContent = d;

    if (isMesAtual && d === hoje.getDate()) {
      cell.classList.add('is-today');
    }

    // Indicadores de Aniversários e Eventos
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'event-dots-wrap';

    // Tem aniversariante neste dia?
    const temNiver = membros.some(m => {
      if (m.status !== 'ativo' || !m.nascimento) return false;
      const p = m.nascimento.split('-');
      return parseInt(p[1],10) === (mes + 1) && parseInt(p[2],10) === d;
    });

    if (temNiver) {
      const dot = document.createElement('span');
      dot.className = 'cal-dot niver';
      dot.title = 'Aniversário';
      dotsWrap.appendChild(dot);
    }

    // Tem eventos neste dia?
    const evsNoDia = eventos.filter(e => {
      if (!e.data) return false;
      const p = e.data.split('-');
      return parseInt(p[0],10) === ano && parseInt(p[1],10) === (mes + 1) && parseInt(p[2],10) === d;
    });

    evsNoDia.forEach(ev => {
      const dot = document.createElement('span');
      const clsMap = { 'Culto':'culto', 'Reunião':'reuniao', 'Evento':'evento', 'Oração':'outro' };
      dot.className = 'cal-dot ' + (clsMap[ev.tipo] || 'outro');
      dot.title = ev.titulo;
      dotsWrap.appendChild(dot);
    });

    if (dotsWrap.children.length > 0) {
      cell.appendChild(dotsWrap);
    }

    cell.onclick = () => abrirDetalhesDoDia(ano, mes, d);
    grid.appendChild(cell);
  }

  // Renderiza a programação lateral do mês
  renderizarAgendaDoMes(ano, mes);
}

function renderizarAgendaDoMes(ano, mes) {
  const container = document.getElementById('monthAgendaContent');
  const labelTitle = document.getElementById('labelMonthAgendaTitle');
  if (!container) return;

  if (labelTitle) labelTitle.textContent = `Programação de ${NOMES_MESES[mes]} ${ano}`;

  // Aniversariantes do mês
  const niversMes = membros.filter(m => m.status === 'ativo' && isAniversarioMes(m.nascimento, mes));
  niversMes.sort((a,b) => parseInt(a.nascimento.split('-')[2],10) - parseInt(b.nascimento.split('-')[2],10));

  // Eventos do mês
  const evsMes = eventos.filter(e => {
    if (!e.data) return false;
    const p = e.data.split('-');
    return parseInt(p[0],10) === ano && parseInt(p[1],10) === (mes + 1);
  });
  evsMes.sort((a,b) => new Date(a.data) - new Date(b.data));

  let html = '';

  html += `<h5 style="font-size:13px; font-weight:700; color:var(--earth-900); margin-bottom:8px; display:flex; align-items:center; gap:6px;"><i class="ph-fill ph-cake text-accent"></i> Aniversariantes (${niversMes.length}):</h5>`;
  if (niversMes.length === 0) {
    html += `<p class="text-muted" style="font-size:12px; margin-bottom:14px;">Nenhum aniversariante neste mês.</p>`;
  } else {
    html += `<div style="display:flex; flex-direction:column; gap:6px; margin-bottom:16px; max-height:160px; overflow-y:auto;">`;
    niversMes.forEach(m => {
      const d = m.nascimento.split('-')[2];
      html += `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:var(--earth-50); border-radius:var(--radius-sm); font-size:12px;">
          <div><strong>Dia ${d}:</strong> ${m.nome} <small style="color:#777;">(${m.categoria})</small></div>
          <button class="btn-send-whatsapp-pill" onclick="prepararMensagemParabens('${m.id}')" style="padding:3px 8px; font-size:11px;">
            <i class="ph-fill ph-whatsapp-logo"></i>
          </button>
        </div>
      `;
    });
    html += `</div>`;
  }

  html += `<h5 style="font-size:13px; font-weight:700; color:var(--earth-900); margin-bottom:8px; display:flex; align-items:center; gap:6px;"><i class="ph-fill ph-calendar-check text-accent"></i> Eventos e Cultos (${evsMes.length}):</h5>`;
  if (evsMes.length === 0) {
    html += `<p class="text-muted" style="font-size:12px;">Nenhum evento agendado para este mês.</p>`;
  } else {
    html += `<div style="display:flex; flex-direction:column; gap:6px; max-height:180px; overflow-y:auto;">`;
    evsMes.forEach(ev => {
      const p = ev.data.split('-');
      html += `
        <div style="padding:6px 10px; background:var(--earth-50); border-radius:var(--radius-sm); font-size:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>Dia ${p[2]}: ${ev.titulo}</strong>
            <div style="font-size:11px; color:#777;">${ev.hora || '19:00'} • ${ev.local || 'Templo Central'}</div>
          </div>
          <button class="table-action-btn" onclick="abrirModalEditarEvento('${ev.id}')" style="width:24px; height:24px;"><i class="ph-bold ph-pencil-simple"></i></button>
        </div>
      `;
    });
    html += `</div>`;
  }

  container.innerHTML = html;
}

// ================= MODAL DETALHES DO DIA =================
function abrirDetalhesDoDia(ano, mes, dia) {
  const diaFormatado = `${String(dia).padStart(2,'0')}/${String(mes+1).padStart(2,'0')}/${ano}`;
  document.getElementById('modalDayDetailsTitle').textContent = `Programação do Dia: ${diaFormatado}`;
  
  const body = document.getElementById('modalDayDetailsBody');
  const nivers = membros.filter(m => {
    if (m.status !== 'ativo' || !m.nascimento) return false;
    const p = m.nascimento.split('-');
    return parseInt(p[1],10) === (mes + 1) && parseInt(p[2],10) === dia;
  });

  const evs = eventos.filter(e => {
    if (!e.data) return false;
    const p = e.data.split('-');
    return parseInt(p[0],10) === ano && parseInt(p[1],10) === (mes + 1) && parseInt(p[2],10) === dia;
  });

  let html = '';
  if (nivers.length > 0) {
    html += `<h4 class="mb-2"><i class="ph-fill ph-cake text-accent"></i> Aniversariantes do Dia:</h4><ul style="margin-left:20px; margin-bottom:16px;">`;
    nivers.forEach(m => {
      html += `<li><strong>${m.nome}</strong> (${m.categoria}) - ${m.telefone || 'Sem WhatsApp'}</li>`;
    });
    html += `</ul>`;
  }

  if (evs.length > 0) {
    html += `<h4 class="mb-2"><i class="ph-fill ph-calendar text-accent"></i> Eventos e Cultos:</h4><ul style="margin-left:20px;">`;
    evs.forEach(e => {
      html += `<li><strong>${e.titulo}</strong> às ${e.hora || '19:00'} - Local: ${e.local || 'Templo Central'} (${e.tipo})</li>`;
    });
    html += `</ul>`;
  }

  if (nivers.length === 0 && evs.length === 0) {
    html = '<p class="text-muted">Nenhum evento ou aniversário agendado para esta data.</p>';
  }

  body.innerHTML = html;
  document.getElementById('modalDayDetails').classList.add('active');
}

// ================= MODAL NOVO / EDITAR MEMBRO =================
function abrirModalNovoMembro() {
  document.getElementById('formMembro').reset();
  document.getElementById('membroId').value = '';
  const selWapp = document.getElementById('membroTemWhatsapp');
  if (selWapp) selWapp.value = 'sim';
  document.getElementById('modalMembroTitle').textContent = 'Cadastrar Novo Membro';
  document.getElementById('modalMembro').classList.add('active');
}

function abrirModalEditarMembro(id) {
  const m = membros.find(x => x.id === id);
  if (!m) return;
  document.getElementById('membroId').value = m.id;
  document.getElementById('membroNome').value = m.nome;
  document.getElementById('membroNascimento').value = m.nascimento;
  document.getElementById('membroCategoria').value = m.categoria;
  document.getElementById('membroTelefone').value = m.telefone || '';
  const selWapp = document.getElementById('membroTemWhatsapp');
  if (selWapp) selWapp.value = (m.temWhatsapp !== false && m.temWhatsapp !== 'nao') ? 'sim' : 'nao';
  document.getElementById('membroCargo').value = m.observacao || m.cargo || '';
  document.getElementById('membroStatus').value = m.status || 'ativo';

  document.getElementById('modalMembroTitle').textContent = 'Editar Membro';
  document.getElementById('modalMembro').classList.add('active');
}

function salvarFormMembro(e) {
  e.preventDefault();
  const id = document.getElementById('membroId').value;
  const nome = document.getElementById('membroNome').value.trim();
  const nascimento = document.getElementById('membroNascimento').value;
  const categoria = document.getElementById('membroCategoria').value;
  const telefone = document.getElementById('membroTelefone').value.trim();
  const temWhatsapp = document.getElementById('membroTemWhatsapp') ? (document.getElementById('membroTemWhatsapp').value === 'sim') : true;
  const cargo = document.getElementById('membroCargo').value.trim();
  const status = document.getElementById('membroStatus').value;

  if (!nome || !nascimento) {
    alert('Preencha o Nome e a Data de Nascimento.');
    return;
  }

  if (id) {
    // Editar
    const idx = membros.findIndex(x => x.id === id);
    if (idx !== -1) {
      membros[idx] = { ...membros[idx], nome, nascimento, categoria, telefone, temWhatsapp, cargo, observacao: cargo, status };
      mostrarToast('Membro atualizado com sucesso!', 'success');
    }
  } else {
    // Novo
    const novo = {
      id: 'ies_' + Date.now(),
      nome,
      nascimento,
      categoria,
      telefone,
      temWhatsapp,
      cargo,
      status,
      dataCadastro: new Date().toISOString()
    };
    membros.unshift(novo);
    mostrarToast('Novo membro cadastrado!', 'success');
  }

  salvarMembros();
  document.getElementById('modalMembro').classList.remove('active');
}

function excluirMembro(id) {
  const m = membros.find(x => x.id === id);
  if (!m) return;
  if (confirm(`Tem certeza que deseja excluir o cadastro de "${m.nome}"?`)) {
    membros = membros.filter(x => x.id !== id);
    salvarMembros();
    mostrarToast('Membro removido.', 'info');
  }
}

// ================= MODAL NOVO / EDITAR EVENTO =================
function abrirModalNovoEvento() {
  document.getElementById('formEvento').reset();
  document.getElementById('eventoId').value = '';
  document.getElementById('modalEventoTitle').textContent = 'Agendar Novo Evento';
  document.getElementById('modalEvento').classList.add('active');
}

function abrirModalEditarEvento(id) {
  const ev = eventos.find(x => x.id === id);
  if (!ev) return;
  document.getElementById('eventoId').value = ev.id;
  document.getElementById('eventoTitulo').value = ev.titulo;
  document.getElementById('eventoData').value = ev.data;
  document.getElementById('eventoHora').value = ev.hora || '19:00';
  document.getElementById('eventoTipo').value = ev.tipo || 'Culto';
  document.getElementById('eventoLocal').value = ev.local || 'Templo Central';

  document.getElementById('modalEventoTitle').textContent = 'Editar Evento';
  document.getElementById('modalEvento').classList.add('active');
}

function salvarFormEvento(e) {
  e.preventDefault();
  const id = document.getElementById('eventoId').value;
  const titulo = document.getElementById('eventoTitulo').value.trim();
  const data = document.getElementById('eventoData').value;
  const hora = document.getElementById('eventoHora').value;
  const tipo = document.getElementById('eventoTipo').value;
  const local = document.getElementById('eventoLocal').value.trim();

  if (!titulo || !data) {
    alert('Preencha o título e a data do evento.');
    return;
  }

  if (id) {
    const idx = eventos.findIndex(x => x.id === id);
    if (idx !== -1) {
      eventos[idx] = { ...eventos[idx], titulo, data, hora, tipo, local };
      mostrarToast('Evento atualizado!', 'success');
    }
  } else {
    const novo = {
      id: 'ev_' + Date.now(),
      titulo,
      data,
      hora,
      tipo,
      local
    };
    eventos.push(novo);
    mostrarToast('Evento agendado!', 'success');
  }

  salvarEventos();
  document.getElementById('modalEvento').classList.remove('active');
}

function excluirEvento(id) {
  if (confirm('Deseja remover este evento da agenda?')) {
    eventos = eventos.filter(x => x.id !== id);
    salvarEventos();
    mostrarToast('Evento removido.', 'info');
  }
}

// ================= ENVIO DE WHATSAPP =================
function prepararMensagemParabens(membroId) {
  const m = membros.find(x => x.id === membroId);
  if (!m) return;
  if (m.temWhatsapp === false || m.temWhatsapp === 'nao') {
    mostrarToast(`O membro "${m.nome}" não possui WhatsApp cadastrado.`, 'info');
    return;
  }
  abrirModalParabens(m);
}

function abrirModalParabens(membro) {
  membroParaParabens = membro;
  document.getElementById('modalWhatsappNome').textContent = membro.nome;
  document.getElementById('modalWhatsappTelefone').textContent = membro.telefone || 'Sem telefone cadastrado';
  document.getElementById('modalWhatsappAvatar').textContent = getIniciais(membro.nome);

  // Prepara texto personalizado
  const msgTemplate = config.msgWhatsapp || DEFAULT_CONFIG.msgWhatsapp;
  const msgPronta = msgTemplate.replace(/\{NOME\}/g, membro.nome);
  document.getElementById('txtModalWhatsappMsg').value = msgPronta;

  document.getElementById('modalWhatsapp').classList.add('active');
}

function confirmarEnvioWhatsapp() {
  if (!membroParaParabens) return;
  const telLimpo = (membroParaParabens.telefone || '').replace(/\D/g, '');
  const texto = document.getElementById('txtModalWhatsappMsg').value;
  const encoded = encodeURIComponent(texto);

  let url = `https://api.whatsapp.com/send?text=${encoded}`;
  if (telLimpo) {
    const ddi = telLimpo.length <= 11 ? '55' + telLimpo : telLimpo;
    url = `https://api.whatsapp.com/send?phone=${ddi}&text=${encoded}`;
  }

  window.open(url, '_blank');
  document.getElementById('modalWhatsapp').classList.remove('active');
  mostrarToast('Abrindo WhatsApp para parabenizar...', 'success');
}

// ================= BACKUP & RESTAURAÇÃO =================
function exportarBackup() {
  const backup = {
    ies_sistema: 'Gestão Igreja Sementeira Piedade',
    versao: '1.0',
    dataBackup: new Date().toISOString(),
    membros,
    eventos,
    config
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `backup_ies_piedade_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  mostrarToast('Backup JSON exportado com sucesso!', 'success');
}

function restaurarBackup(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.membros && Array.isArray(data.membros)) {
        membros = data.membros;
        salvarMembros();
      }
      if (data.eventos && Array.isArray(data.eventos)) {
        eventos = data.eventos;
        salvarEventos();
      }
      if (data.config) {
        config = data.config;
        salvarConfig();
      }
      mostrarToast('Dados restaurados com sucesso!', 'success');
    } catch (err) {
      alert('Arquivo de backup inválido.');
    }
  };
  reader.readAsText(file);
}

// ================= RELATÓRIOS PARA IMPRESSÃO =================
let relatorioAtualTipo = 'aniversariantes';

function selecionarRelatorio(tipo, mesParam = null) {
  relatorioAtualTipo = tipo;

  const boxAniv = document.getElementById('btnReportAniversariantes');
  const boxMembros = document.getElementById('btnReportGeralMembros');
  const boxEventos = document.getElementById('btnReportEventos');

  if (boxAniv) boxAniv.classList.toggle('active', tipo === 'aniversariantes');
  if (boxMembros) boxMembros.classList.toggle('active', tipo === 'membros');
  if (boxEventos) boxEventos.classList.toggle('active', tipo === 'eventos');

  if (tipo === 'aniversariantes') {
    gerarRelatorioBoletim(mesParam !== null ? mesParam : selectedAnivMonth);
  } else if (tipo === 'membros') {
    gerarRelatorioGeralMembros();
  } else if (tipo === 'eventos') {
    gerarRelatorioEventos();
  }
}

function gerarRelatorioBoletim(mesIndex = null) {
  const mes = (mesIndex !== null && mesIndex !== undefined) ? mesIndex : selectedAnivMonth;
  const mesNome = NOMES_MESES[mes] || NOMES_MESES[new Date().getMonth()];
  const ativos = membros.filter(m => m.status === 'ativo' && isAniversarioMes(m.nascimento, mes));
  ativos.sort((a,b) => parseInt(a.nascimento.split('-')[2], 10) - parseInt(b.nascimento.split('-')[2], 10));

  const elTitle = document.getElementById('printSheetTitle');
  const elDate = document.getElementById('printSheetDate');
  const content = document.getElementById('printSheetContent');

  if (elTitle) elTitle.textContent = `Boletim de Aniversariantes - ${mesNome}`;
  if (elDate) elDate.textContent = `Emitido em ${new Date().toLocaleDateString('pt-BR')}`;

  if (!content) return;

  if (ativos.length === 0) {
    content.innerHTML = `
      <div style="padding: 36px 20px; text-align: center; color: var(--text-muted);">
        <i class="ph-fill ph-cake" style="font-size: 42px; margin-bottom: 12px; display: inline-block; color: var(--sprout-700);"></i>
        <p style="font-size: 15px; margin: 0; font-weight: 500;">Nenhum aniversariante encontrado para o mês de ${mesNome}.</p>
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <table class="data-table" style="width:100%; border:1px solid #d5dec9; margin-top:16px;">
      <thead>
        <tr style="background:#eaf2e1;">
          <th style="padding:10px 14px; width:70px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Dia</th>
          <th style="padding:10px 14px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Nome do Membro</th>
          <th style="padding:10px 14px; width:90px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Idade</th>
          <th style="padding:10px 14px; width:100px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Categoria</th>
          <th style="padding:10px 14px; width:150px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Telefone / WhatsApp</th>
          <th style="padding:10px 14px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Observação / Cargo</th>
        </tr>
      </thead>
      <tbody>
        ${ativos.map(m => {
          const dia = m.nascimento ? m.nascimento.split('-')[2] : '-';
          const idade = calcularIdade(m.nascimento);
          return `
            <tr>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8;"><strong>Dia ${dia}</strong></td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8; font-weight:600;">${m.nome}</td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8; color:#2b4c16; font-weight:600;">${idade !== '' ? idade + ' anos' : '-'}</td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8;">${m.categoria}</td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8;">${m.telefone || '-'}</td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8;">${m.observacao || m.cargo || '-'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
    <div style="margin-top: 20px; padding: 12px 18px; background: #f6faf1; border-radius: 8px; border-left: 4px solid #6fa807; display: flex; justify-content: space-between; align-items: center; font-size: 13.5px;">
      <span><strong>Total no mês:</strong> ${ativos.length} aniversariante(s)</span>
      <span style="color: var(--text-muted);">Igreja Evangélica Sementeira - Piedade</span>
    </div>
  `;
}

function gerarRelatorioGeralMembros() {
  const ativos = membros.filter(m => m.status === 'ativo');
  ativos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  const elTitle = document.getElementById('printSheetTitle');
  const elDate = document.getElementById('printSheetDate');
  const content = document.getElementById('printSheetContent');

  if (elTitle) elTitle.textContent = 'Relação Geral de Membros';
  if (elDate) elDate.textContent = `Emitido em ${new Date().toLocaleDateString('pt-BR')}`;

  if (!content) return;

  if (ativos.length === 0) {
    content.innerHTML = `
      <div style="padding: 36px 20px; text-align: center; color: var(--text-muted);">
        <i class="ph-fill ph-users-four" style="font-size: 42px; margin-bottom: 12px; display: inline-block; color: var(--earth-700);"></i>
        <p style="font-size: 15px; margin: 0; font-weight: 500;">Nenhum membro ativo cadastrado no sistema.</p>
      </div>
    `;
    return;
  }

  const homens = ativos.filter(m => m.categoria === 'Homem').length;
  const mulheres = ativos.filter(m => m.categoria === 'Mulher').length;
  const criancas = ativos.filter(m => m.categoria === 'Criança').length;

  content.innerHTML = `
    <table class="data-table" style="width:100%; border:1px solid #d5dec9; margin-top:16px;">
      <thead>
        <tr style="background:#eaf2e1;">
          <th style="padding:10px 14px; width:45px; border-bottom:2px solid #b8cb9f; color:#1f3711; text-align:center;">Nº</th>
          <th style="padding:10px 14px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Nome do Membro</th>
          <th style="padding:10px 14px; width:95px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Categoria</th>
          <th style="padding:10px 14px; width:80px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Idade</th>
          <th style="padding:10px 14px; width:100px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Nascimento</th>
          <th style="padding:10px 14px; width:140px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Telefone / WhatsApp</th>
          <th style="padding:10px 14px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Observação / Cargo</th>
        </tr>
      </thead>
      <tbody>
        ${ativos.map((m, idx) => {
          let nascFormat = '-';
          if (m.nascimento) {
            const p = m.nascimento.split('-');
            if (p.length === 3) nascFormat = `${p[2]}/${p[1]}/${p[0]}`;
          }
          const idade = calcularIdade(m.nascimento);
          return `
            <tr>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8; text-align:center; color:#555;">${idx + 1}</td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8; font-weight:600;">${m.nome}</td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8;">${m.categoria}</td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8;">${idade !== '' ? idade + ' anos' : '-'}</td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8;">${nascFormat}</td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8;">${m.telefone || '-'}</td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8;">${m.observacao || m.cargo || '-'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
    <div style="margin-top: 20px; padding: 14px 18px; background: #f6faf1; border-radius: 8px; border-left: 4px solid #2b4c16; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; font-size: 13.5px;">
      <span><strong>Total de Membros Ativos:</strong> ${ativos.length}</span>
      <span><strong>Distribuição:</strong> ${homens} Homens &bull; ${mulheres} Mulheres &bull; ${criancas} Crianças</span>
    </div>
  `;
}

function gerarRelatorioEventos() {
  const elTitle = document.getElementById('printSheetTitle');
  const elDate = document.getElementById('printSheetDate');
  const content = document.getElementById('printSheetContent');

  if (elTitle) elTitle.textContent = 'Agenda de Eventos da Igreja';
  if (elDate) elDate.textContent = `Emitido em ${new Date().toLocaleDateString('pt-BR')}`;

  if (!content) return;

  if (eventos.length === 0) {
    content.innerHTML = `
      <div style="padding: 36px 20px; text-align: center; color: var(--text-muted);">
        <i class="ph-fill ph-calendar-blank" style="font-size: 42px; margin-bottom: 12px; display: inline-block; color: #2563eb;"></i>
        <p style="font-size: 15px; margin: 0; font-weight: 500;">Nenhum evento agendado no momento.</p>
      </div>
    `;
    return;
  }

  const ordenados = [...eventos].sort((a, b) => new Date(a.data) - new Date(b.data));

  content.innerHTML = `
    <table class="data-table" style="width:100%; border:1px solid #d5dec9; margin-top:16px;">
      <thead>
        <tr style="background:#eaf2e1;">
          <th style="padding:10px 14px; width:130px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Data</th>
          <th style="padding:10px 14px; width:90px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Horário</th>
          <th style="padding:10px 14px; width:110px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Tipo</th>
          <th style="padding:10px 14px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Título / Evento</th>
          <th style="padding:10px 14px; border-bottom:2px solid #b8cb9f; color:#1f3711;">Local / Departamento</th>
        </tr>
      </thead>
      <tbody>
        ${ordenados.map(ev => {
          let dataStr = '-';
          let diaSemana = '';
          if (ev.data) {
            const p = ev.data.split('-');
            if (p.length === 3) {
              dataStr = `${p[2]}/${p[1]}/${p[0]}`;
              const d = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
              diaSemana = d.toLocaleDateString('pt-BR', { weekday: 'short' });
            }
          }
          return `
            <tr>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8;"><strong>${dataStr}</strong> <small style="color:#666;">(${diaSemana})</small></td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8; font-weight:600;">${ev.hora || '19:00'}</td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8;"><span class="badge-tag">${ev.tipo || 'Culto'}</span></td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8; font-weight:600;">${ev.titulo}</td>
              <td style="padding:10px 14px; border-top:1px solid #e2ebd8;">${ev.local || 'Templo Central'}</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
    <div style="margin-top: 20px; padding: 14px 18px; background: #f6faf1; border-radius: 8px; border-left: 4px solid #2563eb; display: flex; justify-content: space-between; align-items: center; font-size: 13.5px;">
      <span><strong>Total de Eventos Programados:</strong> ${ordenados.length} evento(s)</span>
      <span style="color: var(--text-muted);">Igreja Evangélica Sementeira - Piedade</span>
    </div>
  `;
}

// Imprime a lista do mês selecionado na aba Aniversariantes do Mês
function imprimirListaDoMesSelecionado() {
  const mesIndex = selectedAnivMonth;
  const viewOrigem = currentView;

  // 1. Gera o boletim para o mês que está selecionado
  gerarRelatorioBoletim(mesIndex);

  // 2. Muda para a visualização de relatórios
  trocarVisualizacao('relatorios');
  selecionarRelatorio('aniversariantes', mesIndex);

  // 3. Ao concluir ou fechar a janela de impressão, retorna à aba de aniversariantes
  const retornarOrigem = () => {
    window.removeEventListener('afterprint', retornarOrigem);
    if (viewOrigem === 'aniversariantes-mes') {
      trocarVisualizacao('aniversariantes-mes');
    }
  };
  window.addEventListener('afterprint', retornarOrigem);

  // 4. Abre a impressão com pequeno delay para renderização completa
  setTimeout(() => {
    window.print();
  }, 250);
}

// ================= TOAST NOTIFICATION =================
function mostrarToast(mensagem, tipo = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `app-toast ${tipo}`;
  toast.innerHTML = `
    <i class="ph-bold ${tipo === 'success' ? 'ph-check-circle' : 'ph-info'}"></i>
    <span>${mensagem}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ================= ATUALIZAÇÃO GERAL DA INTERFACE =================
function atualizarTudo() {
  atualizarKpisEAlerta();
  atualizarGraficoRosca();
  renderizarProximosAniversariantes();
  renderizarCadastrosRecentes();
  renderizarProximosEventos();
  renderizarCalendarioMini();

  // Pré-renderiza todas as abas para que estejam prontas instantaneamente
  renderizarTabelaMembros();
  renderizarAniversariantesDia();
  renderizarTabelaAniversariantesMes();
  renderizarTabelaEventos();
  renderizarCalendarioGrande();
  renderizarMembrosInativos();
}

// ================= INICIALIZAÇÃO E EVENTOS =================
function inicializarAppCompleta() {

  carregarDados();

  // Exibe data atual no Topbar
  const hoje = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('topbarDateTag').textContent = hoje.toLocaleDateString('pt-BR', options);

  // Navegação da Sidebar
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-view');
      if (v) trocarVisualizacao(v);
    });
  });

  // Toggle Sidebar Desktop
  const btnToggle = document.getElementById('btnToggleSidebar');
  if (btnToggle) btnToggle.addEventListener('click', alternarSidebar);

  // Menu Mobile & Overlay
  const btnMobile = document.getElementById('btnMenuMobile');
  if (btnMobile) btnMobile.addEventListener('click', () => alternarMenuMobile(true));

  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) overlay.addEventListener('click', () => alternarMenuMobile(false));

  // Botões de Topbar
  document.getElementById('btnTopNovoMembro')?.addEventListener('click', abrirModalNovoMembro);
  document.getElementById('btnNovoMembroAba')?.addEventListener('click', abrirModalNovoMembro);
  document.getElementById('btnTopNovoEvento')?.addEventListener('click', abrirModalNovoEvento);
  document.getElementById('btnCriarNovoEventoAba')?.addEventListener('click', abrirModalNovoEvento);

  // Links do Dashboard
  document.getElementById('linkVerTodosAniversariantes')?.addEventListener('click', () => trocarVisualizacao('aniversariantes-mes'));
  document.getElementById('btnFooterVerAniversariantes')?.addEventListener('click', () => trocarVisualizacao('aniversariantes-mes'));
  document.getElementById('linkVerTodosRecentes')?.addEventListener('click', () => trocarVisualizacao('membros'));
  document.getElementById('linkVerTodosEventos')?.addEventListener('click', () => trocarVisualizacao('eventos'));
  document.getElementById('btnFooterVerCalendario')?.addEventListener('click', () => trocarVisualizacao('calendario'));
  document.getElementById('btnBannerVerMembros')?.addEventListener('click', () => trocarVisualizacao('membros'));

  // Cards KPIs clicáveis
  document.querySelectorAll('.kpi-card').forEach(card => {
    card.addEventListener('click', () => {
      const filter = card.getAttribute('data-filter');
      if (filter === 'niverHoje') {
        trocarVisualizacao('aniversariantes-dia');
        return;
      }
      if (filter === 'niverMes') {
        trocarVisualizacao('aniversariantes-mes');
        return;
      }
      currentMemberFilter = filter;
      trocarVisualizacao('membros');
      document.querySelectorAll('.filter-pill').forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-pill-category') === filter);
      });
    });
  });

  // Filtros na aba membros
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentMemberFilter = pill.getAttribute('data-pill-category');
      renderizarTabelaMembros();
    });
  });

  document.getElementById('filterSearchMembro')?.addEventListener('input', renderizarTabelaMembros);

  // Controles do Calendário
  document.getElementById('btnCalPrev')?.addEventListener('click', () => {
    currentCalDate.setMonth(currentCalDate.getMonth() - 1);
    renderizarCalendarioMini();
  });
  document.getElementById('btnCalNext')?.addEventListener('click', () => {
    currentCalDate.setMonth(currentCalDate.getMonth() + 1);
    renderizarCalendarioMini();
  });

  document.getElementById('btnBigCalPrev')?.addEventListener('click', () => {
    currentCalDate.setMonth(currentCalDate.getMonth() - 1);
    renderizarCalendarioGrande();
  });
  document.getElementById('btnBigCalNext')?.addEventListener('click', () => {
    currentCalDate.setMonth(currentCalDate.getMonth() + 1);
    renderizarCalendarioGrande();
  });

  // Fechar banner de aniversário
  document.getElementById('btnCloseBirthdayAlert')?.addEventListener('click', () => {
    document.getElementById('birthdayAlertBanner').style.display = 'none';
  });

  // Formulários
  document.getElementById('formMembro')?.addEventListener('submit', salvarFormMembro);
  document.getElementById('formEvento')?.addEventListener('submit', salvarFormEvento);

  // Modais Close buttons
  document.getElementById('btnCloseModalMembro')?.addEventListener('click', () => document.getElementById('modalMembro').classList.remove('active'));
  document.getElementById('btnCancelModalMembro')?.addEventListener('click', () => document.getElementById('modalMembro').classList.remove('active'));

  document.getElementById('btnCloseModalEvento')?.addEventListener('click', () => document.getElementById('modalEvento').classList.remove('active'));
  document.getElementById('btnCancelModalEvento')?.addEventListener('click', () => document.getElementById('modalEvento').classList.remove('active'));

  document.getElementById('btnCloseModalWhatsapp')?.addEventListener('click', () => document.getElementById('modalWhatsapp').classList.remove('active'));
  document.getElementById('btnCancelModalWhatsapp')?.addEventListener('click', () => document.getElementById('modalWhatsapp').classList.remove('active'));
  document.getElementById('btnConfirmarEnvioWhatsapp')?.addEventListener('click', confirmarEnvioWhatsapp);

  document.getElementById('btnCloseModalDayDetails')?.addEventListener('click', () => document.getElementById('modalDayDetails').classList.remove('active'));
  document.getElementById('btnFecharDayDetails')?.addEventListener('click', () => document.getElementById('modalDayDetails').classList.remove('active'));

  // Configurações
  const txtMsg = document.getElementById('txtConfigMsgWhatsapp');
  if (txtMsg) {
    txtMsg.value = config.msgWhatsapp;
    txtMsg.addEventListener('input', () => {
      document.getElementById('previewWhatsappText').textContent = txtMsg.value.replace(/\{NOME\}/g, 'Moisés de Oliveira');
    });
    document.getElementById('previewWhatsappText').textContent = config.msgWhatsapp.replace(/\{NOME\}/g, 'Moisés de Oliveira');
  }

  document.getElementById('btnSalvarConfig')?.addEventListener('click', () => {
    config.msgWhatsapp = txtMsg.value;
    config.nomeIgreja = document.getElementById('cfgNomeIgreja').value;
    config.cidade = document.getElementById('cfgCidadeIgreja').value;
    config.telAdmin = document.getElementById('cfgTelAdmin').value;
    salvarConfig();
  });

  // Backup
  document.getElementById('btnExportarDados')?.addEventListener('click', exportarBackup);
  document.getElementById('inputFileBackup')?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) restaurarBackup(e.target.files[0]);
  });

  // Busca Rápida Topbar
  const quickInput = document.getElementById('quickSearchInput');
  const dropdown = document.getElementById('searchResultsDropdown');
  if (quickInput && dropdown) {
    quickInput.addEventListener('input', () => {
      const q = quickInput.value.toLowerCase().trim();
      if (!q) {
        dropdown.style.display = 'none';
        return;
      }
      const matches = membros.filter(m => m.nome.toLowerCase().includes(q)).slice(0, 6);
      if (matches.length === 0) {
        dropdown.innerHTML = '<div style="padding:12px; color:#888;">Nenhum membro encontrado.</div>';
      } else {
        dropdown.innerHTML = matches.map(m => `
          <div style="padding:10px 14px; border-bottom:1px solid #f0f0f0; cursor:pointer; display:flex; justify-content:space-between;" onclick="abrirModalEditarMembro('${m.id}')">
            <strong>${m.nome}</strong>
            <small style="color:#777;">${m.categoria}</small>
          </div>
        `).join('');
      }
      dropdown.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
      if (!quickInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  }

  // Relatórios & Impressão
  document.getElementById('btnReportAniversariantes')?.addEventListener('click', () => selecionarRelatorio('aniversariantes'));
  document.getElementById('btnReportGeralMembros')?.addEventListener('click', () => selecionarRelatorio('membros'));
  document.getElementById('btnReportEventos')?.addEventListener('click', () => selecionarRelatorio('eventos'));
  document.getElementById('btnImprimirBoletimMes')?.addEventListener('click', imprimirListaDoMesSelecionado);

  // Inicializa visualizações e garante estado inicial dos botões
  atualizarTudo();

  const params = new URLSearchParams(window.location.search);
  const paramView = params.get('view');
  const hashView = window.location.hash ? window.location.hash.replace('#', '') : null;
  const initView = paramView || hashView || 'home';
  trocarVisualizacao(initView);
  window.addEventListener('hashchange', () => {
    const hView = window.location.hash.replace('#', '');
    if (hView) trocarVisualizacao(hView);
  });
}

function executarInitSeguro() {
  try {
    inicializarAppCompleta();
  } catch (err) {
    console.error('Erro na inicialização:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', executarInitSeguro);
} else {
  executarInitSeguro();
}


// ================= ANIVERSARIANTES DO DIA (ABA DEDICADA) =================
function renderizarAniversariantesDia() {
  const tbody = document.getElementById('tbodyAniversariantesDia');
  const emptyState = document.getElementById('emptyStateNiverDia');
  if (!tbody) return;

  const ativos = membros.filter(m => m.status === 'ativo' && isAniversarioHoje(m.nascimento));
  const countEl = document.getElementById('countAniversariantesDia');
  if (countEl) countEl.textContent = ativos.length;

  if (ativos.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';

  tbody.innerHTML = ativos.map(m => {
    const idade = calcularIdade(m.nascimento);
    return `
      <tr>
        <td>
          <div class="member-cell-info">
            <div class="avatar-circle-sm" style="background:#e0f2fe; color:#0369a1;">${getIniciais(m.nome)}</div>
            <div>
              <span class="member-name-bold">${m.nome}</span>
              <span class="badge-tag badge-niver-day">Aniversariante Hoje! 🎂</span>
            </div>
          </div>
        </td>
        <td><strong>${m.categoria}</strong></td>
        <td><strong style="color:var(--sprout-700); font-size:15px;">${idade !== '' ? idade + ' anos' : '-'}</strong></td>
        <td>${m.telefone || '<span class="text-muted">Não informado</span>'}</td>
        <td>${m.observacao || m.cargo || '-'}</td>
        <td class="text-right">
          ${(m.telefone && m.temWhatsapp !== false && m.temWhatsapp !== 'nao') ? `
            <button class="btn btn-whatsapp-glow" onclick="prepararMensagemParabens('${m.id}')" title="Enviar felicitação no WhatsApp">
              <i class="ph-fill ph-whatsapp-logo"></i>
              <span>Enviar Parabéns</span>
            </button>
          ` : `
            <span class="badge-tag" style="background:#f1f3f0; color:#777; padding:6px 12px; font-size:12px; border:1px solid #dcdfd8;" title="Membro não possui WhatsApp">
              <i class="ph-bold ph-phone-slash"></i> Sem WhatsApp
            </span>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

// ================= MEMBROS INATIVOS =================
function renderizarMembrosInativos() {
  const tbody = document.getElementById('tbodyMembrosInativos');
  const emptyState = document.getElementById('emptyStateInativos');
  const countEl = document.getElementById('countInativosTitulo');
  if (!tbody) return;

  const inativos = membros.filter(m => m.status === 'inativo');
  if (countEl) countEl.textContent = inativos.length;

  if (inativos.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';

  tbody.innerHTML = inativos.map(m => {
    const p = m.nascimento ? m.nascimento.split('-') : ['','',''];
    const dataNasc = p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : '-';
    return `
      <tr>
        <td>
          <div class="member-cell-info">
            <div class="avatar-circle-sm" style="background:#4b5563; color:#fff;">${getIniciais(m.nome)}</div>
            <div>
              <span class="member-name-bold">${m.nome}</span>
              <span class="badge-tag badge-inativo">Inativo</span>
            </div>
          </div>
        </td>
        <td><strong>${m.categoria}</strong></td>
        <td>${dataNasc}</td>
        <td>${m.telefone || '-'}</td>
        <td>${m.observacao || m.cargo || '-'}</td>
        <td class="text-right">
          <button class="btn-reativar" onclick="reativarMembro('${m.id}')" title="Reativar membro no rol ativo">
            <i class="ph-bold ph-arrow-counter-clockwise"></i>
            <span>Reativar</span>
          </button>
          <button class="table-action-btn" onclick="abrirModalEditarMembro('${m.id}')" title="Editar dados">
            <i class="ph-bold ph-pencil-simple"></i>
          </button>
          <button class="table-action-btn btn-trash" onclick="excluirMembro('${m.id}')" title="Excluir cadastro">
            <i class="ph-bold ph-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function reativarMembro(id) {
  const m = membros.find(x => x.id === id);
  if (!m) return;
  m.status = 'ativo';
  salvarMembros();
  mostrarToast(`Membro "${m.nome}" foi reativado com sucesso!`, 'success');
  renderizarMembrosInativos();
  renderizarTabelaMembros();
}

function desativarMembro(id) {
  const m = membros.find(x => x.id === id);
  if (!m) return;
  if (confirm(`Deseja desativar o membro "${m.nome}"? Ele será movido para Membros Inativos.`)) {
    m.status = 'inativo';
    salvarMembros();
    mostrarToast(`Membro "${m.nome}" movido para Inativos.`, 'info');
    renderizarTabelaMembros();
    renderizarMembrosInativos();
  }
}

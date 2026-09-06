(function(){

if(!window.NextuberSecurity) throw new Error('Camada de seguranca indisponivel.');
var escapeHtml = window.NextuberSecurity.escapeHtml;
var escapeAttr = window.NextuberSecurity.escapeAttr;
var safeUrl = window.NextuberSecurity.safeUrl;

// ── CONSTANTS ──────────────────────────────────────────────────────────────
console.log('🔶 NEXTUBER BUILD: 2026-06-17-v28 - IA acessa window.S');
if(!window.nextuberReads) throw new Error('Servico seguro de leitura indisponivel.');

function onNextuberReady(callback){
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback, {once:true});
  else callback();
}

// Ações críticas usam delegação para continuar funcionando mesmo se outro
// módulo da tela falhar durante a inicialização.
document.addEventListener('click', function(event){
  var target = event.target && event.target.closest ? event.target.closest('button') : null;
  if(!target) return;
  if(target.id === 'btnArchiveStudent'){
    event.preventDefault();
    event.stopPropagation();
    openArchiveStudent();
  } else if(target.id === 'btnCancelArchiveStudent'){
    var archiveOverlay = document.getElementById('archiveStudentOv');
    if(archiveOverlay){
      archiveOverlay.classList.remove('open');
      delete archiveOverlay.dataset.studentId;
    }
  } else if(target.id === 'btnConfirmArchiveStudent'){
    event.preventDefault();
    confirmArchiveStudent();
  } else if(target.id === 'btnSalvarPermissoes'){
    event.preventDefault();
    salvarPermissoesGestor();
  }
});
var SOPTS = ['⬜ Pendente','🔄 Em andamento','✅ Concluído','⚠️ Atenção','🔁 Renovado'];
var ML = ['Mês 1','Mês 2','Mês 3','Mês 4','Mês 5','Mês 6'];

// ── TRILHAS DATA ───────────────────────────────────────────────────────────
var TRILHAS = {
  iniciante:{cor:'#EC7000',titulo:'Fase 1 | Decolar',
    descricao:'Os primeiros 90 dias são sobre explorar, aprender e se conectar.',
    frase:'"Chegou. Agora é hora de explorar."',
    topicos:[
      {tema:'0 a 30 dias — Conexão com o Itaú',obj:'Conhecer a cultura e o jeito Itaú de fazer acontecer.',
       acoes:['Conhecer nossa cultura e nosso jeito de fazer acontecer','Entender a dinâmica da agência e as principais ferramentas','Desenvolver organização, comunicação e postura profissional','Concluir as capacitações obrigatórias da jornada'],
       tutora:'Acolher, apresentar e contextualizar. Tom leve e próximo.',
       checks:['Conhece a cultura do banco','Entende a dinâmica da agência','Desenvolveu postura profissional','Concluiu capacitações obrigatórias']},
      {tema:'31 a 60 dias — Construindo a Base',obj:'Aprender os produtos e ganhar segurança.',
       acoes:['Aprender sobre os principais produtos da carteira','Conhecer fluxos e processos da operação','Participar de simulações práticas','Ganhar segurança para os primeiros atendimentos'],
       tutora:'Garantir absorção do conteúdo. Tirar dúvidas.',
       checks:['Conhece os principais produtos','Conhece fluxos e processos','Participou de simulações práticas','Tem segurança para atender']},
      {tema:'61 a 90 dias — Primeiros Resultados',obj:'Colocar em prática e celebrar conquistas.',
       acoes:['Colocar o aprendizado em prática','Acompanhar indicadores e evolução','Compartilhar aprendizados e desafios','Celebrar as primeiras conquistas'],
       tutora:'Acompanhar de perto. Feedback frequente.',
       checks:['Está atuando na prática','Acompanha indicadores','Compartilha aprendizados','Celebrou primeiras conquistas']}
    ]},
  intermediario:{cor:'#B45309',titulo:'Fase 2 | Evoluir',
    descricao:'Dos 91 aos 180 dias: mais autonomia, mais protagonismo.',
    frase:'"Mais autonomia. Mais protagonismo."',
    topicos:[
      {tema:'91 a 120 dias — Crescimento em Movimento',obj:'Participar ativamente e expandir competências.',
       acoes:['Participar ativamente da rotina comercial','Aprimorar técnicas de escuta e relacionamento','Expandir conhecimentos sobre soluções financeiras','Desenvolver novas competências'],
       tutora:'Observar evolução técnica. Mapear pontos fortes e de desenvolvimento.',
       checks:['Participa ativamente da rotina','Aprimorou escuta e relacionamento','Expandiu conhecimento financeiro','Desenvolveu novas competências']},
      {tema:'121 a 150 dias — Feedback e Evolução',obj:'Receber feedback e ajustar a rota.',
       acoes:['Receber feedback estruturado','Identificar pontos fortes e oportunidades','Construir um plano de evolução','Ajustar a rota para continuar crescendo'],
       tutora:'Conversa honesta. Foco em quem precisa de mais apoio.',
       checks:['Recebeu feedback estruturado','Identificou pontos fortes','Construiu plano de evolução','Ajustou a rota']},
      {tema:'151 a 180 dias — Consolidando sua Jornada',obj:'Avaliar evolução e fortalecer protagonismo.',
       acoes:['Avaliar sua evolução técnica e comportamental','Reconhecer conquistas alcançadas','Preparar os próximos passos da carreira','Fortalecer seu protagonismo'],
       tutora:'Conduzir com clareza e cuidado.',
       checks:['Avaliação técnica e comportamental feita','Conquistas reconhecidas','Próximos passos preparados','Protagonismo fortalecido']}
    ]},
  avancado:{cor:'#166534',titulo:'Fase 3 | Impactar',
    descricao:'Acima de 181 dias. Seu futuro começa a ganhar forma.',
    frase:'"Seu futuro começa a ganhar forma."',
    topicos:[
      {tema:'181 a 210 dias — Construindo o Próximo Nível',obj:'Criar o PDI e ampliar horizontes.',
       acoes:['Criar seu Plano de Desenvolvimento Individual','Ampliar conhecimentos sobre novos produtos','Definir objetivos de crescimento','Planejar os próximos passos da sua jornada'],
       tutora:'Apoiar o PDI. Conectar com alvos da agência.',
       checks:['PDI criado e alinhado','Conhece novos produtos','Objetivos de crescimento definidos','Próximos passos planejados']},
      {tema:'+210 dias — Estagiário Referência',obj:'Multiplicar, inspirar e construir carreira.',
       acoes:['Apoiar ativamente a formação de novos estagiários','Atuar como multiplicador e mentor','Analisar sua curva de resultados e evolução','Refletir sobre carreira: onde quero chegar?'],
       tutora:'Facilitar protagonismo. Espaço para reflexão de carreira.',
       checks:['Atua como multiplicador','Apoia novos estagiários','Analisou sua evolução','Realizou reflexão de carreira']}
    ]}
};


// ── HELPERS GLOBAIS ─────────────────────────────────────────────────────

function calcDias(inicio){
  if(!inicio) return 0;
  return Math.floor((new Date() - new Date(inicio)) / 86400000);
}
function etapaAtual(inicio){
  var d = calcDias(inicio);
  if(d <= 30) return 0;
  if(d <= 60) return 1;
  if(d <= 90) return 2;
  if(d <= 120) return 3;
  if(d <= 150) return 4;
  if(d <= 180) return 5;
  if(d <= 210) return 6;
  return 7;
}



function fmtMilhar(n){
  if(n===null||n===undefined||n==='')return '—';
  var num = parseFloat(n);
  if(isNaN(num))return '—';
  return num.toLocaleString('pt-BR');
}
function parseMilhar(s){
  if(!s)return 0;
  return parseFloat(String(s).replace(/\./g,'').replace(',','.'))||0;
}

function trimestreAtual(){var m=new Date().getMonth();if(m<=2)return'Q1';if(m<=5)return'Q2';if(m<=8)return'Q3';return'Q4';}
function anoAtual(){return new Date().getFullYear();}
function trimestreRef(){return anoAtual()+'-'+trimestreAtual();}
function fmtTrimestre(t){if(!t)return'—';var p=t.split('-');return p[1].replace('Q','')+'º Tri '+p[0];}
function ultimosTrimestres(){var r=[],d=new Date(),a=d.getFullYear(),q=Math.floor(d.getMonth()/3)+1;for(var i=0;i<6;i++){r.push(a+'-Q'+q);q--;if(q<1){q=4;a--;}}return r;}
function getProducaoTri(eid,tri){
  if(!S.producao) return {meta:0,producao:0};
  var est = S.ests.find(function(x){ return String(x.id) === String(eid); });
  var func = est && est.perfil && est.perfil.funcional ? String(est.perfil.funcional) : null;
  return S.producao.find(function(p){
    var matchId = String(p.estagiario_id) === String(eid) || (func && String(p.estagiario_id) === func);
    return matchId && String(p.tri_ref) === String(tri);
  }) || {meta:0,producao:0};
}
// ─── DETECÇÃO DE MÊS VIGENTE ───
function getMesVigente(){
  var hoje = new Date();
  return hoje.getMonth() + 1; // Retorna 1-12
}

function getMesVigenteEmTrimestre(tri){
  var mesVigente = getMesVigente();
  // Extrair o trimestre do string "2025-Q2"
  var trimMatch = tri.match(/Q(\d)/);
  if(!trimMatch) return 1;
  var trimNum = parseInt(trimMatch[1]);
  var mesInicioTri = (trimNum - 1) * 3 + 1;

  if(mesVigente >= mesInicioTri && mesVigente < mesInicioTri + 3){
    return mesVigente - mesInicioTri + 1; // 1, 2 ou 3
  }
  if(mesVigente >= mesInicioTri + 3) return 3;
  return 1;
}


function getMesesTrimestre(tri){
  var parts=tri.split('-'), y=parts[0], t=parseInt(parts[1].replace('Q','').replace('T',''));
  var meses=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  var start=(t-1)*3;
  return [{nome:meses[start],idx:1},{nome:meses[start+1],idx:2},{nome:meses[start+2],idx:3}];
}

function getAnoMesDoTrimestre(tri, mesIdx){
  var parts = tri.split('-');
  var ano = parseInt(parts[0], 10);
  var trimestre = parseInt(parts[1].replace('Q','').replace('T',''), 10);
  return {ano:ano, mes:(trimestre-1)*3+mesIdx};
}

function quantidadeSemanasMes(tri, mesIdx){
  if(window.nextuberProduction){
    return window.nextuberProduction.quantityWeeksInMonth(tri, mesIdx);
  }
  var ref = getAnoMesDoTrimestre(tri, mesIdx);
  var inicioMes = new Date(ref.ano, ref.mes-1, 1);
  var inicioMesAtual = new Date();
  inicioMesAtual = new Date(inicioMesAtual.getFullYear(), inicioMesAtual.getMonth(), 1);
  // Meses já concluídos preservam o histórico de quatro semanas.
  if(inicioMes < inicioMesAtual) return 4;
  var diasNoMes = new Date(ref.ano, ref.mes, 0).getDate();
  return Math.ceil(diasNoMes / 7);
}

function getProducaoMensal(eid,tri,mesIdx){
  // Soma as semanas disponíveis no mês.
  var total = 0;
  for(var s=1;s<=quantidadeSemanasMes(tri,mesIdx);s++) total += getProducaoSemanal(eid,tri,mesIdx,s);
  return total;
}

function getProducaoSemanal(eid,tri,mesIdx,semIdx){
  var ref=tri+'-M'+mesIdx+'-S'+semIdx;
  if(!S.producao) return 0;
  var row=S.producao.find(function(p){return p.estagiario_id===eid&&p.tri_ref===ref;});
  return row ? (parseFloat(row.producao)||0) : 0;
}

function getTotalMensal(eid,tri){
  return getProducaoMensal(eid,tri,1)+getProducaoMensal(eid,tri,2)+getProducaoMensal(eid,tri,3);
}

async function saveProducaoSemanal(eid,tri,mesIdx,semIdx,valor){
  var ref=tri+'-M'+mesIdx+'-S'+semIdx;
  return salvarProducaoSegura(eid, tri, [{ref:ref, value:parseFloat(valor)||0}]);
}

function mesFechado(eid,tri,mesIdx){
  // Mês está fechado quando todas as semanas disponíveis têm valor > 0.
  for(var s=1;s<=quantidadeSemanasMes(tri,mesIdx);s++){
    if(getProducaoSemanal(eid,tri,mesIdx,s) === 0) return false;
  }
  return true;
}
function calcPctChecks(e){var tot=0,done=0;['iniciante','intermediario','avancado'].forEach(function(tk){if(TRILHAS[tk])TRILHAS[tk].topicos.forEach(function(tp,ti){var ck=tk+'_'+ti,chk=(e.trilhaChecks&&e.trilhaChecks[ck])||Array(tp.checks.length).fill(false);tot+=tp.checks.length;done+=chk.filter(Boolean).length;});});return tot>0?Math.round((done/tot)*100):0;}
function faixaComp(p){if(p>=75)return{cor:'#16A34A',bg:'#DCFCE7',label:'Acima do esperado'};if(p>=40)return{cor:'#EC7000',bg:'#FFF3E8',label:'Esperado'};return{cor:'#DC2626',bg:'#FEE2E2',label:'Precisa melhorar'};}
function faixaRes(p){if(p>=85)return{cor:'#16A34A',bg:'#DCFCE7',label:'Alvo atingido'};if(p>=50)return{cor:'#EC7000',bg:'#FFF3E8',label:'Em desenvolvimento'};return{cor:'#DC2626',bg:'#FEE2E2',label:'Abaixo do alvo'};}

// ── STATE ──────────────────────────────────────────────────────────────────
var S = { ests:[], archived:[], tl:Array(6).fill(false), gestores:[], producao:[], descricao:[], encontros:[], cfg:{}, monthlyChecklist:{enabled:true}, productionAuditHistory:[], regionais:[], selectedRegionalId: null };
window.S = S; // exposto pra IA e outros escopos
var DB_LOADED = false;

// ── HELPERS DE REGIONAL ──
function getEstagiariosAtivos(){
  var regionalDoGestor = getRegionalDoGestorLogado();
  if(modoGestor && gestorLogado && !isGerenteRegional()){
    if(!regionalDoGestor) return [];
    return (S.ests || []).filter(function(e){
      return String(e.regional_id || '') === regionalDoGestor;
    });
  }
  if(isGerenteRegional() && S.selectedRegionalId === 'all') return [];
  if(!S.selectedRegionalId || S.selectedRegionalId === 'all') return S.ests || [];
  return (S.ests || []).filter(function(e){
    return String(e.regional_id || '') === String(S.selectedRegionalId);
  });
}

function getGestoresAtivos(){
  var regionalDoGestor = getRegionalDoGestorLogado();
  if(modoGestor && gestorLogado && !isGerenteRegional()){
    if(!regionalDoGestor) return [];
    return (S.gestores || []).filter(function(g){
      return String(g.regional_id || '') === regionalDoGestor;
    });
  }
  if(!S.selectedRegionalId || S.selectedRegionalId === 'all') return S.gestores || [];
  return (S.gestores || []).filter(function(g){
    return String(g.regional_id || '') === String(S.selectedRegionalId);
  });
}

function podeAlternarRegional(){
  if(editor) return true;
  if(modoGestor && gestorLogado){
    var tipo = String(gestorLogado.tipo_gestor || '').toLowerCase();
    if(tipo === 'lider_regional') return true;
  }
  return false;
}

function renderRegionalSelectorUI(){
  var container = document.getElementById('regionalSelectorBar');
  var dropdown = document.getElementById('regionalSelectDropdown');
  var badge = document.getElementById('regionalBadgeInfo');
  if(!dropdown) return;

  var canSwitch = podeAlternarRegional();
  if(container){
    container.style.display = canSwitch ? 'block' : 'none';
  }

  var isRegionalManager = isGerenteRegional();
  var regionalDoGestor = getRegionalDoGestorLogado();
  var list = S.regionais || [];
  if(isRegionalManager){
    // O gerente regional navega entre as regionais, mas não usa a visão global consolidada.
    if(S.selectedRegionalId === 'all') S.selectedRegionalId = regionalDoGestor || (list[0] && list[0].id) || null;
  }
  if(list.length === 0){
    dropdown.innerHTML = '<option value="">Nenhuma regional disponível</option>';
    if(badge) badge.textContent = 'Nenhuma regional disponível';
    return;
  }

  var html = '';
  list.forEach(function(r){
    var sel = String(r.id) === String(S.selectedRegionalId) ? 'selected' : '';
    html += '<option value="'+escapeAttr(r.id)+'" '+sel+'>'+escapeHtml(r.nome)+'</option>';
  });
  if(editor){
    html += '<option value="all" '+(S.selectedRegionalId === 'all' ? 'selected' : '')+'>🌐 Todas as Regionais (Consolidado)</option>';
  }
  dropdown.innerHTML = html;

  var currentReg = list.find(function(r){ return String(r.id) === String(S.selectedRegionalId); });
  if(badge){
    if(currentReg){
      badge.textContent = 'Regional: ' + currentReg.nome;
    } else if(S.selectedRegionalId === 'all'){
      badge.textContent = 'Visão Consolidada (Todas)';
    } else {
      badge.textContent = 'Regional Ativa';
    }
  }

  if(!canSwitch){
    dropdown.disabled = true;
  } else {
    dropdown.disabled = false;
    dropdown.style.opacity = '1';
    dropdown.style.cursor = 'pointer';
  }

  if(!dropdown._bound){
    dropdown._bound = true;
    dropdown.addEventListener('change', function(evt){
      S.selectedRegionalId = evt.target.value;
      renderRegionalSelectorUI();
      updateMetrics(); renderCiclos(); renderCards(); renderTrilha();
      renderCadList(); renderTimeline(); renderGestoresList(); renderOverviewAll(); renderRanking(); updateProgress();
    });
  }
}

function aplicarRetornoProducao(eid, tri, result){
  var sid = String(eid);
  var rows = (result && result.productionRows) || [];
  S.producao = (S.producao || []).filter(function(row){
    return !(String(row.estagiario_id) === sid && String(row.tri_ref).indexOf(tri) === 0);
  }).concat(rows);
  var est = S.ests.find(function(item){ return String(item.id) === sid; });
  if(est && result && result.profile) est.perfil = result.profile;
}

async function salvarProducaoSegura(eid, tri, entries, target){
  if(!window.nextuberProduction) return false;
  var alvo = target;
  if(alvo === undefined || alvo === null) alvo = parseFloat(getProducaoTri(eid, tri).meta)||0;
  try {
    var result = await window.nextuberProduction.saveBatch({
      studentId: String(eid),
      quarterRef: tri,
      target: parseFloat(alvo)||0,
      entries: entries || []
    });
    aplicarRetornoProducao(eid, tri, result);
    return true;
  } catch(error) {
    console.error('Salvar producao segura:', error);
    return false;
  }
}

var TEXTOS_PROJETO_DEFAULT = {
  banner_over: 'PLATAFORMA NEXTUBER',
  banner_titulo: 'Nextuber — Programa de Desenvolvimento Comercial',
  banner_desc: 'Programa estruturado de 6 meses para formar estagiários comerciais com excelência técnica, comportamental e comprometimento com o cliente. Acompanhamento contínuo, trilhas adaptadas e desenvolvimento orientado por dados.',
  sec_objetivo: 'Formar estagiários comerciais alinhados à cultura Itaú, com base técnica sólida, postura profissional e capacidade de gerar resultado com consistência.',
  sec_estrutura: '6 meses de jornada divididos em 3 trilhas progressivas:\n• Iniciante (0-90 dias): Acolhimento, cultura e fundamentos.\n• Intermediária (91-180 dias): Protagonismo com apoio e ajustes de rota.\n• Avançada (+181 dias): PDI, autonomia e papel de referência.',
  sec_avaliacao: 'A nota final (0-10) é composta por:\n• 40% Comportamental: baseado no avanço da trilha de aprendizado.\n• 60% Resultados: percentual de alvo atingido no trimestre.',
  sec_participa: 'Tutora regional (Kamilla) — conduz o programa, valida trilhas e avalia. Gestores — acompanham o dia a dia operacional e registram feedbacks. Estagiários — protagonistas do próprio desenvolvimento.',
  sec_acomp: 'Feedbacks frequentes, checklist de aprendizado por etapa de 30 dias, métricas de produção trimestrais e snapshots históricos garantem visibilidade completa da evolução de cada estagiário.'
};
var S_textos = Object.assign({}, TEXTOS_PROJETO_DEFAULT);

async function loadTextosProjeto(){
  aplicarTextosProjeto();
}

function aplicarTextosProjeto(){
  // Banner principal
  var bo = document.getElementById('bannerOver'); if(bo) bo.textContent = S_textos.banner_over;
  var bt = document.getElementById('bannerTitulo'); if(bt) bt.textContent = S_textos.banner_titulo;
  var bd = document.getElementById('bannerDesc'); if(bd) bd.textContent = S_textos.banner_desc;
  // Seções do modal
  var so = document.getElementById('secObjetivo'); if(so) so.textContent = S_textos.sec_objetivo;
  var se = document.getElementById('secEstrutura'); if(se) se.textContent = S_textos.sec_estrutura;
  var sa = document.getElementById('secAvaliacao'); if(sa) sa.textContent = S_textos.sec_avaliacao;
  var sp = document.getElementById('secParticipa'); if(sp) sp.textContent = S_textos.sec_participa;
  var sac = document.getElementById('secAcomp'); if(sac) sac.textContent = S_textos.sec_acomp;
}

async function salvarTextosProjeto(){
  if(!window.nextuberMutations) throw new Error('Serviço de configurações indisponível.');
  await window.nextuberMutations.saveSetting('textos_projeto', JSON.parse(JSON.stringify(S_textos)));
}



function mkEstObj(row){
  return {
    id:           row.id,
    nome:         row.nome || 'Estagiário',
    meses:        row.meses || Array(6).fill('⬜ Pendente'),
    obs:          row.obs || '',
    atencao:      row.atencao || false,
    perfil:       row.perfil || {idade:'',funcional:'',inicio:''},
    trilhaChecks: row.trilha_checks || {},
    gestor_funcional: row.gestor_funcional || null,
    regional_id:  row.regional_id || null,
    meta:         (row.perfil && row.perfil.meta) ? row.perfil.meta : '',
    resultado:    (row.perfil && row.perfil.resultado) ? row.perfil.resultado : ''
    ,arquivado_em: row.arquivado_em || null
    ,arquivado_por: row.arquivado_por || null
    ,motivo_arquivamento: row.motivo_arquivamento || null
    ,excluir_em: row.excluir_em || null
  };
}

async function loadFromDB(){
  showLoading(true);
  try {
    // Load estagiarios
    var payload = await window.nextuberReads.bootstrap();
    S.ests = (payload.students||[]).map(mkEstObj);
    S.archived = (payload.archivedStudents||[]).map(mkEstObj);

    // Load timeline — use maybeSingle to avoid error when row doesn't exist
    S.tl = Array.isArray(payload.timeline) ? payload.timeline : Array(6).fill(false);

    // Load cfg (recorrência de produção)
    S.cfg = payload.config || {};
    S.monthlyChecklist = payload.monthlyChecklist || {enabled:true};
    S.productionAuditHistory = payload.productionAuditHistory || [];

    // Load gestores
    S.gestores = payload.managers || [];

    // Load regionais
    S.regionais = payload.regionais || [];
    if(!S.selectedRegionalId && S.regionais.length > 0){
      S.selectedRegionalId = S.regionais[0].id;
    }

    // Load producao trimestral
    S.producao = payload.production || [];

    // Load descricao
    S.descricao = payload.descriptions || [];

    // Load encontros
    S.encontros = payload.meetings || [];
    S_textos = Object.assign({}, TEXTOS_PROJETO_DEFAULT, payload.projectTexts || {});

    if(payload.session && payload.session.role === 'tutora'){
      editor = true;
      modoGestor = false;
      gestorLogado = null;
      S.selectedRegionalId = 'all';
    } else if(payload.session && payload.session.role === 'gestor'){
      editor = false;
      modoGestor = true;
      gestorLogado = payload.session.manager || null;
      if(gestorLogado && gestorLogado.regional_id){
        S.selectedRegionalId = gestorLogado.regional_id;
      }
    } else {
      editor = false;
      modoGestor = false;
      gestorLogado = null;
    }
    window.editor = editor;
    window.modoGestor = modoGestor;
    window.gestorLogado = gestorLogado;

    if(editor && window.nextuberMutations && window.nextuberMutations.ensureProductionAudit){
      try {
        var auditResult = await window.nextuberMutations.ensureProductionAudit();
        S.productionAuditHistory = auditResult.history || S.productionAuditHistory;
      } catch(auditError) {
        console.error('Histórico de pendências:', auditError);
      }
    }

    DB_LOADED = true;
  } catch(e) {
    console.error('Erro ao carregar dados:', e.message || e);
    // Still render the page even if DB fails
  }
  showLoading(false);
  renderRegionalSelectorUI();
  updateMetrics(); renderCiclos(); renderCards(); renderTrilha();
  renderCadList(); renderTimeline(); renderGestoresList(); renderOverviewAll(); renderRanking();  updateProgress();
  renderProductionAuditHistory();
  renderArchivedStudents();
  await loadTextosProjeto();
  applyMode(); // garantir que itens tutora-only fiquem escondidos no carregamento
}

function showLoading(on){
  var el = document.getElementById('loadingOverlay');
  if(el) el.style.display = on ? 'flex' : 'none';
}

var activeConteudoPage = 'iniciante';
var TRILHA_INFO = {
  iniciante:     {label:'1 a 3 meses', name:'Fase 1 | Decolar',     cor:'#EC7000', bg:'#FFF3E8', desc:'Conexão, cultura e primeiros resultados.'},
  intermediario: {label:'3 a 6 meses', name:'Fase 2 | Evoluir', cor:'#B45309', bg:'#FEF3C7', desc:'Autonomia, protagonismo e crescimento.'},
  avancado:      {label:'Acima de 6 meses', name:'Fase 3 | Impactar', cor:'#166534', bg:'#DCFCE7', desc:'PDI, novos horizontes e carreira.'}
};

var editor=false, panelIdx=-1, cadIdx=-1, renameIdx=-1, activeTrilha='iniciante', activeConteudoTab='iniciante', editandoConteudoIdx=-1, modoGestor=false, gestorLogado=null, pSelectedMesIdx=0;
// Expor em window para acesso global em funções como salvar/editar agendamento
window.editor = editor;
window.modoGestor = modoGestor;
window.gestorLogado = gestorLogado;

// ── PERSIST ────────────────────────────────────────────────────────────────
// persist is now async — call with await or fire-and-forget
function persist(silent){ persistAsync(silent); }

async function persistAsync(silent){
  updateMetrics(); renderCiclos(); updateProgress();
  if(!silent) showToast();
}

// ── Specific savers ────────────────────────────────────────────────────────
async function saveEstagiario(est){
  // Serializar tudo via JSON para garantir dados puros (evita DataCloneError)
  var data = JSON.parse(JSON.stringify({
    name:        String(est.nome||''),
    regional_id: est.regional_id || S.selectedRegionalId || null,
    months:      est.meses||[],
    notes:       String(est.obs||''),
    attention:   !!est.atencao,
    profile:     est.perfil||{},
    trailChecks: est.trilhaChecks||{}
  }));
  try {
    if(!window.nextuberMutations) throw new Error('Serviço de cadastro indisponível.');
    var r;
    if(est.id){
      r = await window.nextuberMutations.updateStudent(String(est.id), data);
    } else {
      r = await window.nextuberMutations.createStudent(data);
    }
    if(r && r.student){
      est.id = r.student.id || est.id;
      est.perfil = r.student.perfil || est.perfil;
      est.trilhaChecks = r.student.trilha_checks || est.trilhaChecks;
      est.gestor_funcional = r.student.gestor_funcional || est.gestor_funcional || null;
    }
    return true;
  } catch(e) {
    console.error('saveEstagiario EXCEPTION:', e);
    alert('Erro ao salvar: ' + (e.message||e));
    return false;
  }
}

async function deleteEstagiario(id){
  if(!window.nextuberMutations) throw new Error('Serviço de cadastro indisponível.');
  await window.nextuberMutations.deleteStudent(String(id));
}



async function updateMeuPerfil(nome, funcional, senha){
  if(!gestorLogado) return null;
  try {
    if(!window.nextuberMutations) throw new Error('Serviço de gestores indisponível.');
    var r = await window.nextuberMutations.updateMyManagerProfile({name:nome, employeeCode:funcional, password:senha||''});
    if(r.manager){
      var i = S.gestores.findIndex(function(g){ return g.id === gestorLogado.id; });
      if(i >= 0) S.gestores[i] = r.manager;
      gestorLogado = r.manager;
      return r.manager;
    }
  } catch(error) {
    console.error('updateMeuPerfil:', error);
  }
  return null;
}

async function saveGestor(nome, funcional, agencia, regionalId){
  try {
    if(!window.nextuberMutations) throw new Error('Serviço de gestores indisponível.');
    var r = await window.nextuberMutations.createManager({name:nome, employeeCode:funcional, agency:agencia, regionalId:regionalId});
    if(r.manager){ S.gestores.push(r.manager); return r.manager; }
  } catch(error) {
    console.error('saveGestor error:', error);
  }
  return null;
}

async function deleteGestor(id){
  if(!window.nextuberMutations) throw new Error('Serviço de gestores indisponível.');
  await window.nextuberMutations.deleteManager(String(id));
  S.gestores = S.gestores.filter(function(g){ return g.id !== id; });
}



async function saveMetaTri(eid,tri,meta){
  return salvarProducaoSegura(eid, tri, [], parseFloat(meta)||0);
}
async function saveProducaoTri(eid,tri,prod){
  void prod;
  return salvarProducaoSegura(eid, tri, []);
}

async function saveTimeline(){
  if(!window.nextuberMutations) throw new Error('Serviço de configurações indisponível.');
  await window.nextuberMutations.saveSetting('timeline', JSON.parse(JSON.stringify(S.tl)));
}
function showToast(){ var t=document.getElementById('toast'); t.classList.add('show'); clearTimeout(t._t); t._t=setTimeout(function(){t.classList.remove('show');},2000); }

// ── UTILS ──────────────────────────────────────────────────────────────────
function ini(n){ var p=n.trim().split(' ').filter(Boolean); return p.length>=2?(p[0][0]+p[p.length-1][0]).toUpperCase():p[0][0].toUpperCase(); }
function fmtDate(d){ if(!d) return '—'; var parts=d.split('-'); return parts[2]+'/'+parts[1]+'/'+parts[0]; }
function calcTempo(inicio){
  if(!inicio) return null;
  var s=new Date(inicio), now=new Date();
  if(now<s) return 'Não iniciado';
  var y=now.getFullYear()-s.getFullYear(), m=now.getMonth()-s.getMonth();
  if(m<0){y--;m+=12;}
  if(y===0&&m===0) return 'Iniciando';
  if(y===0) return m===1?'1 mês':m+' meses';
  if(m===0) return y===1?'1 ano':y+' anos';
  return y+' ano'+(y>1?'s':'')+' e '+m+' '+(m===1?'mês':'meses');
}
function sClass(s){
  if(s.indexOf('Concluído')>=0||s.indexOf('Renovado')>=0) return 's-done';
  if(s.indexOf('andamento')>=0) return 's-active';
  if(s.indexOf('Atenção')>=0) return 's-warn';
  if(s.indexOf('Pendente')>=0) return 's-pend';
  return 's-renew';
}
function mClass(s){
  if(s.indexOf('Concluído')>=0||s.indexOf('Renovado')>=0) return 'm-done';
  if(s.indexOf('andamento')>=0) return 'm-active';
  if(s.indexOf('Atenção')>=0) return 'm-warn';
  return 'm-pend';
}
function sShort(s){
  if(s.indexOf('Concluído')>=0) return 'Concluído';
  if(s.indexOf('Renovado')>=0) return 'Renovado';
  if(s.indexOf('andamento')>=0) return 'Andamento';
  if(s.indexOf('Atenção')>=0) return 'Atenção';
  return 'Pendente';
}
function dotCls(s){
  if(s.indexOf('Concluído')>=0||s.indexOf('Renovado')>=0) return 'done';
  if(s.indexOf('andamento')>=0) return 'prog';
  if(s.indexOf('Atenção')>=0) return 'attn';
  return '';
}
function currMonth(e){ for(var i=0;i<6;i++) if(e.meses[i].indexOf('Concluído')<0&&e.meses[i].indexOf('Renovado')<0) return i; return 5; }

// ── METRICS ────────────────────────────────────────────────────────────────
function updateMetrics(){
  var done=0,active=0,warn=0;
  var estsAtivos = (typeof getEstagiariosAtivos === 'function') ? getEstagiariosAtivos() : S.ests;
  estsAtivos.forEach(function(e){ e.meses.forEach(function(s){ if(s.indexOf('Concluído')>=0||s.indexOf('Renovado')>=0) done++; else if(s.indexOf('andamento')>=0) active++; else if(s.indexOf('Atenção')>=0) warn++; }); });
  var elDone=document.getElementById('mDone'); if(elDone) elDone.textContent=done;
  var elActive=document.getElementById('mActive'); if(elActive) elActive.textContent=active;
  var elWarn=document.getElementById('mWarn'); if(elWarn) elWarn.textContent=warn;
}
function updateProgress(){
  var estsAtivos = (typeof getEstagiariosAtivos === 'function') ? getEstagiariosAtivos() : S.ests;
  var all=estsAtivos.reduce(function(a,e){return a.concat(e.meses);},[]);
  var done=all.filter(function(s){return s.indexOf('Concluído')>=0||s.indexOf('Renovado')>=0;}).length;
  var pct=all.length ? Math.round(done/all.length*100) : 0;
  var pctFill = document.getElementById('pctFill'); if(pctFill) pctFill.style.width=pct+'%';
  var pctLbl = document.getElementById('pctLbl'); if(pctLbl) pctLbl.textContent=pct+'%';
}
function renderCiclos(){ if(!document.getElementById("ciclosBars")) return;
  var estsAtivos = (typeof getEstagiariosAtivos === 'function') ? getEstagiariosAtivos() : S.ests;
  var ciclos=[{n:'Ciclo 1 — Base & Segurança',m:[0,1],c:'#EC7000'},{n:'Ciclo 2 — Autonomia',m:[2,3],c:'#B45309'},{n:'Ciclo 3 — Protagonismo',m:[4,5],c:'#166534'}];
  document.getElementById('ciclosBars').innerHTML=ciclos.map(function(c){
    var tot=estsAtivos.length*c.m.length;
    var done=estsAtivos.reduce(function(a,e){return a+c.m.filter(function(mi){return e.meses[mi].indexOf('Concluído')>=0||e.meses[mi].indexOf('Renovado')>=0;}).length;},0);
    var pct=tot?Math.round(done/tot*100):0;
    return '<div class="cbar"><span class="cdot" style="background:'+c.c+'"></span><span class="cname">'+c.n+'</span><span class="ctrack"><span class="cfill" style="width:'+pct+'%;background:'+c.c+'"></span></span><span class="cpct">'+pct+'%</span></div>';
  }).join('');
}

// ── CARDS ──────────────────────────────────────────────────────────────────


var TRILHA_LABELS = {iniciante:'1–3 meses', intermediario:'3–6 meses', avancado:'+6 meses'};
var TRILHA_CORES  = {iniciante:'#EC7000',   intermediario:'#B45309',   avancado:'#166534'};
var TRILHA_BG     = {iniciante:'#FFF3E8',   intermediario:'#FEF3C7',   avancado:'#DCFCE7'};

function updateAtencaoBtn(idx){
  var e = S.ests[idx];
  var btn = document.getElementById('btnAtencao');
  var txt = document.getElementById('btnAtencaoTxt');
  var hint = document.getElementById('atencaoHint');
  if(!btn) return;
  if(e.atencao){
    btn.classList.add('ativo');
    txt.textContent = 'Remover atenção';
  } else {
    btn.classList.remove('ativo');
    txt.textContent = 'Marcar como atenção';
  }
  btn.disabled = !editor;
  if(hint) hint.textContent = editor ? 'Clique para alternar o status de atenção.' : 'Entre como tutora para alterar.';
}

var TL_DATA = [
  {num:'Mês 1', name:'Acolhimento', cls:'c1'},
  {num:'Mês 2', name:'Entendimento', cls:'c1'},
  {num:'Mês 3', name:'Participação', cls:'c2'},
  {num:'Mês 4', name:'Consolidação', cls:'c2'},
  {num:'Mês 5', name:'Protagonismo', cls:'c3'},
  {num:'Mês 6', name:'Avaliação', cls:'c3'},
];
function renderTimeline(){
  var el = document.getElementById('timelineGrid');
  if(!el) return;
  el.innerHTML = TL_DATA.map(function(m,i){
    var done = S.tl && S.tl[i];
    return '<div class="tcell '+m.cls+(done?' done':'')+'" data-tl="'+i+'">'
      +'<div class="tnum">'+m.num+'</div>'
      +'<div class="tname">'+m.name+'</div>'
      +'</div>';
  }).join('');
  el.querySelectorAll('.tcell').forEach(function(cell){
    cell.addEventListener('click', function(){
      var idx = parseInt(this.dataset.tl);
      if(!S.tl) S.tl = Array(6).fill(false);
      S.tl[idx] = !S.tl[idx];
      saveTimeline();
      persist(true);
      renderTimeline();
    });
  });
}



function calcScore(e, triRef){
  triRef = triRef || trimestreRef();
  var prod = getProducaoTri(e.id, triRef);
  var meta = parseFloat(prod.meta) || 0;

  // Crédito (Equilíbrio) — 60% (0-6 pts)
  var producaoCredito = getTotalTrimestreModalidades(e.id, triRef);
  // fallback: se ainda usa o total mensal antigo
  if(producaoCredito === 0){
    var totalMensal = getTotalMensal(e.id, triRef);
    producaoCredito = totalMensal > 0 ? totalMensal : (parseFloat(prod.producao)||0);
  }
  var pctCredito = meta>0 ? Math.min(producaoCredito/meta, 1) : 0;
  var notaCredito = pctCredito * 6;

  // Produtos (Seguros, PIC, Combinaqui, Consórcios) — 40% (0-4 pts)
  // O alvo de produtos não existe explicitamente; usamos 20% do alvo de crédito como alvo de produtos
  var metaProdutos = meta * 0.2;
  var producaoProdutos = getTotalTrimestreOutros(e.id, triRef);
  var pctProdutos = metaProdutos>0 ? Math.min(producaoProdutos/metaProdutos, 1) : 0;
  var notaProdutos = pctProdutos * 4;

  return Math.min(Math.round((notaCredito+notaProdutos)*10)/10, 10);
}

function scoreColor(s){
  if(s >= 8) return '#16A34A';
  if(s >= 5) return '#EC7000';
  return '#DC2626';
}
function scoreBg(s){
  if(s >= 8) return '#DCFCE7';
  if(s >= 5) return '#FFF3E8';
  return '#FEE2E2';
}

function getTrilhaKey(inicio){
  if(!inicio) return null;
  var s=new Date(inicio), now=new Date();
  if(now<s) return null;
  var y=now.getFullYear()-s.getFullYear(), m=now.getMonth()-s.getMonth();
  if(m<0){y--;m+=12;}
  var totalMonths = y*12+m;
  if(totalMonths < 3) return 'iniciante';
  if(totalMonths < 6) return 'intermediario';
  return 'avancado';
}

function getTrilhaCor(key){
  var cores = {iniciante:'#EC7000', intermediario:'#B45309', avancado:'#166534'};
  return cores[key]||'#EC7000';
}

function normalizeTrilhaKey(key){
  if(!key) return null;
  var k = String(key).toLowerCase();
  if(k.indexOf('decolar')>=0 || k.indexOf('iniciante')>=0) return 'iniciante';
  if(k.indexOf('evoluir')>=0 || k.indexOf('intermediario')>=0) return 'intermediario';
  if(k.indexOf('impactar')>=0 || k.indexOf('avancado')>=0) return 'avancado';
  return 'iniciante';
}

function getEffectiveTrilhaKey(e){
  if(!e || !e.perfil) return null;
  if(e.perfil.trilha_manual) return normalizeTrilhaKey(e.perfil.trilha_manual);
  return (e.perfil && e.perfil.inicio) ? normalizeTrilhaKey(getTrilhaKey(e.perfil.inicio)) : null;
}

function isGGA(){
  if(!modoGestor || !gestorLogado) return false;
  return gestorLogado.tipo_gestor === 'gga' || gestorLogado.tipo_gestor === 'facilitador';
}
function isGerenteRegional(){
  if(!modoGestor || !gestorLogado) return false;
  return gestorLogado.tipo_gestor === 'lider_regional';
}
function getRegionalDoGestorLogado(){
  if(!modoGestor || !gestorLogado) return '';
  return String(gestorLogado.regional_id || '');
}

function isAniversario(e){
  if(!e.perfil || !e.perfil.mes_aniversario) return false;
  var parts = e.perfil.mes_aniversario.split('-');
  var dia = parseInt(parts[0]), mes = parseInt(parts[1]);
  var hoje = new Date();
  return mes === (hoje.getMonth()+1) && dia === hoje.getDate();
}

// Retorna data local YYYY-MM-DD (evita bug do UTC durante o dia)
function hojeLocalYMD(){
  var d = new Date();
  var y = d.getFullYear();
  var m = String(d.getMonth()+1).padStart(2,'0');
  var dia = String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+dia;
}

function ymdLocal(d){
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

function inicioSemanaAtualYMD(){
  if(window.nextuberProduction) return window.nextuberProduction.getWeekStartYmd();
  var d = new Date();
  var dia = d.getDay();
  var ajuste = dia === 0 ? -6 : 1-dia;
  d.setDate(d.getDate()+ajuste);
  return ymdLocal(d);
}

function sextaDaSemanaAtualYMD(){
  var d = new Date();
  var dia = d.getDay();
  var ajuste = dia === 0 ? -2 : 5-dia;
  d.setDate(d.getDate()+ajuste);
  return ymdLocal(d);
}

function getPrazoProducaoAtual(){
  var cfg = (typeof S !== 'undefined' && S.cfg) || {};
  if(window.nextuberProduction) return window.nextuberProduction.getCurrentDeadline(cfg);
  var semanaAtual = typeof inicioSemanaAtualYMD === 'function' ? inicioSemanaAtualYMD() : '';
  if(cfg.prazo_producao_manual && cfg.prazo_producao_manual_semana === semanaAtual){
    return cfg.prazo_producao_manual;
  }
  return typeof sextaDaSemanaAtualYMD === 'function' ? sextaDaSemanaAtualYMD() : null;
}
if(typeof window !== 'undefined') window.getPrazoProducaoAtual = getPrazoProducaoAtual;

function producaoConfirmadaNoPrazo(e, prazo){
  return !!(e.perfil && e.perfil.producao_verificada_prazo === prazo);
}

function registrarProducaoVerificada(e){
  if(window.nextuberProduction){
    var verificacao = window.nextuberProduction.markVerified(e.perfil || {}, S.cfg || {});
    e.perfil = verificacao.profile;
    return verificacao.confirmed;
  }
  var prazo = getPrazoProducaoAtual();
  var hoje = hojeLocalYMD();
  if(!e.perfil) e.perfil = {};
  e.perfil.ultima_atualizacao_prod = hoje;
  if(hoje > prazo) return false;
  e.perfil.producao_verificada_prazo = prazo;
  return true;
}

function statusAtualizacao(e){
  if(window.nextuberProduction){
    return window.nextuberProduction.getUpdateStatus(e.perfil || {}, S.cfg || {});
  }
  var prazo = getPrazoProducaoAtual();
  var hoje = hojeLocalYMD();
  // Cada sexta-feira é um ciclo novo: a confirmação de uma semana não libera a próxima.
  if(producaoConfirmadaNoPrazo(e, prazo)) return 'ok';
  // Calcular dias até o prazo (comparação por string de data)
  var prazoDt = new Date(prazo+'T00:00:00');
  var hojeDt = new Date(hoje+'T00:00:00');
  var diffDias = Math.round((prazoDt - hojeDt) / 86400000);
  if(diffDias <= 0) return 'atrasado'; // na sexta e depois dela, mantém vermelho até atualizar
  return 'alerta'; // permanece amarelo enquanto a semana não for confirmada
}



function renderOverviewHeader(){
  var meses = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  var dias = ['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
  var d = new Date();
  var hoje = dias[d.getDay()]+', '+d.getDate()+' de '+meses[d.getMonth()]+' de '+d.getFullYear();
  var hojeEl = document.getElementById('ovHoje');
  if(hojeEl) hojeEl.textContent = hoje.charAt(0).toUpperCase()+hoje.slice(1);
  var triEl = document.getElementById('ovTri');
  if(triEl) triEl.textContent = fmtTrimestre(trimestreRef());
}

function isMonthlyChecklistWindow(){
  var now = new Date();
  var lastDay = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  return now.getDate() >= lastDay - 6;
}

function checklistUpdatedThisMonth(value){
  if(!value) return false;
  var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
  var now = new Date();
  if(match) return Number(match[1]) === now.getFullYear() && Number(match[2]) === now.getMonth()+1;
  var parsed = new Date(value);
  return !isNaN(parsed.getTime()) && parsed.getFullYear() === now.getFullYear() && parsed.getMonth() === now.getMonth();
}

function getMonthlyChecklistPending(){
  if(!modoGestor || !gestorLogado || !isMonthlyChecklistWindow()) return [];
  if(S.monthlyChecklist && S.monthlyChecklist.enabled === false) return [];
  var tipo = String(gestorLogado.tipo_gestor || '').toLowerCase();
  var funcional = String(gestorLogado.funcional || '');
  if((tipo !== 'ga' && tipo !== 'gga') || !funcional) return [];
  return (S.ests || []).filter(function(e){
    var perfil = e.perfil || {};
    var vinculado = tipo === 'gga'
      ? String(perfil.gga_funcional || '') === funcional
      : (String(perfil.ga_funcional || '') === funcional || String(e.gestor_funcional || '') === funcional);
    return vinculado && !checklistUpdatedThisMonth(perfil.ultima_atualizacao_checklist_trilha);
  });
}

function renderMonthlyChecklistReminder(){
  var el = document.getElementById('monthlyChecklistReminder');
  if(!el) return;
  var pendentes = getMonthlyChecklistPending();
  if(!pendentes.length){
    el.style.display = 'none';
    el.innerHTML = '';
    return;
  }
  var total = pendentes.length;
  el.innerHTML = '<div class="monthly-checklist-reminder-head">'
    +'<div><div class="monthly-checklist-reminder-title"><span>☑</span><span>Checklist mensal da trilha</span></div>'
    +'<div class="monthly-checklist-reminder-copy">Estamos na última semana do mês. Atualize o checklist dos seus estagiários pendentes.</div></div>'
    +'<span class="monthly-checklist-reminder-count">'+total+' '+(total===1?'pendente':'pendentes')+'</span></div>'
    +'<div class="monthly-checklist-reminder-list">'
    +pendentes.map(function(e){ return '<button class="monthly-checklist-student" data-monthly-checklist-id="'+escapeAttr(e.id)+'">'+escapeHtml(e.nome)+' →</button>'; }).join('')
    +'</div>';
  el.style.display = 'block';
  el.querySelectorAll('[data-monthly-checklist-id]').forEach(function(button){
    button.addEventListener('click', function(){ openPanelById(this.dataset.monthlyChecklistId); });
  });
}

function renderProductionAuditHistory(){
  var el = document.getElementById('cfgProductionAuditHistory');
  if(!el) return;
  renderProductionAuditRegionalFilter();
  var selectedRegionalId = getProductionAuditRegionalId();
  var activeStudentIds = new Set((S.ests || []).map(function(student){ return String(student.id); }));
  var history = (S.productionAuditHistory || []).map(function(entry){
    var pending = (Array.isArray(entry && entry.pending) ? entry.pending : []).filter(function(student){
      return student && activeStudentIds.has(String(student.id));
    });
    if(selectedRegionalId && selectedRegionalId !== 'all'){
      pending = pending.filter(function(student){
        return String(student && student.regionalId || '') === String(selectedRegionalId);
      });
    }
    return Object.assign({}, entry, {pending:pending});
  }).filter(function(entry){
    return entry && Array.isArray(entry.pending) && entry.pending.length > 0;
  });
  if(!history.length){
    el.innerHTML = '<div class="production-audit-empty">✓ Nenhuma pendência registrada nas semanas encerradas para esta regional.</div>';
    return;
  }
  el.innerHTML = history.map(function(entry){
    var count = entry.pending.length;
    return '<div class="production-audit-week">'
      +'<div class="production-audit-week-summary"><strong>Semana com prazo em '+escapeHtml(fmtDate(entry.deadline))+'</strong>'
      +'<span>'+count+' '+(count===1?'pendente':'pendentes')+'</span></div>'
      +'<div class="production-audit-students">'
      +entry.pending.map(function(student){
        var managers = Array.isArray(student.responsibleManagers) ? student.responsibleManagers : [];
        var managerLabel = managers.length
          ? managers.map(function(manager){ return escapeHtml(manager.nome)+' ('+escapeHtml(manager.tipo)+')'; }).join(', ')
          : 'Gestor não vinculado no cadastro';
        return '<button class="production-audit-student" data-audit-student-id="'+escapeAttr(student.id)+'">'
          +'<span class="production-audit-student-info"><strong>'+escapeHtml(student.nome)+'</strong><small>Responsável: '+managerLabel+'</small></span>'
          +'<span>Ver perfil →</span></button>';
      }).join('')
      +'</div></div>';
  }).join('');
  el.querySelectorAll('[data-audit-student-id]').forEach(function(button){
    button.addEventListener('click', function(){ openPanelById(this.dataset.auditStudentId); });
  });
}

function canFilterProductionAuditByRegional(){
  return !!editor || isGerenteRegional();
}

function getProductionAuditRegionalId(){
  if(!canFilterProductionAuditByRegional()) return getRegionalDoGestorLogado();
  var select = document.getElementById('cfgProductionAuditRegionalSelect');
  if(select && select.value) return select.value;
  return S.selectedRegionalId || 'all';
}

function renderProductionAuditRegionalFilter(){
  var container = document.getElementById('cfgProductionAuditRegionalFilter');
  if(!container) return;
  var regionais = S.regionais || [];
  var regionalId = getProductionAuditRegionalId();
  var regional = regionais.find(function(item){ return String(item.id) === String(regionalId); });

  if(!canFilterProductionAuditByRegional()){
    container.innerHTML = '<span class="production-audit-regional-context">Regional: '+escapeHtml(regional ? regional.nome : 'não definida')+'</span>';
    return;
  }

  var previous = container.querySelector('#cfgProductionAuditRegionalSelect');
  var currentValue = previous && previous.value ? previous.value : regionalId;
  var select = document.createElement('select');
  select.id = 'cfgProductionAuditRegionalSelect';
  select.className = 'production-audit-regional-filter';
  select.setAttribute('aria-label', 'Filtrar histórico de pendências por regional');
  if(editor){
    var allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'Todas as regionais';
    select.appendChild(allOption);
  }
  regionais.forEach(function(item){
    var option = document.createElement('option');
    option.value = String(item.id);
    option.textContent = item.nome;
    select.appendChild(option);
  });
  var hasCurrent = Array.from(select.options).some(function(option){ return option.value === String(currentValue); });
  select.value = hasCurrent ? String(currentValue) : (editor ? 'all' : (regionais[0] && String(regionais[0].id)) || '');
  select.onchange = function(){ renderProductionAuditHistory(); };
  container.innerHTML = '';
  container.appendChild(select);
}

function renderOverviewKpis(){
  var el = document.getElementById('overviewKpis');
  if(!el) return;
  // Filtrar estagiários conforme regional ativa e permissões
  var baseList = (typeof getEstagiariosAtivos === 'function') ? getEstagiariosAtivos() : S.ests;
  var lista = baseList;
  if(modoGestor && gestorLogado){
    var p = gestorLogado.permissoes || {};
    if(!p.todos_estagiarios && !isGGA() && !isGerenteRegional()){
      lista = baseList.filter(function(e){ return e.perfil && (e.perfil.ga_funcional === gestorLogado.funcional || e.perfil.gga_funcional === gestorLogado.funcional); });
    }
  }
  // Calcular contagens
  var totalEst = lista.length;
  var totalProducao = 0;
  var tri = trimestreRef();
  var totalEquilibrio = 0;
  var totalSeguros = 0;
  var totalPIC = 0;
  var totalCombinaqui = 0;
  var totalEngajamento = 0;

  lista.forEach(function(e){
    var p = getProducaoTri(e.id, tri);
    totalProducao += parseFloat(p.producao)||0;
    // Equilíbrio = soma de INSS, OP, EP, Creditário (4 modalidades)
    totalEquilibrio += getTotalTrimestreModalidades(e.id, tri);
    // Outros produtos (índices: 0=Seguros, 1=PIC, 2=Combinaqui)
    totalSeguros    += getTotalTrimestreOutroProduto(e.id, tri, 0);
    totalPIC        += getTotalTrimestreOutroProduto(e.id, tri, 1);
    totalCombinaqui += getTotalTrimestreOutroProduto(e.id, tri, 2);
    totalEngajamento += getTotalTrimestreOutroProduto(e.id, tri, 3);
  });

  var porTrilha = {iniciante:0, intermediario:0, avancado:0};
  lista.forEach(function(e){
      var k = getEffectiveTrilhaKey(e);
      if(k) porTrilha[k]++;
  });

  var cards = [
    {label:'Estagiários ativos', valor:totalEst, cor:'var(--ink)', bg:'var(--bg)'},
    {label:'Produção do trimestre', valor:fmtMilhar(totalProducao), cor:'#16A34A', bg:'#DCFCE7'},
    {label:'Seguros', valor:fmtMilhar(totalSeguros), cor:'#8B5CF6', bg:'#EDE9FE'},
    {label:'PIC', valor:fmtMilhar(totalPIC), cor:'#06B6D4', bg:'#CFFAFE'},
    {label:'Combinaqui', valor:fmtMilhar(totalCombinaqui), cor:'#F97316', bg:'#FFEDD5'},
    {label:'Engajamento', valor:fmtMilhar(totalEngajamento), cor:'#EC4899', bg:'#FCE7F3'}
  ];

  el.innerHTML = cards.map(function(c){
    return '<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r2);padding:16px 18px;">'
      +'<div style="font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--ink3);margin-bottom:6px;">'+c.label+'</div>'
      +'<div style="font-size:22px;font-weight:600;color:'+c.cor+';">'+c.valor+'</div>'
      +'</div>';
  }).join('');
}

function renderOverviewTrilhaChart(){
  var el = document.getElementById('overviewTrilhaChart');
  if(!el) return;
  var baseList = (typeof getEstagiariosAtivos === 'function') ? getEstagiariosAtivos() : S.ests;
  var lista = baseList;
  if(modoGestor && gestorLogado){
    var p = gestorLogado.permissoes || {};
    if(!p.todos_estagiarios && !isGGA() && !isGerenteRegional()){
      lista = baseList.filter(function(e){ return e.perfil && (e.perfil.ga_funcional === gestorLogado.funcional || e.perfil.gga_funcional === gestorLogado.funcional); });
    }
  }
  var counts = {iniciante:0, intermediario:0, avancado:0};
  lista.forEach(function(e){
      var k = getEffectiveTrilhaKey(e);
      if(k) counts[k]++;
  });
  var total = counts.iniciante + counts.intermediario + counts.avancado;
  if(total === 0){
    el.innerHTML = '<div style="font-size:13px;color:var(--ink3);font-style:italic;padding:4px 0;">Sem dados para exibir. Cadastre estagiários com data de início.</div>';
    return;
  }
  var bars = [
    {key:'iniciante', label:'Decolar (0-90d)', cor:'#EC7000', bg:'#FFF3E8', n:counts.iniciante},
    {key:'intermediario', label:'Evoluir (91-180d)', cor:'#B45309', bg:'#FEF3C7', n:counts.intermediario},
    {key:'avancado', label:'Impactar (+181d)', cor:'#166534', bg:'#DCFCE7', n:counts.avancado}
  ];
  el.innerHTML = '<div style="display:flex;flex-direction:column;gap:10px;">'
    +bars.map(function(b){
      var pct = total>0 ? Math.round(b.n/total*100) : 0;
      return '<div>'
        +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">'
          +'<span style="font-size:12.5px;color:var(--ink2);font-weight:500;">'+b.label+'</span>'
          +'<span style="font-size:11px;font-weight:600;color:'+b.cor+';">'+b.n+' '+(b.n===1?'estagiário':'estagiários')+' · '+pct+'%</span>'
        +'</div>'
        +'<div style="height:10px;background:'+b.bg+';border-radius:5px;overflow:hidden;">'
          +'<div style="width:'+pct+'%;height:100%;background:'+b.cor+';transition:width .4s;"></div>'
        +'</div>'
      +'</div>';
    }).join('')
  +'</div>';
}

function renderEncontros(){
  var el = document.getElementById('encontrosList');
  var addBtn = document.getElementById('btnAddEncontro');
  if(!el) return;
  if(addBtn) addBtn.style.display = editor ? 'inline-flex' : 'none';

  // Filtrar só futuros (ou hoje)
  var hoje = new Date().toISOString().split('T')[0];
  var lista = (S.encontros||[]).filter(function(e){ return e.data >= hoje; });
  if(!lista.length){
    el.innerHTML = '<div style="font-size:13px;color:var(--ink3);font-style:italic;padding:8px 0 4px;">Nenhum encontro agendado.</div>';
    return;
  }
  el.innerHTML = lista.map(function(enc){
    var d = new Date(enc.data + 'T12:00:00');
    var dia = d.getDate();
    var mes = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'][d.getMonth()];
    return '<div style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--border);">'
      +'<div style="flex-shrink:0;width:48px;text-align:center;background:var(--or-l);border-radius:8px;padding:6px 0;">'
        +'<div style="font-size:10px;font-weight:700;color:var(--or-d);letter-spacing:.05em;">'+mes+'</div>'
        +'<div style="font-size:18px;font-weight:600;color:var(--or);line-height:1;">'+dia+'</div>'
      +'</div>'
      +'<div style="flex:1;min-width:0;">'
        +'<div style="font-size:13.5px;font-weight:500;color:var(--ink);">'+escapeHtml(enc.titulo)+'</div>'
        +(enc.descricao?'<div style="font-size:12px;color:var(--ink3);margin-top:2px;">'+escapeHtml(enc.descricao)+'</div>':'')
      +'</div>'
      +(editor?'<button style="background:none;border:none;font-size:14px;color:var(--ink3);cursor:pointer;flex-shrink:0;" data-delenc="'+escapeAttr(enc.id)+'">✕</button>':'')
    +'</div>';
  }).join('');
  el.querySelectorAll('[data-delenc]').forEach(function(btn){
    btn.addEventListener('click', async function(){
      var id = this.dataset.delenc;
      if(!confirm('Excluir este encontro?')) return;
      if(!window.nextuberMutations) throw new Error('Serviço de encontros indisponível.');
      await window.nextuberMutations.deleteMeeting(String(id));
      S.encontros = S.encontros.filter(function(e){ return e.id !== id; });
      renderEncontros();
    });
  });
}

function renderOverviewAll(){
  renderOverviewHeader();
  renderMonthlyChecklistReminder();

  var isAuthed = !!(editor || modoGestor);

  // Barra de seleção de regional: só exibe se logado
  var regBar = document.getElementById('regionalSelectorBar');
  if(regBar) regBar.style.display = isAuthed ? 'flex' : 'none';

  // Oculta o botão 'Ver mais' do banner antes do login para manter descrição expandida
  var btnVerMais = document.getElementById('btnVerMaisProjeto');
  if(btnVerMais) btnVerMais.style.display = isAuthed ? 'inline-block' : 'none';

  // KPIs da regional: só exibe se logado
  var kpisSection = document.getElementById('overviewKpisSection');
  if(kpisSection) kpisSection.style.display = isAuthed ? 'block' : 'none';
  if(isAuthed) renderOverviewKpis();

  // Gráfico de distribuição por trilha: só exibe se logado
  var trilhaCard = document.getElementById('overviewTrilhaCard');
  if(trilhaCard) trilhaCard.style.display = isAuthed ? 'block' : 'none';
  if(isAuthed) renderOverviewTrilhaChart();

  // Card de encontros: só exibe se logado
  var cardEnc = document.getElementById('cardEncontros');
  if(cardEnc) cardEnc.style.display = isAuthed ? 'block' : 'none';
  if(isAuthed) renderEncontros();

  // Conteúdo institucional público (descrição expandida + notícias de crédito Itaú): só exibe ANTES do login
  var publicContent = document.getElementById('overviewPublicContent');
  if(publicContent) publicContent.style.display = isAuthed ? 'none' : 'block';
}

function getPercentualAlvoRanking(e, tri){
  var prod = getProducaoTri(e.id, tri);
  var alvo = parseFloat(prod.meta) || 0;
  if(alvo <= 0) return 0;

  var totalModalidades = getTotalTrimestreModalidades(e.id, tri);
  var totalMensalAntigo = getTotalMensal(e.id, tri);
  var totalProduzido = totalModalidades > 0
    ? totalModalidades
    : (totalMensalAntigo > 0 ? totalMensalAntigo : (parseFloat(prod.producao) || 0));

  return (totalProduzido / alvo) * 100;
}


function renderRanking(){
  var card = document.getElementById('cardRanking');
  var podeVer = editor || (modoGestor && gestorLogado && gestorLogado.permissoes && gestorLogado.permissoes.ranking);
  if(card) card.style.display = podeVer ? 'block' : 'none';
  if(!podeVer) return;
  var el = document.getElementById('rankingList');
  if(!el) return;
  var tri = trimestreRef();
  var filtro = (document.getElementById('filtroRanking')||{}).value || 'credito';

  var estsAtivos = (typeof getEstagiariosAtivos === 'function') ? getEstagiariosAtivos() : S.ests;
  var lista = estsAtivos.filter(function(e){ return e.perfil && e.perfil.funcional && e.perfil.inicio; });

  // Mapear filtro para função de valor + config visual
  var configFiltros = {
    credito: {label: 'Crédito total', unidade: '', getValor: function(e){ return getTotalTrimestreModalidades(e.id, tri); }},
    percentual_alvo: {label: 'Percentual do alvo da agência', unidade: '%', isPercentual: true, getValor: function(e){ return getPercentualAlvoRanking(e, tri); }},
    cred_INSS: {label: 'INSS', unidade: '', getValor: function(e){ return getTotalTrimestreModalidade(e.id, tri, 0); }, cor: '#2196F3'},
    cred_OP: {label: 'OP', unidade: '', getValor: function(e){ return getTotalTrimestreModalidade(e.id, tri, 1); }, cor: '#FF9800'},
    cred_EP: {label: 'EP', unidade: '', getValor: function(e){ return getTotalTrimestreModalidade(e.id, tri, 2); }, cor: '#E91E63'},
    cred_Crediario: {label: 'Creditário', unidade: '', getValor: function(e){ return getTotalTrimestreModalidade(e.id, tri, 3); }, cor: '#009688'},
    out_Seguros: {label: 'Seguros', unidade: '', getValor: function(e){ return getTotalTrimestreOutroProduto(e.id, tri, 0); }, cor: '#8B5CF6'},
    out_PIC: {label: 'PIC', unidade: '', getValor: function(e){ return getTotalTrimestreOutroProduto(e.id, tri, 1); }, cor: '#06B6D4'},
    out_Combinaqui: {label: 'Combinaqui', unidade: '', getValor: function(e){ return getTotalTrimestreOutroProduto(e.id, tri, 2); }, cor: '#F97316'},
    out_Engajamento: {label: 'Engajamento', unidade: '', getValor: function(e){ return getTotalTrimestreOutroProduto(e.id, tri, 3); }, cor: '#EC4899'},
    out_Consorcios: {label: 'Consórcios', unidade: '', getValor: function(e){ return getTotalTrimestreOutroProduto(e.id, tri, 4); }, cor: '#10B981'}
  };

  var config = configFiltros[filtro] || configFiltros.credito;

  var ranked = lista.map(function(e){ return {e:e, valor: config.getValor(e)}; })
                    .filter(function(r){ return r.valor > 0; }) // esconde quem não vendeu nada
                    .sort(function(a,b){ return b.valor - a.valor; });

  if(!ranked.length){
    el.innerHTML = '<div style="font-size:13px;color:var(--ink3);font-style:italic;">Nenhum estagiário com resultados de '+config.label+' neste trimestre.</div>';
    return;
  }

  // Valor máximo para calcular barra de progresso proporcional
  var valorMax = ranked[0].valor;

  el.innerHTML = ranked.map(function(r,i){
    var corPos = i===0?'var(--or)':i===1?'var(--ink2)':'var(--ink3)';
    var corBarra = config.isPercentual ? faixaRes(Math.round(r.valor)).cor : (config.cor || corPos);

    var valorDisplay, pct;
    if(config.isPercentual){
      valorDisplay = Math.round(r.valor) + config.unidade;
      pct = Math.min(Math.round(r.valor), 100);
    } else {
      valorDisplay = fmtMilhar(r.valor);
      pct = valorMax > 0 ? Math.round((r.valor / valorMax) * 100) : 0;
    }

    var agStr = (r.e.perfil && r.e.perfil.agencia) ? r.e.perfil.agencia : 'Sem agência';

    return '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);">'
      +'<div style="width:22px;height:22px;border-radius:50%;background:'+(i<2?corPos:'var(--bg)')+';color:'+(i<2?'#fff':'var(--ink3)')+';display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0;">'+(i+1)+'</div>'
      +'<button type="button" class="ranking-student-link" data-ranking-eid="'+escapeAttr(r.e.id)+'" style="border:0;background:none;padding:0;margin:0;font:inherit;color:inherit;text-align:left;cursor:pointer;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'
        +'<span style="font-size:13px;font-weight:500;text-decoration:underline;text-decoration-color:rgba(236,112,0,.35);text-underline-offset:3px;">'+escapeHtml(r.e.nome)+'</span> <span style="font-size:11px;color:var(--ink3);font-weight:400;">(Ag. '+escapeHtml(agStr)+')</span>'
      +'</button>'
      +'<div style="width:80px;height:4px;background:var(--bg);border-radius:2px;overflow:hidden;flex-shrink:0;"><div style="width:'+pct+'%;height:100%;background:'+corBarra+';"></div></div>'
      +'<div style="font-size:13px;font-weight:600;color:'+corBarra+';min-width:60px;text-align:right;flex-shrink:0;">'+valorDisplay+'</div>'
    +'</div>';
  }).join('');

  el.querySelectorAll('.ranking-student-link').forEach(function(link){
    link.addEventListener('click', function(){
      openPanelById(this.dataset.rankingEid);
    });
  });
}

async function salvarSnapshot(eid, tri){
  tri = tri || trimestreRef();
  return salvarProducaoSegura(eid, tri, []);
}

async function loadSnapshotsHistory(eid){
  var el = document.getElementById('pHistoricoTri');
  if(!el) return;
  var r;
  try { r = await window.nextuberReads.snapshots(String(eid)); }
  catch(error){ console.error('Historico trimestral:', error); el.innerHTML = ''; return; }
  var snaps = r.snapshots || [];
  if(!snaps.length){ el.innerHTML = ''; return; }
  el.innerHTML = '<div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);font-weight:500;margin:14px 0 8px;">Histórico trimestral</div>'
    +snaps.map(function(s){
      var pct = s.meta>0 ? Math.round(s.total_producao/s.meta*100) : 0;
      var fr = faixaRes(pct);
      return '<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border);">'
        +'<span style="font-size:11px;color:var(--ink2);min-width:70px;">'+escapeHtml(fmtTrimestre(s.tri_ref))+'</span>'
        +'<div style="flex:1;height:4px;background:var(--bg);border-radius:2px;overflow:hidden;"><div style="width:'+Math.min(pct,100)+'%;height:100%;background:'+fr.cor+';"></div></div>'
        +'<span style="font-size:11px;font-weight:500;color:'+fr.cor+';min-width:42px;text-align:right;">'+(s.meta>0?pct+'%':'—')+'</span>'
        +'<span style="font-size:11px;font-weight:600;min-width:42px;text-align:right;">'+s.score+'/10</span>'
      +'</div>';
    }).join('');
}


function renderAvaliacao(idx){
  var el = document.getElementById('pAvaliacao'); if(el) el.innerHTML = '';
  var elEv = document.getElementById('pEvolucaoChart'); if(elEv) elEv.innerHTML = '';
  renderContatosCard(idx);
}

async function loadEvolucaoChart(eid){
  var el = document.getElementById('pEvolucaoChart');
  if(el) el.innerHTML = '';
}

// ═══════════════════════════════════════
// ═══════════ CONTATOS ═══════════════════
// ═══════════════════════════════════════

// Semana selecionada globalmente (formato: 'YYYY-Www' — número ISO da semana)
var contatosSelectedWeek = null;

// Retorna o ano e número ISO da semana atual (formato "2026-W28")
function getSemanaAtualISO(){
  var hoje = new Date();
  return getSemanaISO(hoje);
}

function getSemanaISO(date){
  var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
  return d.getUTCFullYear() + '-W' + String(weekNo).padStart(2, '0');
}

// Retorna array com as 5 datas úteis (seg-sex) da semana ISO
function getDiasDaSemana(semISO){
  var parts = semISO.split('-W');
  var year = parseInt(parts[0]);
  var week = parseInt(parts[1]);
  // Segunda-feira da semana ISO
  var simple = new Date(year, 0, 1 + (week - 1) * 7);
  var dow = simple.getDay();
  var monday;
  if(dow <= 4){
    monday = new Date(simple.setDate(simple.getDate() - simple.getDay() + 1));
  } else {
    monday = new Date(simple.setDate(simple.getDate() + 8 - simple.getDay()));
  }
  var dias = [];
  for(var i = 0; i < 5; i++){
    var d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dias.push(d);
  }
  return dias;
}

function formatarDiaCurto(d){
  var nomes = ['Dom','Seg','Ter','Qua','Qui','Sex','Sab'];
  return nomes[d.getDay()] + ' ' + String(d.getDate()).padStart(2,'0') + '/' + String(d.getMonth()+1).padStart(2,'0');
}

function getContatoDia(eid, semISO, diaIdx){
  // Salva usando tri_ref: "CONTATO-2026-W28-D0" a D4
  var ref = 'CONTATO-' + semISO + '-D' + diaIdx;
  if(!S.producao) return 0;
  var row = S.producao.find(function(p){ return p.estagiario_id === eid && p.tri_ref === ref; });
  return row ? (parseFloat(row.producao) || 0) : 0;
}

function getMetaContatos(eid){
  var ref = 'CONTATO-META';
  if(!S.producao) return 0;
  var row = S.producao.find(function(p){ return p.estagiario_id === eid && p.tri_ref === ref; });
  return row ? (parseFloat(row.meta) || 0) : 0;
}

// Naviga entre semanas (delta = -1 para anterior, +1 para próxima)
function moverSemana(semISO, delta){
  var dias = getDiasDaSemana(semISO);
  var seg = dias[0];
  seg.setDate(seg.getDate() + delta * 7);
  return getSemanaISO(seg);
}

function labelSemana(semISO){
  var dias = getDiasDaSemana(semISO);
  var d1 = dias[0], d5 = dias[4];
  return String(d1.getDate()).padStart(2,'0')+'/'+String(d1.getMonth()+1).padStart(2,'0')
    +' – '+String(d5.getDate()).padStart(2,'0')+'/'+String(d5.getMonth()+1).padStart(2,'0');
}

function renderContatosCard(idx){
  var el = document.getElementById('pContatos');
  if(!el) return;
  var e = S.ests[idx];

  // Inicializar semana selecionada se necessário
  if(!contatosSelectedWeek) contatosSelectedWeek = getSemanaAtualISO();
  var semanaAtualReal = getSemanaAtualISO();
  var isSemanaAtual = (contatosSelectedWeek === semanaAtualReal);

  var canEdit = (editor || (modoGestor && gestorLogado));
  var meta = getMetaContatos(e.id);
  var metaSemanal = meta * 5; // alvo diário × 5 dias

  var dias = getDiasDaSemana(contatosSelectedWeek);
  var totalSemana = 0;
  for(var d = 0; d < 5; d++){
    totalSemana += getContatoDia(e.id, contatosSelectedWeek, d);
  }
  var pctSemana = metaSemanal > 0 ? Math.min(Math.round(totalSemana/metaSemanal*100), 100) : 0;
  var corProgresso = pctSemana >= 80 ? '#16A34A' : (pctSemana >= 50 ? '#F59E0B' : '#DC2626');

  var h = '<div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:14px;">'
    // Cabeçalho
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px;">'
      +'<div style="display:flex;align-items:center;gap:6px;">'
        +'<span style="font-size:16px;">📞</span>'
        +'<span style="font-size:14px;font-weight:600;color:var(--ink);">Contatos</span>'
      +'</div>'
      +'<div style="display:flex;align-items:center;gap:6px;">'
        +'<button class="btnContSemAnt" style="padding:3px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);cursor:pointer;font-size:11px;color:var(--or);">←</button>'
        +'<div style="text-align:center;min-width:110px;">'
          +'<div style="font-size:11px;font-weight:600;color:var(--ink);">'+labelSemana(contatosSelectedWeek)+'</div>'
          +'<div style="font-size:9px;color:'+(isSemanaAtual?'var(--or)':'var(--ink3)')+';font-weight:'+(isSemanaAtual?'600':'400')+';">'+(isSemanaAtual?'● Semana atual':'Semana anterior')+'</div>'
        +'</div>'
        +'<button class="btnContSemProx" style="padding:3px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);cursor:pointer;font-size:11px;color:var(--or);" '+(isSemanaAtual?'disabled':'')+'>→</button>'
      +'</div>'
    +'</div>'
    // Alvo diário
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding:10px;background:var(--bg);border-radius:8px;">'
      +'<div style="display:flex;flex-direction:column;">'
        +'<span style="font-size:10px;color:var(--ink3);font-weight:600;text-transform:uppercase;letter-spacing:.04em;">Alvo diário</span>'
        +(canEdit
          ? '<input class="fieldContMeta" type="text" value="'+(meta||'')+'" placeholder="0" inputmode="numeric" style="margin-top:4px;padding:4px 8px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:13px;font-weight:600;color:var(--ink);width:80px;background:var(--surface);">'
          : '<span style="margin-top:4px;font-size:13px;font-weight:600;color:var(--ink);">'+(meta||'—')+'</span>')
      +'</div>'
      +'<div style="text-align:right;">'
        +'<span style="font-size:10px;color:var(--ink3);font-weight:600;text-transform:uppercase;letter-spacing:.04em;">Alvo semanal</span>'
        +'<div style="margin-top:4px;font-size:13px;font-weight:600;color:var(--ink2);">'+(metaSemanal||'—')+'</div>'
      +'</div>'
    +'</div>'
    // Barra de progresso
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">'
      +'<span style="font-size:11px;color:var(--ink2);">Total da semana</span>'
      +'<span style="font-size:12px;font-weight:600;color:'+corProgresso+';">'+totalSemana+(metaSemanal>0?' / '+metaSemanal+' ('+pctSemana+'%)':'')+'</span>'
    +'</div>'
    +'<div style="height:4px;background:var(--bg);border-radius:2px;overflow:hidden;margin-bottom:14px;"><div style="width:'+pctSemana+'%;height:100%;background:'+corProgresso+';"></div></div>'
    // Grade dos 5 dias
    +'<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;">';

  for(var i = 0; i < 5; i++){
    var val = getContatoDia(e.id, contatosSelectedWeek, i);
    var atingiu = meta > 0 && val >= meta;
    var borderCor = atingiu ? '#16A34A' : 'var(--border)';
    var bgCor = atingiu ? '#DCFCE7' : 'var(--surface)';
    var inputDis = !canEdit ? 'disabled' : '';

    h += '<div style="border:1px solid '+borderCor+';border-radius:6px;padding:6px;background:'+bgCor+';">'
      +'<div style="font-size:9px;color:var(--ink3);text-transform:uppercase;letter-spacing:.04em;font-weight:600;text-align:center;margin-bottom:4px;">'+formatarDiaCurto(dias[i])+'</div>'
      +'<input class="fieldContDia" data-dia="'+i+'" type="text" value="'+(val||'')+'" placeholder="0" inputmode="numeric" '+inputDis+' '
      +'style="width:100%;padding:4px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:13px;font-weight:600;text-align:center;color:'+(atingiu?'#16A34A':'var(--ink)')+';background:var(--surface);'+(inputDis?'opacity:.6;cursor:not-allowed;':'')+'">'
      +'</div>';
  }

  h += '</div>';

  // Botão salvar
  if(canEdit){
    h += '<div style="display:flex;align-items:center;gap:8px;margin-top:12px;">'
      +'<button class="btn-obs" id="btnSalvarContatos" style="font-size:12px;padding:6px 14px;">Salvar</button>'
      +'<span class="obs-saved" id="contatosSaved">✓ Salvo</span>'
      +'</div>';
  }

  h += '</div>';

  el.innerHTML = h;

  // Listeners de navegação
  var btnAnt = el.querySelector('.btnContSemAnt');
  if(btnAnt) btnAnt.addEventListener('click', function(){
    contatosSelectedWeek = moverSemana(contatosSelectedWeek, -1);
    renderContatosCard(idx);
  });
  var btnProx = el.querySelector('.btnContSemProx');
  if(btnProx){
    btnProx.style.opacity = isSemanaAtual ? '0.5' : '1';
    btnProx.addEventListener('click', function(){
      if(isSemanaAtual) return;
      contatosSelectedWeek = moverSemana(contatosSelectedWeek, 1);
      renderContatosCard(idx);
    });
  }

  // Listeners de input (só números)
  el.querySelectorAll('.fieldContDia').forEach(function(inp){
    inp.addEventListener('input', function(){
      this.value = this.value.replace(/[^0-9]/g,'').slice(0,4);
    });
  });
  var mIn = el.querySelector('.fieldContMeta');
  if(mIn) mIn.addEventListener('input', function(){
    this.value = this.value.replace(/[^0-9]/g,'').slice(0,4);
  });

  // Salvar
  var btnSv = document.getElementById('btnSalvarContatos');
  if(btnSv) btnSv.addEventListener('click', async function(){
    btnSv.disabled = true;
    btnSv.textContent = 'Salvando...';
    try {
      if(!window.nextuberProduction) throw new Error('Serviço de contatos indisponível.');
      var novaMeta = parseInt((el.querySelector('.fieldContMeta')||{}).value) || 0;
      var inputs = el.querySelectorAll('.fieldContDia');
      var days = [];
      for(var i = 0; i < inputs.length; i++){
        days.push({
          dayIndex:parseInt(inputs[i].getAttribute('data-dia')),
          value:parseInt(inputs[i].value) || 0
        });
      }
      var result = await window.nextuberProduction.saveContacts({
        studentId:String(e.id),
        weekRef:contatosSelectedWeek,
        dailyTarget:novaMeta,
        days:days
      });
      var sid = String(e.id);
      var refsSalvas = {};
      (result.contactRows || []).forEach(function(row){ refsSalvas[row.tri_ref] = true; });
      S.producao = (S.producao || []).filter(function(row){
        return !(String(row.estagiario_id) === sid && refsSalvas[row.tri_ref]);
      }).concat(result.contactRows || []);
      e.perfil = result.profile;

      renderContatosCard(idx);
      renderCards();
      var sv = document.getElementById('contatosSaved');
      if(sv){ sv.classList.add('show'); setTimeout(function(){ sv.classList.remove('show'); }, 2000); }
    } catch(error) {
      console.error('Salvar contatos:', error);
      alert((error && error.message) || 'Não foi possível salvar os contatos.');
      btnSv.disabled = false;
      btnSv.textContent = 'Salvar';
    }
  });
}

// ── MODALIDADES ──
var MODALIDADES = ['INSS', 'OP', 'EP', 'Creditário'];
var CORES_MODALIDADES = {
  'INSS': '#2196F3',
  'OP': '#FF9800',
  'EP': '#E91E63',
  'Creditário': '#009688'
};

// ── OUTROS PRODUTOS ──
// A posição faz parte da chave persistida de produção (OUT0 a OUT4).
// Engajamento é OUT3 e Consórcios é OUT4; não inverter sem migrar os dados já gravados.
var OUTROS_PRODUTOS = ['Seguros', 'PIC', 'Combinaqui', 'Engajamento', 'Consórcios'];
var CORES_OUTROS = {
  'Seguros': '#8B5CF6',
  'PIC': '#06B6D4',
  'Combinaqui': '#F97316',
  'Consórcios': '#10B981',
  'Engajamento': '#EC4899'
};

function getProducaoOutroProduto(eid, tri, mesIdx, semanaIdx, prodIdx){
  var ref = tri + '-M' + mesIdx + '-S' + semanaIdx + '-OUT' + prodIdx;
  if(!S.producao) return 0;
  var est = S.ests.find(function(x){ return String(x.id) === String(eid); });
  var func = est && est.perfil && est.perfil.funcional ? String(est.perfil.funcional) : null;
  var row = S.producao.find(function(p){
    var matchId = String(p.estagiario_id) === String(eid) || (func && String(p.estagiario_id) === func);
    return matchId && p.tri_ref === ref;
  });
  return row ? (parseFloat(row.producao) || 0) : 0;
}

async function saveProducaoOutroProduto(eid, tri, mesIdx, semanaIdx, prodIdx, valor){
  var ref = tri + '-M' + mesIdx + '-S' + semanaIdx + '-OUT' + prodIdx;
  return salvarProducaoSegura(eid, tri, [{ref:ref, value:parseFloat(valor)||0}]);
}

// Total de um produto em uma semana (soma todos os prodIdx da semana)
function getTotalSemanaOutros(eid, tri, mesIdx, semanaIdx){
  var total = 0;
  for(var p = 0; p < OUTROS_PRODUTOS.length; p++){
    total += getProducaoOutroProduto(eid, tri, mesIdx, semanaIdx, p);
  }
  return total;
}

// Total de um produto no mês (soma as semanas disponíveis)
function getTotalMesOutroProduto(eid, tri, mesIdx, prodIdx){
  var total = 0;
  for(var s = 1; s <= quantidadeSemanasMes(tri, mesIdx); s++){
    total += getProducaoOutroProduto(eid, tri, mesIdx, s, prodIdx);
  }
  return total;
}

function getTotalMesOutros(eid, tri, mesIdx){
  var total = 0;
  for(var s = 1; s <= quantidadeSemanasMes(tri, mesIdx); s++){
    total += getTotalSemanaOutros(eid, tri, mesIdx, s);
  }
  return total;
}

function getTotalTrimestreOutros(eid, tri){
  var total = 0;
  for(var mi = 1; mi <= 3; mi++){
    total += getTotalMesOutros(eid, tri, mi);
  }
  return total;
}

function getTotalTrimestreOutroProduto(eid, tri, prodIdx){
  var total = 0;
  for(var mi = 1; mi <= 3; mi++){
    total += getTotalMesOutroProduto(eid, tri, mi, prodIdx);
  }
  return total;
}

// Pega o valor produzido de uma semana específica para uma modalidade
function getProducaoSemanalModalidade(eid, tri, mesIdx, semIdx, modIdx){
  var ref = tri + '-M' + mesIdx + '-S' + semIdx + '-MOD' + modIdx;
  if(!S.producao) return 0;
  var est = S.ests.find(function(x){ return String(x.id) === String(eid); });
  var func = est && est.perfil && est.perfil.funcional ? String(est.perfil.funcional) : null;
  var row = S.producao.find(function(p){
    var matchId = String(p.estagiario_id) === String(eid) || (func && String(p.estagiario_id) === func);
    return matchId && p.tri_ref === ref;
  });
  return row ? (parseFloat(row.producao) || 0) : 0;
}

// Salva o valor produzido de uma semana específica para uma modalidade
async function saveProducaoSemanalModalidade(eid, tri, mesIdx, semIdx, modIdx, valor){
  var ref = tri + '-M' + mesIdx + '-S' + semIdx + '-MOD' + modIdx;
  return salvarProducaoSegura(eid, tri, [{ref:ref, value:parseFloat(valor)||0}]);
}

// Soma de uma semana (todas as 4 modalidades)
function getTotalSemanaModalidades(eid, tri, mesIdx, semIdx){
  var total = 0;
  for(var m = 0; m < 4; m++){
    total += getProducaoSemanalModalidade(eid, tri, mesIdx, semIdx, m);
  }
  return total;
}

// Soma do mês (todas as semanas, todas as modalidades)
function getTotalMesModalidades(eid, tri, mesIdx){
  var total = 0;
  for(var s = 1; s <= quantidadeSemanasMes(tri, mesIdx); s++){
    total += getTotalSemanaModalidades(eid, tri, mesIdx, s);
  }
  return total;
}

// Soma total do trimestre por modalidade específica
function getTotalTrimestreModalidade(eid, tri, modIdx){
  var total = 0;
  for(var mi = 1; mi <= 3; mi++){
    for(var s = 1; s <= quantidadeSemanasMes(tri, mi); s++){
      total += getProducaoSemanalModalidade(eid, tri, mi, s, modIdx);
    }
  }
  return total;
}

// Soma total do trimestre (todas as modalidades)
function getTotalTrimestreModalidades(eid, tri){
  var total = 0;
  for(var m = 0; m < 4; m++){
    total += getTotalTrimestreModalidade(eid, tri, m);
  }
  return total;
}

function abrirResultadosReact(idx, tri){
  if(!window.nextuberTracking) return false;
  var e = S.ests[idx];
  if(!e) return false;
  var func = e.perfil && e.perfil.funcional ? String(e.perfil.funcional) : null;
  window.nextuberTracking.open({
    student: { id: String(e.id), name: String(e.nome || '') },
    quarterRef: tri,
    productionRows: (S.producao || []).filter(function(p){
      var matchId = String(p.estagiario_id) === String(e.id) || (func && String(p.estagiario_id) === func);
      return matchId && String(p.tri_ref || '').indexOf(tri) === 0;
    }),
    canEdit: !!(editor || (modoGestor && gestorLogado))
  });
  return true;
}

window.addEventListener('nextuber:production-saved', function(event){
  var detail = event && event.detail;
  if(!detail || !detail.studentId || !detail.quarterRef || !Array.isArray(detail.productionRows)) return;
  var est = S.ests.find(function(item){ return String(item.id) === String(detail.studentId); });
  var func = est && est.perfil && est.perfil.funcional ? String(est.perfil.funcional) : null;

  S.producao = (S.producao || []).filter(function(row){
    var matchId = String(row.estagiario_id) === String(detail.studentId) || (func && String(row.estagiario_id) === func);
    return !(matchId && String(row.tri_ref || '').indexOf(detail.quarterRef) === 0);
  }).concat(detail.productionRows);

  if(est && detail.profile) est.perfil = detail.profile;
  updateMetrics();
  renderCards();
  renderOverviewAll();
  renderRanking();
});

function renderResultados(idx){
  var el = document.getElementById('pResultados');
  var sel = document.getElementById('pTriSelect');
  if(!el || !sel) return;
  var e = S.ests[idx];
  var tris = ultimosTrimestres();
  var tri = trimestreRef();
  sel.innerHTML = tris.map(function(t){return '<option value="'+t+'"'+(t===tri?' selected':'')+'>'+fmtTrimestre(t)+'</option>';}).join('');
  sel.onchange = function(){
    if(!abrirResultadosReact(idx, this.value)){
      renderResultadosForTri(idx, this.value);
    }
  };
  if(!abrirResultadosReact(idx, tri)){
    renderResultadosForTri(idx, tri);
  }
}

function renderResultadosForTri(idx, tri){
  var el = document.getElementById('pResultados'); if(!el) return;
  var e = S.ests[idx];
  // renderizar interface nativa 1:1 Pixel-Perfect no painel lateral do estagiario
  var prod = getProducaoTri(e.id, tri);
  var meta = parseFloat(prod.meta)||0;
  var meses = getMesesTrimestre(tri);

  // Detectar mês vigente
  var mesVigenteNoTri = getMesVigenteEmTrimestre(tri);

  // Se pSelectedMesIdx nunca foi inicializado, usar mês vigente
  if(pSelectedMesIdx === undefined || pSelectedMesIdx < 1 || pSelectedMesIdx > 3){
    pSelectedMesIdx = mesVigenteNoTri;
  }

  var mesIdx = pSelectedMesIdx; // Mês selecionado para exibição (1, 2 ou 3)
  var mesNome = meses[mesIdx-1].nome;
  var numSemanasMes = quantidadeSemanasMes(tri, mesIdx);
  var totalMes = getTotalMesModalidades(e.id, tri, mesIdx);

  // Verificar se mês está fechado
  var fechado = true;
  for(var s = 1; s <= numSemanasMes; s++){
    if(getTotalSemanaModalidades(e.id, tri, mesIdx, s) === 0){ fechado = false; break; }
  }

  var isVigente = (mesIdx === mesVigenteNoTri);
  var canEdit = (editor || (modoGestor && gestorLogado)); // Todos os meses editáveis

  // Total produzido (compatibilidade)
  var totalModalidades = getTotalTrimestreModalidades(e.id, tri);
  var totalMensalAntigo = getTotalMensal(e.id, tri);
  var totalProd = totalModalidades > 0 ? totalModalidades : (totalMensalAntigo > 0 ? totalMensalAntigo : (parseFloat(prod.producao)||0));
  var pct = meta>0 ? Math.round(Math.min(totalProd/meta, 1)*100) : 0;
  var fr = faixaRes(pct);

  // KPI cards
  var h = '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px;">'
    +'<div style="background:var(--bg);border-radius:var(--r2);padding:10px;text-align:center;"><div style="font-size:9px;color:var(--ink3);margin-bottom:3px;">Alvo trimestral</div><div style="font-size:14px;font-weight:500;">'+fmtMilhar(meta)+'</div></div>'
    +'<div style="background:var(--bg);border-radius:var(--r2);padding:10px;text-align:center;"><div style="font-size:9px;color:var(--ink3);margin-bottom:3px;">Total produzido</div><div style="font-size:14px;font-weight:500;color:'+(totalProd>0?fr.cor:'var(--ink3)')+';">'+fmtMilhar(totalProd)+'</div></div>'
    +'<div style="background:'+fr.bg+';border-radius:var(--r2);padding:10px;text-align:center;"><div style="font-size:9px;color:'+fr.cor+';margin-bottom:3px;">Atingido</div><div style="font-size:14px;font-weight:500;color:'+fr.cor+';">'+(meta>0?pct+'%':'—')+'</div></div>'
    +'</div>'
    +'<div style="height:5px;background:var(--bg);border-radius:3px;overflow:hidden;margin-bottom:14px;"><div style="width:'+Math.min(pct,100)+'%;height:100%;background:'+fr.cor+';"></div></div>';

  // Navegação de meses + Indicador de mês vigente
  h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;gap:10px;">'
    +'<button id="btnMesAnterior" style="padding:6px 12px;border:1px solid var(--border);border-radius:6px;background:var(--surface);cursor:pointer;font-size:12px;font-weight:500;color:var(--or);">← Anterior</button>'
    +'<div style="text-align:center;flex:1;">'
      +'<div style="font-size:16px;font-weight:700;color:var(--ink);">'+mesNome+'</div>'
      +'<div style="font-size:11px;color:var(--ink3);margin-top:2px;">'
        +(isVigente ? '<span style="background:#FEF3C7;color:#92400E;padding:2px 8px;border-radius:12px;font-weight:600;">● Mês vigente</span>'
                   : '')
      +'</div>'
    +'</div>'
    +'<button id="btnMesProximo" style="padding:6px 12px;border:1px solid var(--border);border-radius:6px;background:var(--surface);cursor:pointer;font-size:12px;font-weight:500;color:var(--or);">Próximo →</button>'
    +'</div>';

  // Campo de alvo (apenas se for mês vigente)
  if(canEdit){
    h += '<div class="field-grp" style="margin-bottom:14px;"><div class="field-lbl">Alvo do trimestre</div><input class="field-in" type="text" id="pMetaInput" value="'+(meta?fmtMilhar(meta):'')+'" placeholder="0" inputmode="numeric" style="font-size:13px;"></div>';
  }

  // Card do mês
  var mesCorFundo = 'var(--bg)';
  var mesCorBorda = 'var(--border)';
  var mesStatus = isVigente ? '<span style="color:var(--or);font-size:10px;font-weight:600;">● Mês vigente</span>'
                             : '<span style="color:var(--or);font-size:10px;font-weight:600;">✎ Editável</span>';

  h += '<div style="border:1px solid '+mesCorBorda+';border-radius:10px;padding:12px;background:'+mesCorFundo+';margin-bottom:10px;">'
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'
      +'<span style="font-size:13px;font-weight:700;color:var(--ink);text-transform:uppercase;letter-spacing:.06em;">'+mesNome+' - Modalidades</span>'
      +'<div style="display:flex;align-items:center;gap:8px;">'
        +mesStatus
        +'<span style="font-size:12px;font-weight:600;color:var(--ink2);">Total: '+fmtMilhar(totalMes)+'</span>'
      +'</div>'
    +'</div>'
    +'<div style="overflow-x:auto;">'
    +'<table style="width:100%;border-collapse:collapse;font-size:11px;background:var(--surface);border-radius:6px;overflow:hidden;">'
    +'<thead><tr style="background:var(--bg);">'
    +'<th style="padding:6px 4px;text-align:left;font-size:10px;color:var(--ink3);font-weight:600;text-transform:uppercase;letter-spacing:.04em;border:1px solid var(--border);">Modalidade</th>';
  for(var cabSem = 1; cabSem <= numSemanasMes; cabSem++){
    h += '<th style="padding:6px 4px;font-size:10px;color:var(--ink3);font-weight:600;text-transform:uppercase;border:1px solid var(--border);">Sem '+cabSem+'</th>';
  }
  h += '<th style="padding:6px 4px;font-size:10px;color:var(--ink3);font-weight:600;text-transform:uppercase;border:1px solid var(--border);background:var(--bg);">Total</th>'
    +'</tr></thead>'
    +'<tbody>';

  // Linhas das modalidades
  MODALIDADES.forEach(function(mod, modIdx){
    var totalMod = 0;
    h += '<tr>'
      +'<td style="padding:6px;border:1px solid var(--border);font-weight:600;color:'+CORES_MODALIDADES[mod]+';font-size:11px;">'+mod+'</td>';

    for(var si = 1; si <= numSemanasMes; si++){
      var semVal = getProducaoSemanalModalidade(e.id, tri, mesIdx, si, modIdx);
      totalMod += semVal;
      var inputDisabled = !canEdit ? 'disabled' : '';
      h += '<td style="padding:3px;border:1px solid var(--border);">'
        +'<input class="pModInput" data-mes="'+mesIdx+'" data-sem="'+si+'" data-mod="'+modIdx+'" '
        +'type="text" value="'+(semVal?fmtMilhar(semVal):'')+'" placeholder="0" inputmode="numeric" '+inputDisabled+' '
        +'style="width:100%;padding:4px 5px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:11px;text-align:center;background:var(--surface);'+(inputDisabled?'opacity:.6;cursor:not-allowed;':'')+';">'
        +'</td>';
    }
    h += '<td class="pModTotalMod-'+mesIdx+'-'+modIdx+'" style="padding:6px;border:1px solid var(--border);background:var(--bg);font-weight:600;text-align:center;font-size:11px;">'+fmtMilhar(totalMod)+'</td>'
      +'</tr>';
  });

  // Linha de totais
  h += '<tr style="background:var(--bg);font-weight:700;">'
    +'<td style="padding:6px;border:1px solid var(--border);font-size:10px;text-transform:uppercase;color:var(--ink);letter-spacing:.04em;">Total</td>';
  for(var si2 = 1; si2 <= numSemanasMes; si2++){
    var semTotal = getTotalSemanaModalidades(e.id, tri, mesIdx, si2);
    h += '<td class="pModTotalSem-'+mesIdx+'-'+si2+'" style="padding:6px;border:1px solid var(--border);text-align:center;font-size:11px;">'+fmtMilhar(semTotal)+'</td>';
  }
  h += '<td class="pModTotalMes-'+mesIdx+'" style="padding:6px;border:1px solid var(--border);background:var(--or-l);color:var(--or-d);text-align:center;font-size:12px;font-weight:700;">'+fmtMilhar(totalMes)+'</td>'
    +'</tr>'
    +'</tbody></table></div></div>';

  // Botões de salvar (apenas mês vigente)
  if(canEdit){
    h += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">'
      +'<button class="btn-obs" id="btnSalvarResultado">Salvar</button>'
      +'<span class="obs-saved" id="resultadoSaved">✓ Dados salvos</span>'
      +'</div>';
  }

  // ── OUTROS PRODUTOS (semanal - mesmo formato do crédito) ──
  var totalOutrosMes = getTotalMesOutros(e.id, tri, mesIdx);

  h += '<div style="border:1px solid var(--border);border-radius:10px;padding:12px;background:var(--bg);margin-bottom:14px;margin-top:8px;">'
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">'
      +'<span style="font-size:13px;font-weight:700;color:var(--ink);text-transform:uppercase;letter-spacing:.06em;">'+mesNome+' - Outros Produtos</span>'
      +'<span style="font-size:12px;font-weight:600;color:var(--ink2);">Total: '+fmtMilhar(totalOutrosMes)+'</span>'
    +'</div>'
    +'<div style="overflow-x:auto;">'
    +'<table style="width:100%;border-collapse:collapse;font-size:11px;background:var(--surface);border-radius:6px;overflow:hidden;">'
    +'<thead><tr style="background:var(--bg);">'
    +'<th style="padding:6px 4px;text-align:left;font-size:10px;color:var(--ink3);font-weight:600;text-transform:uppercase;letter-spacing:.04em;border:1px solid var(--border);">Produto</th>';
  for(var cabSemOutro = 1; cabSemOutro <= numSemanasMes; cabSemOutro++){
    h += '<th style="padding:6px 4px;font-size:10px;color:var(--ink3);font-weight:600;text-transform:uppercase;border:1px solid var(--border);">Sem '+cabSemOutro+'</th>';
  }
  h += '<th style="padding:6px 4px;font-size:10px;color:var(--ink3);font-weight:600;text-transform:uppercase;border:1px solid var(--border);background:var(--bg);">Total</th>'
    +'</tr></thead>'
    +'<tbody>';

  OUTROS_PRODUTOS.forEach(function(prod, prodIdx){
    var totalProd = 0;
    h += '<tr>'
      +'<td style="padding:6px;border:1px solid var(--border);font-weight:600;color:'+CORES_OUTROS[prod]+';font-size:11px;">'+prod+'</td>';

    for(var si = 1; si <= numSemanasMes; si++){
      var semVal = getProducaoOutroProduto(e.id, tri, mesIdx, si, prodIdx);
      totalProd += semVal;
      var inputDis = !canEdit ? 'disabled' : '';
      h += '<td style="padding:3px;border:1px solid var(--border);">'
        +'<input class="pOutroInput" data-mes="'+mesIdx+'" data-sem="'+si+'" data-prod="'+prodIdx+'" '
        +'type="text" value="'+(semVal?fmtMilhar(semVal):'')+'" placeholder="0" inputmode="numeric" '+inputDis+' '
        +'style="width:100%;padding:4px 5px;border:1px solid var(--border);border-radius:4px;font-family:inherit;font-size:11px;text-align:center;background:var(--surface);'+(inputDis?'opacity:.6;cursor:not-allowed;':'')+';">'
        +'</td>';
    }
    h += '<td class="pOutroTotalProd-'+mesIdx+'-'+prodIdx+'" style="padding:6px;border:1px solid var(--border);background:var(--bg);font-weight:600;text-align:center;font-size:11px;">'+fmtMilhar(totalProd)+'</td>'
      +'</tr>';
  });

  // Linha de totais por semana
  h += '<tr style="background:var(--bg);font-weight:700;">'
    +'<td style="padding:6px;border:1px solid var(--border);font-size:10px;text-transform:uppercase;color:var(--ink);letter-spacing:.04em;">Total</td>';
  for(var siO = 1; siO <= numSemanasMes; siO++){
    var semTotO = getTotalSemanaOutros(e.id, tri, mesIdx, siO);
    h += '<td class="pOutroTotalSem-'+mesIdx+'-'+siO+'" style="padding:6px;border:1px solid var(--border);text-align:center;font-size:11px;">'+fmtMilhar(semTotO)+'</td>';
  }
  h += '<td class="pOutroTotalMes-'+mesIdx+'" style="padding:6px;border:1px solid var(--border);background:var(--or-l);color:var(--or-d);text-align:center;font-size:12px;font-weight:700;">'+fmtMilhar(totalOutrosMes)+'</td>'
    +'</tr>'
    +'</tbody></table></div></div>';

  h += '<div id="pHistoricoTri"></div>';

  el.innerHTML = h;

  // Listeners de navegação
  var btnAnt = document.getElementById('btnMesAnterior');
  var btnProx = document.getElementById('btnMesProximo');

  if(btnAnt){
    btnAnt.disabled = (mesIdx === 1);
    btnAnt.style.opacity = btnAnt.disabled ? '0.5' : '1';
    btnAnt.addEventListener('click', function(){
      if(mesIdx > 1){
        pSelectedMesIdx = mesIdx - 1;
        renderResultadosForTri(idx, tri);
      }
    });
  }

  if(btnProx){
    btnProx.disabled = (mesIdx === 3);
    btnProx.style.opacity = btnProx.disabled ? '0.5' : '1';
    btnProx.addEventListener('click', function(){
      if(mesIdx < 3){
        pSelectedMesIdx = mesIdx + 1;
        renderResultadosForTri(idx, tri);
      }
    });
  }

  loadSnapshotsHistory(e.id);

  var metaInp = document.getElementById('pMetaInput');
  if(metaInp) metaInp.addEventListener('input', function(){
    var v = this.value.replace(/[^0-9]/g,'');
    this.value = v ? parseInt(v).toLocaleString('pt-BR') : '';
  });

  document.querySelectorAll('.pModInput').forEach(function(inp){
    inp.addEventListener('input', function(){
      var v = this.value.replace(/[^0-9]/g,'');
      this.value = v ? parseInt(v).toLocaleString('pt-BR') : '';
      atualizarTotaisModalidades(idx, tri);
    });
  });

  // Listeners para Outros Produtos (atualiza totais em tempo real)
  document.querySelectorAll('.pOutroInput').forEach(function(inp){
    inp.addEventListener('input', function(){
      var v = this.value.replace(/[^0-9]/g,'');
      this.value = v ? parseInt(v).toLocaleString('pt-BR') : '';
      atualizarTotaisOutrosProdutos(idx, tri);
    });
  });

  var btn = document.getElementById('btnSalvarResultado');
  if(btn){
    btn.addEventListener('click', async function(){
      btn.disabled = true;
      btn.textContent = 'Salvando...';
      try {
        var newMeta = parseMilhar((document.getElementById('pMetaInput')||{}).value)||0;
        var entries = [];
        var modInputs = document.querySelectorAll('.pModInput');
        for(var i = 0; i < modInputs.length; i++){
          var val = parseMilhar(modInputs[i].value) || 0;
          var mesI = parseInt(modInputs[i].getAttribute('data-mes'));
          var semI = parseInt(modInputs[i].getAttribute('data-sem'));
          var modI = parseInt(modInputs[i].getAttribute('data-mod'));
          entries.push({ref:tri+'-M'+mesI+'-S'+semI+'-MOD'+modI, value:val});
        }

        var outroInputs = document.querySelectorAll('.pOutroInput');
        for(var j = 0; j < outroInputs.length; j++){
          var outVal = parseMilhar(outroInputs[j].value) || 0;
          var outMes = parseInt(outroInputs[j].getAttribute('data-mes'));
          var outSem = parseInt(outroInputs[j].getAttribute('data-sem'));
          var outProd = parseInt(outroInputs[j].getAttribute('data-prod'));
          entries.push({ref:tri+'-M'+outMes+'-S'+outSem+'-OUT'+outProd, value:outVal});
        }

        if(!window.nextuberProduction) throw new Error('Serviço de produção indisponível.');
        var saveResult = await window.nextuberProduction.saveBatch({
          studentId:String(e.id),
          quarterRef:tri,
          target:newMeta,
          entries:entries
        });
        aplicarRetornoProducao(e.id, tri, saveResult);

      var sv = document.getElementById('resultadoSaved');

      renderAvaliacao(idx);
      renderCards();
      if(sv){
        sv.classList.add('show');
        setTimeout(function(){ renderResultadosForTri(idx, tri); }, 2000);
      } else {
        renderResultadosForTri(idx, tri);
      }
      } catch(err) {
        console.error('Salvar resultados:', err);
        alert((err && err.message) || 'Os dados não foram salvos. Tente novamente.');
        btn.disabled = false;
        btn.textContent = 'Salvar';
      }
    });
  }
}

// Atualiza totais (semanas, mês, modalidade) enquanto o gestor digita
function atualizarTotaisModalidades(idx, tri){
  var e = S.ests[idx];

  // Coletar todos os valores dos inputs em memória
  var valores = {}; // valores[mesIdx][semIdx][modIdx] = valor
  for(var mi = 1; mi <= 3; mi++){
    valores[mi] = {};
    for(var si = 1; si <= quantidadeSemanasMes(tri, mi); si++){
      valores[mi][si] = {};
      for(var modI = 0; modI < 4; modI++){
        var inp = document.querySelector('.pModInput[data-mes="'+mi+'"][data-sem="'+si+'"][data-mod="'+modI+'"]');
        valores[mi][si][modI] = inp ? (parseMilhar(inp.value)||0) : 0;
      }
    }
  }

  // Atualizar totais por modalidade (por mês)
  for(var mi2 = 1; mi2 <= 3; mi2++){
    for(var modI2 = 0; modI2 < 4; modI2++){
      var totalMod = 0;
      for(var si2 = 1; si2 <= quantidadeSemanasMes(tri, mi2); si2++){
        totalMod += valores[mi2][si2][modI2];
      }
      var elTot = document.querySelector('.pModTotalMod-'+mi2+'-'+modI2);
      if(elTot) elTot.textContent = fmtMilhar(totalMod);
    }
  }

  // Atualizar totais por semana
  for(var mi3 = 1; mi3 <= 3; mi3++){
    for(var si3 = 1; si3 <= quantidadeSemanasMes(tri, mi3); si3++){
      var totalSem = 0;
      for(var modI3 = 0; modI3 < 4; modI3++){
        totalSem += valores[mi3][si3][modI3];
      }
      var elSem = document.querySelector('.pModTotalSem-'+mi3+'-'+si3);
      if(elSem) elSem.textContent = fmtMilhar(totalSem);
    }
  }

  // Atualizar total do mês
  for(var mi4 = 1; mi4 <= 3; mi4++){
    var totalMes = 0;
    for(var si4 = 1; si4 <= quantidadeSemanasMes(tri, mi4); si4++){
      for(var modI4 = 0; modI4 < 4; modI4++){
        totalMes += valores[mi4][si4][modI4];
      }
    }
    var elMes = document.querySelector('.pModTotalMes-'+mi4);
    if(elMes) elMes.textContent = fmtMilhar(totalMes);
  }

  // Atualizar indicadores e gráfico em tempo real
  // Pizza será atualizada ao salvar
}

// Atualiza totais dos outros produtos (semanas, mês, produto) em tempo real
function atualizarTotaisOutrosProdutos(idx, tri){
  var mesIdx = pSelectedMesIdx || 1;
  var numProdutos = OUTROS_PRODUTOS.length;
  var numSemanasMes = quantidadeSemanasMes(tri, mesIdx);

  // Coletar valores dos inputs
  var valores = {}; // valores[semIdx][prodIdx] = valor
  for(var si = 1; si <= numSemanasMes; si++){
    valores[si] = {};
    for(var pi = 0; pi < numProdutos; pi++){
      var inp = document.querySelector('.pOutroInput[data-mes="'+mesIdx+'"][data-sem="'+si+'"][data-prod="'+pi+'"]');
      valores[si][pi] = inp ? (parseMilhar(inp.value)||0) : 0;
    }
  }

  // Total por produto no mês
  for(var p = 0; p < numProdutos; p++){
    var totalProd = 0;
    for(var s = 1; s <= numSemanasMes; s++){
      totalProd += valores[s][p];
    }
    var elP = document.querySelector('.pOutroTotalProd-'+mesIdx+'-'+p);
    if(elP) elP.textContent = fmtMilhar(totalProd);
  }

  // Total por semana
  for(var s2 = 1; s2 <= numSemanasMes; s2++){
    var totalSem = 0;
    for(var p2 = 0; p2 < numProdutos; p2++){
      totalSem += valores[s2][p2];
    }
    var elS = document.querySelector('.pOutroTotalSem-'+mesIdx+'-'+s2);
    if(elS) elS.textContent = fmtMilhar(totalSem);
  }

  // Total do mês
  var totalMes = 0;
  for(var s3 = 1; s3 <= numSemanasMes; s3++){
    for(var p3 = 0; p3 < numProdutos; p3++){
      totalMes += valores[s3][p3];
    }
  }
  var elM = document.querySelector('.pOutroTotalMes-'+mesIdx);
  if(elM) elM.textContent = fmtMilhar(totalMes);
}

// Renderiza os 4 cards de indicadores por modalidade
function renderIndicadoresModalidades(idx, tri){
  var el = document.getElementById('pIndicadoresMod');
  if(!el) return;
  var e = S.ests[idx];
  var prod = getProducaoTri(e.id, tri);
  var meta = parseFloat(prod.meta) || 0;

  var html = '';
  MODALIDADES.forEach(function(mod, modIdx){
    var totalMod = getTotalTrimestreModalidade(e.id, tri, modIdx);
    var pct = meta > 0 ? Math.round((totalMod / meta) * 100) : 0;
    var pctFill = Math.min(pct, 100);
    var cor = CORES_MODALIDADES[mod];

    html += '<div style="background:var(--surface);border:1px solid var(--border);border-left:3px solid '+cor+';border-radius:6px;padding:10px;">'
      +'<div style="font-size:10px;color:var(--ink3);font-weight:600;margin-bottom:4px;">'+mod+'</div>'
      +'<div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:6px;">R$ '+fmtMilhar(totalMod)+'</div>'
      +'<div style="height:4px;background:var(--bg);border-radius:2px;overflow:hidden;margin-bottom:4px;">'
      +'<div style="width:'+pctFill+'%;height:100%;background:'+cor+';transition:width .3s;"></div>'
      +'</div>'
      +'<div style="font-size:10px;color:var(--ink3);">'+pct+'% do alvo</div>'
      +'</div>';
  });

  el.innerHTML = html;
}

// Versão que recebe valores em memória (uso em tempo real ao digitar)
function renderIndicadoresModalidadesFromInputs(idx, tri, valores){
  var el = document.getElementById('pIndicadoresMod');
  if(!el) return;
  var e = S.ests[idx];
  var prod = getProducaoTri(e.id, tri);
  var meta = parseFloat(prod.meta) || 0;

  var html = '';
  MODALIDADES.forEach(function(mod, modIdx){
    var totalMod = 0;
    for(var mi = 1; mi <= 3; mi++){
      for(var si = 1; si <= quantidadeSemanasMes(tri, mi); si++){
        totalMod += valores[mi][si][modIdx] || 0;
      }
    }
    var pct = meta > 0 ? Math.round((totalMod / meta) * 100) : 0;
    var pctFill = Math.min(pct, 100);
    var cor = CORES_MODALIDADES[mod];

    html += '<div style="background:var(--surface);border:1px solid var(--border);border-left:3px solid '+cor+';border-radius:6px;padding:10px;">'
      +'<div style="font-size:10px;color:var(--ink3);font-weight:600;margin-bottom:4px;">'+mod+'</div>'
      +'<div style="font-size:13px;font-weight:600;color:var(--ink);margin-bottom:6px;">R$ '+fmtMilhar(totalMod)+'</div>'
      +'<div style="height:4px;background:var(--bg);border-radius:2px;overflow:hidden;margin-bottom:4px;">'
      +'<div style="width:'+pctFill+'%;height:100%;background:'+cor+';transition:width .3s;"></div>'
      +'</div>'
      +'<div style="font-size:10px;color:var(--ink3);">'+pct+'% do alvo</div>'
      +'</div>';
  });

  el.innerHTML = html;
}

// Renderiza o gráfico de pizza com a distribuição
function renderGraficoPizzaModalidades(idx, tri){
  var el = document.getElementById('pGraficoMod');
  if(!el) return;
  var e = S.ests[idx];

  var totais = MODALIDADES.map(function(mod, modIdx){
    return {nome: mod, valor: getTotalTrimestreModalidade(e.id, tri, modIdx), cor: CORES_MODALIDADES[mod]};
  });

  renderPizza(el, totais);
}

function renderGraficoPizzaOutros(idx, tri){
  var el = document.getElementById('pGraficoOutros');
  if(!el) return;
  var e = S.ests[idx];

  var totais = OUTROS_PRODUTOS.map(function(prod, prodIdx){
    return {nome: prod, valor: getTotalTrimestreOutroProduto(e.id, tri, prodIdx), cor: CORES_OUTROS[prod]};
  });

  renderPizza(el, totais);
}

// Versão que recebe valores em memória
function renderGraficoPizzaModalidadesFromInputs(idx, tri, valores){
  var el = document.getElementById('pGraficoMod');
  if(!el) return;

  var totais = MODALIDADES.map(function(mod, modIdx){
    var total = 0;
    for(var mi = 1; mi <= 3; mi++){
      for(var si = 1; si <= quantidadeSemanasMes(tri, mi); si++){
        total += valores[mi][si][modIdx] || 0;
      }
    }
    return {nome: mod, valor: total, cor: CORES_MODALIDADES[mod]};
  });

  renderPizza(el, totais);
}

// Renderiza o SVG do gráfico de pizza
function renderPizza(el, totais){
  var total = totais.reduce(function(sum, t){ return sum + t.valor; }, 0);

  if(total === 0){
    el.innerHTML = '<div style="font-size:12px;color:var(--ink3);font-style:italic;padding:10px 0;">Sem vendas registradas ainda.</div>';
    return;
  }

  // Calcular offsets do pizza chart
  var offset = 0;
  var circunferencia = 283; // 2 * π * 45 (aprox.)

  var pieSegments = '';
  var legendItems = '';

  totais.forEach(function(t){
    var pct = (t.valor / total) * 100;
    var arco = (pct / 100) * circunferencia;

    if(arco > 0){
      pieSegments += '<circle cx="60" cy="60" r="45" fill="none" '
        +'stroke="'+t.cor+'" stroke-width="22" '
        +'stroke-dasharray="'+arco.toFixed(2)+' '+(circunferencia - arco).toFixed(2)+'" '
        +'stroke-dashoffset="-'+offset.toFixed(2)+'" '
        +'transform="rotate(-90 60 60)"/>';
    }

    legendItems += '<div style="display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:6px;">'
      +'<div style="width:12px;height:12px;border-radius:3px;background:'+t.cor+';flex-shrink:0;"></div>'
      +'<div style="flex:1;"><div style="font-weight:500;color:var(--ink);">'+t.nome+'</div>'
      +'<div style="font-size:10px;color:var(--ink3);">R$ '+fmtMilhar(t.valor)+' ('+Math.round(pct)+'%)</div>'
      +'</div></div>';

    offset += arco;
  });

  el.innerHTML = '<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;justify-content:center;">'
    +'<svg viewBox="0 0 120 120" style="width:150px;height:150px;flex-shrink:0;">'
    + pieSegments
    +'</svg>'
    +'<div style="flex:1;min-width:140px;">'+legendItems+'</div>'
    +'</div>';
}



function renderPanelTrilha(idx){
  var e = S.ests[idx];
  var autoKey = e.perfil && e.perfil.inicio ? getTrilhaKey(e.perfil.inicio) : null;
  var key = getEffectiveTrilhaKey(e);
  var isManual = !!(e.perfil && e.perfil.trilha_manual);
  var el = document.getElementById('pTrilha');
  if(!el) return;

  if(!key){
    var hFallback = '<div style="font-size:13px;color:var(--ink3);font-style:italic;padding:4px 0;">Cadastre a data de início para identificar a trilha automaticamente.</div>';
    if(editor || (modoGestor && gestorLogado)){
      hFallback += '<div style="margin-top:10px;display:flex;align-items:center;gap:8px;">'
        +'<span style="font-size:12px;color:var(--ink2);">Definir trilha manualmente:</span>'
        +'<select id="pTrilhaManualSelect" style="font-size:12px;border:1px solid var(--border2);border-radius:6px;padding:4px 8px;background:var(--surface);color:var(--ink);cursor:pointer;">'
          +'<option value="">— Automático —</option>'
          +'<option value="iniciante">Decolar</option>'
          +'<option value="intermediario">Evoluir</option>'
          +'<option value="avancado">Impactar</option>'
        +'</select></div>';
    }
    el.innerHTML = hFallback;
    var selFallback = document.getElementById('pTrilhaManualSelect');
    if(selFallback){
      selFallback.value = '';
      selFallback.addEventListener('change', function(){
        var val = this.value || null;
        if(!e.perfil) e.perfil = {};
        e.perfil.trilha_manual = val;
        saveEstagiario(e); persist(true);
        renderPanelTrilha(idx);
        renderAvaliacao(idx);
        renderCards();
        renderOverviewAll();
      });
    }
    return;
  }

  var key = getEffectiveTrilhaKey(e) || 'iniciante';
  if(!TRILHAS[key]) key = 'iniciante';
  var t = TRILHAS[key];
  var cor = getTrilhaCor(key);
  var etapa = e.perfil && e.perfil.inicio ? etapaAtual(e.perfil.inicio) : 0;
  // Convert global etapa index to local within current trilha
  var etapaLocal;
  if(key==='iniciante') etapaLocal = etapa;            // 0,1,2
  else if(key==='intermediario') etapaLocal = etapa-3; // 0,1,2 (was 3,4,5)
  else etapaLocal = etapa-6;                           // 0,1 (was 6,7)

  var canCheck = (editor || (modoGestor && gestorLogado));
  if(!e.trilhaChecks) e.trilhaChecks = {};

  // Trilha header with manual override select for tutora
  var trilhaLabel = isManual ? 'Trilha definida manualmente' : 'Trilha identificada';
  var html = '<div style="background:var(--or-f);border:1px solid rgba(236,112,0,.2);border-left:3px solid '+cor+';border-radius:8px;padding:12px 14px;margin-bottom:14px;">'
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:3px;">'
      +'<div style="font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:'+cor+';font-weight:600;">'+trilhaLabel+'</div>'
      +(isManual && autoKey && autoKey !== key ? '<span style="font-size:10px;color:var(--ink3);font-style:italic;">Auto: '+TRILHAS[autoKey].titulo.split('—')[0].trim()+'</span>' : '')
    +'</div>'
    +'<div style="font-size:14px;font-weight:500;color:var(--ink);">'+t.titulo+'</div>'
    +'<div style="font-size:12px;color:var(--ink2);font-style:italic;margin-top:3px;">'+t.frase+'</div>'
    +'</div>';

  // Select para tutora/gestor trocar a trilha
  if(editor || (modoGestor && gestorLogado)){
    html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">'
      +'<span style="font-size:12px;color:var(--ink2);">Alterar trilha:</span>'
      +'<select id="pTrilhaManualSelect" style="font-size:12px;border:1px solid var(--border2);border-radius:6px;padding:4px 8px;background:var(--surface);color:var(--ink);cursor:pointer;">'
        +'<option value=""'+(isManual?'':' selected')+'>Automático (por data)</option>'
        +'<option value="iniciante"'+(isManual && key==='iniciante'?' selected':'')+'>Decolar</option>'
        +'<option value="intermediario"'+(isManual && key==='intermediario'?' selected':'')+'>Evoluir</option>'
        +'<option value="avancado"'+(isManual && key==='avancado'?' selected':'')+'>Impactar</option>'
      +'</select>'
    +'</div>';
  }

  t.topicos.forEach(function(tp, ti){
    var checkKey = key+'_'+ti;
    var checks = e.trilhaChecks[checkKey] || Array(tp.checks.length).fill(false);
    var doneCount = checks.filter(Boolean).length;
    var total = tp.checks.length;
    var pct = Math.round(doneCount/total*100);
    var isAtual = (ti === etapaLocal);
    var isPast = (ti < etapaLocal);

    html += '<div style="background:var(--surface);border:1px solid '+(isAtual?cor:'var(--border)')+';border-radius:8px;margin-bottom:10px;overflow:hidden;'+(isPast?'opacity:.65;':'')+'">'
      +'<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--bg);border-bottom:1px solid var(--border);">'
        +'<div style="width:22px;height:22px;border-radius:50%;background:'+cor+';color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0;">'+(ti+1)+'</div>'
        +'<div style="flex:1;min-width:0;">'
          +'<div style="font-size:13px;font-weight:500;color:var(--ink);">'+tp.tema+'</div>'
        +'</div>'
        +(isAtual?'<span style="font-size:10px;font-weight:600;background:'+cor+';color:#fff;padding:2px 8px;border-radius:20px;flex-shrink:0;">Você está aqui</span>':'')
        +'<div style="font-size:11px;color:'+cor+';font-weight:600;flex-shrink:0;margin-left:6px;">'+doneCount+'/'+total+'</div>'
      +'</div>'
      +'<div style="height:3px;background:var(--bg);">'
        +'<div style="height:100%;background:'+cor+';width:'+pct+'%;transition:width .3s;"></div>'
      +'</div>'
      +'<div style="padding:10px 14px;display:flex;flex-direction:column;gap:8px;">';

    tp.checks.forEach(function(c, ci){
      var checked = checks[ci]||false;
      html += '<label style="display:flex;align-items:center;gap:9px;cursor:'+(canCheck?'pointer':'default')+';">'
        +'<input type="checkbox"'+(checked?' checked':'')+(canCheck?'':' disabled')
          +' data-trilha="'+key+'" data-topico="'+ti+'" data-check="'+ci+'" data-est="'+idx+'"'
          +' style="width:16px;height:16px;accent-color:'+cor+';flex-shrink:0;">'
        +'<span style="font-size:12.5px;color:'+(checked?'var(--ink2)':'var(--ink)')+';'+(checked?'text-decoration:line-through;opacity:.6;':'')+'">'+c+'</span>'
        +'</label>';
    });

    html += '</div></div>';
  });

  el.innerHTML = html;

  // Event listener para troca manual de trilha (tutora only)
  var trilhaSelect = document.getElementById('pTrilhaManualSelect');
  if(trilhaSelect){
    trilhaSelect.addEventListener('change', function(){
      var val = this.value || null;
      if(!e.perfil) e.perfil = {};
      e.perfil.trilha_manual = val;
      saveEstagiario(e); persist(true);
      renderPanelTrilha(idx);
      renderAvaliacao(idx);
      renderCards();
      renderOverviewAll();
    });
  }

  el.querySelectorAll('input[type=checkbox]').forEach(function(cb){
    cb.addEventListener('change', async function(){
      var estIdx = parseInt(this.dataset.est);
      var trilhaKey = this.dataset.trilha;
      var topicoIdx = parseInt(this.dataset.topico);
      var checkIdx = parseInt(this.dataset.check);
      var t2 = TRILHAS[trilhaKey];
      var ck = trilhaKey+'_'+topicoIdx;
      if(!S.ests[estIdx].trilhaChecks) S.ests[estIdx].trilhaChecks = {};
      if(!S.ests[estIdx].trilhaChecks[ck]) S.ests[estIdx].trilhaChecks[ck] = Array(t2.topicos[topicoIdx].checks.length).fill(false);
      S.ests[estIdx].trilhaChecks[ck][checkIdx] = this.checked;
      await saveEstagiario(S.ests[estIdx]); persist(true);
      salvarSnapshot(S.ests[estIdx].id, trimestreRef());
      renderPanelTrilha(estIdx);
      renderAvaliacao(estIdx);
      renderCards();
      renderOverviewAll();
    });
  });
}


// Preenche o dropdown de agências dinamicamente com os valores existentes
function atualizarOpcoesFiltroAgencia(lista){
  var sel = document.getElementById('filtroAgencia');
  if(!sel) return;
  var valorAtual = sel.value || 'todas';

  // Coletar agências únicas
  var agencias = {};
  lista.forEach(function(e){
    if(e.perfil && e.perfil.agencia){ agencias[e.perfil.agencia] = true; }
  });
  var listaAg = Object.keys(agencias).sort();

  // Reconstruir opções
  var h = '<option value="todas">Todas</option>';
  listaAg.forEach(function(ag){
    h += '<option value="'+escapeAttr(ag)+'">Ag '+escapeHtml(ag)+'</option>';
  });
  sel.innerHTML = h;

  // Restaurar valor selecionado (se ainda válido)
  if(valorAtual === 'todas' || agencias[valorAtual]){
    sel.value = valorAtual;
  } else {
    sel.value = 'todas';
  }
}

function renderCards(){
  var baseList = (typeof getEstagiariosAtivos === 'function') ? getEstagiariosAtivos() : S.ests;
  var lista = baseList;
  if(modoGestor && gestorLogado){
    var p = gestorLogado.permissoes || {};
    if(!p.todos_estagiarios && !isGGA() && !isGerenteRegional()){
      lista = baseList.filter(function(e){
        return e.perfil && (e.perfil.ga_funcional === gestorLogado.funcional || e.perfil.gga_funcional === gestorLogado.funcional);
      });
    }
    if(!lista.length){
      document.getElementById('notionGrid').innerHTML = '<div style="padding:40px;text-align:center;color:var(--ink3);font-size:14px;">Nenhum estagiário vinculado ao seu perfil nesta regional.</div>';
      return;
    }
  }

  // Preencher opções de agência (dinâmico)
  atualizarOpcoesFiltroAgencia(lista);

  // Aplicar filtros
  var filtroAg = (document.getElementById('filtroAgencia')||{}).value || 'todas';
  var filtroCert = (document.getElementById('filtroCertificacao')||{}).value || 'todas';
  var filtroOrdem = (document.getElementById('filtroOrdem')||{}).value || 'nome';

  var totalAntes = lista.length;

  // Filtro agência
  if(filtroAg !== 'todas'){
    lista = lista.filter(function(e){ return (e.perfil && e.perfil.agencia) === filtroAg; });
  }

  // Filtro certificação
  if(filtroCert !== 'todas'){
    if(filtroCert === 'sem'){
      lista = lista.filter(function(e){ return !(e.perfil && e.perfil.certificacao); });
    } else {
      lista = lista.filter(function(e){ return (e.perfil && e.perfil.certificacao) === filtroCert; });
    }
  }

  // Ordenação
  if(filtroOrdem === 'nome'){
    lista.sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||'', 'pt-BR'); });
  } else if(filtroOrdem === 'maior_nota'){
    lista.sort(function(a,b){ return calcScore(b) - calcScore(a); });
  } else if(filtroOrdem === 'menor_nota'){
    lista.sort(function(a,b){ return calcScore(a) - calcScore(b); });
  }

  // Contador
  var contEl = document.getElementById('filtroContador');
  if(contEl){
    if(lista.length === totalAntes){
      contEl.textContent = totalAntes + ' estagiário' + (totalAntes!==1?'s':'');
    } else {
      contEl.textContent = 'Mostrando ' + lista.length + ' de ' + totalAntes;
    }
  }

  if(!lista.length){
    document.getElementById('notionGrid').innerHTML = '<div style="padding:40px;text-align:center;color:var(--ink3);font-size:14px;">Nenhum estagiário encontrado com esses filtros.</div>';
    return;
  }

  var cards=lista.map(function(e,ei){
    var ci=currMonth(e);
    var done=e.meses.filter(function(s){return s.indexOf('Concluído')>=0||s.indexOf('Renovado')>=0;}).length;
    var hasFn=e.perfil&&e.perfil.funcional;
    var ag=e.perfil&&e.perfil.agencia?e.perfil.agencia:null;
    var t=e.perfil&&e.perfil.inicio?calcTempo(e.perfil.inicio):null;
    var cert=e.perfil&&e.perfil.certificacao?e.perfil.certificacao:null;
    var bday=isAniversario(e);
    var updStatus=hasFn?statusAtualizacao(e):'ok';
    var cardBorder = updStatus==='atrasado'?'border-left:4px solid #DC2626;':(updStatus==='alerta'?'border-left:4px solid #F59E0B;':'');
    var score=calcScore(e);
    var dots=e.meses.map(function(s,i){
      var cls=i===ci?'curr':(dotCls(s)||'');
      return '<span class="nd'+(cls?' '+cls:'')+'" title="'+escapeAttr(ML[i]+': '+sShort(s))+'"></span>';
    }).join('');
    return '<div class="notion-card'+(panelIdx===e.id?' nc-active':'')+'" data-eid="'+escapeAttr(e.id)+'" style="'+cardBorder+'">'
      +'<div class="nc-top"><div class="nc-avatar">'+(bday?'🎂':escapeHtml(ini(e.nome)))+'</div><div class="nc-name">'+escapeHtml(e.nome)+(ag?' <span style="font-size:11px;color:var(--ink3);font-weight:500;">· Ag '+escapeHtml(ag)+'</span>':'')+(bday?' <span style="font-size:11px;color:var(--or);">Aniversário hoje!</span>':'')+'</div><span class="nc-arrow">→</span></div>'
      +'<div class="nc-meta">'
        +(hasFn?'<span class="nc-chip func">#'+escapeHtml(e.perfil.funcional)+'</span>':'')
        +(t?'<span class="nc-chip">◷ '+t+'</span>':'')
        +(cert?'<span class="nc-chip" style="background:#DBEAFE;color:#1E40AF;font-weight:600;">🏅 '+escapeHtml(cert)+'</span>':'')
        +(updStatus==='atrasado'?'<span class="nc-chip" style="background:#FEE2E2;color:#DC2626;font-weight:600;">⚠ Prazo vencido</span>':'')
        +(updStatus==='alerta'?'<span class="nc-chip" style="background:#FEF3C7;color:#92400E;font-weight:600;">⏳ Prazo próximo</span>':'')
        +(!hasFn&&!t?'<span class="nc-chip empty">Perfil não cadastrado</span>':'')
        +(e.atencao?'<span class="nc-atencao"><span class="nc-atencao-dot"></span>Atenção</span>':'')
      +'</div>'
      +'<div class="nc-bottom"><div class="nc-dots">'+dots+'</div>'      +'<div style="display:flex;align-items:center;gap:8px;">'        +(score>0?'<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;background:'+scoreBg(score)+';color:'+scoreColor(score)+';">'+score+'/10</span>':'')        +'<span class="nc-count">'+done+'/6</span>'      +'</div>'      +'</div>'
      +'</div>';
  }).join('');
  document.getElementById('notionGrid').innerHTML='<div class="notion-grid">'+cards+'</div>';
  // attach click events
  document.querySelectorAll('.notion-card').forEach(function(card){
    card.addEventListener('click',function(){
      var eid = this.dataset.eid;
      var idx = S.ests.findIndex(function(e){ return String(e.id) === String(eid); });
      if(idx >= 0) openPanel(idx);
    });
  });
}

// ── PANEL ──────────────────────────────────────────────────────────────────
function getPanelEstIdx(){
  if(panelIdx===-1 || panelIdx===undefined || panelIdx===null) return -1;
  return S.ests.findIndex(function(e){ return String(e.id) === String(panelIdx); });
}
function openPanel(idx){
  var e=S.ests[idx];
  if(!e) return;
  panelIdx=e.id;
  document.getElementById('pAv').textContent=ini(e.nome);
  document.getElementById('pNm').textContent=e.nome;
  document.getElementById('pFn').textContent=e.perfil&&e.perfil.funcional?'#'+e.perfil.funcional:'Sem funcional';
  // idade removida
  document.getElementById('pFunc').textContent=e.perfil&&e.perfil.funcional?e.perfil.funcional:'—';
  var regObj = (S.regionais||[]).find(function(r){ return String(r.id) === String(e.regional_id); });
  var pRegEl = document.getElementById('pRegional');
  if(pRegEl) pRegEl.textContent = regObj ? regObj.nome : '—';
  var pAgEl = document.getElementById('pAgencia');
  if(pAgEl) pAgEl.textContent = e.perfil&&e.perfil.agencia?e.perfil.agencia:'—';
  // GA e GGA
  var gaFunc = e.perfil&&e.perfil.ga_funcional?e.perfil.ga_funcional:null;
  var ggaFunc = e.perfil&&e.perfil.gga_funcional?e.perfil.gga_funcional:null;
  var gaGestor = gaFunc ? (S.gestores||[]).find(function(g){return String(g.funcional)===String(gaFunc);}) : null;
  var ggaGestor = ggaFunc ? (S.gestores||[]).find(function(g){return String(g.funcional)===String(ggaFunc);}) : null;
  document.getElementById('pGA').textContent = gaGestor ? gaGestor.nome+' (#'+gaFunc+')' : (gaFunc||'—');
  document.getElementById('pGGA').textContent = ggaGestor ? ggaGestor.nome+' (#'+ggaFunc+')' : (ggaFunc||'—');
  document.getElementById('pInicio').textContent=fmtDate(e.perfil&&e.perfil.inicio?e.perfil.inicio:'');
  document.getElementById('pTempo').textContent=(e.perfil&&e.perfil.inicio?calcTempo(e.perfil.inicio):null)||'—';
  var certVal = e.perfil&&e.perfil.certificacao?e.perfil.certificacao:null;
  var certEl = document.getElementById('pCertificacao');
  if(certEl){
    if(certVal){
      certEl.innerHTML = '<span style="background:#DBEAFE;color:#1E40AF;font-weight:600;padding:2px 10px;border-radius:12px;font-size:12px;">🏅 '+escapeHtml(certVal)+'</span>';
    } else {
      certEl.textContent = '—';
    }
  }
  // Nascimento
  var nascEl = document.getElementById('pNascimento');
  if(nascEl){
    var anivVal = e.perfil&&e.perfil.mes_aniversario?e.perfil.mes_aniversario:null;
    if(anivVal){
      var anivP = anivVal.split('-');
      var mesesNome = ['','Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
      var bday = isAniversario(e);
      nascEl.innerHTML = escapeHtml(anivP[0])+' de '+escapeHtml(mesesNome[parseInt(anivP[1])]||'') + (bday?' <span style="font-size:12px;">🎂 Aniversário hoje!</span>':'');
    } else { nascEl.textContent = '—'; }
  }
  // Última atualização de produção
  var updEl = document.getElementById('pUltimaAtualizacao');
  if(updEl){
    var updVal = e.perfil&&e.perfil.ultima_atualizacao_prod?e.perfil.ultima_atualizacao_prod:null;
    var st = statusAtualizacao(e);
    if(updVal){
      var corSt = st==='atrasado'?'#DC2626':(st==='alerta'?'#F59E0B':'#16A34A');
      var lblSt = st==='atrasado'?' (prazo vencido)':(st==='alerta'?' (prazo próximo)':' (em dia)');
      updEl.innerHTML = escapeHtml(fmtDate(updVal))+' <span style="color:'+corSt+';font-size:11px;font-weight:600;">'+lblSt+'</span>';
    } else if(getPrazoProducaoAtual()){
      var corSt2 = st==='atrasado'?'#DC2626':(st==='alerta'?'#F59E0B':'var(--ink3)');
      updEl.innerHTML = '<span style="color:'+corSt2+';font-size:12px;">Ainda não atualizada</span>';
    } else { updEl.textContent = '—'; }
  }
  renderPanelTrilha(idx);
  updateAtencaoBtn(idx);
  renderAvaliacao(idx);
  renderResultados(idx);
  // Avaliação handled by renderAvaliacao + renderResultados
  document.getElementById('obsTA').value=e.obs||'';
  document.getElementById('obsTA').disabled=!editor;
  document.getElementById('btnObs').disabled=!editor;
  document.getElementById('obsHint').textContent=editor?'Salvo localmente no navegador.':'Entre como tutora para editar.';
  document.getElementById('obsSaved').classList.remove('show');
  var editInfoBtn = document.getElementById('btnEditarInfoEstagiario');
  if(editInfoBtn) editInfoBtn.style.display = (editor || isGGA()) ? 'inline-flex' : 'none';
  var archiveAction = document.getElementById('archiveStudentAction');
  if(archiveAction) archiveAction.style.display = (editor || modoGestor) ? 'flex' : 'none';
  var archiveButton = document.getElementById('btnArchiveStudent');
  if(archiveButton) archiveButton.dataset.studentId = String(e.id);
  setPanelInfoEditing(false);
  var editInfoSaved = document.getElementById('pEditSaved');
  if(editInfoSaved) editInfoSaved.classList.remove('show');
  document.getElementById('overlay').classList.add('open');
  document.getElementById('panel').classList.add('open');
}
function setPanelInfoEditing(open){
  var form = document.getElementById('pInfoEditor');
  var trigger = document.getElementById('btnEditarInfoEstagiario');
  var error = document.getElementById('pEditError');
  if(!form) return;
  form.hidden = !open;
  if(trigger) trigger.textContent = open ? '✕ Fechar edição' : '✎ Editar informações';
  if(error){ error.textContent=''; error.classList.remove('show'); }
  if(open) populatePanelInfoEditor();
}
function populatePanelInfoEditor(){
  var idx = getPanelEstIdx();
  var e = idx >= 0 ? S.ests[idx] : null;
  if(!e) return;
  var perfil = e.perfil || {};
  document.getElementById('pEditNome').value = e.nome || '';
  document.getElementById('pEditFunc').value = perfil.funcional || '';
  document.getElementById('pEditAgencia').value = perfil.agencia || '';
  document.getElementById('pEditInicio').value = perfil.inicio || '';
  document.getElementById('pEditGA').value = perfil.ga_funcional || '';
  document.getElementById('pEditGGA').value = perfil.gga_funcional || '';
  document.getElementById('pEditCert').value = perfil.certificacao || '';

  var regional = document.getElementById('pEditRegional');
  regional.innerHTML = '';
  (S.regionais||[]).forEach(function(r){
    var option = document.createElement('option');
    option.value = r.id;
    option.textContent = r.nome;
    regional.appendChild(option);
  });
  if(e.regional_id) regional.value = e.regional_id;

  var day = document.getElementById('pEditDia');
  if(day.options.length === 1){
    for(var d=1; d<=31; d++){
      var dayOption = document.createElement('option');
      dayOption.value = String(d);
      dayOption.textContent = String(d);
      day.appendChild(dayOption);
    }
  }
  var birthday = perfil.mes_aniversario ? String(perfil.mes_aniversario).split('-') : [];
  day.value = birthday[0] || '';
  document.getElementById('pEditMes').value = birthday[1] || '';
}
async function savePanelInfo(){
  if(!editor && !isGGA()) return;
  var idx = getPanelEstIdx();
  if(idx < 0) return;
  var error = document.getElementById('pEditError');
  var saveButton = document.getElementById('pEditSave');
  var cancelButton = document.getElementById('pEditCancel');
  function showError(message){ error.textContent=message; error.classList.add('show'); }
  error.textContent=''; error.classList.remove('show');

  var nome = document.getElementById('pEditNome').value.trim();
  var funcional = document.getElementById('pEditFunc').value.replace(/[^0-9]/g,'').slice(0,9);
  var ga = document.getElementById('pEditGA').value.replace(/[^0-9]/g,'').slice(0,9);
  var gga = document.getElementById('pEditGGA').value.replace(/[^0-9]/g,'').slice(0,9);
  if(!nome){ showError('Informe o nome completo.'); document.getElementById('pEditNome').focus(); return; }
  if(funcional.length !== 9){ showError('O funcional deve ter 9 dígitos.'); document.getElementById('pEditFunc').focus(); return; }
  if(ga && ga.length !== 9){ showError('O funcional do GA deve ter 9 dígitos.'); return; }
  if(gga && gga.length !== 9){ showError('O funcional do GGA deve ter 9 dígitos.'); return; }
  var duplicate = S.ests.find(function(item){
    return item.id !== S.ests[idx].id && item.perfil && String(item.perfil.funcional) === funcional;
  });
  if(duplicate){ showError('Já existe outro estagiário com este funcional.'); return; }

  var current = S.ests[idx];
  var previous = JSON.parse(JSON.stringify(current));
  var day = document.getElementById('pEditDia').value;
  var month = document.getElementById('pEditMes').value;
  current.nome = nome;
  current.regional_id = document.getElementById('pEditRegional').value || current.regional_id;
  current.perfil = Object.assign({}, current.perfil || {}, {
    funcional: funcional,
    agencia: document.getElementById('pEditAgencia').value.trim(),
    inicio: document.getElementById('pEditInicio').value,
    ga_funcional: ga,
    gga_funcional: gga,
    certificacao: document.getElementById('pEditCert').value || null,
    mes_aniversario: (day && month) ? day+'-'+month : null
  });

  saveButton.disabled = true;
  cancelButton.disabled = true;
  saveButton.textContent = 'Salvando...';
  var saved = await saveEstagiario(current);
  saveButton.disabled = false;
  cancelButton.disabled = false;
  saveButton.textContent = 'Salvar alterações';
  if(!saved){
    S.ests[idx] = previous;
    showError('Não foi possível salvar as informações. Tente novamente.');
    return;
  }
  persist(true);
  renderCards();
  renderCadList();
  openPanel(idx);
  var success = document.getElementById('pEditSaved');
  if(success){ success.classList.add('show'); setTimeout(function(){ success.classList.remove('show'); },2500); }
}
function closePanel(){
  panelIdx=-1;
  if(window.nextuberTracking) window.nextuberTracking.close();
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('panel').classList.remove('open');
  renderCards();
}

function openPanelById(eid){
  var idx = S.ests.findIndex(function(e){ return String(e.id) === String(eid); });
  if(idx >= 0) openPanel(idx);
}
if(typeof window !== 'undefined') window.openPanelById = openPanelById;

function renderArchivedStudents(){
  var section = document.getElementById('archivedStudentsSection');
  var list = document.getElementById('archivedStudentsList');
  var count = document.getElementById('archivedStudentsCount');
  if(!section || !list || !count) return;
  var archived = (S.archived || []).filter(function(e){
    return !S.selectedRegionalId || S.selectedRegionalId === 'all' ||
      String(e.regional_id || '') === String(S.selectedRegionalId);
  });
  section.style.display = editor ? 'block' : 'none';
  count.textContent = String(archived.length);
  if(!archived.length){
    list.innerHTML = '<div class="archived-students-empty">Nenhum estagiário arquivado.</div>';
    return;
  }
  list.innerHTML = archived.map(function(e){
    var reason = e.motivo_arquivamento || 'Outro';
    return '<button type="button" class="archived-student-row" data-archived-id="'+escapeAttr(e.id)+'">'
      +'<span><strong>'+escapeHtml(e.nome)+'</strong><small>'+escapeHtml(reason)+' · arquivado em '+escapeHtml(fmtDate(e.arquivado_em))+'</small></span>'
      +'<span>Ver histórico →</span></button>';
  }).join('');
  list.querySelectorAll('[data-archived-id]').forEach(function(button){
    button.addEventListener('click', function(){ openArchivedHistory(this.dataset.archivedId); });
  });
}

function openArchivedHistory(id){
  var student = (S.archived || []).find(function(e){ return String(e.id) === String(id); });
  if(!student) return;
  document.getElementById('archiveHistoryName').textContent = student.nome;
  document.getElementById('archiveHistoryMeta').textContent =
    (student.motivo_arquivamento || 'Arquivado')+' · exclusão programada para '+fmtDate(student.excluir_em);
  var rows = (S.producao || []).filter(function(row){
    return String(row.estagiario_id) === String(student.id);
  });
  var quarters = rows.filter(function(row){ return /^\d{4}-Q[1-4]$/.test(String(row.tri_ref)); })
    .sort(function(a,b){ return String(b.tri_ref).localeCompare(String(a.tri_ref)); });
  var profile = student.perfil || {};
  var html = '<div class="archive-history-info">'
    +'<span><small>Funcional</small><strong>'+escapeHtml(profile.funcional || '—')+'</strong></span>'
    +'<span><small>Agência</small><strong>'+escapeHtml(profile.agencia || '—')+'</strong></span>'
    +'<span><small>Início</small><strong>'+escapeHtml(fmtDate(profile.inicio))+'</strong></span>'
    +'</div><div class="archive-history-results"><strong>Resultados trimestrais</strong>';
  if(!quarters.length){
    html += '<div class="archived-students-empty">Nenhum resultado trimestral registrado.</div>';
  } else {
    html += quarters.map(function(row){
      var produced = parseFloat(row.producao)||0;
      var target = parseFloat(row.meta)||0;
      var percent = target > 0 ? Math.round((produced/target)*100) : 0;
      return '<div class="archive-history-quarter"><span><strong>'+escapeHtml(fmtTrimestre(row.tri_ref))+'</strong><small>Alvo: '+escapeHtml(fmtMilhar(target))+'</small></span>'
        +'<span><strong>'+escapeHtml(fmtMilhar(produced))+'</strong><small>'+percent+'% atingido</small></span></div>';
    }).join('');
  }
  document.getElementById('archiveHistoryContent').innerHTML = html+'</div>';
  document.getElementById('archiveHistoryOv').classList.add('open');
}

function openArchiveStudent(){
  if(!editor && !modoGestor) return;
  var button = document.getElementById('btnArchiveStudent');
  var studentId = button ? button.dataset.studentId : '';
  var student = S.ests.find(function(e){ return String(e.id) === String(studentId); });
  if(!student){
    alert('Não foi possível identificar o estagiário. Feche o perfil e tente novamente.');
    return;
  }
  var overlay = document.getElementById('archiveStudentOv');
  overlay.dataset.studentId = String(student.id);
  document.getElementById('archiveStudentName').textContent = student.nome;
  document.getElementById('archiveStudentReason').value = 'Promovido';
  overlay.classList.add('open');
}

async function confirmArchiveStudent(){
  var overlay = document.getElementById('archiveStudentOv');
  var studentId = overlay.dataset.studentId || '';
  var idx = S.ests.findIndex(function(e){ return String(e.id) === String(studentId); });
  if(idx < 0 || !window.nextuberMutations) return;
  var button = document.getElementById('btnConfirmArchiveStudent');
  button.disabled = true;
  button.textContent = 'Arquivando...';
  try {
    var result = await window.nextuberMutations.archiveStudent(
      String(S.ests[idx].id),
      document.getElementById('archiveStudentReason').value
    );
    S.archived.push(mkEstObj(result.student));
    S.ests.splice(idx, 1);
    overlay.classList.remove('open');
    delete overlay.dataset.studentId;
    closePanel();
    renderArchivedStudents();
    renderProductionAuditHistory();
    renderCadList();
    renderOverviewAll();
    renderRanking();
    alert('Estagiário arquivado. O histórico ficará disponível por 6 meses.');
  } catch(error) {
    alert(error.message || 'Não foi possível arquivar o estagiário.');
  } finally {
    button.disabled = false;
    button.textContent = 'Confirmar arquivamento';
  }
}

// ── CADASTRO ───────────────────────────────────────────────────────────────


function abrirPermissoesGestor(id){
  var g = S.gestores.find(function(x){ return x.id === id; });
  if(!g) return;
  var perms = g.permissoes || {};
  var tipo = g.tipo_gestor || 'ga';

  document.getElementById('permGestorId').value = id;
  document.getElementById('permGestorNome').textContent = g.nome;

  // Carregar tipo de gestor
  var tipoGA = document.getElementById('tipoGA');
  var tipoGGA = document.getElementById('tipoGGA');
  var tipoFacilitador = document.getElementById('tipoFacilitador');
  var tipoLiderRegional = document.getElementById('tipoLiderRegional');
  tipoGA.checked = (tipo === 'ga');
  tipoGGA.checked = (tipo === 'gga');
  tipoFacilitador.checked = (tipo === 'facilitador');
  tipoLiderRegional.checked = (tipo === 'lider_regional');

  // Carregar permissões
  document.getElementById('permTrilhas').checked = !!perms.trilhas;
  document.getElementById('permRanking').checked = !!perms.ranking;
  document.getElementById('permTodosEstag').checked = !!perms.todos_estagiarios;
  document.getElementById('permConfiguracoes').checked = !!perms.configuracoes;

  // Limpar campo de nova senha sempre que abrir
  document.getElementById('permNovaSenha').value = '';

  function habilitarPermissoesGestor(){
    ['permTrilhas','permRanking','permTodosEstag','permConfiguracoes'].forEach(function(field){
      document.getElementById(field).disabled = false;
    });
  }
  tipoGA.onchange = function(){ if(this.checked) habilitarPermissoesGestor(); };
  tipoGGA.onchange = function(){
    if(!this.checked) return;
    ['permTrilhas','permRanking','permTodosEstag','permConfiguracoes'].forEach(function(field){
      document.getElementById(field).checked = true;
    });
    habilitarPermissoesGestor();
  };
  tipoFacilitador.onchange = function(){
    if(!this.checked) return;
    ['permTrilhas','permRanking','permTodosEstag','permConfiguracoes'].forEach(function(field){
      document.getElementById(field).checked = true;
    });
    habilitarPermissoesGestor();
  };
  tipoLiderRegional.onchange = function(){
    if(!this.checked) return;
    // O acesso do gerente regional é limitado no servidor à regional vinculada.
    document.getElementById('permTrilhas').checked = true;
    document.getElementById('permRanking').checked = true;
    document.getElementById('permTodosEstag').checked = true;
    habilitarPermissoesGestor();
  };

  document.getElementById('permissoesOv').classList.add('open');
}

async function salvarPermissoesGestor(){
  var id = document.getElementById('permGestorId').value;
  var novaSenha = document.getElementById('permNovaSenha').value.trim();
  var tipoGestor = document.querySelector('input[name="permTipoGestor"]:checked').value;

  // Validar nova senha (se preenchida)
  if(novaSenha && novaSenha.length < 4){
    alert('A nova senha deve ter pelo menos 4 caracteres.');
    return;
  }

  var permissoes = {
    trilhas: document.getElementById('permTrilhas').checked,
    ranking: document.getElementById('permRanking').checked,
    todos_estagiarios: document.getElementById('permTodosEstag').checked,
    configuracoes: document.getElementById('permConfiguracoes').checked
  };

  var r;
  try {
    if(!window.nextuberMutations) throw new Error('Serviço de gestores indisponível.');
    r = await window.nextuberMutations.updateManager(String(id), {
      permissions: permissoes,
      managerType: tipoGestor,
      password: novaSenha || ''
    });
  } catch(error) {
    alert('Erro ao salvar: ' + (error.message || error));
    return;
  }
  if(r.manager){
    var i = S.gestores.findIndex(function(g){ return g.id === id; });
    if(i>=0) S.gestores[i] = r.manager;
    // Se o gestor logado é esse, atualizar também
    if(gestorLogado && gestorLogado.id === id){
      gestorLogado = r.manager;
      if(modoGestor) applyModoGestor();
    }
  }
  document.getElementById('permissoesOv').classList.remove('open');
  renderGestoresList();

  if(novaSenha){
    alert('Senha redefinida com sucesso! A nova senha é: ' + novaSenha.slice(0,4));
  } else {
    alert('Permissões salvas com sucesso!');
  }
}

function temPermissao(perm){
  if(!modoGestor || !gestorLogado) return false;
  var p = gestorLogado.permissoes || {};
  return !!p[perm];
}


function normalizeGestorBusca(value){
  return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
}

function populateGestorRegionalSelect(selectId, selectedValue){
  var select = document.getElementById(selectId);
  if(!select) return;
  var currentValue = selectedValue !== undefined ? String(selectedValue||'') : String(select.value||'');
  select.innerHTML = '<option value="">Selecione a regional</option>';
  (S.regionais||[]).forEach(function(regional){
    var option = document.createElement('option');
    option.value = String(regional.id);
    option.textContent = regional.nome;
    select.appendChild(option);
  });
  var hasCurrentValue = Array.from(select.options).some(function(option){ return option.value === currentValue; });
  if(hasCurrentValue && currentValue){
    select.value = currentValue;
    return;
  }
  var activeRegional = S.selectedRegionalId && S.selectedRegionalId !== 'all' ? String(S.selectedRegionalId) : '';
  var hasActiveRegional = Array.from(select.options).some(function(option){ return option.value === activeRegional; });
  select.value = hasActiveRegional ? activeRegional : '';
}

function abrirEditarGestor(id){
  var g = S.gestores.find(function(item){ return String(item.id) === String(id); });
  if(!g || !editor) return;
  document.getElementById('editarGestorId').value = g.id;
  document.getElementById('editarGestorNome').value = g.nome || '';
  document.getElementById('editarGestorAgencia').value = g.agencia || '';
  populateGestorRegionalSelect('editarGestorRegional', g.regional_id || '');
  document.getElementById('editarGestorFuncional').textContent = 'Funcional: #' + (g.funcional || '—');
  document.getElementById('editarGestorOv').classList.add('open');
  setTimeout(function(){ document.getElementById('editarGestorNome').focus(); }, 80);
}

async function salvarDadosGestor(){
  var id = document.getElementById('editarGestorId').value;
  var nome = document.getElementById('editarGestorNome').value.trim();
  var agencia = document.getElementById('editarGestorAgencia').value.trim();
  var regionalId = document.getElementById('editarGestorRegional').value;
  if(!nome){ alert('Preencha o nome do gestor.'); return; }
  if(!agencia){ alert('Preencha a agência do gestor.'); return; }
  if(!regionalId){ alert('Selecione a regional do gestor.'); return; }
  var btn = document.getElementById('btnSalvarGestor');
  btn.disabled = true;
  btn.textContent = 'Salvando...';
  try {
    if(!window.nextuberMutations) throw new Error('Serviço de gestores indisponível.');
    var r = await window.nextuberMutations.updateManager(String(id), {name:nome, agency:agencia, regionalId:regionalId});
    if(r.manager){
      var idx = S.gestores.findIndex(function(g){ return String(g.id) === String(id); });
      if(idx >= 0) S.gestores[idx] = r.manager;
      if(gestorLogado && String(gestorLogado.id) === String(id)) gestorLogado = r.manager;
    }
    document.getElementById('editarGestorOv').classList.remove('open');
    renderGestoresList();
    alert('Dados do gestor salvos.');
  } catch(error) {
    alert('Erro ao salvar: ' + (error.message || error));
  } finally {
    btn.disabled = false;
    btn.textContent = 'Salvar alterações';
  }
}

function renderGestoresList(){
  var sec = document.getElementById('gestoresSection');
  if(sec) sec.style.display = editor ? 'block' : 'none';
  populateGestorRegionalSelect('gestorRegional');
  var el = document.getElementById('gestoresList');
  var countEl = document.getElementById('gestoresCount');
  var searchInput = document.getElementById('gestorBusca');
  var agencyFilter = document.getElementById('gestorFiltroAgencia');
  var searchWrap = searchInput ? searchInput.closest('.gestor-search-wrap') : null;
  var searchSummary = document.getElementById('gestorBuscaResumo');
  if(!el) return;
  var gestoresAtivos = (typeof getGestoresAtivos === 'function') ? getGestoresAtivos() : S.gestores;
  gestoresAtivos = gestoresAtivos || [];
  var selectedAgency = agencyFilter ? agencyFilter.value : '';
  if(agencyFilter){
    var agencies = Array.from(new Set(gestoresAtivos.map(function(g){ return String(g.agencia||'').trim(); }).filter(Boolean))).sort(function(a,b){ return a.localeCompare(b, 'pt-BR', {numeric:true}); });
    agencyFilter.innerHTML = '<option value="">Todas as agências</option>' + agencies.map(function(agency){
      return '<option value="'+escapeAttr(agency)+'"'+(agency===selectedAgency?' selected':'')+'>Agência '+escapeHtml(agency)+'</option>';
    }).join('');
    if(selectedAgency && agencies.indexOf(selectedAgency) === -1){ selectedAgency = ''; agencyFilter.value = ''; }
  }
  var searchTerm = normalizeGestorBusca(searchInput ? searchInput.value : '');
  var gestoresFiltrados = gestoresAtivos.filter(function(g){
    var matchesSearch = !searchTerm || normalizeGestorBusca(g.nome).includes(searchTerm) || normalizeGestorBusca(g.funcional).includes(searchTerm);
    var matchesAgency = !selectedAgency || String(g.agencia||'').trim() === selectedAgency;
    return matchesSearch && matchesAgency;
  });
  if(searchWrap) searchWrap.classList.toggle('has-value', !!searchTerm);
  if(countEl) countEl.textContent = gestoresFiltrados.length;
  if(searchSummary){
    searchSummary.textContent = (searchTerm || selectedAgency)
      ? gestoresFiltrados.length+' de '+gestoresAtivos.length+' gestor'+(gestoresAtivos.length===1?'':'es')+' encontrado'+(gestoresFiltrados.length===1?'':'s')
      : '';
  }
  if(!gestoresFiltrados.length){
    el.innerHTML = '<div class="cad-list-empty">'+((searchTerm||selectedAgency)?'Nenhum gestor encontrado com os filtros selecionados.':'Nenhum gestor cadastrado nesta regional.')+'</div>';
    return;
  }
  el.innerHTML = gestoresFiltrados.map(function(g){
    var regional = (S.regionais||[]).find(function(item){ return String(item.id) === String(g.regional_id||''); });
    var perms = g.permissoes || {};
    var pCount = Object.keys(perms).filter(function(k){ return perms[k]; }).length;
    var tipo = g.tipo_gestor || 'ga';
    var tipoBg = tipo === 'gga' ? '#FEE2E2' : (tipo === 'facilitador' ? '#DCFCE7' : (tipo === 'lider_regional' ? '#EDE9FE' : '#E0F2FE'));
    var tipoColor = tipo === 'gga' ? '#DC2626' : (tipo === 'facilitador' ? '#15803D' : (tipo === 'lider_regional' ? '#6D28D9' : '#0369A1'));
    var tipoLabel = tipo === 'gga' ? '👔 GGA' : (tipo === 'facilitador' ? '🤝 Facilitador' : (tipo === 'lider_regional' ? '🧭 Gerente Regional' : '👤 GA'));

    return '<div class="cad-list-row">'
      +'<div class="cad-list-av" style="background:var(--ink);color:#fff;">'+escapeHtml(g.nome[0].toUpperCase())+'</div>'
      +'<div class="cad-list-info">'
        +'<div class="cad-list-name">'+escapeHtml(g.nome)+'</div>'
        +'<div class="cad-list-meta"><span>#'+escapeHtml(g.funcional)+'</span><span>Ag. '+escapeHtml(g.agencia||'não informada')+'</span>'+(regional?'<span>Regional '+escapeHtml(regional.nome)+'</span>':'<span>Regional não informada</span>')+'<span style="background:'+tipoBg+';color:'+tipoColor+';padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;">'+tipoLabel+'</span>'+(pCount>0?'<span style="color:var(--or);font-weight:500;">'+pCount+' acesso'+(pCount>1?'s':'')+' extra</span>':'')+'</div>'
      +'</div>'
      +'<div class="gestor-row-actions">'
        +'<button class="cad-list-btn" data-editgestor="'+escapeAttr(g.id)+'" style="color:var(--ink2);">✎ Editar</button>'
        +'<button class="cad-list-btn" data-permgestor="'+escapeAttr(g.id)+'" style="color:var(--or);border-color:rgba(236,112,0,.3);'+(editor?'':'opacity:.5;cursor:default;pointer-events:none;')+'">⚙ Permissões</button>'
        +'<button class="cad-list-btn cad-del-btn" data-delgestor="'+escapeAttr(g.id)+'" style="color:#DC2626;border-color:#FECACA;">Remover</button>'
      +'</div>'
    +'</div>';
  }).join('');
  el.querySelectorAll('[data-delgestor]').forEach(function(btn){
    btn.addEventListener('click', async function(){
      var id = this.dataset.delgestor;
      var g = S.gestores.find(function(x){ return x.id === id; });
      if(!confirm('Remover o gestor "'+g.nome+'"?')) return;
      await deleteGestor(id);
      renderGestoresList();
    });
  });
  el.querySelectorAll('[data-permgestor]').forEach(function(btn){
    btn.addEventListener('click', function(){
      if(!editor) return; // Apenas tutora pode gerenciar permissões
      abrirPermissoesGestor(this.dataset.permgestor);
    });
  });
  el.querySelectorAll('[data-editgestor]').forEach(function(btn){
    btn.addEventListener('click', function(){ abrirEditarGestor(this.dataset.editgestor); });
  });
}

function renderCadChips(){
  renderCadList();
}
function renderCadList(){
  var estsAtivos = (typeof getEstagiariosAtivos === 'function') ? getEstagiariosAtivos() : S.ests;
  var ests = estsAtivos.filter(function(e){ return e.perfil && e.perfil.funcional; });
  document.getElementById('cadListCount').textContent = ests.length;
  if(ests.length===0){
    document.getElementById('cadList').innerHTML='<div class="cad-list-empty">Nenhum estagiário cadastrado ainda.</div>';
    return;
  }
  document.getElementById('cadList').innerHTML = ests.map(function(e,i){
    var realIdx = S.ests.indexOf(e);
    var tempo = e.perfil&&e.perfil.inicio ? calcTempo(e.perfil.inicio) : null;
    return '<div class="cad-list-row">'
      +'<div class="cad-list-av">'+escapeHtml(ini(e.nome))+'</div>'
      +'<div class="cad-list-info">'
        +'<div class="cad-list-name">'+escapeHtml(e.nome)+'</div>'
        +'<div class="cad-list-meta">'
          +(e.perfil.funcional?'<span>#'+escapeHtml(e.perfil.funcional)+'</span>':'')
          +(e.perfil.idade?'<span>'+escapeHtml(e.perfil.idade)+' anos</span>':'')
          +(tempo?'<span>'+tempo+'</span>':'')
        +'</div>'
      +'</div>'
      +'<div style="display:flex;gap:6px;">'
      +'<button class="cad-list-btn" data-idx="'+realIdx+'">Editar</button>'
      +'<button class="cad-list-btn cad-del-btn" data-delidx="'+realIdx+'" style="color:#DC2626;border-color:#FECACA;">Excluir</button>'
      +'</div>'
      +'</div>';
  }).join('');
  document.getElementById('cadList').querySelectorAll('.cad-list-btn:not(.cad-del-btn)').forEach(function(btn){
    btn.addEventListener('click', function(){ loadEditCad(parseInt(this.dataset.idx)); });
  });
  document.getElementById('cadList').querySelectorAll('.cad-del-btn').forEach(function(btn){
    btn.addEventListener('click', async function(){
      var idx = parseInt(this.dataset.delidx);
      var e = S.ests[idx];
      if(!confirm('Excluir o estagiário "'+e.nome+'"? Esta ação não pode ser desfeita.')) return;
      if(e.id){
        try {
          await deleteEstagiario(e.id);
        } catch(error) {
          alert('Erro ao excluir: ' + (error.message||error));
          return;
        }
      }
      S.ests.splice(idx, 1);
      persist(true);
      renderCards();
      renderCadList();
    });
  });
}
function populateCadRegionaisSelect(){
  var sel = document.getElementById('cadRegional');
  if(!sel) return;
  var currentVal = sel.value;
  sel.innerHTML = '';
  (S.regionais||[]).forEach(function(r){
    var opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = r.nome;
    sel.appendChild(opt);
  });
  if(currentVal) sel.value = currentVal;
  else if(S.selectedRegionalId) sel.value = S.selectedRegionalId;
}

function loadEditCad(idx){
  if(!editor && !isGGA()) return;
  var e = S.ests[idx];
  cadIdx = idx;
  document.getElementById('cadNome').value = e.nome;
  populateCadRegionaisSelect();
  var regEl = document.getElementById('cadRegional');
  if(regEl && e.regional_id) regEl.value = e.regional_id;
  document.getElementById('cadFunc').value = e.perfil&&e.perfil.funcional?e.perfil.funcional:'';
  var agEl = document.getElementById('cadAgencia');
  if(agEl) agEl.value = e.perfil&&e.perfil.agencia?e.perfil.agencia:'';
  document.getElementById('cadInicio').value = e.perfil&&e.perfil.inicio?e.perfil.inicio:'';
  var gaEl = document.getElementById('cadGAFunc');
  if(gaEl) gaEl.value = e.perfil&&e.perfil.ga_funcional?e.perfil.ga_funcional:'';
  var ggaEl = document.getElementById('cadGGAFunc');
  if(ggaEl) ggaEl.value = e.perfil&&e.perfil.gga_funcional?e.perfil.gga_funcional:'';
  var certEl = document.getElementById('cadCertificacao');
  if(certEl) certEl.value = e.perfil&&e.perfil.certificacao?e.perfil.certificacao:'';
  if(e.perfil&&e.perfil.mes_aniversario){
    var anivParts = e.perfil.mes_aniversario.split('-');
    var diaEl = document.getElementById('cadAnivDia');
    var mesEl = document.getElementById('cadAnivMes');
    if(diaEl) diaEl.value = anivParts[0]||'';
    if(mesEl) mesEl.value = anivParts[1]||'';
  }
  updateCadPreview();
  document.getElementById('cadAddBtn').textContent = '✓ Salvar alterações';
  document.getElementById('cadNome').scrollIntoView({behavior:'smooth', block:'center'});
  document.getElementById('cadNome').focus();
}
function updateCadPreview(){
  var nome = document.getElementById('cadNome').value.trim();
  var av = document.getElementById('cadAv');
  var prevName = document.getElementById('cadPreviewName');
  var prevSub = document.getElementById('cadPreviewSub');
  if(nome){
    av.textContent = ini(nome);
    av.classList.add('filled');
    prevName.textContent = nome;
    prevSub.textContent = 'Pronto para adicionar';
  } else {
    av.textContent = '?';
    av.classList.remove('filled');
    prevName.textContent = 'Novo estagiário';
    prevSub.textContent = 'Preencha o nome para começar';
  }
}
async function savePerfil(){
  if(!editor && !isGGA()){ return; }
  var nome = document.getElementById('cadNome').value.trim();
  if(!nome){ document.getElementById('cadNome').focus(); return; }
  var func = document.getElementById('cadFunc').value.replace(/[^0-9]/g,'').slice(0,9);
  var agencia = ((document.getElementById('cadAgencia')||{}).value||'').trim();
  var selectedRegionalId = (document.getElementById('cadRegional')||{}).value || S.selectedRegionalId;
  var gaVal = (document.getElementById('cadGAFunc')||{}).value||'';
  var ggaVal = (document.getElementById('cadGGAFunc')||{}).value||'';
  var anivDia = (document.getElementById('cadAnivDia')||{}).value||'';
  var anivMes = (document.getElementById('cadAnivMes')||{}).value||'';
  var mesAniversario = (anivDia && anivMes) ? anivDia+'-'+anivMes : null;
  var perfil = {
    funcional: func,
    agencia: agencia,
    inicio: document.getElementById('cadInicio').value,
    ga_funcional: gaVal.replace(/[^0-9]/g,'').slice(0,9),
    gga_funcional: ggaVal.replace(/[^0-9]/g,'').slice(0,9),
    certificacao: document.getElementById('cadCertificacao').value || null,
    mes_aniversario: mesAniversario
  };

  // Validate
  if(!func || func.length < 9){ alert('Funcional deve ter 9 dígitos.'); return; }

  var estagiario;
  if(cadIdx >= 0){
    // editing existing — preserve trilha_manual and ultima_atualizacao_prod
    if(S.ests[cadIdx].perfil && S.ests[cadIdx].perfil.trilha_manual){
      perfil.trilha_manual = S.ests[cadIdx].perfil.trilha_manual;
    }
    if(S.ests[cadIdx].perfil && S.ests[cadIdx].perfil.ultima_atualizacao_prod){
      perfil.ultima_atualizacao_prod = S.ests[cadIdx].perfil.ultima_atualizacao_prod;
    }
    S.ests[cadIdx].nome = nome;
    if(selectedRegionalId) S.ests[cadIdx].regional_id = selectedRegionalId;
    S.ests[cadIdx].perfil = perfil;
    estagiario = S.ests[cadIdx];
  } else {
    // Check funcional duplicate
    var dup = S.ests.find(function(e){ return e.perfil && e.perfil.funcional === func; });
    if(dup){ alert('Já existe um estagiário com este funcional.'); return; }
    // Always create new (no slot recycling)
    estagiario = {
      nome: nome,
      regional_id: selectedRegionalId,
      meses: Array(6).fill('⬜ Pendente'),
      obs: '',
      atencao: false,
      perfil: perfil,
      trilhaChecks: {}
    };
    S.ests.push(estagiario);
  }

  await saveEstagiario(estagiario);

  if(!estagiario.id){
    alert('Erro ao salvar. Tente novamente.');
    // Remove from local state if save failed
    if(cadIdx < 0) S.ests.pop();
    return;
  }

  persist(true);
  renderCards();
  renderCadList();

  // reset form
  cadIdx = -1;
  ['cadNome','cadFunc','cadAgencia','cadInicio','cadGAFunc','cadGGAFunc','cadCertificacao','cadAnivDia','cadAnivMes'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('cadAddBtn').textContent = '+ Adicionar estagiário';
  document.getElementById('cadAv').textContent = '?';
  document.getElementById('cadAv').classList.remove('filled');
  document.getElementById('cadPreviewName').textContent = 'Novo estagiário';
  document.getElementById('cadPreviewSub').textContent = 'Preencha o nome para começar';
  var b = document.getElementById('cadSavedLbl');
  if(b){ b.classList.add('show'); setTimeout(function(){ b.classList.remove('show'); }, 2500); }
}
function selectCad(idx){ loadEditCad(idx); }

// ── TRILHAS ────────────────────────────────────────────────────────────────
function renderTrilha(){
  var t=TRILHAS[activeTrilha];
  var cor=t.cor;
  var html='<div class="t-header" style="border-left-color:'+cor+'">'
    +'<h2 style="color:'+cor+'">'+t.titulo+'</h2>'
    +'<div class="tdesc">'+t.descricao+'</div>'
    +'<div class="tfrase" style="color:'+cor+'">'+t.frase+'</div>'
    +'</div>';
  t.topicos.forEach(function(tp,i){
    html+='<div class="t-topico">'
      +'<div class="t-topico-hd">'
        +'<div class="t-num" style="background:'+cor+'">'+(i+1)+'</div>'
        +'<div><div class="t-tema">'+tp.tema+'</div><div class="t-obj">'+tp.obj+'</div></div>'
      +'</div>'
      +'<div class="t-body" style="grid-template-columns:1fr 1fr;">'
        +'<div class="t-col">'
          +'<div class="t-col-ttl">Ações e atividades</div>'
          +tp.acoes.map(function(a){return '<div class="t-acao"><span class="t-bullet" style="background:'+cor+'"></span>'+a+'</div>';}).join('')
        +'</div>'
        +'<div class="t-col" style="border-right:none;">'
          +'<div class="t-col-ttl">Checklist de acompanhamento</div>'
          +tp.checks.map(function(c){return '<div class="t-acao"><span class="t-bullet" style="background:'+cor+'"></span>'+c+'</div>';}).join('')
          +'<div style="margin-top:14px"><div class="t-col-ttl">Papel da tutora</div><div class="t-tutora">'+tp.tutora+'</div></div>'
        +'</div>'
      +'</div>'
    +'</div>';
  });
  document.getElementById('trilhaContent').innerHTML=html;
}

// ── NAVIGATION ─────────────────────────────────────────────────────────────
function goPage(id){
  // Bloqueio de acesso por permissão
  // Cadastro e descricao são SÓ TUTORA — gestor nunca acessa
  var paginasSoTutora = ['configuracoes'];
  var paginasTutoraOuGGA = ['cadastro'];
  if(paginasSoTutora.indexOf(id) >= 0 && !editor){
    var managerPermissions = (gestorLogado && gestorLogado.permissoes) || {};
    if(!modoGestor || managerPermissions.configuracoes !== true) id = 'overview';
  }
  if(paginasTutoraOuGGA.indexOf(id) >= 0 && !editor && !(modoGestor && isGGA())){
    id = 'overview';
  }
  // Trilhas/conteúdos: tutora sempre, gestor se tiver permissão, visitante não
  if(id === 'trilhas' && !editor){
    if(!modoGestor){
      id = 'overview';
    } else {
      var p = (gestorLogado && gestorLogado.permissoes) || {};
      if(!p[id]) id = 'overview';
    }
  }
  // Estagiários: gestor pode, mas visitante não
  if(id === 'estagiarios' && !editor && !modoGestor){
    id = 'overview';
  }
  document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
  document.querySelectorAll('.drawer-item').forEach(function(b){b.classList.remove('active');});
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  var pg=document.getElementById('page-'+id);
  if(pg) pg.classList.add('active');
  document.querySelectorAll('.nav-item[data-page="'+id+'"],.drawer-item[data-page="'+id+'"]').forEach(function(el){el.classList.add('active');});
  if(id==='overview'){ renderOverviewAll(); renderRanking(); }

  if(id==='estagiarios'){
    var lock = document.getElementById('estagLock');
    var content = document.getElementById('estagContent');
    if(editor || modoGestor){
      if(lock) lock.style.display='none';
      if(content) content.style.display='block';
      renderCards();
      renderArchivedStudents();
    } else {
      if(lock) lock.style.display='flex';
      if(content) content.style.display='none';
    }
  }
  if(id==='trilhas') renderTrilha();
  if(id==='cadastro'){ cadIdx=-1; document.getElementById('cadAddBtn').textContent='+ Adicionar estagiário'; renderGestoresList(); ['cadNome','cadFunc','cadAgencia','cadInicio','cadGAFunc','cadGGAFunc','cadCertificacao','cadAnivDia','cadAnivMes'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';}); updateCadPreview(); setCadInputState(); renderCadList(); }
}

// ── AUTH ───────────────────────────────────────────────────────────────────
function openLogin(){ document.getElementById('loginPwd').value=''; document.getElementById('loginErr').classList.remove('show'); document.getElementById('loginOv').classList.add('open'); setTimeout(function(){document.getElementById('loginPwd').focus();},80); }
function cancelLogin(){ document.getElementById('loginOv').classList.remove('open'); }
async function doLogin(){
  var input = document.getElementById('loginPwd');
  var errEl = document.getElementById('loginErr');
  var btn = document.getElementById('btnLogin');
  errEl.classList.remove('show');
  if(!window.nextuberAuth){
    errEl.textContent = 'Autenticação indisponível. Recarregue a página.';
    errEl.classList.add('show');
    return;
  }
  if(btn) btn.disabled = true;
  try {
    await window.nextuberAuth.loginTutor(input.value);
    document.getElementById('loginOv').classList.remove('open');
    input.value = '';
    await loadFromDB();
  } catch(e) {
    errEl.textContent = (e && e.message) ? e.message : 'Senha incorreta.';
    errEl.classList.add('show');
    input.value='';
    input.focus();
  } finally {
    if(btn) btn.disabled = false;
  }
}
function setCadInputState(){
  var dis=!editor && !isGGA();
  ['cadNome','cadFunc','cadAgencia','cadInicio','cadGAFunc','cadGGAFunc','cadCertificacao','cadAnivDia','cadAnivMes'].forEach(function(id){
    var el=document.getElementById(id); if(el) el.disabled=dis;
  });
  var btn=document.getElementById('cadAddBtn'); if(btn) btn.disabled=dis;
}

function applyModoGestor(){
  var btn = document.getElementById('modeBtn');
  var mbtn = document.getElementById('mobileModeBtn');
  var dbtn = document.getElementById('drawerModeBtn');
  var banner = document.getElementById('banner');
  var lbl = 'Sair (' + (gestorLogado ? gestorLogado.nome : 'Gestor') + ')';
  if(btn){ btn.textContent = lbl; btn.classList.add('on'); }
  if(mbtn){ mbtn.textContent = 'Sair'; mbtn.classList.add('on'); }
  if(dbtn){ dbtn.textContent = lbl; dbtn.classList.add('on'); }
  if(banner) banner.classList.add('gone');
  // Esconder itens tutora-only
  document.querySelectorAll('[data-tutora="only"]').forEach(function(el){ el.style.display='none'; });
  // Acompanhamento SEMPRE liberado para o gestor (acesso obrigatório)
  document.querySelectorAll('[data-page="estagiarios"]').forEach(function(el){ el.style.display=''; });
  // Aplicar permissões customizadas: liberar áreas extras
  var p = (gestorLogado && gestorLogado.permissoes) || {};
  if(p.trilhas){
    document.querySelectorAll('[data-page="trilhas"]').forEach(function(el){ el.style.display=''; });
  }
  var podeVerConfiguracoes = p.configuracoes === true;
  var configNavSection = document.getElementById('configNavSection');
  var configDrawerLabel = document.getElementById('configDrawerLabel');
  if(configNavSection) configNavSection.style.display = podeVerConfiguracoes ? '' : 'none';
  if(configDrawerLabel) configDrawerLabel.style.display = podeVerConfiguracoes ? '' : 'none';
  document.querySelectorAll('[data-page="configuracoes"]').forEach(function(el){
    el.style.display = podeVerConfiguracoes ? '' : 'none';
  });
  // GGA: acesso a cadastro e todos os estagiários
  if(isGGA()){
    document.querySelectorAll('[data-page="cadastro"]').forEach(function(el){ el.style.display=''; });
    document.querySelectorAll('[data-page="trilhas"]').forEach(function(el){ el.style.display=''; });
  }
  // Esconder botão "Editar banner"
  var btnEditBanner = document.getElementById('btnEditarBanner');
  if(btnEditBanner) btnEditBanner.style.display = 'none';
  // Mostrar botão "Meu perfil"
  var btnMp = document.getElementById('btnMeuPerfil');
  if(btnMp) btnMp.style.display = 'block';
  var dMp = document.getElementById('drawerMeuPerfil');
  if(dMp) dMp.style.display = 'block';
  renderCards();
  goPage('overview');
}

async function logoutGestor(){
  if(window.nextuberAuth) await window.nextuberAuth.logout().catch(function(){});
  modoGestor = false;
  gestorLogado = null;
  window.modoGestor = false;
  window.gestorLogado = null;
  window.editor = false;
  await loadFromDB();
  goPage('overview');
}

function openLoginModal(){
  // Fechar drawer mobile (se aberto)
  var drawer = document.getElementById('drawer');
  var drawerOv = document.getElementById('drawerOverlay');
  if(drawer) drawer.classList.remove('open');
  if(drawerOv) drawerOv.classList.remove('open');

  var tw = document.getElementById('loginTipoWrap');
  var ttw = document.getElementById('loginTutoraWrap');
  var gw = document.getElementById('loginGestorWrap');
  if(tw) tw.style.display = 'block';
  if(ttw) ttw.style.display = 'none';
  if(gw) gw.style.display = 'none';
  document.getElementById('loginOv').classList.add('open');
}

function applyMode(){
  if(modoGestor){ applyModoGestor(); return; }
  // Itens tutora-only: visíveis SÓ para a tutora; escondidos para visitantes anônimos
  document.querySelectorAll('[data-tutora="only"]').forEach(function(el){
    el.style.display = editor ? '' : 'none';
  });
  // Mostrar botão "Editar banner" para tutora
  var btnEditBanner = document.getElementById('btnEditarBanner');
  if(btnEditBanner) btnEditBanner.style.display = editor ? 'block' : 'none';
  // Esconder botão "Meu perfil"
  var btnMp = document.getElementById('btnMeuPerfil');
  if(btnMp) btnMp.style.display = 'none';
  var dMp = document.getElementById('drawerMeuPerfil');
  if(dMp) dMp.style.display = 'none';
  var btn=document.getElementById('modeBtn');
  var mbtn=document.getElementById('mobileModeBtn');
  var dbtn=document.getElementById('drawerModeBtn');
  var banner=document.getElementById('banner');
  if(editor){
    btn.innerHTML='<span class="mode-pulse"></span>Sair do modo edição'; btn.classList.add('on');
    mbtn.textContent='Sair'; mbtn.classList.add('on');
    dbtn.textContent='Sair do modo edição'; dbtn.classList.add('on');
    if(banner) banner.classList.add('gone');
  } else {
    btn.textContent='Fazer login'; btn.classList.remove('on');
    mbtn.textContent='Login'; mbtn.classList.remove('on');
    dbtn.textContent='Fazer login'; dbtn.classList.remove('on');
    if(banner) banner.classList.remove('gone');
  }
  // If on estagiarios page, re-evaluate lock
  if(document.getElementById('page-estagiarios').classList.contains('active')){
    var lock2 = document.getElementById('estagLock');
    var content2 = document.getElementById('estagContent');
    if(editor || modoGestor){
      if(lock2) lock2.style.display='none';
      if(content2) content2.style.display='block';
      renderCards();
    } else {
      if(lock2) lock2.style.display='flex';
      if(content2) content2.style.display='none';
    }
  } else {
    renderCards();
  }
  setCadInputState();
  var _pIdx = getPanelEstIdx();
  if(_pIdx>=0){
    document.getElementById('obsTA').disabled=!editor;
    document.getElementById('btnObs').disabled=!editor;
    document.getElementById('obsHint').textContent=editor?'Salvo localmente no navegador.':'Entre como tutora para editar.';
    renderPanelTrilha(_pIdx);
    updateAtencaoBtn(_pIdx);
    renderAvaliacao(_pIdx);
    renderResultados(_pIdx);
  }

  renderRanking();
  renderOverviewAll();
}

// ── EXPORTAÇÃO EXCEL ───────────────────────────────────────────────────────
function openExportModal(){
  var ov = document.getElementById('exportOv');
  if(!ov) return;
  var container = document.getElementById('exportTriCheckboxes');
  var tris = ultimosTrimestres();
  container.innerHTML = tris.map(function(tri, i){
    return '<label style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:6px 10px;border:1px solid var(--border);border-radius:8px;background:var(--bg);">'
      +'<input type="checkbox" value="'+tri+'"'+(i===0?' checked':'')+' style="width:16px;height:16px;accent-color:var(--or);">'
      +'<span style="font-size:14px;color:var(--ink);">'+fmtTrimestre(tri)+'</span>'
      +'</label>';
  }).join('');
  ov.classList.add('open');
}

function closeExportModal(){
  var ov = document.getElementById('exportOv');
  if(ov) ov.classList.remove('open');
}

async function exportToExcel(){
  if(typeof XLSX === 'undefined' && window.loadNextuberXLSX){
    try { await window.loadNextuberXLSX(); }
    catch(e){ alert('Erro: biblioteca de exportação não carregou. Recarregue a página e tente novamente.'); return; }
  }
  if(typeof XLSX === 'undefined'){ alert('Erro: biblioteca de exportação não carregou. Recarregue a página e tente novamente.'); return; }
  // Carregar agendamentos ANTES de exportar (para incluir na aba)
  if(typeof carregarAgendamentos === 'function'){
    carregarAgendamentos().then(function(){ exportToExcelSync(); });
  } else {
    exportToExcelSync();
  }
}

function exportToExcelSync(){
  var container = document.getElementById('exportTriCheckboxes');
  var checkedTris = [];
  container.querySelectorAll('input[type=checkbox]:checked').forEach(function(cb){
    checkedTris.push(cb.value);
  });
  if(!checkedTris.length){ alert('Selecione ao menos um trimestre.'); return; }

  // Determinar lista de estagiários (gestor vê só os seus, tutora vê todos)
  var lista = getEstagiariosAtivos();
  if(modoGestor && gestorLogado){
    var p = gestorLogado.permissoes || {};
    if(!p.todos_estagiarios && !isGGA() && !isGerenteRegional()){
      lista = getEstagiariosAtivos().filter(function(e){
        return e.perfil && (e.perfil.ga_funcional === gestorLogado.funcional || e.perfil.gga_funcional === gestorLogado.funcional);
      });
    }
  }

  if(!lista.length){ alert('Nenhum estagiário para exportar.'); return; }

  var wb = XLSX.utils.book_new();

  // ═══════════════════════════════════════════════════════════
  // ABA 1: RESUMO GERAL (dados cadastrais + nota + totais)
  // ═══════════════════════════════════════════════════════════
  var headerResumo = ['Nome','Funcional','Agência','Data início','Tempo no programa','Trilha','Certificação','Alvo contatos/dia'];
  checkedTris.forEach(function(tri){
    var label = fmtTrimestre(tri);
    headerResumo.push(
      'Alvo '+label,
      'Crédito '+label,
      '% Crédito '+label,
      'Produtos '+label,
      '% Produtos '+label,
      'Produção total '+label,
      'Nota '+label
    );
  });

  var rowsResumo = lista.map(function(e){
    var trilhaKey = getEffectiveTrilhaKey(e);
    var trilhaNome = trilhaKey ? {iniciante:'Decolar',intermediario:'Evoluir',avancado:'Impactar'}[trilhaKey] : '—';
    var tempo = (e.perfil && e.perfil.inicio) ? calcTempo(e.perfil.inicio) : '—';
    var row = [
      e.nome || '—',
      (e.perfil && e.perfil.funcional) || '—',
      (e.perfil && e.perfil.agencia) || '—',
      (e.perfil && e.perfil.inicio) ? fmtDate(e.perfil.inicio) : '—',
      tempo,
      trilhaNome,
      (e.perfil && e.perfil.certificacao) || '—',
      getMetaContatos(e.id) || 0
    ];
    checkedTris.forEach(function(tri){
      var prod = getProducaoTri(e.id, tri);
      var meta = parseFloat(prod.meta)||0;

      // Crédito
      var producaoCredito = getTotalTrimestreModalidades(e.id, tri);
      if(producaoCredito === 0){
        var totalMes = getTotalMensal(e.id, tri);
        producaoCredito = totalMes > 0 ? totalMes : (parseFloat(prod.producao)||0);
      }
      var pctCredito = meta>0 ? Math.round(Math.min(producaoCredito/meta, 1)*100) : 0;

      // Produtos
      var metaProdutos = meta * 0.2;
      var producaoProdutos = getTotalTrimestreOutros(e.id, tri);
      var pctProdutos = metaProdutos>0 ? Math.round(Math.min(producaoProdutos/metaProdutos, 1)*100) : 0;

      var nota = calcScore(e, tri);
      var totalGeral = producaoCredito + producaoProdutos;

      row.push(meta, producaoCredito, pctCredito+'%', producaoProdutos, pctProdutos+'%', totalGeral, nota);
    });
    return row;
  });

  var wsResumo = XLSX.utils.aoa_to_sheet([headerResumo].concat(rowsResumo));
  var colsResumo = [{wch:25},{wch:12},{wch:10},{wch:12},{wch:18},{wch:14},{wch:12},{wch:14}];
  checkedTris.forEach(function(){
    colsResumo.push({wch:14},{wch:14},{wch:12},{wch:14},{wch:12},{wch:16},{wch:10});
  });
  wsResumo['!cols'] = colsResumo;
  XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo Geral');

  // ═══════════════════════════════════════════════════════════
  // ABA 2: CRÉDITO DETALHADO (INSS, OP, EP, Creditário por semana)
  // ═══════════════════════════════════════════════════════════
  var headerCredito = ['Nome','Funcional','Agência','Trimestre','Mês','Modalidade','Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Total mês'];
  var rowsCredito = [];
  lista.forEach(function(e){
    checkedTris.forEach(function(tri){
      var meses = getMesesTrimestre(tri);
      for(var mi = 1; mi <= 3; mi++){
        MODALIDADES.forEach(function(mod, modIdx){
          var s1 = getProducaoSemanalModalidade(e.id, tri, mi, 1, modIdx);
          var s2 = getProducaoSemanalModalidade(e.id, tri, mi, 2, modIdx);
          var s3 = getProducaoSemanalModalidade(e.id, tri, mi, 3, modIdx);
          var s4 = getProducaoSemanalModalidade(e.id, tri, mi, 4, modIdx);
          var s5 = quantidadeSemanasMes(tri, mi) >= 5 ? getProducaoSemanalModalidade(e.id, tri, mi, 5, modIdx) : 0;
          var tot = s1+s2+s3+s4+s5;
          if(tot > 0){ // só inclui linhas com valores
            rowsCredito.push([
              e.nome, (e.perfil&&e.perfil.funcional)||'—', (e.perfil&&e.perfil.agencia)||'—',
              fmtTrimestre(tri), meses[mi-1].nome, mod, s1, s2, s3, s4, s5, tot
            ]);
          }
        });
      }
    });
  });
  if(rowsCredito.length === 0){
    rowsCredito.push(['Sem dados de crédito no período selecionado','','','','','','','','','','','']);
  }
  var wsCredito = XLSX.utils.aoa_to_sheet([headerCredito].concat(rowsCredito));
  wsCredito['!cols'] = [{wch:25},{wch:12},{wch:10},{wch:10},{wch:8},{wch:12},{wch:10},{wch:10},{wch:10},{wch:10},{wch:10},{wch:12}];
  XLSX.utils.book_append_sheet(wb, wsCredito, 'Crédito Detalhado');

  // ═══════════════════════════════════════════════════════════
  // ABA 3: OUTROS PRODUTOS DETALHADO (Seguros, PIC, etc por semana)
  // ═══════════════════════════════════════════════════════════
  var headerProd = ['Nome','Funcional','Agência','Trimestre','Mês','Produto','Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Total mês'];
  var rowsProd = [];
  lista.forEach(function(e){
    checkedTris.forEach(function(tri){
      var meses = getMesesTrimestre(tri);
      for(var mi = 1; mi <= 3; mi++){
        OUTROS_PRODUTOS.forEach(function(prod, prodIdx){
          var s1 = getProducaoOutroProduto(e.id, tri, mi, 1, prodIdx);
          var s2 = getProducaoOutroProduto(e.id, tri, mi, 2, prodIdx);
          var s3 = getProducaoOutroProduto(e.id, tri, mi, 3, prodIdx);
          var s4 = getProducaoOutroProduto(e.id, tri, mi, 4, prodIdx);
          var s5 = quantidadeSemanasMes(tri, mi) >= 5 ? getProducaoOutroProduto(e.id, tri, mi, 5, prodIdx) : 0;
          var tot = s1+s2+s3+s4+s5;
          if(tot > 0){
            rowsProd.push([
              e.nome, (e.perfil&&e.perfil.funcional)||'—', (e.perfil&&e.perfil.agencia)||'—',
              fmtTrimestre(tri), meses[mi-1].nome, prod, s1, s2, s3, s4, s5, tot
            ]);
          }
        });
      }
    });
  });
  if(rowsProd.length === 0){
    rowsProd.push(['Sem dados de outros produtos no período selecionado','','','','','','','','','','','']);
  }
  var wsProd = XLSX.utils.aoa_to_sheet([headerProd].concat(rowsProd));
  wsProd['!cols'] = [{wch:25},{wch:12},{wch:10},{wch:10},{wch:8},{wch:14},{wch:10},{wch:10},{wch:10},{wch:10},{wch:10},{wch:12}];
  XLSX.utils.book_append_sheet(wb, wsProd, 'Outros Produtos');

  // ═══════════════════════════════════════════════════════════
  // ABA 4: CONTATOS (histórico semanal por estagiário)
  // ═══════════════════════════════════════════════════════════
  var headerCont = ['Nome','Funcional','Agência','Alvo/dia','Semana','Seg','Ter','Qua','Qui','Sex','Total semana','% do alvo'];
  var rowsCont = [];
  lista.forEach(function(e){
    var meta = getMetaContatos(e.id);
    // Pega todas as semanas que têm registro para este estagiário
    var semanas = {};
    (S.producao || []).forEach(function(p){
      if(p.estagiario_id !== e.id) return;
      var m = p.tri_ref && p.tri_ref.match(/^CONTATO-(\d{4}-W\d{2})-D\d$/);
      if(m) semanas[m[1]] = true;
    });
    var listaSemanas = Object.keys(semanas).sort();
    if(listaSemanas.length === 0){
      // Sem registros; se tem alvo, mostra ao menos uma linha
      if(meta > 0){
        rowsCont.push([e.nome, (e.perfil&&e.perfil.funcional)||'—', (e.perfil&&e.perfil.agencia)||'—', meta, '(sem registros)', 0,0,0,0,0, 0, '0%']);
      }
    } else {
      listaSemanas.forEach(function(sem){
        var d0 = getContatoDia(e.id, sem, 0);
        var d1 = getContatoDia(e.id, sem, 1);
        var d2 = getContatoDia(e.id, sem, 2);
        var d3 = getContatoDia(e.id, sem, 3);
        var d4 = getContatoDia(e.id, sem, 4);
        var tot = d0+d1+d2+d3+d4;
        var metaSem = meta * 5;
        var pctSem = metaSem > 0 ? Math.round(tot/metaSem*100) : 0;
        rowsCont.push([
          e.nome, (e.perfil&&e.perfil.funcional)||'—', (e.perfil&&e.perfil.agencia)||'—',
          meta, labelSemana(sem), d0, d1, d2, d3, d4, tot, pctSem+'%'
        ]);
      });
    }
  });
  if(rowsCont.length === 0){
    rowsCont.push(['Sem dados de contatos','','','','','','','','','','','']);
  }
  var wsCont = XLSX.utils.aoa_to_sheet([headerCont].concat(rowsCont));
  wsCont['!cols'] = [{wch:25},{wch:12},{wch:10},{wch:10},{wch:20},{wch:8},{wch:8},{wch:8},{wch:8},{wch:8},{wch:14},{wch:10}];
  XLSX.utils.book_append_sheet(wb, wsCont, 'Contatos');

  // ═══════════════════════════════════════════════════════════
  // ABA 5: AGENDAMENTOS
  // ═══════════════════════════════════════════════════════════
  if(typeof agendamentosCache !== 'undefined' && agendamentosCache.length > 0){
    var headerAg = ['Data','Título','Tipo','Público-alvo','Descrição','Criado por','Presentes','Ausentes','Total','Arquivo'];
    var rowsAg = agendamentosCache.map(function(a){
      var pres = 0, aus = 0;
      var nomesAusentes = [];
      if(a.presenca && Array.isArray(a.presenca)){
        a.presenca.forEach(function(x){
          if(x.presente) pres++;
          else {
            aus++;
            var est = S.ests.find(function(e){return e.id === x.estagiario_id;});
            if(est) nomesAusentes.push(est.nome);
          }
        });
      }
      var faseNomes = {todos:'Todos', fase1:'Fase 1 - Decolar', fase2:'Fase 2 - Evoluir', fase3:'Fase 3 - Impactar'};
      var tipoNomes = {aula:'Aula', workshop:'Workshop', treinamento:'Treinamento', reuniao:'Reunião', outro:'Outro'};
      return [
        formatarDataBR(a.data),
        a.titulo || '',
        tipoNomes[a.tipo] || a.tipo || '',
        faseNomes[a.fase_alvo] || a.fase_alvo || '',
        a.descricao || '',
        a.gestor_nome || '—',
        pres,
        nomesAusentes.length ? nomesAusentes.join(', ') : (aus > 0 ? aus+' ausente(s)' : '—'),
        pres+aus,
        a.arquivo_nome || '—'
      ];
    });
    var wsAg = XLSX.utils.aoa_to_sheet([headerAg].concat(rowsAg));
    wsAg['!cols'] = [{wch:12},{wch:32},{wch:14},{wch:18},{wch:40},{wch:20},{wch:10},{wch:30},{wch:8},{wch:20}];
    XLSX.utils.book_append_sheet(wb, wsAg, 'Agendamentos');
  }

  // Gerar e baixar
  var nomeArquivo = 'Nextuber_Resultados_' + new Date().toISOString().slice(0,10) + '.xlsx';
  XLSX.writeFile(wb, nomeArquivo);
  closeExportModal();
}

// ── EVENT LISTENERS ────────────────────────────────────────────────────────
onNextuberReady(function(){
  // Navigation — sidebar
  document.querySelectorAll('.nav-item[data-page]').forEach(function(el){
    el.addEventListener('click', function(){ goPage(this.dataset.page); });
  });
  // Navigation — bottom nav
  document.querySelectorAll('.bn-item[data-page]').forEach(function(el){
    el.addEventListener('click', function(){ goPage(this.dataset.page); });
  });

  // Trilha tabs
  document.querySelectorAll('.trilha-tab[data-trilha]').forEach(function(tab){
    tab.addEventListener('click', function(){
      activeTrilha=this.dataset.trilha;
      document.querySelectorAll('.trilha-tab').forEach(function(t){t.classList.remove('active');});
      this.classList.add('active');
      renderTrilha();
    });
  });

  // Auth buttons
  async function handleMode(){
    if(editor){ if(window.nextuberAuth) await window.nextuberAuth.logout().catch(function(){}); editor=false; window.editor=false; await loadFromDB(); goPage('overview'); }
    else if(modoGestor){ await logoutGestor(); }
    else{ openLoginModal(); }
  }
  document.getElementById('modeBtn').addEventListener('click', handleMode);
  // Mobile mode button (topbar)
  document.getElementById('mobileModeBtn').addEventListener('click', handleMode);

  // Drawer
  var hamburger=document.getElementById('hamburger');
  var drawer=document.getElementById('drawer');
  var drawerOverlay=document.getElementById('drawerOverlay');

  function openDrawer(){
    drawer.classList.add('open');
    drawerOverlay.style.display='block';
    hamburger.classList.add('open');
    document.body.classList.add('drawer-is-open');
    setTimeout(function(){drawerOverlay.classList.add('open');},10);
  }
  function closeDrawer(){
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.classList.remove('drawer-is-open');
    setTimeout(function(){drawerOverlay.style.display='none';},280);
  }
  hamburger.addEventListener('click',function(){ drawer.classList.contains('open')?closeDrawer():openDrawer(); });
  drawerOverlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function(event){
    if(event.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });

  // Drawer nav items
  document.querySelectorAll('.drawer-item[data-page]').forEach(function(el){
    el.addEventListener('click',function(){
      goPage(this.dataset.page);
      closeDrawer();
    });
  });

  // Drawer mode button
  document.getElementById('drawerModeBtn').addEventListener('click', handleMode);
  var _bb = document.getElementById('bannerBtn'); if(_bb) _bb.addEventListener('click', openLoginModal);
  document.getElementById('btnLogin').addEventListener('click', doLogin);
  document.getElementById('btnCancelLogin').addEventListener('click', function(){
    document.getElementById('loginOv').classList.remove('open');
  });

  // Tipo selector
  document.getElementById('btnEscolheTutora').addEventListener('click', function(){
    document.getElementById('loginTipoWrap').style.display = 'none';
    document.getElementById('loginTutoraWrap').style.display = 'block';
    setTimeout(function(){ document.getElementById('loginPwd').focus(); }, 80);
  });
  document.getElementById('btnEscolheGestor').addEventListener('click', function(){
    document.getElementById('loginTipoWrap').style.display = 'none';
    document.getElementById('loginGestorWrap').style.display = 'block';
    setTimeout(function(){ document.getElementById('loginGestorFunc').focus(); }, 80);
  });
  document.getElementById('btnVoltarTutora').addEventListener('click', function(){
    document.getElementById('loginTutoraWrap').style.display = 'none';
    document.getElementById('loginTipoWrap').style.display = 'block';
  });
  document.getElementById('btnVoltarGestor').addEventListener('click', function(){
    document.getElementById('loginGestorWrap').style.display = 'none';
    document.getElementById('loginTipoWrap').style.display = 'block';
  });

  // Gestor login
  document.getElementById('btnLoginGestor').addEventListener('click', async function(){
    var func = document.getElementById('loginGestorFunc').value.trim();
    var senha = document.getElementById('loginGestorSenha').value;
    var errEl = document.getElementById('loginGestorErr');
    errEl.classList.remove('show');
    if(!func || !senha){
      errEl.textContent = 'Preencha todos os campos.';
      errEl.classList.add('show');
      return;
    }
    var gestor = null;
    try {
      if(!window.nextuberAuth) throw new Error('Autenticação indisponível. Recarregue a página.');
      var payload = await window.nextuberAuth.loginManager(func, senha);
      gestor = payload.gestor;
    } catch(error) {
      errEl.textContent = (error && error.message) ? error.message : 'Funcional ou senha incorretos.';
    }
    if(gestor){
      var gestorIdx = S.gestores.findIndex(function(g){ return g.id === gestor.id; });
      if(gestorIdx >= 0) S.gestores[gestorIdx] = gestor;
      modoGestor = true;
      gestorLogado = gestor;
      window.modoGestor = true;
      window.gestorLogado = gestor;
      document.getElementById('loginOv').classList.remove('open');
      document.getElementById('loginGestorFunc').value = '';
      document.getElementById('loginGestorSenha').value = '';
      await loadFromDB();
    } else {
      errEl.textContent = 'Funcional ou senha incorretos.';
      errEl.classList.add('show');
    }
  });
  document.getElementById('loginGestorSenha').addEventListener('keydown', function(e){
    if(e.key==='Enter') document.getElementById('btnLoginGestor').click();
  });

  // Meu perfil (gestor)
  function abrirMeuPerfil(){
    if(!gestorLogado) return;
    document.getElementById('perfilNome').value = gestorLogado.nome;
    document.getElementById('perfilFunc').value = gestorLogado.funcional;
    document.getElementById('perfilSenha').value = '';
    document.getElementById('perfilSenhaConfirma').value = '';
    document.getElementById('perfilErr').classList.remove('show');
    document.getElementById('perfilOv').classList.add('open');
  }
  document.getElementById('btnMeuPerfil').addEventListener('click', abrirMeuPerfil);
  document.getElementById('drawerMeuPerfil').addEventListener('click', abrirMeuPerfil);
  document.getElementById('btnFecharPerfil').addEventListener('click', function(){
    document.getElementById('perfilOv').classList.remove('open');
  });
  document.getElementById('perfilFunc').addEventListener('input', function(){
    this.value = this.value.replace(/[^0-9]/g,'').slice(0,9);
  });
  document.getElementById('btnSalvarPerfil').addEventListener('click', async function(){
    var nome = document.getElementById('perfilNome').value.trim();
    var func = document.getElementById('perfilFunc').value.trim();
    var senha = document.getElementById('perfilSenha').value;
    var senha2 = document.getElementById('perfilSenhaConfirma').value;
    var errEl = document.getElementById('perfilErr');
    errEl.classList.remove('show');
    if(!nome){ errEl.textContent='Nome é obrigatório.'; errEl.classList.add('show'); return; }
    if(func.length < 9){ errEl.textContent='Funcional deve ter 9 dígitos.'; errEl.classList.add('show'); return; }
    if(senha && senha.length < 4){ errEl.textContent='Senha deve ter pelo menos 4 caracteres.'; errEl.classList.add('show'); return; }
    if(senha && senha !== senha2){ errEl.textContent='Senhas não conferem.'; errEl.classList.add('show'); return; }
    // Check funcional duplicate (exceto o próprio)
    var dup = S.gestores.find(function(g){ return g.funcional === func && g.id !== gestorLogado.id; });
    if(dup){ errEl.textContent='Já existe outro gestor com este funcional.'; errEl.classList.add('show'); return; }
    var r = await updateMeuPerfil(nome, func, senha);
    if(r){
      document.getElementById('perfilOv').classList.remove('open');
      applyModoGestor();
      alert('Perfil atualizado com sucesso!');
    } else {
      errEl.textContent='Erro ao salvar.';
      errEl.classList.add('show');
    }
  });
  document.getElementById('loginPwd').addEventListener('keydown', function(e){ if(e.key==='Enter') doLogin(); if(e.key==='Escape') document.getElementById('loginOv').classList.remove('open'); });

  // Lock screen login button
  document.getElementById('btnLockLogin').addEventListener('click', openLoginModal);

  // Panel
  document.getElementById('overlay').addEventListener('click', closePanel);
  document.getElementById('panelClose').addEventListener('click', closePanel);
  document.getElementById('btnEditarInfoEstagiario').addEventListener('click', function(){
    var form = document.getElementById('pInfoEditor');
    setPanelInfoEditing(form.hidden);
  });
  document.getElementById('pEditCancel').addEventListener('click', function(){ setPanelInfoEditing(false); });
  document.getElementById('pEditSave').addEventListener('click', savePanelInfo);
  document.getElementById('btnCloseArchiveHistory').addEventListener('click', function(){
    document.getElementById('archiveHistoryOv').classList.remove('open');
  });
  document.getElementById('archiveHistoryOv').addEventListener('click', function(event){
    if(event.target === this) this.classList.remove('open');
  });
  // Salvamento do alvo tratado por renderResultados

  // Atenção button
  document.getElementById('btnAtencao').addEventListener('click', function(){
    var _pIdx = getPanelEstIdx();
    if(!editor || _pIdx < 0) return;
    S.ests[_pIdx].atencao = !S.ests[_pIdx].atencao;
    saveEstagiario(S.ests[_pIdx]); persist(true);
    updateAtencaoBtn(_pIdx);
    renderCards();
  });

document.getElementById('btnObs').addEventListener('click', function(){
    var _pIdx = getPanelEstIdx();
    if(!editor||_pIdx<0) return;
    S.ests[_pIdx].obs=document.getElementById('obsTA').value;
    saveEstagiario(S.ests[_pIdx]); persist(true);
    var b=document.getElementById('obsSaved'); b.classList.add('show'); setTimeout(function(){b.classList.remove('show');},2000);
  });

  // Permissões do gestor (tutora)
  var btnFecharP = document.getElementById('btnFecharPermissoes');
  if(btnFecharP) btnFecharP.addEventListener('click', function(){
    document.getElementById('permissoesOv').classList.remove('open');
  });
  var btnFecharEditarGestor = document.getElementById('btnFecharEditarGestor');
  if(btnFecharEditarGestor) btnFecharEditarGestor.addEventListener('click', function(){
    document.getElementById('editarGestorOv').classList.remove('open');
  });
  var btnSalvarGestor = document.getElementById('btnSalvarGestor');
  if(btnSalvarGestor) btnSalvarGestor.addEventListener('click', salvarDadosGestor);

  // Editar banner do projeto (tutora)
  var btnEdBanner = document.getElementById('btnEditarBanner');
  if(btnEdBanner) btnEdBanner.addEventListener('click', function(){
    document.getElementById('edBannerOver').value = S_textos.banner_over;
    document.getElementById('edBannerTitulo').value = S_textos.banner_titulo;
    document.getElementById('edBannerDesc').value = S_textos.banner_desc;
    document.getElementById('edSecObjetivo').value = S_textos.sec_objetivo;
    document.getElementById('edSecEstrutura').value = S_textos.sec_estrutura;
    document.getElementById('edSecAvaliacao').value = S_textos.sec_avaliacao;
    document.getElementById('edSecParticipa').value = S_textos.sec_participa;
    document.getElementById('edSecAcomp').value = S_textos.sec_acomp;
    document.getElementById('editBannerErr').classList.remove('show');
    document.getElementById('editBannerOv').classList.add('open');
  });
  var btnFcEdB = document.getElementById('btnFecharEditBanner');
  if(btnFcEdB) btnFcEdB.addEventListener('click', function(){
    document.getElementById('editBannerOv').classList.remove('open');
  });
  var btnSvB = document.getElementById('btnSalvarBanner');
  if(btnSvB) btnSvB.addEventListener('click', async function(){
    S_textos.banner_over = document.getElementById('edBannerOver').value.trim() || TEXTOS_PROJETO_DEFAULT.banner_over;
    S_textos.banner_titulo = document.getElementById('edBannerTitulo').value.trim() || TEXTOS_PROJETO_DEFAULT.banner_titulo;
    S_textos.banner_desc = document.getElementById('edBannerDesc').value.trim() || TEXTOS_PROJETO_DEFAULT.banner_desc;
    S_textos.sec_objetivo = document.getElementById('edSecObjetivo').value.trim() || TEXTOS_PROJETO_DEFAULT.sec_objetivo;
    S_textos.sec_estrutura = document.getElementById('edSecEstrutura').value.trim() || TEXTOS_PROJETO_DEFAULT.sec_estrutura;
    S_textos.sec_avaliacao = document.getElementById('edSecAvaliacao').value.trim() || TEXTOS_PROJETO_DEFAULT.sec_avaliacao;
    S_textos.sec_participa = document.getElementById('edSecParticipa').value.trim() || TEXTOS_PROJETO_DEFAULT.sec_participa;
    S_textos.sec_acomp = document.getElementById('edSecAcomp').value.trim() || TEXTOS_PROJETO_DEFAULT.sec_acomp;
    await salvarTextosProjeto();
    aplicarTextosProjeto();
    document.getElementById('editBannerOv').classList.remove('open');
  });

  // Ver mais projeto modal
  var btnVm = document.getElementById('btnVerMaisProjeto');
  if(btnVm) btnVm.addEventListener('click', function(){
    document.getElementById('projetoOv').classList.add('open');
  });
  var btnFp = document.getElementById('btnFecharProjeto');
  if(btnFp) btnFp.addEventListener('click', function(){
    document.getElementById('projetoOv').classList.remove('open');
  });

  // Configurações — prazo semanal de produção (sexta-feira por padrão)
  var cfgPrazoInput = document.getElementById('cfgPrazoData');
  if(cfgPrazoInput) cfgPrazoInput.value = getPrazoProducaoAtual();

  // Renderiza o estado da UI (com prazo definido = mostra card, sem = mostra form)
  function renderPrazoAtual(){
    var cardEl = document.getElementById('cfgPrazoCardAtual');
    var formEl = document.getElementById('cfgPrazoForm');
    var displayEl = document.getElementById('cfgPrazoDataDisplay');
    var statusEl = document.getElementById('cfgPrazoStatus');
    var btnFecharForm = document.getElementById('btnCfgFecharForm');

    var prazoAtual = getPrazoProducaoAtual();
    var usaDataManual = S.cfg && S.cfg.prazo_producao_manual && S.cfg.prazo_producao_manual_semana === inicioSemanaAtualYMD();
    if(cardEl) cardEl.style.display = 'block';
    if(formEl) formEl.style.display = 'none';
    if(btnFecharForm) btnFecharForm.style.display = 'none';
    if(cfgPrazoInput) cfgPrazoInput.value = prazoAtual;
    if(displayEl) displayEl.textContent = '📅 ' + fmtDate(prazoAtual);

    if(statusEl){
      var d = new Date(prazoAtual+'T12:00:00');
      var hoje = new Date(hojeLocalYMD()+'T12:00:00');
      var diff = Math.round((d - hoje) / 86400000);
      var status, cor;
      if(diff > 2){ status = (usaDataManual ? '📌 Data personalizada desta semana' : '🟢 Sexta-feira programada')+' ('+diff+' dias restantes)'; cor = '#16A34A'; }
      else if(diff > 0){ status = '🟡 Prazo próximo ('+diff+' '+(diff===1?'dia':'dias')+')'; cor = '#F59E0B'; }
      else if(diff === 0){ status = '🟠 Vence hoje!'; cor = '#EA580C'; }
      else { status = '🔴 Prazo vencido há '+Math.abs(diff)+' '+(Math.abs(diff)===1?'dia':'dias'); cor = '#DC2626'; }
      statusEl.textContent = status;
      statusEl.style.color = cor;
    }
  }
  renderPrazoAtual();

  var btnCfgPrazo = document.getElementById('btnCfgSalvarPrazo');
  if(btnCfgPrazo) btnCfgPrazo.addEventListener('click', async function(){
    var val = document.getElementById('cfgPrazoData').value;
    if(!val){ alert('Selecione uma data.'); return; }
    if(!window.nextuberProduction) return;
    try {
      var prazoResult = await window.nextuberProduction.saveDeadline(val);
      S.cfg = prazoResult.config;
    } catch(error) {
      console.error('Alterar prazo:', error);
      alert((error && error.message) || 'Não foi possível alterar o prazo.');
      return;
    }
    var sv = document.getElementById('cfgPrazoSaved');
    if(sv){ sv.classList.add('show'); setTimeout(function(){ sv.classList.remove('show'); }, 2000); }
    renderPrazoAtual();
    renderCards();
  });

  // Botão "Alterar" - abre o form pré-preenchido
  var btnAlterar = document.getElementById('btnCfgAlterarPrazo');
  if(btnAlterar) btnAlterar.addEventListener('click', function(){
    var cardEl = document.getElementById('cfgPrazoCardAtual');
    var formEl = document.getElementById('cfgPrazoForm');
    var btnFecharForm = document.getElementById('btnCfgFecharForm');
    if(cardEl) cardEl.style.display = 'none';
    if(formEl) formEl.style.display = 'flex';
    if(btnFecharForm) btnFecharForm.style.display = 'inline-flex';
    if(cfgPrazoInput) cfgPrazoInput.value = getPrazoProducaoAtual();
  });

  // Botão "Cancelar edição" - fecha o form sem salvar
  var btnFechar = document.getElementById('btnCfgFecharForm');
  if(btnFechar) btnFechar.addEventListener('click', function(){
    renderPrazoAtual();
  });

  // Configurações — lembrete mensal do checklist de trilha
  function renderChecklistMensalConfig(){
    var enabled = !S.monthlyChecklist || S.monthlyChecklist.enabled !== false;
    var statusEl = document.getElementById('cfgChecklistMensalStatus');
    var button = document.getElementById('btnCfgChecklistMensal');
    if(statusEl){
      statusEl.textContent = enabled ? 'Ativa · últimos 7 dias do mês' : 'Desativada';
      statusEl.style.color = enabled ? '#15803d' : '#b91c1c';
    }
    if(button){
      button.textContent = enabled ? 'Desativar programação' : 'Ativar programação';
      button.style.background = enabled ? 'var(--surface)' : '#15803d';
      button.style.color = enabled ? 'var(--ink2)' : '#fff';
      button.style.borderColor = enabled ? 'var(--border2)' : '#15803d';
    }
  }
  renderChecklistMensalConfig();

  var btnChecklistMensal = document.getElementById('btnCfgChecklistMensal');
  if(btnChecklistMensal) btnChecklistMensal.addEventListener('click', async function(){
    var enabled = !S.monthlyChecklist || S.monthlyChecklist.enabled !== false;
    this.disabled = true;
    try {
      var result = await window.nextuberMutations.saveSetting('checklist_mensal', {enabled: !enabled});
      S.monthlyChecklist = result.value || {enabled: !enabled};
      renderChecklistMensalConfig();
      renderMonthlyChecklistReminder();
      showToast();
    } catch(error) {
      console.error('Programação do checklist:', error);
      alert((error && error.message) || 'Não foi possível salvar a programação.');
    } finally {
      this.disabled = false;
    }
  });

  // Encontros
  var btnAddE = document.getElementById('btnAddEncontro');
  if(btnAddE) btnAddE.addEventListener('click', function(){
    document.getElementById('encontroFormWrap').style.display = 'block';
    this.style.display = 'none';
    document.getElementById('encData').value = new Date().toISOString().split('T')[0];
  });
  var btnCanE = document.getElementById('btnCancelarEncontro');
  if(btnCanE) btnCanE.addEventListener('click', function(){
    document.getElementById('encontroFormWrap').style.display = 'none';
    document.getElementById('btnAddEncontro').style.display = 'inline-flex';
    ['encTitulo','encData','encDescricao'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
  });
  var btnSalE = document.getElementById('btnSalvarEncontro');
  if(btnSalE) btnSalE.addEventListener('click', async function(){
    var titulo = document.getElementById('encTitulo').value.trim();
    var data = document.getElementById('encData').value;
    var descricao = document.getElementById('encDescricao').value.trim();
    if(!titulo){ alert('Preencha o título.'); return; }
    if(!data){ alert('Selecione a data.'); return; }
    if(!window.nextuberMutations){ alert('Serviço de encontros indisponível.'); return; }
    var r;
    try {
      r = await window.nextuberMutations.createMeeting({title:titulo, date:data, description:descricao});
    } catch(error) {
      alert('Erro: ' + (error.message||error));
      return;
    }
    if(r.meeting){
      S.encontros.push(r.meeting);
      S.encontros.sort(function(a,b){ return a.data.localeCompare(b.data); });
    }
    renderEncontros();
    document.getElementById('encontroFormWrap').style.display = 'none';
    document.getElementById('btnAddEncontro').style.display = 'inline-flex';
    ['encTitulo','encData','encDescricao'].forEach(function(id){ var el=document.getElementById(id); if(el) el.value=''; });
  });

  // Cadastro
  document.getElementById('cadAddBtn').addEventListener('click', savePerfil);

  // Gestores
  var gestorBusca = document.getElementById('gestorBusca');
  var gestorBuscaLimpar = document.getElementById('gestorBuscaLimpar');
  var gestorFiltroAgencia = document.getElementById('gestorFiltroAgencia');
  if(gestorBusca) gestorBusca.addEventListener('input', renderGestoresList);
  if(gestorFiltroAgencia) gestorFiltroAgencia.addEventListener('change', renderGestoresList);
  if(gestorBuscaLimpar) gestorBuscaLimpar.addEventListener('click', function(){
    gestorBusca.value = '';
    gestorBusca.focus();
    renderGestoresList();
  });
  document.getElementById('btnAddGestor').addEventListener('click', async function(){
    var nome = document.getElementById('gestorNome').value.trim();
    var func = document.getElementById('gestorFunc').value.replace(/[^0-9]/g,'').slice(0,9);
    var agencia = document.getElementById('gestorAgencia').value.trim();
    var regionalId = document.getElementById('gestorRegional').value;
    if(!nome){ alert('Preencha o nome do gestor.'); return; }
    if(func.length < 9){ alert('Funcional deve ter 9 dígitos.'); return; }
    if(!agencia){ alert('Preencha a agência do gestor.'); return; }
    if(!regionalId){ alert('Selecione a regional do gestor.'); return; }
    if(S.gestores.find(function(g){ return g.funcional === func; })){
      alert('Já existe um gestor com este funcional.');
      return;
    }
    var r = await saveGestor(nome, func, agencia, regionalId);
    if(r){
      document.getElementById('gestorNome').value = '';
      document.getElementById('gestorFunc').value = '';
      document.getElementById('gestorAgencia').value = '';
      renderGestoresList();
      var sv = document.getElementById('gestorSaved');
      if(sv){ sv.classList.add('show'); setTimeout(function(){ sv.classList.remove('show'); }, 2500); }
    } else {
      alert('Erro ao salvar gestor.');
    }
  });
  document.getElementById('gestorFunc').addEventListener('input', function(){
    this.value = this.value.replace(/[^0-9]/g,'').slice(0,9);
  });
  document.getElementById('cadFunc').addEventListener('input', function(){ this.value=this.value.replace(/[^0-9]/g,'').slice(0,9); });
  var agEl2 = document.getElementById('cadAgencia');
  if(agEl2) agEl2.addEventListener('input', function(){ this.value=this.value.replace(/[^0-9]/g,'').slice(0,6); });
  document.getElementById('cadNome').addEventListener('input', updateCadPreview);
  setCadInputState();

  // Rename
  document.getElementById('btnConfirmRename').addEventListener('click', function(){
    var v=document.getElementById('renameIn').value.trim();
    if(!v) return;
    S.ests[renameIdx].nome=v;
    persist(true); renderCards(); renderCadChips();
    document.getElementById('renameOv').classList.remove('open');
  });
  document.getElementById('btnCancelRename').addEventListener('click', function(){ document.getElementById('renameOv').classList.remove('open'); });
  document.getElementById('renameIn').addEventListener('keydown', function(e){ if(e.key==='Enter') document.getElementById('btnConfirmRename').click(); if(e.key==='Escape') document.getElementById('renameOv').classList.remove('open'); });

  // Export Excel
  document.getElementById('btnExportExcel').addEventListener('click', openExportModal);

  // Listener do filtro de ranking
  var fRank = document.getElementById('filtroRanking');
  if(fRank) fRank.addEventListener('change', function(){ renderRanking(); });

  // ═══ Listeners dos filtros de acompanhamento ═══
  ['filtroAgencia','filtroCertificacao','filtroOrdem'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.addEventListener('change', function(){ renderCards(); });
  });
  var btnLimpar = document.getElementById('btnLimparFiltros');
  if(btnLimpar) btnLimpar.addEventListener('click', function(){
    var fa = document.getElementById('filtroAgencia'); if(fa) fa.value = 'todas';
    var fc = document.getElementById('filtroCertificacao'); if(fc) fc.value = 'todas';
    var fo = document.getElementById('filtroOrdem'); if(fo) fo.value = 'nome';
    renderCards();
  });
  document.getElementById('btnCancelExport').addEventListener('click', closeExportModal);
  document.getElementById('btnConfirmExport').addEventListener('click', exportToExcel);
  document.getElementById('exportOv').addEventListener('click', function(ev){ if(ev.target === this) closeExportModal(); });

  // Listener para sincronizar produções salvas via React no estado global do app.js
  window.addEventListener('nextuber:production-saved', function(evt){
    if(!evt || !evt.detail) return;
    var studentId = evt.detail.studentId;
    var rows = evt.detail.productionRows || [];
    if(!S.producao) S.producao = [];

    // Substituir linhas salvas desse estagiário
    S.producao = S.producao.filter(function(p){ return p.estagiario_id !== studentId; }).concat(rows);

    // Atualizar perfil em memória
    if(evt.detail.profile){
      var est = S.ests.find(function(e){ return String(e.id) === String(studentId); });
      if(est) est.perfil = evt.detail.profile;
    }
    if(evt.detail.productionAuditHistory){
      S.productionAuditHistory = evt.detail.productionAuditHistory;
      renderProductionAuditHistory();
    }

    // Re-renderizar indicadores e listas
    renderOverviewAll();
    renderCards();
  });

  // Init — load from Supabase
  loadFromDB();
});


})();

/* ─── RICH EDITOR JS ─── */
var editorImages = {cDesc:[], cDescR:[]};

function fmtText(id, type){
  var ta = document.getElementById(id);
  if(!ta) return;
  var s = ta.selectionStart, e = ta.selectionEnd;
  var sel = ta.value.slice(s,e);
  var before = ta.value.slice(0,s), after = ta.value.slice(e);
  var ins = '';
  if(type==='bold')      ins = '**'+(sel||'negrito')+'**';
  if(type==='italic')    ins = '_'+(sel||'itálico')+'_';
  if(type==='underline') ins = '__'+(sel||'sublinhado')+'__';
  if(type==='heading'){
    var ls = before.lastIndexOf('\n')+1;
    var line = ta.value.slice(ls,e);
    ta.value = ta.value.slice(0,ls)+'## '+line+after;
    ta.focus(); ta.setSelectionRange(ls+3,ls+3+line.length); return;
  }
  if(type==='ul'){
    var lines = (sel||'Item').split('\n');
    ins = lines.map(function(l){ return '• '+l; }).join('\n');
    if(!sel) ins += '\n';
  }
  if(type==='ol'){
    var lines = (sel||'Item').split('\n');
    ins = lines.map(function(l,i){ return (i+1)+'. '+l; }).join('\n');
    if(!sel) ins += '\n';
  }
  ta.value = before+ins+after;
  ta.focus(); ta.setSelectionRange(before.length, before.length+ins.length);
}

function toggleEmoji(id){
  var p = document.getElementById('emoji_'+id);
  if(p) p.classList.toggle('open');
}

function insertEmoji(id, emoji){
  var ta = document.getElementById(id);
  if(!ta) return;
  var pos = ta.selectionStart;
  ta.value = ta.value.slice(0,pos)+emoji+ta.value.slice(pos);
  ta.focus(); ta.setSelectionRange(pos+emoji.length, pos+emoji.length);
  var p = document.getElementById('emoji_'+id);
  if(p) p.classList.remove('open');
}

function setupImgInput(id){
  var input = document.getElementById('imgInput_'+id);
  if(!input) return;
  input.addEventListener('change', function(){
    if(!editorImages[id]) editorImages[id]=[];
    Array.from(this.files).forEach(function(file){
      var reader = new FileReader();
      reader.onload = function(ev){
        editorImages[id].push(ev.target.result);
        renderImgPreview(id);
      };
      reader.readAsDataURL(file);
    });
    this.value='';
  });
}

function renderImgPreview(id){
  var wrap = document.getElementById('imgPreview_'+id);
  if(!wrap) return;
  var imgs = editorImages[id]||[];
  if(!imgs.length){ wrap.style.display='none'; wrap.innerHTML=''; return; }
  wrap.style.display='flex';
  wrap.innerHTML = imgs.map(function(src,i){
    var imageUrl = safeUrl(src, {allowImageData:true});
    if(!imageUrl) return '';
    return '<div class="rich-img-thumb-wrap"><img class="rich-img-thumb" src="'+escapeAttr(imageUrl)+'" alt=""><button class="rich-img-del" data-imgid="'+escapeAttr(id)+'" data-idx="'+i+'">✕</button></div>';
  }).join('');
  wrap.querySelectorAll('.rich-img-del').forEach(function(btn){
    btn.addEventListener('click', function(){
      editorImages[this.dataset.imgid].splice(parseInt(this.dataset.idx),1);
      renderImgPreview(this.dataset.imgid);
    });
  });
}

function renderContent(text, images){
  if(!text && (!images||!images.length)) return '';
  var h = (text||'')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/[*][*](.+?)[*][*]/g,'<strong>$1</strong>')
    .replace(/_(.+?)_/g,'<em>$1</em>')
    .replace(/__(.+?)__/g,'<u>$1</u>')
    .replace(/^## (.+)$/gm,'<div style="font-size:15px;font-weight:600;color:var(--ink);margin:12px 0 4px;">$1</div>')
    .replace(/\n/g,'<br>');
  if(images && images.length){
    h += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;">'
      +images.map(function(src){
        var imageUrl = safeUrl(src, {allowImageData:true});
        return imageUrl ? '<img src="'+escapeAttr(imageUrl)+'" alt="" style="max-width:100%;max-height:260px;border-radius:8px;border:1px solid var(--border);object-fit:contain;">' : '';
      }).join('')
    +'</div>';
  }
  return h;
}

document.addEventListener('click', function(ev){
  if(!ev.target.closest('.rtb-emoji-wrap')){
    document.querySelectorAll('.rtb-emoji-picker').forEach(function(p){ p.classList.remove('open'); });
  }
});

// ════════════════════════════════════════════
// ═══════════ AGENDAMENTOS ═══════════════════
// ════════════════════════════════════════════

var agendamentosCache = [];
var agendEditandoId = null;
var agendVisualizandoId = null;

async function carregarAgendamentos(){
  if(!window.nextuberReads){
    console.warn('Serviço de leitura ainda não inicializado');
    agendamentosCache = [];
    var el = document.getElementById('agendamentosList');
    if(el) el.innerHTML = '<div style="background:#FEF2F2;border:1px solid #DC2626;border-radius:10px;padding:16px;color:#991B1B;font-size:13px;">⚠ Serviço de leitura indisponível. Recarregue a página.</div>';
    return;
  }

  try {
    var r = await window.nextuberReads.appointments();
    agendamentosCache = r.appointments || [];
  } catch(e){
    if(!e || e.message !== 'Faca login novamente.') console.error('Erro:', e);
    agendamentosCache = [];
  }
}

function getFaseEstagiario(e){
  if(!e || !e.perfil || !e.perfil.inicio) return 'fase1';
  var s = new Date(e.perfil.inicio);
  var now = new Date();
  if(isNaN(s.getTime())) return 'fase1';
  var meses = (now.getFullYear() - s.getFullYear()) * 12 + (now.getMonth() - s.getMonth());
  if(meses < 0) meses = 0;
  if(meses < 3) return 'fase1';
  if(meses < 6) return 'fase2';
  return 'fase3';
}

function nomeFase(fase){
  if(fase === 'fase1') return 'Fase 1 - Decolar';
  if(fase === 'fase2') return 'Fase 2 - Evoluir';
  if(fase === 'fase3') return 'Fase 3 - Impactar';
  return 'Todos';
}

function nomeTipo(tipo){
  var map = {
    'aula': 'Aula',
    'workshop': 'Workshop',
    'treinamento': 'Treinamento',
    'reuniao': 'Reunião',
    'outro': 'Outro'
  };
  return map[tipo] || tipo;
}

function corTipo(tipo){
  var map = {
    'aula': '#3B82F6',
    'workshop': '#8B5CF6',
    'treinamento': '#F59E0B',
    'reuniao': '#10B981',
    'outro': '#6B7280'
  };
  return map[tipo] || '#6B7280';
}

function formatarDataBR(dataStr){
  if(!dataStr) return '—';
  var partes = dataStr.split('-');
  if(partes.length !== 3) return dataStr;
  return partes[2] + '/' + partes[1] + '/' + partes[0];
}

function renderAgendamentos(){
  var el = document.getElementById('agendamentosList');
  if(!el) return;

  var filtroFase = (document.getElementById('filtroAgendFase')||{}).value || 'todos';
  var filtroTipo = (document.getElementById('filtroAgendTipo')||{}).value || 'todos';

  var lista = agendamentosCache.filter(function(a){
    if(filtroFase !== 'todos' && a.fase_alvo !== filtroFase && a.fase_alvo !== 'todos') return false;
    if(filtroTipo !== 'todos' && a.tipo !== filtroTipo) return false;
    return true;
  });

  if(lista.length === 0){
    el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--ink3);background:var(--surface);border:1px dashed var(--border);border-radius:12px;">Nenhum agendamento encontrado.<br><span style="font-size:12px;">Clique em "+ Novo Agendamento" para registrar o primeiro.</span></div>';
    return;
  }

  var h = '';
  lista.forEach(function(a){
    var presentes = (a.presenca && Array.isArray(a.presenca))
      ? a.presenca.filter(function(p){return p.presente;}).length
      : 0;
    var totalEsperado = (a.presenca && Array.isArray(a.presenca)) ? a.presenca.length : 0;
    var temArquivo = !!a.arquivo_nome;

    h += '<div class="agend-card" data-id="'+escapeAttr(a.id)+'" style="background:var(--surface);border:1px solid var(--border);border-left:4px solid '+corTipo(a.tipo)+';border-radius:10px;padding:14px;cursor:pointer;transition:transform .15s;">'
      +'<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:8px;flex-wrap:wrap;">'
        +'<div style="flex:1;min-width:200px;">'
          +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;">'
            +'<span style="background:'+corTipo(a.tipo)+'20;color:'+corTipo(a.tipo)+';font-size:10px;font-weight:600;padding:2px 8px;border-radius:12px;text-transform:uppercase;letter-spacing:.04em;">'+nomeTipo(a.tipo)+'</span>'
            +'<span style="font-size:11px;color:var(--ink3);">'+nomeFase(a.fase_alvo)+'</span>'
            +(temArquivo ? '<span style="font-size:11px;color:var(--or);">📎 Arquivo</span>' : '')
          +'</div>'
          +'<div style="font-size:15px;font-weight:600;color:var(--ink);margin-bottom:4px;">'+escapeHtml(a.titulo||'(sem título)')+'</div>'
          +(a.descricao ? '<div style="font-size:12px;color:var(--ink2);margin-bottom:6px;line-height:1.4;">'+escapeHtml(a.descricao.length>120 ? a.descricao.substring(0,120)+'...' : a.descricao)+'</div>' : '')
        +'</div>'
        +'<div style="text-align:right;min-width:120px;">'
          +'<div style="font-size:13px;font-weight:600;color:var(--or);">'+escapeHtml(formatarDataBR(a.data))+'</div>'
        +'</div>'
      +'</div>'
      +'<div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--ink3);flex-wrap:wrap;gap:8px;">'
        +'<span>👤 Criado por: <strong style="color:var(--ink2);">'+escapeHtml(a.gestor_nome||'—')+'</strong></span>'
        +'<span>✓ Presentes: <strong style="color:var(--ink2);">'+presentes+'/'+totalEsperado+'</strong></span>'
      +'</div>'
    +'</div>';
  });

  el.innerHTML = h;

  // Listeners de clique nos cards
  el.querySelectorAll('.agend-card').forEach(function(card){
    card.addEventListener('click', function(){
      var id = this.getAttribute('data-id');
      abrirDetalhesAgendamento(id);
    });
  });
}

function podeGerenciarAgendamento(a){
  // Tutora pode tudo. Gestor só edita/exclui se for o autor
  try {
    var _editor = (typeof editor !== 'undefined') ? editor : (window.editor || false);
    var _modoGestor = (typeof modoGestor !== 'undefined') ? modoGestor : (window.modoGestor || false);
    var _gestorLogado = (typeof gestorLogado !== 'undefined') ? gestorLogado : (window.gestorLogado || null);
    if(_editor) return true;
    if(_modoGestor && _gestorLogado && a.gestor_id === _gestorLogado.id) return true;
  } catch(e){
    console.warn('Erro em podeGerenciarAgendamento:', e);
  }
  return false;
}

function abrirDetalhesAgendamento(id){
  var a = agendamentosCache.find(function(x){ return x.id === id; });
  if(!a) return;

  agendVisualizandoId = id;
  var modal = document.getElementById('modalAgendDetalhes');
  var body = document.getElementById('agendDetalhesBody');

  var podeGerenciar = podeGerenciarAgendamento(a);

  var presencaHtml = '';
  if(a.presenca && Array.isArray(a.presenca) && a.presenca.length > 0){
    var ausentes = a.presenca.filter(function(p){ return !p.presente; });
    if(ausentes.length === 0){
      presencaHtml = '<div style="background:#DCFCE7;border:1px solid #16A34A;border-radius:8px;padding:10px;font-size:12px;color:#15803D;font-weight:600;">✓ Todos os estagiários estavam presentes ('+a.presenca.length+')</div>';
    } else {
      presencaHtml = '<div style="background:#FEF3C7;border:1px solid #F59E0B;border-radius:8px;padding:10px;">'
        +'<div style="font-size:12px;color:#92400E;font-weight:600;margin-bottom:6px;">⚠ '+ausentes.length+' ausente(s) de '+a.presenca.length+':</div>';
      ausentes.forEach(function(p){
        var est = S.ests.find(function(e){ return e.id === p.estagiario_id; });
        presencaHtml += '<div style="font-size:12px;color:#78350F;padding:2px 0;">• '+escapeHtml(est?est.nome:'(estagiário removido)')+(p.observacao ? ' <span style="opacity:.7;">— '+escapeHtml(p.observacao)+'</span>' : '')+'</div>';
      });
      presencaHtml += '</div>';
    }
  }

  var arquivoHtml = '';
  var arquivoUrlSeguro = safeUrl(a.arquivo_url);
  if(arquivoUrlSeguro){
    arquivoHtml = '<div style="margin-bottom:14px;"><div style="font-size:11px;color:var(--ink3);font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px;">Arquivo</div>'
      +'<a href="'+escapeAttr(arquivoUrlSeguro)+'" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:6px;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--or);text-decoration:none;font-size:13px;">📎 '+escapeHtml(a.arquivo_nome||'Arquivo')+'</a></div>';
  } else if(a.arquivo_nome){
    arquivoHtml = '<div style="margin-bottom:14px;"><div style="font-size:11px;color:var(--ink3);font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px;">Arquivo</div>'
      +'<div style="display:inline-flex;align-items:center;gap:6px;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--ink2);font-size:13px;">📎 '+escapeHtml(a.arquivo_nome)+'</div></div>';
  }

  body.innerHTML = '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;">'
    +'<span style="background:'+corTipo(a.tipo)+'20;color:'+corTipo(a.tipo)+';font-size:11px;font-weight:600;padding:3px 10px;border-radius:12px;text-transform:uppercase;letter-spacing:.04em;">'+nomeTipo(a.tipo)+'</span>'
    +'<span style="font-size:12px;color:var(--ink3);">'+nomeFase(a.fase_alvo)+'</span>'
    +'</div>'
    +'<h3 style="font-size:18px;margin-bottom:6px;color:var(--ink);">'+escapeHtml(a.titulo||'(sem título)')+'</h3>'
    +'<div style="font-size:13px;color:var(--or);font-weight:600;margin-bottom:14px;">📅 '+escapeHtml(formatarDataBR(a.data))+'</div>'
    +(a.descricao ? '<div style="background:var(--bg);border-radius:8px;padding:10px;margin-bottom:14px;font-size:13px;color:var(--ink2);line-height:1.5;white-space:pre-wrap;">'+escapeHtml(a.descricao)+'</div>' : '')
    +arquivoHtml
    +'<div style="margin-bottom:14px;">'
      +'<div style="font-size:11px;color:var(--ink3);font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px;">Presença</div>'
      +presencaHtml
    +'</div>'
    +'<div style="padding-top:10px;border-top:1px solid var(--border);font-size:11px;color:var(--ink3);">'
      +'Criado por: <strong style="color:var(--ink2);">'+escapeHtml(a.gestor_nome||'—')+'</strong>'
    +'</div>';

  // Mostrar botões só se tem permissão
  var btnEditar = document.getElementById('btnEditarAgend');
  var btnExcluir = document.getElementById('btnExcluirAgend');
  if(btnEditar) btnEditar.style.display = podeGerenciar ? '' : 'none';
  if(btnExcluir) btnExcluir.style.display = podeGerenciar ? '' : 'none';

  modal.classList.add('open');
}

function abrirModalNovoAgendamento(){
  agendEditandoId = null;
  document.getElementById('modalAgendTitulo').textContent = 'Novo Agendamento';
  document.getElementById('agendTitulo').value = '';
  document.getElementById('agendData').value = new Date().toISOString().slice(0,10);
  document.getElementById('agendTipo').value = 'aula';
  document.getElementById('agendFaseAlvo').value = 'todos';
  document.getElementById('agendDescricao').value = '';
  document.getElementById('agendArquivo').value = '';
  document.getElementById('agendArquivoAtual').textContent = '';
  document.getElementById('agendPresencaTodos').checked = true;
  document.getElementById('agendListaEstagiarios').style.display = 'none';
  renderListaEstagiariosPresenca([]);
  document.getElementById('modalAgendamento').classList.add('open');
}

function abrirModalEditarAgendamento(id){
  var a = agendamentosCache.find(function(x){ return x.id === id; });
  if(!a) return;

  agendEditandoId = id;
  document.getElementById('modalAgendTitulo').textContent = 'Editar Agendamento';
  document.getElementById('agendTitulo').value = a.titulo || '';
  document.getElementById('agendData').value = a.data || '';
  document.getElementById('agendTipo').value = a.tipo || 'aula';
  document.getElementById('agendFaseAlvo').value = a.fase_alvo || 'todos';
  document.getElementById('agendDescricao').value = a.descricao || '';
  document.getElementById('agendArquivo').value = '';
  document.getElementById('agendArquivoAtual').textContent = a.arquivo_nome ? '📎 Atual: ' + a.arquivo_nome + ' (envie um novo para substituir)' : '';

  var ausentes = (a.presenca || []).filter(function(p){ return !p.presente; });
  if(ausentes.length === 0){
    document.getElementById('agendPresencaTodos').checked = true;
    document.getElementById('agendListaEstagiarios').style.display = 'none';
  } else {
    document.getElementById('agendPresencaParcial').checked = true;
    document.getElementById('agendListaEstagiarios').style.display = 'block';
  }
  renderListaEstagiariosPresenca(a.presenca || []);

  document.getElementById('modalAgendDetalhes').classList.remove('open');
  document.getElementById('modalAgendamento').classList.add('open');
}

function getEstagiariosPorFase(fase){
  if(typeof S === 'undefined' || !S || !S.ests) return [];
  if(fase === 'todos') return S.ests;
  return S.ests.filter(function(e){ return getFaseEstagiario(e) === fase; });
}

function renderListaEstagiariosPresenca(presencaAtual){
  var fase = document.getElementById('agendFaseAlvo').value;
  var ests = getEstagiariosPorFase(fase);
  var lista = document.getElementById('agendListaEstagiarios');

  if(ests.length === 0){
    lista.innerHTML = '<div style="font-size:12px;color:var(--ink3);text-align:center;padding:10px;">Nenhum estagiário nessa fase.</div>';
    return;
  }

  var h = '<div style="font-size:11px;color:var(--ink3);margin-bottom:8px;">Desmarque quem faltou:</div>';
  ests.forEach(function(e){
    var registro = presencaAtual.find(function(p){ return p.estagiario_id === e.id; });
    var presente = registro ? registro.presente : true;
    h += '<label style="display:flex;align-items:center;gap:8px;padding:6px;font-size:12px;cursor:pointer;border-radius:6px;" onmouseover="this.style.background=\'var(--surface)\'" onmouseout="this.style.background=\'transparent\'">'
      +'<input type="checkbox" class="agendPresChk" data-eid="'+escapeAttr(e.id)+'" '+(presente?'checked':'')+'>'
      +'<span>'+escapeHtml(e.nome)+'</span>'
      +'</label>';
  });
  lista.innerHTML = h;
}

async function salvarAgendamento(){
  var titulo = document.getElementById('agendTitulo').value.trim();
  var data = document.getElementById('agendData').value;
  var tipo = document.getElementById('agendTipo').value;
  var faseAlvo = document.getElementById('agendFaseAlvo').value;
  var descricao = document.getElementById('agendDescricao').value.trim();
  var presencaTipo = document.querySelector('input[name="agendPresenca"]:checked').value;

  if(!titulo){ alert('Informe o título.'); return; }
  if(!data){ alert('Informe a data.'); return; }

  // Montar lista de presença
  var ests = getEstagiariosPorFase(faseAlvo);
  var presenca = [];
  if(presencaTipo === 'todos'){
    ests.forEach(function(e){
      presenca.push({ estagiario_id: e.id, presente: true });
    });
  } else {
    var chks = document.querySelectorAll('.agendPresChk');
    chks.forEach(function(chk){
      presenca.push({
        estagiario_id: chk.getAttribute('data-eid'),
        presente: chk.checked
      });
    });
  }

  // Upload de arquivo (se houver)
  var arquivoInput = document.getElementById('agendArquivo');
  var arquivoUrl = null;
  var arquivoNome = null;

  // Manter arquivo existente se estiver editando e não enviou novo
  if(agendEditandoId){
    var existente = agendamentosCache.find(function(x){ return x.id === agendEditandoId; });
    if(existente){
      arquivoUrl = existente.arquivo_url;
      arquivoNome = existente.arquivo_nome;
    }
  }

  if(arquivoInput.files && arquivoInput.files[0]){
    var file = arquivoInput.files[0];
    try {
      if(!window.nextuberMutations) throw new Error('Serviço de agendamentos indisponível.');
      var upRes = await window.nextuberMutations.uploadAppointment(file);
      arquivoUrl = upRes.fileUrl;
      arquivoNome = upRes.fileName;
    } catch(err){
      alert('Erro ao enviar arquivo: ' + (err.message || err));
      return;
    }
  }

  var dados = {
    title: titulo,
    description: descricao,
    date: data,
    type: tipo,
    targetPhase: faseAlvo,
    fileUrl: arquivoUrl,
    fileName: arquivoNome,
    presence: presenca.map(function(item){
      return {studentId:item.estagiario_id, present:item.presente};
    })
  };

  console.log('Salvando agendamento:', dados);

  try {
    if(!window.nextuberMutations) throw new Error('Serviço de agendamentos indisponível.');
    var r;
    if(agendEditandoId){
      r = await window.nextuberMutations.updateAppointment(String(agendEditandoId), dados);
    } else {
      r = await window.nextuberMutations.createAppointment(dados);
    }

    await carregarAgendamentos();
    renderAgendamentos();
    document.getElementById('modalAgendamento').classList.remove('open');
    agendEditandoId = null;
  } catch(e){
    console.error('Erro:', e);
    alert('Erro ao salvar agendamento: ' + (e.message || e));
  }
}

async function excluirAgendamento(){
  if(!agendVisualizandoId) return;
  if(!confirm('Tem certeza que deseja excluir este agendamento?')) return;

  try {
    if(!window.nextuberMutations) throw new Error('Serviço de agendamentos indisponível.');
    await window.nextuberMutations.deleteAppointment(String(agendVisualizandoId));
    await carregarAgendamentos();
    renderAgendamentos();
    document.getElementById('modalAgendDetalhes').classList.remove('open');
    agendVisualizandoId = null;
  } catch(e){
    console.error(e);
    alert('Erro ao excluir.');
  }
}

// Listeners do modal de Agendamentos
function initAgendamentosListeners(){
  var btnNovo = document.getElementById('btnNovoAgendamento');
  if(btnNovo) btnNovo.addEventListener('click', abrirModalNovoAgendamento);

  var btnCancel = document.getElementById('btnCancelAgend');
  if(btnCancel) btnCancel.addEventListener('click', function(){
    document.getElementById('modalAgendamento').classList.remove('open');
  });

  var btnSalvar = document.getElementById('btnSalvarAgend');
  if(btnSalvar) btnSalvar.addEventListener('click', salvarAgendamento);

  var btnFechar = document.getElementById('btnFecharAgendDetalhes');
  if(btnFechar) btnFechar.addEventListener('click', function(){
    document.getElementById('modalAgendDetalhes').classList.remove('open');
  });

  var btnEditar = document.getElementById('btnEditarAgend');
  if(btnEditar) btnEditar.addEventListener('click', function(){
    if(agendVisualizandoId) abrirModalEditarAgendamento(agendVisualizandoId);
  });

  var btnExcluir = document.getElementById('btnExcluirAgend');
  if(btnExcluir) btnExcluir.addEventListener('click', excluirAgendamento);

  // Radio presença
  document.querySelectorAll('input[name="agendPresenca"]').forEach(function(r){
    r.addEventListener('change', function(){
      var lista = document.getElementById('agendListaEstagiarios');
      if(this.value === 'parcial'){
        lista.style.display = 'block';
        renderListaEstagiariosPresenca([]);
      } else {
        lista.style.display = 'none';
      }
    });
  });

  // Mudança de fase atualiza lista
  var faseSelect = document.getElementById('agendFaseAlvo');
  if(faseSelect) faseSelect.addEventListener('change', function(){
    var presenca = document.querySelector('input[name="agendPresenca"]:checked').value;
    if(presenca === 'parcial'){
      renderListaEstagiariosPresenca([]);
    }
  });

  // Filtros
  var fFase = document.getElementById('filtroAgendFase');
  if(fFase) fFase.addEventListener('change', renderAgendamentos);

  var fTipo = document.getElementById('filtroAgendTipo');
  if(fTipo) fTipo.addEventListener('change', renderAgendamentos);
}

initAgendamentosListeners();

// Carregar agendamentos ao trocar pra página
document.querySelectorAll('[data-page="agendamentos"]').forEach(function(item){
  item.addEventListener('click', async function(){
    await carregarAgendamentos();
    renderAgendamentos();
  });
});


// ═══════════════════════════════════════════════
// Expor funções e variáveis globais para a IA
// Usa eval para forçar resolução no escopo correto
// ═══════════════════════════════════════════════
(function exporGlobaisParaIA(){
  var nomes = [
    'S', 'modoGestor', 'gestorLogado', 'editor', 'agendamentosCache',
    'trimestreRef', 'calcScore', 'calcTempo',
    'getTotalTrimestreModalidades', 'getTotalTrimestreModalidade',
    'getTotalTrimestreOutros', 'getTotalTrimestreOutroProduto',
    'getProducaoTri', 'getEffectiveTrilhaKey', 'statusAtualizacao',
    'getMetaContatos', 'hojeLocalYMD', 'isGGA',
    'getProducaoSemanalModalidade', 'getProducaoOutroProduto'
  ];
  nomes.forEach(function(nome){
    try {
      var valor = eval(nome);
      if(typeof valor !== 'undefined') window[nome] = valor;
    } catch(e){
      // Silencioso: nome não existe no escopo, tudo bem
    }
  });
})();


// ═══════════════════════════════════════════════
// ═══════════ ASSISTENTE IA ═════════════════════
// ═══════════════════════════════════════════════

// URL da Supabase Edge Function (será configurada no Supabase)
var AI_EDGE_FUNCTION_URL = '/api/assistant';

var aiChatHistory = []; // histórico da conversa atual
var aiChatOpen = false;

// Helper interno pra pegar data local (fallback se hojeLocalYMD não existir no escopo)
function _aiHojeYMD(){
  try { if(typeof hojeLocalYMD === 'function') return hojeLocalYMD(); } catch(e){}
  try { if(window.hojeLocalYMD) return window.hojeLocalYMD(); } catch(e){}
  var d = new Date();
  var y = d.getFullYear();
  var m = String(d.getMonth()+1).padStart(2,'0');
  var dia = String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+dia;
}

// Helper defensivo para pegar variáveis globais
function _aiGet(nome, fallback){
  try {
    var val = eval(nome);
    if(typeof val !== 'undefined') return val;
  } catch(e){}
  try {
    if(typeof window !== 'undefined' && typeof window[nome] !== 'undefined') return window[nome];
  } catch(e){}
  return fallback;
}

// Resolve uma função global por nome - tenta várias formas
function _aiFn(nome){
  // 1) window[nome]
  try { if(typeof window[nome] === 'function') return window[nome]; } catch(e){}
  // 2) referência direta
  try { var f = eval(nome); if(typeof f === 'function') return f; } catch(e){}
  // 3) via globalThis
  try { if(typeof globalThis !== 'undefined' && typeof globalThis[nome] === 'function') return globalThis[nome]; } catch(e){}
  return null;
}

// ═══════════════════════════════════════════════
// gerarContextoIA - VERSÃO AUTOSSUFICIENTE
// Calcula tudo diretamente de window.S.producao
// Não depende de outras funções externas
// ═══════════════════════════════════════════════
function gerarContextoIA(){
  var S_ = window.S || {ests:[], cfg:{}, producao:[]};
  var modoGestor_ = window.modoGestor || false;
  var gestorLogado_ = window.gestorLogado || null;

  // Trimestre atual (calcula do zero)
  function _trimestreAtualLocal(){
    var d = new Date();
    var m = d.getMonth() + 1; // 1-12
    var q = Math.ceil(m/3); // 1-4
    return d.getFullYear() + '-Q' + q;
  }
  var tri = _trimestreAtualLocal();

  // Meses do trimestre
  function _mesesDoTri(triRef){
    var partes = triRef.split('-Q');
    var q = parseInt(partes[1]);
    var mesInicio = (q-1)*3 + 1;
    var nomes = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    return [nomes[mesInicio-1], nomes[mesInicio], nomes[mesInicio+1]];
  }

  // Busca valor de produção pelo ref
  function _prod(eid, ref){
    var row = (S_.producao||[]).find(function(p){ return p.estagiario_id === eid && p.tri_ref === ref; });
    return row ? (parseFloat(row.producao) || 0) : 0;
  }

  // Total de uma modalidade no trimestre (inclui a quinta semana quando aplicável)
  function _totCredMod(eid, modIdx){
    var t = 0;
    for(var m = 1; m <= 3; m++){
      for(var s = 1; s <= quantidadeSemanasMes(tri, m); s++){
        t += _prod(eid, tri+'-M'+m+'-S'+s+'-MOD'+modIdx);
      }
    }
    return t;
  }

  // Total de crédito no trimestre (todas as 4 modalidades)
  function _totCredTri(eid){
    return _totCredMod(eid, 0) + _totCredMod(eid, 1) + _totCredMod(eid, 2) + _totCredMod(eid, 3);
  }

  // Total de um produto "outros" no trimestre
  function _totOutProd(eid, prodIdx){
    var t = 0;
    for(var m = 1; m <= 3; m++){
      for(var s = 1; s <= quantidadeSemanasMes(tri, m); s++){
        t += _prod(eid, tri+'-M'+m+'-S'+s+'-OUT'+prodIdx);
      }
    }
    return t;
  }

  // Total de outros produtos no trimestre
  function _totOutTri(eid){
    var t = 0;
    for(var p = 0; p < 5; p++){ t += _totOutProd(eid, p); }
    return t;
  }

  // Alvo do trimestre
  function _metaTri(eid){
    var row = (S_.producao||[]).find(function(p){ return p.estagiario_id === eid && p.tri_ref === tri; });
    return row ? (parseFloat(row.meta) || 0) : 0;
  }

  // Alvo diário de contatos
  function _metaContatos(eid){
    var row = (S_.producao||[]).find(function(p){ return p.estagiario_id === eid && p.tri_ref === 'CONTATO-META'; });
    return row ? (parseFloat(row.meta) || 0) : 0;
  }

  // Calcula nota
  function _nota(eid){
    var meta = _metaTri(eid);
    if(meta <= 0) return 0;
    var cred = _totCredTri(eid);
    var out = _totOutTri(eid);
    var metaOut = meta * 0.2;
    var pctCred = Math.min(cred/meta, 1);
    var pctOut = metaOut > 0 ? Math.min(out/metaOut, 1) : 0;
    return Math.min(Math.round((pctCred*6 + pctOut*4)*10)/10, 10);
  }

  // Fase (trilha) baseada em meses no programa
  function _fase(e){
    if(!e.perfil || !e.perfil.inicio) return 'Não definida';
    var inicio = new Date(e.perfil.inicio);
    var agora = new Date();
    var dias = Math.floor((agora - inicio)/(86400000));
    if(dias <= 90) return 'Decolar (0-90d)';
    if(dias <= 180) return 'Evoluir (91-180d)';
    return 'Impactar (181+d)';
  }

  // Status de atualização
  function _statusAtz(e){
    return statusAtualizacao(e);
  }

  // Tempo no programa
  function _tempo(inicio){
    if(!inicio) return null;
    var s = new Date(inicio), now = new Date();
    var y = now.getFullYear()-s.getFullYear(), m = now.getMonth()-s.getMonth();
    if(m<0){y--;m+=12;}
    if(y===0&&m===0) return 'Iniciando';
    if(y===0) return m===1?'1 mês':m+' meses';
    if(m===0) return y===1?'1 ano':y+' anos';
    return y+' ano'+(y>1?'s':'')+' e '+m+' '+(m===1?'mês':'meses');
  }

  var hojeYMD = _aiHojeYMD();

  var ctx = {
    data_atual: hojeYMD,
    total_estagiarios: (S_.ests||[]).length,
    trimestre_atual: tri,
    prazo_producao: (typeof getPrazoProducaoAtual === 'function') ? getPrazoProducaoAtual() : ((typeof window !== 'undefined' && typeof window.getPrazoProducaoAtual === 'function') ? window.getPrazoProducaoAtual() : null),
    estagiarios: [],
    agendamentos: []
  };

  console.log('[IA] Contexto: total_ests=', ctx.total_estagiarios, 'trimestre=', tri);

  // Filtrar por permissão
  var lista = S_.ests || [];
  if(modoGestor_ && gestorLogado_){
    var perm = gestorLogado_.permissoes || {};
    var _isGerenteRegional = (gestorLogado_.tipo_gestor === 'lider_regional');
    if(!_isGerenteRegional){
      var regionalId = String(gestorLogado_.regional_id || '');
      lista = regionalId ? lista.filter(function(e){ return String(e.regional_id || '') === regionalId; }) : [];
    }
  }

  ctx.estagiarios = lista.map(function(e){
    var meta = _metaTri(e.id);
    var producaoCredito = _totCredTri(e.id);
    var producaoOutros = _totOutTri(e.id);
    var metaProdutos = meta * 0.2;

    return {
      nome: e.nome,
      agencia: (e.perfil && e.perfil.agencia) || null,
      funcional: (e.perfil && e.perfil.funcional) || null,
      inicio: (e.perfil && e.perfil.inicio) || null,
      tempo_no_programa: (e.perfil && e.perfil.inicio) ? _tempo(e.perfil.inicio) : null,
      trilha: _fase(e),
      certificacao: (e.perfil && e.perfil.certificacao) || 'sem certificação',
      nota_trimestre: _nota(e.id),
      meta_trimestre: meta,
      producao_credito_total: producaoCredito,
      producao_credito: {
        INSS: _totCredMod(e.id, 0),
        OP: _totCredMod(e.id, 1),
        EP: _totCredMod(e.id, 2),
        Creditario: _totCredMod(e.id, 3)
      },
      producao_produtos_total: producaoOutros,
      producao_produtos: {
        Seguros: _totOutProd(e.id, 0),
        PIC: _totOutProd(e.id, 1),
        Combinaqui: _totOutProd(e.id, 2),
        Consorcios: _totOutProd(e.id, 4),
        Engajamento: _totOutProd(e.id, 3)
      },
      pct_atingido_credito: meta > 0 ? Math.round((producaoCredito/meta)*100) : 0,
      pct_atingido_produtos: metaProdutos > 0 ? Math.round((producaoOutros/metaProdutos)*100) : 0,
      ultima_atualizacao_producao: (e.perfil && e.perfil.ultima_atualizacao_prod) || null,
      status_atualizacao: _statusAtz(e),
      meta_diaria_contatos: _metaContatos(e.id)
    };
  });

  // Agendamentos (últimos 30 dias)
  var agendCache = window.agendamentosCache || [];
  if(agendCache && agendCache.length > 0){
    var hoje30 = new Date();
    hoje30.setDate(hoje30.getDate() - 30);
    var lim = hoje30.toISOString().slice(0,10);

    ctx.agendamentos = agendCache.filter(function(a){ return a.data >= lim; }).map(function(a){
      var pres = 0, aus = 0;
      var nomesAusentes = [];
      if(a.presenca && Array.isArray(a.presenca)){
        a.presenca.forEach(function(x){
          if(x.presente) pres++;
          else {
            aus++;
            var est = (S_.ests||[]).find(function(e){return e.id === x.estagiario_id;});
            if(est) nomesAusentes.push(est.nome);
          }
        });
      }
      return {
        data: a.data, titulo: a.titulo, tipo: a.tipo, publico: a.fase_alvo,
        criado_por: a.gestor_nome, descricao: a.descricao || null,
        presentes: pres, ausentes: aus, nomes_ausentes: nomesAusentes
      };
    });
  }

  return ctx;
}

// Renderiza uma mensagem no chat
function aiAddMsg(role, content){
  var el = document.getElementById('aiMessages');
  if(!el) return;
  var div = document.createElement('div');
  div.className = 'ai-msg ' + role;
  div.textContent = content;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function aiShowTyping(){
  var el = document.getElementById('aiMessages');
  if(!el) return;
  var div = document.createElement('div');
  div.className = 'ai-typing';
  div.id = 'aiTypingIndicator';
  div.innerHTML = '<span></span><span></span><span></span>';
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function aiHideTyping(){
  var t = document.getElementById('aiTypingIndicator');
  if(t) t.remove();
}

async function aiSendMessage(){
  var input = document.getElementById('aiInput');
  var btn = document.getElementById('aiSendBtn');
  if(!input) return;

  var msg = input.value.trim();
  if(!msg) return;

  // Adiciona mensagem do usuário
  aiAddMsg('user', msg);
  aiChatHistory.push({ role: 'user', content: msg });

  input.value = '';
  input.style.height = 'auto';
  btn.disabled = true;
  input.disabled = true;
  aiShowTyping();

  try {
    // Chama a rota segura do Next.js
    var response = await fetch(AI_EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pergunta: msg,
        historico: aiChatHistory.slice(-10) // últimas 10 mensagens
      })
    });

    aiHideTyping();

    if(!response.ok){
      var errText = await response.text();
      aiAddMsg('system', '❌ Erro na comunicação com a IA. Verifique se a Edge Function foi criada. (' + response.status + ')');
      console.error('Erro IA:', errText);
      return;
    }

    var data = await response.json();
    var resposta = data.resposta || data.answer || data.content || 'Sem resposta.';

    aiAddMsg('assistant', resposta);
    aiChatHistory.push({ role: 'assistant', content: resposta });

  } catch(err) {
    aiHideTyping();
    aiAddMsg('system', '❌ Erro: ' + (err.message || 'desconhecido'));
    console.error('Erro IA:', err);
  } finally {
    btn.disabled = false;
    input.disabled = false;
    input.focus();
  }
}

// Inicializar listeners da IA
function initAIListeners(){
  var floatBtn = document.getElementById('aiFloatBtn');
  var modal = document.getElementById('aiChatModal');
  var closeBtn = document.getElementById('aiChatClose');
  var sendBtn = document.getElementById('aiSendBtn');
  var input = document.getElementById('aiInput');

  if(floatBtn) floatBtn.addEventListener('click', function(){
    aiChatOpen = !aiChatOpen;
    if(aiChatOpen){
      modal.classList.add('open');
      document.body.classList.add('ai-chat-is-open');
      floatBtn.classList.add('ai-hidden');
      floatBtn.style.transform = 'scale(0.9)';
      setTimeout(function(){ floatBtn.style.transform = ''; input && input.focus(); }, 200);
      // Recarregar agendamentos ao abrir
      if(typeof carregarAgendamentos === 'function'){
        carregarAgendamentos();
      }
    } else {
      modal.classList.remove('open');
      document.body.classList.remove('ai-chat-is-open');
      floatBtn.classList.remove('ai-hidden');
    }
  });

  if(closeBtn) closeBtn.addEventListener('click', function(){
    aiChatOpen = false;
    modal.classList.remove('open');
    document.body.classList.remove('ai-chat-is-open');
    if(floatBtn) floatBtn.classList.remove('ai-hidden');
  });

  if(sendBtn) sendBtn.addEventListener('click', aiSendMessage);

  if(input){
    input.addEventListener('keydown', function(e){
      if(e.key === 'Enter' && !e.shiftKey){
        e.preventDefault();
        aiSendMessage();
      }
    });
    input.addEventListener('input', function(){
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
  }

  // Chips de sugestão
  document.querySelectorAll('.ai-sug-chip').forEach(function(chip){
    chip.addEventListener('click', function(){
      var msg = this.getAttribute('data-msg');
      if(input && msg){
        input.value = msg;
        aiSendMessage();
      }
    });
  });
}

// Inicializa quando o DOM está pronto
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initAIListeners);
} else {
  initAIListeners();
}

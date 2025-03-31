// Pegar os elementos para manipular
const novoPedidoBt = document.getElementById('novopedidobtn');
const listPedidosBt = document.getElementById('listpeditbtn');
const novoPedidoSec = document.getElementById('novopedido_s');
const secPedidoSec = document.getElementById('pedidoslist_s');
const formPedidos = document.getElementById('pedidosForm');
const pedidosLista = document.getElementById('list_pedidos');
const filtroEstado = document.getElementById('filtro_1_estado');
const filtroTipo = document.getElementById('filtro_2_tipo');
const modalPedidos = document.getElementById('modal_pedidos');
const fecharModal = document.querySelector('.fechar_modal');
const pedidosDetalhes = document.getElementById('pedidos_detalhes');
const BtnAprovar = document.getElementById('aprovBtn');
const BtnRejeitar = document.getElementById('rejeitarBtn');
const confirmPedidos = document.getElementById('pedidoconfirm');
const NumPedidos = document.getElementById('n_pedidos');
const acModal = document.getElementById('ac_modal');

// Variáveis globais
let pedidos = [];
let pedidoSelecionadoId = null;

// Inicializar aplicação
function iniciarApp() {
    carregarPedidos();
    renderizarPedidos();
    configurarEventListeners();
}

// Configurar Event Listeners
function configurarEventListeners() {
    novoPedidoBt.addEventListener('click', () => trocarAba(novoPedidoBt, novoPedidoSec));
    listPedidosBt.addEventListener('click', () => trocarAba(listPedidosBt, secPedidoSec));
    
    formPedidos.addEventListener('submit', manipularSubmissaoPedido);
    
    filtroEstado.addEventListener('change', renderizarPedidos);
    filtroTipo.addEventListener('change', renderizarPedidos);
    
    fecharModal.addEventListener('click', fecharModalPedido);
    
    BtnAprovar.addEventListener('click', () => atualizarStatusPedido('APPROVED'));
    BtnRejeitar.addEventListener('click', () => atualizarStatusPedido('REJECTED'));
    
    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === modalPedidos) {
            fecharModalPedido();
        }
    });
}

// Alternar entre abas
function trocarAba(botaoAtivo, secaoAtiva) {
    // Atualizar estado dos botões
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    botaoAtivo.classList.add('active');
    
    // Atualizar visibilidade da seção
    document.querySelectorAll('section').forEach(section => section.classList.add('section-hidden'));
    document.querySelectorAll('section').forEach(section => section.classList.remove('active-area'));
    secaoAtiva.classList.remove('section-hidden');
    secaoAtiva.classList.add('active-area');
    
    // Se estiver alternando para a lista de pedidos, atualizar a lista
    if (secaoAtiva === secPedidoSec) {
        renderizarPedidos();
    }
}

// Manipular envio do formulário de pedido
function manipularSubmissaoPedido(e) {
    e.preventDefault();
    
    const nomeEmpresa = document.getElementById('nomeEmpresa').value;
    const tipoPedido = document.getElementById('tipoPedido').value;
    const descricaoPedido = document.getElementById('descricaoPedido').value;
    const valorPedido = parseFloat(document.getElementById('valorpedido').value);
    
    // Criar novo objeto de pedido
    const novoPedido = {
        id: gerarIdPedido(),
        empresa: nomeEmpresa,
        tipo: tipoPedido,
        descricao: descricaoPedido,
        valor: valorPedido,
        estado: 'PENDING',
        data: new Date().toISOString(),
    };
    
    // Adicionar ao array de pedidos
    pedidos.push(novoPedido);
    
    // Salvar no localStorage
    salvarPedidos();
    
    // Resetar formulário
    formPedidos.reset();
    
    // Mostrar mensagem de confirmação
    mostrarMensagemConfirmacao("Pedido enviado com sucesso!");
}

// Gerar ID único para o pedido
function gerarIdPedido() {
    return 'PED-' + Math.floor(100000 + Math.random() * 900000);
}

// Carregar pedidos do localStorage
function carregarPedidos() {
    const pedidosArmazenados = localStorage.getItem('pedidos');
    if (pedidosArmazenados) {
        pedidos = JSON.parse(pedidosArmazenados);
    } else {
        // Carregar dados de exemplo se não existirem pedidos
        carregarDadosExemplo();
    }
}

// Salvar pedidos no localStorage
function salvarPedidos() {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
}

// Renderizar lista de pedidos com base nos filtros
function renderizarPedidos() {
    const valorEstado = filtroEstado.value;
    const valorTipo = filtroTipo.value;
    
    // Filtrar pedidos
    const pedidosFiltrados = pedidos.filter(pedido => {
        const filtroEstadoMatch = valorEstado === 'todos' || pedido.estado === valorEstado;
        const filtroTipoMatch = valorTipo === 'todos' || pedido.tipo === valorTipo;
        
        return filtroEstadoMatch && filtroTipoMatch;
    });
    
    // Limpar lista atual
    pedidosLista.innerHTML = '';
    
    // Mostrar mensagem "sem pedidos" se necessário
    if (pedidosFiltrados.length === 0) {
        NumPedidos.style.display = 'block';
    } else {
        NumPedidos.style.display = 'none';
        
        // Renderizar cada pedido
        pedidosFiltrados.forEach(pedido => {
            const linha = document.createElement('tr');
            
            // Formatar data
            const dataPedido = new Date(pedido.data);
            const dataFormatada = dataPedido.toLocaleDateString() + ' ' + 
                                 dataPedido.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            // Criar classe de badge de status
            const classeEstado = `status-badge status-${pedido.estado.toLowerCase()}`;
            
            // Criar nome de estado em português
            let estadoTexto = pedido.estado;
            if (pedido.estado === 'PENDING') estadoTexto = 'PENDENTE';
            if (pedido.estado === 'APPROVED') estadoTexto = 'APROVADO';
            if (pedido.estado === 'REJECTED') estadoTexto = 'REJEITADO';
            
            linha.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.empresa}</td>
                <td>${pedido.tipo}</td>
                <td>${truncarTexto(pedido.descricao, 50)}</td>
                <td>€${pedido.valor.toFixed(2)}</td>
                <td><span class="${classeEstado}">${estadoTexto}</span></td>
                <td>${dataFormatada}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${pedido.id}">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </td>
            `;
            
            // Adicionar event listener ao botão de visualização
            const btnVisualizar = linha.querySelector('.view-btn');
            btnVisualizar.addEventListener('click', () => abrirDetalhesPedido(pedido.id));
            
            pedidosLista.appendChild(linha);
        });
    }
}

// Truncar texto para exibição na tabela
function truncarTexto(texto, tamanhoMaximo) {
    if (texto.length <= tamanhoMaximo) return texto;
    return texto.substr(0, tamanhoMaximo) + '...';
}

// Abrir modal de detalhes do pedido
function abrirDetalhesPedido(pedidoId) {
    const pedido = pedidos.find(p => p.id === pedidoId);
    pedidoSelecionadoId = pedidoId;
    
    if (pedido) {
        // Formatar data
        const dataPedido = new Date(pedido.data);
        const dataFormatada = dataPedido.toLocaleDateString() + ' ' + 
                             dataPedido.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Criar nome de estado em português
        let estadoTexto = pedido.estado;
        if (pedido.estado === 'PENDING') estadoTexto = 'PENDENTE';
        if (pedido.estado === 'APPROVED') estadoTexto = 'APROVADO';
        if (pedido.estado === 'REJECTED') estadoTexto = 'REJEITADO';
        
        // Preencher detalhes do pedido
        pedidosDetalhes.innerHTML = `
            <div class="detail-item">
                <div class="detail-label">ID do Pedido:</div>
                <div class="detail-value">${pedido.id}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Empresa:</div>
                <div class="detail-value">${pedido.empresa}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Tipo de Pedido:</div>
                <div class="detail-value">${pedido.tipo}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Descrição:</div>
                <div class="detail-value">${pedido.descricao}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Valor:</div>
                <div class="detail-value">€${pedido.valor.toFixed(2)}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Data de Submissão:</div>
                <div class="detail-value">${dataFormatada}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Estado:</div>
                <div class="detail-value">
                    <span class="status-badge status-${pedido.estado.toLowerCase()}">${estadoTexto}</span>
                </div>
            </div>
        `;
        
        // Mostrar/ocultar botões de ação com base no estado do pedido
        if (pedido.estado === 'PENDING') {
            acModal.style.display = 'flex';
        } else {
            acModal.style.display = 'none';
        }
        
        // Mostrar modal
        modalPedidos.style.display = 'block';
    }
}

// Fechar modal de detalhes do pedido
function fecharModalPedido() {
    modalPedidos.style.display = 'none';
    pedidoSelecionadoId = null;
}

// Atualizar estado do pedido (aprovar ou rejeitar)
function atualizarStatusPedido(novoEstado) {
    const indicePedido = pedidos.findIndex(p => p.id === pedidoSelecionadoId);
    
    if (indicePedido !== -1) {
        pedidos[indicePedido].estado = novoEstado;
        salvarPedidos();
        fecharModalPedido();
        renderizarPedidos();
        
        // Criar mensagem em português
        let mensagem = `Pedido ${pedidoSelecionadoId} foi `;
        if (novoEstado === 'APPROVED') mensagem += 'aprovado.';
        if (novoEstado === 'REJECTED') mensagem += 'rejeitado.';
        
        // Mostrar mensagem de confirmação
        mostrarMensagemConfirmacao(mensagem);
    }
}

// Mostrar mensagem de confirmação
function mostrarMensagemConfirmacao(mensagem) {
    confirmPedidos.textContent = mensagem;
    confirmPedidos.classList.add('show');
    
    setTimeout(() => {
        confirmPedidos.classList.remove('show');
    }, 3000);
}

// Carregar dados de exemplo para demonstração
function carregarDadosExemplo() {
    const pedidosExemplo = [
        {
            id: 'PED-123456',
            empresa: 'Tech Solutions Lda',
            tipo: 'Aquisicao de Materiais',
            descricao: 'Compra de 10 laptops para a equipe de desenvolvimento',
            valor: 12000,
            estado: 'PENDING',
            data: '2025-03-20T10:30:00Z'
        },
        {
            id: 'PED-234567',
            empresa: 'Grupo de Marketing',
            tipo: 'Solicitacao de Servicos',
            descricao: 'Sessão de fotos profissional para nova linha de produtos',
            valor: 3500,
            estado: 'APPROVED',
            data: '2025-03-18T14:15:00Z'
        },
        {
            id: 'PED-345678',
            empresa: 'Departamento Financeiro',
            tipo: 'Pedido de Reembolso',
            descricao: 'Despesas de viagem para reunião trimestral em Madrid',
            valor: 1250.75,
            estado: 'REJECTED',
            data: '2025-03-15T09:45:00Z'
        },
        {
            id: 'PED-456789',
            empresa: 'Divisão de RH',
            tipo: 'Pedido de Formacao',
            descricao: 'Workshop avançado de liderança para gerentes',
            valor: 4800,
            estado: 'PENDING',
            data: '2025-03-22T11:20:00Z'
        },
        {
            id: 'PED-567890',
            empresa: 'Tech Solutions Lda',
            tipo: 'Aquisicao de Materiais',
            descricao: 'Mobiliário de escritório para nova sala de reuniões',
            valor: 8750.50,
            estado: 'APPROVED',
            data: '2025-03-19T15:30:00Z'
        }
    ];
    
    pedidos = pedidosExemplo;
    salvarPedidos();
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', iniciarApp);
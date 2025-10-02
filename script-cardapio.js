/**
 * ARQUIVO: script-cardapio.js (Versão Simplificada "Sim/Não")
 */

// --- SELETORES DO DOM ---
const dataCardapioDisplay = document.getElementById('data-cardapio'); // NOVO: Para exibir a data/título
const agendarButton = document.getElementById('agendar-refeicao-btn');
const ticketBox = document.getElementById('ticket-box');
const ticketStatus = document.getElementById('ticket-status');

// Elementos do Modal de Feedback
const modalOverlay = document.getElementById('modal-feedback');
const modalMessage = document.getElementById('modal-message');
const modalIcon = document.getElementById('modal-icon');
const modalCloseBtnX = document.querySelector('.modal-close-btn');
const modalCloseBtnOK = document.querySelector('.modal-close-button');

// Elementos de Ação do Ticket (dentro do ticket-box)
const cancelarButton = document.getElementById('cancelar-refeicao-btn');
const reagendarButton = document.getElementById('re-agendar-refeicao-btn');

// Variável para guardar a data e o título da refeição que está sendo exibida/agendada
let tituloRefeicaoExibida = "";

// --- 1. FUNÇÕES DE DADOS E SIMULAÇÃO ---

/**
 * Simula a obtenção do status do cardápio e o título da refeição para a data atual.
 * @returns {Object} Status e título simulados.
 */
function buscarCardapioStatus() {
    const now = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    
    // Define a refeição como Janta do dia
    const dataFormatada = now.toLocaleDateString('pt-BR', options);
    const tituloRefeicao = `Janta do dia: ${dataFormatada}`;
    
    // GUARDA O TÍTULO FORMATADO para uso nos popups
    tituloRefeicaoExibida = tituloRefeicao;

    // SIMULAÇÃO DE STATUS (Poderia ser 'esgotado', 'nao-disponivel'...)
    return { 
        titulo: tituloRefeicao, 
        status: "disponivel" 
    };
}

/**
 * Determina se o agendamento está dentro do horário permitido.
 * ALTERAÇÃO: A função sempre retorna TRUE para permitir a reserva a qualquer hora.
 * @returns {boolean} True (sempre).
 */
function isHorarioDeAgendamento() {
    return true;
}

// --- 2. FUNÇÕES DE RENDERIZAÇÃO E UI ---

/**
 * Exibe o popup (modal) com uma mensagem customizada e o ícone apropriado.
 * @param {string} type - 'success' ou 'cancel'.
 * @param {string} message - A mensagem a ser exibida.
 */
function showModal(type, message) {
    modalMessage.textContent = message;
    
    modalIcon.classList.remove('icon-success', 'icon-cancel', 'fa-check-circle', 'fa-times-circle');
    
    if (type === 'success') {
        modalIcon.classList.add('icon-success', 'fa-check-circle');
    } else if (type === 'cancel') {
        modalIcon.classList.add('icon-cancel', 'fa-times-circle');
    }

    modalOverlay.style.display = 'flex';
}

/**
 * Esconde o popup (modal).
 */
function hideModal() {
    modalOverlay.style.display = 'none';
}


/**
 * Gerencia a visibilidade dos botões e o status do ticket.
 * @param {string} cardapioStatus - 'disponivel', 'esgotado', 'nao-disponivel'.
 */
function renderizarTicketStatus(cardapioStatus) {
    const userHasTicket = localStorage.getItem('userTicket') === 'true';
    const isSchedulingTime = isHorarioDeAgendamento(); // Agora será sempre true

    // Remove classes de estilo antes de definir o novo estado
    agendarButton.classList.remove('primary-button', 'form-action-button');

    // Esconde/Mostra os elementos por padrão
    agendarButton.style.display = 'none';
    ticketBox.style.display = 'none';

    if (userHasTicket) {
        // Usuário JÁ agendou
        ticketBox.style.display = 'flex';
        ticketStatus.textContent = "Seu ticket está AGENDADO!";
        ticketStatus.style.color = '#27ae60';
        return;
    } 
    
    // Usuário NÃO agendou
    if (!isSchedulingTime) {
        // Esta condição NUNCA será verdadeira, mas a deixamos por segurança.
        ticketBox.style.display = 'flex';
        ticketStatus.textContent = "O período de agendamento (até 14h) está encerrado."; 
        ticketStatus.style.color = '#c0392b';
        return;
    }

    // Dentro do horário (AGORA SEMPRE TRUE)
    switch (cardapioStatus) {
        case 'disponivel':
            agendarButton.style.display = 'block';
            agendarButton.textContent = "AGENDAR REFEIÇÃO";
            agendarButton.disabled = false;
            agendarButton.style.opacity = 1;
            // APLICANDO ESTILO: Adicionando classes de botão
            agendarButton.classList.add('primary-button', 'form-action-button'); 
            break;
        case 'esgotado':
            agendarButton.style.display = 'block';
            agendarButton.textContent = "ESGOTADO";
            agendarButton.disabled = true;
            agendarButton.style.opacity = 0.6;
            break;
        case 'nao-disponivel':
        default:
            agendarButton.style.display = 'block';
            agendarButton.textContent = "AGENDAR REFEIÇÃO";
            agendarButton.disabled = true;
            agendarButton.style.opacity = 0.6;
            break;
    }
}


// --- 3. FUNÇÕES DE AÇÃO (RESERVA/CANCELAMENTO) ---

/**
 * Lógica para reservar a refeição (acionada pelo botão + ou Agendar).
 */
function reservarRefeicao() {
    if (agendarButton && agendarButton.disabled) return;
    
    localStorage.setItem('userTicket', 'true');
    
    renderizarTicketStatus('agendado');
    showModal('success', `Você Reservou sua ${tituloRefeicaoExibida}`); // Usa o título da refeição
}

/**
 * Lógica para cancelar a refeição (acionada pelo botão -).
 */
function cancelarRefeicao() {
    localStorage.removeItem('userTicket');
    
    const statusAtual = buscarCardapioStatus(); // Recarrega o status (deve voltar para 'disponivel')
    renderizarTicketStatus(statusAtual.status);
    
    showModal('cancel', `Você cancelou sua ${tituloRefeicaoExibida}`); // Usa o título da refeição
}


/**
 * Função principal para iniciar o carregamento dos dados e adicionar listeners.
 */
function initCardapio() {
    const cardapioDoDia = buscarCardapioStatus();
    
    // 1. Exibe o título do cardápio no topo
    dataCardapioDisplay.textContent = cardapioDoDia.titulo;

    // 2. Renderiza os botões e o status do ticket
    renderizarTicketStatus(cardapioDoDia.status);

    // 3. Adiciona os listeners aos botões
    if (agendarButton) {
        agendarButton.addEventListener('click', reservarRefeicao);
    }
    if (cancelarButton) {
        cancelarButton.addEventListener('click', cancelarRefeicao);
    }
    // O botão de + dentro do ticket-box (re-agendar)
    if (reagendarButton) {
        reagendarButton.addEventListener('click', reservarRefeicao);
    }
    
    // 4. Adiciona listeners para fechar o Modal
    if (modalOverlay) {
        modalCloseBtnX.addEventListener('click', hideModal);
        modalCloseBtnOK.addEventListener('click', hideModal);
        
        // Fechar ao clicar fora (no overlay)
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                hideModal();
            }
        });
    }
}

// Inicializa o script ao carregar a página
document.addEventListener('DOMContentLoaded', initCardapio);
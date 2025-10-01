/**
 * script-nav.js
 * * * UNIFICADO: Gerencia Navegação (com Validação de Campos), 
 * * Limpeza de Inputs e Lógica do Botão Cardápio (+/-).
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ------------------------------------------------
    // FUNÇÃO DE VALIDAÇÃO DE CAMPOS (1)
    // ------------------------------------------------

    /**
     * Verifica se todos os campos (input, select, textarea) dentro do contêiner
     * fornecido estão preenchidos.
     * @param {HTMLElement} container O elemento que contém os campos a serem validados (geralmente o form).
     * @returns {boolean} Retorna true se todos estiverem preenchidos, false caso contrário.
     */
    const validateFields = (container) => {
        let allValid = true;
        
        // Seleciona todos os campos de preenchimento relevantes que não são botões
        const fields = container.querySelectorAll('input:not([type="submit"]):not([type="button"]), select, textarea');

        fields.forEach(field => {
            // Remove qualquer destaque de erro anterior
            field.classList.remove('error-field'); 
            
            // Verifica se o campo está vazio (após remover espaços em branco)
            if (field.value.trim() === "") {
                allValid = false;
                
                // Adiciona a classe para destacar o campo com erro (que é estilizada no CSS)
                field.classList.add('error-field');
                
                console.warn(`Campo vazio encontrado: ${field.id || field.name || field.tagName}`);
            }
        });

        if (!allValid) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            
            // Foca no primeiro campo com erro para facilitar a correção pelo usuário
            const firstError = container.querySelector('.error-field');
            if (firstError) {
                firstError.focus();
            }
        }

        return allValid;
    };


    // ------------------------------------------------
    // 2. LÓGICA DE NAVEGAÇÃO ENTRE TELAS (COM VALIDAÇÃO)
    // ------------------------------------------------

    const navElements = document.querySelectorAll(
        'a.menu-item, a.form-action-button, button.submit-button'
    );

    navElements.forEach(element => {
        
        // A. Botões de Submissão/Ação (que exigem validação de formulário)
        if (element.tagName === 'BUTTON' && element.classList.contains('submit-button')) {
            element.addEventListener('click', (e) => {
                e.preventDefault(); // Impede a submissão e navegação imediata
                
                // Encontra o contêiner do formulário pai mais próximo para validar
                const form = element.closest('.login-form') || element.closest('.data-form');

                // Executa a validação
                if (form && validateFields(form)) {
                    // SE A VALIDAÇÃO PASSAR, realiza a navegação.
                    window.location.href = 'tela-modulos-acesso.html';
                }
                // Se a validação falhar, a navegação é bloqueada.
            });
            
        } 
        
        // B. Links de Menu e Botões de Navegação Simples (não exigem validação)
        else if (element.tagName === 'A' && element.getAttribute('href')) {
            element.addEventListener('click', (e) => {
                // A navegação ocorre pelo próprio atributo href do <a>
                const targetUrl = element.getAttribute('href');
                console.log(`Navegando para: ${targetUrl}`);
            });
        }
    });

    // ------------------------------------------------
    // 3. LÓGICA PARA LIMPAR INPUTS (Ícone 'X')
    // ------------------------------------------------
    document.querySelectorAll('.clear-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const input = e.target.previousElementSibling;
            if (input) {
                input.value = '';
                // Remove o destaque de erro ao limpar, se houver
                input.classList.remove('error-field'); 
                console.log('Input limpo.');
            }
        });
    });

    // ------------------------------------------------
    // 4. LÓGICA PARA O BOTÃO DO CARDÁPIO (+/-)
    // ------------------------------------------------
    
    const ticketButton = document.querySelector('.ticket-action-button');

    if (ticketButton) {
        // Estado inicial (assumindo comprado para o botão ser '-')
        let isTicketBought = true; 
        const COLOR_CANCEL = '#c0392b'; // Vermelho
        const COLOR_BUY = '#27ae60';    // Verde
        
        const updateButtonState = () => {
            if (isTicketBought) {
                ticketButton.textContent = '-'; 
                ticketButton.style.backgroundColor = COLOR_CANCEL;
                // Lógica de backend: Registrar cancelamento/manter compra
            } else {
                ticketButton.textContent = '+';
                ticketButton.style.backgroundColor = COLOR_BUY;
                // Lógica de backend: Registrar nova compra
            }
        };

        updateButtonState(); // Aplica o estado inicial

        ticketButton.addEventListener('click', () => {
            isTicketBought = !isTicketBought; // Alterna o estado
            updateButtonState(); // Atualiza o visual
        });
    }
});
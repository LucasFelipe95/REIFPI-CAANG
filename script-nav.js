/**
 * script-nav.js
 * * * UNIFICADO: Gerencia Navegação (com Validação de Campos), 
 * * Limpeza de Inputs.
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
    // 2. LÓGICA DE NAVEGAÇÃO ENTRE TELAS (COM VALIDAÇÃO) - ALTERADO
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
                    // --- NOVA LÓGICA DE REDIRECIONAMENTO ---
                    let targetUrl = 'tela-modulos-acesso.html'; // Padrão: Login de Usuário
                    
                    // Verifica se é o formulário de login do ADM
                    if (form.id === 'adm-login-form') {
                        targetUrl = 'tela-modulos-acesso_adm.html'; // Redireciona para o ADM
                    } 
                    // Se for um formulário .data-form (como Alterar Dados), redireciona para menu-conta
                    else if (form.classList.contains('data-form')) {
                         targetUrl = 'tela-menu-conta.html'; 
                    }
                    // Se for o login normal (sem ID), mantém o padrão 'tela-modulos-acesso.html'
                    
                    // SE A VALIDAÇÃO PASSAR, realiza a navegação.
                    window.location.href = targetUrl;
                }
                // Se a validação falhar, a navegação é bloqueada.
            });
            
        } 
        
        // B. Links de Menu e Botões de Navegação Simples 
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
    // 4. LÓGICA PARA O BOTÃO DO CARDÁPIO (+/-) - REVERSÃO
    // ------------------------------------------------
    
    // Esta seção foi mantida na versão simplificada (sem toggle), 
    // mas a lógica completa do ticket é controlada por script-cardapio.js.
    const ticketButton = document.querySelector('.ticket-action-button');

    if (ticketButton) {
        // Se a lógica do script-cardapio.js não for carregada, este bloco pode causar comportamento inesperado.
        // É melhor confiar no script-cardapio.js para esta funcionalidade.
    }
});
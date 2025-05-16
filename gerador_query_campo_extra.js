/**
 * Gerador de Queries SQL para Campos Extras
 * Script JavaScript para implementar a lógica do formulário e geração de SQL
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const formCampoExtra = document.getElementById('formCampoExtra');
    const dsLabelInput = document.getElementById('ds_label');
    const idKeyInput = document.getElementById('id_key');
    const moduloSelect = document.getElementById('modulo');
    const idFieldsetSelect = document.getElementById('id_fieldset');
    const idTipoSelect = document.getElementById('id_tipo');
    const secaoOpcoes = document.getElementById('secaoOpcoes');
    const opcoesContainer = document.getElementById('opcoes-container');
    const btnAdicionarOpcao = document.getElementById('btn-adicionar-opcao');
    const btnGerarSQL = document.getElementById('btn-gerar');
    const btnLimpar = document.getElementById('btn-limpar');
    const btnCopiar = document.getElementById('btn-copiar');
    const resultadoSection = document.getElementById('resultado');
    const sqlOutput = document.getElementById('sql-output');
    
    // Elementos de configuração
    const secaoFieldset = idFieldsetSelect.closest('.form-group');

    // Inicialização
    inicializarEventos();

    /**
     * Inicializa todos os eventos do formulário
     */
    function inicializarEventos() {
        // Gerar ID_KEY automaticamente quando o usuário digitar o DS_LABEL
        dsLabelInput.addEventListener('input', function() {
            idKeyInput.value = gerarIdKey(this.value);
        });
        
        // Mostrar/esconder seção de fieldset baseado no módulo selecionado
        moduloSelect.addEventListener('change', function() {
            // A seção de fieldset só é relevante para o módulo USUARIO
            secaoFieldset.style.display = this.value === 'USUARIO' ? 'block' : 'none';
            
            // Se não for USUARIO, limpa a seleção de fieldset
            if (this.value !== 'USUARIO') {
                idFieldsetSelect.value = '';
            }
        });
        
        // Inicializa o estado da seção de fieldset
        secaoFieldset.style.display = 'none';

        // Mostrar/esconder seção de opções baseado no tipo de campo selecionado
        idTipoSelect.addEventListener('change', function() {
            // Limitado apenas a radio button, checkbox e listbox
            const tiposComOpcoes = ['3', '7', '8'];
            secaoOpcoes.style.display = tiposComOpcoes.includes(this.value) ? 'block' : 'none';
        });

        // Adicionar nova opção
        btnAdicionarOpcao.addEventListener('click', adicionarOpcao);

        // Remover opção (delegação de eventos)
        opcoesContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-remover-opcao')) {
                const grupo = e.target.closest('.opcao-grupo');
                if (opcoesContainer.children.length > 1) {
                    grupo.remove();
                } else {
                    // Se for a última opção, apenas limpa o valor
                    grupo.querySelector('.opcao-input').value = '';
                }
            }
        });

        // Gerar SQL
        btnGerarSQL.addEventListener('click', gerarSQL);

        // Limpar formulário
        btnLimpar.addEventListener('click', function() {
            formCampoExtra.reset();
            idKeyInput.value = '';
            secaoOpcoes.style.display = 'none';
            secaoFieldset.style.display = 'none';
            // Limpar opções, deixando apenas uma vazia
            opcoesContainer.innerHTML = `
                <div class="form-group opcao-grupo">
                    <input type="text" class="opcao-input" placeholder="Digite uma opção">
                    <button type="button" class="btn-remover-opcao">Remover</button>
                </div>
            `;
            resultadoSection.style.display = 'none';
        });

        // Copiar SQL para a área de transferência
        btnCopiar.addEventListener('click', function() {
            const textoSQL = sqlOutput.textContent;
            navigator.clipboard.writeText(textoSQL)
                .then(() => {
                    const btnOriginalText = btnCopiar.textContent;
                    btnCopiar.textContent = 'Copiado!';
                    setTimeout(() => {
                        btnCopiar.textContent = btnOriginalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Erro ao copiar: ', err);
                    alert('Não foi possível copiar o texto. Por favor, selecione e copie manualmente.');
                });
        });
    }

    /**
     * Adiciona um novo campo de opção
     */
    function adicionarOpcao() {
        const novaOpcao = document.createElement('div');
        novaOpcao.className = 'form-group opcao-grupo';
        novaOpcao.innerHTML = `
            <input type="text" class="opcao-input" placeholder="Digite uma opção">
            <button type="button" class="btn-remover-opcao">Remover</button>
        `;
        opcoesContainer.appendChild(novaOpcao);
    }

    /**
     * Gera um ID_KEY a partir do DS_LABEL
     * @param {string} dsLabel - O valor do DS_LABEL
     * @returns {string} - O ID_KEY gerado
     */
    function gerarIdKey(dsLabel) {
        if (!dsLabel) return '';
        
        // Remove acentos
        let texto = dsLabel.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
        // Remove caracteres especiais e substitui espaços por underscore
        texto = texto.replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
        
        // Converte para maiúsculas
        return texto.toUpperCase();
    }

    /**
     * Formata o valor para SQL, adicionando aspas para valores de texto
     * @param {string} coluna - Nome da coluna
     * @param {*} valor - Valor a ser formatado
     * @returns {string} - Valor formatado para SQL
     */
    function formatarValor(coluna, valor) {
        const colunasTexto = ["ID_KEY", "DS_LABEL", "DS_MASK", "DS_PLACEHOLDER", "DS_VALUE_DEFAULT"];
        if (colunasTexto.includes(coluna)) {
            return `'${valor}'`;
        }
        return valor;
    }

    /**
     * Gera o SQL baseado nos dados do formulário
     */
    function gerarSQL() {
        // Validação básica
        if (!validarFormulario()) return;

        // Coleta os dados do formulário
        const dados = coletarDadosFormulario();
        
        // Monta colunas e valores dinâmicos
        const colunas = [];
        const valores = [];
        
        // Adiciona campos obrigatórios
        colunas.push("ID_KEY", "DS_LABEL");
        valores.push(dados.id_key, dados.ds_label);
        
        // Adiciona campos de configuração
        if (dados.id_fieldset) {
            colunas.push("ID_FIELDSET");
            valores.push(dados.id_fieldset);
        }
        colunas.push("ID_TIPO", "NR_POSICAO");
        valores.push(dados.id_tipo, dados.nr_posicao);
        
        // Adiciona campos de permissão
        colunas.push("ID_PERMISSAOADMINISTRADOR", "ID_PERMISSAOUSUARIO");
        valores.push(dados.id_perm_admin, dados.id_perm_usuario);
        
        // Adiciona campos booleanos
        const camposBooleanos = [
            "ID_ECOMMERCE", "ID_OBRIGATORIO", "ID_PESQUISA", "ID_RELATORIO",
            "ID_CAMPOPADRAO", "ID_CAMPOUNICO", "ID_CERTIFICADO", 
            "ID_TOKEN_MSG_AUTOMATICA", "ID_FORCAR_EDICAO", "ID_LISTAPRESENCA"
        ];
        
        camposBooleanos.forEach(campo => {
            colunas.push(campo);
            valores.push(dados[campo.toLowerCase()] ? 1 : 0);
        });
        
        // Adiciona campos descritivos se fornecidos
        if (dados.ds_mask) {
            colunas.push("DS_MASK");
            valores.push(dados.ds_mask);
        }
        if (dados.ds_placeholder) {
            colunas.push("DS_PLACEHOLDER");
            valores.push(dados.ds_placeholder);
        }
        if (dados.ds_value_default) {
            colunas.push("DS_VALUE_DEFAULT");
            valores.push(dados.ds_value_default);
        }

        // Gera o script SQL
        let sqlLines = [];
        sqlLines.push("-- Script SQL para inserção do novo campo extra:");
        sqlLines.push("INSERT INTO TB_CAMPOEXTRA (");
        
        // Formata as colunas em múltiplas linhas para melhor legibilidade
        for (let i = 0; i < colunas.length; i++) {
            if (i < colunas.length - 1) {
                sqlLines.push(`    ${colunas[i]},`);
            } else {
                sqlLines.push(`    ${colunas[i]}`);
            }
        }
        
        sqlLines.push(") VALUES (");
        
        // Formata os valores em múltiplas linhas
        for (let i = 0; i < valores.length; i++) {
            const valorFormatado = formatarValor(colunas[i], valores[i]);
            if (i < valores.length - 1) {
                sqlLines.push(`    ${valorFormatado},`);
            } else {
                sqlLines.push(`    ${valorFormatado}`);
            }
        }
        
        sqlLines.push(");\nSET @idCE = (SELECT last_insert_id());");

        // Insere módulo
        sqlLines.push(`INSERT INTO TB_CAMPOEXTRA_MODULO (CD_CAMPOEXTRA, ID_MODULO) VALUES (@idCE, '${dados.modulo}');`);

        // Insere opções de seleção se aplicável
        if (dados.opcoes && dados.opcoes.length > 0) {
            for (const opc of dados.opcoes) {
                if (opc) { // Verifica se a opção não está vazia
                    sqlLines.push(`INSERT INTO TB_CAMPOEXTRA_OPCOES_SELECAO (CD_CAMPOEXTRA, ID_OPCAO) VALUES (@idCE, '${opc}');`);
                }
            }
        }
        
        sqlLines.push("\n-- Fim do script SQL --");
        
        // Exibe o resultado
        sqlOutput.textContent = sqlLines.join('\n');
        resultadoSection.style.display = 'block';
        resultadoSection.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Coleta todos os dados do formulário
     * @returns {Object} - Objeto com os dados do formulário
     */
    function coletarDadosFormulario() {
        const dados = {
            ds_label: dsLabelInput.value.trim(),
            id_key: idKeyInput.value.trim(),
            id_fieldset: document.getElementById('id_fieldset').value,
            id_tipo: document.getElementById('id_tipo').value,
            nr_posicao: document.getElementById('nr_posicao').value,
            id_perm_admin: document.getElementById('id_perm_admin').value,
            id_perm_usuario: document.getElementById('id_perm_usuario').value,
            modulo: document.getElementById('modulo').value.trim(),
            ds_mask: document.getElementById('ds_mask').value.trim(),
            ds_placeholder: document.getElementById('ds_placeholder').value.trim(),
            ds_value_default: document.getElementById('ds_value_default').value.trim(),
        };

        // Campos booleanos (checkboxes)
        const checkboxes = [
            'id_ecommerce', 'id_obrigatorio', 'id_pesquisa', 'id_relatorio',
            'id_campopadrao', 'id_campounico', 'id_certificado', 
            'id_token_msg_automatica', 'id_forcar_edicao', 'id_listapresenca'
        ];
        
        checkboxes.forEach(id => {
            dados[id] = document.getElementById(id).checked;
        });

        // Coleta opções de seleção se aplicável
        const tiposComOpcoes = ['3', '4', '6', '7', '8', '9', '11'];
        if (tiposComOpcoes.includes(dados.id_tipo)) {
            dados.opcoes = [];
            document.querySelectorAll('.opcao-input').forEach(input => {
                if (input.value.trim()) {
                    dados.opcoes.push(input.value.trim());
                }
            });
        }

        return dados;
    }

    /**
     * Valida o formulário antes de gerar o SQL
     * @returns {boolean} - True se o formulário é válido, False caso contrário
     */
    function validarFormulario() {
        // Verifica campos obrigatórios
        if (!dsLabelInput.value.trim()) {
            alert('Campo obrigatório: Por favor, informe o nome que deve aparecer na interface para o usuário.');
            dsLabelInput.focus();
            return false;
        }

        if (!document.getElementById('id_tipo').value) {
            alert('Campo obrigatório: Por favor, selecione o tipo do campo (texto curto, data, lista, etc).');
            document.getElementById('id_tipo').focus();
            return false;
        }

        if (!document.getElementById('nr_posicao').value) {
            alert('Campo obrigatório: Por favor, informe a posição do campo na página (número que define a ordem de exibição).');
            document.getElementById('nr_posicao').focus();
            return false;
        }

        if (!document.getElementById('modulo').value.trim()) {
            alert('Campo obrigatório: Por favor, selecione o módulo onde este campo deve aparecer.');
            document.getElementById('modulo').focus();
            return false;
        }

        // Verifica se há opções para tipos que exigem
        // Limitado apenas a radio button, checkbox e listbox
        const tiposComOpcoes = ['3', '7', '8'];
        const tipoSelecionado = document.getElementById('id_tipo').value;
        
        if (tiposComOpcoes.includes(tipoSelecionado)) {
            const temOpcoes = Array.from(document.querySelectorAll('.opcao-input'))
                .some(input => input.value.trim() !== '');
            
            if (!temOpcoes) {
                alert('Opções de seleção: Este tipo de campo requer pelo menos uma opção que o usuário poderá selecionar. Por favor, adicione pelo menos uma opção.');
                document.querySelector('.opcao-input').focus();
                return false;
            }
        }

        return true;
    }
});
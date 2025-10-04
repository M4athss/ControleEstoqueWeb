$(document).ready(function () {
    // Seleciona todos os elementos cujo id começa com "dropDown"
    $('[id^=dropDown]').click(function (e) {
        e.stopPropagation();

        const currentDropDown = $(this).closest('.drop-down');

        // Fecha outros antes de abrir este
        $('.drop-down').not(currentDropDown).removeClass('drop-down--active');

        // Abre ou fecha o menu clicado
        currentDropDown.toggleClass('drop-down--active');
    });

    // Fecha se clicar fora
    $(document).click(function (e) {
        if (!$(e.target).closest('.drop-down').length) {
            $('.drop-down').removeClass('drop-down--active');
        }
    });


    // --- LÓGICA DA PÁGINA DE USUÁRIOS ---

    const formContainer = $('#formContainer');

    // Verifica se estamos na página de usuários (se o formulário existe)
    if (formContainer.length > 0) {

        // 1. SELEÇÃO DOS ELEMENTOS DA PÁGINA
        const btnNovoUsuario = $('#btnNovoUsuario');
        const btnCancelar = $('#btnCancelar');
        const userForm = $('#userForm');
        const userTableBody = $('.user-table tbody');
        const searchInput = $('#searchInput');
        const formTitle = $('#formTitle');

        // 2. FUNÇÕES PRINCIPAIS (ABRIR/FECHAR FORMULÁRIO)
        function abrirFormulario(modo, dados = {}) {
            userForm[0].reset();
            if (modo === 'novo') {
                formTitle.text('Novo Usuário');
                $('#userId').val('');
            } else if (modo === 'editar') {
                formTitle.text('Editar Usuário');
                $('#userCpf').val(dados.cpf);
                $('#userName').val(dados.nome);
                $('#userEmail').val(dados.email);
                $('#userLevel').val(dados.nivel);
                $('#userGroup').val(dados.grupo);
            }
            formContainer.slideDown();
        }

        function fecharFormulario() {
            formContainer.slideUp();
        }

        // 3. EVENTOS (GATILHOS DE AÇÃO)
        btnNovoUsuario.on('click', function () {
            abrirFormulario('novo');
        });

        btnCancelar.on('click', fecharFormulario);

        // Eventos na Tabela (Editar e Excluir)
        userTableBody.on('click', '.btn-edit, .btn-delete', function () {
            const button = $(this);
            const row = button.closest('tr');
            const id = button.data('id');

            if (button.hasClass('btn-edit')) {
                const dadosUsuario = {
                    id: id,
                    cpf: row.find('td:eq(0)').text(),
                    nome: row.find('td:eq(1)').text(),
                    email: row.find('td:eq(2)').text(),
                    nivel: row.find('td:eq(3)').text(),
                    grupo: row.find('td:eq(4)').text(),
                    data: row.find('td:eq(5)').text()
                };
                abrirFormulario('editar', dadosUsuario);
            }

            if (button.hasClass('btn-delete')) {
                if (confirm('Tem certeza que deseja excluir o usuário?')) {
                    row.remove();
                    alert('Usuário excluído com sucesso!');
                }
            }
        });

        // Evento para SALVAR o formulário (Criar ou Atualizar)
        userForm.on('submit', function (event) {
            event.preventDefault();

            const id = $('#userId').val();
            const cpf = $('#userCpf').val();
            const nome = $('#userName').val();
            const email = $('#userEmail').val();
            const password = $('#userPassword').val();
            const nivel = $('#userLevel').val();
            const grupo = $('#userGroup').val();

            if (id) { // ATUALIZAR
                const row = userTableBody.find(`button[data-id='${id}']`).closest('tr');
                row.find('td:eq(0)').text(cpf);
                row.find('td:eq(1)').text(nome);
                row.find('td:eq(2)').text(email);
                row.find('td:eq(3)').text(password);
                row.find('td:eq(4)').text(nivel);
                row.find('td:eq(5)').text(grupo);
                alert('Usuário atualizado com sucesso!');
            } else { // CRIAR
                const newId = new Date().getTime();
                const newRow = `
                    <tr>
                        <td>${cpf}</td>
                        <td>${nome}</td>
                        <td>${email}</td>
                        <td>${nivel}</td>
                        <td>${grupo}</td>
                        <td>${data}</td>
                        <td class="table-actions">
                            <button class="btn-icon btn-edit" data-id="${newId}">✏️</button>
                            <button class="btn-icon btn-delete" data-id="${newId}">🗑️</button>
                        </td>
                    </tr>
                `;
                userTableBody.append(newRow);
                alert('Novo usuário cadastrado com sucesso!');
            }
            fecharFormulario();
        });

        // Evento para a PESQUISA em tempo real
        searchInput.on('input', function () {
            const termoBusca = $(this).val().toLowerCase();
            userTableBody.find('tr').each(function () {
                const linha = $(this);
                const textoLinha = linha.text().toLowerCase();
                if (textoLinha.includes(termoBusca)) {
                    linha.show();
                } else {
                    linha.hide();
                }
            });
        });
    }
});
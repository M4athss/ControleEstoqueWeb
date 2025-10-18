// /src/main.js
$(document).ready(function () {
    // URL base da sua API. Altere se for diferente.
    const API_URL = 'http://localhost:8080/usuario';

    // --- LÓGICA DOS MENUS DROPDOWN ---
    $('[id^=dropDown]').click(function (e) {
        e.stopPropagation();
        const currentDropDown = $(this).closest('.drop-down');
        $('.drop-down').not(currentDropDown).removeClass('drop-down--active');
        currentDropDown.toggleClass('drop-down--active');
    });

    $(document).click(function (e) {
        if (!$(e.target).closest('.drop-down').length) {
            $('.drop-down').removeClass('drop-down--active');
        }
    });

    // --- LÓGICA DA PÁGINA DE GERENCIAMENTO DE USUÁRIOS ---
    const formContainer = $('#formContainer');
    if (formContainer.length > 0) {
        // 1. SELEÇÃO DOS ELEMENTOS DA PÁGINA
        const btnNovoUsuario = $('#btnNovoUsuario');
        const btnCancelar = $('#btnCancelar');
        const userForm = $('#userForm');
        const userTableBody = $('.user-table tbody');
        const searchInput = $('#searchInput');
        const formTitle = $('#formTitle');

        // --- FUNÇÕES AUXILIARES ---
        // Função para adicionar uma linha na tabela (reutilizável)
        function adicionarLinhaNaTabela(usuario) {
            const newRow = `
                <tr data-user-id="${usuario.id}">
                    <td>${usuario.cpf}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.idpapel}</td>//nivel
                    <td>${usuario.idgrupo}</td> //grupo
                    <td class="table-actions">
                        <button class="btn-icon btn-edit" data-id="${usuario.id}">✏️</button>
                        <button class="btn-icon btn-delete" data-id="${usuario.id}">🗑️</button>
                    </td>
                </tr>
            `;
            userTableBody.append(newRow);
        }

        // Função para carregar usuários da API e popular a tabela
        function carregarUsuarios() {
            userTableBody.empty(); // Limpa a tabela antes de carregar
            $.ajax({
                url: API_URL,
                type: 'GET',
                success: function (usuarios) {
                    usuarios.forEach(adicionarLinhaNaTabela);
                },
                error: function () {
                    alert('Erro ao carregar usuários da API.');
                }
            });
        }

        // 2. FUNÇÕES PRINCIPAIS (ABRIR/FECHAR FORMULÁRIO)
        function abrirFormulario(modo, dados = {}) {
            userForm[0].reset();
            if (modo === 'novo') {
                formTitle.text('Novo Usuário');
                $('#userId').val('');
            } else if (modo === 'editar') {
                formTitle.text('Editar Usuário');
               // $('#userId').val(dados.id);
                $('#userCpf').val(dados.cpf);
                $('#userName').val(dados.nome);
                $('#userEmail').val(dados.email);
                $('#userPapel').val(dados.idpapel);
                $('#userGrupo').val(dados.idgrupo);
                $('#userPassword').val(dados.senha);
            }
            formContainer.slideDown();
        }

        function fecharFormulario() {
            formContainer.slideUp();
        }

        // 3. EVENTOS (GATILHOS DE AÇÃO)
        btnNovoUsuario.on('click', () => abrirFormulario('novo'));
        btnCancelar.on('click', fecharFormulario);

        // Eventos na Tabela (Editar e Excluir)
        userTableBody.on('click', '.btn-edit, .btn-delete', function () {
            const button = $(this);
            const id = button.data('id');
            const row = button.closest('tr');

            if (button.hasClass('btn-edit')) {
                const dadosUsuario = {
                    id: id,
                    cpf: row.find('td:eq(0)').text(),
                    nome: row.find('td:eq(1)').text(),
                    email: row.find('td:eq(2)').text(),
                    idpapel: row.find('td:eq(3)').text(),
                    idgrupo: row.find('td:eq(4)').text(),
                    senha: row.find('td:eq(5)').text(),
                };
                abrirFormulario('editar', dadosUsuario);
            }

            if (button.hasClass('btn-delete')) {
                if (confirm('Tem certeza que deseja excluir o usuário?')) {
                    $.ajax({
                        url: `${API_URL}/${id}`,
                        type: 'DELETE'
                    }).done(function () {
                        row.remove();
                        alert('Usuário excluído com sucesso!');
                    }).fail(function () {
                        alert('Erro ao excluir usuário.');
                    });
                }
            }
        });

        // Evento para SALVAR o formulário (Criar ou Atualizar)
        userForm.on('submit', function (event) {
            event.preventDefault();
            const id = $('#userId').val();

            // Monta o objeto com os dados do usuário a partir do formulário
            const dadosUsuario = {
                cpf: $('#userCpf').val(),
                nome: $('#userName').val(),
                email: $('#userEmail').val(),
                papel: $('#userPapel').val(),//nivel
                grupo: $('#userGrupo').val(),//grupo
                senha: $('#userPassword').val(),
            };

            const isUpdate = !!id;
            const url = isUpdate ? `${API_URL}/${id}` : API_URL;
            const type = isUpdate ? 'PUT' : 'POST';

            $.ajax({
                url: url,
                type: type,
                contentType: 'application/json',
                data: JSON.stringify(dadosUsuario)
            }).done(function (usuarioSalvo) {
                if (isUpdate) { // Atualiza a linha existente
                    const row = userTableBody.find(`tr[data-user-id='${id}']`);
                    row.find('td:eq(0)').text(usuarioSalvo.cpf);
                    row.find('td:eq(1)').text(usuarioSalvo.nome);
                    row.find('td:eq(2)').text(usuarioSalvo.email);
                    row.find('td:eq(3)').text(usuarioSalvo.papel);
                    row.find('td:eq(4)').text(usuarioSalvo.grupo);

                    alert('Usuário atualizado com sucesso!');
                } else { // Adiciona nova linha
                    adicionarLinhaNaTabela(usuarioSalvo);
                    alert('Novo usuário cadastrado com sucesso!');
                }
                fecharFormulario();
            }).fail(function () {
                alert('Erro ao salvar usuário.');
            });
        });

        // Evento para a PESQUISA
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

        // --- CARGA INICIAL ---
        carregarUsuarios();
    }
});
$(document).ready(function () {
    // --- LÓGICA DA PÁGINA DE GERENCIAMENTO DE USUÁRIOS ---

    // URL base da sua API. Altere se for diferente.
    const API_URL = 'http://localhost:8080/usuario';

    // 1. SELEÇÃO DOS ELEMENTOS DA PÁGINA
    const btnNovoUsuario = $('#btnNovoUsuario');
    const btnCancelar = $('#btnCancelar');
    const userForm = $('#userForm');
    const userTableBody = $('.user-table tbody');
    const searchInput = $('#searchInput');
    const formTitle = $('#formTitle');
    const formContainer = $('#formContainer'); // Adicionado para referência

    // --- FUNÇÕES AUXILIARES ---
    function adicionarLinhaNaTabela(usuario) {
        const newRow = `
            <tr data-user-id="${usuario.id}">
                <td>${usuario.cpf}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${usuario.idpapel}</td>
                <td>${usuario.idgrupo}</td>
                <td class="table-actions">
                    <button class="btn-icon btn-edit" data-id="${usuario.id}">✏️</button>
                    <button class="btn-icon btn-delete" data-id="${usuario.id}">🗑️</button>
                </td>
            </tr>
        `;
        userTableBody.append(newRow);
    }

    function carregarUsuarios() {
        userTableBody.empty();
        $.ajax({
            url: API_URL,
            type: 'GET',
            success: (usuarios) => usuarios.forEach(adicionarLinhaNaTabela),
            error: () => alert('Erro ao carregar usuários da API.')
        });
    }

    function abrirFormulario(modo, dados = {}) {
        userForm[0].reset();
        if (modo === 'novo') {
            formTitle.text('Novo Usuário');
            $('#userId').val('');
        } else if (modo === 'editar') {
            formTitle.text('Editar Usuário');
            $('#userId').val(dados.id);
            $('#userCpf').val(dados.cpf);
            $('#userName').val(dados.nome);
            $('#userEmail').val(dados.email);
            $('#userPapel').val(dados.idpapel);
            $('#userGrupo').val(dados.idgrupo);

        }
        formContainer.slideDown();
    }

    function fecharFormulario() {
        formContainer.slideUp();
    }

    // 3. EVENTOS (GATILHOS DE AÇÃO)
    btnNovoUsuario.on('click', () => abrirFormulario('novo'));
    btnCancelar.on('click', fecharFormulario);

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
                idgrupo: row.find('td:eq(4)').text()

            };
            abrirFormulario('editar', dadosUsuario);
        }

        if (button.hasClass('btn-delete')) {
            if (confirm('Tem certeza que deseja excluir o usuário?')) {
                $.ajax({
                    url: `${API_URL}/${id}`,
                    type: 'DELETE'
                }).done(() => {
                    row.remove();
                    alert('Usuário excluído com sucesso!');
                }).fail(() => alert('Erro ao excluir usuário.'));
            }
        }
    });

    //Evento utilizado para SALVAR o formulário (Criar ou Atualizar)
    userForm.on('submit', function (event) {
        event.preventDefault();
        const id = $('#userId').val();

        // Montagem do objeto com os dados do formulário
        const dadosUsuario = {
            cpf: $('#userCpf').val(),
            nome: $('#userName').val(),
            email: $('#userEmail').val(),
            idpapel: $('#userPapel').val(),
            idgrupo: $('#userGrupo').val(),
            senha: $('#userPassword').val()
        };

        // Se a senha estiver vazia, não a envie
        if (!dadosUsuario.senha) {
            delete dadosUsuario.senha;
        }

        const isUpdate = !!id;
        const url = isUpdate ? `${API_URL}/${id}` : API_URL;
        const type = isUpdate ? 'PUT' : 'POST';

        if (isUpdate) {
            dadosUsuario.id = id; // Envia o ID no corpo para PUT
        }

        $.ajax({
            url: url,
            type: type,
            contentType: 'application/json',
            data: JSON.stringify(dadosUsuario)
        }).done(function (usuarioSalvo) {
            if (isUpdate) {
                const row = userTableBody.find(`tr[data-user-id='${id}']`);
                row.find('td:eq(0)').text(usuarioSalvo.cpf);
                row.find('td:eq(1)').text(usuarioSalvo.nome);
                row.find('td:eq(2)').text(usuarioSalvo.email);
                row.find('td:eq(3)').text(usuarioSalvo.idpapel);
                row.find('td:eq(4)').text(usuarioSalvo.idgrupo);
                alert('Usuário atualizado com sucesso!');
            } else {
               // adicionarLinhaNaTabela(usuarioSalvo);
                carregarUsuarios(); //corrigindo bug de carregamento de forma mais rapida
                alert('Novo usuário cadastrado com sucesso!');
            }
            fecharFormulario();
        }).fail(() => alert('Erro ao salvar usuário.'));
    });

    // Evento utilizado na PESQUISA
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
           // linha.style.display = textoLinha.includes(termoBusca) ? '' : 'none';
        });
    });

    carregarUsuarios();
});
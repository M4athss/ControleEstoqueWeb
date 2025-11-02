$(document).ready(function () {
    const loginForm = $('#loginForm');
    const emailError = $('#emailError'); // Assumindo que você tem um campo de erro

    loginForm.on('submit', function (event) {
        // 1. Impede o recarregamento da página
        event.preventDefault();

        // 2. Limpa erros antigos
        if(emailError.length) emailError.text('');

        // 3. Pega os dados do formulário
        const email = $('#email').val();
        const senha = $('#password').val();

        // 4. Monta o objeto para enviar à API
        const loginData = {
            email: email,
            senha: senha 
        };

        // 5. Faz a chamada AJAX para a API
        $.ajax({
            url: 'http://localhost:8080/api/auth/login', //URL da API de login
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(loginData)
        }).done(function (response) {
            // 6. SUCESSO: O usuário é válido
            
            // Salva o token recebido no "cofre" do navegador
            localStorage.setItem('authToken', response.token);
            
            // Redireciona o usuário para a página principal do sistema
            // Caminho da página de menu
            window.location.href = '/pages/menu.html'; 

        }).fail(function () {
            // 7. FALHA: O usuário é inválido
            if(emailError.length) {
                emailError.text('E-mail ou senha incorretos.');
            } else {
                alert('E-mail ou senha incorretos.');
            }
        });
    });
});
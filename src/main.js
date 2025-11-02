$(document).ready(function () {
    // --- LÓGICA DOS MENUS DROPDOWN (GLOBAL) ---
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

    // --- LÓGICA DO LOGOUT DO SISTEMA ---
    $('.logout a').on('click', function(event) {
        event.preventDefault(); // Impede que o link navegue

        //1. Remove o token do "cofrre"
        localStorage.removeItem('authToken');

        //2. Redireciona para a pagina de login
        alert('Você foi desconectado.');
        window.location.href = '/login.html';
    });

    // ---LOGICA DE AUTENTICACAO ---
    // 1. Pega o token salvo no "cofre" após o login
    const token = localStorage.getItem('authToken');

    if (token) {
        // 2. Configura o jQuery para ENVIAR este token em TODAS as futuras
        //    requisições AJAX (para o Spring Security validar)
        $.ajaxSetup({
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    }


});
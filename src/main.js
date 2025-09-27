$(document).ready(function () {
    // Seleciona todos os elementos cujo id começa com "dropDown"
    $('[id^=dropDown]').click(function (e) {
        e.stopPropagation();

        // Fecha outros antes de abrir este
        $('.drop-down').not($(this).closest('.drop-down')).removeClass('drop-down--active');
        
        $(this).closest('.drop-down').toggleClass('drop-down--active');
    });

    // Fecha se clicar fora
    $(document).click(function (e) {
        if (!$(e.target).closest('.drop-down').length) {
            $('.drop-down').removeClass('drop-down--active');
        }
    });
});


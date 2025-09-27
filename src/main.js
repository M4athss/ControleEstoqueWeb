$(document).ready(function () {
    $('#dropDown').click(function () {
        $(this).closest('.drop-down').toggleClass('drop-down--active');
    });
});

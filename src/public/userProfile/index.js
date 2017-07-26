
$(function () {
    var d = JSON.parse(localStorage.getItem('data'));
    $('#name').val(d.username);
    $('#time').val(d.time);
    $('#nickname').val(d.nickname);
});
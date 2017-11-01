/**
 * 新增app
 */

$(document).ready(function () {


    $('.btn1').on('click', function () {
        $('.mask, .center').show();
    });

    // 查看app接口
    getPlug();
    
    // 新增app接口

    $('#submit').on('click', function () {
        $.ajax({
            url: '/plugin/api/setPlug',
            type: 'POST',
            data: {
                account: $('#name').val(),
                version: $('#version').val()
            },
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    $('.mask, .center').hide();
                    getPlug();
                } else {
                    console.log(data.msg);
                }
            },
            error: function () {
                alert('暂无数据');
            }
        });
    });


    $('.cancel').on('click', function () {
        $('.mask,.comfri').hide();
    });

});

function getPlug() {
    var li = '';
    $.ajax({
        url: '/plugin/api/getPlug',
        type: 'GET',
        data: {},
        dataType: 'json',
        success: function (data) {
            if (data.success && data.data.length) {
                var d = data.data;
                $.each(d, function (i, o) {
                    var a = o;
                    if (a.name) {
                        li += '<li class="li">';
                        // li += '<i class="fa fa-close" aria-hidden="true"></i>';
                        li += '<img src="/plugAndir/logo.jpg" />';
                        li += '    <span>' + a.name + '</span>';
                        li += '    <span class="s1">' + a.version + '</span>';
                        li += '   <div>';
                        li += '       <a class="btn" href="/plugAndir/list?account=' + a.name + '">管理</a>';
                        li += '   </div>';
                        li += '</li>';
                    }
                });
                $('#list').html(li);   
            } else {
                $('#list').html('');
            }
        },
        error: function () {
            alert('暂无数据');
        }
    });
}

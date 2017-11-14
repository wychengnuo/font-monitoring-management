$(function () {


    $('#category').val(getvl('account'));

    $('.add').on('click', function () {
        $('.mask, .upload').show();
    });

    var options = {
        url: '/plugin/api/setPlugList',
        type: 'POST',
        success: function (data) {
            if (data.success) {
                $('.modal-body').html('成功');
                $('.mask, .upload').hide();
                $('#myModal').modal({
                    keyboard: true,
                    show: true
                });
                getPlugList();
                $('.zwsj').hide();
            } else {
                $('.modal-body').html(data.msg);
                $('.mask, .upload').hide();
                $('#myModal').modal({
                    keyboard: true,
                    show: true
                });
            }
        }
    };

    $('#submit').on('click', function () {
        var plugName = $('#plugName').val();
        var describe = $('#describe').val();
        if (plugName && describe) {
            $('#plugForm').ajaxSubmit(options);
        } else {
            $('.modal-body').html('失败');
            $('#myModal').modal({
                keyboard: true,
                show: true
            });
            $('.zwsj').show();
        }
    });

    $('.cancel').on('click', function () {
        $('.mask, .upload').hide();
        return false;
    });

    getPlugList();
});


function getPlugList() {
    var tr = '';
    $.ajax({
        url: '/plugin/api/getPlugList',
        type: 'GET',
        data: {
            category: $('#category').val()
        },
        dataType: 'json',
        success: function (data) {
            if (data.success && data.data.length) {
                var d = data.data;
                $.each(d, function (i, o) {
                    var a = o;
                    tr += '<tr>';
                    tr += '<td>' + a.plugListName + '</td>';
                    tr += '<td>' + a.time + '</td>';
                    tr += '<td>' + a.describe + '</td>';
                    tr += '<td><span class="update btn btn-success"><a href="/plugAndir/listInfo?name=' + a.plugListName + '&id=' + a.id + '&projectId=' + a.projectId + '"style="color:#fff;">编辑</a></span><span class="btn btn-danger" onclick="delPlug(\'' + a.plugListName + '\',\'' + a.id + '\')" style="margin-left:10px">删除</span></td>';
                    tr += '</tr>';
                });
                $('table tbody').html(tr);
            } else {
                $('table tbody').empty();
                $('.modal-body').html('暂无数据');
                $('#myModal').modal({
                    keyboard: true,
                    show: true
                });
                $('.zwsj').show();
            }
        },
        error: function () {
            $('table tbody').empty();
            $('.modal-body').html('暂无数据');
            $('#myModal').modal({
                keyboard: true,
                show: true
            });
            $('.zwsj').show();
        }
    });
}

function delPlug(str, id) {
    
    $.ajax({
        url: '/plugin/api/delPlug',
        dataType: 'json',
        type: 'POST',
        data: {
            name: getvl('account'),
            plugName: str,
            id: id
        },
        success: function (data) {
            console.log(data.msg);
            getPlugList();
        },
        error: function (data) {
            alert('设置失败');
        }
    });
}
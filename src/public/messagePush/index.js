
/**
 * 上传消息
 */

$(function () { 
    // socketio();
    $('.add').on('click', function () { 
        $('.addMessage .mask').show();
    });

    $('.btn-warning').on('click', function () {
        $('.addMessage .mask').hide();
    });


    $('.submit').on('click', function () { 

        $.ajax({
            type: 'POST',
            url: '/plugin/api/addMessage',
            data: {
                uerTypes: $('input[name=\'userTypes\']:checked').val(),
                content: $('textarea').val(),
                channl: $('input[name=\'channl\']').val(),
                // timeSwitch: $('input[name=\'timeSwitch\']:checked').val(),
                // pushTime: $('input[name=\'pushTime\']').val(),
                isEnable: $('input[name=\'isEnable\']').val()
            },
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    $('.addMessage .mask').hide();
                    $('input[type=reset]').trigger('click');
                    getPlugList();
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    });

    getPlugList();


});


function getPlugList() {
    var tr = '';
    var str = '';
    var pages = 1;
    $.ajax({
        url: '/plugin/api/getMessage',
        type: 'GET',
        data: {
            page: pages,
            pageSize: '10'
        },
        dataType: 'json',
        success: function (data) {
            if (data.success && data.data.length > 0) {
                var d = data.data;

                $.each(d, function (i, o) {
                    var a = o;
                    var userTypes = '';
                    switch (a.uerTypes) {
                    case '1':
                        userTypes = '全部用户';
                        break;
                    case '2':
                        userTypes = '部分用户';
                        break;
                    case '3':
                        userTypes = '独立用户';
                        break;
                    }
                    str = '<span onclick="setting(1,' + '\'' + a.id + '\'' + ')" class="confi btn btn-info" style="margin:0 10px">启用</span><span class="confir btn btn-warning" onclick="setting(2,' + '\'' + a.id + '\'' + ')" >停用</span><span class="del btn btn-danger" onclick="setting(3,' + '\'' + a.id + '\'' + ')"  style="margin:0 10px">删除</span>';
                    tr += '<tr>';
                    tr += '<td>' + userTypes + '</td>';
                    tr += '<td>' + a.time + '</td>';
                    tr += '<td>' + a.content + '</td>';
                    tr += '<td>' + a.channl + '</td>';
                    // tr += '<td>' + a.timeSwitch + '</td>';
                    // tr += '<td>' + a.pushTime + '</td>';
                    tr += '<td>' + str + '</td>';
                    tr += '</tr>';
                });
                $('table tbody').html(tr);

                var pageCount = data.pageSize; //取到pageCount的值
                var currentPage = pages;

                var options = {
                    bootstrapMajorVersion: 3, //版本
                    currentPage: currentPage, //当前页数
                    totalPages: pageCount, //总页数
                    numberOfPages: 5,
                    itemTexts: function (type, page) {
                        switch (type) {
                        case 'first':
                            return '首页';
                        case 'prev':
                            return '上一页';
                        case 'next':
                            return '下一页';
                        case 'last':
                            return '末页';
                        case 'page':
                            return page;
                        }
                    },
                    onPageClicked: function (event, originalEvent, type, pages) {
                        $.ajax({
                            url: '/plugin/api/getMessage',
                            type: 'GET',
                            data: {
                                page: pages,
                                pageSize: '10'
                            },
                            success: function (data) {
                                if (data.success && data.data.length) {
                                    var d = data.data;
                                    $.each(d, function (i, o) {
                                        var a = o;
                                        str = '<span onclick="setting(1,' + '\'' + a.id + '\'' + ')" class="confi btn btn-info" style="margin:0 10px">启用</span><span class="confir btn btn-warning" onclick="setting(2,' + '\'' + a.id + '\'' + ')" >停用</span><span class="del btn btn-danger" onclick="setting(3,' + '\'' + a.id + '\'' + ' )"  style="margin:0 10px">删除</span>';
                                        tr += '<tr>';
                                        tr += '<td>' + a.uerTypes + '</td>';
                                        tr += '<td>' + a.time + '</td>';
                                        tr += '<td>' + a.content + '</td>';
                                        tr += '<td>' + a.channl + '</td>';
                                        // tr += '<td>' + a.timeSwitch + '</td>';
                                        // tr += '<td>' + a.pushTime + '</td>';
                                        tr += '<td>' + str + '</td>';
                                        tr += '</tr>';
                                    });
                                    $('table tbody').html(tr);
                                }

                            }
                        });
                    }
                };
                $('#pageUl').show().bootstrapPaginator(options);
            } else {
                $('table tbody').html('');
                $('#pageUl').hide();
                $('.zwsj').show();
            }
        },
        error: function () {
            $('#pageUl').hide();
            $('table tbody').html('');
            $('.modal-body').html('暂无数据');
            $('#myModal').modal({
                keyboard: true,
                show: true
            });
            $('.zwsj').show();
        }
    });
}


function setting(num, id) {
    // if (num != '3') {
    //     socketio(order);
    // }
    $.ajax({
        url: '/plugin/api/setMessage',
        dataType: 'json',
        type: 'POST',
        data: {
            num: num,
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


function socketio(order) {
    var socket = io('http://localhost:3002');
    socket.on('connect', function () {
        if (typeof order !== 'undefined') {
            socket.emit('ferret', order, function (data) {
                if (data.success) {
                    var d = data.data;
                    switch (d.uerTypes) {
                    case '1':
                        alert(d.content);
                        break;
                    case '2':
                        alert(d.content);
                        break;
                    case '3':
                        alert(d.content);  
                        break;
                    default:
                        break;
                    }

                }
            });
        }
        // else {
        //     socket.emit('realtime', 'sdfd', function (data) {
                
        //         console.log(data)

        //     })
        // }
    });

}

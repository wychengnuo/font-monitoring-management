var message = {
    page: 1,
    pageSize: 10,
    total: 0,
    init: function () {
        var _this = this;
        _this.getData();
    },
    getData: function () {
        var tr = '';
        var str = '';
        var _this = this;
        var pages = _this.page;
        $.ajax({
            url: '/plugin/api/getMessage',
            type: 'GET',
            data: {
                page: pages,
                pageSize: _this.pageSize
            },
            dataType: 'json',
            success: function (data) {
                if (data.success && data.data.length > 0) {
                    var d = data.data;

                    $.each(d, function (i, o) {
                        var a = o;
                        var userTypes = '', time = new Date(a.createdAt);
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
                        if (a.isEnable == true) {
                            str = '<span class="confir btn btn-warning" onclick="setting(2,' + a.id + ')">停用</span>';
                        } else {
                            str = '<span onclick="setting(1,' + a.id + ')" class="confi btn btn-info">启用</span>';
                        }
                        str = str + '<span class="del btn btn-danger" onclick="setting(3,' + a.id + ')"  style="margin:0 10px">删除</span>';
                        tr += '<tr>';
                        tr += '<td>' + userTypes + '</td>';
                        tr += '<td>' + time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + '</td>';
                        tr += '<td>' + a.content + '</td>';
                        tr += '<td>' + a.plant + '</td>';
                        tr += '<td>' + a.channl + '</td>';
                        // tr += '<td>' + a.timeSwitch + '</td>';
                        // tr += '<td>' + a.pushTime + '</td>';
                        tr += '<td>' + str + '</td>';
                        tr += '</tr>';
                    });
                    $('table tbody').html(tr);

                    _this.total = data.pageSize; //取到pageCount的值

                    if (pages == 1) {
                        var options = {
                            bootstrapMajorVersion: 3, //版本
                            currentPage: _this.page, //当前页数
                            totalPages: _this.total, //总页数
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
                                _this.page = pages;
                                _this.getData();
                            }
                        };
                        $('#pageUl').show().bootstrapPaginator(options);
                    }
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
    },
    setData: function () {
        var plant = [], _this = this;
        $('input[name=\'plant\']:checked').each(function(index, e){
            plant.push($(e).val());
        })
        $.ajax({
            type: 'POST',
            url: '/plugin/api/addMessage',
            data: {
                uerTypes: $('input[name=\'userTypes\']:checked').val(),
                content: $('textarea').val(),
                plant: plant.join(','),
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
                    _this.getData();
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    }
    
}
/**
 * 上传消息
 */

$(function () {
    // socketio();

    // 打开mask
    $('.add').on('click', function () {
        $('.addMessage .mask').show();
    });

    // 关闭mask
    $('.btn-warning').on('click', function () {
        $('.addMessage .mask').hide();
    });

    // 用户类型切换
    $('.userType input').unbind('click').bind('click', function () {
        if ($(this).val() === '2') {
            $('.plant').show();
        } else {
            $('.plant').hide();
        }
    })

    // 添加消息
    $('.submit').on('click', function () {
        message.setData();
    });

    // 获取消息推送
    message.init();
});

function setting(type, id) {
    // if (num != '3') {
    //     socketio(order);
    // }
    $.ajax({
        url: '/plugin/api/setMessage',
        dataType: 'json',
        type: 'POST',
        data: {
            num: type,
            id: id
        },
        success: function (data) {
            message.getData();
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

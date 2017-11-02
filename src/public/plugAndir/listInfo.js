$(function () {

    $('#name').val(getvl('name'));
    $('.add').on('click', function () {
        $('.mask, .upload').show();
    });

    $('.file').on('change', 'input[type=\'file\']', function () {
        var filePath = $(this).val();
        if (filePath) {
            var arr = filePath.split('\\');
            var fileName = arr[arr.length - 1];
            alert(fileName);
        } else {
            $('.showFileName').html('');
            alert('您未上传文件，或者您上传文件类型有误');
            return false;
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
    var str = '';
    var pages = 1;
    $.ajax({
        url: '/plugin/api/getPlugListInfo',
        type: 'GET',
        data: {
            category: getvl('name'),
            id: getvl('id'),
            page: pages,
            pageSize: '10'
        },
        dataType: 'json',
        success: function (data) {
            if (data.success && data.data.length > 0) {
                var d = data.data;

                $.each(d, function (i, o) {
                    var a = o;
                    str = '<span onclick="setting(1,' + '\'' + a.plugName + '\',' + '\'' + a.plugVersion + '\'' + ')" class="confi btn btn-info" style="margin:0 10px">启用</span><span class="confir btn btn-warning" onclick="setting(2,' + '\'' + a.plugName + '\',' + '\'' + a.plugVersion + '\'' + ')" >停用</span><span class="del btn btn-danger" onclick="setting(3,' + '\'' + a.plugName + '\',' + '\'' + a.plugVersion + '\'' + ')"  style="margin:0 10px">删除</span>';

                    var channl = a.channl ? a.channl : '所有';
                    var systemVer = a.systemVer ? a.systemVer : '所有';
                    var appVer = a.appVer ? a.appVer : '所有';
                    var version = a.version ? a.version : '所有';
                    var plugVer = a.plugVersion ? a.plugVersion : '所有';

                    tr += '<tr>';
                    tr += '<td>' + a.plugName + '</td>';
                    tr += '<td>' + plugVer + '</td>';
                    tr += '<td>' + appVer + '</td>';
                    tr += '<td>' + version + '</td>';
                    tr += '<td>' + channl + '</td>';
                    tr += '<td>' + systemVer + '</td>';
                    tr += '<td>' + a.time + '</td>';
                    tr += '<td>' + a.textarea + '</td>';
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
                            url: '/plugin/api/getPlugListInfo',
                            type: 'GET',
                            data: {
                                category: getvl('name'),
                                page: pages,
                                pageSize: '10'
                            },
                            success: function (data) {
                                if (data.success && data.data.length) {
                                    var d = data.data;
                                    $.each(d, function (i, o) {
                                        var a = o;
                                        str = '<span class="confi btn btn-info" style="margin:0 10px" onclick="setting(1,' + '\'' + a.plugName + '\',' + '\'' + a.plugVersion + '\'' + ')" >启用</span><span class="confir btn btn-warning" onclick="setting(2,' + '\'' + a.plugName + '\',' + '\'' + a.plugVersion + '\'' + ')" >停用</span><span class="del btn btn-danger" style="margin:0 10px" onclick="setting(3,' + '\'' + a.plugName + '\',' + '\'' + a.plugVersion + '\'' + ')" >删除</span>';

                                        var channl = a.channl ? a.channl : '所有';
                                        var systemVer = a.systemVer ? a.systemVer : '所有';
                                        var appVer = a.appVer ? a.appVer : '所有';
                                        var version = a.version ? a.version : '所有';                               
                                        var plugVer = a.plugVersion ? a.plugVersion : '所有';

                                        tr += '<tr>';
                                        tr += '<td>' + a.plugName + '</td>';
                                        tr += '<td>' + plugVer + '</td>';
                                        tr += '<td>' + appVer + '</td>';
                                        tr += '<td>' + version + '</td>';
                                        tr += '<td>' + channl + '</td>';
                                        tr += '<td>' + systemVer + '</td>';
                                        tr += '<td>' + a.time + '</td>';
                                        tr += '<td>' + a.textarea + '</td>';
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
                // $('.modal-body').html('暂无数据');
                // $('#myModal').modal({
                //     keyboard: true,
                //     show: true
                // });
                // $('.zwsj').show();
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

// 设置操作

function setting(num, name, version) {

    $.ajax({
        url: '/plugin/api/settingPlug',
        dataType: 'json',
        type: 'POST',
        data: {
            num: num,
            pathName: getvl('name'),
            name: name,
            version: version
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

function hiddenDiv(num) {
    if (num == '1') {
        $('.d1').css('display', 'none');
        $('.plug .mask .upload').removeClass('uploadHeight');
    } else {
        $('.d1').css('display', 'block');
        $('.plug .mask .upload').addClass('uploadHeight');
    }
}
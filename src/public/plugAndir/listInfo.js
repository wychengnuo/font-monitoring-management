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

    plug.getPlugList();

});

var plug = {
    page: 1,
    pageSize: 10,
    total: 0,
    getPlugList: function () {
        var _this = this;
        var tr = '';
        var str = '';
        var pages = _this.page;
        $.ajax({
            url: '/plugin/api/getPlugListInfo',
            type: 'GET',
            data: {
                category: getvl('name'),
                id: getvl('id'),
                page: pages,
                pageSize: _this.pageSize
            },
            dataType: 'json',
            success: function (data) {
                if (data.success && data.data.length > 0) {
                    var d = data.data;

                    $.each(d, function (i, o) {
                        var a = o;
                        if (a.isEnable) {
                            str = '<span class="confir btn btn-warning" onclick="plug.setting(2,' + '\'' + a.id + '\',' + '\'' + a.plugVersion + '\'' + ')" >停用</span>';
                        } else {
                            str = '<span class="confi btn btn-info" onclick="plug.setting(1,' + '\'' + a.id + '\',' + '\'' + a.plugVersion + '\'' + ')" >启用</span>';
                        }
                        str = str + '<span class="del btn btn-danger" style="margin:0 10px" onclick="plug.setting(3,' + '\'' + a.id + '\',' + '\'' + a.plugVersion + '\'' + ')" >删除</span>';

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

                    _this.total = data.pageSize; //取到pageCount的值

                    if (pages == 1) {
                        var options = {
                            bootstrapMajorVersion: 3, //版本
                            currentPage: pages, //当前页数
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
                                _this.getPlugList();
                            }
                        };
                    }
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
    },
    setting: function (num, id, version) {
        var _this = this;
        $.ajax({
            url: '/plugin/api/settingPlug',
            dataType: 'json',
            type: 'POST',
            data: {
                num: num,
                pathName: getvl('name'),
                id: id,
                version: version
            },
            success: function (data) {
                console.log(data.msg);
                _this.getPlugList();
            },
            error: function (data) {
                alert('设置失败');
            }
        });
    }
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
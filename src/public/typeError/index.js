/**
 * @param 避免全局污染
 */

var ind = {

    /**
     *  @param { object } 获取数据
     */

    getDate: function () {

        var table, td, td1, tr, tr1, f;

        var pages = 1;

        $.ajax({
            type: 'get',
            url: '/plugin/api/getHtmlError',
            data: {
                page: pages,
                pageSize: '10'
            },
            async: false,
            success: function (data) {
                if (data.success && data.data.length) {
                    tr = '', tr1 = '', td = '', td1 = '';
                    var date = data.data;
                    for (var i = 0; i < date.length; i++) {
                        var d = JSON.parse(date[i]);
                        for (var a in d) {
                            f = JSON.parse(d[a]);
                            td = '', td1 = '';
                            if (a.charAt(1) === 'r') {
                                for (var e in f) {
                                    td += '<th>' + e + '</th>';
                                    td1 += '<td>' + f[e] + '</td>';
                                }
                                tr = '<thead><tr>' + td + '</tr></thead>';
                                tr1 += '<tr>' + td1 + '</tr>';
                            }
                        }
                    }

                    table = '<table class="table table-bordered table-hover">' + tr + tr1 + '</table>';

                    $('#date').html(table);

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
                                type: 'get',
                                url: '/plugin/api/getHtmlError',
                                data: {
                                    page: pages,
                                    pageSize: '10'
                                },
                                success: function (data) {
                                    tr = '', tr1 = '', td = '', td1 = '';
                                    var date = data.data;
                                    for (var i = 0; i < date.length; i++) {
                                        var d = JSON.parse(date[i]);
                                        for (var a in d) {
                                            f = JSON.parse(d[a]);
                                            td = '', td1 = '';
                                            if (a.charAt(1) === 'r') {
                                                for (var e in f) {
                                                    td += '<th>' + e + '</th>';
                                                    td1 += '<td>' + f[e] + '</td>';
                                                }
                                                tr = '<thead><tr>' + td + '</tr></thead>';
                                                tr1 += '<tr>' + td1 + '</tr>';
                                            }
                                        }
                                    }

                                    table = '<table class="table table-bordered table-hover">' + tr + tr1 + '</table>';

                                    $('#date').html(table);

                                }
                            });
                        }
                    };
                    $('#pageUl').bootstrapPaginator(options);
                } else {
                    $('#date').html('暂无数据').css('text-align', 'center');
                }

            },
            error: function (date) {
                $('#date').html('暂无数据').css('text-align', 'center');
            }
        });
    }
};


$(function () {
    $('#date').html('');
    ind.getDate();

});
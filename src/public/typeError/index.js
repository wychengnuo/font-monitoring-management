/**
 * @param 避免全局污染
 */

var ind = {
    page: 1,
    pageSize: 10,
    totalPage: 0,
    init: function () {
        var _this = this;
        _this.getDate();
    },
    /**
     *  @param { object } 获取数据
     */

    getDate: function () {

        var table, td, td1, tr, tr1, f, _this = this;

        var pages = _this.page;

        $.ajax({
            type: 'get',
            url: '/plugin/api/getHtmlError',
            data: {
                page: pages,
                pageSize: _this.pageSize,
            },
            async: false,
            success: function (data) {
                if (data.success && data.data.length) {
                    $('.title').hide();
                    var tr = '';
                    var thead = '<thead><tr><th>type</th><th>sMsg</th><th>sUrl</th><th>sLine</th><th>sColu</th><th>eObj</th><th>sTime</th><th>browerType</th></tr></thead>';
                    var date = data.data;
                    for (var i = 0; i < date.length; i++) {
                        var d = date[i], time = new Date(d.sTime);
                        tr = tr + '<tr>' +
                                '<td>'+ d.type +'</td>' +
                                '<td>'+ d.sMsg +'</td>' +
                                '<td>'+ d.sUrl +'</td>' +
                                '<td>'+ d.sLine +'</td>' +
                                '<td>'+ d.sColu +'</td>' +
                                '<td>'+ d.eObj +'</td>' +
                                '<td>'+ time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() +'</td>' +
                                '<td>'+ d.browerType +'</td>' +
                            '</tr>';
                    }
                    table = '<table class="table-hover">' + thead + tr + '</table>';

                    $('#date').html(table);

                    _this.totalPage = data.pageSize; //取到pageCount的值
                    if (pages == 1) {

                        var options = {
                            bootstrapMajorVersion: 3, //版本
                            currentPage: _this.page, //当前页数
                            totalPages: _this.totalPage, //总页数
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
                                _this.getDate();
                            }
                        };
                        $('#pageUl').bootstrapPaginator(options);
                    }
                }

            },
            error: function (date) {
            
            }
        });
    }
};


$(function () {
    $('#date').html('');
    ind.init();
});
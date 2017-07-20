/**
 * @param 避免全局污染
 */

var ind = {

    /**
     *  @param { object } 获取数据
     */

    getDate: function () {

        var table, td, td1, tr, tr1, f;

        $.ajax({
            type: 'get',
            url: '/api/getHtmlError',
            data: '',
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
    ind.getDate();

});
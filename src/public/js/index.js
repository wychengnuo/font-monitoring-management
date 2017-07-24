/**
 * @param 避免全局污染
 */

var ind = {

    /**
     *  @param { object } 获取数据
     */


};

function histogram(data) {
    Highcharts.chart('container_html', {
        chart: {
            type: 'column'
        },
        title: {
            text: '近日错误占比'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            ceiling: 100,
            max: 100,
            title: {
                text: '近日错误占比'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.2f}%'
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
        },
        series: [{
            name: '近日错误占比',
            colorByPoint: true,
            data: data
        }]
    });
}

function histograms(data) {
    Highcharts.chart('container_interface', {
        chart: {
            type: 'column'
        },
        title: {
            text: '近日接口错误次数'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            ceiling: 100,
            max: 100,
            title: {
                text: '近日接口错误次数'
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:f}'
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:f}</b> of total<br/>'
        },
        series: [{
            name: '近日错误占比',
            colorByPoint: true,
            data: data
        }]
    });
}


$(function () {

    $.ajax({
        url: '/api/typeErr',
        type: 'GET',
        data: '',
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                var d = data.data;
                histogram(d);
            }
        },
        error: function (err) {
            // alert('内部服务错误');
        }
    });
    var arr;
    $.ajax({
        url: '/api/getUrlErr',
        type: 'GET',
        data: '',
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                var arr = data.data;
                histograms(arr);
            }
        },
        error: function (err) {
            // alert('内部服务错误');
        }
    });

  
});
/**
 * @param 避免全局污染
 */

var ind = {

    /**
     *  @param { object } 获取数据
     */


};

function histogram(arr, arr1) {

    var myChart = echarts.init(document.getElementById('container_html'));
    myChart.title = '坐标轴刻度与标签对齐';

    var option = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [ {
            type: 'category',
            data: arr,
            axisTick: {
                alignWithLabel: true
            }
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '错误次数',
            type: 'bar',
            barWidth: '20%',
            data: arr1
        }]
    };

    myChart.setOption(option);

}

function histograms(arr, arr1) {
    var myChart = echarts.init(document.getElementById('container_interface'));
    myChart.title = '坐标轴刻度与标签对齐';

    var option = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [ {
            type: 'category',
            data: arr,
            axisTick: {
                alignWithLabel: true
            }
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '错误次数',
            type: 'bar',
            barWidth: '20%',
            data: arr1
        }]
    };
    myChart.setOption(option);
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
                var arr = [], arr1 = [];
                for (var i = 0; i < d.length; i++){
                    arr.push(d[i].name);
                    arr1.push(d[i].y);
                }
                histogram(arr, arr1);
            }
        },
        error: function (err) {
            alert('内部服务错误');
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
                var d = data.data;
                var arr = [], arr1 = [];
                for (var i = 0; i < d.length; i++){
                    arr.push(d[i].name);
                    arr1.push(d[i].y);
                }
                histograms(arr, arr1);
            }
        },
        error: function (err) {
            alert('内部服务错误');
        }
    });
});
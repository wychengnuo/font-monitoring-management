/**
 * @param 避免全局污染
 */

var ind = {

    /**
     *  @param { object } 获取数据
     */

};


function histograms_urlErr(ele) {
    var myChart = echarts.init(document.getElementById(ele));
    var groupCategories = [], groupColors = [], data;
    var maxTime = moment().add(1, "d").format("YYYY-MM-DD");
    var minTime = moment().subtract(6, "d").format("YYYY-MM-DD");

    var schema = [
        {name: 'date', index: 0, text: '触发时间'},
        {name: 'delay', index: 1, text: '响应时长'},
        {name: 'status', index: 2, text: 'HTTP状态码'},
        {name: 'api', index: 3, text: '请求地址'},
    ];

// zlevel 为 1 的层开启尾迹特效
    myChart.getZr().configLayer(1, {
        motionBlur: 0.5
    })

    $.get('/js/networktest1.json', function (originData) {
        data = originData;
        var init_data = normalizeData(originData.website);
        myChart.setOption(getOption(init_data));
    });

    function normalizeData(originData) {
        // console.log(originData)
        var groupMap = {};
        //将json文件的name赋值1存入groupmap
        for(var key in originData){
            originData[key].forEach(function (row) {
                var groupName = row[2];
                if (!groupMap.hasOwnProperty(groupName)) {
                    groupMap[groupName] = 1;
                }
            });
        }
        //将groupname推入数组
        for (var groupName in groupMap) {
            if (groupMap.hasOwnProperty(groupName)) {
                groupCategories.push(groupName);
            }
        }
        for (var i = 0; i < groupCategories.length; i++) {
            groupColors.push( 0.85 - 0.07 * i);
        }
// console.log(groupColors)
        return originData;
    }

    function tooltipFormatter(params) {
        // console.log(params, 'params')
        // Remove duplicate by data name.
        // var mapByDataName = {};
        // var mapOnDim = {x: {}, y: {}, xy: {}};
        // echarts.util.each(params, function (item) {
        //     var data = item.data;
        //     var dataName = data[3];
        //     var mapItem = mapByDataName[dataName] || (mapByDataName[dataName] = {});
        //     mapItem[data[4]] = data[0];
        //     mapItem[data[5]] = data[1];
        //     mapOnDim[item.axisDim][dataName] = mapItem;
        // });
        // echarts.util.each(mapByDataName, function (mapItem, dataName) {
        //     if (mapOnDim.x[dataName] && mapOnDim.y[dataName]) {
        //         mapOnDim.xy[dataName] = mapItem;
        //         delete mapOnDim.x[dataName];
        //         delete mapOnDim.y[dataName];
        //     }
        // });
        // var resultHTML = [];
        // echarts.util.each([['xy', 'CROSS'], ['x', 'V LINE'], ['y', 'H LINE']], function (dimDefine) {
        //     var html = [];
        //     echarts.util.each(mapOnDim[dimDefine[0]], function (mapItem, dataName) {
        //         var valuesHTML = [];
        //         echarts.util.each(mapItem, function (value, dataName) {
        //             valuesHTML.push(
        //                 '<span style="color:#FFFFFF">'
        //                 + dataName
        //                 + '</span>: ' + value
        //             );
        //         });
        //         html.push('<div style="margin: 10px 0">' + dataName + '<br/>' + valuesHTML.join('<br/>') + '</div>');
        //     });
        //     html.length && resultHTML.push(
        //         '<div style="margin: 10px 0">'
        //         + '<div style="font-size: 16px; color: #aaa">POINTS ON ' + dimDefine[1] + '</div>'
        //         + html.join('')
        //         + '</div>'
        //     );
        // });
        // return resultHTML.join('');
    }

    function getOption(data) {
        return {
            color: [
                '#dd4444', '#80F1BE'
            ],
            legend: {
                y: 'top',
                data: ['get', 'post']
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type:'line',
                    snap:false,
                    label: {
                        show: true,
                        margin: 6,
                        backgroundColor: '#556',
                        textStyle: {
                            color: '#fff'
                        },
                        formatter: function (a) {
                            // console.log(a,'aaaaaa')
                            return moment(a.value).format("MM/DD HH:mm:ss")
                        }
                    }
                },
                padding: [10, 20, 10, 20],
                backgroundColor: 'rgba(44,52,60,0.7)',
                borderColor: '#ccc',
                borderWidth: 2,
                borderRadius: 4,
                transitionDuration: 0,
                extraCssText: 'width: 300px; white-space: normal',
                textStyle: {
                    fontSize: 12
                },
                position: function (pos, params, el, elRect, size) {
                    var obj = {};
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 60;
                    obj[['top', 'bottom'][+(pos[1] < size.viewSize[1] / 2)]] = 20;
                    return obj;
                },
                formatter: tooltipFormatter
            },
            axisPointer: {
                lineStyle: {
                    type: 'dashed'
                },
            },
            xAxis: {
                name: 'date',
                type: 'time',
                max: moment(maxTime).unix()*1000,
                min: moment(minTime).unix()*1000,
                splitLine: {show: false},
                splitNumber: 7,
            },
            yAxis: {
                name: 'network-delay',
                splitLine: {show: false},
            },
            visualMap: [{
                show: true,
                type: 'piecewise',
                categories: groupCategories,
                dimension: 2,
                inRange: {
                    symbolSize: 15,
                    colorLightness: groupColors //['#d94e5d','#eac736','#50a3ba']
                },
                outOfRange: {
                    symbolSize: 15,
                    color: ['#ccc'] //['#d94e5d','#eac736','#50a3ba']
                },
                top: 20,
                textStyle: {
                    color: '#000'
                },
                realtime: false
            }],
            series: [
                {
                    zlevel: 1,
                    name: 'get',
                    type: 'scatter',
                    itemStyle: {
                        emphasis: {
                            colorLightness: 0.9
                        }
                    },
                    data: data.get,
                    animationThreshold: 5000,
                    progressiveThreshold: 5000
                },
                {
                    zlevel: 1,
                    name: 'post',
                    type: 'scatter',
                    itemStyle: {
                        emphasis: {
                            colorLightness: 0.9
                        },
                    },
                    data: data.post,
                    animationThreshold: 5000,
                    progressiveThreshold: 5000
                }
            ],
            animationEasingUpdate: 'cubicInOut',
            animationDurationUpdate: 2000
        };
    }

    $('.channel select').change(function(){
        var key = $('.channel select').val();
        myChart.setOption({
            series: [
                {
                    zlevel: 1,
                    name: 'get',
                    type: 'scatter',
                    itemStyle: {
                        emphasis: {
                            colorLightness: 0.9
                        },
                    },
                    data: data[key].get,
                    animationThreshold: 5000,
                    progressiveThreshold: 5000
                },
                {
                    zlevel: 1,
                    name: 'post',
                    type: 'scatter',
                    itemStyle: {
                        emphasis: {
                            colorLightness: 0.9
                        },
                    },
                    data: data[key].post,
                    animationThreshold: 5000,
                    progressiveThreshold: 5000
                }
            ],
        });
    })

}

function histograms_typeErr(ele, d) {
    var obj = {
        legend: [],
        series: [],
        xaxis: []
    };
    var item_pie;
    for (var key in d) {
        if (key != 'pieData'){
            var item = {
                name: key,
                type: 'bar',
                stack: '总量',
                cursor: 'auto',
                data: d[key]
            }
            obj.legend.push(key);
            obj.series.push(item);
        }else{
            item_pie = {
                name: '访问来源',
                type: 'pie',
                radius: '70%',
                center: ['25%', 150],
                cursor: 'auto',
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                data: d[key]
            }
        }
    }
    if(item_pie){
        obj.series.push(item_pie);
    }
    for(var i = 6; i >= 0; i--){
        obj.xaxis.push(moment().subtract(i, 'd').format('YYYY/MM/DD'));
    }

    var option = {
        tooltip: {},
        legend: {
            orient: 'vertical',
            x: 'left',
            data: obj.legend
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: obj.xaxis
                // data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitArea: {show: true}
            }
        ],
        grid: {
            top: 10,
            width: '52%',
            bottom: 10,
            left: '47%',
            containLabel: true,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true,
                    }
                }
            },
        },
        series: obj.series
    };
    var myChart = echarts.init(document.getElementById(ele), 'macarons');
    myChart.setOption(option);
    setTimeout(function () {
        window.onresize = function () {
            myChart.resize();
        }
    }, 200)
}

function histograms(ele, arr, arr1, str) {
    var myChart = echarts.init(document.getElementById(ele));
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
        xAxis: [{
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
            name: str ? str : '错误次数',
            type: 'bar',
            barWidth: '20%',
            data: arr1
        }]
    };
    myChart.setOption(option);
}

$(function () {
//typeErr 接口请求方法
    $.ajax({
        url: '/plugin/api/typeErr',
        type: 'GET',
        data: '',
        dataType: 'json',
        success: function (body) {
            if (body.success) {
                histograms_typeErr('container_html', body.data);
            }
        },
        error: function (err) {
            alert('暂无数据');
        }
    });
    $.ajax({
        url: '/plugin/api/getUrlErr',
        type: 'GET',
        data: '',
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                var d = data.data;
                var arr = [], arr1 = [];
                for (var i = 0; i < d.length; i++) {
                    arr.push(d[i].name);
                    arr1.push(d[i].y);
                }
                histograms_urlErr('container_interface', arr, arr1);
            }
        },
        error: function (err) {
            alert('暂无数据');
        }
    });
    $.ajax({
        url: '/plugin/api/getPlugDownloads',
        type: 'GET',
        data: '',
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                var d = data.data;
                var arr = [], arr1 = [];
                for (var i in d){
                    arr.push(d[i].name);
                    arr1.push(d[i].sum);
                }
                histograms('container_downloads', arr, arr1, '下载量统计');
            }
        },
        error: function (err) {
        }
    });




    // $.ajax({
    //     url: '/plugin/api/getBrowser',
    //     type: 'GET',
    //     data: '',
    //     dataType: 'json',
    //     success: function (data) {
    //         if (data.success) {
    //             var d = data.data;
    //             var arr = [], arr1 = [];
    //             for (var i = 0; i < d.length; i++){
    //                 arr.push(d[i].name);
    //                 arr1.push(d[i].y);
    //             }
    //             histograms('container_browser', arr, arr1,'浏览器使用情况');
    //         }
    //     },
    //     error: function (err) {
    //         alert('暂无数据');
    //     }
    // });

});
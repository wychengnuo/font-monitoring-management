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
    // var indices = {
    //     name: 0,
    //     group: 1,
    //     id: 16
    // };
    var schema = [
        {name: 'date', index: 0, text: '触发时间'},
        {name: 'delay', index: 1, text: '响应时长'},
        {name: 'status', index: 2, text: 'HTTP状态码'},
        {name: 'api', index: 3, text: '请求地址'},
    ];
// //生成一个schema中name index对应的obj
//     var fieldIndices = schema.reduce(function (obj, item) {
//         obj[item.name] = item.index;
//         return obj;
//     }, {});

    var groupCategories = [];
    var groupColors = [];
    var data;

// zlevel 为 1 的层开启尾迹特效
    myChart.getZr().configLayer(1, {
        motionBlur: 0.5
    })

    $.get('/js/networktest1.json', function (originData) {
        data = normalizeData(originData.web);
        myChart.setOption(getOption(data));
    });


    function normalizeData(originData) {

        var groupMap = {};
        //将json文件的name赋值1存入groupmap
        originData.forEach(function (row) {
            var groupName = row[2];
            if (!groupMap.hasOwnProperty(groupName)) {
                groupMap[groupName] = 1;
            }
        });
        //将groupname推入数组
        for (var groupName in groupMap) {
            if (groupMap.hasOwnProperty(groupName)) {
                groupCategories.push(groupName);
            }
        }
        for (var i = 0; i < groupCategories.length; i++) {
            groupColors.push( 0.1 * i);
        }

        return originData;
    }

    function tooltipFormatter(params) {
        // Remove duplicate by data name.
        var mapByDataName = {};
        var mapOnDim = {x: {}, y: {}, xy: {}};
        echarts.util.each(params, function (item) {
            var data = item.data;
            var dataName = data[3];
            var mapItem = mapByDataName[dataName] || (mapByDataName[dataName] = {});
            mapItem[data[4]] = data[0];
            mapItem[data[5]] = data[1];
            mapOnDim[item.axisDim][dataName] = mapItem;
        });
        echarts.util.each(mapByDataName, function (mapItem, dataName) {
            if (mapOnDim.x[dataName] && mapOnDim.y[dataName]) {
                mapOnDim.xy[dataName] = mapItem;
                delete mapOnDim.x[dataName];
                delete mapOnDim.y[dataName];
            }
        });
        var resultHTML = [];
        echarts.util.each([['xy', 'CROSS'], ['x', 'V LINE'], ['y', 'H LINE']], function (dimDefine) {
            var html = [];
            echarts.util.each(mapOnDim[dimDefine[0]], function (mapItem, dataName) {
                var valuesHTML = [];
                echarts.util.each(mapItem, function (value, dataName) {
                    valuesHTML.push(
                        '<span style="color:#FFFFFF">'
                        + dataName
                        + '</span>: ' + value
                    );
                });
                html.push('<div style="margin: 10px 0">' + dataName + '<br/>' + valuesHTML.join('<br/>') + '</div>');
            });
            html.length && resultHTML.push(
                '<div style="margin: 10px 0">'
                + '<div style="font-size: 16px; color: #aaa">POINTS ON ' + dimDefine[1] + '</div>'
                + html.join('')
                + '</div>'
            );
        });
        return resultHTML.join('');
    }

    function getOption(data) {

        return {
            backgroundColor: '#2c343c',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    axis: 'x'
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
                show: true,
                snap: true,
                lineStyle: {
                    type: 'dashed'
                },
                label: {
                    show: true,
                    margin: 6,
                    backgroundColor: '#556',
                    textStyle: {
                        color: '#fff'
                    }
                }
            },
            xAxis: {
                name: 'protein',
                splitLine: {show: false},
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            yAxis: {
                name: 'calcium',
                splitLine: {show: false},
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#fff'
                    }
                },
                axisTick: {
                    lineStyle: {
                        color: '#fff'
                    }
                }
            },
            visualMap: [{
                show: false,
                type: 'piecewise',
                categories: groupCategories,
                dimension: 2,
                inRange: {
                    color: groupColors //['#d94e5d','#eac736','#50a3ba']
                },
                outOfRange: {
                    color: ['#ccc'] //['#d94e5d','#eac736','#50a3ba']
                },
                top: 20,
                textStyle: {
                    color: '#fff'
                },
                realtime: false
            }, {
                show: false,
                dimension: 3,
                max: 1000,
                inRange: {
                    colorLightness: [0.15, 0.6]
                }
            }],
            series: [
                {
                    zlevel: 1,
                    name: 'nutrients',
                    type: 'scatter',
                    itemStyle: {
                        emphasis: {
                            color: '#fff'
                        }
                    },
                    data: data.map(function (item, idx) {
                        return [item[2], item[3], item[1], idx];
                    }),
                    animationThreshold: 5000,
                    progressiveThreshold: 5000
                }
            ],
            animationEasingUpdate: 'cubicInOut',
            animationDurationUpdate: 2000
        };
    }

    $('.channel select').change(function(){

        if (data) {
            myChart.setOption({
                xAxis: {
                    name: app.config.xAxis
                },
                yAxis: {
                    name: app.config.yAxis
                },
                series: {
                    data: data.map(function (item, idx) {
                        return [
                            item[fieldIndices[app.config.xAxis]],
                            item[fieldIndices[app.config.yAxis]],
                            item[1],
                            idx
                        ];
                    })
                }
            });
        }
    })

}

function histograms_typeErr(ele) {
    var option = {
        tooltip: {},
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['SyntaxError', 'ReferenceError', 'RangeError', 'TypeError', 'URIError', 'EvalError']
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
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
        series: [
            {
                name: 'SyntaxError',
                type: 'bar',
                stack: '总量',
                cursor: 'auto',
                data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
                name: 'ReferenceError',
                type: 'bar',
                stack: '总量',
                cursor: 'auto',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: 'RangeError',
                type: 'bar',
                stack: '总量',
                cursor: 'auto',
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: 'TypeError',
                type: 'bar',
                stack: '总量',
                cursor: 'auto',
                data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
                name: 'URIError',
                type: 'bar',
                stack: '总量',
                cursor: 'auto',
                data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
                name: 'EvalError',
                type: 'bar',
                stack: '总量',
                cursor: 'auto',
                data: [820, 932, 901, 934, 1290, 1330, 1320]
            },
            {
                name: '访问来源',
                type: 'pie',
                radius: '70%',
                center: ['25%', 150],
                cursor: 'auto',
                tooltip: {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                data: [
                    {value: 335, name: 'SyntaxError'},
                    {value: 310, name: 'ReferenceError'},
                    {value: 234, name: 'RangeError'},
                    {value: 135, name: 'TypeError'},
                    {value: 100, name: 'URIError'},
                    {value: 1548, name: 'EvalError'},
                ]
            },
        ],
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

    $.ajax({
        url: '/plugin/api/typeErr',
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
                // histograms_typeErr('container_html', arr, arr1);
                histograms_typeErr('container_html', arr, arr1);
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
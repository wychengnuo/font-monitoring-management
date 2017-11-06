/**
 * @param 避免全局污染
 */

var ind = {

    /**
     *  @param { object } 获取数据
     */

};


function histograms_urlErr(ele, originData) {
    var myChart = echarts.init(document.getElementById(ele));
    var groupCategories = [], groupColors = [], data;
    var maxTime = moment().add(1, "d").format("YYYY-MM-DD");
    var minTime = moment().subtract(6, "d").format("YYYY-MM-DD");

    var schema = [
        {name: 'date', index: 0, text: '报错时间', methodColor: "#fff"},
        {name: 'delay', index: 1, text: '响应时长', methodColor: "#fff"},
        {name: 'status', index: 2, text: 'HTTP状态码', methodColor: "#ff6d77"},
        {name: 'method', index: 3, text: '请求方式', methodColor: "#fff"},
        {name: 'api', index: 4, text: '请求地址', methodColor: "#afffd3"},
    ];

// zlevel 为 1 的层开启尾迹特效
    myChart.getZr().configLayer(1, {
        motionBlur: 0.5
    })

    // $.get('/js/networktest1.json', function (originData) {
        data = originData;
        var init_data = normalizeData(data.website);
        myChart.setOption(getOption(init_data));
    // });

    function normalizeData(originData) {
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
            groupColors.push( 0.4 + 0.085 * i);
        }
        return originData;
    }

    function tooltipFormatter(params) {
        var resultHTML = [];
        var html = [];
        echarts.util.each(params, function (item) {
            var valuesHTML = [];
            var itemData = item.data;
            echarts.util.each(schema, function (mapItem, idx) {
                var valueIdx = mapItem.index;
                var value = itemData[valueIdx];
                var methodColor = mapItem.methodColor;
                (mapItem.name == "date") && (value = moment(value).format("YYYY-MM-DD HH:mm:ss"));
                (mapItem.name == "delay") && (value += "ms");
                if (value == "GET"){
                    methodColor = "#08dcff";
                }else if(value == "POST"){
                    methodColor = "#ffdb80";
                }
                valuesHTML.push(
                    '<span style="color:#fff">'
                    + mapItem.text
                    + '</span>: '
                    + '<span style="color:'+ methodColor +'">' + value + '</span>'
                );
            });
            html.push('<div style="margin: 10px 0;">' + valuesHTML.join('<br/>') + '</div>');
        });
        html.length && resultHTML.push(
            '<div style="margin: 10px 0">'
            + '<div style="font-size: 16px; color: #aaa">ON SAME TIME' + '</div>'
            + html.join('')
            + '</div>'
        );
        return resultHTML.join('');
    }

    function getOption(data) {
        return {
            color: [
                '#0180ff','#fa8a05'
            ],
            legend: {
                y: 'top',
                data: ['get', 'post']
            },
            grid: {
                top: 40,
                width: '85%',
                bottom: 25,
                left: '10%',
                containLabel: true,
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type:'line',
                    snap:false,
                    label: {
                        show: true,
                        margin: 6,
                        backgroundColor: '#3a3b5a',
                        textStyle: {
                            color: '#fff'
                        },
                        formatter: function (a) {
                            return moment(a.value).format("MM/DD HH:mm:ss")
                        }
                    }
                },
                padding: [10, 20, 10, 20],
                backgroundColor: 'rgba(20,50,70,0.8)',
                borderColor: '#ccc',
                borderWidth: 2,
                borderRadius: 4,
                transitionDuration: 0,
                extraCssText: 'min-width:300px;white-space: normal',
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
                type: 'time',
                max: moment(maxTime).unix()*1000,
                min: moment(minTime).unix()*1000,
                splitLine: {show: false},
                splitNumber: 7,
            },
            yAxis: {
                splitLine: {show: false},
                axisLabel : {
                    formatter: '{value} ms',
                },
            },
            dataZoom: [
                {
                    type: 'slider',
                    height: 23,
                    bottom: 0,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '60%',
                    handleStyle: {
                        color: '#bbb'
                    },
                    labelFormatter:function (val) {
                        return moment(val).format("MM-DD HH:mm")
                    },
                    textStyle: {
                        color: '#666'
                    },
                    filterMode: 'empty',
                    realtime: false,
                    xAxisIndex: [0],
                },
                {
                    type: 'slider',
                    width: 23,
                    left: "7%",
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '60%',
                    handleStyle: {
                        color: '#bbb'
                    },
                    labelFormatter:function (val) {
                        return Math.round(val) + "ms";
                    },
                    textStyle: {
                        color: '#666'
                    },
                    filterMode: 'empty',
                    realtime: false,
                    yAxisIndex: [0],
                },
            ],
            visualMap: [{
                show: true,
                type: 'piecewise',
                categories: groupCategories,
                dimension: 2,
                inRange: {
                    symbolSize: 12,
                    colorLightness: groupColors //['#d94e5d','#eac736','#50a3ba']
                },
                outOfRange: {
                    symbolSize: 8,
                    color: ['#eee','#eee','#eee'] //['#d94e5d','#eac736','#50a3ba']
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
                            opacity:0.2
                        }
                    },
                    data: data.GET,
                    animationThreshold: 5000,
                    progressiveThreshold: 5000
                },
                {
                    zlevel: 1,
                    name: 'post',
                    type: 'scatter',
                    itemStyle: {
                        emphasis: {
                            opacity:0.2
                        },
                    },
                    data: data.POST,
                    animationThreshold: 5000,
                    progressiveThreshold: 5000
                }
            ],
            animationEasingUpdate: 'cubicInOut',
            animationDurationUpdate: 2000
        };
    }

    $('.url-channel select').change(function(){
        var key = $('.url-channel select').val();
        groupCategories = []; groupColors = []
        var changedata = normalizeData(data[key]);
        myChart.setOption(getOption(changedata));
    })
}

function histograms_typeErr(ele, d, chartstype) {
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
                type: chartstype,
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
    if(chartstype == "line"){
        option.xAxis[0].boundaryGap = false;
        option.grid.left = "45%";
        option.grid.tooltip.axisPointer.type = "line";
        echarts.util.each(obj.series, function (item) {
            item.areaStyle = {normal: {}};
        })
    }
    var myChart = echarts.init(document.getElementById(ele), 'macarons');
    myChart.setOption(option);
    setTimeout(function () {
        window.onresize = function () {
            myChart.resize();
        }
    }, 200)
}

function world_cloud(ele) {

    var option = {
        series: [{
            type: 'wordCloud',
            gridSize: 2,
            sizeRange: [12, 70],
            rotationRange: [-90, 90],
            shape: 'pentagon',
            width: '80%',
            height: '80%',
            drawOutOfBound: true,
            textStyle: {
                normal: {
                    color: function () {
                        return 'rgb(' + [
                            Math.round(Math.random() * 100 + 130),
                            Math.round(Math.random() * 100 + 130),
                            Math.round(Math.random() * 100 + 130)
                        ].join(',') + ')';
                    }
                }
            },
            data: [
                {
                    name: "暂 无 数 据",
                    value: 13000,
                    textStyle: {
                        fontfamily:'Microsoft YaHei',
                        normal: {
                            color: 'rgb(114,108,136)'
                        }
                    }
                },
                {
                    name: "No data",
                    value: 12181,
                },
                {
                    name: "沒有數據",
                    value: 4386,
                },
                {
                    name: "データがない",
                    value: 4055,
                },
                {
                    name: "Il n’y a pas de données",
                    value: 4055,
                },
                {
                    name: "데이터 가 없다",
                    value: 2467,
                },
                {
                    name: "Нет данных",
                    value: 2244,
                },
                {
                    name: "Los datos no",
                    value: 1898,
                },
                {
                    name: "कोई डेटा नहीं",
                    value: 1484,
                },
                {
                    name: "nulla notitia",
                    value: 1112,
                },
                {
                    name: "ไม่มีข้อมูล",
                    value: 965,
                },
                {
                    name: "Sin datos",
                    value: 847,
                },
                {
                    name: "Nessun dato",
                    value: 582,
                },
                {
                    name: "Lewis Hamilton",
                    value: 555,
                },
                {
                    name: "Geen gegevens",
                    value: 550,
                },
                {
                    name: "Мэдээлэл байхгүй",
                    value: 462,
                },
                {
                    name: "Нема података",
                    value: 366,
                },
                {
                    name: "Ma'lumot yo'q",
                    value: 360,
                },
                {
                    name: "Không có dữ liệu",
                    value: 282,
                },
                {
                    name: "Keine Daten",
                    value: 273,
                },
                {
                    name: "Sem dados",
                    value: 265,
                }
            ]
        }]
    };
    var chart = echarts.init(document.getElementById(ele));
    chart.setOption(option);

}

$(function () {
    $.ajax({
        url: '/plugin/api/typeErr',
        type: 'GET',
        data: '',
        dataType: 'json',
        success: function (body) {
            if (body.success && body.data.length != 0) {
                histograms_typeErr('container_html', body.data, 'bar');
            }else{
                world_cloud('container_html');
            }
        },
        error: function (err) {
            world_cloud('container_html');
        }
    });
    $.ajax({
        url: '/plugin/api/getUrlErr',
        type: 'GET',
        data: '',
        dataType: 'json',
        success: function (body) {
            if (body.success && body.data.length != 0) {
                var d = body.data;
                $(".url-channel").css('display', 'block');
                histograms_urlErr('container_interface', d);
            }else{
                world_cloud('container_interface');
            }
        },
        error: function (err) {
            world_cloud('container_interface');
        }
    });
    $.ajax({
        url: '/plugin/api/getPlugDownloads',
        type: 'GET',
        data: '',
        dataType: 'json',
        success: function (body) {
            if (body.success && body.data.length != 0) {
                var d = body.data;
                histograms_typeErr('container_downloads', d, 'line');
            }else{
                world_cloud('container_downloads');
            }
        },
        error: function (err) {
            world_cloud('container_downloads');
        }
    });

});
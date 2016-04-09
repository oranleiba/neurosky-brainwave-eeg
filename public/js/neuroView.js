/**
 * Created by oran on 3/27/2016.
 * example taken from http://code.tutsplus.com/tutorials/start-using-html5-websockets-today--net-13270
 */

var NV = NV || {};

NV.charts = {};

NV.initSeries = function () {
    // generate an array of random data
    var data = [],
        time = (new Date()).getTime(),
        i;

    for (i = -19; i <= 0; i += 1) {
        data.push({
            x: time + i * 1000,
            y: 0
        });
    }
    return data;
};

NV.createChart = function (elem) {
    elem.highcharts({
        chart: {
            type: 'spline',
            animation: Highcharts.svg, // don't animate in old IE
            marginRight: 10,
            events: {
                load: function () {
                    var curChart = this;
                    // set up the updating of the chart each second
                    var series0 = this.series[0];
                    var series1 = this.series[1];
                    setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y0 = Math.random();
                        y1 = Math.random();
                        series0.addPoint([x, y0], false, true);
                        series1.addPoint([x, y1], false, true);
                        curChart.redraw();//when more than one series is updated it is best practice to redraw once
                    }, 1000);
                }
            }
        },
        title: {
            text: 'Live Neurosky Brainwave values'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'Random data',
            data: NV.initSeries(),
        },
            {
                name: 'Random data 2',
                data: NV.initSeries(),
            }]
    });

    return elem.highcharts();
}

NV.putChart = function (key, val) {
    NV.charts[key] = val;
}

NV.getChart = function (key) {
    NV.charts[key];
}

NV.chartListener = function (chartWrapper) {
    this.chart = chartWrapper;
}

NV.chartListener.prototype.message = function (eventData) {
    //console.log('Listener got event data: ' + eventData);
    if (eventData) {
        if (eventData.status == 'scanning') {
            processScanningMessage();
        }
        if (eventData.status == 'notscanning') {

        }
        if (eventData.eSense) {
            //{"attention":3,"meditation":57}
            processESenseMessage(eventData.eSense);
        }
        if (eventData.eegPower) {
            //{"delta":565412,"theta":346916,"lowAlpha":42739,"highAlpha":85680,"lowBeta":53556,"highBeta":11421,"lowGamma":8290,"highGamma":12756}
            processEEGPowerMessage(eventData.eegPower);
        }
        if (eventData.blinkStrength) {
            //int
            processBlinkStrengthMessage(eventData.blinkStrength);
        }}
        if (eventData.poorSignalLevel) {
            //int
            processPoorSiganlLevelMessage(eventData.poorSignalLevel);
        }
}

NV.connect = function connect(wsUrl, chartListener) {
    var socket;
    var host = wsUrl;

    try {
        var socket = new WebSocket(host);

        message('Socket Status: ' + socket.readyState);

        socket.onopen = function () {
            message('Socket Status: ' + socket.readyState + ' (open)');
        }

        socket.onmessage = function (msg) {
            message('Received: ' + msg.data);
            chartListener.message(msg.data);
        }

        socket.onclose = function () {
            message('Socket Status: ' + socket.readyState + ' (Closed)');
        }

    } catch (exception) {
        message('Error' + exception);
    }

    function message(msg) {
        //$('#chatLog').append(msg+'</p>');
        if (true) {
            console.log(msg);
        }
    }

    $('#disconnect').click(function () {
        socket.close();
    });

}//End connect

$(document).ready(function () {

    if (!("WebSocket" in window)) {
        $('<p>Oh no, you need a browser that supports WebSockets. How about <a href="http://www.google.com/chrome">Google Chrome</a>?</p>').appendTo('#container');
    } else {
        //The user has WebSockets

        NV.connect('ws://localhost:8080/neurosky', new NV.chartListener());

        NV.putChart('allInOne', NV.createChart($('#chartContainer')));

    }//End else

});
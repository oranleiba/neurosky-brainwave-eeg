/**
 * Created by oran on 3/26/2016.
 */
"use strict";
var server = require('http').createServer(),
    url = require('url'),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({server: server}),
    express = require('express'),
    app = express(),
    expressWs = require('express-ws')(app);

var restServer = function (config) {

    this.config = config;

    this.port = config.port || 8080;
}


restServer.prototype.init = function () {

    var self = this;
    var wsServer = expressWs;

    if (!this.inited) {

        app.use('/static', express.static('public'));
        
        app.ws('/neurosky', function (ws, req) {

            ws.on('message', function (msg) {
                //ws.send(msg);
            });
            ws.on('open', function () {
                //console.log('ws open ' + ws);
            });
            ws.on('connection', function () {
                //console.log('ws connection open ' + ws);
            });
            ws.on('close', function () {
                console.log('ws close ' + ws);
            });
            ws.on('error', function () {
                console.log('ws error ' + ws);
            });

            ws.send('neurosky WS connection opened');
        });

        app.listen(self.port, function () {
            console.log('Server listening on port ' + self.port + '!');
        });

        this.inited = true;
    } else {
        throw Error('Server already initiated - you should not call this method more than once');
    }

    return this;

}

exports.restServer = restServer;
exports.init = function (config) {
    return new restServer(config).init();
}
exports.getNSSockets = function () {
    return expressWs.getWss('/neurosky').clients
}



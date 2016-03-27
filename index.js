/**
 * Created by oran on 3/20/2016.
 */
"use strict";
var neurosky = require("./lib/Neurosky"),
    restServer = require("./lib/ExpressWrapper");

var curServer = restServer.init({
    port: 8080
});

var client = neurosky.createClient({
    appName: 'NodeNeuroSky',
    appKey: '0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
})

client.on('data', function (data) {
    var clients = restServer.getNSSockets();
    clients.forEach(function each(client) {
        client.send(JSON.stringify(data));
    });
});

client.connect();

module.exports = {};

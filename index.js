/*eslint new-cap:0 */
'use strict';
var path = require('path');
var express = require('express');
var app = express();
app.use(express.static(path.join(__dirname, '/dist')));
var http = require('http').Server(app);
var io = require('socket.io')(http);

var accessToken = process.env.GITHUB_TOKEN;
global.pollInterval = process.env.POLL_INTERVAL || 10000; //github has "abuse detection mechanism", has to wait long enough
console.log("poll interval is :" + pollInterval);
var port = process.env.VCAP_APP_PORT || 3000;

var client = require('./github')(accessToken);
io.on("connection", function(socket) {
    setInterval(function() {
        client.getEvents(socket);
        }, global.pollInterval);
});

//io.set('origins', '*:*');
http.listen(port);
console.log("app started...");

var dt = require('./date.js');
console.log("getCurrUTCDateISO=" + dt.getCurrUTCDateISO());
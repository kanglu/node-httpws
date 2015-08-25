#!/usr/bin/env node

// Read the certificates required for SSL connectivity
var fs = require('fs');

var privateKey = fs.readFileSync('sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');
var credentials = {
    key: privateKey,
    cert: certificate
};

// Initialize our express application
var express = require('express');
var app = express();

// Initialize our server

var https = null;
var server = null;
var isSecure = false;

process.argv.splice(0, 1);
if (process.argv.length === 2 && process.argv[1] === 'secure') {
    https = require('https');
    server = https.createServer(credentials, app);
    isSecure = true;
} else {
    https = require('http');
    server = https.createServer();
    server.on('request', app);
}

var WebSocketServer = require('ws').Server;

var wss = new WebSocketServer({
    server: server
});

var regexp = /(\d+)/i;
var buffer = [];
var minSize = 256;
var maxSize = 32 * 1024 * 1024;
for (var i = 0 ; i < maxSize; i++) {
    buffer.push('a');
}
buffer = buffer.join("");

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        var found = message.match(regexp);
        // create a random string between 256 to 32M bytes
        var targetSize = Math.floor(Math.random()* (maxSize - minSize)) + minSize;
        ws.send("for: " + found[0] + " sent on: " + (new Date()).toString() + " " + buffer.substring(0, targetSize));
    });
    ws.send('server ack connection');
});

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.redirect('/client.html');
});

server.listen(8443, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening on port %s using http%s protocol.', port, isSecure ? 's' : '');
});
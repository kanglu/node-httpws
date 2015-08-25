function defaultUrl() {
    return (window.location.protocol === 'http:' ? 'ws' : 'wss') + ":" + window.location.host;
}

function log(str) {
    if (!String.prototype.encodeHTML) {
        String.prototype.encodeHTML = function() {
            return this.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        };
    }

    $("div.output").append("<div>" + str.encodeHTML() + "</div>");
}

var ws = null;
var ready = false;

var sendBody = function() {
    var numIter = $("input#num").val();
    for (var i = 0; i < numIter; i++) {
        var msg = "Example request " + i;
        log(msg);
        ws.send(msg);
    }
};

function WebSocketTest() {
    if ("WebSocket" in window) {
        // Let us open a web socket
        if (!ws) {
            ws = new WebSocket($("input#url").val());
            ws.onopen = function() {
                // Web Socket is connected, send data using send()
                $("div.output").html("");
                log("using: " + $("input#url").val());
                log("Connection ready");
                ready = true;
            };
            ws.onmessage = function(evt) {
                var received_msg = evt.data;
                var dispStr = evt.data + " (length: " + evt.data.length + ")";
                if (evt.data.length > 50) {
                    dispStr = evt.data.substring(0, 50) + "... (length: " + evt.data.length + ")";
                }
                log("Message received on: " + (new Date()).toString() + " " + dispStr);
            };
            ws.onclose = function() {
                // websocket is closed.
                log("Connection is closed...");
                ws = null;
            };
            ws.onerror = function(ev) {
                log("Socket error: " + ev.data);
            }
        }

        if (ready) {
            sendBody();
        } else {
            setTimeout(WebSocketTest, 100);
        }
    } else {
        // The browser doesn't support WebSocket
        log("WebSocket NOT supported by your Browser!");
    }
}



$(document).ready(function() {
    $("input#url").val(defaultUrl());
    $("input#num").val(1);

    $("input#url").change(function() {
        if (ws) {
            ws.close();
        }
        ws = null;
    });
});
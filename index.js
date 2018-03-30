var http = require("http")
var express = require("express")
var WebSocketServer = require("ws").Server
var nonce = require('nonce')();
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))
var server = http.createServer(app)
server.listen(port)

console.log("neo http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
  console.log("websocket connection open, create timer")
  var id = setInterval(function() {
	var msg = {
      type: "message",
      x: Date.now(),
      y: Math.floor(Math.random()*100+1),
      id: nonce(),
      date: Date.now()
    };
	//console.log(msg.date)
    ws.send(JSON.stringify(msg))
  }, 1000)

 
  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})
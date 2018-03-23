var http = require("http")
var express = require("express")
var WebSocketServer = require("ws").Server

var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))
var server = http.createServer(app)
server.listen(port)

console.log("neo http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
	
  var id = setInterval(function() {
	console.log("websocket interval")
    //ws.send(JSON.stringify(new Date()), function() {  })
  }, 1000)

 
  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})
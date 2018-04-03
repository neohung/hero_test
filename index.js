var http = require("http")
var express = require("express")
var WebSocketServer = require("ws").Server
var nonce = require('nonce')();
var Neo = require('./neo.js')
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))
var server = http.createServer(app)
server.listen(port)

console.log("neo http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")
//
var n = new Neo("key","secret");
console.log("New neo created")

//var returnTickerCB = function(err, result) {
//    console.log(err)
//    console.log(result)
//}

wss.on("connection", function(ws) {
  console.log("websocket connection open, create timer")
  var id = setInterval(function() {
	 /* 
	let msg = {
      type: "message",
      x: Date.now(),
      //y: Math.floor(Math.random()*100+1),
      y: 0,
      id: nonce(),
      date: Date.now()
    };
	*/
	// if (callback && typeof(callback) === 'function') {
    //    callback(greeting, name)
    //}
	
	n.returnOrderBook("USDT","BTC", function(err,result){
		this.seq = result['seq'];
		this.bids = result['bids']; //50 unit
		this.asks = result['asks'];
		this.msg = {
          type: "message",
          x: Date.now(),
          y: this.bids[0][0],
          id: nonce(),
          date: Date.now()
        };
		//console.log(this.bids[0][0])
	}.bind(this));
	if (typeof(this.msg) != "undefined"){
		//console.log(this.msg.y)
		ws.send(JSON.stringify(this.msg))
	}
      //console.log("2:"+this.seq)
	
	//
	
  }, 1000)

 
  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})
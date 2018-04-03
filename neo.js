module.exports = (function(){
  var request = require('request')
  var fs      = require("fs")
  var nonce = require("nonce")()
  var crypto  = require('crypto')
  var version     = '0.0.8'
  //PUBLIC_API_URL  = 'https://poloniex.com/public',
  //PRIVATE_API_URL = 'https://poloniex.com/tradingApi',
  var USER_AGENT    = ""
  //var USER_AGENT    = 'poloniex.js ' + version;
  //USER_AGENT  = 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:26.0) Gecko/20100101 Firefox/26.0'
  var PUBLIC_API_URL  = 'https://poloniex.com/public'
  //var PRIVATE_API_URL = 'https://www.google.com'
  var PRIVATE_API_URL = 'https://poloniex.com/tradingApi'
  
  function joinCurrencies(currencyA, currencyB) {
      if (typeof currencyB !== 'string') {
        return currencyA;
      }
      return currencyA + '_' + currencyB;
  }
 //實作N()函數, 在module.exports最後return N()函數
 function N(key, secret) {
 	console.log(key)
 	console.log(secret)
	//這裡定義了計算加密特徵值的函數傳輸檔頭時使用
 	this._getPrivateHeaders = function(parameters) {
 		var paramString, signature
 		paramString = Object.keys(parameters).map(function(param) {
 			return encodeURIComponent(param) + '=' + encodeURIComponent(parameters[param]);
 		}).join("&")
		//用該KEY算出加密特徵值
 		signature = crypto.createHmac('sha512', secret).update(paramString).digest('hex')
 	return {
        Key: key,
        Sign: signature,
      };
 	}
 }
 //N.prototype定義需要的函數
  N.prototype = {
  	_request: function(options, callback) {
  		//
  		if (!('headers' in options)) {
        	options.headers = {};
    	}
    	options.json = true;
        options.headers['User-Agent'] = USER_AGENT
        options.strictSSL = false //Poloniex.STRICT_SSL;
        options.timeout = 10 * 1000;

  		//執行
  		request(options, function(err, response, body) {
      		if (!err && (typeof body === 'undefined' || body === null)){
      			err = 'Empty response';
      		}
      		callback(err, body)
      	})
  		return this	
  	},
  	//public其實是get方式呼叫
  	_public: function(command, parameters, callback) {
  		//console.log(command)
  		//console.log(parameters)
  		//console.log(callback)
		var options;
		//如果只有兩個參數, 參數2是callback不是parameters
      	if (typeof parameters === 'function') {
        	callback = parameters;
        	parameters = {};
      	}
      	parameters || (parameters = {});
        parameters.command = command;
        options = {
          method: 'GET',
          url: PUBLIC_API_URL,
          //參數1為＆後面參數,放在.command
          qs: parameters
        };
        options.qs.command = command;
      	return this._request(options, callback);
  	},
  	//private其實是poset方式呼叫
  	_private: function(command, parameters, callback) {
      var options;
      if (typeof parameters === 'function') {
        callback = parameters;
        parameters = {};
      }
      parameters || (parameters = {});
      parameters.command = command;
      parameters.nonce = nonce();

      options = {
        method: 'POST',
        url: PRIVATE_API_URL,
        //參數1為POST參數,放在.command
        form: parameters,
        //處理檔頭
        headers: this._getPrivateHeaders(parameters)
      };
      //console.log(options.headers)
      return this._request(options, callback);
    },  	
  	returnTicker: function(callback) {
      return this._public('returnTicker', callback);
    },
    return24hVolume: function(callback) {
      return this._public('return24hVolume', callback);
    },
    returnCurrencies: function(callback) {
      return this._public('returnCurrencies', callback);
    },
    returnLoanOrders: function(currency, callback) {
      return this._public('returnLoanOrders', {currency: currency}, callback);
    },
	returnTradeHistory: function(currencyA,currencyB,callback){
		var currencyPair;
      	if (typeof currencyB === 'function') {
        	currencyPair = currencyA;
        	callback = currencyB;
        	currencyB = null;
      	}
      else {
        currencyPair = joinCurrencies(currencyA, currencyB);
      }
      var parameters = {
        currencyPair: currencyPair
      };
      return this._public('returnTradeHistory', parameters, callback);
	},
    returnOrderBook: function(currencyA, currencyB, callback) {
    	var currencyPair;
      	if (typeof currencyB === 'function') {
        	currencyPair = currencyA;
        	callback = currencyB;
        	currencyB = null;
      	}
      else {
        currencyPair = joinCurrencies(currencyA, currencyB);
      }
      var parameters = {
        currencyPair: currencyPair
      };
      return this._public('returnOrderBook', parameters, callback);
    },

  }
  //N.prototype.f2 = N.prototype.f1;
  return N
})()
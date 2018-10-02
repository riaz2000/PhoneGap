//document.addEventListener("deviceready", function(){
    //mycode
//import WS from 'websocket-rpc-client';
var vis=1;
$('#settingsPage').live('pageshow', function(event) { //pageshow pageinit
	getSettings();
});

//});
function getSettings(){
	obaddr = document.getElementById('OBAddress');
	osaddr = document.getElementById('OSAddress');
	//verbos = document.getElementById('Verbosity');
	verbosSldr = document.getElementById('VerbositySldr');
	
	obaddr.value = localStorage.getItem('owlbaddr');
	osaddr.value = localStorage.getItem('owlsaddr');
	//verbos.value = localStorage.getItem('verboseLvl');
	if(localStorage.getItem('verboseLvl') == '')
		verboseLvl = 2;
	verbosSldr.value=parseInt(localStorage.getItem('verboseLvl'));
	//verbosSldr.slider("option", "value", verbosSldr.value);
	//verbosSldr.slider('refresh');
	
	document.getElementById('popupLgMenu').style.visibility = 'hidden';
	vis = 0;
}

function updateSettings(){
    //remember code
	var obaddr = document.getElementById('OBAddress').value;
	var osaddr = document.getElementById('OSAddress').value;
	//var verbos = document.getElementById('Verbosity').value;
	var verbos = document.getElementById('VerbositySldr').value;
	
	localStorage.setItem('owlbaddr',obaddr);
	localStorage.setItem('owlsaddr',osaddr);
	localStorage.setItem('verboseLvl',verbos);
	
	
	alert("Information Updated");
	
	goBack();

}

function cancel(){
	goBack()
}

//var WebSocket = require('rpc-websockets').Client;

function testWS3(){
	alert("In testWS()");
	WS = new websocket-rpc-client("ws://192.168.1.7/");
	var params = {
    url: 'ws://192.168.1.7/',
    reconnectTimeout: 5000,
    reconnectCount: 2,
	}
	 
	WS.start(params).then(function(){
		// on success
		alert("Start: Success");
	}).catch(function(){
		// on failure
		alert("Start: Failure");
	})
	
	WS.send("GPIO.Write", {
        "pin":2,
        "value":1,
    }).then(function(resp) {
        // on success
		alert("Send: Success");
    }).catch(function(e) {
        // on error
		alert("Send: Error");
    });
}

var wsUri = "ws://192.168.0.100/rpc";
//var output; 

var websocket;
var ws;
function testWS(){
	alert("Running Function testWS");
	
	websocket = new WebSocket(wsUri);//, "rpc"); 
	//ws = new RpcSocket(websocket);
	websocket.onopen = function(evt) { onOpen(evt) }; 
	websocket.onclose = function(evt) { onClose(evt) }; 
	websocket.onmessage = function(evt) { onMessage(evt) }; 
	websocket.onerror = function(evt) { onError(evt) }; 
	
	//websocket.doSend(message);
}

function onOpen(evt) { 
  writeToScreen("CONNECTED: " + JSON.stringify(event)); 
  //doSend("WebSocket rocks"); 
  /*
  ws.send("GPIO.Write", {
        "pin":2,
        "value":1,
    }).then(function(resp) {
        // on success
		alert("Success");
    }).catch(function(e) {
        // on error
		alert("Error");
    });
	*/
  var msg = {
		"pin": 2,
		"value": 1
	  };
  
  //message = JSON.stringify(msg);
  message = "call GPIO.Write '" + JSON.stringify(msg) + "'";
  
  //message = "RPC.call(\"GPIO.Write\", {\"pin\":2, \"value\":1})";
  //message = "GPIO.Write '{\"pin\":2, \"value\":1}' ";
  //message = "RPC.List";
  //message = "{\"pin\":2, \"value\":1}";
  //message = " GPIO.Toggle '{\"pin\":2}' ";
  //"call GPIO.Write '{\"pin\": 2, \"value\": 1}'";
  //websocket.call(message);
  //message = " GPIO.Toggle ('{\"pin\":2}'); ";
  
  doSend(message);
  
  /*
  var request = {
        action: "GPIO.Write",
        params: {
            "pin": 2,
            "value": 1
        }
    };
  doSend(JSON.stringify(request)); 
  */
}  
function onClose(evt) { 
  writeToScreen("DISCONNECTED: " + JSON.stringify(evt) + " " + evt.reason + " " + evt.wasClean + " " + evt.code); 
}  
function onMessage(evt) { 
  writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>'); 
  websocket.close(); 
}  
function onError(evt) { 
  writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data); 
}  
function doSend(message) { 
  writeToScreen("SENDING: " + message);  
  websocket.send(message); 
}  
function writeToScreen(message) { 
  //var pre = document.createElement("p"); 
  //pre.style.wordWrap = "break-word"; 
  alert(message);
  //pre.innerHTML = message; output.appendChild(pre); 
}

function testWS1(){
	alert("Running Function testWS1");
	
	var accessToken = "abcdefghiklmnopqrstuvwxyz";
	var wsOptions = {
		url: "ws://192.168.0.100/rpc/",
		timeout: 5000,
		pingInterval: 10000,
		headers: {"Authorization": "Bearer " + accessToken},
		acceptAllCerts: false
	}
	var webSocketId;
	alert("WS1 ID: " + webSocketId);
	CordovaWebsocketPlugin.wsConnect(wsOptions,
					function(recvEvent) {
						console.log("Received callback from WebSocket: "+recvEvent["callbackMethod"]);
						alert("WS: recvEvent");
					},
					function(success) {
						console.log("Connected to WebSocket with id: " + success.webSocketId);
						webSocketId = success.webSocketId
						alert("WS: success");
						
						message = "call GPIO.Write '{\"pin\": 2, \"value\": 1}'"
						CordovaWebsocketPlugin.wsSend(webSocketId, message);
					},
					function(error) {
						console.log("Failed to connect to WebSocket: "+
									"code: "+error["code"]+
									", reason: "+error["reason"]+
									", exception: "+error["exception"]);
									alert("WS: error");
					}
					
				);
				
	//CordovaWebsocketPlugin.wsSend(webSocketId, message);
}

function test(){
	//document.getElementById('colDiv').hide;
	if(vis==1){
		document.getElementById('popupMen').style.visibility = 'hidden';
		vis = 0;
	}
	else if(vis==0){
		document.getElementById('popupMen').style.visibility = 'visible';
		
		//var rect = element.getBoundingClientRect();
		//console.log(rect.top, rect.right, rect.bottom, rect.left);

		var rect = document.getElementById('BtnTesting').getBoundingClientRect();
		
		document.getElementById('popupMen').style.position="fixed";
		document.getElementById('popupMen').style.left="30px";//rect.left+"px";//"50px";
		document.getElementById('popupMen').style.top="40px";//(parseInt(rect.top)+parseInt(30))+"px";//"50px";
		vis = 1;
	}
	/*
	var myDiv = document.createElement('div');
	var myH2 = document.createElement('h2');
	document.getElementById('settingsPage').appendChild(myDiv);
	myDiv.style.position="absolute";
	myDiv.style.left="200px";
	myDiv.style.top="200px";
	//myDiv.data-role="collapsible";
	//myDiv.data-inset="false";
	myH2.text = "Operations";
	myDiv.appendChild(myH2);
	*/
}

function ShowOld(){
	alert("Function Called");
}

function popupLogin1(){
	if(vis==1){
		document.getElementById('popupLgMenu').style.visibility = 'hidden';
		vis = 0;
	}
	else if(vis==0){
		document.getElementById('popupLgMenu').style.visibility = 'visible';
		vis = 1;
	}
}

function test1(){
	//document.getElementById('colDiv').hide;
	if(vis==1){
		document.getElementById('popupMen').style.visibility = 'hidden';
		vis = 0;
	}
	else if(vis==0){
		document.getElementById('popupMen').style.visibility = 'visible';
		vis = 1;
	}
	/*
	var myDiv = document.createElement('div');
	var myH2 = document.createElement('h2');
	document.getElementById('settingsPage').appendChild(myDiv);
	myDiv.style.position="absolute";
	myDiv.style.left="200px";
	myDiv.style.top="200px";
	//myDiv.data-role="collapsible";
	//myDiv.data-inset="false";
	myH2.text = "Operations";
	myDiv.appendChild(myH2);
	*/
}

function WebSocketTest2(){
	networkinterface.getWiFiIPAddress(function (ip) { 
		//alert('WiFi-IP = ' + ip); 
		WifiIPaddr = ip;
		
		IPoctts = WifiIPaddr.split('.');
		for (i = 1; i < 255; i++) { 
			//alert('startIPoctt[3]+count: '+startIPoctt[3]+count);
			ipPrefix = IPoctts[0] + '.' + IPoctts[1] + '.' + IPoctts[2] + '.';
			var wsUri = 'ws://' + ipPrefix + i +'/rpc';
			//serviceURL = 'http://' + ipPrefix + i + '/owl/services/';
			WebSocketTest(wsUri);
			//try2Discover(serviceURL,Direct);
			if(i==254)
			 alert("Search Complete");
		}
	});
	/*
	IPoctts = "192.168.1.1".split('.');
	for (i = 1; i < 255; i++) { 
		//alert('startIPoctt[3]+count: '+startIPoctt[3]+count);
		ipPrefix = IPoctts[0] + '.' + IPoctts[1] + '.' + IPoctts[2] + '.';
		var wsUri = 'ws://' + ipPrefix + i +'/rpc';
		//serviceURL = 'http://' + ipPrefix + i + '/owl/services/';
		WebSocketTest(wsUri);
		//try2Discover(serviceURL,Direct);
		if(i==254)
			alert("Search Complete");
	}*/
	
}

function WebSocketTest(wsUri) {
        //var wsUri = 'ws://192.168.1.13/rpc';

        if ("WebSocket" in window) {
          //console.log("WebSocket is supported by your Browser! IP:" + wsUri);
		  //alert("WebSocket is supported by your Browser! IP:" + wsUri);

          // Let us open a web socket
          let ws = new WebSocket(wsUri);

          ws.onopen = function() {

              // Web Socket is connected, send data using send()
              /*ws.send(JSON.stringify({
                method: "Num.Set",
                args: {
                  num: 9999
                }
              }));*/
			  /*
			  ws.send(JSON.stringify({
                method: "GPIO.Write",
                args: {
                  "pin": 2,
				  "value": 0
                }
              }));*/
			  ws.send(JSON.stringify({
                method: "GPIO.Toggle",
                args: {
                  "pin": 2
                }
              }));
          };

          ws.onmessage = function (evt) { 
              var received_msg = evt.data;
              console.log(received_msg);
			  alert(wsUri + ": " + received_msg);
          };

          ws.onclose = function() { 

              // websocket is closed.
              //alert("Connection is closed..."); 
          };
        } else {

          // The browser doesn't support WebSocket
          alert("WebSocket NOT supported by your Browser!");
        }
      }
/*
$('#addplacePage').live('pageshow', function(event) { //pageshow pageinit
	addplace_getinfo();
});

function addplace_getinfo(){
	
}

document.addEventListener('deviceready', function () {
    // cordova.plugins.backgroundMode is now available
	alert("Device Ready ");
}, false);

document.addEventListener("offline", function () {
	alert('You have lost internet connection');
	console.log("lost connection");
}, false);

document.addEventListener("online", function () {
	alert('You have got internet connection');
}, false);
*/
function add(){
	var obid = document.getElementById('OBID').value;
	localStorage.setItem('owlbid',obid);

	checkConnection();
	
	alert("Adding "+ obid);
}

var socketId1 = 0;
function findOBoxs(){
	//'use strict';
	alert('searching  .  .            . ');
	//chrome.sockets.udp.create({}, function(socketInfo) {
	chrome.sockets.udp.create({}, function (createInfo) {
		var _socketUdpId= createInfo.socketId;
		socketId1 = createInfo.socketId;

	});
	
	alert('socketId1 = ' + socketId1);
}

function MycallbackFn(socInfo){
	udpSockId = socInfo1.socketId;
	alert("UDP Socket Created "+socInfo.socketId);
};


function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Connection type: ' + states[networkState]);
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function arrayBuffer2str(buf) {
	var str= '';
	var ui8= new Uint8Array(buf);
	for (var i= 0 ; i < ui8.length ; i++) {
		str= str+String.fromCharCode(ui8[i]);
	}
	return str;
}

function tempFn(){
	alert('RH-1');
	chrome.sockets.udp.create({}, function (createInfo) { 
		alert('RH-2');
		var _socketUdpId= createInfo.socketId;
		/// connect the socket to the port 55555
		chrome.sockets.udp.bind(_socketUdpId, "0.0.0.0", _udpScanPort, function(result) {
			console.log(result);
		});
		alert('RH-3');
		/// add the listener
		chrome.sockets.udp.onReceive.addListener(function (info) {
			if (typeof $localStorage.list === 'undefined') {
				$localStorage.list= new Array();
			}
			var data= arrayBuffer2str(info.data);
			var row= { 
				"addr": info.remoteAddress,
				"data": data
			};
			$localStorage.list.push(row);
		});
		/// the timeout set the end of the listening
		setTimeout(function() {
			chrome.sockets.udp.close(_socketUdpId, function() {
				/// close the socket
				$ionicLoading.hide();
				deferred.resolve($localStorage.list);
			});
		}, delay);
	});
	alert('RH-1b');
}

var deviceType;		//ANDROID, ios, WINDOWS or BROWSER,
var internetStatus;	// 0: No Acces, 1: Accessible
var connType;		// if WiFi
var firebaseInitialized = 0;
var directAccessIP = "";
var OBdirectAccess = 0;
var OBviaInternetAccess = 0;
var defaultServerAddress = 'jrosos1.freemyip.com:8080';//'203.124.40.232';
//var serviceURL;

FloorMode = {
	OPERATION 				: 0,
	SELECTION				: 1,
	FLOOR_OPTIONS			: 2
}
//timeoutTimer = 4000;
function myAlert(msg, msgPriority){ // msgPriority = 1 - 5 (1:Highest, 5:Lowest)

	var verbosity = localStorage.getItem('verboseLvl');
	if(msgPriority <= verbosity)	//remember msgPriority=1 highest
		alert(msg);
}

/*
function onDeviceReady() {
    // cordova.plugins.backgroundMode is now available
	alert("Device Ready ");
	window.open = cordova.InAppBrowser.open;
	setDeviceType();
}


document.addEventListener('deviceready', function () {
    // cordova.plugins.backgroundMode is now available
	alert("Device Ready ");
	window.open = cordova.InAppBrowser.open;
	setDeviceType();
}, false);
*/

document.addEventListener("offline", function () {
	alert('You have lost internet connection');
	console.log("lost connection");
	internetStatus = 0;
}, false);

document.addEventListener("online", function () {
	//alert('You have got internet connection');
	internetStatus = 1;
}, false);

function goBack(){
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
        // IOS DEVICE
        history.go(-1);
    } else if (userAgent.match(/Android/i)) {
        // ANDROID DEVICE
		if (typeof (navigator.app) !== "undefined") {
			navigator.app.backHistory();
		} else {
			window.history.back();
		}
    } else {
        // EVERY OTHER DEVICE
        history.go(-1);
    }
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getInernetStatus(){
	return internetStatus;
}

function getOBoxIpPort(OBoxID){
	var ipPort = "0.0.0.0:0";

	$.ajaxSetup({
        async: false
    });

	//1. If WiFi On
	//	1-a. Attempt to reach via last IP address
	if(deviceType != "BROWSER")
	networkinterface.getWiFiIPAddress(function (ip) {
		//alert('WiFi-IP = ' + ip);
		WifiIPaddr = ip;
		checkConnection();
		alert('Got-WiFiIp = ' + ip);
	});

	//  1-b. Search through Broadcast


	//2. If internet
	//  Access via server

	$.ajaxSetup({
        async: true
    });

	return ipPort;

}

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
		if(states[networkState]=='WiFi connection' ||
					states[networkState]=='Unknown connection')
					connType = "WiFi";

    console.log('Connection type: ' + states[networkState]);
}

function setDeviceType(){
	deviceType = "UNKNOWN";
	userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.match(/Android/i)) {
        // ANDROID DEVICE
        deviceType = "ANDROID";
    } else if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
        // IOS DEVICE
        deviceType = "IOS";
    } else if (userAgent.match(/Windows Phone/i) || userAgent.match(/iemobile/i) || userAgent.match(/WPDesktop/i) ) {
        // ANDROID DEVICE
        deviceType = "WINDOWS";
    } else {
		var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
		if ( app ) {
			// PhoneGap application
			deviceType = "PhoneGapApp";
		} else {
			deviceType = "BROWSER";
		}
    }
}

function getDeviceType(){
	return deviceType;
}

function setServerAddress(){
	var serverAddress = localStorage.getItem('serveraddr');
	//alert('serverAddress: ' + serverAddress);
	if(serverAddress == null || serverAddress == "")
		localStorage.setItem('serveraddr', defaultServerAddress);
}

function setDirectAccessIP(ipAddr){
	directAccessIP = ipAddr;
}
function getDirectAccessIP(){
	return directAccessIP;
}

function getDPI() {
  return document.getElementById("dpi").offsetHeight;
}

function setOBdirectAccess(OBdrctAccssStatus){
	OBdirectAccess = OBdrctAccssStatus;
}
function getOBdirectAccess(){
	return OBdirectAccess;
}

function setOBviaInternetAccess(OBviaINetAccssStatus){
	OBviaInternetAccess = OBviaINetAccssStatus;
}
function getOBviaInternetAccess(){
	return OBviaInternetAccess;
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function uintToString(uintArray) {
    var encodedString = String.fromCharCode.apply(null, uintArray),
        decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;
}

var deviceType;		//ANDROID, ios, WINDOWS or BROWSER, 
var internetStatus;	// 0: No Acces, 1: Accessible
var connType;		// if WiFi
var directAccessIP = "";
var OBdirectAccess = 0;
var OBviaInternetAccess = 0;
//timeoutTimer = 4000;
function myAlert(msg, msgPriority){ // msgPriority = 1 - 5 (1:Highest, 5:Lowest)
	
	var verbosity = localStorage.getItem('verboseLvl');
	if(msgPriority <= verbosity)	//remember msgPriority=1 highest
		alert(msg);
}


function onDeviceReady() {
    // cordova.plugins.backgroundMode is now available
	alert("Device Ready ");
	window.open = cordova.InAppBrowser.open;
	setDeviceType();
}

/*
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
	alert('You have got internet connection');
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

    alert('Connection type: ' + states[networkState]);
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

function setDirectAccessIP(ipAddr){
	directAccessIP = ipAddr;
}
function getDirectAccessIP(){
	return directAccessIP;
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

State ={
	OFF : 0,	
	ON	: 1,
	UK	: 2,	//UnKnown state
	UR	: 3		//UnRecognized resource i.e. UnRegistered
}

ResourceType = {
    ceilingFan		:	1, //{value: 1, name: "ceilingFan", imageName: "ceilingFan"}, 
	bracketFan		:	2,
	pedestalFan		:	3,
	exhaustFan		:	4,
	tubeLight		:	5,
	bulb			:	6,
	energySaverBulb	:	7,
	ledBulb			:	8,
	chandelier		:	9,
	teleVision		:	10,
	plasmaTV		:	11,
	ledTV			:	12,
	airConditioner	:	13,
	microwaveOven	:	14,
	oven			:	15,
	refrigerator	:	16,
	freezer			:	17,
	dispenser		:	18,
	waterPump		:	19,
	motor			:	20,
	socket			:	21,
	geyser			:	22,
	thermometer		:	23,
	remote_control	:	24,
	video_camera	:	25		 
}

function uintToString(uintArray) {
    var encodedString = String.fromCharCode.apply(null, uintArray),
        decodedString = decodeURIComponent(escape(encodedString));
    return decodedString;
}
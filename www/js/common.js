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

function getNoOfDays( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;

  // Convert back to days and return
  return Math.round(difference_ms/one_day);
}

function getDateNoOfDaysAfter( frmDate, noOfDays ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert from date to milliseconds
	var frmDate_ms = frmDate.getTime();

	//Add number of days
	var toDate_ms = frmDate_ms + (noOfDays-1)*one_day;

	//var toDate = new Date(toDate_ms);
	//console.log('toDate: '+toDate.toString());
	return toDate_ms;
}

function getMonthName(monthNo){
	var monthName = "";
	switch(parseInt(monthNo)) {
		case 1:
			monthName="Jan" ;
		break;
		case 2:
			monthName="Feb" ;
		break;
		case 3:
			monthName="Mar" ;
		break;
		case 4:
			monthName="Apr" ;
		break;
		case 5:
			monthName="May" ;
		break;
		case 6:
			monthName="Jun" ;
		break;
		case 7:
			monthName="Jul" ;
		break;
		case 8:
			monthName="Aug" ;
		break;
		case 9:
			monthName="Sep" ;
		break;
		case 10:
			monthName="Oct" ;
		break;
		case 11:
			monthName="Nov" ;
		break;
		case 12:
			monthName="Dec" ;
		break;
		default:
			monthName="UKN" ;
	}
	return monthName;
}

function getEventDays(daysChecked){
	var eventDays = '-------';
	var days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
	for(var k=0; k<daysChecked.length; k++){
		if(daysChecked.charAt(k) == '1')
			eventDays = replaceAt(eventDays, k, days[k]);
	}
	return eventDays;
}

function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}

/*String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}*/

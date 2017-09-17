$('#testPage').live('pageshow', function(event) { //pageshow pageinit
	test_getinnfo();
});

/*
document.addEventListener('deviceready', function () {
    // cordova.plugins.backgroundMode is now available
	alert("Device Ready");
}, false);
*/
var ref
function test2(){
	//var ref = window.open('http://apache.org', '_blank', 'location=yes');
	//ref.addEventListener('loadstart', function() { alert(event.url); });
	alert('Hereereere');
	//var ref = require("cordova-plugin-inappbrowser"); //cordova-plugin-inappbrowser
	//alert('Here1');
	//window.open = cordova.InAppBrowser.open;
	//window.open('http://apache.org', '_blank', 'location=yes');
	//alert('Here2');
	$('#status-message').text("Trying to load please wait ...");
	ref = cordova.InAppBrowser.open('http://apache.org', '_blank', 'location=yes');
	alert('Here1');
	//ref.show();
	//alert('Here2');
	//ref.addEventListener('loadstart', loadStartCallBack);
	//alert('Here3');
	//window.open(ref);
	alert('Hellllllooooo1');
}

function test3(){
	alert('Test3-1');
	delete window.open;
	window.open('http://bit.ly/iphonedevlog', '_blank', 'location=yes', 'closebuttoncaption=Return');
	alert('Test3-2');
}

function loadStartCallBack() {

    $('#status-message').text("loading please wait ...");

}
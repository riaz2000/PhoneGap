$('#configPage').live('pageshow', function(event) { //pageshow pageinit
	window.open = cordova.InAppBrowser.open;
	//getServerInfo();
	//document.addEventListener("deviceready", onDeviceReady, false);
});

function onDeviceReady() {
    // Now safe to use the Codova API
	//window.location="http://your.website"; 
}
 
function yourFunction(){
    //window.open('http://apache.org', '_blank', 'location=yes'); 
	//window.open("http://yourexternallink.com","_system");
	//navigator.app.loadUrl('https://google.com/', { openExternal:false });
	//alert("MyFunc");
	//var ref = window.open('http://apache.org', '_blank', 'location=yes');
	
	window.location="http://your.website";
}

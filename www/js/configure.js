$('#configPage').live('pageshow', function(event) { //pageshow pageinit
	//window.open = cordova.InAppBrowser.open;
	//getServerInfo();
	//document.addEventListener("deviceready", onDeviceReady, false);
	
	getConfigList();
});

function onDeviceReady() {
    // Now safe to use the Codova API
	//window.location="http://your.website"; 
}
 
function  getConfigList(){
	$('#configLst li').remove();
		
	$('#configLst').append('<li><a href="#" data-rel="back" data-transition="reverse"> <img src="imgs/place.png"/> <font size="" color="800000"><h1>My Places</h1></font> </a></li>');

	$('#configLst').append('<li><a href="settings.html"> <img src="imgs/cnfg.png"/> <font size="" color="D98719"><h1>Settings</h1></font></a></li>');
	
	//$('#configLst').append('<li><a admin.html"> <img src="imgs/admin.png"/> <font size="" color="0000ff"><h1>Administer</h1></font></a></li>');
	
	$('#configLst').append('<li> <img src="imgs/admin.png" onclick="yourFunction()"/> <font size="" color="0000ff"><h1>Administer</h1></font></a></li>');
	
	//$('#configLst').append('<li><a href="http://192.168.1.2/owl/services/test1.php"> <img src="imgs/admin.png"/> <font size="" color="0000ff"><h1>Administer</h1></font></a></li>');
	
	$('#configLst').append('<li><a href="ccare.html"> <img src="imgs/ccare.png"/> <font size="" color="2F4F2F"><h1>Customer Care</h1></font></a></li>');	
									
	$('#configLst').listview('refresh');
	
}

function yourFunction(){
    //window.open('http://apache.org', '_blank', 'location=yes'); 
	//window.open("http://yourexternallink.com","_system");
	//navigator.app.loadUrl('https://google.com/', { openExternal:false });
	//alert("MyFunc");
	//var ref = window.open('http://apache.org', '_blank', 'location=yes');
	
	//window.location="http://your.website";
	//window.location="http://192.168.1.2/owl/services/test1.php";
	window.open('http://192.168.1.2/owl/services/test1.php', '_blank', 'location=yes'); 
}

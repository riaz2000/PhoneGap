//var serviceURL = "http://localhost/owl/services/";
var serviceURL;// = "http://192.168.1.2/owl/services/";
//var serviceURL = "http://"+localStorage.getItem('owlbaddr')+"/owl/services/";

var installations;
//$('#installationListPage').bind('pageinit', function(event) {
$('#installationListPage').live('pageshow', function(event) {
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
		//alert("Here--");
	  document.addEventListener("deviceready", onDeviceReady, false);
	} else {
		//alert("Here--2");
	  onDeviceReady(); //this is the browser
	}
	//localStorage.setItem('OBsLstStr',[]);
	//var addedOBs = localStorage.getItem('OBsLstStr');
	
	setDeviceType();
	serviceURL = "http://192.168.1.2/owl/services/";
	getInstallationList(); // 
});

function getInstallationList() {
	
	myAlert("Device2: "+getDeviceType(),4);
	//alert("OBsLstStr: " +localStorage.getItem('OBsLstStr'));
	if(localStorage.getItem('OBsLstStr')=="" || localStorage.getItem('OBsLstStr')==null)
		localStorage.setItem('OBsLstStr',"[]");
	
	myObj = document.getElementById('msgObj');
	//myObj.standby = "Retrieving ...";
	obaddr = localStorage.getItem('owlbaddr');
	//alert('obaddr: '+obaddr );
	myObj.data = "http://"+obaddr+"/owl/services/discoverOwl.php";
	
	var addedOBs = localStorage.getItem('OBsLstStr');
	obj = JSON.parse(addedOBs);
	//alert('addedOBs: ',addedOBs);
	$('#installationList li').remove();
	for (var i = 0; i < obj.length; i++){
		//alert('InstType: ',obj[i].instType);
		var instType = "imgs/place.png";
		if(obj[i].instType == 0 || obj[i].instType == 1 || obj[i].instType == 2)
			instType = "imgs/place.png";
		else if(obj[i].instType == 3 || obj[i].instType == 4 || obj[i].instType == 5 || obj[i].instType == 6 || obj[i].instType == 9)
			instType = "imgs/plaza.png";
		else if(obj[i].instType == 7 || obj[i].instType == 8)
			instType = "imgs/shop.png";
		
		var linkToPage;
		if(obj[i].uLoginState == 0){
			//linkToPage = "login.html?loginid='rhussain1'";
			linkToPage = "login.html?OBoxID="+obj[i].OBoxNo;
			lockImg = "imgs/pswd.png";
			href3 = '';
		}
		else{
			linkToPage = "installation.html?OBoxID="+obj[i].OBoxNo;
			lockImg = "imgs/cnfg.png";
			href3 = '<span class="ui-li-count"><a href="uoptions.html?OBoxID='+obj[i].OBoxNo+'"><img src="' + lockImg + '" height=30, width=25/></a></span></a>';
		}
		
		$('#installationList').append('<li>' + '<a href="' + linkToPage + '" >' +
										'<img src="'+ instType + '"/>' +
										'<h4>' + obj[i].instAddr1 + '</h4><p><B>' + obj[i].instAddr2 + ',</p></B>' +
										'<p><B>' + obj[i].instCity + '</B> ' +  obj[i].instState + ' ' + obj[i].instZip + ' ' + obj[i].instCountry + '</p>'  +
										'<font size="4" color="maroon"><center>' + obj[i].OBoxNo + '</center></font>' + 
										'<span class="ui-li-count"><img src="' + lockImg + '" height=30, width=25/></span></a>' + href3 + '</li> ');

	}
	$('#installationList').listview('refresh');
	/*
	alert('Here1a: ' );
	//$.getJSON(serviceURL + 'getinstallations.php', function(data) {
	$.getJSON('http://192.168.1.2/owl/services/getinstallations.php', function(data) {
		alert('Here1bb: ' );
		$('#installationList li').remove();
		installations = data.items;
		$.each(installations, function(index, installation) {
			var instType = "imgs/place.png";
			if(installation.inst_type == 0 || installation.inst_type == 1 || installation.inst_type == 2)
				instType = "imgs/place.png";
			else if(installation.inst_type == 3 || installation.inst_type == 4 || installation.inst_type == 5 || installation.inst_type == 6 || installation.inst_type == 9)
				instType = "imgs/plaza.png";
			else if(installation.inst_type == 7 || installation.inst_type == 8)
				instType = "imgs/shop.png";
			
			var linkToPage;
			var loginState;
			var lockImg;
			loginState = 1;
			if(loginState == 0){
				linkToPage = "login.html?loginid='rhussain1'";
				lockImg = "imgs/pswd.png";
				href1 = '';
				href2 = '';
				href3 = '';
			}
			else{
				linkToPage = "installation.html";
				lockImg = "imgs/cnfg.png";
				href1 = '<a href="floor.html">';
				href2 = '</a>';
				href3 = '<span class="ui-li-count"><a href="uoptions.html"><img src="' + lockImg + '" height=30, width=25/></a></span></a>';
			}
			//alert('Here - 2'+installation.address2);
			$('#installationList').append('<li>' + '<a href="' + linkToPage + '">' +
					'<img src="'+ instType + '"/>' +
					//'<img src="pics/amy_jones.jpg"/>' +
					'<h4>' + installation.address1 + ' ' + installation.address2 + '</h4>' +
					'<p>' + installation.nr + '</p>'  +
					'<span class="ui-li-count"><img src="' + lockImg + '" height=30, width=25/></span></a>' + href3 + '</li> ');
		});
		$('#installationList').listview('refresh');
	});
	*/
}
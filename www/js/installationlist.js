//var serviceURL = "http://localhost/owl/services/";
var serviceURL = "http://192.168.1.2/owl/services/";
//var serviceURL = "http://"+localStorage.getItem('owlbaddr')+"/owl/services/";

var installations;
$('#installationListPage').bind('pageinit', function(event) {
	getInstallationList();
});
document.addEventListener("deviceready", onDeviceReady, true);
function onDeviceReady() {
    window.open = cordova.InAppBrowser.open;
	//delete window.open;
	
}

function getInstallationList() {
	//alert('Here - 1');
	//var owlBoxes;
	
	/*$.getJSON(serviceURL + 'discoverOwl.php', function(data) {
		//owlBoxes = data.items;
		//$.each(owlBoxes, function(index, owlBox) {
		//		alert('Here - '+owlBox.name);
		//});
		
		alert('Here - '+data[1]);
		alert('Here - '+data[0]);
		
		//$fields = explode(":", data[0]);
		//OWLBoxNo = $fields[2];
		alert('OWLBoxNo='+data[0].split(':')[2]);
	});*/
	//alert('Here - 2');
	/*
	$.getJSON(serviceURL + 'discoverOwl.php', function(data) {
		owlBoxes = data.items;
		alert('InstPage-1 '+owlBoxes);
		$.each(owlBoxes, function(index, owlBox) {
			//alert('InstPage-1 '+myObj.value);
		}
	}
	
	myObj = document.getElementById('msgObj');
	
	//var url = localStorage.getItem('owlbaddr');
	//myObj.data = "http://localhost/owl/services/installation.php";
	myObj.height = "100%";
	
	for (i = 1; i < 9; i++) { 
		//text += cars[i] + "<br>";
		myObj.data = "http://192.168.1."+i+"/owl/services/discoverOwl.php";
		alert('InstPage-1 '+myObj.value);
	}
	myObj.data = "http://192.168.1.6/owl/services/discoverOwl.php";
	
	//if(myObj.data)
	//alert('InstPage-1 '+myObj.data);
	*/
	
	myObj = document.getElementById('msgObj');
	//myObj.standby = "Retrieving ...";
	myObj.data = "http://localhost/owl/services/discoverOwl.php";
	
	/*
	while(htmlDocument== null){
	var t=document.querySelector("#msgObj");
	var htmlDocument= t.contentDocument;
	}*/
	//alert('InstPage-1 '+ myObj.data);
	//var abc = valueOf(myObj.data);
	//alert('InstPage-1 '+ htmlDocument);
	
	$.getJSON(serviceURL + 'getinstallations.php', function(data) {
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
}
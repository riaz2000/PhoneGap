var serviceURL = "http://localhost/owl/services/";
//var WifiIPaddr="";
//var CarIPaddr="";

var lstdOBs = [];
$('#addplacePage').live('pageshow', function(event) { //pageshow pageinit
	getAddPlaceInfo();
});

function getAddPlaceInfo(){
	networkinterface.getWiFiIPAddress(function (ip) { 
		//alert('WiFi-IP = ' + ip); 
		WifiIPaddr = ip;
		
		obip = document.getElementById('OBIP');
	
		obip.value = ip + ',5';
	});
	
	alert('Help us finding the OWLBox\n\nYou MUST Be on the SAME LAN to Add a new OWLBox');
}
/* moved to installationlist.js
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

function search1(){
	//alert('Search 1');
	
	var WifiIPaddr;
	var startIP;
	var count;
	$('#installationList2 li').remove();

	networkinterface.getWiFiIPAddress(function (ip) {
		var obip = document.getElementById('OBIP').value;
		if(obip == ''){
			alert('No Valid IP');
			return;
		}
		else{
			//alert('IP, SearchCount' + obip);
			var startIPnCount = obip.split(',');
			//alert('startIPnCount: ' + startIPnCount.length);
			startIP = startIPnCount[0];
			if( startIP.split('.').length < 4){
				alert('Invalid IP Address ');
				return;
			}
			if(startIPnCount.length == 1)
				count = 10;
			else if(startIPnCount.length == 2){
				count = startIPnCount[1];
				//alert('count: '+count);
			}
			//count = 
		}
		//alert('Search 2');
		startIPoctt = startIP.split('.');
		//alert('startIPoctt[3]: '+startIPoctt[3]);
		
		setTimeout(function() {
			checkajaxkill();
		}, 300);	//300 mSec
		var p = [ ];
		for (i = startIPoctt[3]; i < parseInt(startIPoctt[3])+parseInt(count); i++) { 
			//alert('startIPoctt[3]+count: '+startIPoctt[3]+count);
			ipPrefix = startIPoctt[0] + '.' + startIPoctt[1] + '.' + startIPoctt[2] + '.';
			
			serviceURL = 'http://' + ipPrefix + i + '/owl/services/';
			//alert('Here22 - '+serviceURL);
			var isneedtoKillAjax = true; // set this true
			//serviceURL = "http://192.168.1.6/owl/services/";
			var retObj = $.getJSON(serviceURL + 'discoverOwl.php', function(data) {
				//if(data == "")
				//	continue;
				//else
				isneedtoKillAjax = false;
				
				if(data != null){
				
					alert('DataRcvd: ' + data);
				OWLBoxNo = data[0].split(':')[2];

				$('#installationList2').append('<li> <a href="installation.html"> <img src="imgs/place.png"; width="50px"; height="50"; onclick="update1()";/> OWLBox <B>' + OWLBoxNo + ' @ ' + data[1] + '</B> <span class="ui-li-count"> 4 </span> </a> </li>');
				//$('#installationList2').append('<li> <img src="imgs/place.png"; width="50px"; height="50"; onclick="update1()";/> OWLBox <B>' + OWLBoxNo + ' @ ' + data[1] + '</B> <span class="ui-li-count"> 4 </span> </a> </li>');
				$('#installationList2').listview('refresh');
				}
			})	.success(function() { 
					//alert("second success"); 
				})
				.error(function() { 
					//alert("error"); 
				})
				.complete(function() { 
					//alert("complete"); 
				}
			);
			//setTimeout(function(){ p.abort(); alert(JSON.stringify(p)); }, 500);
			p.push(retObj);
			
			function checkajaxkill(){

				// Check isneedtoKillAjax is true or false, 
				// if true abort the getJsonRequest

				if(isneedtoKillAjax){
					//p[i].abort();
					retObj.abort();
					alert('killing after timeout');                 
				}else{
					alert('no need to kill ajax');
				}
			}
		}
		
		/*
		$.getJSON('discoverOwl.php', function(data) {
			alert('DataRcvdd: ' + data);
			OWLBoxNo = data[0].split(':')[2];

			$('#installationList2').append('<li> <a href="installation.html"> <img src="imgs/place.png"; width="50px"; height="50"; onclick="update1()";/> OWLBox <B>' + OWLBoxNo + ' @ ' + data[1] + '</B> <span class="ui-li-count"> 4 </span> </a> </li>');
			//$('#installationList2').append('<li> <img src="imgs/place.png"; width="50px"; height="50"; onclick="update1()";/> OWLBox <B>' + OWLBoxNo + ' @ ' + data[1] + '</B> <span class="ui-li-count"> 4 </span> </a> </li>');
			$('#installationList2').listview('refresh');
		}).success(function() { alert("second success"); })
			.error(function() { alert("error"); })
			.complete(function() { alert("complete"); })
			.timeout(2000);
		alert('Search 3');
		*/
	});
	
}

function fn1(){
	alert('fn1 Called');
}

function add(){
	alert('We Have Restricted Direct OWLBox Adding, for the time being\n\nYou MUST Be on the SAME LAN to Add a new OWLBox\n\nSearch and Choose a New OWLBox to Add');
	
	/*
	var obid = document.getElementById('OBID').value;
	localStorage.setItem('owlbid',obid);
	
	alert("Adding "+ obid);
	*/
}

function getIndexOfOBox(OBoxNo){
	var addedOBs = localStorage.getItem('OBsLstStr');
	obj = JSON.parse(addedOBs);
	
	for (var i = 0; i < obj.length; i++){
		// look for the entry with a matching `code` value
		if (obj[i].instNo == OBoxNo){
			//alert(obj1[i].name + ' index ' + i);
			return i;
		}
	}
	return -1;
}

function addOBox(OBstring){
	var OBox = JSON.parse(OBstring);
	var indexOfOB = getIndexOfOBox(OBox.instNo);
	if(indexOfOB > -1){
		alert('OWLBox No:' + OBoxNo + ' Already Exisit');
		return;
	}
	
	var addedOBs = localStorage.getItem('OBsLstStr');
	obj = JSON.parse(addedOBs);
	obj.push(OBstring);
	
	//Now update the OBsLstStr
	localStorage.setItem('OBsLstStr',JSON.stringify(obj));
	
	alert('OWLBox No:' + OBox.instNo + ' Added, SUCCESSFULLY');
}

function removeOBox(OBoxNo){
	var indexOfOB = getIndexOfOBox(OBoxNo);
	if(indexOfOB < 0){
		alert('OWLBox No:' + OBoxNo + ' Does NOT Exisit');
		return;
	}
	
	var addedOBs = localStorage.getItem('OBsLstStr');
	obj = JSON.parse(addedOBs);
	
	obj.splice(indexOfOB,1); // remove one JSON object starting from indexOfOB
	
	//Now update the OBsLstStr
	localStorage.setItem('OBsLstStr',JSON.stringify(obj));
	
	alert('OWLBox No:' + OBoxNo + ' Removed, SUCCESSFULLY');
}

function updateOBox(OBoxNo, OBstring){
	var indexOfOB = getIndexOfOBox(OBoxNo);
	if(indexOfOB < 0){
		alert('OWLBox No:' + OBoxNo + ' Does NOT Exisit');
		return;
	}
	
	var addedOBs = localStorage.getItem('OBsLstStr');
	obj = JSON.parse(addedOBs);
	
	// Remove
	obj.splice(indexOfOB,1); // remove one JSON object starting from indexOfOB
	
	// Added
	obj.push(OBstring);
	
	//Now update the OBsLstStr
	localStorage.setItem('OBsLstStr',JSON.stringify(obj));
	
	alert('OWLBox No:' + OBoxNo + ' Updated, SUCCESSFULLY');
	
}


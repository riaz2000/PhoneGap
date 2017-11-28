//var serviceURL = "http://localhost/owl/services/";
//var WifiIPaddr="";
//var CarIPaddr="";
var serviceURL = '';
var lstdOBs = [];
var selectedOBoxId = 0;
var selectedOBoxIP = "";
const Direct = 0;
const ViaInet = 1;
var discoveredOwls=0;
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
	
	//alert('Help us finding the OWLBox\n\nYou MUST Be on the SAME LAN to Add a new OWLBox');
}

function searchViaInet(){
	$('#installationList2 li').remove();
	
	osaddr = localStorage.getItem('owlsaddr');
	OBoxNo = document.getElementById('OBID').value;
	if(OBoxNo == ''){
		alert('Please enter a valid number');
		return;
	}
	port = 30000 + parseInt(OBoxNo);
	serviceURL = 'http://'+osaddr+':'+port+'/owl/services/';
	alert('serviceURL: ' + serviceURL);
	try2Discover(serviceURL,ViaInet);
}

function searchOnLAN(){
	//alert('Search 1');
	lstdOBs = [];
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
		
		discoveredOwls = 0;
		for (i = startIPoctt[3]; i < parseInt(startIPoctt[3])+parseInt(count); i++) { 
			//alert('startIPoctt[3]+count: '+startIPoctt[3]+count);
			ipPrefix = startIPoctt[0] + '.' + startIPoctt[1] + '.' + startIPoctt[2] + '.';
			
			serviceURL = 'http://' + ipPrefix + i + '/owl/services/';
			
			try2Discover(serviceURL,Direct);
		}
	});
}

function try2Discover(url,mode){
	alert('try2Discover-url: '+url);
	var isneedtoKillAjax = true; // set this true
	var timeoutTimerVal;
	if (mode == Direct)
		timeoutTimerVal = 1000;
	else
		timeoutTimerVal = 4000;
	setTimeout(function() {
		checkajaxkill();
	}, timeoutTimerVal);	//300 mSec
	var p = [ ];
	var retObj = $.getJSON(url + 'discoverOwl.php', function(data) {
		//if(data == "")
		//	continue;
		//else
		alert('Here: ' + url + 'discoverOwl.php');
		isneedtoKillAjax = false;
		
		if(data != null){
			alert('DataRcvd: ' + JSON.stringify(data));
			
			OWLBoxNo = data[0].split(':')[2];
			lstdOBs.push(OWLBoxNo+"@"+data[1]);
			$('#installationList2').append('<li onclick="addListed('+mode+')";><img src="imgs/place.png"; width="50px"; height="50"; />OWLBox:<B>' + OWLBoxNo + "@" + data[1] + '</B><span class="ui-li-count"><img src="imgs/add.png" height=30, width=30/></span></li>');
			$('#installationList2').listview('refresh');
			discoveredOwls++;
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
			alert('Timeout: No OWLBox Discovered');                 
		}else{
			//alert('no need to kill ajax');
		}
	}
}


function addListed(mode){
	$('#installationList2 li').click(function(e){
		//e.stopPropagation();
		e.stopImmediatePropagation();
		e.preventDefault();
		var $this = $(this);
		var itemText = $this.text();
		myAlert(itemText,5);
		
		selectedOBoxIP = itemText.split('@')[1];
		selectedOBoxId = (itemText.split('@')[0]).split(':')[1];
		if(getIndexOfOBox(OBoxID) > -1){
			myAlert('OWLBox No:' + selectedOBoxId + ' is already in the list', 0);
			return;
		}
		myAlert('selectedOBoxId: '+selectedOBoxId, 3);
		var urlToRtrvDetails;// = "http://"+selectedOBoxIP+"/owl/services/getinstDetails.php";
		if(mode==Direct)
			urlToRtrvDetails = "http://"+selectedOBoxIP+"/owl/services/getinstDetails.php";
		else if(mode==ViaInet){
			osaddr = localStorage.getItem('owlsaddr');
			port = 30000 + parseInt(selectedOBoxId);
			urlToRtrvDetails = 'http://'+osaddr+':'+port+'/owl/services/getinstDetails.php';
		}
		else{
			myAlert('Invalid Mode: ' + mode, 0);
			return;
		}
		myAlert(urlToRtrvDetails, 3);
		$.getJSON(urlToRtrvDetails, function(data) {
			//alert("DataRcvd::: " + data);
			oboxes = data.items;
			$.each(oboxes, function(index, obox) {
				//alert("City:: " + obox.city);
				//alert("InstData:: " + JSON.stringify(obox));
				addOBox(JSON.stringify(obox));
			});
		});
	});
}

function getIndexOfOBox(OBoxID){
	var addedOBs = localStorage.getItem('OBsLstStr');
	//alert('Comp1: ' + addedOBs);
	if(addedOBs == null)
		return -1;
	
	//alert('Here2');
	var obj = JSON.parse(addedOBs);
	
	for (var i = 0; i < obj.length; i++){
		// look for the entry with a matching `code` value
		//alert('Comp: ' + obj[i].OBoxNo + " : : " + OBoxID);
		if (obj[i].OBoxNo == OBoxID){
			//alert(obj1[i].name + ' index ' + i);
			return i;
		}
	}
	return -1;
}

function addOBox(OBstring){
	//myAlert(OBstring,3);

	var OBox = JSON.parse(OBstring);
	newOBoxObj = {"OBoxNo":selectedOBoxId, "instType":OBox.inst_type, "ctrlAtomicLvl":OBox.ctrl_atomic_lvl,
					"loginRqrdInside":OBox.loginRqrdInside, "instAddr1":OBox.address1, "instAddr2":OBox.address2,
					"instCity":OBox.city, "instState":OBox.state, "instZip":OBox.zip, "instCountry":OBox.country,
					"instLastDirectAccessip":selectedOBoxIP, "ufname":"", "ulname":"", "userId":"", "userPwd":"",
					"uLoginLvl":"", "uLoginState":0};
	myAlert('newOBoxObj: '+JSON.stringify(newOBoxObj),3);
	//localStorage.setItem('OBsLstStr',"[]");
	var indexOfOB = getIndexOfOBox(selectedOBoxId);//(OBox.instNo);
	if(indexOfOB > -1){
		myAlert('OWLBox No:' + selectedOBoxId + ' Already Exisit', 0);
		
		// Just update the IP and return
		var updatedObj = {"OBoxNo":selectedOBoxId, "instType":OBox.instType, 						"ctrlAtomicLvl":OBox.ctrlAtomicLvl,
							"loginRqrdInside":OBox.loginRqrdInside, "instAddr1":OBox.instAddr1, "instAddr2":OBox.instAddr2,
							"instCity":OBox.instCity, "instState":OBox.instState, "instZip":OBox.instZip, "instCountry":OBox.instCountry,
							"instLastDirectAccessip":selectedOBoxIP, "unr":OBox.unr, "ufname":OBox.ufname, "ulname":OBox.ulname, "userId":OBox.userId, "userPwd":"", "uLoginLvl":OBox.uLoginLvl, "uLoginState":OBox.uLoginState};
		
		updateOBox(selectedOBoxId, updatedObj);
		
		return;
	}
	//localStorage.setItem('OBsLstStr',"[]");
	var addedOBs = localStorage.getItem('OBsLstStr');
	myAlert('addedOBs: '+ addedOBs, 3);
	if(addedOBs == null){
		addedOBs = [];
		//alert('Here-1');
	}
	
	obj = JSON.parse(addedOBs);
	obj.push(newOBoxObj);
	
	//Now update the OBsLstStr
	localStorage.setItem('OBsLstStr',JSON.stringify(obj));
	
	alert('OWLBox No:' + newOBoxObj.OBoxNo + ' Added, SUCCESSFULLY');
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

function getOBoxObjstr(OBoxNo){
	var indexOfOB = getIndexOfOBox(OBoxNo);
	if(indexOfOB < 0){
		alert('OWLBox No:' + OBoxNo + ' Does NOT Exisit');
		return "InvalidOBox";
	}
	var addedOBs = localStorage.getItem('OBsLstStr');
	obj = JSON.parse(addedOBs);
	
	return JSON.stringify(obj[indexOfOB]);
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

/*

function addListed2(){
	//count();
	var txt = $('#installationList2 li').text();
	alert('myIndex',myIndex);
	alert(txt);
	alert("0: " + txt.split('      ')[0]);
	alert("1: " + txt.split('      ')[1]);
	//alert("2: " + txt.split('   ')[2]);
	//var itemText = "";
	//var myIndex = -1;
	$('#installationList2 li').click(function(e){
		var $this = $(this);
		alert('Text ' + $this.text() + 'Index ' + $this.index());
		//itemText = $this.text();
		//myIndex = $this.index();
	});
	//alert('myIndex',myIndex);
}

function count(){
    var elements = $("#installationList2 li:visible").length;
    alert(elements);
}

function addListed1(){
	var lstItemText;
	//var txt = $('#installationList2 li').text();
	//alert('txt: ' + txt);
	$('#installationList2 li').click(function(e){
	   e.preventDefault();
	   //alert($(this).index());
	   //lstItemText = $(this).text();
	   
	   var $this = $(this);
	   lstItemText = $this.text();
	   alert('Text ' + $this.text() + 'Index ' + $this.index());

	   var ipAddr = (lstItemText.split("@")[1]).split(' ')[0];
	   //var ipAddr = (lstItemText.split("@")[1]);
	   //alert('ipAddr: ' + ipAddr+'---');
	   
	
		var urlToRtrvDetails = "http://"+ipAddr+"/owl/services/getinstDetails.php";
		//alert("URL: " + urlToRtrvDetails);

		$.getJSON(urlToRtrvDetails, function(data) {
			//alert("DataRcvd::: " + data);
			oboxes = data.items;
			$.each(oboxes, function(index, obox) {
				alert("City:: " + obox.city);
				alert("InstData:: " + JSON.stringify(obox));
			});
		});
	});
}

function add(){

	$.ajaxSetup({
        async: false
    });
	getOBoxIpPort(3);
	alert('We Have Restricted Direct OWLBox Adding, for the time being\n\nYou MUST Be on the SAME LAN to Add a new OWLBox\n\nSearch and Choose a New OWLBox to Add');
	$.ajaxSetup({
        async: true
    });
	
	var obid = document.getElementById('OBID').value;
	localStorage.setItem('owlbid',obid);
	
	alert("Adding "+ obid);

}


*/


var OBoxID;
var FloorNo;
var CtrlAtomicLvl;
//var ImgsArr = [];
//var resIdsArr = [];
var webServer='';
var appliances = "[]";
var OBoxIP = '';
var OBoxPort = 0;
var regSoc = null;
$('#schedule').live('pageshow', function(event) { //pageshow pageinit
	OBoxID = getUrlVars()['OBoxID'];
	FloorNo = getUrlVars()['FloorNo'];
	//CtrlAtomicLvl = getUrlVars()['CtrlAtmcLvl'];
	
	if(getOBdirectAccess()==1){
		OBoxIP = getDirectAccessIP();
		OBoxPort = 1213;
		webServer = 'http://'+OBoxIP;
	}
	else if(getOBviaInternetAccess()==1){
		//osaddr = localStorage.getItem('owlsaddr');
		OBoxIP = localStorage.getItem('owlsaddr');
		OBoxPort = 10000 + parseInt(OBoxID);
		port = 30000 + parseInt(OBoxID);
		webServer = 'http://'+OBoxIP+':'+port;
	}
	else{
		alert("OWLBox " + OBoxID + " Neither on LAN Nor Accessible over Internet");
		return;
	}
	getSchedule();
});

function getSchedule(){
	oboxObjStr = getOBoxObjstr(OBoxID);
	//alert("oboxObjStr: " + oboxObjStr);
	if(oboxObjStr == "InvalidOBox"){
		myAlert("OBox Not Registered",1);
		return;
	}
	else{
		OBox = JSON.parse(oboxObjStr);
		title = document.getElementById('pgTitle');
		title.innerHTML = OBox.userId + "@Floor:" + FloorNo + " of OB" + OBox.OBoxNo;
	}
	
	resIconObj = document.getElementById('resIcon');
	
	resIconObj.src = "imgs/place.png";
	resIconObj.height = "50";
	resIconObj.width = "70";
	resIconObj.text = "OWLBox#";
	
	//retrieveSchedules();

}

function retrieveSchedules(){
	/*
	$('#scheduleList li').remove();
	
	$('#scheduleList').append('<li>' + '<a href="' + linkToPage + '">' +
								'<img src="'+ instType + '"/>' +
								'<h4>' + obj[i].instAddr1 + '</h4><p><B>' + obj[i].instAddr2 + ',</p></B>' +
								'<p><B>' + obj[i].instCity + '</B> ' +  obj[i].instState + ' ' + obj[i].instZip + ' ' + obj[i].instCountry + '</p>'  +
								'<font size="4" color="maroon"><center>' + obj[i].OBoxNo + '</center></font>' + 
								'<span class="ui-li-count"><img src="' + lockImg + '" height=30, width=25/></span></a>' + href3 + '</li> ');
										
	$('#scheduleList').listview('refresh');
	*/
}

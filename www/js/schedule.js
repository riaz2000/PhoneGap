var OBoxID;
var FloorNo;
var Context;
var CtrlAtomicLvl;
var SlctdResArr;
//var ImgsArr = [];
//var resIdsArr = [];
//var webServer='';
var appliances = "[]";
//var OBoxIP = '';
//var OBoxPort = 0;
//var regSoc = null;
$('#schedule').live('pageshow', function(event) { //pageshow pageinit
	OBoxID = getUrlVars()['OBoxID'];
	FloorNo = getUrlVars()['FloorNo'];
	SlctdResArr = getUrlVars()['SlctdResArr'];
	Context = getUrlVars()['Context'];
	//CtrlAtomicLvl = getUrlVars()['CtrlAtmcLvl'];
	if(internetStatus == 0){console.log('No Internet Access'); }
	else {console.log('You Have Internet Access');	}

	if(connType == "WiFi"){console.log('WiFi is UP'); }
	else {console.log('WiFi is DOWN');	}
	/*
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
	*/
	initSchedulePg();
	//addSch();
	//initSchedulePg();

});

function initSchedulePg(){
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

	/*resIconObj = document.getElementById('resIcon');

	resIconObj.src = "imgs/place.png";
	resIconObj.height = "50";
	resIconObj.width = "70";
	resIconObj.text = "OWLBox#";
	*/

	retrieveSchedules();

}

function retrieveSchedules(){
	var Resource = getObjectByValue(resources, "resource_id", selectedResArr[0].ResId);
	//console.log(Resource[0].nr);
	if(Resource.length<1){
		console.log('No Matching Resource');
		return;
	}
	var resource = Resource[0];
	var fbdbref = '/Installation-' + OBoxID + '/Device-' +
									resource.device_number + '/ResSchedule';
	//console.log(fbdbref);
	var fbdbResId = 'res-' + resource.device_subid;
	//console.log(fbdbResId);
	var dbref = firebase.database().ref(fbdbref).child(fbdbResId);

	var rcvdSch="";
	//console.log('Here-1');
	dbref.once("value", function(data) {
		//console.log(data);
		rcvdSch = '{'+data.val()+'}';
		console.log(rcvdSch);
		var schObj = JSON.parse(rcvdSch);
		console.log('Here-2');
		var rcvdSchArr = schObj.Sch;
		console.log(":: :: "+JSON.stringify(rcvdSchArr));
		for(var k=0; k<rcvdSchArr.length; k++){
			console.log(rcvdSchArr[k].op);
		}
	});



	/*
	$('#scheduleList li').empty();

	$('#scheduleList').append('<li>' + '<a href="' + linkToPage + '">' +
								'<img src="'+ instType + '"/>' +
								'<h4>' + obj[i].instAddr1 + '</h4><p><B>' + obj[i].instAddr2 + ',</p></B>' +
								'<p><B>' + obj[i].instCity + '</B> ' +  obj[i].instState + ' ' + obj[i].instZip + ' ' + obj[i].instCountry + '</p>'  +
								'<font size="4" color="maroon"><center>' + obj[i].OBoxNo + '</center></font>' +
								'<span class="ui-li-count"><img src="' + lockImg + '" height=30, width=25/></span></a>' + href3 + '</li> ');

	$('#scheduleList').listview('refresh');
	*/
}

function addSch(){
	//document.getElementById('SchA1').href="operateFloor.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify("[]")+"&Context="+1;
	document.getElementById('SchA1').href="operateFloor.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+SlctdResArr+"&Context="+Context;
}

function deleteSch(){

}

function displaySch(rcvdMsg){
	owlMsg = parseOwlMessage(rcvdMsg);
	scheduleArr = owlMsg.schedule;

	$('#scheduleList li').empty();
	for(var i=0; i<ScheduleArr.length; i++){
		scheduleObj = parseSchedule(scheduleArr[i]);

		$('#scheduleList').append('<li>' + '<a href="' + linkToPage + '">' +
									'<img src="'+ instType + '"/>' +
									'<h4>' + obj[i].instAddr1 + '</h4><p><B>' + obj[i].instAddr2 + ',</p></B>' +
									'<p><B>' + obj[i].instCity + '</B> ' +  obj[i].instState + ' ' + obj[i].instZip + ' ' + obj[i].instCountry + '</p>'  +
									'<font size="4" color="maroon"><center>' + obj[i].OBoxNo + '</center></font>' +
									'<span class="ui-li-count"><img src="' + lockImg + '" height=30, width=25/></span></a>' + href3 + '</li> ');
	}

	$('#scheduleList').listview('refresh');
}

function parseSchedule(schedule){
	schFields = schedule.split(":");
	scheduleObj.ResId = schFields[0];
	scheduleObj.Operation = schFields[1];
	scheduleObj.Day = schFields[2];
	scheduleObj.Month = schFields[3];
	scheduleObj.Year = schFields[4];
	scheduleObj.Hour = schFields[5];
	scheduleObj.Minute = schFields[6];
	scheduleObj.Second = schFields[7];
	scheduleObj.WkDays = schFields[8];
	scheduleObj.NoOfDays = schFields[9];
}

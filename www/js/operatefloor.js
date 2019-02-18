var OBoxID;
var FloorNo;
var Context;
var CtrlAtomicLvl;
var allAppsSlctd = false;
var allLightsSlctd = false;
var allFansSlctd = false;
var allAreasSlctd = false;
var allDaysSlctd = false;

var NoOfAppsTypes = 0;
var NoOfAreas = 0;
var resrsAlreadySelected;
//var webServer;

//var selectedResArr;	// Array: will get from floor.js
//var appliances = "[]";	// will get from floor.js
var applianceTypes = [];	// Array of applianceTypes
var areas = [];			// Array of areas on this floor
$('#operatefloor').live('pageshow', function(event) { //pageshow pageinit
	initializeOpFloor();
});

function initializeOpFloor(){
	OBoxID = getUrlVars()['OBoxID'];
	FloorNo = getUrlVars()['FloorNo'];
	Context = getUrlVars()['Context'];

	resrsAlreadySelected = 0;
	//selectedResArr = getUrlVars()['SlctdResArr'];
	/*if(getUrlVars()['SlctdResArr'] == "[]"){
		console.log("Should");
	}*/
	//webServer = 'http://'+localStorage.getItem('serveraddr')+'/OWL/Services/';
	console.log('selectedResArr:: ' +  selectedResArr);
	if(Context == 1){ // i.e. schedule
		//alert("SlctdResArr: " + SlctdResArr);
		//SlctdResArr = JSON.parse(SlctdRess);
		//document.getElementById('BtnOpSelected').style.visibility = 'hidden';
		var title = document.getElementById('pgTitle');
		console.log('selectedResArr.length:: ' +  selectedResArr.length);

		if(selectedResArr.length == resources.length){
			title.innerHTML = "Select and Schedule";
			selectedResArr = [];
			/*
			document.getElementById('lblAll').style.display = 'block';
			document.getElementById('divAppTypes').style.display = 'block';
			document.getElementById('AppTypesList').style.display = 'block';
			document.getElementById('lblIn').style.display = 'block';
			document.getElementById('divAreas').style.display = 'block';
			document.getElementById('AreasList').style.display = 'block';
			document.getElementById('divChkBxShSlctn').style.display = 'block';
			document.getElementById('slctdResList').style.display = 'block';*/
		}
		//if(selectedResArr.length > 0){ // Resources to be scheduled are already selected in floor.js
		else{
			resrsAlreadySelected = 1;
			title.innerHTML = "Schedule Selected";

			document.getElementById('lblAll').style.display = 'none';
			document.getElementById('divAppTypes').style.display = 'none';
			document.getElementById('AppTypesList').style.display = 'none';
			document.getElementById('lblIn').style.display = 'none';
			document.getElementById('divAreas').style.display = 'none';
			document.getElementById('AreasList').style.display = 'none';
			document.getElementById('divChkBxShSlctn').style.display = 'none';
		}
		showLstOfSlctdRess();
		/*else{ // Give option to select the resources and then schedule selected
			title.innerHTML = "Select and Schedule";
			document.getElementById('slctdResList').style.display = 'none';
		}*/

		//var timeControl = document.getElementById('tm');//document.querySelector('input[type="time"]');
		//timeControl.value = '15:30';
		//timeControl.value = 'now';

		//var dateControl = document.getElementById('dt');//document.querySelector('input[type="time"]');
		//dateControl.value = '2018-02-15';
		//dateControl.value = 'now';
	}
	else{ //Context=0; i.e. operate
		selectedResArr = [];

		//document.getElementById('slctdResList').style.display = 'none';

		document.getElementById('lblAt').style.display = 'none';
		document.getElementById('tm').style.display = 'none';
		document.getElementById('lblOn').style.display = 'none';
		document.getElementById('dt').style.display = 'none';
		document.getElementById('lblRpt').style.display = 'none';
		document.getElementById('rptForm').style.display = 'none';
		document.getElementById('untildt').style.display = 'none';
		document.getElementById('lblEvery').style.display = 'none';
		document.getElementById('divBtnSelectAllDays').style.display = 'block';
		document.getElementById('DaysList').style.display = 'block';
	}

	fillAppsList();

	fillAreasList();

	fillDaysList();

	initDtsNtime();

	handleOnce();

}

function fillAppsList(){
	applianceTypes = JSON.parse(localStorage.getItem('applianceTypesStr'));
	NoOfAppsTypes = applianceTypes.length;
	$('#AppTypesList li').remove();
	for(var i=0; i<NoOfAppsTypes; i++){

		//linkToPage = "floor.html?OBoxID="+OBoxID+"&FloorNo="+i+"&CtrlAtmcLvl="+floors[0].ctrl_atomic_lvl;
		linkToPage = "#";

		//$('#AppTypesList').append('<li style="background-color:#FF0000;">' + '<a href="' + linkToPage + '">' + '<B><center>' + applianceTypes[i].appliance_name + '</center></B></a></li>');
		var chkBx = '<label for="chk' + i + '"><input type="checkbox" name="chk' + i + '" id="chk'+i+'" onchange="hideSelection()">';
		var imgApp = '<img src="img/apps/' + getResImg(applianceTypes[i].nr, State.ON) +'.png";/>'
		$('#AppTypesList').append('<li>' + chkBx + '<B><center><h2><font color="purple">' + applianceTypes[i].appliance_name + 's</font></h2></center></B></label>'+imgApp+'</li>');
	}
	$('#AppTypesList').listview('refresh');
}

function fillAreasList(){
	var OBox;
	oboxObjStr = getOBoxObjstr(OBoxID);
	OBox = JSON.parse(oboxObjStr);
	if(oboxObjStr == "InvalidOBox"){
		myAlert("OBox Not Registered",1);
		console.log("OBox Not Registered");
	}
	else{
		var slctdFlrObj = getObjectByValue(OBox.floors, "flrNo", FloorNo);
		areas = slctdFlrObj[0].flrAreas;

		NoOfAreas = areas.length;
		for(var i=0; i<NoOfAreas; i++){

			//linkToPage = "floor.html?OBoxID="+OBoxID+"&FloorNo="+i+"&CtrlAtmcLvl="+floors[0].ctrl_atomic_lvl;
			linkToPage = "#";

			//$('#AreasList').append('<li style="background-color:#FF0000;">' + '<a href="' + linkToPage + '">' + '<B><center>' + applianceTypes[i].appliance_name + '</center></B></a></li>');
			var chkBx = '<label for="Areachk' + i + '"><input type="checkbox" name="Areachk' + i + '" id="Areachk'+i+'" onchange="hideSelection()">';
			var imgApp = '';//'<img src="img/apps/' + getResImg(applianceTypes[i].nr, State.ON) +'.png"; width=30; height=30; />'
			$('#AreasList').append('<li style="background-color:#FF0000;">' + chkBx + '<B><center><h2><font color="teal">' + areas[i].area + '</font></h2></center></B></label>'+imgApp+'</li>');
			//$('#AreasList').append('<li style="background-color:#FF0000;">' + chkBx + areas[i].area + '</label>'+imgApp+'</li>');
		}
		$('#AreasList').listview('refresh');

		AreasOnSlctdFlrArr = areas;
		if(selectedResArr.length > 0){
			showLstOfSlctdRess();
		}
	}
}

function fillDaysList(){
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var txtcolor = ['violet', 'indigo', 'blue', 'green', 'gold', 'orange', 'red'];
	//$('#DaysList').remove();
	for(var i=0; i<days.length; i++){
		var chkBx = '<label for="Daychk' + i + '"><input type="checkbox" name="Daychk' + i + '" id="Daychk'+i+'">';
		var imgApp = '';
		$('#DaysList').append('<li style="background-color:#FF0000;">' + chkBx + '<B><center><h1><font color="'+txtcolor[i]+'">' + days[i] + '</font></h1></center></B></label>'+imgApp+'</li>');
	}
	$('#DaysList').listview('refresh');
}

function initDtsNtime(){
	var date = new Date();
	var currentDate = date.toISOString().slice(0,10);

	var hrs = date.getHours();
	if(parseInt(hrs)<10)
		hrs = '0' + date.getHours();

	var mins = date.getMinutes();
	if(parseInt(mins)<10)
		mins = '0' + date.getMinutes();

	var currentTime = hrs + ':' + mins;

	/*var currentTime = date.getHours() + ':' + date.getMinutes();
	if(parseInt(date.getMinutes()) < 10)
		currentTime = date.getHours() + ':0' +  date.getMinutes();

	if(parseInt(date.getHours()) == 0){
		currentTime = '12' + ':' +  date.getMinutes();
		if(parseInt(date.getMinutes()) < 10)
			currentTime = '12' + ':0' +  date.getMinutes();
	}*/

	document.getElementById('tm').value = currentTime;
	document.getElementById('dt').value = currentDate;
	document.getElementById('untildt').value = currentDate;
	//document.getElementById('untildt1').value = new Date().toDateInputValue();
}

function sltctAllApps(){
	if(allAppsSlctd){
		newStatus = false;
		document.getElementById('BtnSelectAllApps').text = "Select All Appliances";
	}
	else{
		newStatus =  true;
		document.getElementById('BtnSelectAllApps').text = "Unselect All Appliances";
	}

	for(var i=0; i<NoOfAppsTypes; i++){
		document.getElementById('chk'+i).checked = newStatus;
	}
	allAppsSlctd = newStatus;
	allLightsSlctd = newStatus;
	allFansSlctd = newStatus;
}

function sltctAllLights(){
	if(allLightsSlctd){
		newStatus = false;

	}
	else{
		newStatus =  true;

	}

	for(var i=4; i<9; i++){
		document.getElementById('chk'+i).checked = newStatus;
	}

	allLightsSlctd = newStatus;

	if(!newStatus)
		allAppsSlctd = false;
}

function sltctAllFans(){
	if(allFansSlctd)
		newStatus = false;
	else
		newStatus =  true;

	for(var i=0; i<4; i++){
		document.getElementById('chk'+i).checked = newStatus;
	}

	allFansSlctd = newStatus;

	if(!newStatus)
		allAppsSlctd = false;
}

function sltctAllAreas(){
	if(allAreasSlctd)
		newStatus = false;
	else
		newStatus =  true;

	for(var i=0; i<NoOfAreas; i++){
		document.getElementById('Areachk'+i).checked = newStatus;
	}
	allAreasSlctd = newStatus;
}

function sltctAllDays(){
	if(allDaysSlctd)
		newStatus = false;
	else
		newStatus =  true;

	NoOfDays = document.getElementById('DaysList').length;
	for(var i=0; i<7; i++){
		document.getElementById('Daychk'+i).checked = newStatus;
	}
	allDaysSlctd = newStatus;
}

function OperateSelected(){
	if (selectedResArr.length == 0){
		alert('No resources selected');//, 1);
		return;
	}

	var operation = document.getElementById('opList').value;
	if(parseInt(operation) == 0){ //0 is no op selected
		alert("Please select a valid operation");//, 1);
		return;
	}

	if(Context == 0){//operate the selected resources
		console.log('length: ' + selectedResArr.length);
		var rsrs2BOperatedArr = selectedResArr;	//Must store in local variable as selectedResArr gets changed in other functions
		for(var k=0; k<rsrs2BOperatedArr.length; k++){
			selctdResindexOfResInResrs = resources.findIndex(obj => obj.resource_id==rsrs2BOperatedArr[k].ResId);
			console.log(k + '-index: ' + selctdResindexOfResInResrs);
			if(parseInt(operation)-1 == 0){ // 0= turnOFF
				turnOFF();
			}
			else if(parseInt(operation)-1 == 1){ // 1= turnON
				turnON();
			}
			else if(parseInt(operation)-1 == 2){ // 2= Toggle
				Toggle();
			}
			else{//3= RETURN_STATE
				getStatus();
			}
		}
	}
	else if(Context == 1){//schedule the selected resources
		if(firebaseInitialized != 1){
			myAlert("Scheduling Event Not Allowed Without Internet Access", 1);
			return;
		}
		if(resrsAlreadySelected == 0){
			getSelectedResrcs();
		}

		//console.log('Ready to Add Schedule');
		//operate(operation);
		var slctdDays = '';
		for(var k=0; k<7; k++){
			if (document.getElementById('Daychk'+k).checked)
				slctdDays = slctdDays + '1';
			else
				slctdDays = slctdDays + '-';
		}

		var endDt2 = document.getElementById('untildt');
		console.log('endDt2: ' + endDt2.value);

		var strtDt = document.getElementById('dt');
		var dtParsed = (strtDt.value).split('-');
		console.log('strtDt: ' + strtDt.value);
		var time2Exec = document.getElementById('tm');
		var tmParsed = (time2Exec.value).split(':');
		console.log('time2Exec: ' + time2Exec.value);
		var newSchObj = {};
		newSchObj.active = 1;		// So that this key is at the begining
		newSchObj.op = parseInt(operation)-1;
		newSchObj.day = dtParsed[2];
		newSchObj.mon = parseInt(dtParsed[1]); //Month is 0-11 in JavaScript
		newSchObj.year = dtParsed[0];
		newSchObj.hour = tmParsed[0];
		newSchObj.min = tmParsed[1];
		newSchObj.sec = '00';
		newSchObj.repeat = slctdDays;

		var noOfDays2Exec = 0;
		if (document.getElementById('radio-choice-0a').checked)
			noOfDays2Exec = 1;
		else if (document.getElementById('radio-choice-0b').checked)
			noOfDays2Exec = 0;
		else if (document.getElementById('radio-choice-0c').checked){
			var strtDt = document.getElementById('dt');
			var endDt = document.getElementById('untildt');
			console.log('strtDt: ' + strtDt.value);
			console.log('endDt: ' + endDt.value);
			var date1 = new Date(dtParsed[0], parseInt(dtParsed[1]), dtParsed[2]);
			var dt2Parsed = (endDt.value).split('-');
			var date2 = new Date(dt2Parsed[0], parseInt(dt2Parsed[1]), dt2Parsed[2]);
			noOfDays2Exec = parseInt( getNoOfDays(date1, date2) ) + 1;

			console.log('noOfDays2Exec: ' + noOfDays2Exec);
		}

		newSchObj.noDays = noOfDays2Exec;
		console.log('newSchObj: ' + JSON.stringify(newSchObj));
		for(var j=0; j<selectedResArr.length; j++){
			var Resource = getObjectByValue(resources, "resource_id", selectedResArr[j].ResId);
			var resNR = Resource[0].nr;
			//newSchObj.res = Resource[0].device_subid;
			//console.log('newSchObj1: ' + JSON.stringify(newSchObj));
			addSchedule(resNR, JSON.stringify(newSchObj));
		}
		goBack();
	}
}

function getSelectedResrcs(){
	selectedResArr = [];
	var RsrcsOnSlctdFlrArr = getRsrcsOnFloor(OBoxID, FloorNo);
	//console.log('RsrcsOnSlctdFlrArr:: '+RsrcsOnSlctdFlrArr.length);
	console.log('RsrcsOnSlctdFlrArr.length: '+RsrcsOnSlctdFlrArr.length);
	for(var i=0; i<RsrcsOnSlctdFlrArr.length; i++){
		//alert("LVL = " + RsrcsOnSlctdFlrArr[i].usrCtrlLvlonRes + " :: App = " +  RsrcsOnSlctdFlrArr[i].appliance + " :: Area = " + RsrcsOnSlctdFlrArr[i].loc_lvl2);
		//alert("i="+i+" : "+RsrcsOnSlctdFlrArr[i].resource_id);
		if(parseInt(RsrcsOnSlctdFlrArr[i].usrCtrlLvlonRes) > 5 &&
			isResTypeOfResSlctd(RsrcsOnSlctdFlrArr[i].appliance) &&
			isAreaOfResSlctd(RsrcsOnSlctdFlrArr[i].loc_lvl2) ){
			var selectedRes = {ResId:RsrcsOnSlctdFlrArr[i].resource_id};
			idxOfResInSelectedResArr = selectedResArr.findIndex(obj => obj.ResId==RsrcsOnSlctdFlrArr[i].resource_id);
			if(idxOfResInSelectedResArr < 0){//to avoid duplicate entry of the same resId
				selectedResArr.push(selectedRes);
			}
		}
	}
}

function isResTypeOfResSlctd(appNR){
	resTypeOfResIsSlctd = false;
	//console.log( appliances.length + " :: " + JSON.stringify(appliances) );
	//console.log( applianceTypes.length + " ::: " + JSON.stringify(applianceTypes) );
	for(var i=0; i<applianceTypes.length; i++){
		//alert(appNR);
		if(document.getElementById('chk'+i).checked &&
			parseInt(applianceTypes[i].nr) == parseInt(appNR)){
			//alert("Here---" + applianceTypes[i].nr + " : " + appNR);
			resTypeOfResIsSlctd = true;
		}
	}
	return resTypeOfResIsSlctd;
}

function isAreaOfResSlctd(areaNR){
	areaOfResIsSlctd = false;
	//alert(areas.length + " :: " + JSON.stringify(areas) );
	for(var i=0; i<areas.length; i++){
		if(document.getElementById('Areachk'+i).checked &&
			parseInt(areas[i].nr) == parseInt(areaNR) ){
			//alert("Here++++" + areas[i].nr + " : " + areaNR);
			areaOfResIsSlctd = true;
		}
	}
	return areaOfResIsSlctd;
}

function operate(opOption){
	MsgType = MessageType.REQUEST;
	Msg = Message.DO_NOT_CARE;

	ResIdArr 	= [];
	OpArr		= [];

	var operation;
	if(opOption == 1)
		operation = Operation.TURN_OFF;
	else if(opOption == 2)
		operation = Operation.TURN_ON;
	else if(opOption == 3)
		operation = Operation.TOGGLE_STATE;
	else if(opOption == 4)
		operation = Operation.RETURN_STATE;


	if (selectedResArr.length == 0){
		myAlert('No resources selected', 3);
		return;
	}

	for (var i=0; i<selectedResArr.length; i++){
		ResIdArr.push(selectedResArr[i].ResId);
		OpArr.push(operation);
	}

	Schedule = [];
	isRegSoc = false;

	sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, isRegSoc);
}

function onChangeOperation(){
	if(resrsAlreadySelected != 1)
		showLstOfSlctdRess();
	var slctdOp = document.getElementById('opList').value;
	var myOpBtn = document.getElementById('BtnOpSelected');
	console.log("slctdOp: " + slctdOp);
	switch(parseInt(slctdOp)) {
		case 0:
			myOpBtn.innerText = "Hello-0";
			myOpBtn.style.backgroundColor = "black";
		break;
		case 1:
			myOpBtn.style.backgroundColor = "black";
			myOpBtn.innerHTML="Close Curtain";
			//myOpBtn.value = "Hello-1";
		break;
		case 2:
			myOpBtn.style.backgroundColor = "red";
			myOpBtn.innerText = "Hello-2";
		break;
		case 3:
			myOpBtn.style.backgroundColor = "orange";
			myOpBtn.textContent = "Hello-3";
		break;
		case 4:
			myOpBtn.style.backgroundColor = "blue";
			myOpBtn.style.value = "Hello-4";
		break;
		default:
			myOpBtn.style.backgroundColor = "Blue";
	}
}
/*
function updateSlctdRessImgs(operation){
	for(var i=0; i<$('#slctdResList').length; i++){
		document.getElementById('slctdResImg'+i).src=getResImg(, parseInt(operation))
	}
}
*/
function handleOnce(){
	//alert("Once Option Selected");
	//document.getElementById('untildt').style.visibility = 'hidden';
	document.getElementById('untildt').style.display = 'none';
	document.getElementById('lblEvery').style.display = 'none';
	document.getElementById('divBtnSelectAllDays').style.display = 'none';
	document.getElementById('DaysList').style.display = 'none';

	/*
	//Position the "Operate Button"
	var rect = document.getElementById('radio-choice-0c').getBoundingClientRect();
	document.getElementById('BtnOpSelected').style.position="fixed";
	document.getElementById('BtnOpSelected').style.top = rect.bottom+"px";
	*/
}

function handleContinued(){
	//alert("Always Option Selected");
	//document.getElementById('untildt').style.visibility = 'hidden';
	document.getElementById('untildt').style.display = 'none';
	document.getElementById('lblEvery').style.display = 'block';
	document.getElementById('divBtnSelectAllDays').style.display = 'block';
	document.getElementById('DaysList').style.display = 'block';

	/*
	//Position the "Operate Button"
	var rect = document.getElementById('DaysList').getBoundingClientRect();
	document.getElementById('BtnOpSelected').style.position="fixed";
	document.getElementById('BtnOpSelected').style.top = rect.bottom+"px";
	*/
}

function handleUntil(){
	//alert("Until Option Selected");
	//document.getElementById('untildt').style.visibility = 'visible';
	document.getElementById('untildt').style.display = 'block';
	document.getElementById('lblEvery').style.display = 'block';
	document.getElementById('divBtnSelectAllDays').style.display = 'block';
	document.getElementById('DaysList').style.display = 'block';

	/*
	//Position the "Operate Button"
	var rect = document.getElementById('DaysList').getBoundingClientRect();
	document.getElementById('BtnOpSelected').style.position="fixed";
	document.getElementById('BtnOpSelected').style.top = rect.bottom+"px";
	*/
}

function showLstOfSlctdRess(){
	var slctdOp = document.getElementById('opList').value;
	$('#slctdResList').empty();
	for(var i=0; i< selectedResArr.length; i++){
		for (var j=0 ; j<resources.length; j++){
			if(selectedResArr[i].ResId == resources[j].resource_id){
				var chkBx = '<label for="slctdReschk' + j +
										'"><input type="checkbox"  checked name="slctdReschk' + j +
										'" id="slctdReschk'+ j +'" onchange="updateSelection('+
										resources[j].resource_id + ', ' + j + ')">';
				var op2Perform;
				if(slctdOp == 1)
					op2Perform = Operation.TURN_OFF;
				else if(slctdOp == 2)
					op2Perform = Operation.TURN_ON;
				else
					op2Perform = Operation.TOGGLE_STATE;
				var imgApp ='<img src="img/apps/' + getResImg(resources[j].appliance, op2Perform) +'.png"; id="slctdResImg"'+i+'/>'
				var areaOfRes = getResAreaName(resources[j].loc_lvl2);
				var descrpApp = getResTypeName(resources[j].appliance) + " in " + areaOfRes; // + " @ Floor#" + FloorNo;
				$('#slctdResList').append('<li style="background-color:#FF0000;">' + chkBx + '<B><center><h1><font color="'+'Green'+'">' + resources[j].nr + ':' + selectedResArr[i].ResId + '</font></h1><h2>'+ descrpApp +'</h2></center></B></label>'+imgApp+'</li>');
				//break;
			}
		}
	}
	$('#slctdResList').listview('refresh');
}

/*function showLstOfAlreadySlctdRsrcs(){
	$('#slctdResList li').empty();
	for(var j=0; j<selectedResArr.length; j++){
		var Resource = getObjectByValue(resources, "resource_id", selectedResArr[j].ResId);
		if(Resource.length>0){
			for(var k=0; k<Resource.length; k++){
				var resource = Resource[k];
				var indexOfResInResrsArr = resources.findIndex(obj => obj.nr==resource.nr);
				var lbl_resId = '<Label id="lbl_resId:'+indexOfResInResrsArr+'" style="color:blue; position:absolute; left:10px; top:40px;">'+resource.resource_id+'</Label>';
				var imgSpan = '<span style="float:left;"><img id="img:'+indexOfResInResrsArr+'"src="img/apps/' + getResImg(resource.appliance, State.UK) +'.png"; width=80px; height=80px;/>'+lbl_resId+'</span>'

				var resId = resource.resource_id;

				//href3 = '<span class="ui-li-count"><img src="' + 'img/cnfg.png' + '" height=30, width=25;></span></a>';
				$('#slctdResList').append('<li>'+imgSpan+ '<B><center>' + getResTypeName(resource.appliance) + '(' + resource.nr + ')' +
											'<h2><font color="purple"> ' + getResAreaName(resource.loc_lvl2) +
											'</font></h2>' + resId + '(' + resource.device_number + ':' + resource.device_subid + ')' +
											'</center></B></label></li>');
				//var imgApp ='<img src="img/apps/' + getResImg(resource.appliance, op2Perform) +'.png"; id="slctdResImg"'+i+'/>'
				//$('#slctdResList').append('<li>' + imgApp + 'Helloooooo');
			}
		}
	}
	$('#slctdResList').listview('refresh');
}*/

function getResTypeName(resTypeNR){
	//alert("applianceTypes.length: " + applianceTypes.length);
	//alert("resTypeNR: " + resTypeNR);

	for (var i=0; i<applianceTypes.length; i++){
		if(applianceTypes[i].nr == resTypeNR)
			return applianceTypes[i].appliance_name;
	}
}

function getResAreaName(resAreaNR){
	for (var i=0; i<areas.length; i++){
		if(areas[i].nr == resAreaNR)
			return areas[i].area;
	}
}

function chkBxShSlctnChngd(){
	var tempVar;
	if(tempVar=="0"){ tempVar = "1";}
	else{tempVar = "0";}

	console.log('chkBxShSlctnChngd: ' + tempVar);

	if(document.getElementById('chkBxShSlctn').checked){
		document.getElementById('divSlctdRess').style.display = 'block';
		showSelection();
	}
	else{
		document.getElementById('divSlctdRess').style.display = 'none';
	}
}

function showSelection(){
	getSelectedResrcs();
	showLstOfSlctdRess();
}

function hideSelection(){
	document.getElementById('divSlctdRess').style.display = 'none';
	document.getElementById('chkBxShSlctn').checked = false;
}

function updateSelection(resId, resIdxInRsrcs){
	var selectedRes = {ResId:resId};
	//Find all the apps on this ResId
	var resArr = getObjectByValue(resources, "resource_id", resId);
	for(var i=0; i<resArr.length; i++){
		var indexOfResInRcsrs = resources.findIndex(obj => obj.nr==resArr[i].nr);
		/*for(var j=0; j<selectedResArr.length; j++){
			console.log('B4: ' + j + ': ' + selectedResArr[j].ResId);
		}*/
		if (document.getElementById('slctdReschk'+resIdxInRsrcs).checked){
			//console.log('Should Add in the selectedResArr');
			document.getElementById('slctdReschk'+indexOfResInRcsrs).checked = true;
			idxOfResInSelectedResArr = selectedResArr.findIndex(obj => obj.ResId==resId);
			if(idxOfResInSelectedResArr < 0){ // to avoid duplicate
				selectedResArr.push(selectedRes);
			}
		}
		else{
			//console.log('Should Remove from the selectedResArr');
			var idxOfResInSelectedResArr = selectedResArr.findIndex(obj => obj.ResId==resId);
			document.getElementById('slctdReschk'+indexOfResInRcsrs).checked = false;
			if(idxOfResInSelectedResArr > -1)
				selectedResArr.splice(idxOfResInSelectedResArr,1);
		}
		/*for(var j=0; j<selectedResArr.length; j++){
			console.log('After: ' + j + ': ' + selectedResArr[j].ResId);
		}*/
	}
}
/*
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
*/

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
var webServer;

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
	webServer = 'http://'+localStorage.getItem('serveraddr')+'/OWL/Services/';
	if(Context == 1){ // i.e. schedule
		//alert("SlctdResArr: " + SlctdResArr);
		//SlctdResArr = JSON.parse(SlctdRess);
		//document.getElementById('BtnOpSelected').style.visibility = 'hidden';
		title = document.getElementById('pgTitle');
		//showLstOfSlctdRess();
		if(selectedResArr.length > 0){ // Resources to be scheduled are already selected in floor.js
			title.innerHTML = "Schedule Selected";
			//showLstOfSlctdRess();
			document.getElementById('lblAll').style.display = 'none';
			document.getElementById('divAppTypes').style.display = 'none';
			document.getElementById('AppTypesList').style.display = 'none';
			document.getElementById('lblIn').style.display = 'none';
			document.getElementById('divAreas').style.display = 'none';
			document.getElementById('AreasList').style.display = 'none';
			document.getElementById('divChkBxShSlctn').style.display = 'none';
		}
		else{ // Give option to select the resources and then schedule selected
			title.innerHTML = "Select and Schedule";
			document.getElementById('slctdResList').style.display = 'none';
		}

		//var timeControl = document.getElementById('tm');//document.querySelector('input[type="time"]');
		//timeControl.value = '15:30';
		//timeControl.value = 'now';

		//var dateControl = document.getElementById('dt');//document.querySelector('input[type="time"]');
		//dateControl.value = '2018-02-15';
		//dateControl.value = 'now';
	}
	else{ // i.e. operate
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

	/*document.getElementById('untildt').style.visibility = 'hidden';
	document.getElementById('lblEvery').style.visibility = 'hidden';
	document.getElementById('BtnSelectAllDays').style.visibility = 'hidden';
	document.getElementById('DaysList').style.visibility = 'hidden';

	//Position the "Operate Button"
	var rect = document.getElementById('rptForm').getBoundingClientRect();
	document.getElementById('BtnOpSelected').style.position="fixed";
	document.getElementById('BtnOpSelected').style.top = rect.bottom+"px";
	*/
}

function fillAppsList(){
	applianceTypes = JSON.parse(localStorage.getItem('applianceTypesStr'));
	NoOfAppsTypes = applianceTypes.length;
	$('#AppTypesList li').remove();
	for(i=0; i<NoOfAppsTypes; i++){

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
		for(i=0; i<NoOfAreas; i++){

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
	var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	var txtcolor = ['violet', 'indigo', 'blue', 'green', 'gold', 'orange', 'red'];
	//$('#DaysList').remove();
	for(i=0; i<days.length; i++){
		var chkBx = '<label for="Daychk' + i + '"><input type="checkbox" name="Daychk' + i + '" id="Daychk'+i+'">';
		var imgApp = '';
		$('#DaysList').append('<li style="background-color:#FF0000;">' + chkBx + '<B><center><h1><font color="'+txtcolor[i]+'">' + days[i] + '</font></h1></center></B></label>'+imgApp+'</li>');
	}
	$('#DaysList').listview('refresh');
}

function initDtsNtime(){
	var date = new Date();
	var currentDate = date.toISOString().slice(0,10);
	var currentTime = date.getHours() + ':' + date.getMinutes();

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

	for(i=0; i<NoOfAppsTypes; i++){
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

	for(i=4; i<9; i++){
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

	for(i=0; i<4; i++){
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

	for(i=0; i<NoOfAreas; i++){
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
	//for(i=0; i<NoOfDays; i++){
	for(i=0; i<7; i++){
		document.getElementById('Daychk'+i).checked = newStatus;
	}
	allDaysSlctd = newStatus;
}

function OperateSelected(){
	getSelectedResrcs();

	if (selectedResArr.length == 0){
		myAlert('No resources selected', 3);
		return;
	}
	var operation = document.getElementById('opList').value;
	var rptMode;
	if (document.getElementById('radio-choice-0a').checked)
		rptMode = 0;
	else if (document.getElementById('radio-choice-0b').checked)
		rptMode = 1;
	else if (document.getElementById('radio-choice-0c').checked)
		rptMode = 2;

	alert("RepeatMode: " + rptMode);
	if(operation == 0)
		myAlert("Please select a valid operation", 2);
	else
	operate(operation);

	//goBack();
}

function getSelectedResrcs(){
	selectedResArr = [];
	/*
	for(i=0; i<resOnFloorArr.length; i++){
		if(resOnFloorArr[i].usrCtrlLvlonRes > 5 &&
			isResTypeOfResSlctd(resOnFloorArr[i].appliance)	&&
			isAreaOfResSlctd(resOnFloorArr[i].loc_lvl2) ){
			var selectedRes = {ResId:resOnFloorArr[i].resource_id};
			selectedResArr.push(selectedRes);
		}
	}
	*/
	//alert(RsrcsOnSlctdFlrArr.length + " :: " + JSON.stringify(RsrcsOnSlctdFlrArr) );
	for(var i=0; i<RsrcsOnSlctdFlrArr.length; i++){
		//alert("LVL = " + RsrcsOnSlctdFlrArr[i].usrCtrlLvlonRes + " :: App = " +  RsrcsOnSlctdFlrArr[i].appliance + " :: Area = " + RsrcsOnSlctdFlrArr[i].loc_lvl2);
		//alert("i="+i+" : "+RsrcsOnSlctdFlrArr[i].resource_id);
		if(parseInt(RsrcsOnSlctdFlrArr[i].usrCtrlLvlonRes) > 5 &&
			isResTypeOfResSlctd(RsrcsOnSlctdFlrArr[i].appliance) &&
			isAreaOfResSlctd(RsrcsOnSlctdFlrArr[i].loc_lvl2) ){
			var selectedRes = {ResId:RsrcsOnSlctdFlrArr[i].resource_id};
			selectedResArr.push(selectedRes);
		}
	}
}

function isResTypeOfResSlctd(appNR){
	resTypeOfResIsSlctd = false;
	//alert(appliances.length + " :: " + JSON.stringify(appliances) );
	//alert(appNR);
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
	showLstOfSlctdRess();
	var slctdOp = document.getElementById('opList').value;
	var myOpBtn = document.getElementById('BtnOpSelected');
	switch(parseInt(slctdOp)) {
		case 0:
			myOpBtn.style.backgroundColor = "black";
		break;
		case 1:
			myOpBtn.style.backgroundColor = "black";
			myOpBtn.innerHTML="Close Curtain";
		break;
		case 2:
			myOpBtn.style.backgroundColor = "red";
		break;
		case 3:
			myOpBtn.style.backgroundColor = "orange";
		break;
		case 4:
			myOpBtn.style.backgroundColor = "blue";
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
	//alert("selectedResArr.length:: " +selectedResArr.length);
	var slctdOp = document.getElementById('opList').value;
	$('#slctdResList').empty();
	for(var i=0; i< selectedResArr.length; i++){
		//alert(selectedResArr[i].ResId);
		//mResId = selectedResArr[i].ResId;
		for (var j=0 ; j<appliances.length; j++){
			if(selectedResArr[i].ResId == appliances[j].resource_id){
				var chkBx = '<label for="slctdReschk' + i + '"><input type="checkbox"  checked name="slctdReschk' + i + '" id="slctdReschk'+i+'">';
				//var imgApp = getResImg(ResourceType.bulb, State.ON);//'';
				var op2Perform;
				if(slctdOp == 1)
					op2Perform = State.OFF;
				else if(slctdOp == 2)
					op2Perform = State.ON;
				else
					op2Perform = State.UK
				var imgApp ='<img src="img/apps/' + getResImg(appliances[j].appliance, op2Perform) +'.png"; id="slctdResImg"'+i+'/>'
				var areaOfRes = getResAreaName(appliances[j].loc_lvl2);
				var descrpApp = getResTypeName(appliances[j].appliance) + " in " + areaOfRes; // + " @ Floor#" + FloorNo;
				$('#slctdResList').append('<li style="background-color:#FF0000;">' + chkBx + '<B><center><h1><font color="'+'Green'+'">' + selectedResArr[i].ResId + '</font></h1><h2>'+ descrpApp +'</h2></center></B></label>'+imgApp+'</li>');
				//break;
			}
		}
	}
	$('#slctdResList').listview('refresh');
}

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
	//alert("chkBxShSlctnChanged");
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
/*
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
*/

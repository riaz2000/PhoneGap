var OBoxID;
var FloorNo;
var Context;
var CtrlAtomicLvl;
var allAppsSlctd = false;
var allLightsSlctd = false;
var allFansSlctd = false;
var allAreasSlctd = false;

var NoOfAppsTypes = 0;
var NoOfAreas = 0;

//var resOnFloor;		// String
var selectedResArr;	// Array
//var serviceURL;

var appliances = [];	// Array of applianceTypes
var areas = [];			// Array of areas on this floor
$('#operatefloor').live('pageshow', function(event) { //pageshow pageinit

	initializeOpFloor();
});

function initializeOpFloor(){
	OBoxID = getUrlVars()['OBoxID'];
	FloorNo = getUrlVars()['FloorNo'];
	Context = getUrlVars()['Context'];
	//resOnFloor = getUrlVars()['ResArr'];
	
	selectedResArr = [];
	
	if(Context == 1){
		//alert("Here");
		document.getElementById('BtnOpSelected').style.visibility = 'hidden';
		title = document.getElementById('pgTitle');
		title.innerHTML = "Schedule Floor Resources";
		$('dttm').val(new Date().toJSON().slice(0,19));
	}
	else{
		document.getElementById('dttm').style.visibility = 'hidden';
	}

	fillAppsList();
	fillAreasList();
}

function fillAppsList(){
	var query = "SELECT * FROM tab_appliances";// WHERE loc_lvl1="+FloorNo;
	var retObj = $.getJSON(serviceURL + 'select.php?sql='+query, function(data) {
		isneedtoKillAjax = false;
		
		appliances = data.items;
		NoOfAppsTypes = appliances.length;
		$('#AppTypesList li').remove();
		for(i=0; i<NoOfAppsTypes; i++){
			
			//linkToPage = "floor.html?OBoxID="+OBoxID+"&FloorNo="+i+"&CtrlAtmcLvl="+floors[0].ctrl_atomic_lvl;
			linkToPage = "#";

			//$('#AppTypesList').append('<li style="background-color:#FF0000;">' + '<a href="' + linkToPage + '">' + '<B><center>' + appliances[i].appliance_name + '</center></B></a></li>');
			var chkBx = '<label for="chk' + i + '"><input type="checkbox" name="chk' + i + '" id="chk'+i+'">';
			var imgApp = '<img src="imgs/apps/' + getResImg(appliances[i].nr, State.ON) +'.png";/>'
			$('#AppTypesList').append('<li>' + chkBx + '<B><center><h2><font color="purple">' + appliances[i].appliance_name + 's</font></h2></center></B></label>'+imgApp+'</li>');
		}
		$('#AppTypesList').listview('refresh');
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
	//p.push(retObj);
	
	function checkajaxkill(){

		// Check isneedtoKillAjax is true or false, 
		// if true abort the getJsonRequest

		if(isneedtoKillAjax){
			//p[i].abort();
			retObj.abort();
			alert('Timeout: Could NOT get Installation Info');                 
		}else{
			//alert('no need to kill ajax');
		}
	}
}

function fillAreasList(){
	var query = "SELECT * FROM tab_areas WHERE floor_number="+FloorNo;
	var retObj = $.getJSON(serviceURL + 'select.php?sql='+query, function(data) {
		isneedtoKillAjax = false;
		
		areas = data.items;
		NoOfAreas = areas.length;
		for(i=0; i<NoOfAreas; i++){
			
			//linkToPage = "floor.html?OBoxID="+OBoxID+"&FloorNo="+i+"&CtrlAtmcLvl="+floors[0].ctrl_atomic_lvl;
			linkToPage = "#";

			//$('#AreasList').append('<li style="background-color:#FF0000;">' + '<a href="' + linkToPage + '">' + '<B><center>' + appliances[i].appliance_name + '</center></B></a></li>');
			var chkBx = '<label for="Areachk' + i + '"><input type="checkbox" name="Areachk' + i + '" id="Areachk'+i+'">';
			var imgApp = '';//'<img src="imgs/apps/' + getResImg(appliances[i].nr, State.ON) +'.png"; width=30; height=30; />'
			$('#AreasList').append('<li style="background-color:#FF0000;">' + chkBx + '<B><center><h2><font color="teal">' + areas[i].area + '</font></h2></center></B></label>'+imgApp+'</li>');
			//$('#AreasList').append('<li style="background-color:#FF0000;">' + chkBx + areas[i].area + '</label>'+imgApp+'</li>');
		}
		$('#AreasList').listview('refresh');
	})	.success(function() { 
			//alert("second success"); 
		})
		.error(function() { 
			//alert("error"); 
		})
		.complete(function() { 
			//alert("complete"); 
			AreasOnSlctdFlrArr = areas;
		}
	);
	//setTimeout(function(){ p.abort(); alert(JSON.stringify(p)); }, 500);
	//p.push(retObj);
	
	function checkajaxkill(){

		// Check isneedtoKillAjax is true or false, 
		// if true abort the getJsonRequest

		if(isneedtoKillAjax){
			//p[i].abort();
			retObj.abort();
			alert('Timeout: Could NOT get Installation Info');                 
		}else{
			//alert('no need to kill ajax');
		}
	}
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

function OperateSelected(){
	getSelectedResrcs();
	
	if (selectedResArr.length == 0){
		myAlert('No resources selected', 3);
		return;
	}
	var operation = document.getElementById('opList').value;
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
	for(var i=0; i<appliances.length; i++){
		//alert(appNR);
		if(document.getElementById('chk'+i).checked && 
				parseInt(appliances[i].nr) == parseInt(appNR)){
			//alert("Here---" + appliances[i].nr + " : " + appNR);
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

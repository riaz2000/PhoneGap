var timeOutTimerValue = 10000;	//10 seconds
var selectedOBoxId = 0;
var serviceURL = 'http://'+localStorage.getItem('serveraddr')+'/OWL/Services/';

var applianceTypes = [];
var userInstallations = [];
var userAreas = [];
var userInstResrcs = [];		//all user resources from tab_resources
var userIndvResrcs = [];		//all user resources from tab_ur
var userResrcs = [];
var userInstDevices = [];

function updateLoggedInUser(obj){
	localStorage.setItem('LoggedInUser',JSON.stringify(obj));
}

function getAppsTypesList(OBoxID){ // This function is primarily for testing connectivity with the database
	selectedOBoxId = OBoxID;
	serviceURL = 'http://'+localStorage.getItem('serveraddr')+'/OWL/Services/';
	setTimeout(function() {
		checkajaxkill();
	}, timeOutTimerValue);
	var isneedtoKillAjax = true;
	var query = "SELECT nr, appliance_name FROM tab_appliances";
	console.log('serviceURL: ' + serviceURL + " :: " + query);
	var retObj = $.getJSON(serviceURL + 'select.php?sql='+query, function(data) {
		isneedtoKillAjax = false;
		applianceTypes = data.items;
		localStorage.setItem('applianceTypesStr', JSON.stringify(applianceTypes));

	})	.success(function() {
			//alert("second success");
		})
		.error(function() {
			//alert("error");
		})
		.complete(function() {
			//alert("complete");
			//console.log('getAppsTypesList: ' + applianceTypes.length);
			if(applianceTypes.length > 0){
				var userObj = JSON.parse(localStorage.getItem('LoggedInUser'));
				getUserInstallations(userObj.nr);
			}
			//getAreasOfFloor();
		}
	);

	function checkajaxkill(){
		if(isneedtoKillAjax){
			retObj.abort();
			alert('Timeout: Could NOT get Application List');
		}else{
			//alert('no need to kill ajax');
		}
	}
}

function getUserInstallations(userNR){
	isneedtoKillAjax = true;
	setTimeout(function() {
		checkajaxkill();
	}, timeOutTimerValue);
	var retObj = $.getJSON(serviceURL + 'getUserInsts.php?unr='+userNR, function(data) {
		isneedtoKillAjax = false;
		if(OBoxID == 0)
			userInstallations = data.items;
		else {
			userInstallations = getObjectByValue(data.items, "nr", OBoxID);
		}
		$.each(userInstallations, function(index, OBox) {

			var userObj = JSON.parse(localStorage.getItem('LoggedInUser'));
		});

	})	.success(function() {
			myAlert("getUserInstallations().success()", 5);
			//goBack();
		})
		.error(function() {
			myAlert("getUserInstallations().error()", 4);
		})
		.complete(function() {
			//alert("complete");
			//console.log('userInstallations: ' + userInstallations.length + " :: " + JSON.stringify(userInstallations));
			if(userInstallations.length > 0){
				getUserAreas();
			}
		}
	);
	function checkajaxkill(){
		if(isneedtoKillAjax){
			retObj.abort();
			alert('Timeout: getUserInstallations()');
		}else{
			//alert('no need to kill ajax');
		}
	}
}

function getUserAreas(){
	setTimeout(function() {
		checkajaxkill();
	}, timeOutTimerValue);
	var isneedtoKillAjax = true;
	var qryConditionStr = "inst_number = " + userInstallations[0].nr;
	for (i=1; i<userInstallations.length; i++){
		qryConditionStr = qryConditionStr + " || inst_number = " + userInstallations[i].nr;
	}
	var query = "SELECT nr, inst_number, floor_number, area, area_name2 FROM tab_areas WHERE " + qryConditionStr;
	//console.log(query);
	var retObj = $.getJSON(serviceURL + 'select.php?sql='+query, function(data) {
		isneedtoKillAjax = false;
		userAreas = data.items;
	})	.success(function() {
			//alert("second success");
		})
		.error(function() {
			//alert("error");
		})
		.complete(function() {
			//alert("complete");
			//console.log('getUserAreas: ' + userAreas.length);
			getuserInstResrcs();
		}
	);

	function checkajaxkill(){
		if(isneedtoKillAjax){
			retObj.abort();
			alert('Timeout: Could NOT get Areas List');
		}else{
			//alert('no need to kill ajax');
		}
	}
}

function getuserInstResrcs(){
	setTimeout(function() {
		checkajaxkill();
	}, timeOutTimerValue);
	var isneedtoKillAjax = true;
	var qryConditionStr = "inst_number = " + userInstallations[0].nr ;
	for (i=1; i<userInstallations.length; i++){
		qryConditionStr = qryConditionStr + " || inst_number = " + userInstallations[i].nr;
	}
	var query = "SELECT * FROM tab_resources WHERE " + qryConditionStr;
	//console.log(query);
	var retObj = $.getJSON(serviceURL + 'select.php?sql='+query, function(data) {
		isneedtoKillAjax = false;
		userInstResrcs = data.items;
	})	.success(function() {
			//alert("second success");
		})
		.error(function() {
			//alert("error");
		})
		.complete(function() {
			//alert("complete");
			//console.log('getuserInstResrcs: ' + userInstResrcs.length);
			getUserIndvResrcs();
		}
	);

	function checkajaxkill(){
		if(isneedtoKillAjax){
			retObj.abort();
			alert('Timeout: Could NOT get userInstResrcs List');
		}else{
			//alert('no need to kill ajax');
		}
	}
}

function getUserIndvResrcs(){
	setTimeout(function() {
		checkajaxkill();
	}, timeOutTimerValue);
	var isneedtoKillAjax = true;

	var userObj = JSON.parse(localStorage.getItem('LoggedInUser'));
	var qryConditionStr = "user_number = " + userObj.nr;

	var query = "SELECT nr, resource_number, user_number, user_control_lvl FROM tab_ur WHERE " + qryConditionStr;
	//console.log(query);
	var retObj = $.getJSON(serviceURL + 'select.php?sql='+query, function(data) {
		isneedtoKillAjax = false;
		userIndvResrcs = data.items;
	})	.success(function() {
			//alert("second success");
		})
		.error(function() {
			//alert("error");
		})
		.complete(function() {
			//alert("complete");
			//console.log('getUserIndvResrcs: ' + userIndvResrcs.length);
			getuserInstDevices();
			//saveUsrInstllations();
		}
	);

	function checkajaxkill(){
		if(isneedtoKillAjax){
			retObj.abort();
			alert('Timeout: Could NOT get getUserIndvResrcs List');
		}else{
			//alert('no need to kill ajax');
		}
	}
}

function getuserInstDevices(){
	setTimeout(function() {
		checkajaxkill();
	}, timeOutTimerValue);
	var isneedtoKillAjax = true;
	var qryConditionStr = "inst_number = " + userInstallations[0].nr ;
	for (i=1; i<userInstallations.length; i++){
		qryConditionStr = qryConditionStr + " || inst_number = " + userInstallations[i].nr;
	}
	var query = "SELECT * FROM tab_devices WHERE " + qryConditionStr;
	//console.log(query);
	var retObj = $.getJSON(serviceURL + 'select.php?sql='+query, function(data) {
		isneedtoKillAjax = false;
		userInstDevices = data.items;
		//initialize all devices ip address to be empty
		for (var j=0; j<userInstDevices.length; j++)
			userInstDevices[j].IPAddress = "";
	})	.success(function() {
			//alert("second success");
		})
		.error(function() {
			//alert("error");
		})
		.complete(function() {
			//alert("complete");
			//console.log('getuserInstResrcs: ' + userInstResrcs.length);
			saveUsrInstllations();
		}
	);

	function checkajaxkill(){
		if(isneedtoKillAjax){
			retObj.abort();
			alert('Timeout: Could NOT get getuserInstDevices List');
		}else{
			//alert('no need to kill ajax');
		}
	}
}

function saveUsrInstllations(){
	var userObj = JSON.parse(localStorage.getItem('LoggedInUser'));
	console.log('LoggedInUser: ' + localStorage.getItem('LoggedInUser'));
	for (var k=0; k<userInstallations.length; k++){
		var OBox = userInstallations[k];
		var NoOfFloors = OBox.highest_lvl - OBox.lowest_lvl + 1;

		floors = [];
		for(var j=0; j<NoOfFloors; j++){
			floorNo = parseInt(OBox.lowest_lvl)+j;
			flrRsrcs = [];
			flrRsrcs = getUsrzFloorRsrcs(OBox.nr, floorNo,
												OBox.ctrl_atomic_lvl, OBox.user_control_lvl);
			//console.log('flrRsrcs: ' + JSON.stringify(flrRsrcs));
			flrAreas = getInstFlrAreas(OBox.nr, floorNo);
			floor = {"flrNo":floorNo, "flrRsrcs":flrRsrcs, "flrAreas":flrAreas};
			floors.push(floor);
		}

		newOBoxObj = {"OBoxNo":OBox.nr, "instType":OBox.inst_type,
										"ctrlAtomicLvl":OBox.ctrl_atomic_lvl,
										"loginRqrdInside":OBox.loginRqrdInside,
										"lowestLvl":OBox.lowest_lvl, "highestLvl":OBox.highest_lvl,
										"floorNumber":OBox.floor_number, "instAddr1":OBox.address1,
										"instAddr2":OBox.address2,	"instCity":OBox.city,
										"instState":OBox.state, "instZip":OBox.zip,
										"instCountry":OBox.country,	"unr":userObj.nr,
										"ufname":userObj.fname, "ulname":userObj.lname,
										"userId":userObj.login_id, "userPwd":"",
										"uLoginLvl":OBox.user_control_lvl, "uLoginState":1,
										"instDevices":userInstDevices,
										"floors":floors};

		//console.log("newOBoxObj: " + JSON.stringify(newOBoxObj));
		OBstring = JSON.stringify(newOBoxObj);
		selectedOBoxId = newOBoxObj.OBoxNo;
		addOBox(OBstring);
	}
	goBack();	// After add/update installation goback from login page
}

function getUsrzFloorRsrcs(instNo, flrNo, ctrlAtmcLvl, usrCtrlLvl){
	var usrzFloorRsrcs = [];
	for(var i=0; i<userInstResrcs.length; i++){
		if(userInstResrcs[i].inst_number == instNo &&
				userInstResrcs[i].loc_lvl1 == flrNo){
			if(ctrlAtmcLvl == 0){
				userInstResrcs[i].usrCtrlLvlonRes = usrCtrlLvl;
				usrzFloorRsrcs.push(userInstResrcs[i]);
			}
			else if(ctrlAtmcLvl == 3){
				usrCtrlLvlOnRes = getUsrCtrlLvlOnRes(userInstResrcs[i].nr);
				if(usrCtrlLvlOnRes > 0){
					userInstResrcs[i].usrCtrlLvlonRes = usrCtrlLvlOnRes;
					usrzFloorRsrcs.push(userInstResrcs[i]);
				}
			}
		}
	}
	return usrzFloorRsrcs;
}

function getUsrCtrlLvlOnRes(resNr){
	usrNr = JSON.parse(localStorage.getItem('LoggedInUser')).nr;
	usrCtrlLvlOnRes = -1;
	objsSameResNo = getObjectByValue(userIndvResrcs, "resource_number", resNr);
	obj = getObjectByValue(objsSameResNo, "user_number", usrNr);
	if(obj.length == 1)
		usrCtrlLvlOnRes = obj[0].user_control_lvl;

	return usrCtrlLvlOnRes;
}

function getInstFlrAreas(instNo, floorNo){

	var usrzFloorAreas = [];
	areasOnSameInst = getObjectByValue(userAreas, "inst_number", instNo);
	return usrzFloorAreas = getObjectByValue(areasOnSameInst, "floor_number", floorNo);

}

function getObjectByValue(array, key, value) {
    return array.filter(function (object) {
        return object[key] == value;
    });
};
//var index = data.findIndex(obj => obj.name=="placeHolder");

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

	var newOBoxObj = JSON.parse(OBstring);
console.log('OBstring-: ' + OBstring);
	var indexOfOB = getIndexOfOBox(selectedOBoxId);//(OBox.instNo);
	if(indexOfOB > -1){
		myAlert('OWLBox No:' + selectedOBoxId + ' Already Exisit', 0);

		updateOBox(selectedOBoxId, newOBoxObj);

		return;
	}
	//localStorage.setItem('OBsLstStr',"[]");
	var addedOBs = localStorage.getItem('OBsLstStr');
	myAlert('addedOBs: '+ addedOBs, 3);
	console.log('addedOBs: '+ addedOBs);
	if(addedOBs == null){
		addedOBs = "[]";
		//alert('Here-1');
	}

	obj = JSON.parse(addedOBs);
	obj.push(newOBoxObj);

	//Now update the OBsLstStr
	localStorage.setItem('OBsLstStr',JSON.stringify(obj));

	console.log('OWLBox No:' + newOBoxObj.OBoxNo + ' Added, SUCCESSFULLY');
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

	console.log('OWLBox No:' + OBoxNo + ' Updated, SUCCESSFULLY');

}

function getResTypeName(resTypeNR){
	applianceTypesStr = localStorage.getItem('applianceTypesStr');
	applianceTypes = JSON.parse(applianceTypesStr);
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

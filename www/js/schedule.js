var OBoxID;
var FloorNo;
var Context;
var CtrlAtomicLvl;
var SlctdResArr;
//var ImgsArr = [];
//var resIdsArr = [];
//var webServer='';
var appliances = "[]";
var slctdSchedules = [];
var schedulesOfSlctdRes = [];
var allSchedules = {AllSch:[]};
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

	initSchedulePg();

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
		var myElement = document.getElementById('imgRmvSch');
		if(myElement!=null)
			myElement.style.display = 'none';

		allSchedules = {AllSch:[]};
	}

	/*resIconObj = document.getElementById('resIcon');

	resIconObj.src = "imgs/place.png";
	resIconObj.height = "50";
	resIconObj.width = "70";
	resIconObj.text = "OWLBox#";
	*/

	if(selectedResArr.length==0){//i.e. the entire floor
		for(var i=0; i<resources.length; i++){
			var newSlctdResObj = {};
			var idxOfSlctdRes = selectedResArr.findIndex(obj => obj.resId==resources[i].resource_id);
			//var slctdRes = getObjectByValue(selectedResArr, "ResId", resources[i].resource_id);
			if(idxOfSlctdRes<0){//i.e. not already in selectedResArr so add in array
			//if(slctdRes.length==0){
				newSlctdResObj.ResId = resources[i].resource_id;
				selectedResArr.push(newSlctdResObj);
			}
		}
	}

	$('#scheduleList').empty();
	$('#scheduleList').listview('refresh');
	for (var j=0; j<selectedResArr.length; j++){
		retrieveSchedules(selectedResArr[j].ResId, j);
	}

}

function retrieveSchedules(resId, slctdResIdx){
	var Resource = getObjectByValue(resources, "resource_id", resId);
	//console.log(Resource[0].nr);
	if(Resource.length<1){
		console.log('No Matching Resource');
		return;
	}
	//for(var i=0; i<Resource.length; i++){
	var resource = Resource[0];
	var fbdbref = '/Installation-' + OBoxID + '/Device-' +
									resource.device_number + '/ResSchedule';

	var fbdbResId = 'res-' + resource.device_subid;
	//console.log(fbdbResId);
	var dbref = firebase.database().ref(fbdbref).child(fbdbResId);

	dbref.once("value", function(data) {
		var rcvdSch = data.val();
		var rcvdSchArr = [];
		if(rcvdSch!=null){
			rcvdSchArr = rcvdSch.Sch;
		}
		var schObj = {};
		schObj.resId = resId;
		schObj.schArr = rcvdSchArr;
		schObj.schChgd = 0;
		allSchedules.AllSch.push(schObj);
		//schedulesOfSlctdRes = schedulesOfSlctdRes.concat(rcvdSchArr);
		for(var i=0; i<Resource.length; i++){
			resource = Resource[i];
			for(var k=0; k<rcvdSchArr.length; k++){
				var op2Perform = rcvdSchArr[k].op;
				console.log(rcvdSchArr[k].op);
				var id = '_' + resource.resource_id + '_' + slctdResIdx + '_' + k + '_' + i;
				var chkBx = '<center><label for="SchChkbx' + id +
										'"><input type="checkbox" name="SchChkbx' + id +
										'" id="SchChkbx' + id +
										//'" onchange="updateSlctdSchList(SchChkbx'+ id +')"></center>';
										'" onchange="updateSlctdSchList('+ resource.resource_id +
										', ' + slctdResIdx + ', ' + k + ', ' + i + ')"></center>';

				var sldSwInitSt = "";
				if(rcvdSchArr[k].active == 1)
					sldSwInitSt = 'checked';
				var sldSw = '<center><label class="switch"><input type="checkbox" ' +
				 						sldSwInitSt + ' id="sldrSwtch' + id +
										'" onchange="updtSchActv('+ resource.resource_id +
										', ' + slctdResIdx + ', ' + k + ', ' + i +
										')"> <span class="slider round"></span></label></center>';

				var deleteSchSpan = '<span class="ui-li-count"><img src="' +
														'img/sch_rmv.png' +
														'" height=30, width=25; onclick="dltSch(' +
														resource.resource_id + ', ' + slctdResIdx + ', ' + k +
														')"></span>';
				var imgApp ='<img src="img/apps/' +
										getResImg(resource.appliance, op2Perform) +
										'.png"; width=80px; height=80px; id="slctdResImg' + id +
										'" style="top: 25"/>'
				var heading = "";
				if(op2Perform == "0"){
					heading = '<h1><font color="black"> Turn OFF </font></h1>';
				}
				else if(op2Perform == "1"){
					heading = '<h1> <font color="red"> Turn ON </font></h1>';
				}
				else if(op2Perform == "2"){
					heading = '<h1><font color="orange"> Toggle </font></h1>';
				}
				var details = '<B><center>' + getResTypeName(resource.appliance) +
											'<font color="purple"> in ' +
											getResAreaName(resource.loc_lvl2) + '</font>' +
											'[' + resource.nr + ',' + resource.resource_id +
											'(' + resource.device_number + ':' + resource.device_subid +
											')]' + '</center></B></label><center>';
				console.log('details: ' + details);
				var eventTimeDays;
				var fromTo;
				if(parseInt(rcvdSchArr[k].noDays) == 1){//i.e. repeat once
					eventTimeDays = 'At: ' + rcvdSchArr[k].hour + ':' + rcvdSchArr[k].min + ':' + rcvdSchArr[k].sec;
					fromTo = 'On: ' + rcvdSchArr[k].day + '-' + getMonthName(rcvdSchArr[k].mon) + '-' + rcvdSchArr[k].year;
				}
				else if(parseInt(rcvdSchArr[k].noDays) == 0){//i.e. Indefinitely
					var eventDays = '-------';
					eventTimeDays = 'At: ' + rcvdSchArr[k].hour + ':' + rcvdSchArr[k].min + ':' + rcvdSchArr[k].sec +
													' Every: ' + getEventDays(rcvdSchArr[k].repeat);
					fromTo = 'From: ' + rcvdSchArr[k].day + '-' + getMonthName(rcvdSchArr[k].mon) + '-' + rcvdSchArr[k].year;
				}
				else{//i.e. Until the date
					eventTimeDays = 'At: ' + rcvdSchArr[k].hour + ':' + rcvdSchArr[k].min + ':' + rcvdSchArr[k].sec +
													' Every: ' + getEventDays(rcvdSchArr[k].repeat);

					var date1 = new Date(rcvdSchArr[k].year, rcvdSchArr[k].mon, rcvdSchArr[k].day);
					var date2 = new Date(getDateNoOfDaysAfter(date1,rcvdSchArr[k].noDays));
					//console.log('date2: '+date2.toString());
					fromTo = rcvdSchArr[k].day + '-' + getMonthName(rcvdSchArr[k].mon) + '-' + rcvdSchArr[k].year + ' to ' +
												date2.getDate() + '-' + getMonthName(date2.getMonth()) + '-' + date2.getFullYear();
				}
				var d = new Date();
				d.setDate(rcvdSchArr[k].day + rcvdSchArr[k].noDays);
				d.setMonth(rcvdSchArr[k].mon + 1 - 0);

				var schedule = '<h2>' + eventTimeDays + '</h2>' +
												'<h2>' + fromTo + '</h2>'

				$('#scheduleList').append('<li>' + imgApp + sldSw + details + heading + schedule + chkBx + deleteSchSpan);
			}
		}
		$('#scheduleList').listview('refresh');
		console.log(JSON.stringify(allSchedules));
	});
}

function addSch(){
	//document.getElementById('SchA1').href="operateFloor.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify("[]")+"&Context="+1;
	document.getElementById('SchA1').href="operateFloor.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+SlctdResArr+"&Context="+Context;
}

function addSchedule(resNR, scheduleString){
	var Resource = getObjectByValue(resources, "nr", resNR);
	if(Resource.length<1){
		console.log('No Matching Resource');
		return;
	}
	var resource = Resource[0];//resources[selctdResindexOfResInResrs];
	var fbdbref = '/Installation-' + OBoxID + '/Device-' +
									resource.device_number + '/ResSchedule';
	var fbdbResId = 'res-' + resource.device_subid;
							console.log(fbdbResId);
	var dbref = firebase.database().ref(fbdbref).child(fbdbResId);

	var rcvdSchArr = [];
	//First retrieve the schecule
	dbref.once("value", function(data) {
		var rcvdSch = data.val();
		/*console.log(rcvdSch);
		var schObj = JSON.parse(rcvdSch);
		console.log('Here-2');
		var rcvdSchArr = [];*/
		if(rcvdSch!=null){
			rcvdSchArr = rcvdSch.Sch;
		}
		//console.log('schObj.Sch' + JSON.stringify(rcvdSchArr[0]));
		rcvdSchArr.push(JSON.parse(scheduleString));
		//dbref.set(JSON.stringify({"Sch":rcvdSchArr}));
		dbref.set({"Sch":rcvdSchArr});
	});
	//dbref.set(opRqst);
}

function deleteSchConfirm(){
	navigator.notification.confirm(
		'Are you sure you want to delete the selected schedule events?',
		onConfirmDltSchEvents,              // callback to invoke with index of button pressed
		'Delete Sheduled Event: ',            // title
		'Yes,No'          // buttonLabels
	);
}

function onConfirmDltSchEvents(button){
	if(button == 1){//delete event
		deleteSch();
	}
	else{//Do nothing
	}
}

function deleteSch(){
	console.log('B4: ' + JSON.stringify(allSchedules));

	//var indexOfResInResrsArr = resources.findIndex(obj => obj.nr==resource.nr);
	//var Resource = getObjectByValue(resources, "nr", resNR);
	var sortedSlctdSchedules = slctdSchedules.sort();//sort in ascending order
	for(var i=sortedSlctdSchedules.length-1; i>-1; i--){
		console.log(i+': ' + sortedSlctdSchedules[i]);
		var result = sortedSlctdSchedules[i].split('_');
		var resId = result[0];
		var slctdResIdxInSlctdRsrcs = result[1];
		var schItemNoOfRes = result[2];

		var resSch2rmv = getObjectByValue(allSchedules.AllSch, "resId", resId);

		console.log(resSch2rmv[0]);
		resSch2rmv[0].schArr.splice(schItemNoOfRes,1);
		resSch2rmv[0].schChgd = 1;

		allSchedules.AllSch[slctdResIdxInSlctdRsrcs] = resSch2rmv[0];

	}
	console.log('After: ' + JSON.stringify(allSchedules));

	// Now get all the resources whose schedules have been changed
	var resSch2bUpdtd = getObjectByValue(allSchedules.AllSch, "schChgd", 1);

	for(var j=0; j<resSch2bUpdtd.length; j++){
		var Resource = getObjectByValue(resources, "resource_id", resSch2bUpdtd[j].resId);
		if(Resource.length<1){
			console.log('No Matching Resource');
			//return;
		}
		else{
			var resource = Resource[0];//resources[selctdResindexOfResInResrs];
			var fbdbref = '/Installation-' + OBoxID + '/Device-' +
											resource.device_number + '/ResSchedule';
			var fbdbResId = 'res-' + resource.device_subid;
									console.log(fbdbResId);
			var dbref = firebase.database().ref(fbdbref).child(fbdbResId);

			dbref.set({"Sch":resSch2bUpdtd[j].schArr});

		}
	}
	initSchedulePg();
}

function updateSlctdSchList(resId, slctdResIdx, listItemNo, listSubItem){
	var Resource = getObjectByValue(resources, "resource_id", resId);
	if(Resource.length<1){
		console.log('No Matching Resource');
		return;
	}

	if (document.getElementById('SchChkbx_'+resId+'_'+slctdResIdx+'_'+
				listItemNo+'_'+listSubItem).checked){
		slctdSchedules.push(resId+'_'+slctdResIdx+'_'+listItemNo);

		for(var i=0; i<Resource.length; i++){
			document.getElementById('SchChkbx_'+resId+'_'+slctdResIdx+'_'+
																	listItemNo+'_'+i).checked = true;
		}
		//console.log('Added: ' + resId+'_'+listItemNo);
	}
	else{
		var index = slctdSchedules.indexOf(resId+'_'+slctdResIdx+'_'+listItemNo);
		if(index > -1){
			slctdSchedules.splice(index, 1);
			//console.log('Removed: ' + resId+'_'+listItemNo);
		}
		for(var i=0; i<Resource.length; i++){
			document.getElementById('SchChkbx_'+resId+'_'+slctdResIdx+'_'+
																	listItemNo+'_'+i).checked = false;
		}
	}
	if(slctdSchedules.length > 0){
		//enable delete button
		document.getElementById('imgRmvSch').style.display = 'block';
	}
	else{
		//disable delete button
		document.getElementById('imgRmvSch').style.display = 'none';
	}
	for(var i=0; i<slctdSchedules.length; i++){
		console.log(i+': ' + slctdSchedules[i]);
	}
	//slctdSchedules
}

function updtSchActv(resId, slctdResIdx, listItemNo, listSubItem){
	var Resource = getObjectByValue(resources, "resource_id", resId);
	if(Resource.length<1){
		console.log('No Matching Resource');
		return;
	}
	var resource = Resource[0];
	var fbdbref = '/Installation-' + resource.inst_number + '/Device-' +
									resource.device_number + '/ResSchedule/' +
									'res-' + resource.device_subid + '/Sch/' + listItemNo;
	var fbdbResId = 'active';

	var dbref = firebase.database().ref(fbdbref).child(fbdbResId);


	if (document.getElementById('sldrSwtch_'+resId+'_'+slctdResIdx+'_'+
															listItemNo+'_'+listSubItem).checked){
		dbref.set(1);
		for(var i=0; i<Resource.length; i++){
			document.getElementById('sldrSwtch_'+resId+'_'+slctdResIdx+'_'+
																	listItemNo+'_'+i).checked = true;
		}
	}
	else{
		dbref.set(0);
		for(var i=0; i<Resource.length; i++){
			document.getElementById('sldrSwtch_'+resId+'_'+slctdResIdx+'_'+
																	listItemNo+'_'+i).checked = false;
		}
	}
}

var thisResId;
var thisSlctdResIdx;
var thisListItemNo;
function dltSch(resId, slctdResIdx, listItemNo){
	thisResId = resId;
	thisSlctdResIdx = slctdResIdx;
	thisListItemNo = listItemNo;
	navigator.notification.confirm(
		'Are you sure you want to delete this schedule event?',
		onConfirmDltSchEvent,              // callback to invoke with index of button pressed
		'Delete Sheduled Event: ',            // title
		'Yes,No'          // buttonLabels
	);
}

function onConfirmDltSchEvent(button){
	if(button == 1){//delete event
		slctdSchedules = [];
		slctdSchedules.push(thisResId+'_'+thisSlctdResIdx+'_'+thisListItemNo);
		deleteSch();
		slctdSchedules = [];
	}
	else{//Do nothing
	}
}

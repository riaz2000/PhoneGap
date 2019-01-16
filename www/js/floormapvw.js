var OBoxID;
var FloorNo;
var CtrlAtomicLvl;
var resources = [];
var selectedResArr = [];
var FloorInMode;
var vis = 0;
var selctdResindexOfResInResrs = -1;

var applianceTypes = [];

var areas = [];
var resources = [];
var devices = [];
var selectedResArr = [];
//var devicesOfThisInst = [];

$('#floormapvw').live('pageshow', function(event) { //pageshow pageinit
	//state = 0;
	FloorInMode = FloorMode.OPERATION;
	selectedResArr = [];
	OBoxID = getUrlVars()['OBoxID'];
	FloorNo = getUrlVars()['FloorNo'];
	CtrlAtomicLvl = getUrlVars()['CtrlAtmcLvl'];

	webServer = 'http://'+localStorage.getItem('serveraddr')+'/OWL/Services/';

	getFloorInfo();

	//if(WiFi is UP But Internet is DOWN) //Will be implemented after AWS success
	discoverDevices();
});

function getFloorInfo(){
	oboxObjStr = getOBoxObjstr(OBoxID);

	document.getElementById('popupMen1').style.visibility = 'hidden';

	if(oboxObjStr == "InvalidOBox"){
		myAlert("OBox Not Registered",1);
		return;
	}
	else{
		OBox = JSON.parse(oboxObjStr);
		title = document.getElementById('pgTitle');
		title.innerHTML = OBox.userId + "@Floor:" + FloorNo + " of OB" + OBox.OBoxNo;
	}

	myObj = document.getElementById('floorObj');

	myObj.data = webServer+"getFloorPlan.php?InstallationNo=" + OBoxID + "&FloorNo="+FloorNo;

	myObj.style="margin: 0px 0px 0px 0px; "; //top bottom right left

	//registerOUser();
	addActionIcons();

	applianceTypes = JSON.parse( localStorage.getItem('applianceTypesStr') );
	//getAppsList();

	areas = getAreasOnFloor(OBoxID, FloorNo);

	devices = getDevicesOfInst(OBoxID);
	//console.log('devices: ' + JSON.stringify(devices));
	resources = getRsrcsOnFloor(OBoxID, FloorNo);
	//console.log('resources: ' + JSON.stringify(resources));

	addFlrResources();

	document.getElementById('popupMenuA').style.visibility = 'hidden';
	document.getElementById('popupMenuB').style.visibility = 'hidden';
}

function addFlrResources(){
	if(resources.length == 0){
		myAlert("No Registered Appliances on This Floor", 0);
	}
	else{
		for(var i=0; i<resources.length ; i++){
			addResource(resources[i]);
		}
	}
	//console.log('RsrcsOnSlctdFlrArr:: ' + JSON.stringify(RsrcsOnSlctdFlrArr));

	getStatusofFlrRsrcs();

	document.getElementById('ahrefFlrOpMenuA').href="operateFloor.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify("[]")+"&Context="+0; // Operate
	//document.getElementById('ahrefFlrSchMenuA').href="operateFloor.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify("[]")+"&Context="+1; // Shedule
	document.getElementById('ahrefFlrSchMenuA').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify("[]")+"&Context="+1; // Shedule

	document.getElementById('ahrefFlrOpMenuB').href="operateFloor.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify("[]")+"&Context="+0;  // Operate
	//document.getElementById('ahrefFlrSchMenuB').href="operateFloor.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify("[]")+"&Context="+1; // Shedule
	document.getElementById('ahrefFlrSchMenuB').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify("[]")+"&Context="+1; // Shedule
}


function addActionIcons(){
	var linkTo = "schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo;//+"&ResId="+resId;
}


function addResource(resource){
	var indexOfResInResrs = -1;
	indexOfResInResrs = resources.findIndex(obj => obj.nr==resource.nr);

	resources[indexOfResInResrs].usrCtrlLvlonRes = resource.usrCtrlLvlonRes;
	if(parseInt(resource.usrCtrlLvlonRes)<1)
		return;

	posX = parseInt(resource.pos_x);//*value/16;
	posY = parseInt(resource.pos_y);// + 600;

	var newImg = new Image();
	newImg.id = "img:"+indexOfResInResrs;
	//var div = document.getElementById('top');
	var newDiv = document.createElement('div');
	//var div = document.getElementById('top1');
	//var div = new Division();
	document.getElementById('floormapvw').appendChild(newDiv);
	newDiv.id = "div:"+indexOfResInResrs;
	//document.body.appendChild(div);
	//newDiv.style="position: absolute; left:"+posX+"px; top:"+posY+"px;";
	newImg.onload = function() {
	  newDiv.appendChild(newImg);
	};
	//resources[indexOfResInResrs].img = img1;
	//resources[indexOfResInResrs].div = newDiv;

	newImg.src = 'img/apps/' + getResImg(resource.appliance, State.UK)+ ".png";
	newImg.height=60;
	newImg.width=60;

	addListeners(newDiv, newImg, resource.resource_id, indexOfResInResrs);
	//addListeners(indexOfResInResrs);

	newDiv.style.position="absolute";
	newDiv.style.left=posX+"px";
	newDiv.style.top=posY+"px";
}

function onConfirm1(buttonIndex) {
	alert('You selected button ' + buttonIndex);
}

function onPrompt1(results) {
	alert("You selected button number " + results.buttonIndex + " and entered " + results.input1);
}

function addListeners(mDiv, mImg, mResId, indexOfResInResrs){
	var lbl_slct = document.createElement("Label");
	lbl_slct.id = "lbl_slct:"+indexOfResInResrs;
	lbl_slct.style.color = "green";
	mDiv.appendChild(lbl_slct);
	lbl_slct.style.position="absolute";
	lbl_slct.style.left="0px";
	lbl_slct.style.top="0px";

	var lbl_resId = document.createElement("Label");
	lbl_resId.id = "lbl_resId:"+indexOfResInResrs;
	lbl_resId.style.color = "blue";
	lbl_resId.innerHTML = mResId;
	mDiv.appendChild(lbl_resId);
	lbl_resId.style.position="absolute";
	lbl_resId.style.left="0px";//lbl_resId.style.left="30%";
	lbl_resId.style.top="20px";//lbl_resId.style.bottom="50%";

	var lbl_reqStatus = document.createElement("Label");
	lbl_reqStatus.id = "lbl_reqStatus:"+indexOfResInResrs;
	lbl_reqStatus.style.color = "blue";
	lbl_reqStatus.style.fontWeight = "bold";
	lbl_reqStatus.innerHTML = "&#9728";	//"&#9786";//"&#9728" light	// Toggle: 9775 // &#9786 smiley
	mDiv.appendChild(lbl_reqStatus);
	lbl_reqStatus.style.position="absolute";
	lbl_reqStatus.style.left="0px";
	lbl_reqStatus.style.top="35px";

	$$(mImg).doubleTap(function(e) {
		getStatus();
	});

	$$(mImg).swipeUp(function(e) {
		turnON();
	});

	$$(mImg).swipeDown(function(e) {
		turnOFF();
	});

	$$(mImg).swipeLeft(function(e) {
		//alert(e.pageX);
		alert("EventQuo: swipeLeft");

	});

	$$(mImg).swipeRight(function(e) {
	  //alert(e.pageX);
	  alert("EventQuo: swipeRight");
	});

	$$(mImg).hold(function(e) {//
		//alert("EventQuo: hold");
		//FloorInMode = FloorMode.OPERATION;
		openMenu(indexOfResInResrs);

	});

	$$(mImg).tap(function(e) {
		//alert("EventQuo: tap " + mResId);
		if(FloorInMode == FloorMode.OPERATION){
		//sendRequest2OBox(MsgType, Msg, ResOpPairs, Schedule, isRegSoc){ //RegSock Remains Open
			MsgType = MessageType.REQUEST;
			Msg = Message.DO_NOT_CARE;
			//ResOpPairs = mResId + ":" + Operation.TOGGLE_STATE + ":";
			ResIdArr = [mResId];
			OpArr = [Operation.TOGGLE_STATE];
			Schedule = [];
			isRegSoc = false;

			sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, isRegSoc);

			for (var i=0 ; i<resources.length ; i++){
				if (resources[i].resource_id == mResId) {
					var m_lbl_reqStatus = document.getElementById("lbl_reqStatus:"+i);
					m_lbl_reqStatus.innerHTML = "&#9728";
					m_lbl_reqStatus.style.color = "orange";

					var m_div = document.getElementById('div:'+i);
					m_div.style.position = "absolute";
					m_div.style.left = resources[i].pos_x+"px";
					m_div.style.top  = resources[i].pos_y+"px";

					//document.getElementById('div:'+i).style="position: absolute; left:"+resources[i].pos_x+"px; top:"+resources[i].pos_y+"px;";
				}
			}

			//mImg.style="background-color:transparent";
		}
		else if(FloorInMode == FloorMode.SELECTION){
			var isResSlctd =  false;
			for(var j=0; j<selectedResArr.length; j++){
				if(selectedResArr[j].ResId == mResId){// i.e. already selected, so unselect it and remove from selectedResArr
					selectedResArr.splice(j,1);
					isResSlctd = true;
					if(selectedResArr.length == 0){
						setModeOp();
					}
					for(var i=0; i<resources.length; i++){
						if(resources[i].resource_id == mResId){
							document.getElementById("lbl_slct:"+i).innerHTML = "";
						}
					}
				}
			}
			if(!isResSlctd){// so select
				var selectedRes = {ResId:mResId};
				selectedResArr.push(selectedRes);
				for(var i=0; i<resources.length; i++){
					if(resources[i].resource_id == mResId)
						document.getElementById("lbl_slct:"+i).innerHTML = "&#10004";
				}
			}
			document.getElementById('ahrefSchMenuB').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify(selectedResArr)+"&Context="+1;
			document.getElementById('ahrefSchMenu1').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify(selectedResArr)+"&Context="+1;

		}
	});
}

function handleResponse(rcvdMsg){
	owlMsg = parseOwlMessage(rcvdMsg);
	//myAlert("MsgType:Msg " + owlMsg.msgType+":"+owlMsg.message,3);
	if(parseInt(owlMsg.instIdOrSocStrg) != OBoxID){
		myAlert("Message from Invalid OBox: " + parseInt(owlMsg.instIdOrSocStrg), 0);
		return;
	}

	if(owlMsg.msgType == MessageType.REGISTRATION){
		if(owlMsg.message == Message.SUCCESSFUL)
			myAlert("Registration Successful ",0);
	}
	else if(owlMsg.msgType == MessageType.RESPONSE){
		if(owlMsg.Message == Message.SCHEDULE_RETURN){
			// Pass onto schedule.js  function displaySch()
			displaySch(rcvdMsg);
		}
		else{
			//alert('owlMsg.resourceID.length1 ' + owlMsg.resourceID.length);
			for(var i=0; i<owlMsg.resourceID.length; i++){
				state = State.UK;
				//alert("ResId:Operation::"+owlMsg.resourceID+":"+parseInt(owlMsg.operation[i]));
				switch(parseInt(owlMsg.operation[i])){
					case Operation.TURN_OFF:
						state = State.OFF;
						break;
					case Operation.TURN_ON:
						state = State.ON;
						break;
					case Operation.RES_NOT_RECOGNIZED:
						state = State.UK;
						break;
					case Operation.RES_NOT_REACHABLE:
						state = State.UR;
						break;
					default:
						state = State.UR;
				}

				updateResIcon(owlMsg.resourceID[i], state);
			}
		}
	}
	else if(owlMsg.msgType == MessageType.UPDATE){ // Update from the OwlSwitch

	}
	else if(owlMsg.msgType == MessageType.CONNECTIVITY){

	}
}

var hImgText;
function openMenu(indexOfResInResrs){

	selctdResindexOfResInResrs = indexOfResInResrs;
	//document.getElementById('popMhChsAct').style.visibility = 'hidden';

	var m_div = document.getElementById('div:'+selctdResindexOfResInResrs);
	var rect = m_div.getBoundingClientRect();
	console.log(rect.top, rect.right, rect.bottom, rect.left);

	var hText;
	if(FloorInMode == FloorMode.OPERATION){
		hText = "Select an option ...";
	}
	else if(FloorInMode == FloorMode.SELECTION){
		hText = "All Selected ...";
	}
	document.getElementById('popMhChsAct').innerHTML = hText; //"ResID: "+resources[indexOfResInResrs].resource_id;

	var hImg = document.getElementById('lvHdrImg');
	if(parseInt(indexOfResInResrs)<0){
		hImg.style.visibility = "hidden";
	}
	else{
		hImg.src = 'img/apps/' + getResImg(resources[indexOfResInResrs].appliance, State.UK)+ ".png";
		hImg.height=50;
		hImg.width=50;

		if(hImgText == undefined)
			hImgText = document.createElement("Label");
		hImgText.id = "hImgText:"+indexOfResInResrs;
		hImgText.style.color = "blue";
		hImgText.innerHTML = resources[indexOfResInResrs].resource_id;
		document.getElementById('ulHdr').appendChild(hImgText);
		hImgText.style.position="absolute";
		hImgText.style.left="1%";//lbl_resId.style.left="30%";
		hImgText.style.top="3%";
		hImgText.style.fontSize = "16px";
		hImgText.style.fontWeight = 'bold';
	}


	if(FloorInMode == FloorMode.OPERATION){
		//document.getElementById('popMliSelRes').innerHTML="Select";
		document.getElementById('popMSelRes').style.fontSize = "16px";
		document.getElementById('popMSelRes').style.fontWeight = 'bold';
		document.getElementById('popMSelRes').innerHTML = "&#10004  Select";

	}else if(FloorInMode == FloorMode.SELECTION){
		document.getElementById('popMSelRes').innerHTML = "&#10006 Unselect";
		document.getElementById('popMSelRes').style.fontSize = "16px";
		document.getElementById('popMSelRes').style.fontWeight = 'bold';
	}
	document.getElementById('popupMen1').style.visibility = 'visible';
	//var rect = element.getBoundingClientRect();
	//console.log(rect.top, rect.right, rect.bottom, rect.left);

	document.getElementById('popupMen1').style.zIndex = "1";
	if(parseInt(indexOfResInResrs)>-1){
		rect = document.getElementById('img:'+indexOfResInResrs).getBoundingClientRect();
		document.getElementById('img:'+indexOfResInResrs).style = "background-color:#F9E79F";
	}
	document.getElementById('popupMen1').style.position="fixed";

	//scrollPos = document.getElementById('floormapvw').scrollTop;
	//document.getElementById('popupMen1').style.left=(parseInt(rect.left) + (parseInt(rect.right)-parseInt(rect.left))/2)+"px";
	document.getElementById('popupMen1').style.left=rect.left+"px";//"30%";
	//document.getElementById('popupMen1').style.top=(parseInt(rect.bottom) - parseInt(scrollPos) - (parseInt(rect.bottom)-parseInt(rect.top))/2)+"px";
	//document.getElementById('popupMen1').style.top=(parseInt(rect.bottom) - (parseInt(rect.bottom)-parseInt(rect.top))/2)+"px";
	document.getElementById('popupMen1').style.top = rect.top+"px";//"20px";
	//alert("rect.bottom="+rect.bottom+" :: scrollPos="+scrollPos);

}

function closeMenu(){
	document.getElementById('popupMen1').style.visibility = 'hidden';
	for (var i=0 ; i<resources.length ; i++){
		//document.getElementById('img:'+selctdResindexOfResInResrs).style = "background-color:transparent";
		document.getElementById('img:'+i).style = "background-color:transparent";
	}
}

function selectRes(){
	//alert("Here-1");
	if(FloorInMode == FloorMode.SELECTION){//i.e.User gets the UnselectAll Option
		//alert("Here-2a");
		//clearSelection();
		setModeOp();
	}
	else if (FloorInMode == FloorMode.OPERATION){//i.e. User gets Select Res Option
		//alert("Here-2b");
		setModeSel();
		var mResId = resources[selctdResindexOfResInResrs].resource_id;
		var selectedRes = {ResId:mResId};
		selectedResArr.push(selectedRes);

		//state = 1;
		//FloorInMode = FloorMode.SELECTION;

		//document.getElementById('footerLstImg').src='img/test/release1.jpg';
		//document.getElementById('footerOpImg').style.visibility = 'visible';
		//document.getElementById('footerSchImg').style.visibility = 'visible';


		//alert(JSON.stringify(selectedResArr));
		for(var i=0; i<resources.length; i++){
			if(resources[i].resource_id == mResId)
				document.getElementById("lbl_slct:"+i).innerHTML = "&#10004";
		}

		document.getElementById('ahrefSchMenuB').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify(selectedResArr)+"&Context="+1;


		document.getElementById('ahrefSchMenu1').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify(selectedResArr)+"&Context="+1;

	}
	closeMenu();
	closeOptionMenu();
}

/*
function addRes2selctdRsrcs(){
	//Add this resource among selected resources if not already selected
	if(selctdResindexOfResInResrs == -1)
		return;
	var isResSlctd =  false;
	for(var j=0; j<selectedResArr.length; j++){
		if(selectedResArr[j].ResId == resources[selctdResindexOfResInResrs].resource_id){// i.e. already selected, so no need to reslect
			isResSlctd = true;
		}
	}
	if(!isResSlctd){// not already selected, so select it
		var selectedRes = {ResId:resources[selctdResindexOfResInResrs].resource_id};
		selectedResArr.push(selectedRes);

		for(var i=0; i<resources.length; i++){
			if(resources[i].resource_id == resources[selctdResindexOfResInResrs].resource_id){
				document.getElementById("lbl_slct:"+i).innerHTML = "&#10004";
			}
		}
	}
}
*/

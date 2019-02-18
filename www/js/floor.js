function initializeFirebase(){
	console.log('firebaseInitialized::: ' + firebaseInitialized);
	if(firebaseInitialized==0){
		var config = {
				apiKey: "AIzaSyB3NiPBR8YEOoTl6GTjMJvukexE86cELoI",
				authDomain: "owltest-8b3c8.firebaseapp.com",
				databaseURL: "https://owltest-8b3c8.firebaseio.com",
				projectId: "owltest-8b3c8",
				storageBucket: "",
				messagingSenderId: "244059420939"
			};
		firebase.initializeApp(config);
		firebaseInitialized = 1;
		console.log('Firebase Initialized');
	}
}

function getAreasOnFloor(OBoxID, FloorNo){
	var OBox;
	oboxObjStr = getOBoxObjstr(OBoxID);
	if(oboxObjStr == "InvalidOBox"){
		myAlert("OBox Not Registered",1);
		console.log("OBox Not Registered");
		return areas = [];
	}
	else{
		OBox = JSON.parse(oboxObjStr);
		var slctdFlrObj = getObjectByValue(OBox.floors, "flrNo", FloorNo);
		return areas = slctdFlrObj[0].flrAreas;
	}
}

function getDevicesOfInst(OBoxID){
	var OBox;
	oboxObjStr = getOBoxObjstr(OBoxID);
	if(oboxObjStr == "InvalidOBox"){
		myAlert("OBox Not Registered",1);
		console.log("OBox Not Registered");
		return devices = [];
	}
	else{
		OBox = JSON.parse(oboxObjStr);
		//console.log("OBox: " + JSON.stringify(OBox));
		return devices = OBox.instDevices;
	}
}

function getRsrcsOnFloor(OBoxID, FloorNo){
	var OBox;
	oboxObjStr = getOBoxObjstr(OBoxID);
	if(oboxObjStr == "InvalidOBox"){
		myAlert("OBox Not Registered",1);
		console.log("OBox Not Registered");
		return resources = [];
	}
	else{
		OBox = JSON.parse(oboxObjStr);
		//console.log('OBox:: ' + JSON.stringify(OBox));
		var slctdFlrObj = getObjectByValue(OBox.floors, "flrNo", FloorNo);
		//console.log('slctdFlrObj:: ' + JSON.stringify(slctdFlrObj));
		return resources = slctdFlrObj[0].flrRsrcs;
	}
}

/*
function getStatusofFlrRsrcs(){
	alert('getStatusofFlrRsrcs() ToBimplemented');
}
*/

function sendMsgOnWS(wsUri, msgName, argsString){
	var received_msg;
	if ("WebSocket" in window) {
		console.log(wsUri);
		let ws = new WebSocket(wsUri);

		ws.onopen = function() {

		ws.send(JSON.stringify({
          MsgType: msgName,		//DeviceInfo will return device_id and installationID
          args: //{
			  argsString
          //}
        }));
    };

    ws.onmessage = function (evt) {
      received_msg = evt.data;
      console.log(received_msg);
			alert(wsUri + ": " + received_msg);
			handleRPCresponce(received_msg);
    };

    ws.onclose = function() {
			return received_msg;
      // websocket is closed.
      //alert("Connection is closed...");
    };
  } else {
    // The browser doesn't support WebSocket
    alert("WebSocket NOT supported by your Browser!");
  }
}

function handleRPCresponce(rcvdMsg){
	console.log("MsgRcvd: " + rcvdMsg);
	var rcvdMsgObj = JSON.parse(rcvdMsg);
	if(rcvdMsgObj.MsgType == "DeviceInfo"){
		console.log('InstID: ' + rcvdMsgObj.Result[0].InstID);
		console.log('DevID: ' + rcvdMsgObj.Result[0].DevID);
		console.log('IPAddress: ' + rcvdMsgObj.Result[0].IPAddress);
		//return rcvdMsg;//JSON.stringify(rcvdMsgObj);
		var index = discoveredDevices.findIndex(obj => obj.DevID==rcvdMsgObj.Result[0].DevID);
		var myDev = {"InstID":rcvdMsgObj.Result[0].InstID,
									"DevID":rcvdMsgObj.Result[0].DevID,
									"IPAddress":rcvdMsgObj.Result[0].IPAddress};
		if(index<0){
			discoveredDevices.push(myDev);
		}
		else {
			discoveredDevices[index] = myDev;
		}
		//usrzFloorAreas = getObjectByValue(areasOnSameInst, "floor_number", floorNo);

	}
	else if(rcvdMsg.MsgType == "ResourceAction"){

	}
	else if(rcvdMsg.MsgType == "AddSchedule"){

	}
	else if(rcvdMsg.MsgType == "RemSchedule"){

	}
	else if(rcvdMsg.MsgType == "QuerySchedule"){

	}
}

function turnOFF(){
	if(FloorInMode == FloorMode.OPERATION || selectedResArr.length==0){
		var selectedRes = {ResId:resources[selctdResindexOfResInResrs].resource_id};
		selectedResArr = [];
		selectedResArr.push(selectedRes);
	}
	for(j=0; j<selectedResArr.length; j++){
		selctdResindexOfResInResrs = resources.findIndex(obj => obj.resource_id==selectedResArr[j].ResId);
		var resNR = resources[selctdResindexOfResInResrs].nr;
		var resId = resources[selctdResindexOfResInResrs].resource_id;
		var opRqst = Operation.TURN_OFF;
		updateLblReqSt(resId, opRqst);

		if(firebaseInitialized == 1){
			sendRequest2fbdb(resNR, opRqst);
		}
		else if(internetStatus==0 && connType=="WiFi"){
			// send request using WS if internet is down but the resource is available
			// on WLAN
			sendRequest2WS(resNR, opRqst);
		}
		else{
			myAlert("Your Request Can NOT Be Forwarded", 1);
		}
	}
	closeMenu();
	closeOptionMenu();
}

function turnON(){
	if(FloorInMode == FloorMode.OPERATION || selectedResArr.length==0){
		var selectedRes = {ResId:resources[selctdResindexOfResInResrs].resource_id};
		selectedResArr = [];
		selectedResArr.push(selectedRes);
	}
	for(j=0; j<selectedResArr.length; j++){
		selctdResindexOfResInResrs = resources.findIndex(obj => obj.resource_id==selectedResArr[j].ResId);
		var resNR = resources[selctdResindexOfResInResrs].nr;
		var resId = resources[selctdResindexOfResInResrs].resource_id;
		var opRqst = Operation.TURN_ON;
		updateLblReqSt(resId, opRqst);

		if(firebaseInitialized == 1){
			sendRequest2fbdb(resNR, opRqst);
		}
		else if(internetStatus==0 && connType=="WiFi"){
			// send request using WS if internet is down but the resource is available
			// on WLAN
			sendRequest2WS(resNR, opRqst);
		}
		else{
			myAlert("Your Request Can NOT Be Forwarded", 1);
		}
	}
	closeMenu();
	closeOptionMenu();
}

function Toggle(){
	if(FloorInMode == FloorMode.OPERATION || selectedResArr.length==0){
		var selectedRes = {ResId:resources[selctdResindexOfResInResrs].resource_id};
		selectedResArr = [];
		selectedResArr.push(selectedRes);
	}
	for(j=0; j<selectedResArr.length; j++){
		selctdResindexOfResInResrs = resources.findIndex(obj => obj.resource_id==selectedResArr[j].ResId);
		var resNR = resources[selctdResindexOfResInResrs].nr;
		var resId = resources[selctdResindexOfResInResrs].resource_id;
		var opRqst = Operation.TOGGLE_STATE;
		updateLblReqSt(resId, opRqst);

		if(firebaseInitialized == 1){
			sendRequest2fbdb(resNR, opRqst);
		}
		else if(internetStatus==0 && connType=="WiFi"){
			// send request using WS if internet is down but the resource is available
			// on WLAN
			sendRequest2WS(resNR, opRqst);
		}
		else{
			myAlert("Your Request Can NOT Be Forwarded", 1);
		}
	}
	closeMenu();
	closeOptionMenu();
}

function getStatus(){
	//console.log('getStatus()');
	if(FloorInMode == FloorMode.OPERATION || selectedResArr.length==0){
		var selectedRes = {ResId:resources[selctdResindexOfResInResrs].resource_id};
		selectedResArr = [];
		selectedResArr.push(selectedRes);
	}
	for(j=0; j<selectedResArr.length; j++){
		selctdResindexOfResInResrs = resources.findIndex(obj => obj.resource_id==selectedResArr[j].ResId);
		var resNR = resources[selctdResindexOfResInResrs].nr;
		var resId = resources[selctdResindexOfResInResrs].resource_id;
		var opRqst = Operation.RETURN_STATE;
		updateLblReqSt(resId, opRqst);

		if(firebaseInitialized == 1){
			sendRequest2fbdb(resNR, opRqst);
		}
		else if(internetStatus==0 && connType=="WiFi"){
			// send request using WS if internet is down but the resource is available
			// on WLAN
			sendRequest2WS(resNR, opRqst);
		}
		else{
			myAlert("Your Request Can NOT Be Forwarded", 1);
		}
	}
	closeMenu();
	closeOptionMenu();
}

function sendRequest2fbdb(resNR, opRqst){ //firebase database
	var Resource = getObjectByValue(resources, "nr", resNR);
	if(Resource.length<1){
		console.log('No Matching Resource');
		return;
	}

	var resource = Resource[0];//resources[selctdResindexOfResInResrs];
	if(resource.device_number==null || resource.device_subid==null){
		alert('Invalid Device Number or SubID');
		return;
	}
	var fbdbref = '/Installation-' + OBoxID + '/Device-' +
									resource.device_number + '/ResConfig';
	var fbdbResId = 'res-' + resource.device_subid;
							console.log(fbdbResId);
	var dbref = firebase.database().ref(fbdbref).child(fbdbResId);

	dbref.set(opRqst);
}

function sendRequest2WS(resNR, opRqst){
	var Resource = getObjectByValue(resources, "nr", resNR);
	if(Resource.length<1){
		console.log('No Matching Resource');
		return;
	}
	var resource = Resource[0];
	if(resource.device_number==null || resource.device_subid==null){
		alert('Invalid Device Number or SubID');
		return;
	}
	var resSubId = resource.device_subid;
	//var opRqst = Operation.TURN_OFF;
	//var resDeviceIP = getDeviceIP(resource.device_number);
	var resDeviceIP = getDevIPfrmDiscvrdDevOnWLAN(resource.device_number);

	if(resDeviceIP == ""){
		console.log('Resource Not Reachable On WLAN');
		return;
	}
	//var wsUri = 'ws://' + resDeviceIP +'/rpc';
	var wsUri = 'ws://' + resDeviceIP;
	var MsgName = "ResourceAction";
	var argsString = {"res": resSubId, "op": opRqst};
	sendMsgOnWS(wsUri, MsgName, argsString);

}

function getRsrcsOnDevices(devID){
	alert('getRsrcsOnDevices() ToBimplemented: ');
}

function getDeviceInfo(){
	alert('getDeviceInfo() ToBimplemented: ');
}

function discoverDevices(){
	closeOptionMenu();
	discoveredDevices = [];
	networkinterface.getWiFiIPAddress(function (ip) {
		//alert('WiFi-IP = ' + ip);
		WifiIPaddr = ip;

		IPoctts = WifiIPaddr.split('.');
		for (var i = 1; i < 255; i++) {
			//alert('startIPoctt[3]+count: '+startIPoctt[3]+count);
			ipPrefix = IPoctts[0] + '.' + IPoctts[1] + '.' + IPoctts[2] + '.';
			//var wsUri = 'ws://' + ipPrefix + i +'/rpc';
			var wsUri = 'ws://' + ipPrefix + i;
			var MsgType = "DeviceInfo";
			var argsString = {};
			sendMsgOnWS(wsUri, MsgType, argsString);
		}
	});
}

function showDicvrdRes(){
	closeOptionMenu();
	console.log('Discovered Devices: ' + JSON.stringify(discoveredDevices));
	console.log('Installation Devices: ' + JSON.stringify(devices));
}

function getDeviceIP(resDevNo){
	console.log('resDevNo: ' + resDevNo);
	var myDev = getObjectByValue(devices, "nr", resDevNo);
	console.log('myDev: ' + JSON.stringify(myDev));
	if(myDev.length<1){
		console.log('function getDeviceIP: No Matching Device Number');
		return "";
	}

	var myDscvrdDev = getObjectByValue(discoveredDevices, "DevID", myDev[0].device_id);
	console.log('myDscvrdDev: ' + JSON.stringify(myDscvrdDev));
	if(myDscvrdDev.length<1){
		console.log('function getDeviceIP: No Matching Discoverd Device');
		return "";
	}
	return myDscvrdDev[0].IPAddress;
}

function getDevIPfrmDiscvrdDevOnWLAN(resDevNo){
	/*console.log('resDevNo: ' + resDevNo);
	var myDev = getObjectByValue(devices, "nr", resDevNo);
	console.log('myDev: ' + JSON.stringify(myDev));
	if(myDev.length<1){
		console.log('function getDeviceIP: No Matching Device Number');
		return "";
	}*/

	var myDscvrdDev = getObjectByValue(discoveredDevices, "DevID", "Device-"+resDevNo);

	console.log('myDscvrdDev: ' + JSON.stringify(myDscvrdDev));
	if(myDscvrdDev.length<1){
		console.log('function getDeviceIP: No Matching Discoverd Device');
		return "";
	}
	else if(myDscvrdDev[0].InstID == "Installation-"+OBoxID){
		return myDscvrdDev[0].IPAddress;
	}
	else{
		return "";
	}
}

function updateLblReqSt(ResID, newStatus){
	var appsOnSameRes = getObjectByValue(resources, "resource_id", ResID);

	for(var j=0; j<appsOnSameRes.length; j++){
		//we want all appliances associated with the resource to be operated
		var resIndex = resources.findIndex(obj => obj.nr==appsOnSameRes[j].nr);
		var myElement = document.getElementById("lbl_reqStatus:"+resIndex);
		if(myElement!=null){
			myElement.innerHTML = "&#9728";
			var color="";
			switch(newStatus) {
	    case Operation.TURN_OFF:
	      color = "black";
	      break;
			case Operation.TURN_ON:
				color = "red";
				break;
			case Operation.TOGGLE_STATE:
				color = "orange";
				break;
			case Operation.RETURN_STATE:
				color = "blue";
				break;
			case Operation.SCHEDULE:
				color = "purple";
				break;
	    default:
	        color = "green";
			}
			myElement.style.color = color;//"black";
		}
	}
}

function addRmvSelected(index, fromVw){ //1: from ListVw, 2 is from MapVw
	var resId = resources[index].resource_id;
	var appsOnSameRes = getObjectByValue(resources, "resource_id", resId);

	var indexInSlctdResArr = selectedResArr.findIndex(obj => obj.ResId==resId);
	if(indexInSlctdResArr<0){//not selected so select
		for(var j=0; j<appsOnSameRes.length; j++){
			var indexOfAppOnSameRes = resources.findIndex(obj => obj.nr==appsOnSameRes[j].nr);
			document.getElementById("lbl_slct:"+indexOfAppOnSameRes).innerHTML = "&#10004";
			if(fromVw == 1)
				document.getElementById("chk:"+indexOfAppOnSameRes).checked = true;
		}
		if(selectedResArr.length == 0){ //so this first selection
			setModeSel();
		}
		var selectedRes = {ResId:resources[index].resource_id};
		//selectedResArr.push(resources[indexOfAppOnSameRes]);
		selectedResArr.push(selectedRes);
		document.getElementById('ahrefSchMenuB').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify(selectedResArr)+"&Context="+1;
		document.getElementById('ahrefSchMenu1').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify(selectedResArr)+"&Context="+1;
	}
	else{ // selected so remove from selectedList
		selectedResArr.splice(indexInSlctdResArr,1); //1: from ListVw, 2 is from MapVw
		for(var j=0; j<appsOnSameRes.length; j++){
			var indexOfAppOnSameRes = resources.findIndex(obj => obj.nr==appsOnSameRes[j].nr);
			document.getElementById("lbl_slct:"+indexOfAppOnSameRes).innerHTML = "";
			if(fromVw == 1)
				document.getElementById("chk:"+indexOfAppOnSameRes).checked = false;
		}

		if(selectedResArr.length == 0){
			setModeOp();
		}
	}
	/*
	for(var j=0; j<appsOnSameRes.length; j++){
		indexOfAppOnSameRes = resources.findIndex(obj => obj.nr==appsOnSameRes[j].nr);
		//var indexInSlctdResArr = selectedResArr.findIndex(obj => obj.nr==resources[indexOfAppOnSameRes].nr);
		var indexInSlctdResArr = selectedResArr.findIndex(obj => obj.ResId==resId);
		if(indexInSlctdResArr<0){ // Not selected so select
			if(selectedResArr.length == 0){ //so this first selection
				setModeSel();
			}
			var selectedRes = {ResId:resources[index].resource_id};
			//selectedResArr.push(resources[indexOfAppOnSameRes]);
			selectedResArr.push(selectedRes);
			document.getElementById("lbl_slct:"+indexOfAppOnSameRes).innerHTML = "&#10004";
			if(fromVw == 1)
				document.getElementById("chk:"+indexOfAppOnSameRes).checked = true;

			document.getElementById('ahrefSchMenuB').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify(selectedResArr)+"&Context="+1;
			document.getElementById('ahrefSchMenu1').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify(selectedResArr)+"&Context="+1;
		}
		else{ // selected so remove from selectedList
			selectedResArr.splice(indexInSlctdResArr,1); //1: from ListVw, 2 is from MapVw
			document.getElementById("lbl_slct:"+indexOfAppOnSameRes).innerHTML = "";
			if(fromVw == 1)
				document.getElementById("chk:"+indexOfAppOnSameRes).checked = false;

			if(selectedResArr.length == 0){
				setModeOp();
			}
			}*/
	for(var j=0; j<selectedResArr.length; j++){
		console.log(selectedResArr[j]);
	}
}

function updateResIcon(resId, resState){
	for (var i=0 ; i<resources.length ; i++){
		if ( parseInt(resources[i].resource_id) == parseInt(resId) ) {
			var imgElmnt = document.getElementById("img:"+i);
			if(imgElmnt != null)
				imgElmnt.src =	'img/apps/' + getResImg(resources[i].appliance, resState)+ ".png";
			else
				console.log(imgElmnt + ': img:'+i+': img/apps/' + getResImg(resources[i].appliance, resState)+ ".png");
			document.getElementById("lbl_reqStatus:"+i).innerHTML = "";//i.e. Status updated after last request sent; not neccessarily response to this query
		}
	}
}

function updateResSldSw(resId, resState){
	for (var i=0 ; i<resources.length ; i++){
		if ( parseInt(resources[i].resource_id) == parseInt(resId) ) {
			if(parseInt(resState)==1){
				document.getElementById("sldrSwtch"+i).checked =	true;
			}
			else{
				document.getElementById("sldrSwtch"+i).checked =	false;
			}
		}
	}
}

function updateResIconAndSldSw(resId, resState){
	updateResIcon(resId, resState);
	updateResSldSw(resId, resState);
}

function getResImg(ResType, state){
	app = "";
	switch(parseInt(ResType)) {
	case ResourceType.ceilingFan:
		app="cfan" ;
		break;
	case ResourceType.bracketFan:
		app="bfan" ;
		break;
	case ResourceType.pedestalFan:
		app="pfan" ;
		break;
	case ResourceType.exhaustFan:
		app="efan" ;
		break;
	case ResourceType.tubeLight:
		app="tlight" ;
		break;
	case ResourceType.bulb:
		app="bulb" ;
		break;
	case ResourceType.energySaverBulb:
		app="esaver" ;
		break;
	case ResourceType.ledBulb:
		app="ledbulb" ;
		break;
	case ResourceType.chandelier:
		app="chand" ;
		break;
	case ResourceType.teleVision:
		app="tv" ;
		break;
	case ResourceType.plasmaTV:
		app="dtv" ;
		break;
	case ResourceType.ledTV:
		app="dtv" ;
		break;
	case ResourceType.airConditioner:
		app="ac" ;
		break;
	case ResourceType.microwaveOven:
		app="moven" ;
		break;
	case ResourceType.oven:
		app="oven" ;
		break;
	case ResourceType.refrigerator:
		app="refrigerator" ;
		break;
	case ResourceType.freezer:
		app="freezer" ;
		break;
	case ResourceType.dispenser:
		app="dispenser" ;
		break;
	case ResourceType.waterPump:
		app="waterpump" ;
		break;
	case ResourceType.motor:
		app="motor" ;
		break;
	case ResourceType.socket:
		app="socket" ;
		break;
	case ResourceType.geyser:
		app="geyser" ;
		break;
	case ResourceType.thermometer:
		app="thermo" ;
		break;
	case ResourceType.remote_control:
		app="rc" ;
		break;
	case ResourceType.video_camera:
		app="camera" ;
		break;
	default:
		app="cfan" ;
	}

	switch(parseInt(state)){
	case State.OFF:
		app=app+"_off";
		break;
	case State.ON:
		app=app+"_on";
		break;
	case State.UK:
		app=app+"_uk";
		break;
	case State.UR:
		app=app+"_ur";
		break;
	default:
		app=app+"_uk" ;
	}
	return app;
}

function openOptionMenu(){
	selctdAppindexOfResInResrs = -1;
	var thisMenu;
	if(FloorInMode == FloorMode.OPERATION){
		thisMenu = "popupMenu" + "A";
		//document.getElementById(thisMenu).style.visibility = 'hidden';
	}
	else if (FloorInMode == FloorMode.SELECTION){
		thisMenu = "popupMenu" + "B";
		//document.getElementById(thisMenu).style.visibility = 'hidden';
	}
	var ele = document.getElementById(thisMenu);
	ele.style.visibility = 'visible';
	ele.style.position="fixed";
	ele.style.left="15px";
	ele.style.top="50px";
	ele.style.zIndex = "1";
}

function closeOptionMenu(){
	var thisMenu;
	if(FloorInMode == FloorMode.OPERATION){
		thisMenu = "popupMenu" + "A";
	}
	else if (FloorInMode == FloorMode.SELECTION){
		thisMenu = "popupMenu" + "B";
	}
	var myElement = document.getElementById(thisMenu);
	if(myElement!=null){
		myElement.style.visibility = 'hidden';
	}
}

function setModeOp(){
	closeOptionMenu();
	FloorInMode = FloorMode.OPERATION;
	document.getElementById('optionImg').src='img/test/list.png';
	clearSelection();
}

function setModeSel(){
	closeOptionMenu();
	FloorInMode = FloorMode.SELECTION;
	document.getElementById('optionImg').src='img/test/select.png';
	clearSelection();
}

function scheRes(){
	if(FloorInMode == FloorMode.OPERATION){
		var selectedRes = {ResId:resources[selctdResindexOfResInResrs].resource_id};
		selectedResArr = [];
		selectedResArr.push(selectedRes);

		document.getElementById('ahrefSchMenu1').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify(selectedResArr)+"&Context="+1;
	}
	else if(FloorInMode == FloorMode.SELECTION){
		document.getElementById('ahrefSchMenu1').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify(selectedResArr)+"&Context="+1;
	}
}

function clearSelection(){
	for(var i=0; i<selectedResArr.length; i++){
		for (var j=0; j<resources.length; j++){
			if(selectedResArr[i].ResId == resources[j].resource_id){//alert("Here-3");
				document.getElementById("lbl_slct:"+j).innerHTML = "";
				var myChkBoxEle = document.getElementById("chk:"+j);
				if(myChkBoxEle != null){
					myChkBoxEle.checked = false;
					//console.log("chk:"+j);
				}
			}
		}
	}
	selectedResArr = [];
	//FloorInMode = FloorMode.OPERATION;
}

function initResInFBase(){
	if(firebaseInitialized == 1){
		navigator.notification.confirm(
			'Are you sure you want to initialize the appliance?\n\nNote: This Will Remove All Scheduled Events For The Appliance',  // message
			onConfirmInitResInFbase,              // callback to invoke with index of button pressed
			'Initialize Appliance: ',            // title
			'Yes,No'          // buttonLabels
		);
	}
	else{
		myAlert("Your Request Has NOT Been Forwarded \nThis Initializes The Resource In Firebase \nAnd You Do NOT Have Internet Access", 1);
	}

	closeMenu();
	closeOptionMenu();
}

function onConfirmInitResInFbase(button){
	if(button == 1){
		var resNR = resources[selctdResindexOfResInResrs].nr;
		var opRqst = Operation.RETURN_STATE;
		var Resource = getObjectByValue(resources, "nr", resNR);
		if(Resource.length<1){
			console.log('No Matching Resource');
			return;
		}

		var resource = Resource[0];//resources[selctdResindexOfResInResrs];
		if(resource.device_number==null || resource.device_subid==null){
			alert('Invalid Device Number or SubID');
			return;
		}
		var fbdbref = '/Installation-' + OBoxID + '/Device-' +
										resource.device_number + '/ResConfig';
		var fbdbResId = 'res-' + resource.device_subid;
		var dbref = firebase.database().ref(fbdbref).child(fbdbResId);
		dbref.set(opRqst);

		fbdbref = '/Installation-' + OBoxID + '/Device-' +
										resource.device_number + '/ResState';
		dbref = firebase.database().ref(fbdbref).child(fbdbResId);
		dbref.set(opRqst);

		/*fbdbref = '/Installation-' + OBoxID + '/Device-' +
										resource.device_number + '/ResSchedule';
		dbref = firebase.database().ref(fbdbref).child(fbdbResId);
		dbref.set(JSON.stringify({"Sch":[]}));*/

	}
	else{
		//alert('You Cancelled Initialization of Resource Event in Firebase');
	}
}

var hImgText;
function openMenu(indexOfResInResrs){

	selctdResindexOfResInResrs = indexOfResInResrs;
	//document.getElementById('popMhChsAct').style.visibility = 'hidden';

	/*var m_div = document.getElementById('div:'+selctdResindexOfResInResrs);
	var rect = m_div.getBoundingClientRect();
	console.log(rect.top, rect.right, rect.bottom, rect.left);*/

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

	var m_div = document.getElementById('div:'+selctdResindexOfResInResrs);
	if(m_div != null){ //i.e. MapVw
		document.getElementById('popupMen1').style.zIndex = "1";
		if(parseInt(indexOfResInResrs)>-1){
			rect = document.getElementById('img:'+indexOfResInResrs).getBoundingClientRect();
			document.getElementById('img:'+indexOfResInResrs).style = "background-color:#F9E79F";
		}

		document.getElementById('popupMen1').style.position="fixed";
		document.getElementById('popupMen1').style.left=rect.left+"px";//"30%";
		document.getElementById('popupMen1').style.top = rect.top+"px";//"20px";
	}
	else{// i.e. ListVw
		document.getElementById('popupMen1').style.zIndex = "0";
		document.getElementById('popupMen1').style.position="fixed";
		document.getElementById('popupMen1').style.right="10%";
		document.getElementById('popupMen1').style.top = "20px";
	}

	/*
	//scrollPos = document.getElementById('floormapvw').scrollTop; //.scrollTop()
	//document.getElementById('popupMen1').style.left=(parseInt(rect.left) + (parseInt(rect.right)-parseInt(rect.left))/2)+"px";
	document.getElementById('popupMen1').style.left=rect.left+"px";//"30%";
	//document.getElementById('popupMen1').style.top=(parseInt(rect.bottom) - parseInt(scrollPos) - (parseInt(rect.bottom)-parseInt(rect.top))/2)+"px";
	//document.getElementById('popupMen1').style.top=(parseInt(rect.bottom) - (parseInt(rect.bottom)-parseInt(rect.top))/2)+"px";
	document.getElementById('popupMen1').style.top = rect.top+"px";//"20px";
	//alert("rect.bottom="+rect.bottom+" :: scrollPos="+scrollPos); //
	*/
}

function closeMenu(){
	var myElement = document.getElementById('popupMen1');
	if(myElement!=null){
		myElement.style.visibility = 'hidden';
		for (var i=0 ; i<resources.length ; i++){
			//document.getElementById('img:'+selctdResindexOfResInResrs).style = "background-color:transparent";
			document.getElementById('img:'+i).style = "background-color:transparent";
		}
	}
}

function selectRes(){
	if(FloorInMode == FloorMode.SELECTION){//i.e.User gets the UnselectAll Option
		setModeOp();
	}
	else if (FloorInMode == FloorMode.OPERATION){//i.e. User gets Select Res Option
		setModeSel();
		var mResId = resources[selctdResindexOfResInResrs].resource_id;
		var selectedRes = {ResId:mResId};
		selectedResArr.push(selectedRes);
		for(var i=0; i<resources.length; i++){
			if(resources[i].resource_id == mResId){
				document.getElementById("lbl_slct:"+i).innerHTML = "&#10004";
				var chkBoxEle = document.getElementById("chk:"+i);
				if(chkBoxEle != null){
					chkBoxEle.checked = true;
				}
			}
		}

		document.getElementById('ahrefSchMenuB').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify(selectedResArr)+"&Context="+1;

		document.getElementById('ahrefSchMenu1').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify(selectedResArr)+"&Context="+1;

	}
	closeMenu();
	closeOptionMenu();
}

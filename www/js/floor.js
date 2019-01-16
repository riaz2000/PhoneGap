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

function getStatusofFlrRsrcs(){
	alert('getStatusofFlrRsrcs() ToBimplemented');
}

function sendRPCmsgOnWS(wsUri, methodName, argsString){
	var received_msg;
	if ("WebSocket" in window) {
		console.log(wsUri);
		let ws = new WebSocket(wsUri);

		ws.onopen = function() {

		ws.send(JSON.stringify({
          method: methodName,		//DeviceInfo will return device_id and installationID
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
	console.log(rcvdMsg);
	var rcvdMsgObj = JSON.parse(rcvdMsg);
	if(rcvdMsgObj.result.MsgType == "DeviceInfo"){
		console.log('InstID: ' + rcvdMsgObj.result.InstID);
		console.log('DevID: ' + rcvdMsgObj.result.DevID);
		console.log('IPAddress: ' + rcvdMsgObj.result.IPAddress);
		//return rcvdMsg;//JSON.stringify(rcvdMsgObj);
		var index = discoveredDevices.findIndex(obj => obj.DevID==rcvdMsgObj.result.DevID);
		var myDev = {"InstID":rcvdMsgObj.result.InstID,
									"DevID":rcvdMsgObj.result.DevID,
									"IPAddress":rcvdMsgObj.result.IPAddress};
		if(index<0){
			discoveredDevices.push(myDev);
		}
		else {
			discoveredDevices[index] = myDev;
		}
		//usrzFloorAreas = getObjectByValue(areasOnSameInst, "floor_number", floorNo);

	}
	else if(rcvdMsg.result.MsgType == "ResourceAction"){

	}
	else if(rcvdMsg.result.MsgType == "AddSchedule"){

	}
	else if(rcvdMsg.result.MsgType == "RemSchedule"){

	}
	else if(rcvdMsg.result.MsgType == "QuerySchedule"){

	}
}

function turnOFF(){
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

	closeMenu();
	closeOptionMenu();
}

function turnON(){
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

	closeMenu();
	closeOptionMenu();
}

function Toggle(){
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

	closeMenu();
	closeOptionMenu();
}

function getStatus(){
	console.log('getStatus()');
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

	closeMenu();
	closeOptionMenu();

}

function scheRes(){
	alert('scheRes() ToBimplemented: ');
}

function sendRequest2fbdb(resNR, opRqst){ //firebase database
	var Resource = getObjectByValue(resources, "nr", resNR);
	if(Resource.length<1){
		console.log('No Matching Resource');
		return;
	}
	var resource = Resource[0];//resources[selctdResindexOfResInResrs];
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
	var resSubId = resource.device_subid;
	//var opRqst = Operation.TURN_OFF;
	var resDeviceIP = getDeviceIP(resource.device_number);

	if(resDeviceIP == ""){
		console.log('Resource Not Reachable On WLAN');
		return;
	}
	var wsUri = 'ws://' + resDeviceIP +'/rpc';
	var methodName = "ResourceAction";
	var argsString = {"res": resSubId, "op": opRqst};
	sendRPCmsgOnWS(wsUri, methodName, argsString);

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
			var wsUri = 'ws://' + ipPrefix + i +'/rpc';
			var methodName = "DeviceInfo";
			var argsString = {};
			sendRPCmsgOnWS(wsUri, methodName, argsString);
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

function updateLblReqSt(ResID, newStatus){
	var appsOnSameRes = getObjectByValue(resources, "resource_id", ResID);

	for(var j=0; j<appsOnSameRes.length; j++){
		//we want all appliances associated with the resource to be operated
		var resIndex = resources.findIndex(obj => obj.nr==appsOnSameRes[j].nr);

		document.getElementById("lbl_reqStatus:"+resIndex).innerHTML = "&#9728";
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
		document.getElementById("lbl_reqStatus:"+resIndex).style.color = color;//"black";
	}
}

function addRmvSelected(index, fromVw){ //1: from ListVw, 2 is from MapVw
	var appsOnSameRes = getObjectByValue(resources, "resource_id", resources[index].resource_id);
	for(var j=0; j<appsOnSameRes.length; j++){
		indexOfAppOnSameRes = resources.findIndex(obj => obj.nr==appsOnSameRes[j].nr);
		var indexInSlctdResArr = selectedResArr.findIndex(obj => obj.nr==resources[indexOfAppOnSameRes].nr);
		if(indexInSlctdResArr<0){ // Not selected so select
			selectedResArr.push(resources[indexOfAppOnSameRes]);
			document.getElementById("lbl_slct:"+indexOfAppOnSameRes).innerHTML = "&#10004";
			if(fromVw == 1)
				document.getElementById("chk:"+indexOfAppOnSameRes).checked = true;
		}
		else{ // selected so remove from selectedList
			selectedResArr.splice(indexInSlctdResArr,1); //1: from ListVw, 2 is from MapVw
			document.getElementById("lbl_slct:"+indexOfAppOnSameRes).innerHTML = "";
			if(fromVw == 1)
				document.getElementById("chk:"+indexOfAppOnSameRes).checked = false;
		}
	}
	//console.log('selectedResArr: ' + JSON.stringify(selectedResArr));
}

function updateResIcon(resId, resState){
	for (var i=0 ; i<resources.length ; i++){
		if ( parseInt(resources[i].resource_id) == parseInt(resId) ) {
			document.getElementById("img:"+i).src =	'img/apps/' + getResImg(resources[i].appliance, resState)+ ".png";
			document.getElementById("lbl_reqStatus:"+i).innerHTML = "";//i.e. Status updated after last request sent; not neccessarily response to this query
		}
	}
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
	document.getElementById(thisMenu).style.visibility = 'hidden';
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
			}
		}
	}
	selectedResArr = [];
	//FloorInMode = FloorMode.OPERATION;
}

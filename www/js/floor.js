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
$('#floor').live('pageshow', function(event) { //pageshow pageinit
	OBoxID = getUrlVars()['OBoxID'];
	FloorNo = getUrlVars()['FloorNo'];
	CtrlAtomicLvl = getUrlVars()['CtrlAtmcLvl'];
	
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
	getFloorInfo();
});

function getFloorInfo(){
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
	
	myObj = document.getElementById('floorObj');
	
	myObj.data = webServer+"/OWL/FloorPlans/I1F"+FloorNo+".png";
	//alert("myObj.data "+ JSON.stringify(myObj.data));
	if(myObj.data.match(404))
		myObj.data = webServer + "/OWL/FloorPlans/I0F0default.png";
	myObj.style="margin: 0px 0px 0px 0px; "; //top bottom right left
	
	registerOUser();
	retrieveAppliances();
	
	getStatusofAllApps();

}

function retrieveAppliances(){
	//appliances = "[]";
	if(getOBdirectAccess()==1)
		serviceURL = 'http://'+getDirectAccessIP()+'/owl/services/';
	else if(getOBviaInternetAccess()==1){
		osaddr = localStorage.getItem('owlsaddr');
		port = 30000 + parseInt(OBoxID);
		serviceURL = 'http://'+osaddr+':'+port+'/owl/services/';
	}
	else{
		alert("OWLBox " + OBoxID + " Neither on LAN Nor Accessible over Internet");
		return;
	}
	
	var OBox;
	oboxObjStr = getOBoxObjstr(OBoxID);
	if(oboxObjStr == "InvalidOBox")
		myAlert("OBox Not Registered",1);
	else{
		OBox = JSON.parse(oboxObjStr);
	}
	
	
	setTimeout(function() {
		checkajaxkill();
	}, 4000);	//300 mSec
	var p = [ ];
	//serviceURL = 'http://192.168.1.2/owl/services/';
	var isneedtoKillAjax = true;
	
	//FloorNo = getUrlVars()['FloorNo'];
	//CtrlAtomicLvl = getUrlVars()['CtrlAtmcLvl'];
	//arr = [];
	var query = "SELECT * FROM tab_resources WHERE loc_lvl1="+FloorNo;
	var retObj = $.getJSON(serviceURL + 'select.php?sql='+query, function(data) {
		isneedtoKillAjax = false;
		
		appliances = data.items;
		//alert('appliances: ' + JSON.stringify(appliances));
		if(appliances.length == 0)
			alert("No Registered Appliances on This Floor");

		$.each(appliances, function(index, appliance) {
			if(CtrlAtomicLvl == 0){
				appliance.usrCtrlLvlonRes = OBox.uLoginLvl;
				addAppliance(appliance);
			}
			else if(CtrlAtomicLvl == 3){
				isneedtoKillAjax1 = true;
				
				var query = "SELECT * FROM tab_ur WHERE resource_number="+appliance.nr +" AND user_number="+OBox.unr;
				//alert(query);
				setTimeout(function() {
					if(isneedtoKillAjax1){
						retObj1.abort();
						myAlert('Timeout: Resource Query FROM tab_ur',0);                 
					};
				}, 4000);	//300 mSec
				var retObj1 = $.getJSON(serviceURL + 'select.php?sql='+query, function(data){
					isneedtoKillAjax1 = false;
					uResrcs = data.items;
					if(uResrcs.length == 1){
						appliance.usrCtrlLvlonRes = uResrcs[0].user_control_lvl;
						addAppliance(appliance);
					}
				}).success(function() { 
					//alert("second success"); 
					})
					.error(function() { 
						myAlert("error tab_ur", 4); 
					})
					.complete(function() { 
						//alert("complete"); 
					}
				);
				
			}
		});
	})	.success(function() { 
			//alert("second success"); 
		})
		.error(function() { 
			myAlert("error", 4); 
		})
		.complete(function() { 
			//alert("complete"); 
		}
	);
	//setTimeout(function(){ p.abort(); alert(JSON.stringify(p)); }, 500);
	p.push(retObj);
	
	function checkajaxkill(){

		// Check isneedtoKillAjax is true or false, 
		// if true abort the getJsonRequest

		if(isneedtoKillAjax){
			//p[i].abort();
			retObj.abort();
			myAlert('Resource Query Timeout',0);                 
		}else{
			//alert('no need to kill ajax');
		}
	}
}

function addAppliance(appliance){
	var indexOfAppInApps = -1;
	for (var i=0 ; i<appliances.length ; i++){
		if (appliances[i].nr == appliance.nr) {
			indexOfAppInApps = i;
		}
	}
	appliances[indexOfAppInApps].usrCtrlLvlonRes = appliance.usrCtrlLvlonRes;
	if(parseInt(appliance.usrCtrlLvlonRes)<1)
		return;
	var img1 = new Image();
	var div = document.getElementById('main');

	img1.onload = function() {
	  div.appendChild(img1);
	};
	appliances[indexOfAppInApps].img = img1;
	//value = window.devicePixelRatio;
	value = getDPI();
	//posX = 1.6*parseInt(appliance.pos_x) + 0;
	posX = parseInt(appliance.pos_x);//*value/16;
	posY = parseInt(appliance.pos_y);// + 600;
	
	img1.src = 'imgs/apps/' + getResImg(appliance.appliance, State.UK)+ ".png";
	img1.height=60;
	img1.width=60;
	
	img1.style="position: absolute; left:"+posX+"px; top:"+posY+"px;";
	addListeners(img1, appliance.resource_id);
	//ImgsArr.push(img1);
	//resIdsArr.push(appliance.resource_id);
}

function addListeners(img, resId){
	/*
	//Note: user_control_lvl 0=CanNotSeeRes 1-5=OBSERVER, 6-10=User, 11-15=Admin
	if(0 < parseInt(appliance.usrCtrlLvlonRes) < 6)
		Observer Only
	if(5 < parseInt(appliance.usrCtrlLvlonRes) < 10)
		Operate the device
	if(10 < parseInt(appliance.usrCtrlLvlonRes) < 16)
		Can Add/Remove/Update Appliance
	*/
	$$(img).swipe(function(e) {
	  //alert(e.pageX);
	  alert("EventQuo: Swipe");
	});
	
	$$(img).doubleTap(function(e) {
	  //alert(e.pageX);
	  alert("EventQuo: DoubleTap");
	});
	
	$$(img).swipeUp(function(e) {
	  //alert(e.pageX);
	  alert("EventQuo: swipeUp");
	});
	
	$$(img).swipeDown(function(e) {
	  //alert(e.pageX);
	  alert("EventQuo: swipeDown");
	});
	
	$$(img).swipeLeft(function(e) {
	  //alert(e.pageX);
	  alert("EventQuo: swipeLeft");
	});
	
	$$(img).swipeRight(function(e) {
	  //alert(e.pageX);
	  alert("EventQuo: swipeRight");
	});
	
	$$(img).hold(function(e) {//
	  //alert(e.pageX);
	  alert("EventQuo: hold");
	  img.style="position: absolute; left: 70px; top: 70px; background-color:yellow";
	});
	
	$$(img).tap(function(e) {
	  //alert(e.pageX);
		alert("EventQuo: tap" + resId);
		//sendRequest2OBox(MsgType, Msg, ResOpPairs, Schedule, isRegSoc){ //RegSock Remains Open
		MsgType = MessageType.REQUEST;
		Msg = Message.DO_NOT_CARE;
		ResOpPairs = resId + ":" + Operation.TOGGLE_STATE;
		Schedule = [];
		isRegSoc = false;
		
		sendRequest2OBox(MsgType, Msg, ResOpPairs, Schedule, isRegSoc);
		/*
		var socket = new Socket();
		var OBipAddr = localStorage.getItem('owlbaddr');
		socket.open(
			OBipAddr,//"192.168.1.3",
			1213,
			function() {
				// invoked after successful opening of socket
				var dataString = "2:2:3:2:5:2\n";
				var data = new Uint8Array(dataString.length);
				for (var i = 0; i < data.length; i++) {
				  data[i] = dataString.charCodeAt(i);
				}
				socket.write(data);
			},
			function(errorMessage) {
				// invoked after unsuccessful opening of socket
				alert("errorMessage: " + errorMessage);
				alert("Socket Open Error");
			}
		);
		socket.onData = function(data) {
		  // invoked after new batch of data is received (typed array of bytes Uint8Array)
		  alert(uintToString(data));
		  
		};
		socket.onError = function(errorMessage) {
		  // invoked after error occurs during connection
		  alert("errorMessage: " + errorMessage);
		  socket.close();
		};
		socket.onClose = function(hasError) {
		  // invoked after connection close
		  alert("Connection Closed with ErrorStatus = " + hasError);
		};
		*/
	});
	
	$$(img).drag(function(e) {
	  //alert(e.pageX);
	  alert("EventQuo: drag");
	});
	
	$$(img).rotateLeft(function(e) {
	  //alert(e.pageX);
	  alert("EventQuo: rotateLeft");
	});
	
	$$(img).rotateRight(function(e) {
	  //alert(e.pageX);
	  alert("EventQuo: rotateRight");
	});
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
	
	switch(state){
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
		app="_uk" ;
	}
	return app;
}

function sendRequest2OBox(MsgType, Msg, ResOpPairs, Schedule, isRegMsg){ //RegSock Remains Open
	var socket = new Socket();
	var owlMsg = new Object();
	owlMsg.role = Role.OWLUser;
	owlMsg.msgType = MsgType;//parseInt(reqs[1]);
	owlMsg.instIdOrSocStrg = OBoxID;//reqs[2];
	owlMsg.message = Msg;//parseInt(reqs[3]);
	//alert('owlMsg.message: ' + owlMsg.message + ":::" + 'Message.SCHEDULE_RETURN: ' + Message.SCHEDULE_RETURN);
	if(owlMsg.message==Message.SCHEDULE_RETURN){
		
	}
	else if( owlMsg.message==Message.SCHEDULE_ADD || 
		owlMsg.message==Message.SCHEDULE_REMOVE ){
		owlMsg.day = Schedule.day;
		owlMsg.month = Schedule.month;
		owlMsg.year = Schedule.year;
		owlMsg.hr = Schedule.hr;
		owlMsg.min = Schedule.min;
		owlMsg.sec = Schedule.sec;
		owlMsg.repeatPattern = Schedule.repeatPattern;
		owlMsg.forNdays= Schedule.forNdays;
	}
	var j=0;
	owlMsg.resourceID = [];	//new int[(reqs.length-4-addParms)/2];
	owlMsg.operation = [];//new int[(reqs.length-4-addParms)/2];
	resOpPairsArr = ResOpPairs.split(":");
	for (var i=0; i<resOpPairsArr.length; i=i+2) {
			owlMsg.resourceID[j] = resOpPairsArr[i];
			owlMsg.operation[j] = parseInt(resOpPairsArr[i+1]);
			j++;
	}
	
	var dataString = constructOwlMessage(owlMsg) + "\n";
	alert(dataString);
	//var dataString = Role.OWLUser+':'+MsgType+':'+OBoxID+':'+Msg+':'+ ResOpPairs+"\n";//"2:2:3:2:5:2\n";
	var data = new Uint8Array(dataString.length);
	for (var i = 0; i < data.length; i++) {
	  data[i] = dataString.charCodeAt(i);
	}
	
	setTimeout(function() {	checkajaxkill(); }, 4000);
	var isneedtoKillAjax = true;
	//alert('OBoxIP' + OBoxIP);
	//alert('OBoxPort' + OBoxPort);
	socket.open(
		OBoxIP,
		OBoxPort,
		function() {
			// invoked after successful opening of socket
			socket.write(data);
			isneedtoKillAjax = false;
		},
		function(errorMessage) {
			// invoked after unsuccessful opening of socket
			alert("Socket Open Error: " + errorMessage);
		}
	);
	
	function checkajaxkill(){
		if(isneedtoKillAjax){
			socket.close();
			myAlert('Request Timeout: \n'+dataString,0);                 
		}else{
			//alert('no need to kill ajax');
		}
	}
	
	socket.onData = function(data) {
		// invoked after new batch of data is received (typed array of bytes Uint8Array)
		rcvdMsg = uintToString(data);
		alert("Rcvd: " + rcvdMsg);
		if(isRegMsg){
			owlMsg = parseOwlMessage(rcvdMsg);
			if(owlMsg.msgType == MessageType.REGISTRATION && 
				owlMsg.message == Message.SUCCESSFUL){
				regSoc = socket;
				isneedtoKillAjax = true;
				myAlert("Registration Successful ",0);
			}
		}
		else{ //handle the response
			handleResponse(rcvdMsg);
		}
	  //check if the response is for the specfic resource for which request was sent
	  //ResOpPairs compare the resNo ResOpPairs with resNo in ResponseMsg  RiazH
	  
	};
	socket.onError = function(errorMessage) {
	  // invoked after error occurs during connection
	  alert("errorMessage: " + errorMessage);
	  socket.close();
	};
	socket.onClose = function(hasError) {
	  // invoked after connection close
	  alert("Connection Closed with ErrorStatus = " + hasError);
	};
}  


function getStatusofAllApps(){
	MsgType = MessageType.REQUEST;
	Msg = Message.DO_NOT_CARE;
	ResOpPairs='';
	for(var i=0; i<appliances.length; i++){
		ResOpPairs = ResOpPairs + appliances[i].resource_id + ":" + Operation.RETURN_STATE + ":";
		alert('ResOpPairs: ' + ResOpPairs);
	}
	Schedule = [];
	isRegMsg = false;

	sendRequest2OBox(MsgType, Msg, ResOpPairs, Schedule, isRegMsg);
}

function registerOUser(){
	oboxObjStr = getOBoxObjstr(OBoxID);
	//alert("oboxObjStr: " + oboxObjStr);
	if(oboxObjStr == "InvalidOBox"){
		myAlert("OBox Not Registered",1);
		return;
	}
	else{
		OBox = JSON.parse(oboxObjStr);
		
		MsgType = MessageType.REGISTRATION;
		Msg = OBox.unr;	//Message.DO_NOT_CARE;
		ResOpPairs='';
		Schedule = [];
		isRegMsg = true;

		sendRequest2OBox(MsgType, Msg, ResOpPairs, Schedule, isRegMsg);
	}
}

function handleResponse(rcvdMsg){
	owlMsg = parseOwlMessage(rcvdMsg);
	if(parseInt(owlMsg.instIdOrSocStrg) != OBoxID){
		myAlert("Message from Invalid OBox: " + parseInt(owlMsg.instIdOrSocStrg));
		return;
	}
	if(owlMsg.msgType == MessageType.REGISTRATION){
		
	}
	else if(owlMsg.msgType == MessageType.RESPONSE){
		if(owlMsg.Message == Message.SCHEDULE_RETURN){
			
		}
		else{
			for(var i=0; i<owlMsg.resourceID.length; i++){
				updateResIcon(owlMsg.resourceID[i], owlMsg.operation[i]);
			}
		}
	}
	else if(owlMsg.msgType == MessageType.UPDATE){ // Update from the OwlSwitch
		
	}
	else if(owlMsg.msgType == MessageType.CONNECTIVITY){
		
	}
}

function updateResIcon(resId, resStatus){
	for (var i=0 ; i<appliances.length ; i++){
		if (appliances[i].resource_id == resId) {
			appliances[i].img.src =	'imgs/apps/' + getResImg(appliances[i].appliance, resStatus)+ ".png";
			
			//img1.src = 'imgs/apps/' + getResImg(appliance.appliance, State.UK)+ ".png";
		}
	}	
}
var OBoxID;
var FloorNo;
var CtrlAtomicLvl;
var arr = [];
var webServer='';
var appliances = "[]";
$('#floor').live('pageshow', function(event) { //pageshow pageinit
	OBoxID = getUrlVars()['OBoxID'];
	FloorNo = getUrlVars()['FloorNo'];
	CtrlAtomicLvl = getUrlVars()['CtrlAtmcLvl'];
	
	if(getOBdirectAccess()==1)
		webServer = 'http://'+getDirectAccessIP();
	else if(getOBviaInternetAccess()==1){
		osaddr = localStorage.getItem('owlsaddr');
		port = 30000 + parseInt(OBoxID);
		webServer = 'http://'+osaddr+':'+port;
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
	alert("myObj.data "+ JSON.stringify(myObj.data));
	if(myObj.data.match(404))
		myObj.data = webServer + "/OWL/FloorPlans/I0F0default.png";
	myObj.style="margin: 0px 0px 0px 0px; "; //top bottom right left
	
	retrieveAppliances();

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
				alert(query);
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
	if(parseInt(appliance.usrCtrlLvlonRes)<1)
		return;
	var img1 = new Image();
	var div = document.getElementById('main');

	img1.onload = function() {
	  div.appendChild(img1);
	};
	//value = window.devicePixelRatio;
	value = getDPI();
	//posX = 1.6*parseInt(appliance.pos_x) + 0;
	posX = parseInt(appliance.pos_x)*value/16;
	posY = parseInt(appliance.pos_y) + 600;
	//img1.src = 'imgs/add.png';
	img1.src = 'imgs/apps/' + getResImg(appliance.appliance, State.UK)+".png";
	img1.height=60;
	img1.width=60;
	img1.style="position: absolute; left:"+posX+"px; top:"+posY+"px;";
	//addListeners(img1, appliance.nr);
	addListeners(img1, appliance.resource_id);
	arr.push(img1);
}

function addListeners(img, redId){
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
	
	$$(img).swipeDown(function(e) {
	  //alert(e.pageX);
	  alert("EventQuo: swipeDown");
	});
	
	$$(img).hold(function(e) {//
	  //alert(e.pageX);
	  alert("EventQuo: hold");
	  img.style="position: absolute; left: 70px; top: 70px; background-color:yellow";
	});
	
	$$(img).tap(function(e) {
	  //alert(e.pageX);
		alert("EventQuo: tap" + redId);
		var socket = new Socket();
		
		socket.open(
			"192.168.1.3",
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

function getDPI() {
  return document.getElementById("dpi").offsetHeight;
}


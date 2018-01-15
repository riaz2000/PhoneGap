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
//var state = 0;
var selectedResArr;// = "[]";
var FloorInMode;
var vis = 0;
selctdAppindexOfAppInApps = -1;
$('#floor').live('pageshow', function(event) { //pageshow pageinit
	//state = 0;
	FloorInMode = FloorMode.OPERATION;
	selectedResArr = [];
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
		myAlert("OWLBox " + OBoxID + " Neither on LAN Nor Accessible over Internet",0);
		return;
	}
	getFloorInfo();
});

function getFloorInfo(){
	oboxObjStr = getOBoxObjstr(OBoxID);
	//alert("oboxObjStr: " + oboxObjStr);
	
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
	
	//myObj.data = webServer+"/OWL/FloorPlans/I1F"+FloorNo+".png";
	myObj.data = webServer+"/owl/services/getFloorPlan.php?FloorNo="+FloorNo;
	//myObj.data = webServer+"/owl/services/test1.php";
	//alert("myObj.data "+ JSON.stringify(myObj.data));
	//if(myObj.data.match(404))
	//	myObj.data = webServer + "/OWL/FloorPlans/I0F0default.png";
	myObj.style="margin: 0px 0px 0px 0px; "; //top bottom right left
	
	registerOUser();
	addActionIcons();
	retrieveAppliances();
	
	//getStatusofAllApps();

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
		myAlert("OWLBox " + OBoxID + " Neither on LAN Nor Accessible over Internet", 0);
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
			MyAlert("No Registered Appliances on This Floor", 0);

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
			getStatusofAllApps();
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

function addActionIcons(){
	/*
	var img1 = new Image();
	var div = document.getElementById('footer');
	img1.src = 'imgs/apps/bulb.png';
	img1.height=30;
	img1.width=30;
	img1.id = "bulbImg";
	
	div.appendChild(img1);
	*/
	
	var linkTo = "schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo;//+"&ResId="+resId;
	
	//var a1 = document.getElementById('a1');
	//a1.href = linkTo;
	//img1.onClick = "fn2()";
}

function chgMode(){
	var div = document.getElementById('footer');
	//var iconImg = document.getElementById('bulbImg');
	var img2 = document.getElementById('footerOpImg');
	var img3 = document.getElementById('footerSchImg');
	var a2 = document.getElementById('a2');
	var a3 = document.getElementById('a3');
	//if(state==0){
	if(FloorInMode == FloorMode.OPERATION){
		//alert("State = " + state);
		//state = 1;
		//div.removeChild(iconImg);
		FloorInMode = FloorMode.SELECTION;
		document.getElementById('footerLstImg').src='imgs/test/release1.jpg';
		//img2.src='imgs/test/release2.jpg';
		//div.addChild(img2);
		//div.addChild(img3);
		img2.style.visibility = 'visible';
		img3.style.visibility = 'visible';
		//iconImg.display = no;
		var linkTo = "schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo;//+"&ResArr="+JSON.stringify(selectedResArr);
		//var a2 = document.getElementById('a2');
		a2.href = linkTo;
		//var a3 = document.getElementById('a3');
		a3.href = "schedule.html?OBoxID="+OBoxID+"&FloorNo="+2;;
		//img2.href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo;//+"&ResId="+resId;
		
	}
	else{
		//alert("State = " + state);
		document.getElementById('footerLstImg').src='imgs/test/list.png';
		FloorInMode = FloorMode.OPERATION;
		//state = 0;
		/*
		var img1 = new Image();
		img1.src = 'imgs/apps/bulb.png';
		img1.height=30;
		img1.width=30;
		img1.id = "bulbImg";
		div.appendChild(img1);
		*/
		//div.removeChild(img2);
		//div.removeChild(img3);
		
		a2.href = "#";
		a3.href = "#";
		img2.style.visibility = 'hidden';
		img3.style.visibility = 'hidden';
		selectedResArr = [];
		
		//img2.src='imgs/add.png';
		//img2.style.visibility = 'hidden';
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
	
	//value = window.devicePixelRatio;
	//value = getDPI();
	//posX = 1.6*parseInt(appliance.pos_x) + 0;
	posX = parseInt(appliance.pos_x);//*value/16;
	posY = parseInt(appliance.pos_y);// + 600;
	
	var newImg = new Image();
	newImg.id = "img:"+indexOfAppInApps;
	//var div = document.getElementById('top');
	var newDiv = document.createElement('div');
	//var div = document.getElementById('top1');
	//var div = new Division();
	document.getElementById('floor').appendChild(newDiv);
	newDiv.id = "div:"+indexOfAppInApps;
	//document.body.appendChild(div); 
	//newDiv.style="position: absolute; left:"+posX+"px; top:"+posY+"px;";
	newImg.onload = function() {
	  newDiv.appendChild(newImg);
	};
	//appliances[indexOfAppInApps].img = img1;
	//appliances[indexOfAppInApps].div = newDiv;
		
	newImg.src = 'imgs/apps/' + getResImg(appliance.appliance, State.UK)+ ".png";
	newImg.height=60;
	newImg.width=60;

	addListeners(newDiv, newImg, appliance.resource_id, indexOfAppInApps);
	//addListeners(indexOfAppInApps);
	
	newDiv.style.position="absolute";
	newDiv.style.left=posX+"px";
	newDiv.style.top=posY+"px";
}

function addListeners2(mDiv, mImg, mResId, indexOfAppInApps){
	var lbl_slct = document.createElement("Label");
	lbl_slct.id = "lbl_slct:"+indexOfAppInApps;
	//lbl_slct.style="position: absolute; right:3px; top:3px; ";
	lbl_slct.style.color = "green";
	mDiv.appendChild(lbl_slct);
	lbl_slct.style.position="absolute";
	lbl_slct.style.right="3px";
	lbl_slct.style.top="3px";
	
	var lbl_resId = document.createElement("Label");
	lbl_resId.id = "lbl_resId:"+indexOfAppInApps;
	lbl_resId.style.color = "blue";
	lbl_resId.innerHTML = mResId;
	mDiv.appendChild(lbl_resId);
	lbl_resId.style.position="absolute";
	lbl_resId.style.left="30%";
	lbl_resId.style.bottom="50%";
	
	// RequestForON: &#9732/&#9728;, RequestToOFF:&#10042; RequestToToggle: &#9775; RequestForStatusUpdate: &#63; RequestTimeout: &#128336
	// RequestForON: &#9728; color yellow
	// RequestForON: &#9728;	color black
	// RequestToToggle: &#9775; color blue
	// RequestForStatusUpdate: &#63; color yellow
	// RequestTimeout: &#128336: red
	var lbl_reqStatus = document.createElement("Label");
	lbl_reqStatus.id = "lbl_reqStatus:"+indexOfAppInApps;
	lbl_reqStatus.style.color = "yellow";
	lbl_reqStatus.innerHTML = "&#9728";	// Toggle: 9775
	mDiv.appendChild(lbl_reqStatus);
	lbl_reqStatus.style.position="absolute";
	lbl_reqStatus.style.left="3px";
	lbl_reqStatus.style.top="3px";
	
	// create a simple instance
	// by default, it only adds horizontal recognizers
	var mc = new Hammer(mImg);

	mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
	
	/*
	var singleTap = new Hammer.Tap({ event: 'singletap' });
	var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2 });
	var tripleTap = new Hammer.Tap({event: 'tripletap', taps: 3 });

	mc.add([tripleTap, doubleTap, singleTap]);

	tripleTap.recognizeWith([doubleTap, singleTap]);
	doubleTap.recognizeWith(singleTap);

	doubleTap.requireFailure(tripleTap);
	singleTap.requireFailure([tripleTap, doubleTap]);	
	*/
	
	mc.on("tap press swipeup swipedown swipeleft swiperight", function(ev) {
		//myElement.textContent = ev.type +" gesture detected.";
		//alert(ev.type +" gesture detected.");
		
		switch(ev.type) {
			case "tap":
				alert("You Tapped");
				
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
					
					for (var i=0 ; i<appliances.length ; i++){
						if (appliances[i].resource_id == mResId) {
							var m_lbl_reqStatus = document.getElementById("lbl_reqStatus:"+i);
							m_lbl_reqStatus.innerHTML = "&#9775";
							m_lbl_reqStatus.style.color = "blue";
							
							var m_div = document.getElementById('div:'+i);
							m_div.style.position = "absolute"; 
							m_div.style.left = appliances[i].pos_x+"px"; 
							m_div.style.top  = appliances[i].pos_y+"px"; 
						}
					}
				}
				else if(FloorInMode == FloorMode.SELECTION){
					var isResSlctd =  false;
					for(var j=0; j<selectedResArr.length; j++){
						if(selectedResArr[j].ResId == mResId){// i.e. already selected, so unselect it and remove from selectedResArr
							selectedResArr.splice(j,1);
							isResSlctd = true;
							if(selectedResArr.length == 0){
								chgMode();
							}
							for(var i=0; i<appliances.length; i++){
								if(appliances[i].resource_id == mResId){
									document.getElementById("lbl_slct:"+i).innerHTML = "";
									//isResSlctd = true;
									// Remove form the selectedResArr
								}
							}
						}
					}
					if(!isResSlctd){// so select
						var selectedRes = {ResId:mResId};
						selectedResArr.push(selectedRes);
						for(var i=0; i<appliances.length; i++){
							if(appliances[i].resource_id == mResId)
								document.getElementById("lbl_slct:"+i).innerHTML = "&#10004";
						}
					}
				}
				
				break;
			case "press":
				alert("You Pressed");
				
				openMenu(indexOfAppInApps);
				
				/*
				for(var i=0; i<selectedResArr.length; i++){
					for (var j=0; j<appliances.length; j++){
						if(selectedResArr[i].ResId == appliances[j].resource_id){			
							//appliances[j].mDiv.removeChild(document.getElementById("lbl:"+selectedResArr[i].ResId));
							//document.getElementById("lbl:"+selectedResArr[i].ResId).innerHTML = "";
							document.getElementById("lbl_slct:"+j).innerHTML = "";
						}
					}
				}
				selectedResArr = []; //empty the array and restart selection
				var selectedRes = {ResId:mResId};
				selectedResArr.push(selectedRes);

				FloorInMode = FloorMode.SELECTION;
				document.getElementById('footerLstImg').src='imgs/test/release1.jpg';

				document.getElementById('footerOpImg').style.visibility = 'visible';
				document.getElementById('footerSchImg').style.visibility = 'visible';
				
				document.getElementById('a2').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&ResArr="+JSON.stringify(selectedResArr);

				for(var i=0; i<appliances.length; i++){
					if(appliances[i].resource_id == mResId)
						document.getElementById("lbl_slct:"+i).innerHTML = "&#10004";
				}
				*/
				
				break;
			case "swipeup":
				alert("You SwipedUp");
				
				MsgType = MessageType.REQUEST;
				Msg = Message.DO_NOT_CARE;
				ResIdArr = [mResId];
				OpArr = [Operation.TURN_ON];
				Schedule = [];
				isRegSoc = false;
				
				sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, isRegSoc);
				for (var i=0 ; i<appliances.length ; i++){
					if (appliances[i].resource_id == mResId) {
						document.getElementById("lbl_reqStatus:"+i).innerHTML = "&#9728";
						document.getElementById("lbl_reqStatus:"+i).style.color = "yellow";
					}
				}
				
				break;
			case "swipedown":
				alert("You SwipedDown");
				
				MsgType = MessageType.REQUEST;
				Msg = Message.DO_NOT_CARE;
				ResIdArr = [mResId];
				OpArr = [Operation.TURN_OFF];
				Schedule = [];
				isRegSoc = false;
				
				sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, isRegSoc);
				for (var i=0 ; i<appliances.length ; i++){
					if (appliances[i].resource_id == mResId) {
						document.getElementById("lbl_reqStatus:"+i).innerHTML = "&#9728";
						document.getElementById("lbl_reqStatus:"+i).style.color = "black";
					}
				}
				
				break;
			case "swipeleft":
				alert("You SwipedLeft");
				
				openMenu(indexOfAppInApps);
				/*
				<div data-role="collapsible" data-inset="false">
					<h2>Farm animals</h2>
					<ul data-role="listview">
						<li><a href="configureOwl.html" data-rel="dialog">Configure</a></li>
						<li><a href="#" data-rel="dialog">Cow</a></li>
						<li><a href="#" data-rel="dialog">Duck</a></li>
						<li><a href="#" data-rel="dialog">Sheep</a></li>
					</ul>
				</div>
				
				var myDiv = document.createElement('div');
				var myH2 = document.createElement('h2');
				//myDiv.data-role="collapsible";
				//myDiv.data-inset="false";
				myH2.text = "Operations";
				myDiv.appendChild(myH2);
				*/
				break;
			case "swiperight":
				alert("You SwipedRight");
				MsgType = MessageType.REQUEST;
				Msg = Message.DO_NOT_CARE;
				ResIdArr = [mResId];
				OpArr = [Operation.RETURN_STATE];
				Schedule = [];
				isRegSoc = false;
				
				sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, isRegSoc);
				
				for (var i=0 ; i<appliances.length ; i++){
					if (appliances[i].resource_id == mResId) {
						document.getElementById("lbl_reqStatus:"+i).innerHTML = "&#63&#63&#63";
						document.getElementById("lbl_reqStatus:"+i).style.color = "purple";
					}
				}
				break;
			default:
				alert("You Defaulted");
		}
	});
	
}

function onConfirm1(buttonIndex) {
	alert('You selected button ' + buttonIndex);
}

function onPrompt1(results) {
	alert("You selected button number " + results.buttonIndex + " and entered " + results.input1);
}
//function addListeners(div, img, resId, indexOfAppInApps){
//function addListeners(indexOfAppInApps){
function addListeners(mDiv, mImg, mResId, indexOfAppInApps){
	//var mDiv   = document.getElementById("div:"+indexOfAppInApps);
	//var mImg   = document.getElementById("img:"+indexOfAppInApps);
	//var mResId = appliances[indexOfAppInApps].resource_id;
	
	/*
	//Note: user_control_lvl 0=CanNotSeeRes 1-5=OBSERVER, 6-10=User, 11-15=Admin
	if(0 < parseInt(appliance.usrCtrlLvlonRes) < 6)
		Observer Only
	if(5 < parseInt(appliance.usrCtrlLvlonRes) < 10)
		Operate the device
	if(10 < parseInt(appliance.usrCtrlLvlonRes) < 16)
		Can Add/Remove/Update Appliance
	*/
	
	//var myElement = document.getElementById('img:'+indexOfAppInApps);

	var lbl_slct = document.createElement("Label");
	lbl_slct.id = "lbl_slct:"+indexOfAppInApps;
	lbl_slct.style.color = "green";
	mDiv.appendChild(lbl_slct);
	lbl_slct.style.position="absolute";
	lbl_slct.style.left="0px";
	lbl_slct.style.top="0px";
	
	var lbl_resId = document.createElement("Label");
	lbl_resId.id = "lbl_resId:"+indexOfAppInApps;
	lbl_resId.style.color = "blue";
	lbl_resId.innerHTML = mResId;
	mDiv.appendChild(lbl_resId);
	lbl_resId.style.position="absolute";
	lbl_resId.style.left="0px";//lbl_resId.style.left="30%";
	lbl_resId.style.top="20px";//lbl_resId.style.bottom="50%";
	
	// RequestForON: &#9732/&#9728;, RequestToOFF:&#10042; RequestToToggle: &#9775; RequestForStatusUpdate: &#63; RequestTimeout: &#128336
	// RequestForON: &#9728; color yellow
	// RequestForON: &#9728;	color black
	// RequestToToggle: &#9775; color blue
	// RequestForStatusUpdate: &#63; color yellow
	// RequestTimeout: &#128336: red
	var lbl_reqStatus = document.createElement("Label");
	lbl_reqStatus.id = "lbl_reqStatus:"+indexOfAppInApps;
	lbl_reqStatus.style.color = "green";
	lbl_reqStatus.innerHTML = "&#9786";//"&#9728" light	// Toggle: 9775 // &#9786 smiley
	mDiv.appendChild(lbl_reqStatus);
	lbl_reqStatus.style.position="absolute";
	lbl_reqStatus.style.left="0px";
	lbl_reqStatus.style.top="30px";

	$$(mImg).doubleTap(function(e) {
		//alert(e.pageX);
		alert("EventQuo: DoubleTap");
		MsgType = MessageType.REQUEST;
		Msg = Message.DO_NOT_CARE;
		ResIdArr = [mResId];
		OpArr = [Operation.RETURN_STATE];
		Schedule = [];
		isRegSoc = false;
		
		sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, isRegSoc);
		
		for (var i=0 ; i<appliances.length ; i++){
			if (appliances[i].resource_id == mResId) {
				document.getElementById("lbl_reqStatus:"+i).innerHTML = "&#63";
				document.getElementById("lbl_reqStatus:"+i).style.color = "yellow";
			}
		}
	});
	
	$$(mImg).swipeUp(function(e) {
		//alert(e.pageX);
		alert("EventQuo: swipeUp");
		MsgType = MessageType.REQUEST;
		Msg = Message.DO_NOT_CARE;
		ResIdArr = [mResId];
		OpArr = [Operation.TURN_ON];
		Schedule = [];
		isRegSoc = false;
		
		sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, isRegSoc);
		for (var i=0 ; i<appliances.length ; i++){
			if (appliances[i].resource_id == mResId) {
				document.getElementById("lbl_reqStatus:"+i).innerHTML = "&#9728";
				document.getElementById("lbl_reqStatus:"+i).style.color = "red";
			}
		}
	});
	
	$$(mImg).swipeDown(function(e) {
		//alert(e.pageX);
		alert("EventQuo: swipeDown");
		MsgType = MessageType.REQUEST;
		Msg = Message.DO_NOT_CARE;
		ResIdArr = [mResId];
		OpArr = [Operation.TURN_OFF];
		Schedule = [];
		isRegSoc = false;
		
		sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, isRegSoc);
		for (var i=0 ; i<appliances.length ; i++){
			if (appliances[i].resource_id == mResId) {
				document.getElementById("lbl_reqStatus:"+i).innerHTML = "&#9728";
				document.getElementById("lbl_reqStatus:"+i).style.color = "black";
			}
		}
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
		openMenu(indexOfAppInApps);
		
		
		/*
		for(var i=0; i<selectedResArr.length; i++){
			for (var j=0; j<appliances.length; j++){
				if(selectedResArr[i].ResId == appliances[j].resource_id){			
					//appliances[j].mDiv.removeChild(document.getElementById("lbl:"+selectedResArr[i].ResId));
					//document.getElementById("lbl:"+selectedResArr[i].ResId).innerHTML = "";
					document.getElementById("lbl_slct:"+j).innerHTML = "";
				}
			}
		}
		selectedResArr = []; //empty the array and restart selection
		var selectedRes = {ResId:mResId};
		selectedResArr.push(selectedRes);
		
		//state = 1;
		FloorInMode = FloorMode.SELECTION;
		document.getElementById('footerLstImg').src='imgs/test/release1.jpg';

		document.getElementById('footerOpImg').style.visibility = 'visible';
		document.getElementById('footerSchImg').style.visibility = 'visible';
		
		document.getElementById('a2').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&ResArr="+JSON.stringify(selectedResArr);

		for(var i=0; i<appliances.length; i++){
			if(appliances[i].resource_id == mResId)
				document.getElementById("lbl_slct:"+i).innerHTML = "&#10004";
		}
		*/
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
			
			for (var i=0 ; i<appliances.length ; i++){
				if (appliances[i].resource_id == mResId) {
					var m_lbl_reqStatus = document.getElementById("lbl_reqStatus:"+i);
					m_lbl_reqStatus.innerHTML = "&#9775";
					m_lbl_reqStatus.style.color = "blue";
					
					var m_div = document.getElementById('div:'+i);
					m_div.style.position = "absolute"; 
					m_div.style.left = appliances[i].pos_x+"px"; 
					m_div.style.top  = appliances[i].pos_y+"px"; 
					
					//document.getElementById('div:'+i).style="position: absolute; left:"+appliances[i].pos_x+"px; top:"+appliances[i].pos_y+"px;";
				}
			}
			
			//mImg.style="background-color:transparent";
		}
		else if(FloorInMode == FloorMode.SELECTION){
			/*
			for(var i=0; i<appliances.length; i++){
				if(appliances[i].resource_id == mResId){
					var isResSlctd =  false;
					for(var j=0; j<selectedResArr.length; j++){
						if(selectedResArr[j].ResId == mResId){
							document.getElementById("lbl_slct:"+i).innerHTML = "";
						}
					}
					if(!isResSlctd){
						document.getElementById("lbl_slct:"+i).innerHTML = "&#10004";
					}
				}
			}
			*/
			var isResSlctd =  false;
			for(var j=0; j<selectedResArr.length; j++){
				if(selectedResArr[j].ResId == mResId){// i.e. already selected, so unselect it and remove from selectedResArr
					selectedResArr.splice(j,1);
					isResSlctd = true;
					if(selectedResArr.length == 0){
						chgMode();
					}
					for(var i=0; i<appliances.length; i++){
						if(appliances[i].resource_id == mResId){
							document.getElementById("lbl_slct:"+i).innerHTML = "";
							//isResSlctd = true;
							// Remove form the selectedResArr
						}
					}
				}
			}
			if(!isResSlctd){// so select
				var selectedRes = {ResId:mResId};
				selectedResArr.push(selectedRes);
				for(var i=0; i<appliances.length; i++){
					if(appliances[i].resource_id == mResId)
						document.getElementById("lbl_slct:"+i).innerHTML = "&#10004";
				}
			}
			
			//lbl.innerHTML = "&#10004";
			
			/*
			if(lbl.innerHTML != "&#10004"){
				lbl.innerHTML = "&#10004";
				selectedResArr.push(selectedRes);
			}
			else
				lbl.innerHTML = "";
			*/
			
			//document.getElementById("lbl:"+selectedResArr[i].ResId).innerHTML
			
			//mImg.style="background-color:green";
			//lbl.innerHTML = "&#10004";
			//lbl.style="position: absolute; right:3px; top:3px; color=green;";
			
		}
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
	/*
	$$(mImg).drag(function(e) {
	  //alert(e.pageX);
	  alert("EventQuo: drag");
	});
	
	$$(mImg).rotateLeft(function(e) {
	  //alert(e.pageX);
	  alert("EventQuo: rotateLeft");
	});
	
	$$(mImg).rotateRight(function(e) {
	  //alert(e.pageX);
	  alert("EventQuo: rotateRight");
	});
	*/
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

function sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, trackResp){ //RegSock Remains Open
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

	owlMsg.resourceID = ResIdArr;
	owlMsg.operation  = OpArr;
	var dataString = constructOwlMessage(owlMsg) + "\n";
	myAlert("Ready TO Tx: " + dataString, 3);
	var data = new Uint8Array(dataString.length);
	for (var i = 0; i < data.length; i++) {
	  data[i] = dataString.charCodeAt(i);
	}
	
	var isneedtoKillAjax;
	if(owlMsg.msgType == MessageType.REGISTRATION){
		setTimeout(function() {checkajaxkill(); }, 4000);
		isneedtoKillAjax = true;
	}

	socket.open(
		OBoxIP,
		OBoxPort,
		function() {
			// invoked after successful opening of socket
			socket.write(data);
			myAlert("Txd: " + dataString, 3);
			//isneedtoKillAjax = false;
			if(owlMsg.msgType != MessageType.REGISTRATION)
				socket.close();
			if(trackResp){
				// track each resource of in message if it has got the response for the action or not
				// in case of timeout get the updated status as it has been observed that OBox sometimes
				// performs the action but does not respond.
				//
			}
				
		},
		function(errorMessage) {
			// invoked after unsuccessful opening of socket
			alert("Socket Open Error: " + errorMessage);
		}
	);
	
	function checkajaxkill(){
		//if(isneedtoKillAjax && isRegReq){
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
		myAlert("Rcvdd: " + rcvdMsg,3);
		handleResponse(rcvdMsg);
		/*
		if(isRegReq){
			owlMsg = parseOwlMessage(rcvdMsg);
			if(owlMsg.msgType == MessageType.REGISTRATION && 
				owlMsg.message == Message.SUCCESSFUL){
				regSoc = socket;
				//isneedtoKillAjax = true;
				myAlert("Registration Successful ",0);
			}
		}
		else{ //handle the response
			handleResponse(rcvdMsg);
		}
		*/
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
	  if(hasError)
		myAlert("Connection Closed with ErrorStatus = " + hasError, 4);
	};
}  

function getStatusofAllApps(){
	MsgType = MessageType.REQUEST;
	Msg = Message.DO_NOT_CARE;
	ResIdArr = [];
	OpArr    = [];
	//ResOpPairs='';
	//alert('appliances.length: ' + appliances.length);
	for(var i=0; i<appliances.length; i++){
		ResIdArr.push(appliances[i].resource_id);
		OpArr.push(Operation.RETURN_STATE);
		//ResOpPairs = ResOpPairs + appliances[i].resource_id + ":" + Operation.RETURN_STATE + ":";
		//alert('ResOpPairs: ' + ResOpPairs);
	}
	
	Schedule = [];
	trackResp = false;

	sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, trackResp);
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
		//ResOpPairs='';
		ResIdArr = [];
		OpArr    = [];
		Schedule = [];
		trackResp = true;

		sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, trackResp);
	}
}

function handleResponse(rcvdMsg){
	owlMsg = parseOwlMessage(rcvdMsg);
	myAlert("MsgType:Msg " + owlMsg.msgType+":"+owlMsg.message,3);
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
			
		}
		else{
			//alert('owlMsg.resourceID.length1 ' + owlMsg.resourceID.length);
			for(var i=0; i<owlMsg.resourceID.length; i++){
				state = State.UK;
				alert("ResId:Operation::"+owlMsg.resourceID+":"+parseInt(owlMsg.operation[i]));
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

function updateResIcon(resId, resState){
	//alert('appliances.length1 ' + appliances.length);
	alert("updateResIcon: "+ resId + "::" + resState);
	for (var i=0 ; i<appliances.length ; i++){
		if ( parseInt(appliances[i].resource_id) == parseInt(resId) ) {
			//document.getElementById("lbl_slct:"+j).innerHTML = "";
			document.getElementById("img:"+i).src =	'imgs/apps/' + getResImg(appliances[i].appliance, resState)+ ".png";
			document.getElementById("lbl_reqStatus:"+i).innerHTML = "";//i.e. Status updated after last request sent
			//appliances[i].img.src =	'imgs/apps/' + getResImg(appliances[i].appliance, resState)+ ".png";
			myAlert("Image: " + 'imgs/apps/' + getResImg(appliances[i].appliance, resState)+ ".png", 3);
			
			//img1.src = 'imgs/apps/' + getResImg(appliance.appliance, State.UK)+ ".png";
		}
	}	
}

function openMenu(indexOfAppInApps){
	selctdAppindexOfAppInApps = indexOfAppInApps;
	
	if(FloorInMode == FloorMode.OPERATION){
		//document.getElementById('popMliSelRes').innerHTML="Select";
		document.getElementById('popMhSelRes').textContent = "Select";
		
	}else if(FloorInMode == FloorMode.SELECTION){
		document.getElementById('popMhSelRes').textContent = "Unselect All";
	}
	
	document.getElementById('popupMen1').style.visibility = 'visible';
		
	//var rect = element.getBoundingClientRect();
	//console.log(rect.top, rect.right, rect.bottom, rect.left);
	
	rect = document.getElementById('img:'+indexOfAppInApps).getBoundingClientRect();
	document.getElementById('popupMen1').style.zIndex = "1";
	document.getElementById('img:'+indexOfAppInApps).style = "background-color:#F9E79F";
	document.getElementById('popupMen1').style.position="absolute";
	
	document.getElementById('popupMen1').style.left=(parseInt(rect.left) + (parseInt(rect.right)-parseInt(rect.left))/2)+"px";
	document.getElementById('popupMen1').style.top=(parseInt(rect.bottom) - (parseInt(rect.bottom)-parseInt(rect.top))/2)+"px";
	
	
	
	/*
	if(vis==1){
		//document.getElementById('popupMen1').style.zIndex = "-1";
		document.getElementById('popupMen1').style.visibility = 'hidden';
		document.getElementById('img:'+indexOfAppInApps).style = "background-color:transparent";
		
		vis = 0;
	}
	else if(vis==0){
		document.getElementById('popupMen1').style.visibility = 'visible';
		
		//var rect = element.getBoundingClientRect();
		//console.log(rect.top, rect.right, rect.bottom, rect.left);
		
		rect = document.getElementById('img:'+indexOfAppInApps).getBoundingClientRect();
		document.getElementById('popupMen1').style.zIndex = "1";
		//document.getElementById('img:'+indexOfAppInApps).style.zIndex = "0";
		//"background-color:green";
		document.getElementById('img:'+indexOfAppInApps).style = "background-color:#F9E79F";
		document.getElementById('popupMen1').style.position="absolute";
		//document.getElementById('popupMen1').style.left=rect.left+"px";//"50px";
		
		document.getElementById('popupMen1').style.left=(parseInt(rect.left) + (parseInt(rect.right)-parseInt(rect.left))/2)+"px";
		document.getElementById('popupMen1').style.top=(parseInt(rect.bottom) - (parseInt(rect.bottom)-parseInt(rect.top))/2)+"px";//(parseInt(rect.top)+parseInt(30))+"px";//"50px";
		
		//document.getElementById('popupMen1').style.left=rect.right+"px";
		//document.getElementById('popupMen1').style.top=rect.bottom+"px";
	
		vis = 1;
	}
	*/
}

function closeMenu(){
	document.getElementById('popupMen1').style.visibility = 'hidden';
	document.getElementById('img:'+selctdAppindexOfAppInApps).style = "background-color:transparent";
}

function turnOFF(){
	MsgType = MessageType.REQUEST;
	Msg = Message.DO_NOT_CARE;
	
	ResIdArr 	= [];
	OpArr		= [];
		
	if(FloorInMode == FloorMode.OPERATION){
		ResIdArr = [appliances[selctdAppindexOfAppInApps].resource_id]; //[mResId];
		OpArr = [Operation.TURN_OFF];
	}
	else if(FloorInMode == FloorMode.SELECTION){
		//Add this resource among selected resources if not already selected
		addRes2selctdRsrcs();
		
		for (var i=0; i<selectedResArr.length; i++){
			ResIdArr.push(selectedResArr[i].ResId);
			OpArr.push(Operation.TURN_OFF);
		}
		
		clearSelection();
	}
	
	Schedule = [];
	isRegSoc = false;
	
	sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, isRegSoc);
	
	for (var i=0 ; i<appliances.length ; i++){
		for (var j=0 ; j<ResIdArr.length ; j++){
			if (appliances[i].resource_id == ResIdArr[j]) {
				document.getElementById("lbl_reqStatus:"+i).innerHTML = "&#9728";
				document.getElementById("lbl_reqStatus:"+i).style.color = "black";
			}
		}
	}
	closeMenu();
}

function turnON(){
	MsgType = MessageType.REQUEST;
	Msg = Message.DO_NOT_CARE;
	
	ResIdArr 	= [];
	OpArr		= [];
		
	if(FloorInMode == FloorMode.OPERATION){
		ResIdArr = [appliances[selctdAppindexOfAppInApps].resource_id]; //[mResId];
		OpArr = [Operation.TURN_ON];
	}
	else if(FloorInMode == FloorMode.SELECTION){
		//Add this resource among selected resources if not already selected
		addRes2selctdRsrcs();
		
		for (var i=0; i<selectedResArr.length; i++){
			ResIdArr.push(selectedResArr[i].ResId);
			OpArr.push(Operation.TURN_ON);
		}
		
		clearSelection();
	}
	
	Schedule = [];
	isRegSoc = false;
	
	sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, isRegSoc);
	
	for (var i=0 ; i<appliances.length ; i++){
		for (var j=0 ; j<ResIdArr.length ; j++){
			if (appliances[i].resource_id == ResIdArr[j]) {
				document.getElementById("lbl_reqStatus:"+i).innerHTML = "&#9728";
				document.getElementById("lbl_reqStatus:"+i).style.color = "red";
			}
		}
	}
	closeMenu();
}

function Toggle(){
	MsgType = MessageType.REQUEST;
	Msg = Message.DO_NOT_CARE;

	ResIdArr 	= [];
	OpArr		= [];
		
	if(FloorInMode == FloorMode.OPERATION){
		ResIdArr = [appliances[selctdAppindexOfAppInApps].resource_id]; //[mResId];
		OpArr = [Operation.TOGGLE_STATE];
	}
	else if(FloorInMode == FloorMode.SELECTION){
		//Add this resource among selected resources if not already selected
		addRes2selctdRsrcs();
		
		for (var i=0; i<selectedResArr.length; i++){
			ResIdArr.push(selectedResArr[i].ResId);
			OpArr.push(Operation.TOGGLE_STATE);
		}
		
		clearSelection();
	}
	
	Schedule = [];
	isRegSoc = false;
	
	sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, isRegSoc);
	
	for (var i=0 ; i<appliances.length ; i++){
		for (var j=0 ; j<ResIdArr.length ; j++){
			if (appliances[i].resource_id == ResIdArr[j]) {
				document.getElementById("lbl_reqStatus:"+i).innerHTML = "&#9775";
				document.getElementById("lbl_reqStatus:"+i).style.color = "blue";
			}
		}
	}
	closeMenu();
}

function getStatus(){
	MsgType = MessageType.REQUEST;
	Msg = Message.DO_NOT_CARE;
	
	ResIdArr 	= [];
	OpArr		= [];
		
	if(FloorInMode == FloorMode.OPERATION){
		ResIdArr = [appliances[selctdAppindexOfAppInApps].resource_id]; //[mResId];
		OpArr = [Operation.RETURN_STATE];
	}
	else if(FloorInMode == FloorMode.SELECTION){
		//Add this resource among selected resources if not already selected
		addRes2selctdRsrcs();
		
		for (var i=0; i<selectedResArr.length; i++){
			ResIdArr.push(selectedResArr[i].ResId);
			OpArr.push(Operation.RETURN_STATE);
		}
		
		clearSelection();
	}
	
	Schedule = [];
	isRegSoc = false;
	
	sendRequest2OBox(MsgType, Msg, ResIdArr, OpArr, Schedule, isRegSoc);
	
	for (var i=0 ; i<appliances.length ; i++){
		for (var j=0 ; j<ResIdArr.length ; j++){
			if (appliances[i].resource_id == ResIdArr[j]) {
				document.getElementById("lbl_reqStatus:"+i).innerHTML = "&#63&#63&#63";
				document.getElementById("lbl_reqStatus:"+i).style.color = "purple";
			}
		}
	}
	closeMenu();
}

function selectRes(){
	//alert("Here-1");
	if(FloorInMode == FloorMode.SELECTION){//i.e.User gets the UnselectAll Option
		//alert("Here-2a");
		clearSelection();
		//FloorInMode = FloorMode.OPERATION; // already done in clearSelection();
	}
	else if (FloorInMode == FloorMode.OPERATION){//i.e. User gets Select Res Option
		//alert("Here-2b");
		var mResId = appliances[selctdAppindexOfAppInApps].resource_id;
		var selectedRes = {ResId:mResId};
		selectedResArr.push(selectedRes);
		
		//state = 1;
		FloorInMode = FloorMode.SELECTION;
		document.getElementById('footerLstImg').src='imgs/test/release1.jpg';

		document.getElementById('footerOpImg').style.visibility = 'visible';
		document.getElementById('footerSchImg').style.visibility = 'visible';
		
		document.getElementById('a2').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&ResArr="+JSON.stringify(selectedResArr);

		document.getElementById("lbl_slct:"+selctdAppindexOfAppInApps).innerHTML = "&#10004";
		/*
		for(var i=0; i<appliances.length; i++){
			if(appliances[i].resource_id == mResId)
				document.getElementById("lbl_slct:"+i).innerHTML = "&#10004";
		}
		*/
	}
	closeMenu();
}

function addRes2selctdRsrcs(){
	//Add this resource among selected resources if not already selected
	var isResSlctd =  false;
	for(var j=0; j<selectedResArr.length; j++){
		if(selectedResArr[j].ResId == appliances[selctdAppindexOfAppInApps].resource_id){// i.e. already selected, so no need to reslect
			isResSlctd = true;
		}
	}
	if(!isResSlctd){// not already selected, so select it
		var selectedRes = {ResId:appliances[selctdAppindexOfAppInApps].resource_id};
		selectedResArr.push(selectedRes);
		
		for(var i=0; i<appliances.length; i++){
			if(appliances[i].resource_id == appliances[selctdAppindexOfAppInApps].resource_id){
				document.getElementById("lbl_slct:"+i).innerHTML = "&#10004";
			}
		}
	}
}

function rmvRes4mselctdRsrcs(){
	
}

function clearSelection(){
	for(var i=0; i<selectedResArr.length; i++){
		for (var j=0; j<appliances.length; j++){
			if(selectedResArr[i].ResId == appliances[j].resource_id){//alert("Here-3");		
				document.getElementById("lbl_slct:"+j).innerHTML = "";
			}
		}
	}
	selectedResArr = [];
	FloorInMode = FloorMode.OPERATION;
}

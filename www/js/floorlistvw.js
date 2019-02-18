var OBoxID;
var FloorNo;
var CtrlAtomicLvl;

var FloorInMode;
var vis = 0;
var selctdResindexOfResInResrs = -1;

var applianceTypes = [];

var areas = [];
var resources = [];
var devices = [];
var selectedResArr = [];

var discoveredDevices = [];

$('#floorlistvw').live('pageshow', function(event) { //pageshow pageinit
	FloorInMode = FloorMode.OPERATION;
	selectedResArr = [];
	OBoxID = getUrlVars()['OBoxID'];
	FloorNo = getUrlVars()['FloorNo'];
	CtrlAtomicLvl = getUrlVars()['CtrlAtmcLvl'];

	checkConnection();
	initializeFirebase();

	var msgFromFb = document.getElementById('msgFromFBase');
	//var fbdbResId = OBoxID + '-' + resId; //Firebase database resId
	var fbElement = '/Installation-'+ OBoxID;
	var dbref = firebase.database().ref(fbElement).child('Msg');
	dbref.on('value', snap => msgFromFb.innerHTML = snap.val());

	dbref.once('value', function (data){
		console.log(data.val());
		isneedtoKillAjax = false;
	}, console.log("Firebase Read Successful"),
		console.log("Firebase Read Failure")
	);

	/*var isneedtoKillAjax = true;
	var retObj;
	setTimeout(function() {
		checkajaxkill();
	}, 3000);
	//retObj = dbref.once('value', function (data){
	dbref.once('value', function (data){
		console.log(data.val());
		isneedtoKillAjax = false;
	}, function(){
		alert("Firebase Read Successful");
	}, function(){
		alert("Firebase Read Failure");
	});
	function checkajaxkill(){
		if(isneedtoKillAjax){ console.log("hereee-4-Fail");
			//retObj.abort();
			alert('Firebase Access: Timeout: ');
			discoverDevices();
		}else{console.log("hereee-4");
			//alert('Firebase Access: no need to kill ajax');

		}
	}*/

	if(internetStatus==0 && connType!="WiFi"){
		alert("Unfortunately, You Do NOT have Network Access");
		//goBack();
	}

	if(internetStatus==0 && connType=="WiFi"){
		alert("You Can Operate Resources Only on WLAN");
	}

	title = document.getElementById('pgTitle');
	title.innerHTML = "Floor:" +FloorNo+ " of OBox:" + OBox.OBoxNo;

	document.getElementById('popupMen1').style.visibility = 'hidden';
	document.getElementById('popupMenuA').style.visibility = 'hidden';
	document.getElementById('popupMenuB').style.visibility = 'hidden';

	applianceTypes = JSON.parse( localStorage.getItem('applianceTypesStr') );

	areas = getAreasOnFloor(OBoxID, FloorNo);

	devices = getDevicesOfInst(OBoxID);
	//console.log('devices: ' + JSON.stringify(devices));
	resources = getRsrcsOnFloor(OBoxID, FloorNo);
	//console.log('resources: ' + JSON.stringify(resources));
	addRsrcsOfFloor();

	//getStatusofFlrRsrcs();

	//if(WiFi is UP But Internet is DOWN) //Will be implemented after AWS success
	//if(internetStatus==0 && connType=="WiFi")
		//discoverDevices();

	document.getElementById('ahrefFlrOpMenuA').href="operateFloor.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify("[]")+"&Context="+0; // Operate
		//document.getElementById('ahrefFlrSchMenuA').href="operateFloor.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify("[]")+"&Context="+1; // Shedule
	document.getElementById('ahrefFlrSchMenuA').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify("[]")+"&Context="+1; // Shedule

	document.getElementById('ahrefFlrOpMenuB').href="operateFloor.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify("[]")+"&Context="+0;  // Operate
		//document.getElementById('ahrefFlrSchMenuB').href="operateFloor.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify("[]")+"&Context="+1; // Shedule
	document.getElementById('ahrefFlrSchMenuB').href="schedule.html?OBoxID="+OBoxID+"&FloorNo="+FloorNo+"&SlctdResArr="+JSON.stringify("[]")+"&Context="+1; // Shedule


});

function addRsrcsOfFloor(){
	RsrcsOnSlctdFlrArr = resources;
	$('#floorResLst li').remove();
	if(resources.length == 0){
		myAlert("No Registered Resources on This Floor", 0);
	}
	else{
		for(var i=0; i<resources.length ; i++){
			addResInList(resources[i]);
		}
	}
	$('#floorResLst').listview('refresh');
}

function addResInList(resource){
	var indexOfResInResrsArr = resources.findIndex(obj => obj.nr==resource.nr);

	resources[indexOfResInResrsArr].usrCtrlLvlonRes = resource.usrCtrlLvlonRes;
	if(parseInt(resource.usrCtrlLvlonRes)<1)
		return;

	var chkBx = '<center><label for="chk:' + indexOfResInResrsArr +
							'"><input type="checkbox" name="chk' + indexOfResInResrsArr +
							'" id="chk:'+indexOfResInResrsArr+'" onchange="addRmvSelected('+
							indexOfResInResrsArr+', 1)"></center>';	//1: from ListVw, 2 is from MapVw

	var lbl_slct = '<Label id="lbl_slct:'+indexOfResInResrsArr+'" style="color:green; position:absolute; left:20px; top=10px;"></Label>';

	var lbl_resId = '<Label id="lbl_resId:'+indexOfResInResrsArr+'" style="color:blue; position:absolute; left:10px; top:40px;">'+resource.resource_id+'</Label>';

	var lbl_reqStatus = '<Label id="lbl_reqStatus:'+indexOfResInResrsArr+'" style="color:green; position:absolute; left:20px; bottom:10px;">&#9728</Label>';

	var imgSpan = '<span style="float:left;" onclick="toggleRes(' +
								resource.resource_id +')"><img id="img:'+indexOfResInResrsArr +
								'"src="img/apps/' + getResImg(resource.appliance, State.UK) +
								'.png"; width=80px; height=80px;/>'+ lbl_slct + lbl_resId +
								lbl_reqStatus+'</span>'

	var resId = resource.resource_id;
	var sldSw = '<center><label class="switch"><input type="checkbox" ' +
							' id="sldrSwtch' + indexOfResInResrsArr + '" onchange="toggleRes('+ resId +
							')"> <span class="slider round"></span></label></center>';

	href3 = '<span class="ui-li-count"><img src="' + 'img/cnfg.png' +
					//'" height=30, width=25; onclick="opOptions('+indexOfResInResrsArr+
					'" height=30, width=25; onclick="openMenu(' +indexOfResInResrsArr+
					')"></span></a>';
	$('#floorResLst').append( '<li>'+imgSpan + sldSw +'<B><center>' +
														getResTypeName(resource.appliance) +
														'(' + resource.nr + ')' +
														'</center><h2><center><font color="purple"> ' +
														getResAreaName(resource.loc_lvl2) +
														'</font></center></h2><center>[' + resource.nr + ':' + resId +
														'(' + resource.device_number + ':' +
														resource.device_subid + ')]</center>' +
														'</B></label>' + chkBx + href3 +'</li>' );

	if(firebaseInitialized==1){
		//var fbdbResId = OBoxID + '-' + resId; //Firebase database resId
		var fbdbref = '/Installation-' + OBoxID + '/Device-' +
										resource.device_number + '/ResState';
		var fbdbResId = 'res-' + resource.device_subid;

  	var dbref = firebase.database().ref(fbdbref).child(fbdbResId);
		dbref.on('value', snap => updateResIconAndSldSw(resId, snap.val()));
	}
}
/*
function opOptions(resIndexInLst){
	var menHdrTxtEle = document.getElementById('popMhChsAct');
	var hImg = document.getElementById('lvHdrImg');
	var menSelEle = document.getElementById('popMSelRes');
	if(FloorInMode == FloorMode.OPERATION){
		menHdrTxtEle.innerHTML = "Select an option ...";


		hImg.src = 'img/apps/' + getResImg(resources[resIndexInLst].appliance, State.UK)+ ".png";
		hImg.height=50;
		hImg.width=50;
		//hImg.style.visibility = "visible";

		if(hImgText == undefined)
			hImgText = document.createElement("Label");
		hImgText.id = "hImgText:"+resIndexInLst;
		hImgText.style.color = "blue";
		hImgText.innerHTML = resources[resIndexInLst].resource_id;
		document.getElementById('ulHdr').appendChild(hImgText);
		hImgText.style.position="absolute";
		hImgText.style.left="1%";//lbl_resId.style.left="30%";
		hImgText.style.top="3%";
		hImgText.style.fontSize = "16px";
		hImgText.style.fontWeight = 'bold';

		menSelEle.style.fontSize = "16px";
		menSelEle.style.fontWeight = 'bold';
		menSelEle.innerHTML = "&#10004  Select";
	}
	else if(FloorInMode == FloorMode.SELECTION){
		menHdrTxtEle.innerHTML = "All Selected ...";
		hImg.style.visibility = "hidden";
		menSelEle.innerHTML = "&#10006 Unselect";
		menSelEle.style.fontSize = "16px";
		menSelEle.style.fontWeight = 'bold';
	}
	selctdResindexOfResInResrs = resIndexInLst;
	document.getElementById('popupMen1').style.visibility = 'visible';

	document.getElementById('popupMen1').style.zIndex = "0";

	document.getElementById('popupMen1').style.position="fixed";
	document.getElementById('popupMen1').style.right="10%";
	document.getElementById('popupMen1').style.top = "20px";

	var hImg = document.getElementById('lvHdrImg');
	hImg.src = 'img/apps/' + getResImg(resources[resIndexInLst].appliance, State.UK)+ ".png";
	hImg.height=50;
	hImg.width=50;

	document.getElementById('popMhChsAct').innerHTML = resources[resIndexInLst].nr + ':' +
														resources[resIndexInLst].resource_id;// + ':' +
}
*/

function toggleRes(resId){
	var Resource = getObjectByValue(resources, "resource_id", resId);
	if(Resource.length<1){
		console.log('No Matching Resource');
		return;
	}
	var resource = Resource[0];
	var fbdbref = '/Installation-' + OBoxID + '/Device-' +
									resource.device_number + '/ResState';
	var fbdbResId = 'res-' + resource.device_subid;
	var dbref = firebase.database().ref(fbdbref).child(fbdbResId);
	dbref.once("value", function(data) {
		fbdbref = '/Installation-' + OBoxID + '/Device-' +
										resource.device_number + '/ResConfig';
		dbref = firebase.database().ref(fbdbref).child(fbdbResId);
		var curState = data.val();
		if(curState == 0){
			dbref.set(1);
		}
		else if(curState == 1){
			dbref.set(0);
		}
	});
}

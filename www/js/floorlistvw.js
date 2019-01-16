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
	checkConnection();

	/*var config = {
			apiKey: "AIzaSyB3NiPBR8YEOoTl6GTjMJvukexE86cELoI",
			authDomain: "owltest-8b3c8.firebaseapp.com",
			databaseURL: "https://owltest-8b3c8.firebaseio.com",
			projectId: "owltest-8b3c8",
			storageBucket: "",
			messagingSenderId: "244059420939"
		};
*/

	if(internetStatus==1)
		initializeFirebase();

		var header1 = document.getElementById('header');
		//var fbdbResId = OBoxID + '-' + resId; //Firebase database resId
		var dbref = firebase.database().ref('/Installation-1/Device-1/ResState').child('res-1');
		dbref.on('value', snap => header1.innerHTML = snap.val());

	if(internetStatus==0 && connType!="WiFi"){
		alert("Unfortunately, You Do NOT have Network Access");
		goBack();
	}

	FloorInMode = FloorMode.OPERATION;
	selectedResArr = [];
	OBoxID = getUrlVars()['OBoxID'];
	FloorNo = getUrlVars()['FloorNo'];
	CtrlAtomicLvl = getUrlVars()['CtrlAtmcLvl'];

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

	getStatusofFlrRsrcs();

	//if(WiFi is UP But Internet is DOWN) //Will be implemented after AWS success
	if(internetStatus==0 && connType=="WiFi")
		discoverDevices();

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

	var chkBx = '<label for="chk:' + indexOfResInResrsArr + '"><input type="checkbox" name="chk' + indexOfResInResrsArr + '" id="chk:'+indexOfResInResrsArr+'" onchange="addRmvSelected('+indexOfResInResrsArr+', 1)">';	//1: from ListVw, 2 is from MapVw
	//var imgApp = '<img src="img/apps/' + getResImg(resource.appliance, State.UK) +'.png";/>'

	var lbl_slct = '<Label id="lbl_slct:'+indexOfResInResrsArr+'" style="color:green; position:absolute; left:20px; top=10px;"></Label>';

	var lbl_resId = '<Label id="lbl_resId:'+indexOfResInResrsArr+'" style="color:blue; position:absolute; left:10px; top:40px;">'+resource.resource_id+'</Label>';

	var lbl_reqStatus = '<Label id="lbl_reqStatus:'+indexOfResInResrsArr+'" style="color:green; position:absolute; left:20px; bottom:10px;">&#9728</Label>';

	var imgSpan = '<span style="float:left;"><img id="img:'+indexOfResInResrsArr+'"src="img/apps/' + getResImg(resource.appliance, State.UK) +'.png"; width=80px; height=80px;/>'+lbl_slct+lbl_resId+lbl_reqStatus+'</span>'

	var resId = resource.resource_id;

	href3 = '<span class="ui-li-count"><img src="' + 'img/cnfg.png' + '" height=30, width=25; onclick="opOptions('+indexOfResInResrsArr+')"></span></a>';
	$('#floorResLst').append('<li>'+imgSpan+ '<B><center>' + getResTypeName(resource.appliance) + '(' + resource.nr + ')' +
								'<h2><font color="purple"> ' + getResAreaName(resource.loc_lvl2) +
								'</font></h2>' + resId + '(' + resource.device_number + ':' + resource.device_subid + ')' +
								'</center></B></label><center>'+chkBx+'</center>'+ href3 +'</li>');
								//'</center></B></label>'+imgApp+ href3+'</li>');

	if(firebaseInitialized==1){
		//var fbdbResId = OBoxID + '-' + resId; //Firebase database resId
		var fbdbref = '/Installation-' + OBoxID + '/Device-' +
										resource.device_number + '/ResState';
		var fbdbResId = 'res-' + resource.device_subid;
								console.log(fbdbResId);
  	var dbref = firebase.database().ref(fbdbref).child(fbdbResId);
		dbref.on('value', snap => updateResIcon(resId, snap.val()));
	}
}

function opOptions(resIndexInLst){
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

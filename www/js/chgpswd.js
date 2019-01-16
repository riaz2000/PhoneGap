//document.addEventListener("deviceready", function(){
    //mycode
var OBoxID;
var userNR;
var serviceURL;
$('#chgPswdPage').live('pageshow', function(event) { //pageshow pageinit
	initChgPsWdPg();
});

//});
function initChgPsWdPg(){
	OBoxID = getUrlVars()['OBoxID'];
	serviceURL = 'http://'+localStorage.getItem('serveraddr')+'/OWL/Services/';

	title = document.getElementById('pgTitle');
	title.innerHTML = OBox.ufname + " " + OBox.ulname

	uIdObj = document.getElementById('uid');
	uIdObj.innerHTML = OBox.userId;
	/*
	if(getOBdirectAccess()==1)
		serviceURL = 'http://'+getDirectAccessIP()+'/owl/services/';
	else if(getOBviaInternetAccess()==1){
		osaddr = localStorage.getItem('owlsaddr');
		port = 30000 + parseInt(OBoxID);
		serviceURL = 'http://'+osaddr+':'+port+'/owl/services/';
	}
	else{
		alert("OWLBox " + OBoxID + " Neither on LAN Nor Accessible over Internet");
		//return;
	}
	//alert("OBoxID: " + OBoxID);
	oboxObjStr = getOBoxObjstr(OBoxID);
	//alert("oboxObjStr: " + oboxObjStr);
	if(oboxObjStr == "InvalidOBox")
		myAlert("OBox Not Registered",1);
	else{
		OBox = JSON.parse(oboxObjStr);

		//alert("OBoxID: " + OBoxID);

		title = document.getElementById('pgTitle');
		title.innerHTML = OBox.ufname + " " + OBox.ulname + " @ OBox " + OBox.OBoxNo;

		//OBox.userId + "@" + OBox.OBoxNo + "CtrlLvl: " + OBox.uLoginLvl;

		uIdObj = document.getElementById('uid');
		uIdObj.innerHTML = OBox.userId;
		//OBox.ufname + " " + OBox.ulname + "\n(" + OBox.userId +")";

		titleObj = document.getElementById('titleImg');

		titleObj.src = "imgs/place.png";
		titleObj.height = "50";
		titleObj.width = "70";
		titleObj.text = "OWLBox#";
		//titleObj.align = "mid";
		document.getElementById('OBoxNo').innerHTML = OBoxID;
		//document.getElementById('OBoxNo').color = "00ff00";

		addressObj = document.getElementById('address');
		addressObj.innerHTML = OBox.instAddr1 + ", " + OBox.instAddr2 + ", \n" +
								OBox.instCity + ", " + OBox.instState + ", " +
								OBox.instZip + ", \n" + OBox.instCountry;
	}*/
}

//document.addEventListener("deviceready", //function(){
function update(){
	//OBoxID = getUrlVars()['OBoxID'];

	//alert("OBoxID: " + OBoxID);
	oboxObjStr = getOBoxObjstr(OBoxID);
	alert("oboxObjStr: " + oboxObjStr);
	if(oboxObjStr == "InvalidOBox"){
		myAlert("OBox Not Registered",1);
		return;
	}

	OBox = JSON.parse(oboxObjStr);

	oldpswd = document.getElementById('OldPsWd');
	newpswd1 = document.getElementById('NewPsWd1');
	newpswd2 = document.getElementById('NewPsWd2');

	if(newpswd1.value == ""){
		myAlert("Empty Passwords NOT Allowed",0);
		return;
	}

	if(newpswd1.value != newpswd2.value){
		myAlert("Your New Passwords Do NOT Match",0);
		return;
	}

	setTimeout(function() {
		checkajaxkill();
	}, 10000);	//300 mSec
	var query = "SELECT * FROM tab_users WHERE login_id='"+OBox.userId+"'";
	//alert(serviceURL + "\n" + query);
	var isneedtoKillAjax = true;
	//var retObj = $.getJSON(serviceURL + 'getHashPwd.php?uid='+OBox.userId, function(data) {
	var retObj = $.getJSON(serviceURL + 'select.php?sql='+query, function(data){
		isneedtoKillAjax = false;
		users = data.items;
		//alert(JSON.stringify(users));

		if(users!=null && users.length==1){
			var hashPsWd = users[0].login_pswd;
			alert('hashPsWd: ' + hashPsWd);
			if(bcrypt.compareSync(oldpswd.value, hashPsWd) || hashPsWd=="1234"){
				myAlert("You are Ready for Password Change",3);
				userNR = users[0].nr;
				updatePsWd(userNR, newpswd1.value);
				//alert(userNR + " " + newpswd1.value	);
			}
			else{
				alert("Access Denied");
			}
		}
		else if(users.length>1){
			myAlert("Multiple Users With Same ID: DB Err.", 1);
		}

	})	.success(function() {
			//alert("second success");
		})
		.error(function() {
			myAlert("error2");
		})
		.complete(function() {
			//alert("complete");
		}
	);

	function checkajaxkill(){

		// Check isneedtoKillAjax is true or false,
		// if true abort the getJsonRequest

		if(isneedtoKillAjax){
			//p[i].abort();
			retObj.abort();
			alert('Request Timeout');
		}else{
			//alert('no need to kill ajax');
		}
	}
}

function updatePsWd(nr, pswd){
	//serviceURL = 'http://localhost/owl/services/';
	//serviceURL = 'http://192.168.1.2/owl/services/';
	//UPDATE tab_users SET login_lvl = 8, lname = 'Riaz' WHERE login_id = 'hriaz'
	hashedPsWd = bcrypt.hashSync(pswd, 12);

	var query = "UPDATE tab_users SET login_pswd = '" + hashedPsWd + "' WHERE nr = '" +nr+ "'";
	//alert(query +":" + hashedPsWd);

	//alert('serviceURL: ' + serviceURL);

	setTimeout(function() {
		checkajaxkill();
	}, 10000);	//300 mSec
	isneedtoKillAjax = true;

	var retObj = $.getJSON(serviceURL + 'update.php?sql='+query, function(data) {
		isneedtoKillAjax = false;

		alert("RcvdResp:" + JSON.stringify(data));

	})	.success(function() {
			alert("Passwod Updated");
		})
		.error(function() {
			alert("error1");
		})
		.complete(function() {
			//alert("complete");
		}
	);
	//setTimeout(function(){ p.abort(); alert(JSON.stringify(p)); }, 500);
	//p.push(retObj);
	function checkajaxkill(){

		// Check isneedtoKillAjax is true or false,
		// if true abort the getJsonRequest

		if(isneedtoKillAjax){
			//p[i].abort();
			retObj.abort();
			alert('Request Timeout');
		}else{
			//alert('no need to kill ajax');
		}
	}

	goBack();

}

function cancel(){
	goBack();
}

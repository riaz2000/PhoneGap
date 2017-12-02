var OBoxID;
var users;
$('#loginPage').live('pageshow', function(event) { //pageshow pageinit
	getInfo();
});

function getInfo(){
	OBoxID = getUrlVars()['OBoxID'];
	alert('loginPage-getInfo-1-OBoxId: ' + OBoxID);
	getOBoxAddress();
	//myObj = document.getElementById('LoginmsgObj');
	//myObj.standby = "Retrieving ...";
	//myObj.data = "http://localhost/owl/services/login.php";
}

function login(){
	OBoxID = getUrlVars()['OBoxID'];
	var uid = document.getElementById('UId');
	var pswd = document.getElementById('UPwd');
	var serviceURL = "http://localhost/owl/services/";
	//alert("login-2UId" + uid.value);
	//alert("login-3PsWd " + pswd.value);
	/*
	$.ajaxSetup({
        async: false
    });
	*/
	//var response;
	//window.location.href = 
	setTimeout(function() {
		checkajaxkill();
	}, 3000);
	isneedtoKillAjax = true;
	var retObj = $.getJSON(serviceURL + 'getHashPwd.php?uid='+uid.value, function(data) {
		//async: false,
		//alert("Data: " + JSON.stringify(data));
		isneedtoKillAjax = false;
		users = data.items;
		var loggedin = 0;
		$.each(users, function(index, user) {
			if(index == 0){ // only the first match
				//alert("hashPsWd: " + user.login_pswd);
				hashPsWd = user.login_pswd;
				
				if(hashPsWd == "1234"){// This is the defaults password
					// Allow access, but alert the user to change password
					if(pswd.value == hashPsWd){
						loggedin = 1;
						//alert4chgpswd();
					}
				}
				else if(bcrypt.compareSync(pswd.value, hashPsWd)) {
					// Passwords match
					loggedin = 1;
				}
				
				if(loggedin == 1){ 
					alert ("Successfully LoggedIn");
					//alert("OBoxNo"+OBoxID);
					oboxObjStr = getOBoxObjstr(OBoxID);
					if(oboxObjStr == "InvalidOBox")
						myAlert("OBox Not Registered",1);
					else{
						OBox = JSON.parse(oboxObjStr);
						
						//alert("StoredObj: " + oboxObjStr);
						//alert("OBoxNo"+OBoxID);
						var updatedObj = {"OBoxNo":OBoxID, "instType":OBox.instType, 					"ctrlAtomicLvl":OBox.ctrlAtomicLvl,
											"loginRqrdInside":OBox.loginRqrdInside, "instAddr1":OBox.instAddr1, "instAddr2":OBox.instAddr2,
											"instCity":OBox.instCity, "instState":OBox.instState, "instZip":OBox.instZip, "instCountry":OBox.instCountry,
											"instLastDirectAccessip":selectedOBoxIP, "unr":user.nr, "ufname":user.fname, "ulname":user.lname, "userId":uid.value, "userPwd":"",
											"uLoginLvl":user.user_control_lvl, "uLoginState":1};
						
						
						updateOBox(OBoxID, updatedObj);
						//alert ("Successfully LoggedIn");
						//Successfully LoggedIN, now go to main pageX
						//goBack();
					}
				} else {
					// Passwords don't match
					alert ("Login Failed");
				}
			}
		});

	})	.success(function() { 
			alert("Login Successful");
			//goBack();
		})
		.error(function() { 
			alert("error"); 
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

function allowEntry(){
	OBoxID = getUrlVars()['OBoxID'];
	// Update Info
	alert ("Successfully LoggedIn");
	alert("OBoxNo"+OBoxID);
	oboxObjStr = getOBoxObjstr(OBoxID);
	if(oboxObjStr == "InvalidOBox")
		myAlert("OBox Not Registered",1);
	else{
		OBox = JSON.parse(oboxObjStr);
		
		//alert("StoredObj: " + oboxObjStr);
		alert("OBoxNo"+OBoxID);
		var updatedObj = {"OBoxNo":OBoxID, "instType":OBox.instType, 					"ctrlAtomicLvl":OBox.ctrlAtomicLvl,
							"loginRqrdInside":OBox.loginRqrdInside, "instAddr1":OBox.instAddr1, "instAddr2":OBox.instAddr2,
							"instCity":OBox.instCity, "instState":OBox.instState, "instZip":OBox.instZip, "instCountry":OBox.instCountry,
							"instLastDirectAccessip":selectedOBoxIP, "unr":user.nr, "ufname":user.fname, "ulname":user.lname, "userId":uid.value, "userPwd":"",
							"uLoginLvl":user.user_control_lvl, "uLoginState":1};
		
		updateOBox(OBoxID, updatedObj);
		alert ("Successfully LoggedIn");
		//Successfully LoggedIN, now go to main pageX
		goBack();
	}
	
}

function removeInst(){
	OBoxID = getUrlVars()['OBoxID'];
	navigator.notification.confirm(
		'Are you sure you want to remove the installation from the list?',  // message
		onConfirmRemoveInst,              // callback to invoke with index of button pressed
		'Remove OWLBox: ' + OBoxID,            // title
		'Yes,No'          // buttonLabels
	);
}

function onConfirmRemoveInst(button){
	OBoxID = getUrlVars()['OBoxID'];
	if(button == 1){
		removeOBox(OBoxID);
		alert('Installation Removed ');
		goBack();
	}
	else{
		//alert('You Cancelled Logout Event');
	}
}
/*
function removeInst(){
	OBoxID = getUrlVars()['OBoxID'];
	
	navigator.notification.confirm(
		'Are your sure, you want to DELTE the OWLBox from the list?',  // message
		removeOBoxfromLst,              // callback to invoke with index of button pressed
		'Remove OWLBox: ' + OBoxID,            // title
		'Yes,No'          // buttonLabels
	);
}

function removeOBoxfromLst(button){
	if(button == 1){
		OBoxID = getUrlVars()['OBoxID'];
		removeOBox(OBoxID);
		goBack();
	}
}
*/
// process the confirmation dialog result
function gotoChgPswdPg(button) {
	//alert('You selected button ' + button);
	if(button == 1){ //lead to change password page
		alert("gotoChgPswdPg");
		//location.href=chgPswd.html;
		window.location.href = chgPswd.html;
	}
}

// Show a custom confirmation dialog
//
function alert4chgpswd() {
	navigator.notification.confirm(
		'You are using default password, Change?',  // message
		gotoChgPswdPg,              // callback to invoke with index of button pressed
		'Change Password',            // title
		'Yes,Not Now'          // buttonLabels
	);
}

// process the confirmation dialog result
function onConfirm(button) {
	alert('You selected button ' + button);
}

// Show a custom confirmation dialog
//
function showConfirm() {
	navigator.notification.confirm(
		'You are the winner!',  // message
		onConfirm,              // callback to invoke with index of button pressed
		'Game Over',            // title
		'Restart,Exit'          // buttonLabels
	);
}

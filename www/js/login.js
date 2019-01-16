var OBoxID;
var users;
$('#loginPage').live('pageshow', function(event) { //pageshow pageinit
	initLoginPg();
});

function initLoginPg(){
	OBoxID = getUrlVars()['OBoxID'];
	//console.log('initLoginPg: OBoxID: ' + OBoxID);
}

function cancelLogin(){
	goBack();
}

function login(){
	var uid = document.getElementById('UId');
	var pswd = document.getElementById('UPwd');

	var serviceURL = 'http://'+localStorage.getItem('serveraddr')+'/OWL/Services/';//"http://203.124.40.232/OWL/Services/";
	console.log('serviceURL: ' + serviceURL);
	isneedtoKillAjax = true;
	setTimeout(function() {
		checkajaxkill();
	}, 10000);
	var retObj = $.getJSON(serviceURL + 'getHashPwd.php?uid='+uid.value, function(data) {
		isneedtoKillAjax = false;
		users = data.items;
		var loggedin = 0;
		if(users.length == 0){
			alert ("Login Failed: 1");
		}
		else{
			$.each(users, function(index, user) {
				if(index == 0){ // only the first match
					//alert("hashPsWd: " + user.login_pswd);
					hashPsWd = user.login_pswd;

					if(hashPsWd == "1234"){// This is the defaults password
						// Allow access, but alert the user to change password
						if(pswd.value == hashPsWd){
							loggedin = 1;
							alert('You are using default password\nChange the password at the earliest');
							//alert4chgpswd();
						}
					}
					else if(bcrypt.compareSync(pswd.value, hashPsWd)) {
						// Passwords match
						loggedin = 1;
					}

					if(loggedin == 1){
						alert ("Successfully LoggedIn");
						user.login_id = uid.value;
						updateLoggedInUser(user);
						getAppsTypesList(OBoxID);		// Passing OBoxID, so that if ==0 add/update all insts else add/update specific

						//goBack();		//moved to saveUsrInstllations()
					} else {
						// Passwords don't match
						alert ("Login Failed: 2");
					}
				}
			});
		}
	})	.success(function() {
			myAlert("LoginJs-login().success()", 5);
			//goBack();
		})
		.error(function() {
			myAlert("LoginJs-login().error()", 4);
		})
		.complete(function() {
			//alert("complete");
		}
	);
	function checkajaxkill(){
		if(isneedtoKillAjax){
			retObj.abort();
			alert('Timeout: Login Request');
		}else{
			//alert('no need to kill ajax');
		}
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
		alert('OBox No: ' + OBoxID + ' Removed ');
		goBack();
	}
	else{
		//alert('You Cancelled Logout Event');
	}
}

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

$('#uoptions').live('pageshow', function(event) { //pageshow pageinit
	getUserOptions();
});

function getUserOptions(){
	alert('getUserOptions-1');
	
	uIdObj = document.getElementById('uid');
	uIdObj.text = "LastName, FirstName (userid)";
	
	titleObj = document.getElementById('titleImg');
	
	titleObj.src = "imgs/place.png";
	titleObj.height = "50";
	titleObj.width = "70";
	titleObj.text = "OWLBox#";
	//titleObj.align = "mid";
	document.getElementById('OBoxNo').innerHTML = "3";
	//document.getElementById('OBoxNo').color = "00ff00";
	
	addressObj = document.getElementById('address');
	addressObj.innerHTML = "House No. 12, St. No. 6, Block 'E', Naval Anchorage, Islamabad";
	
	//logoutObj = document.getElementById('logOutImg');
	//logoutObj.onclick = "logout";
}

function cancel(){
	
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
        // IOS DEVICE
        history.go(-1);
    } else if (userAgent.match(/Android/i)) {
        // ANDROID DEVICE
        navigator.app.backHistory();
    } else {
        // EVERY OTHER DEVICE
        history.go(-1);
    }

}

function logout(){
	navigator.notification.confirm(
		'Are you sure you want to logout?',  // message
		onConfirmLogout,              // callback to invoke with index of button pressed
		'Game Over',            // title
		'Restart,Exit'          // buttonLabels
	);
}

function onConfirmLogout(button){
	if(button == 1){
		alert('Logged out ');
	}
	else{
		alert('You Cancelled Logout Event');
	}
}

function chgpsword(){
	navigator.notification.confirm(
		'Are you sure you want to change password?',  // message
		onConfirmChgpsword,              // callback to invoke with index of button pressed
		'Game Over',            // title
		'Restart,Exit'          // buttonLabels
	);
}

function onConfirmChgpsword(button){
	if(button == 1){
		alert('Se ');
	}
	else{
		alert('You Cancelled Change Password');
	}
}

function removeInst(){
	navigator.notification.confirm(
		'Are you sure you want to remove the installation from the list?',  // message
		onConfirmRemoveInst,              // callback to invoke with index of button pressed
		'Game Over',            // title
		'Restart,Exit'          // buttonLabels
	);
}

function onConfirmRemoveInst(button){
	if(button == 1){
		alert('Installation Removed ');
		cancel();
	}
	else{
		alert('You Cancelled Logout Event');
	}
}
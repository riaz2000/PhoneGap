$('#loginPage').live('pageshow', function(event) { //pageshow pageinit
	getInfo();
});

//});
function getInfo(){
	alert('loginPage-getInfo-1');
	
	myObj = document.getElementById('LoginmsgObj');
	//myObj.standby = "Retrieving ...";
	myObj.data = "http://localhost/owl/services/login.php";
}

//document.addEventListener("deviceready", //function(){
function login(){
	
	myObj = document.getElementById('LoginmsgObj');
	//myObj.standby = "Retrieving ...";
	myObj.data = "http://localhost/owl/services/login.php?loginid='rhussain'";
	
	
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

function login2(){
	if (window.XMLHttpRequest){
		xmlhttp=new XMLHttpRequest();
	}

	else{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}

	var PageToSendTo = "http://localhost/owl/services/login.php?";
	var MyVariable = "rhussain";
	var VariablePlaceholder = "loginid=";
	var UrlToSend = PageToSendTo + VariablePlaceholder + MyVariable;

	xmlhttp.open("GET", UrlToSend, false);
	xmlhttp.send();
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

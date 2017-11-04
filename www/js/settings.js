//document.addEventListener("deviceready", function(){
    //mycode
$('#settingsPage').live('pageshow', function(event) { //pageshow pageinit
	getServerInfo();
});

//});
function getServerInfo(){
	obaddr = document.getElementById('OBAddress');
	osaddr = document.getElementById('OSAddress');
	verbos = document.getElementById('Verbosity');
	
	obaddr.value = localStorage.getItem('owlbaddr');
	osaddr.value = localStorage.getItem('owlsaddr');
	verbos.value = localStorage.getItem('verboseLvl');
	/*
	y = document.getElementById('textline');
	y.value = localStorage.getItem("mynumber");
	//alert("Hey There!!!");
	$('#fullName').text(localStorage.getItem("mynumber"));
	//$('#textline').text(localStorage.getItem("mynumber"));
	*/
}

//document.addEventListener("deviceready", //function(){
function update(){
    //remember code
	var obaddr = document.getElementById('OBAddress').value;
	var osaddr = document.getElementById('OSAddress').value;
	var verbos = document.getElementById('Verbosity').value;
	
	localStorage.setItem('owlbaddr',obaddr);
	localStorage.setItem('owlsaddr',osaddr);
	localStorage.setItem('verboseLvl',verbos);
	
	
	alert("Information Stored");
	
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
	
	//history.go(-1);
	//navigator.app.backHistory();

    //var texttosave = document.getElementById("textline").value ;
    //localStorage.setItem("mynumber", texttosave);

	//confirm("Press a button! " + texttosave);

}
//, false);

function cancel(){
	//recall code
	//history.go(-1);
	//navigator.app.backHistory();
	
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
	
	
	//history.back()

	//navigator.notification.alert("PhoneGap is ready!");
	
    //document.getElementById("textline").innerHTML = localStorage.getItem("mynumber"); 
	//confirm("Press a button!" + localStorage.getItem("mynumber"));
}

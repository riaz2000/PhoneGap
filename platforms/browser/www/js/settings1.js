$('#settingsPage').live('pageshow', function(event) {
	//var id = getUrlVars()["id"];
	//$.getJSON(serviceURL + 'getemployee.php?id='+id, displayEmployee);
	//document.getElementById("textline").innerHTML = localStorage.getItem("mynumber");
	$('#textline').text('Hereeeee');
});

$('#settingsPage').bind('pageinit', function(event) {
	//getEmployeeList();
	//myfunction3();
	//document.getElementById("textline").innerHTML = localStorage.getItem("mynumber");
	$('#textline').text('Hereeeee');
});
*/
function myfunction1(){
    //remember code
    var texttosave = document.getElementById("textline").value ;
    localStorage.setItem("mynumber", texttosave);
	confirm("Press a button! " + texttosave);
	//$('#textline').text('Hereeeee');
	
	/*
	cordova.plugins.notification.local.schedule({
            id: 1,
            text: 'My first notification',
            every: 'hour',
            firstAt: next_monday,
            data: { key:'value' }
        });
		*/
}

function myfunction2(){
    //recall code
    document.getElementById("textline").innerHTML = localStorage.getItem("mynumber"); 
	confirm("Press a button!" + localStorage.getItem("mynumber"));
	//navigator.notification.alert("PhoneGap is ready!");
	/*
	navigator.notification.alert(
    'You are the winner!',  // message
    alertDismissed,         // callback
    'Game Over',            // title
    'Done'                  // buttonName
	);
	*/
}

function myfunction3(){
	//$('#textline').text('Hereeeee');
	// Wait for PhoneGap to load

	document.addEventListener("deviceready", onDeviceReady, false);

	// PhoneGap is ready

	function onDeviceReady() {
		confirm("Press a button!" + localStorage.getItem("mynumber"));
		//$('#textline').text('Hereeeee');
		/*
		window.localStorage.setItem("key", "minhbinh");
		var keyname = window.localStorage.key(i);
		// keyname is now equal to "key"
		var value = window.localStorage.getItem("key");
		// value is now equal to "value"
		//window.localStorage.removeItem("key");
		//window.localStorage.clear();
		// localStorage is now empty
		$("p#p1").text(value);
		*/
	}
}
/*
function myfunction4(){
	function alertDismissed() {
    // do something
}

navigator.notification.alert(
    'You are the winner!',  // message
    alertDismissed,         // callback
    'Game Over',            // title
    'Done'                  // buttonName
);
}
*/

/*
function myFunction() {
	localStorage.setItem("OWLBoxAdd", document.getElementById("a").value);

    var txt;
    var r = confirm("Press a button!");
    if (r == true) {
        txt = "You pressed OK!!";
    } else {
        //txt = "You pressed Cancel!!";
		txt = localStorage.getItem("OWLBoxAdd");
    }
    document.getElementById("demo").innerHTML = txt;
	document.getElementById("b").v
	
}
*/
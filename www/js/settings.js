$('#settingsPage').live('pageshow', function(event) { //pageshow pageinit
	getServerInfo();
});

function getServerInfo(){
	obaddr = document.getElementById('OBAddress');
	osaddr = document.getElementById('OSAddress');
	
	obaddr.value = localStorage.getItem('owlbaddr');
	osaddr.value = localStorage.getItem('owlsaddr');
	
	/*
	y = document.getElementById('textline');
	y.value = localStorage.getItem("mynumber");
	//alert("Hey There!!!");
	$('#fullName').text(localStorage.getItem("mynumber"));
	//$('#textline').text(localStorage.getItem("mynumber"));
	*/
}

function update(){
    //remember code
	var obaddr = document.getElementById('OBAddress').value;
	var osaddr = document.getElementById('OSAddress').value;
	
	localStorage.setItem('owlbaddr',obaddr);
	localStorage.setItem('owlsaddr',osaddr);
	
	alert("Information Stored");
	
	history.go(-1);
	navigator.app.backHistory();

    //var texttosave = document.getElementById("textline").value ;
    //localStorage.setItem("mynumber", texttosave);

	//confirm("Press a button! " + texttosave);

}

function cancel(){
	//recall code
	history.go(-1);
	navigator.app.backHistory();

	//navigator.notification.alert("PhoneGap is ready!");
	
    //document.getElementById("textline").innerHTML = localStorage.getItem("mynumber"); 
	//confirm("Press a button!" + localStorage.getItem("mynumber"));
}

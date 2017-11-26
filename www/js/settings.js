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
function updateSettings(){
    //remember code
	var obaddr = document.getElementById('OBAddress').value;
	var osaddr = document.getElementById('OSAddress').value;
	var verbos = document.getElementById('Verbosity').value;
	
	localStorage.setItem('owlbaddr',obaddr);
	localStorage.setItem('owlsaddr',osaddr);
	localStorage.setItem('verboseLvl',verbos);
	
	
	alert("Information Stored");
	
	goBack();

}
//, false);

function cancel(){
	goBack()
}


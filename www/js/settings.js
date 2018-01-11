//document.addEventListener("deviceready", function(){
    //mycode
var vis=1;
$('#settingsPage').live('pageshow', function(event) { //pageshow pageinit
	getSettings();
});

//});
function getSettings(){
	obaddr = document.getElementById('OBAddress');
	osaddr = document.getElementById('OSAddress');
	//verbos = document.getElementById('Verbosity');
	verbosSldr = document.getElementById('VerbositySldr');
	
	obaddr.value = localStorage.getItem('owlbaddr');
	osaddr.value = localStorage.getItem('owlsaddr');
	//verbos.value = localStorage.getItem('verboseLvl');
	verbosSldr.value=parseInt(localStorage.getItem('verboseLvl'));
	//verbosSldr.slider("option", "value", verbosSldr.value);
	//verbosSldr.slider('refresh');
	
	document.getElementById('popupLgMenu').style.visibility = 'hidden';
	vis = 0;
}

function updateSettings(){
    //remember code
	var obaddr = document.getElementById('OBAddress').value;
	var osaddr = document.getElementById('OSAddress').value;
	//var verbos = document.getElementById('Verbosity').value;
	var verbos = document.getElementById('VerbositySldr').value;
	
	localStorage.setItem('owlbaddr',obaddr);
	localStorage.setItem('owlsaddr',osaddr);
	localStorage.setItem('verboseLvl',verbos);
	
	
	alert("Information Updated");
	
	goBack();

}

function cancel(){
	goBack()
}

function test(){
	//document.getElementById('colDiv').hide;
	if(vis==1){
		document.getElementById('popupMen').style.visibility = 'hidden';
		vis = 0;
	}
	else if(vis==0){
		document.getElementById('popupMen').style.visibility = 'visible';
		vis = 1;
	}
	/*
	var myDiv = document.createElement('div');
	var myH2 = document.createElement('h2');
	document.getElementById('settingsPage').appendChild(myDiv);
	myDiv.style.position="absolute";
	myDiv.style.left="200px";
	myDiv.style.top="200px";
	//myDiv.data-role="collapsible";
	//myDiv.data-inset="false";
	myH2.text = "Operations";
	myDiv.appendChild(myH2);
	*/
}

function ShowOld(){
	alert("Function Called");
}

function popupLogin1(){
	if(vis==1){
		document.getElementById('popupLgMenu').style.visibility = 'hidden';
		vis = 0;
	}
	else if(vis==0){
		document.getElementById('popupLgMenu').style.visibility = 'visible';
		vis = 1;
	}
}


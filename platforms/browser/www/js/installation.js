$('#installation').live('pageshow', function(event) { //pageshow pageinit
	getInstallationInfo();
});

function getInstallationInfo(){
	myObj = document.getElementById('instObj');
	
	var url = localStorage.getItem('owlbaddr');
	//myObj.data = "http://localhost/owl/services/installation.php";
	myObj.height = "100%";
	myObj.data = "http://" + url + "/owl/services/installation.php";
	//alert('InstPage-1');
}

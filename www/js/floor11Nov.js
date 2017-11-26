$('#floor').live('pageshow', function(event) { //pageshow pageinit
	getFloorInfo();
});

function getFloorInfo(){
	alert('FloorPage-1');
	myObj = document.getElementById('floorObj');
	
	var url = localStorage.getItem('owlbaddr');
	//myObj.data = "http://localhost/owl/services/installation.php";
	myObj.height = "100%";
	//myObj.data = "http://" + url + "/owl/services/installation.php";
	myObj.data = "http://localhost/owl/services/installation.php";
	//
}

var OBoxID;
$('#uoptions').live('pageshow', function(event) { //pageshow pageinit
	getUserOptions();
});

function getUserOptions(){
	//alert('getUserOptions-1');
	OBoxID = getUrlVars()['OBoxID'];

	//alert("OBoxID: " + OBoxID);
	oboxObjStr = getOBoxObjstr(OBoxID);
	//alert("oboxObjStr: " + oboxObjStr);
	if(oboxObjStr == "InvalidOBox")
		myAlert("OBox Not Registered",1);
	else{
		OBox = JSON.parse(oboxObjStr);
		console.log(oboxObjStr);

		title = document.getElementById('pgTitle');
		title.innerHTML = OBox.ufname + " " + OBox.ulname + " @ OBox " + OBox.OBoxNo;

		//OBox.userId + "@" + OBox.OBoxNo + "CtrlLvl: " + OBox.uLoginLvl;

		uIdObj = document.getElementById('uid');
		uIdObj.innerHTML = OBox.userId;
		//OBox.ufname + " " + OBox.ulname + "\n(" + OBox.userId +")";

		titleObj = document.getElementById('titleImg');

		titleObj.src = "img/place.png";
		titleObj.height = "50";
		titleObj.width = "70";
		titleObj.text = "OWLBox#";
		//titleObj.align = "mid";
		document.getElementById('OBoxNo').innerHTML = OBoxID;
		//document.getElementById('OBoxNo').color = "00ff00";

		addressObj = document.getElementById('address');
		addressObj.innerHTML = OBox.instAddr1 + ", " + OBox.instAddr2 + ", \n" +
								OBox.instCity + ", " + OBox.instState + ", " +
								OBox.instZip + ", \n" + OBox.instCountry;


		$('#uopts li').remove();

		$('#uopts').append('<li onclick="logout()"><a href="#"><img id="logOutImg" src="img/lock.png" /><font size="" color="800000"><h1>Lock Access</h1></font></a></li>');

		$('#uopts').append('<li><a href="chgPswd.html?OBoxID='+OBoxID+'"><img id="chgPswdImg" src="img/chgpwd.png" /><font size="" color="800000"><h1>Change Password</h1></font></a></li>');

		$('#uopts').append('<li onclick="removeInst()"><a href="#"><img id="removeInstImg" src="img/place_rmv.png" /><font size="" color="800000"><h1>Delete</h1></font></a></li>');


		$('#uopts').listview('refresh');
	}
}

function logout(){
	navigator.notification.confirm(
		'Are you sure you want to logout?',  // message
		onConfirmLogout,              // callback to invoke with index of button pressed
		'Logout',            // title
		'Yes,No'          // buttonLabels
	);
}

function onConfirmLogout(button){
	if(button == 1){

		oboxObjStr = getOBoxObjstr(OBoxID);
		if(oboxObjStr == "InvalidOBox")
			myAlert("OBox Not Registered",1);
		else{
			OBox = JSON.parse(oboxObjStr);

			OBox.uLoginState = 0;
			updateOBox(OBoxID, OBox);
		}

		alert('Logged out ');
		goBack();
	}
	else{
		alert('You Cancelled Logout Event');
	}
}
function chgPsWd(){
	OBoxID = getUrlVars()['OBoxID'];
	var imgchgPswd = document.getElementById('chgPswdImg');
	url = "chgPswd.html?OBoxID="+OBoxID;
	imgchgPswd.onclick = window.open(url);
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
		alert('Installation Removed ');
		goBack();
	}
	else{
		//alert('You Cancelled Logout Event');
	}
}

var OBoxID;
var floors;
$('#installation').live('pageshow', function(event) { //pageshow pageinit
	//getOBoxAddress();
	getInstallationInfo()
});

function getInstallationInfo(){
	OBoxID = getUrlVars()['OBoxID'];

	oboxObjStr = getOBoxObjstr(OBoxID);
	if(oboxObjStr == "InvalidOBox")
		myAlert("OBox Not Registered",1);
	else{
		OBox = JSON.parse(oboxObjStr);
		document.getElementById('msg').innerHTML = "Contacting OWLBox:"+OBoxID+" wait . . . ";

		title = document.getElementById('pgTitle');
		title.innerHTML = OBox.userId;// + "@OBox:" + OBox.OBoxNo;

		uIdObj = document.getElementById('uid');
		uIdObj.innerHTML = OBox.ufname + " " + OBox.ulname;

		var instType = "img/place.png";
		if(OBox.instType == 0 || OBox.instType == 1 || OBox.instType == 2)
			instType = "img/place.png";
		else if(OBox.instType == 3 || OBox.instType == 4 || OBox.instType == 5 ||
						OBox.instType == 6 || OBox.instType == 9)
			instType = "img/plaza.png";
		else if(OBox.instType == 7 || OBox.instType == 8)
			instType = "img/shop.png";

		titleObj = document.getElementById('titleImg');

		titleObj.src = instType;//"img/place.png";
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

		for(i=OBox.highestLvl; i>=OBox.lowestLvl; i--){
			linkToPage = "floormapvw.html?OBoxID="+OBoxID+"&FloorNo="+i+"&CtrlAtmcLvl="+OBox.ctrlAtomicLvl;
			if(i == 0)
				FloorNumber = "Ground Floor";
			else if(i == -1)
				FloorNumber = "Basement";
			else if(i > 0)
				FloorNumber = "Floor " + i;
			else if (i < -1)
				FloorNumber = "Basement " + i;

			href3 = '<span class="ui-li-count"><a href="floorlistvw.html?OBoxID='+OBoxID+'&FloorNo='+i+'&CtrlAtmcLvl='+OBox.ctrlAtomicLvl+'"><img src="' + 'img/menu.png' + '" height=30, width=25/></a></span></a>';
			$('#floorList').append('<li style="background-color:#FF0000;">' +
									'<a href="' + linkToPage + '">' +
									'<img src="'+ 'img/flooricon.png' + '"/>' +
									//'<a href="floorlistvw.html"><img src="'+ 'img/flooricon.png' + '"/></a>' +
									'<B><center>' + FloorNumber + '</center></B></a>' + href3 + '</li>');
		}
		$('#floorList').listview('refresh');

		document.getElementById('msg').innerHTML = "OBox ID: "+OBoxID;
	}
}

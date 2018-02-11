var OBoxID;
var floors;
$('#installation').live('pageshow', function(event) { //pageshow pageinit
	getOBoxAddress();
});

function getInstallationInfo(){
	OBoxID = getUrlVars()['OBoxID'];
	
	//msg = document.getElementById('msg');
	//msg.innerHTML = "Please Wait, Contacting OWLBox:"+OBoxID;
	//alert("OBoxID: " + OBoxID);
	oboxObjStr = getOBoxObjstr(OBoxID);
	//alert("oboxObjStr: " + oboxObjStr);
	if(oboxObjStr == "InvalidOBox")
		myAlert("OBox Not Registered",1);
	else{
		OBox = JSON.parse(oboxObjStr);
		
		document.getElementById('msg').innerHTML = "Contacting OWLBox:"+OBoxID+" wait . . . ";
		
		title = document.getElementById('pgTitle');
		title.innerHTML = OBox.userId + "@OBox:" + OBox.OBoxNo;
		
		//OBox.userId + "@" + OBox.OBoxNo + "CtrlLvl: " + OBox.uLoginLvl;
		
		uIdObj = document.getElementById('uid');
		uIdObj.innerHTML = OBox.ufname + " " + OBox.ulname; 
		//OBox.ufname + " " + OBox.ulname + "\n(" + OBox.userId +")";

		titleObj = document.getElementById('titleImg');
		
		titleObj.src = "imgs/place.png";
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
								
		setTimeout(function() {
			checkajaxkill();
		}, 4000);	//300 mSec
		var p = [ ];
		//serviceURL = 'http://192.168.1.2/owl/services/';
		if(getOBdirectAccess()==1)
			serviceURL = 'http://'+getDirectAccessIP()+'/owl/services/';
		else if(getOBviaInternetAccess()==1){
			osaddr = localStorage.getItem('owlsaddr');
			port = 30000 + parseInt(OBoxID);
			serviceURL = 'http://'+osaddr+':'+port+'/owl/services/';
			//serviceURL = 'http://203.124.40.232:30003/owl/services/';	
		}
		else{
			alert("OWLBox " + OBoxID + " Neither on LAN Nor Accessible over Internet");
			return;
		}

		var isneedtoKillAjax = true;
		var retObj = $.getJSON(serviceURL + 'getinstDetails.php', function(data) {
			isneedtoKillAjax = false;
			
			$('#floorList li').remove();
			floors = data.items;
			
			if(floors.length == 1){
				//NoOfFloors = floors[0].highest_lvl - floors[0].lowest_lvl;
				
				//for(i=0; i<NoOfFloors; i++){
				for(i=floors[0].highest_lvl; i>=floors[0].lowest_lvl; i--){
					
					linkToPage = "floor.html?OBoxID="+OBoxID+"&FloorNo="+i+"&CtrlAtmcLvl="+floors[0].ctrl_atomic_lvl;
					if(i == 0)
						FloorNumber = "Ground Floor";
					else if(i == -1)
						FloorNumber = "Basement";
					else if(i > 0)
						FloorNumber = "Floor " + i;
					else if (i < -1)
						FloorNumber = "Basement " + i;

					$('#floorList').append('<li style="background-color:#FF0000;">' + '<a href="' + linkToPage + '">' + '<B><center>' + FloorNumber + '</center></B></a></li>');
				}
				$('#floorList').listview('refresh');
			}
		})	.success(function() { 
				//alert("second success"); 
				document.getElementById('pgFooter').style.visibility = "hidden";
			})
			.error(function() { 
				//alert("error"); 
			})
			.complete(function() { 
				//alert("complete"); 
			}
		);
		//setTimeout(function(){ p.abort(); alert(JSON.stringify(p)); }, 500);
		p.push(retObj);
		
		function checkajaxkill(){

			// Check isneedtoKillAjax is true or false, 
			// if true abort the getJsonRequest

			if(isneedtoKillAjax){
				//p[i].abort();
				retObj.abort();
				alert('Timeout: Could NOT get Installation Info');                 
			}else{
				//alert('no need to kill ajax');
			}
		}
		
	}
}

function getOBoxAddress(){
	OBoxID = getUrlVars()['OBoxID'];
	setDirectAccessIP("");//directAccessIP="";
	setOBdirectAccess(0);//OBdirectAccess = 0;
	setOBviaInternetAccess(0);//OBviaInternetAccess = 0;
	//1. If have INTERNET
	if(getInernetStatus() == 1){
		osaddr = localStorage.getItem('owlsaddr');
		port = 30000 + parseInt(OBoxID);
		url = 'http://'+osaddr+':'+port+'/owl/services/discoverOwl.php';
		//alert('url: ' + url);
		
		setTimeout(function() {
			checkajaxkill();
		}, 4000);
		var isneedtoKillAjax = true;
		var retObj = $.getJSON(url, function(data) {
			isneedtoKillAjax = false;
			//alert(JSON.stringify(data));
			if(data != null){
				OWLBoxNo = data[0].split(':')[2];
				if(OWLBoxNo != OBoxID){
					alert("Ficticious OWLBox at the given address (Over Internet)");
					return;
				}
			
				//alert(OWLBoxNo+"@"+data[1]);
				updateDirectAccessIP(data[1]);
				setOBviaInternetAccess(1);//OBviaInternetAccess = 1;
				
				getInstallationInfo();
				
				//alert('getOBviaInternetAccess()' + getOBviaInternetAccess());
			}
			//try to reach the OWLBox Directly
			
		}).success(function() { 
				//alert("second success"); 
			})
			.error(function() { 
				alert("OBox-"+OBoxID+" NOT Accessible over Internet"); 
				//Check Direct Access
				oboxObjStr = getOBoxObjstr(OBoxID);
				if(oboxObjStr == "InvalidOBox")
					myAlert("OBox Not Registered",1);
				else{
					OBox = JSON.parse(oboxObjStr);
					checkDirectAccess(OBox.instLastDirectAccessip);
				}
			})
			.complete(function() { 
				//alert("complete"); 
			}
		);
		function checkajaxkill(){
			if(isneedtoKillAjax){
				//p[i].abort();
				retObj.abort();
				alert('Access over internet timeout');                 
			}else{
				//alert('no need to kill ajax');
			}
		}
	}
	else{//try to reach through last DirectAccessIPaddr
		oboxObjStr = getOBoxObjstr(OBoxID);
		if(oboxObjStr == "InvalidOBox")
			myAlert("OBox Not Registered",1);
		else{
			OBox = JSON.parse(oboxObjStr);
			checkDirectAccess(OBox.instLastDirectAccessip);
		}
	}
}

function updateDirectAccessIP(updatedIP){
	OBoxID = getUrlVars()['OBoxID'];
	oboxObjStr = getOBoxObjstr(OBoxID);
	if(oboxObjStr == "InvalidOBox")
		myAlert("OBox Not Registered",1);
	else{
		OBox = JSON.parse(oboxObjStr);
		/*
		var updatedObj = {"OBoxNo":OBoxID, "instType":OBox.instType, 					"ctrlAtomicLvl":OBox.ctrlAtomicLvl,
							"loginRqrdInside":OBox.loginRqrdInside, "instAddr1":OBox.instAddr1, "instAddr2":OBox.instAddr2,
							"instCity":OBox.instCity, "instState":OBox.instState, "instZip":OBox.instZip, "instCountry":OBox.instCountry,
							"instLastDirectAccessip":updatedIP, "unr":OBox.unr, "ufname":OBox.ufname, "ulname":OBox.ulname, "userId":OBox.userId, "userPwd":"",	"uLoginLvl":OBox.uLoginLvl, "uLoginState":1};
		
		updateOBox(OBoxID, updatedObj);
		*/
		OBox.instLastDirectAccessip = updatedIP;
		updateOBox(OBoxID, OBox);
		checkDirectAccess(updatedIP);
		
	}
}

function checkDirectAccess(IPaddr){
	OBoxID = getUrlVars()['OBoxID'];
	url = 'http://'+IPaddr+'/owl/services/discoverOwl.php';
	//alert('url: ' + url);
	
	setTimeout(function() {
		checkajaxkill();
	}, 500); //Should respond within 0.5 sec
	var isneedtoKillAjax = true;
	var retObj = $.getJSON(url, function(data) {
		isneedtoKillAjax = false;
		alert(JSON.stringify(data));
		if(data != null){
			OWLBoxNo = data[0].split(':')[2];
			
			if(OWLBoxNo != OBoxID){
				alert("Ficticious OWLBox at the given address (Direct Access)");
				alert("OWLBoxNo: " + OWLBoxNo + " ::: OBoxID: " + OBoxID);
				return;
			}
			
			setDirectAccessIP(IPaddr);//directAccessIP = IPaddr;
			
			setOBdirectAccess(1);//OBdirectAccess = 1;
			//alert('getOBdirectAccess()' + getOBdirectAccess());
			getInstallationInfo();
		}
		
	}).success(function() { 
			//alert("second success"); 
		})
		.error(function() { 
			myAlert("OBox-"+OBoxID+" NOT Directly Accessible",4); 
		})
		.complete(function() { 
			//alert("complete"); 
		}
	);
	function checkajaxkill(){
		if(isneedtoKillAjax){
			//p[i].abort();
			retObj.abort();
			alert('killing after timeout');                 
		}else{
			//alert('no need to kill ajax');
		}
	}
}


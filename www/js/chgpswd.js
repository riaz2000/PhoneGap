//document.addEventListener("deviceready", function(){
    //mycode
var OBoxID;
var userNR;
$('#chgPswdPage').live('pageshow', function(event) { //pageshow pageinit
	getInfo();
});

//});
function getInfo(){
	OBoxID = getUrlVars()['OBoxID'];
	
	//alert("OBoxID: " + OBoxID);
	oboxObjStr = getOBoxObjstr(OBoxID);
	//alert("oboxObjStr: " + oboxObjStr);
	if(oboxObjStr == "InvalidOBox")
		myAlert("OBox Not Registered",1);
	else{
		OBox = JSON.parse(oboxObjStr);
		
		//alert("OBoxID: " + OBoxID);
		
		title = document.getElementById('pgTitle');
		title.innerHTML = OBox.ufname + " " + OBox.ulname + " @ OBox " + OBox.OBoxNo;
		
		//OBox.userId + "@" + OBox.OBoxNo + "CtrlLvl: " + OBox.uLoginLvl;
		
		uIdObj = document.getElementById('uid');
		uIdObj.innerHTML = OBox.userId;
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
								
								}
}

//document.addEventListener("deviceready", //function(){
function update(){
	OBoxID = getUrlVars()['OBoxID'];
	
	//alert("OBoxID: " + OBoxID);
	oboxObjStr = getOBoxObjstr(OBoxID);
	//alert("oboxObjStr: " + oboxObjStr);
	if(oboxObjStr == "InvalidOBox"){
		myAlert("OBox Not Registered",1);
		return;
	}
	
	OBox = JSON.parse(oboxObjStr);
	
	oldpswd = document.getElementById('OldPsWd');
	newpswd1 = document.getElementById('NewPsWd1');
	newpswd2 = document.getElementById('NewPsWd2');
	
	if(newpswd1.value == ""){
		myAlert("Empty Passwords NOT Allowed",0);
		return;
	}
	
	if(newpswd1.value != newpswd2.value){
		myAlert("Your New Passwords Do NOT Match",0);
		return;
	}
	
	setTimeout(function() {
		checkajaxkill();
	}, 300);	//300 mSec
	//var p = [ ];
	serviceURL = 'http://localhost/owl/services/';
	
	//First check if the password entered is correct
	var isneedtoKillAjax = true;
	var retObj = $.getJSON(serviceURL + 'getHashPwd.php?uid='+OBox.userId, function(data) {
		isneedtoKillAjax = false;
		users = data.items;
		
		if(users!=null && users.length==1){
			hashPsWd = users[0].login_pswd;
			if(bcrypt.compareSync(oldpswd.value, hashPsWd) || hashPsWd.value=="1234"){
				alert("You are Ready for Password Change");
				userNR = users[0].nr;
				updatePsWd(userNR, newpswd1.value);
			}
			else{
				alert("Access Denied");
			}
		}
		else if(users.length>1){
			myAlert("Multiple Users With Same ID: DB Err.", 1);
		}
		
	})	.success(function() { 
			alert("second success"); 
		})
		.error(function() { 
			alert("error2"); 
		})
		.complete(function() { 
			//alert("complete"); 
		}
	);
	
	function checkajaxkill(){

		// Check isneedtoKillAjax is true or false, 
		// if true abort the getJsonRequest

		if(isneedtoKillAjax){
			//p[i].abort();
			retObj.abort();
			alert('Request Timeout');                 
		}else{
			//alert('no need to kill ajax');
		}
	}
}

function updatePsWd(nr, pswd){
	serviceURL = 'http://localhost/owl/services/';
	//UPDATE tab_users SET login_lvl = 8, lname = 'Riaz' WHERE login_id = 'hriaz'
	hashedPsWd = bcrypt.hashSync(pswd, 12);
	
	var query = "UPDATE tab_users SET login_pswd = '" + hashedPsWd + "' WHERE nr = '" +nr+ "'";
	alert(query +":" + hashedPsWd);
	
	setTimeout(function() {
		checkajaxkill();
	}, 300);	//300 mSec
	isneedtoKillAjax = true;
	
	var retObj = $.getJSON(serviceURL + 'update.php?sql='+query, function(data) {
		isneedtoKillAjax = false;	

		alert("RcvdResp:" + data);
		
	})	.success(function() { 
			alert("Passwod Updated");
		})
		.error(function() { 
			alert("error1"); 
		})
		.complete(function() { 
			//alert("complete"); 
		}
	);
	//setTimeout(function(){ p.abort(); alert(JSON.stringify(p)); }, 500);
	//p.push(retObj);
	function checkajaxkill(){

		// Check isneedtoKillAjax is true or false, 
		// if true abort the getJsonRequest

		if(isneedtoKillAjax){
			//p[i].abort();
			retObj.abort();
			alert('Request Timeout');                 
		}else{
			//alert('no need to kill ajax');
		}
	}

	goBack();

}
	
function cancel(){
	goBack();
}


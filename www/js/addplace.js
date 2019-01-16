var serviceURL = 'http://'+localStorage.getItem('serveraddr')+'/OWL/Services/';
Apps = [];
//var lstdOBs = [];

var selectedOBoxIP = "";
var selectedOBoxId = 0;

function getAppsList(){
	isneedtoKillAjax = true;
	setTimeout(function() {
		checkajaxkill();
	}, 3000);
	var query = "SELECT nr, appliance_name FROM tab_appliances";
	var retObj = $.getJSON(serviceURL + 'select.php?sql='+query, function(data) {
	//var retObj = $.getJSON(serviceURL + 'getUserInsts.php?unr='+userNR, function(data) {
		isneedtoKillAjax = false;
		Apps = data.items;
	})
	.success(function() {
			console.log('Success-Qry: '+query);
	})
	.error(function() {
		//myAlert("LoginJs-login().error()", 4);
		console.log('Error-Qry: '+query);
	})
	.complete(function() {
		//alert("complete");
		console.log('Complete-Qry: '+query);
	});
	function checkajaxkill(){
		if(isneedtoKillAjax){
			retObj.abort();
			alert('Timeout: Login Request');
		}else{
			//alert('no need to kill ajax');
		}
	}
}

function getInstsOfLoggedInUser(userNR){
	isneedtoKillAjax = true;
	setTimeout(function() {
		checkajaxkill();
	}, 3000);
	var retObj = $.getJSON(serviceURL + 'getUserInsts.php?unr='+userNR, function(data) {
		isneedtoKillAjax = false;
		insts = data.items;
		$.each(insts, function(index, OBox) {
			//alert(JSON.stringify(OBox));
			selectedOBoxId = OBox.nr;

			userObj = JSON.parse(localStorage.getItem('LoggedInUser'));

			newOBoxObj = {"OBoxNo":selectedOBoxId, "instType":OBox.inst_type, "ctrlAtomicLvl":OBox.ctrl_atomic_lvl,
					"loginRqrdInside":OBox.loginRqrdInside, "lowestLvl":OBox.lowest_lvl, "highestLvl":OBox.highest_lvl,
					"floorNumber":OBox.floor_number, "instAddr1":OBox.address1, "instAddr2":OBox.address2,
					"instCity":OBox.city, "instState":OBox.state, "instZip":OBox.zip, "instCountry":OBox.country,
					"instLastDirectAccessip":selectedOBoxIP, "unr":userObj.nr, "ufname":userObj.fname, "ulname":userObj.lname,
					"userId":userObj.login_id, "userPwd":"", "uLoginLvl":OBox.user_control_lvl, "uLoginState":1};

			OBstring = JSON.stringify(newOBoxObj);
			addOBox(OBstring);
			getResrsOfUsrOnInst(newOBoxObj.unr,
														newOBoxObj.OBoxNo,
														newOBoxObj.ctrlAtomicLvl);
			//goBack();
		});

	})	.success(function() {
			myAlert("LoginJs-login().success()", 5);
			//goBack();
		})
		.error(function() {
			myAlert("LoginJs-login().error()", 4);
		})
		.complete(function() {
			//alert("complete");
		}
	);
	function checkajaxkill(){
		if(isneedtoKillAjax){
			retObj.abort();
			alert('Timeout: Login Request');
		}else{
			//alert('no need to kill ajax');
		}
	}
}

function getResrsOfUsrOnInst(usrNR, instNR, ctrlAtomicLvl){
	setTimeout(function() {
		checkajaxkill();
	}, 4000);	//300 mSec
	var p = [ ];
	var isneedtoKillAjax = true;

	var query = "SELECT * FROM tab_resources WHERE inst_number=" + OBoxID + " AND loc_lvl1="+FloorNo;
	var retObj = $.getJSON(serviceURL + 'select.php?sql='+query, function(data) {
		isneedtoKillAjax = false;

		appliances = data.items;

		if(appliances.length == 0)
			console.log("No Registered Appliances for User " , 0);

		$.each(appliances, function(index, appliance) {
			if(CtrlAtomicLvl == 0){
				appliance.usrCtrlLvlonRes = OBox.uLoginLvl;
				addApplianceInList(appliance);
			}
			else if(CtrlAtomicLvl == 3){
				isneedtoKillAjax1 = true;

				var query = "SELECT * FROM tab_ur WHERE resource_number="+appliance.nr +" AND user_number="+OBox.unr;
				//alert(query);
				setTimeout(function() {
					if(isneedtoKillAjax1){
						retObj1.abort();
						myAlert('Timeout: Resource Query FROM tab_ur',0);
					};
				}, 4000);	//300 mSec
				var retObj1 = $.getJSON(serviceURL + 'select.php?sql='+query, function(data){
					isneedtoKillAjax1 = false;
					uResrcs = data.items;
					if(uResrcs.length == 1){
						appliance.usrCtrlLvlonRes = uResrcs[0].user_control_lvl;
						addApplianceInList(appliance);
					}
				}).success(function() {
					//alert("second success");
					})
					.error(function() {
						myAlert("error tab_ur", 4);
					})
					.complete(function() {
						//alert("complete");
						RsrcsOnSlctdFlrArr = appliances;
					}
				);

			}
		});


	})	.success(function() {
			//alert("second success");
			getStatusofAllApps();
		})
		.error(function() {
			myAlert("error", 4);
		})
		.complete(function() {
			//alert("complete");
			RsrcsOnSlctdFlrArr = appliances;
			//$('#floorResLst').listview('refresh');
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
			myAlert('Resource Query Timeout',0);
		}else{
			//alert('no need to kill ajax');
		}
	}
}

function addResToResArray(FloorNo, appliance){


}

function getAreasOfInst(){
	var query = "SELECT * FROM tab_areas WHERE inst_number="+OBoxID + ";	// & floor_number="+FloorNo;
	setTimeout(function() {
		checkajaxkill();
	}, 4000);
	var isneedtoKillAjax = true;
	var retObj = $.getJSON(serviceURL + 'select.php?sql='+query, function(data) {
		isneedtoKillAjax = false;

		areas = data.items;

	})	.success(function() {
			//alert("second success");
		})
		.error(function() {
			//alert("error");
		})
		.complete(function() {
			//alert("complete");
			AreasOnSlctdFlrArr = areas;
			getResourcesOnFloorForUser();
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
			alert('Timeout: Could NOT get Areas List for Floor');
		}else{
			//alert('no need to kill ajax');
		}
	}
}

function getAppsTypes(){	//types of the Appliances
	setTimeout(function() {
		checkajaxkill();
	}, 4000);
	var isneedtoKillAjax = true;
	var query = "SELECT * FROM tab_appliances";// WHERE loc_lvl1="+FloorNo;
	var retObj = $.getJSON(serviceURL + 'select.php?sql='+query, function(data) {
		isneedtoKillAjax = false;

		applianceTypes = data.items;

	})	.success(function() {
			//alert("second success");
		})
		.error(function() {
			//alert("error");
		})
		.complete(function() {
			//alert("complete");
			getDefinedAreas();
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
			alert('Timeout: Could NOT get Application List');
		}else{
			//alert('no need to kill ajax');
		}
	}
}



// translate text string to Arrayed buffer
function text2ArrayBuffer(str /* String */ ) {
    var encoder = new TextEncoder('utf-8');
    return encoder.encode(str).buffer;
}

// translate Arrayed buffer to text string
function arrayBuffer2Text(buffer /* ArrayBuffer */ ) {
    var dataView = new DataView(buffer);
    var decoder = new TextDecoder('utf-8');
    return decoder.decode(dataView);
}

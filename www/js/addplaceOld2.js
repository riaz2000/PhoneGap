var serviceURL = "http://localhost/owl/services/";
//var WifiIPaddr="";
//var CarIPaddr="";

var lstdOBs = [];
$('#addplacePage').live('pageshow', function(event) { //pageshow pageinit

	networkinterface.getWiFiIPAddress(function (ip) { 
		alert('WiFi-IP = ' + ip); 
		WifiIPaddr = ip;
		
		obip = document.getElementById('OBIP');
	
		obip.value = ip + ',5';
		//obip.value = '192.168.1.6,5';
		
	});
	networkinterface.getCarrierIPAddress(function (ip) { alert('Carrier-IP = ' + ip); CarIPaddr = ip;});
	
	//alert('WiFi-IPAddr = ' + WifiIPaddr);
	// with subnet and error handler
	networkinterface.getWiFiIPAddress(
		function (ip, subnet) { alert('WiFi-IP/Subnet' + ip + "/" + subnet); }, 
		function (err) { alert("Err: " + err); }
	);
	
	/*
	srchBtn = document.getElementById('BtnSRCH');
	
	srchBtn.href = '#search1';
	
	addBtn = document.getElementById('BtnOBID');
	
	addBtn.href = '#add()';
	*/
	//addplace_getinfo1();
	
	//sendTo("2:5:0:7\n", "192.168.1.2", 1214);
});
//serviceURL = "http://192.168.1.2/owl/services/";
function addplace_getinfo2(){
	alert('RH-1');
	chrome.sockets.udp.create({}, function (createInfo) { 
		alert('RH-2');
		var _socketUdpId= createInfo.socketId;
		/// connect the socket to the port 55555
		chrome.sockets.udp.bind(_socketUdpId, "0.0.0.0", _udpScanPort, function(result) {
			console.log(result);
		});
		alert('RH-3');
		/// add the listener
		chrome.sockets.udp.onReceive.addListener(function (info) {
			if (typeof $localStorage.list === 'undefined') {
				$localStorage.list= new Array();
			}
			var data= arrayBuffer2str(info.data);
			var row= { 
				"addr": info.remoteAddress,
				"data": data
			};
			$localStorage.list.push(row);
		});
		/// the timeout set the end of the listening
		setTimeout(function() {
			chrome.sockets.udp.close(_socketUdpId, function() {
				/// close the socket
				$ionicLoading.hide();
				deferred.resolve($localStorage.list);
			});
		}, delay);
	});
	alert('RH-1b');
}
function addplace_getinfo1(){
	alert('addplace_getinfo1');
	chrome.sockets.udp.create({}, function(socketInfo) {
	  // The socket is created, now we can send some data
	  alert('addplace_getinfo1-1');
	  var socketId = socketInfo.socketId;
	  alert('addplace_getinfo1-2: ' + socketId);
	  chrome.sockets.udp.send(socketId, text2ArrayBuffer("2:5:0:7\n"),//arrayBuffer,
		'192.168.1.2', 1214, function(sendInfo) {
		  console.log("sent " + sendInfo.bytesSent);
		  alert("sent " + sendInfo.bytesSent);
	  });
	});
}

function addplace_getinfo(){
	alert('Heeee 1');
	//var OWLBoxNo;
	var WifiIPaddr;
	$('#installationList2 li').remove();

	networkinterface.getWiFiIPAddress(function (ip) {
		//myIPlastOctt = ip.split('.')[3];
		//var obipLastOctt = document.getElementById('OBIP').value;
		//alert('obipLastOctt' + obipLastOctt);
		//alert('Heeee');
		for (i = 1; i < 4; i++) { 
			//serviceURL = "http://192.168.1."+i+"/owl/services/";
		
			//serviceURL = "http://192.168.1.255/owl/services/";
			//WifiIPaddr = ip;
			//alert('WifiIPaddr - '+ip+'...'+i);
			//var IPaddrOctt = WifiIPaddr.split('.');
			//var ipPrefix = IPaddrOct[0] + '.' +  IPaddrOct[1] + '.' + IPaddrOct[2] + '.';
	
			ipPrefix = ip.split('.')[0] + '.' + ip.split('.')[1] + '.' + ip.split('.')[2] + '.';
			//alert('Here22 - '+ipPrefix);
			
			serviceURL = 'http://' + ipPrefix + i + '/owl/services/';
			alert('Here21 - '+serviceURL);
		
			//serviceURL = "http://192.168.1.6/owl/services/";
			$.getJSON(serviceURL + 'discoverOwl.php', function(data) {
				/*owlBoxes = data.items;
				$.each(owlBoxes, function(index, owlBox) {
						alert('Here - '+owlBox.name);
				});
				*/
				//alert('Here - '+data[1]);
				//alert('Here - '+data[0]);
				
				//$fields = explode(":", data[0]);
				//OWLBoxNo = $fields[2];
				OWLBoxNo = data[0].split(':')[2];
				//alert('OWLBoxNo = '+OWLBoxNo);
				
				//if(OWLBoxNo!=null)
					//$('#installationList2').append('<li> <img src="imgs/place.png" width="50px" height="50" /> OWLBox <B>' + OWLBoxNo + ' @ ' + data[1] + '</B>' + '</li>');
				//$('#installationList2 li').remove();
				$('#installationList2').append('<li> <a href="installation.html"> <img src="imgs/place.png"; width="50px"; height="50"; onclick="update1()";/> OWLBox <B>' + OWLBoxNo + ' @ ' + data[1] + '</B> <span class="ui-li-count"> 4 </span> </a> </li>');
				//$('#installationList2').append('<li> <img src="imgs/place.png" width="50px" height="50" /> OWLBx <B>' + OWLBoxNo + ' @ ' + data[1] + '</B>' + '</li>');
				$('#installationList2').listview('refresh');
			});
		
		}
	});
	
	
	serviceURL = "http://localhost/owl/services/";
	$.getJSON(serviceURL + 'discoverOwl.php', function(data) {
		OWLBoxNo = data[0].split(':')[2];
			
		$('#installationList2').append('<li> <img src="imgs/place.png" width="50px" height="50" /> OWLBoxx <B>' + OWLBoxNo + ' @ ' + data[1] + '</B> <span class="ui-li-count"> <img src="imgs/place.png" width="20px" height="20" /> </span> </li>');
		
		$('#installationList2').listview('refresh');
	});
	
	alert('OBs Found:: ' );//+ $('#installationList2').count());
}

document.addEventListener('deviceready', function () {
    // cordova.plugins.backgroundMode is now available
	alert("Device Ready ");
}, false);

document.addEventListener("offline", function () {
	alert('You have lost internet connection');
	console.log("lost connection");
}, false);

document.addEventListener("online", function () {
	alert('You have got internet connection');
}, false);

function update1(){
	alert('Hereere');
}

function search1(){
	alert('Search ???');
	
	var WifiIPaddr;
	var startIP;
	var count;
	$('#installationList2 li').remove();

	networkinterface.getWiFiIPAddress(function (ip) {
		var obip = document.getElementById('OBIP').value;
		if(obip == ''){
			alert('No Valid IP');
			return;
		}
		else{
			//alert('IP, SearchCount' + obip);
			var startIPnCount = obip.split(',');
			//alert('startIPnCount: ' + startIPnCount.length);
			startIP = startIPnCount[0];
			if( startIP.split('.').length < 4){
				alert('Invalid IP Address ');
				return;
			}
			if(startIPnCount.length == 1)
				count = 10;
			else if(startIPnCount.length == 2){
				count = startIPnCount[1];
				alert('count: '+count);
			}
			//count = 
		}
		startIPoctt = startIP.split('.');
		alert('startIPoctt[3]: '+startIPoctt[3]);
		for (i = startIPoctt[3]; i < parseInt(startIPoctt[3])+parseInt(count); i++) { 
			//alert('startIPoctt[3]+count: '+startIPoctt[3]+count);
			ipPrefix = startIPoctt[0] + '.' + startIPoctt[1] + '.' + startIPoctt[2] + '.';
			
			serviceURL = 'http://' + ipPrefix + i + '/owl/services/';
			alert('Here22 - '+serviceURL);
		
			//serviceURL = "http://192.168.1.6/owl/services/";
			$.getJSON(serviceURL + 'discoverOwl.php', function(data) {
				OWLBoxNo = data[0].split(':')[2];

				$('#installationList2').append('<li> <a href="installation.html"> <img src="imgs/place.png"; width="50px"; height="50"; onclick="update1()";/> OWLBox <B>' + OWLBoxNo + ' @ ' + data[1] + '</B> <span class="ui-li-count"> 4 </span> </a> </li>');
				$('#installationList2').listview('refresh');
			});
		
		}
	});
	
}

function add(){
	var obid = document.getElementById('OBID').value;
	localStorage.setItem('owlbid',obid);

	//checkIFs();
	checkConnection();
	
	alert("Adding "+ obid);
}

function checkConnection() {
    var networkState = navigator.connection.type;

	alert('Connection type: ' + networkState);
	
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Connection type: ' + states[networkState]);
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

function sendTo(data, addr, port) {
    chrome.sockets.udp.create(function(createInfo) {
      chrome.sockets.udp.bind(createInfo.socketId, '0.0.0.0', 0, function(result) {
        chrome.sockets.udp.send(createInfo.socketId, data, addr, port, function(result) {
          if (result < 0) {
            console.log('send fail: ' + result);
            chrome.sockets.udp.close(createInfo.socketId);
          } else {
            console.log('sendTo: success ' + port);
			alert('sendTo: success ' + port);
            chrome.sockets.udp.close(createInfo.socketId);
          }
        });
      });
    });
}

function getIndexOfOBox(OBoxNo){
	var addedOBs = localStorage.getItem('OBsLstStr');
	obj = JSON.parse(addedOBs);
	
	for (var i = 0; i < obj.length; i++){
		// look for the entry with a matching `code` value
		if (obj[i].instNo == OBoxNo){
			//alert(obj1[i].name + ' index ' + i);
			return i;
		}
	}
	return -1;
}

function addOBox(OBstring){
	var OBox = JSON.parse(OBstring);
	var indexOfOB = getIndexOfOBox(OBox.instNo);
	if(indexOfOB > -1){
		alert('OWLBox No:' + OBoxNo + ' Already Exisit');
		return;
	}
	
	var addedOBs = localStorage.getItem('OBsLstStr');
	obj = JSON.parse(addedOBs);
	obj.push(OBstring);
	
	//Now update the OBsLstStr
	localStorage.setItem('OBsLstStr',JSON.stringify(obj));
	
	alert('OWLBox No:' + OBox.instNo + ' Added, SUCCESSFULLY');
}

function removeOBox(OBoxNo){
	var indexOfOB = getIndexOfOBox(OBoxNo);
	if(indexOfOB < 0){
		alert('OWLBox No:' + OBoxNo + ' Does NOT Exisit');
		return;
	}
	
	var addedOBs = localStorage.getItem('OBsLstStr');
	obj = JSON.parse(addedOBs);
	
	obj.splice(indexOfOB,1); // remove one JSON object starting from indexOfOB
	
	//Now update the OBsLstStr
	localStorage.setItem('OBsLstStr',JSON.stringify(obj));
	
	alert('OWLBox No:' + OBoxNo + ' Removed, SUCCESSFULLY');
}

function updateOBox(OBoxNo, OBstring){
	var indexOfOB = getIndexOfOBox(OBoxNo);
	if(indexOfOB < 0){
		alert('OWLBox No:' + OBoxNo + ' Does NOT Exisit');
		return;
	}
	
	var addedOBs = localStorage.getItem('OBsLstStr');
	obj = JSON.parse(addedOBs);
	
	// Remove
	obj.splice(indexOfOB,1); // remove one JSON object starting from indexOfOB
	
	// Added
	obj.push(OBstring);
	
	//Now update the OBsLstStr
	localStorage.setItem('OBsLstStr',JSON.stringify(obj));
	
	alert('OWLBox No:' + OBoxNo + ' Updated, SUCCESSFULLY');
	
}


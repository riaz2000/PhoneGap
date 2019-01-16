var serviceURL;
var installations;

if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
  document.addEventListener("deviceready", onDeviceReady, false);
} else {
	onDeviceReady(); //this is the browser
}
$('#installationListPage').live('pageshow', function(event) {
	if(deviceType != "NotSetYet"){
		getInstallationList();
	}
});

function onDeviceReady() {
	getInstallationList();
}
//const deviceModule = require('..').device;
//const cmdLineProcess = require('./lib/cmdline');

//begin module

//function processTest(args) {
function checkInternetAccess2(){

	alert('checkInternetAccess-1');
   //
   // The device module exports an MQTT instance, which will attempt
   // to connect to the AWS IoT endpoint configured in the arguments.
   // Once connected, it will emit events which our application can
   // handle.
   //
   const device = deviceModule({
      /*keyPath: args.privateKey,
      certPath: args.clientCert,
      caPath: args.caCert,
      clientId: args.clientId,
      region: args.region,
      baseReconnectTimeMs: args.baseReconnectTimeMs,
      keepalive: args.keepAlive,
      protocol: args.Protocol,
      port: args.Port,
      host: args.Host,
      debug: args.Debug*/
	  privateKey: 'MHcCAQEEIFo1d9C5iQWwaG6a1gBv8NxuU1s9CrE3w40f2jkgB/ocoAoGCCqGSM49AwEHoUQDQgAEqW0OIrD1E34gLX4STgTQdK/ghO3vHF/Cop0mIJ6TLx5Zw4fjwE00msr7dOEhvAFOAGDCJhGUc22z76W1/VKstQ==',
								//certPath: 'aws-esp32_089F84.crt.pem',
								//keyPath: 'aws-esp32_089F84.key.pem',
				clientCert: 'MIIChzCCAW+gAwIBAgIUUOFrxJmcZ9aor2KWGZffe4Qgc9QwDQYJKoZIhvcNAQELBQAwTTFLMEkGA1UECwxCQW1hem9uIFdlYiBTZXJ2aWNlcyBPPUFtYXpvbi5jb20gSW5jLiBMPVNlYXR0bGUgU1Q9V2FzaGluZ3RvbiBDPVVTMB4XDTE4MTAxNzA5NTAxMFoXDTQ5MTIzMTIzNTk1OVowFzEVMBMGA1UEAwwMZXNwMzJfMDg5Rjg0MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqW0OIrD1E34gLX4STgTQdK/ghO3vHF/Cop0mIJ6TLx5Zw4fjwE00msr7dOEhvAFOAGDCJhGUc22z76W1/VKstaNgMF4wHwYDVR0jBBgwFoAUHY2iY3AdLsJvYIvDk7uRPQfvGn8wHQYDVR0OBBYEFBBwm0ujmtdJZCJOSQqta27wDvxIMAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMA0GCSqGSIb3DQEBCwUAA4IBAQAUjwyM6XDPg+4QFK+CsOR8fx7ha9+AyJ6X3EJAK9jSXCAqM+8XMr98/eKwnhUWqsI+MolNZMhjIkEpGDqstLYGH+CddYBye9VpaPOlGP1Tlhi39aKWzXVHO0TYfwCm4Diw3+A9NnpPnFF8Al6GZD6um4NXJHSqxKL/uuXKMkXUPd+yN4M258iiQLNf7ws7NmRnfAMEkIJ4GSxKRPYy3z1ZF47p65dZup3GpPYMMboWA72iKjZ7rJTGb0xPj+Pq0meHuWduNk8bAdpeUo50JkZ3da1cMaf0+/AgyVf/Ogni/ysNaj5JlVqZOPz7N60gKI+/pVHpEyDLaYMXpF6IsMhE',
				//caPath: <YourRootCACertificatePath>,
				//caPath: 'ca.crt',
				caCert: "MIIE0zCCA7ugAwIBAgIQGNrRniZ96LtKIVjNzGs7SjANBgkqhkiG9w0BAQUFADCByjELMAkGA1UEBhMCVVMxFzAVBgNVBAoTDlZlcmlTaWduLCBJbmMuMR8wHQYDVQQLExZWZXJpU2lnbiBUcnVzdCBOZXR3b3JrMTowOAYDVQQLEzEoYykgMjAwNiBWZXJpU2lnbiwgSW5jLiAtIEZvciBhdXRob3JpemVkIHVzZSBvbmx5MUUwQwYDVQQDEzxWZXJpU2lnbiBDbGFzcyAzIFB1YmxpYyBQcmltYXJ5IENlcnRpZmljYXRpb24gQXV0aG9yaXR5IC0gRzUwHhcNMDYxMTA4MDAwMDAwWhcNMzYwNzE2MjM1OTU5WjCByjELMAkGA1UEBhMCVVMxFzAVBgNVBAoTDlZlcmlTaWduLCBJbmMuMR8wHQYDVQQLExZWZXJpU2lnbiBUcnVzdCBOZXR3b3JrMTowOAYDVQQLEzEoYykgMjAwNiBWZXJpU2lnbiwgSW5jLiAtIEZvciBhdXRob3JpemVkIHVzZSBvbmx5MUUwQwYDVQQDEzxWZXJpU2lnbiBDbGFzcyAzIFB1YmxpYyBQcmltYXJ5IENlcnRpZmljYXRpb24gQXV0aG9yaXR5IC0gRzUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCvJAgIKXo1nmAMqudLO07cfLw8RRy7K+D+KQL5VwijZIUVJ/XxrcgxiV0i6CqqpkKzj/i5Vbext0uz/o9+B1fs70PbZmIVYc9gDaTY3vjgw2IIPVQT60nKWVSFJuUrjxuf6/WhkcIzSdhDY2pSS9KP6HBRTdGJaXvHcPaz3BJ023tdS1bTlr8Vd6Gw9KIl8q8ckmcY5fQGBO+QueQA5N06tRn/Arr0PO7gi+s3i+z016zy9vA9r911kTMZHRxAy3QkGSGT2RT+rCpSx4/VBEnkjWNHiDxpg8v+R70rfk/Fla4OndTRQ8Bnc+MUCH7lP59zuDMKz10/NIeWiu5T6CUVAgMBAAGjgbIwga8wDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8EBAMCAQYwbQYIKwYBBQUHAQwEYTBfoV2gWzBZMFcwVRYJaW1hZ2UvZ2lmMCEwHzAHBgUrDgMCGgQUj+XTGoasjY5rw8+AatRIGCx7GS4wJRYjaHR0cDovL2xvZ28udmVyaXNpZ24uY29tL3ZzbG9nby5naWYwHQYDVR0OBBYEFH/TZafC3ey78DAJ80M5+gKvMzEzMA0GCSqGSIb3DQEBBQUAA4IBAQCTJEowX2LP2BqYLz3q3JktvXf2pXkiOOzEp6B4Eq1iDkVwZMXnl2YtmAl+X6/WzChl8gGqCBpH3vn5fJJaCGkgDdk+bW48DW7Y5gaRQBi5+MHt39tBquCWIMnNZBU4gcmU7qKEKQsTb47bDN0lAtukixlE0kF6BWlKWE9gyn6CagsCqiUXObXbf+eEZSqVir2G3l6BFoMtEMze/aiCKm0oHw0LxOXnGiYZ4fQRbxC1lfznQgUy286dUV4otp6F01vvpX1FQHKOtw5rDgb7MzVIcbidJ4vEZV8NhnacRHr2lVz2XTIIM6RUthg/aFzyQkqFOFSDX9HoLPKsEdao7WNq",
				//caCert: "MIIDrzCCApegAwIBAgIQCDvgVpBCRrGhdWrJWZHHSjANBgkqhkiG9w0BAQUFADBhMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBDQTAeFw0wNjExMTAwMDAwMDBaFw0zMTExMTAwMDAwMDBaMGExCzAJBgNVBAYTAlVTMRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5jb20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IENBMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4jvhEXLeqKTTo1eqUKKPC3eQyaKl7hLOllsBCSDMAZOnTjC3U/dDxGkAV53ijSLdhwZAAIEJzs4bg7/fzTtxRuLWZscFs3YnFo97nh6Vfe63SKMI2tavegw5BmV/Sl0fvBf4q77uKNd0f3p4mVmFaG5cIzJLv07A6Fpt43C/dxC//AH2hdmoRBBYMql1GNXRor5H4idq9Joz+EkIYIvUX7Q6hL+hqkpMfT7PT19sdl6gSzeRntwi5m3OFBqOasv+zbMUZBfHWymeMr/y7vrTC0LUq7dBMtoM1O/4gdW7jVg/tRvoSSiicNoxBN33shbyTApOB6jtSj1etX+jkMOvJwIDAQABo2MwYTAOBgNVHQ8BAf8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUA95QNVbRTLtm8KPiGxvDl7I90VUwHwYDVR0jBBgwFoAUA95QNVbRTLtm8KPiGxvDl7I90VUwDQYJKoZIhvcNAQEFBQADggEBAMucN6pIExIK+t1EnE9SsPTfrgT1eXkIoyQY/EsrhMAtudXH/vTBH1jLuG2cenTnmCmrEbXjcKChzUyImZOMkXDiqw8cvpOp/2PV5Adg06O/nVsJ8dWO41P0jmP6P6fbtGbfYmbW0W5BjfIttep3Sp+dWOIrWcBAI+0tKIJFPnlUkiaY4IBIqDfv8NZ5YBberOgOzW6sRBc4L0na4UU+Krk2U886UAb3LujEV0lsYSEY1QSteDwsOoBrp+uvFRTp2InBuThs4pFsiv9kuXclVzDAGySj4dzp30d8tbQkCAUw7C29C79Fv1C5qfPrmAESrciIxpg0X40KPMbp1ZWVbd4=",
				//clientId: <YourUniqueClientIdentifier>,
				host: "mqtts://a3c57v3s4sa58t.iot.ap-northeast-1.amazonaws.com:8883/esp32_089F84" //mqtts://a3c57v3s4sa58t.iot.ap-northeast-1.amazonaws.com:8883/esp32_1E02E4

   });

   var timeout;
   var count = 0;
   const minimumDelay = 250;

   if (args.testMode === 1) {
      device.subscribe('topic_1');
   } else {
      device.subscribe('topic_2');
   }
   if ((Math.max(args.delay, minimumDelay)) !== args.delay) {
      console.log('substituting ' + minimumDelay + 'ms delay for ' + args.delay + 'ms...');
   }
   timeout = setInterval(function() {
      count++;

      if (args.testMode === 1) {
         device.publish('topic_2', JSON.stringify({
            mode1Process: count
         }));
      } else {
         device.publish('topic_1', JSON.stringify({
            mode2Process: count
         }));
      }
   }, Math.max(args.delay, minimumDelay)); // clip to minimum

   //
   // Do a simple publish/subscribe demo based on the test-mode passed
   // in the command line arguments.  If test-mode is 1, subscribe to
   // 'topic_1' and publish to 'topic_2'; otherwise vice versa.  Publish
   // a message every four seconds.
   //
   device
      .on('connect', function() {
         console.log('connect');
      });
   device
      .on('close', function() {
         console.log('close');
      });
   device
      .on('reconnect', function() {
         console.log('reconnect');
      });
   device
      .on('offline', function() {
         console.log('offline');
      });
   device
      .on('error', function(error) {
         console.log('error', error);
      });
   device
      .on('message', function(topic, payload) {
         console.log('message', topic, payload.toString());
      });

}

function getInstallationList() {
	//alert("Device2: "+getDeviceType());
	myAlert("Device2: "+getDeviceType(),5);

	if(localStorage.getItem('OBsLstStr')=="" || localStorage.getItem('OBsLstStr')==null)
		localStorage.setItem('OBsLstStr',"[]");

	var addedOBs = localStorage.getItem('OBsLstStr');
	obj = JSON.parse(addedOBs);
	//alert('addedOBs: ',addedOBs);
	$('#installationList li').remove();
	for (var i = 0; i < obj.length; i++){
		//alert('InstType: ',obj[i].instType);
		var instType = "img/place.png";
		if(obj[i].instType == 0 || obj[i].instType == 1 || obj[i].instType == 2)
			instType = "img/place.png";
		else if(obj[i].instType == 3 || obj[i].instType == 4 || obj[i].instType == 5 || obj[i].instType == 6 || obj[i].instType == 9)
			instType = "img/plaza.png";
		else if(obj[i].instType == 7 || obj[i].instType == 8)
			instType = "img/shop.png";

		var linkToPage;
		if(obj[i].uLoginState == 0){
			//linkToPage = "login.html?loginid='rhussain1'";
			linkToPage = "login.html?OBoxID="+obj[i].OBoxNo;
			lockImg = "img/pswd.png";
			href3 = '';
		}
		else{
			linkToPage = "installation.html?OBoxID="+obj[i].OBoxNo;
			lockImg = "img/cnfg.png";
			href3 = '<span class="ui-li-count"><a href="uoptions.html?OBoxID='+obj[i].OBoxNo+'"><img src="' + lockImg + '" height=30, width=25/></a></span></a>';
		}

		$('#installationList').append('<li>' + '<a href="' + linkToPage + '" >' +
										'<img src="'+ instType + '"/>' +
										'<h4>' + obj[i].instAddr1 + '</h4><p><B>' + obj[i].instAddr2 + ',</p></B>' +
										'<p><B>' + obj[i].instCity + '</B> ' +  obj[i].instState + ' ' + obj[i].instZip + ' ' + obj[i].instCountry + '</p>'  +
										'<font size="4" color="maroon"><center>' + obj[i].OBoxNo + '</center></font>' +
										'<span class="ui-li-count"><img src="' + lockImg + '" height=30, width=25/></span></a>' + href3 + '</li> ');

	}
	$('#installationList').listview('refresh');
	/*
	alert('Here1a: ' );
	//$.getJSON(serviceURL + 'getinstallations.php', function(data) {
	$.getJSON('http://192.168.1.2/owl/services/getinstallations.php', function(data) {
		alert('Here1bb: ' );
		$('#installationList li').remove();
		installations = data.items;
		$.each(installations, function(index, installation) {
			var instType = "img/place.png";
			if(installation.inst_type == 0 || installation.inst_type == 1 || installation.inst_type == 2)
				instType = "img/place.png";
			else if(installation.inst_type == 3 || installation.inst_type == 4 || installation.inst_type == 5 || installation.inst_type == 6 || installation.inst_type == 9)
				instType = "img/plaza.png";
			else if(installation.inst_type == 7 || installation.inst_type == 8)
				instType = "img/shop.png";

			var linkToPage;
			var loginState;
			var lockImg;
			loginState = 1;
			if(loginState == 0){
				linkToPage = "login.html?loginid='rhussain1'";
				lockImg = "img/pswd.png";
				href1 = '';
				href2 = '';
				href3 = '';
			}
			else{
				linkToPage = "installation.html";
				lockImg = "img/cnfg.png";
				href1 = '<a href="floor.html">';
				href2 = '</a>';
				href3 = '<span class="ui-li-count"><a href="uoptions.html"><img src="' + lockImg + '" height=30, width=25/></a></span></a>';
			}
			//alert('Here - 2'+installation.address2);
			$('#installationList').append('<li>' + '<a href="' + linkToPage + '">' +
					'<img src="'+ instType + '"/>' +
					//'<img src="pics/amy_jones.jpg"/>' +
					'<h4>' + installation.address1 + ' ' + installation.address2 + '</h4>' +
					'<p>' + installation.nr + '</p>'  +
					'<span class="ui-li-count"><img src="' + lockImg + '" height=30, width=25/></span></a>' + href3 + '</li> ');
		});
		$('#installationList').listview('refresh');
	});
	*/
}

function getMyInstallationList() {
	//$.getJSON('http://192.168.1.2/owl/services/getinstallations.php', function(data) {
	$.getJSON('http://203.124.40.232/OWL/Php/getinstallations.php', function(data) {
		alert('Here1bb: ' );
		$('#installationList li').remove();
		installations = data.items;
		$.each(installations, function(index, installation) {
			var instType = "img/place.png";
			if(installation.inst_type == 0 || installation.inst_type == 1 || installation.inst_type == 2)
				instType = "img/place.png";
			else if(installation.inst_type == 3 || installation.inst_type == 4 || installation.inst_type == 5 || installation.inst_type == 6 || installation.inst_type == 9)
				instType = "img/plaza.png";
			else if(installation.inst_type == 7 || installation.inst_type == 8)
				instType = "img/shop.png";

			var linkToPage;
			var loginState;
			var lockImg;
			loginState = 1;
			if(loginState == 0){
				linkToPage = "login.html?loginid='rhussain1'";
				lockImg = "img/pswd.png";
				href1 = '';
				href2 = '';
				href3 = '';
			}
			else{
				linkToPage = "installation.html";
				lockImg = "img/cnfg.png";
				href1 = '<a href="floor.html">';
				href2 = '</a>';
				href3 = '<span class="ui-li-count"><a href="uoptions.html"><img src="' + lockImg + '" height=30, width=25/></a></span></a>';
			}
			//alert('Here - 2'+installation.address2);
			$('#installationList').append('<li>' + '<a href="' + linkToPage + '">' +
					'<img src="'+ instType + '"/>' +
					//'<img src="pics/amy_jones.jpg"/>' +
					'<h4>' + installation.address1 + ' ' + installation.address2 + '</h4>' +
					'<p>' + installation.nr + '</p>'  +
					'<span class="ui-li-count"><img src="' + lockImg + '" height=30, width=25/></span></a>' + href3 + '</li> ');
		});
		$('#installationList').listview('refresh');
	});
}

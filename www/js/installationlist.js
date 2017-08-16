var serviceURL = "http://localhost/owl/services/";
//var serviceURL = "http://192.168.1.2/owl/services/";

var installations;

$('#installationListPage').bind('pageinit', function(event) {
	getInstallationList();
});

function getInstallationList() {
	$.getJSON(serviceURL + 'getinstallations.php', function(data) {
		$('#installationList li').remove();
		installations = data.items;
		$.each(installations, function(index, installation) {
			var instType = "imgs/place.png";
			if(installation.inst_type == 0 || installation.inst_type == 1 || installation.inst_type == 2)
				instType = "imgs/place.png";
			else if(installation.inst_type == 3 || installation.inst_type == 4 || installation.inst_type == 5 || installation.inst_type == 6 || installation.inst_type == 9)
				instType = "imgs/plaza.png";
			else if(installation.inst_type == 7 || installation.inst_type == 8)
				instType = "imgs/shop.png";
			
			$('#installationList').append('<li>' +
					'<img src="'+ instType + '"/>' +
					//'<img src="pics/amy_jones.jpg"/>' +
					'<h4>' + installation.address1 + ' ' + installation.address2 + '</h4>' +
					'<p>' + installation.nr + '</p>' +
					'<span class="ui-li-count">' + installation.inst_type + '</span></li>');
		});
		$('#installationList').listview('refresh');
	});
}
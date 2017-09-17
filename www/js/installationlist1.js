//var serviceURL = "http://localhost/owl/services/";
var serviceURL = "http://192.168.1.2/owl/services/";
/*
var installations;

$('#installationListPage').bind('pageinit', function(event) {
	getInstallationList();
});

function getInstallationList() {
	$.getJSON(serviceURL + 'getinstallations.php', function(data) {
		$('#installationList li').remove();
		installations = data.items;
		$.each(installations, function(index, installation) {
			$('#installationList').append('<li><a href="installationdetails.html?id=' + installation.nr + '">' +
					//'<img src="pics/' + employee.picture + '"/>' +
					'<h4>' + installation.address1 + ' ' + installation.address2 + '</h4>' +
					//'<p>' + installation.title + '</p>' +
					'<span class="ui-li-count">' + installation.nr + '</span></a></li>' +
					);
		});
		$('#installationList').listview('refresh');
	});
}
*/
//var serviceURL = "http://localhost/directory/services/";

var installations;

$('#installationListPage').bind('pageinit', function(event) {
	getEmployeeList();
});

function getEmployeeList() {
	$.getJSON(serviceURL + 'getinstallations.php', function(data) {
		$('#installationList li').remove();
		installations = data.items;
		$.each(installations, function(index, installation) {/*
			$('#installationList').append('<li><a href="employeedetails.html?id=' + employee.id + '">' +
					'<img src="pics/' + employee.picture + '"/>' +
					'<h4>' + employee.firstName + ' ' + employee.lastName + '</h4>' +
					'<p>' + employee.title + '</p>' +
					'<span class="ui-li-count">' + employee.reportCount + '</span></a></li>');
			$('#installationList').append('<li>' +
					'<h4>' + installation.firstName + ' ' + installation.lastName + '</h4>' +
					'<p>' + installation.title + '</p>' +
					'<span class="ui-li-count">' + installation.reportCount + '</span></li>');
			$('#installationList').append('<li>' +
					'<h4>' + installation.address1 + ' ' + installation.address2 + '</h4>' +
					'<p>' + installation.nr + '</p>' +
					'<span class="ui-li-count">' + installation.nr + '</span></li>');*/
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
			/*		
			if(installation.inst_type == 2){
				$('#installationList').append('<li>' +
					'<img src="'+ empPic + '"/>' +
					//'<img src="pics/amy_jones.jpg"/>' +
					'<h4>' + installation.address1 + ' ' + installation.address2 + '</h4>' +
					'<p>' + installation.nr + '</p>' +
					'<span class="ui-li-count">' + installation.nr + '</span></li>');
			}
			else{
				$('#installationList').append('<li>' +
					'<img src="pics/eugene_lee.jpg"/>' +
					'<h4>' + installation.address1 + ' ' + installation.address2 + '</h4>' +
					'<p>' + installation.nr + '</p>' +
					'<span class="ui-li-count">' + installation.nr + '</span></li>');
			}
			*/
		});
		$('#installationList').listview('refresh');
	});
}
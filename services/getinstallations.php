<?php
include 'config.php';

/*
$sql = "select e.id, e.firstName, e.lastName, e.title, e.picture, count(r.id) reportCount " . 
		"from employee e left join employee r on r.managerId = e.id " .
		"group by e.id order by e.lastName, e.firstName";
*/

$sql = "select i.nr, i.address1, i.address2 " . 
		"from tab_installations i" ;
		
try {
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$stmt = $dbh->query($sql);  
	$installations = $stmt->fetchAll(PDO::FETCH_OBJ);
	$dbh = null;
	echo '{"items":'. json_encode($installations) .'}'; 
} catch(PDOException $i) {
	echo '{"error":{"text":'. $i->getMessage() .'}}'; 
}


?>
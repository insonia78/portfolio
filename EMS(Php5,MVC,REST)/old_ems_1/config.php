<?php 
$url = $_SERVER[REQUEST_URI];
$explode_url = explode('/', $url);
$count = (count($explode_url))-1;
$select_page = $explode_url[$count];



$servername = "localhost";
$username = "ems";
$password = "axon1234";
// Create connection
$conn = mysql_connect($servername, $username, $password);
mysql_selectdb("nostrovia_enrollment", $conn);

/* 
$dbcnx = @mysql_pconnect("localhost:/tmp/mysql5.sock", "ems", "axon1234");
if (!$dbcnx){
	echo "<P>Unable to connect to the database server at this time.</P>";
	exit();
}

//specify database
mysql_select_db("understand_enrollment") or die("Unable to select database"); //select which database we're using

*/






function get_client_ip() {
$ipaddress = '';
if ($_SERVER['HTTP_CLIENT_IP'])
$ipaddress = $_SERVER['HTTP_CLIENT_IP'];
else if ($_SERVER['HTTP_X_FORWARDED_FOR'])
$ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
else if ($_SERVER['HTTP_X_FORWARDED'])
$ipaddress = $_SERVER['HTTP_X_FORWARDED'];
else if ($_SERVER['HTTP_FORWARDED_FOR'])
$ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
else if ($_SERVER['HTTP_FORWARDED'])
$ipaddress = $_SERVER['HTTP_FORWARDED'];
else if ($_SERVER['REMOTE_ADDR'])
$ipaddress = $_SERVER['REMOTE_ADDR'];
else
$ipaddress = 'UNKNOWN';

return $ipaddress;
}
 
?>
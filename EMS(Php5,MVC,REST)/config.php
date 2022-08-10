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

// Create connection


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
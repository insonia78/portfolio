<?php
error_reporting(0);
session_start();
include ('config.php');
$q1= $_POST['q1'];
$q2= $_POST['q2'];
$q3= $_POST['q3'];
$q4= $_POST['q4'];
$q5= $_POST['q5'];
$q6= $_POST['q6'];
$the_code= $_POST['the_code'];
$ip_address=get_client_ip();

 $insert_query = "insert into input_feedback(q1,q2,q3,q4,q5,q6,client_ip,code) values('".$q1."','".$q2."','".$q3."','".$q4."','".$q5."','".$q6."','".$ip_address."','".$the_code."')";
 mysql_query($insert_query);
 $inser_id = mysql_insert_id();
 //logging
$ipaddress = get_client_ip();
$update = $inser_id.' - New feedback inserted';
$insert = "insert into logging(eventUser,eventAction,eventIP) values('".$_SESSION['login_details']['user_name']."','".$update."','".$ipaddress."');";
mysql_query($insert);

echo 'success';
?>
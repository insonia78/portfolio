<?php
error_reporting(0);
session_start();
include ('config.php');
$vID= $_POST['vID'];

$query = "select * from videographers where vID = '".$vID."'";
    $result = mysql_query($query);
    $fetch = mysql_fetch_assoc($result);
    echo $fetch['Name'].','.$fetch['CompanyName'].','.$fetch['PrimPhone'].','.$fetch['SecPhone'].','.$fetch['videographer_alter'].','.$fetch['Email'].','.$fetch['teleprompt'];
?>
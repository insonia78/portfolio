<?php
error_reporting(0);
session_start();
include ('config.php');

if(isset($_POST['vID'])){
$vID= $_POST['vID'];
$query = "select * from videographers where vID = '".$vID."'";
    $result = mysql_query($query);
    $fetch = mysql_fetch_assoc($result);
    echo $fetch['Name'].','.$fetch['CompanyName'].','.$fetch['PrimPhone'].','.$fetch['SecPhone'].','.$fetch['videographer_alter'].','.$fetch['Email'].','.$fetch['teleprompt'].','.$fetch['Lighting'].','.$fetch['Audio'].','.$fetch['Monitor'].','.$fetch['AdditionalGear'].','.$fetch['Notes'];
}
if(isset($_POST['onedayreminder'])){
  $onedayreminder= $_POST['onedayreminder'];
  $jobno= $_POST['jobno'];
  $query = "update fieldops set  onedayreminder='".$onedayreminder."' where assignID='".$jobno."'";
  mysql_query($query);
}
if(isset($_POST['fourdayreminder'])){
  $fourdayreminder= $_POST['fourdayreminder'];
  $jobno= $_POST['jobno'];
   $query = "update fieldops set  fourdayreminder='".$fourdayreminder."' where assignID='".$jobno."'";
  mysql_query($query);
}
    ?>
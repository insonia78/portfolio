<?php
error_reporting(E_ALL);
//error_reporting(0);
//ini_set('display_errors','0');
require('dbClass.php');
/* 
 * SHIELDtech Profile API
 * v0.1
 * For use with mobile application
 * 
 */
$result["this"] = "istest";
$result["that"] = "isalso";

echo json_encode($result);






// function error($msg)
// {
//     $result[0]["status"] = "ERROR";
//     $result[0]["error_details"] = $msg;
// 	error_log($msg, 0); // enabled default PHP error logging on our server containing the passed message
//     echoJson($result);
//     exit;
// }

// $db = new Database();
// $db->setup();
// $sql = "SELECT * FROM Alerts";
// if ( !$fetched = $db->send_sql($sql) ) {
// 	error("Databse fetching error.");
// 	//error("DB error");
// }
// $i = 0;
// while ( $rslt = $fetched->fetch_assoc() ) {
// 	if ( !is_null($rslt) ) {
// 		foreach ( $rslt as $key => $value ) {
// 			if ( $key != 'status' ) {
// 				$result[$i][$key] = $value;
// 			}
// 		}
// 		$i++;
// 	}
// }
// if (!is_null($result)) {
// 	$db->disconnect();
// 	echo json_encode($result);
// 	exit;
// }
// $db->disconnect();
// return false;
?>
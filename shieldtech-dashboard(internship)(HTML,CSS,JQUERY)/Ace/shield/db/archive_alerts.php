<?php
error_reporting(E_ALL);
//error_reporting(0);
//ini_set('display_errors','0');
require('dbClass.php');
//require('require.php');
/* 
 * SHIELDtech archive alerts API
 * v0.1
 * For use with dashboard web application
 * 
 */

function error($msg) {
	error_log($msg, 0); // enabled default PHP error logging on our server containing the passed message
    echo $msg;
    exit;
}

if ( !isset($_POST["aid"]) ) {
	error("Alert ID not provided for archiving attempt. [ ".substr(date(DATE_RSS, time()), 0, 25)." ]");
}

if ( !preg_match('/^(\d+)$/', $_POST["aid"]) ) {
	error("Invalid alert ID received. Suspect XSS. [ ".substr(date(DATE_RSS, time()), 0, 25)." ]");
}

try {
	$db = new Database();
	$db->setup();
	$sql = "UPDATE Alerts SET alert_status = 'archived' WHERE aid = '".$_POST["aid"]."' ";
	if ( $response = $db->send_sql($sql) ) {
		if ( !is_resource($response) ) {
			if ( $response == 1 ) {
			} else {
				// ADD ALL ANTICIPATED preg_match ERRORS HERE


				// all other errors
				error($response);
			}
		}
	} else {
		error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
	}
	$db->disconnect();
	echo "success";	
	exit;
} catch ( exception $e ) {
	error("Error processing archive attempt. [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
}

?>
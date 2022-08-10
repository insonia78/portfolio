<?php
error_reporting(0);
ini_set('display_errors','0');
require('dbClass.php');
//require('require.php');
/* 
 * SHIELDtech Alert API
 * v0.8.4
 * For use with mobile application
 * 
 * See documentation for full details
 * https://docs.google.com/document/d/1VUBmMxiK6zx31Fj6eMEQdZ2GGZrsHhaczWTDZxp8kqw/
 *
 *
 */
function echoJson($data)
{
	header('Content-Type: application/json');
	echo json_encode($data);
}

function error($msg)
{
    $result["status"] = "ERROR";
    $result["error_details"] = $msg;
	error_log($msg, 0); // enabled default PHP error logging on our server containing the passed message
    echoJson($result);
    exit;
}

function checkParam()
{
	try {
		// check for missing parameters
		if ( !isset($_POST["uid"]) ) {
			error("No UID provided.");
		}
		if ( isset($_POST["dob"]) ) {
			if ( !preg_match("/^(\d{4})-(\d{2})-(\d{2})$/", $_POST["dob"]) ) {
				error("' ".$_POST["dob"]." ' is not a valid date of birth.");
			}
		}
		if ( isset($_POST["cwid"]) ) {
			if ( !preg_match("/^(\w{1,100})$/", $_POST["cwid"]) ) {
				error("' ".$_POST["cwid"]." ' is not a valid campus-wide ID.");
			}
		}
		if ( isset($_POST["dorm_building"]) ) {
			if ( strlen($_POST["dorm_building"]) > 199 ) {
				error("Value for dorm building is too long.");
			}
		}
		if ( isset($_POST["dorm_roomnum"]) ) {
			if ( strlen($_POST["dorm_roomnum"]) > 199 ) {
				error("Vallue for dorm room number is too long.");
			}
		}
		if ( isset($_POST["medical_issues"]) ) {
			if ( strlen($_POST["medical_issues"]) > 2999 ) {
				error("Value for medical issues is too long.");
			}
		}
		if ( isset($_POST["blood_type"]) ) {
			if ( !preg_match("/^[a-zA-Z0-9\+-]{1,5}$/", $_POST["blood_type"]) ) {
				error("' ".$_POST["blood_type"]." ' is not a valid blood type.");
			}
		}
		if ( isset($_POST["phone_cell"]) ) {
			if ( !preg_match("/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/", $_POST["phone_cell"]) ) {
				error("' ".$_POST["phone_cell"]." ' is not a valid US phone number.");
			}
		}
		if ( isset($_POST["phone_home"]) ) {
			if ( !preg_match("/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/", $_POST["phone_home"]) ) {
				error("' ".$_POST["phone_home"]." ' is not a valid US phone number.");
			}
		}
	} catch ( Exception $e ) {
		error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
	}
}

$result = array();

if ( !isset($_POST["apikey"]) ) {
    $result["status"] = "INVALID_REQUEST";
    $result["error_details"] = "No API key provided.";
    echoJson($result);
    exit;
}

// verify API key
if ( $_POST["apikey"] != '77ce2d83add9f5359fbf2cc35ef7ea4fe06df05b' ) {
    error("Invalid API key.");
}

if ( !isset($_POST["action"]) ) {
    error("Action not set.");
}

try {
	checkParam();
	$db = new Database();
	$db->setup();
	$sql = "SELECT * FROM Users WHERE uid = '".$_POST["uid"]."';";
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
	$rslt = $response->fetch_assoc();
	if ( is_null($rslt) ) {
		error("The provided UID did not contain any records.");
	}
	foreach ($rslt as $key => $value) {
		if ( $key != "uid" && $key != "password" && $key != "last_updated" && $key != "last_login" && $key != "verified" ) {
			$saved_result[$key] = $value;
		}
	}
	$db->disconnect();
} catch ( Exception $e ) {
	error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
}

if ( $_POST["action"] == "get" ) {
	try {
		// RETURN RESULT
		$result = $saved_result;
		$result["status"] = "OK";
		echoJson($result);
		exit;
	} catch ( Exception $e ) {
		error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
	}
}

function ifset($value) {
	global $saved_result;
	if ( !isset($_POST[$value]) ) {
		return $saved_result[$value];
	}
	return $_POST[$value];
}

if ( $_POST["action"] == "put" ) {
	try {
		$db = new Database();
		$db->setup();
		$sql = "UPDATE Users SET cwid = '".ifset("cwid")."', phone_cell = '".ifset("phone_cell")."', dob = '".ifset("dob")."', medical_issues = '".ifset("medical_issues")."', blood_type = '".ifset("blood_type")."', dorm_building = '".ifset("dorm_building")."', dorm_roomnum = '".ifset("dorm_roomnum")."', phone_home = '".ifset("phone_home")."' WHERE uid = '".$_POST["uid"]."';";
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

		// RETURN RESULT
		$result["status"] = "OK";
		echoJson($result);
		exit;
	} catch ( Exception $e ) {
		error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
	}
}
?>
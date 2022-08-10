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

function echoJson($data) {
	header('Content-Type: application/json');
	echo json_encode($data);
}

function error($msg) {
    $result["status"] = "ERROR";
    $result["error_details"] = $msg;
	error_log($msg, 0); // enabled default PHP error logging on our server containing the passed message
    echoJson($result);
    exit;
}

function checkLogin() {
	try {
		// check for missing parameters
		if ( !isset($_POST["email"]) ) {
			error("User Email not provided.");
		}
		if ( !isset($_POST["password"]) ) {
			error("User Password provided.");
		}
		if ( !preg_match("/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/", $_POST["email"]) ) {
			error("' ".$_POST["email"]." ' does not exist in the database.");
		}
	} catch ( Exception $e ) {
		error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
	}
}

function checkVerify() {
	try {
		// check for missing parameters
		if ( !isset($_POST["email"]) ) {
			error("User Email not provided.");
		}
		if ( !isset($_POST["password"]) ) {
			error("User Password provided.");
		}
	} catch ( Exception $e ) {
		error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
	}
	
}

function secure($pw) {
	return $pw; // password hash script goes here
}

function send($user_id, $user_email) {
	echo "Email sent to user ".$user_id." at ".$user_email."! | "; // mailer script goes here
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

// verify status is set
if ( !isset($_POST["action"]) ) {
    error("Action not set.");
} else {
	$action = $_POST["action"];
}

checkLogin();

if ( $action == "login" ) {
	try {
		// CHECKS USER CREDENTIALS AGAINST TABLE INFORMATION
		$password = secure($_POST["password"]);
		$db = new Database();
		$db->setup();
		$sql = "SELECT uid, email, password, cwid, name_first, name_last, dob, medical_issues, blood_type, dorm_building, dorm_roomnum, phone_cell, phone_home, date_created FROM Users WHERE email = '".$_POST["email"]."';";
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
			error("Email does not exist in the database.");
		}
		foreach ( $rslt as $key => $val ) {
			if ( $key != "password" ) {
				$result[$key] = $val;
			} else {
				if ( $val != $password ) {
					error("Password did not match.");
				}
			}
		}
		$db->disconnect();

		$db = new Database();
		$db->setup();
		$sql = "UPDATE Users SET last_login = NOW() WHERE email = '".$_POST["email"]."';";
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

if ( $action == "verify" ) {
	try {
		$password = secure($_POST["password"]);
		$db = new Database();
		$db->setup();
		$sql = "SELECT password FROM Users WHERE email = '".$_POST["email"]."';";
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
			error("Email does not exist in the database.");
		}
		foreach ( $rslt as $key => $val ) {
			if ( $key == "password" && $val != $password ) {
				error("Password did not match.");
			}
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

if ( $action == "reset" ) {
	try {
		// 
		$db = new Database();
		$db->setup();
		$sql = "SELECT uid FROM Users WHERE email = '".$_POST["email"]."';";
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
			error("Email does not exist in the database.");
		}
		foreach ($rslt as $key => $value) {
			$uid = $value;
		}
		$db->disconnect();
		
		// MAILER FUNCTION (sends email containing password reset link)
		send($uid, $_POST["email"]);

		$result["status"] = "OK";
		echoJson($result);
		exit;
	} catch ( Exception $e ) {
		error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
	}
}
?>
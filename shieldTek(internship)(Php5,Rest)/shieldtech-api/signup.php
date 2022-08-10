<?php
error_reporting(0);
ini_set('display_errors','0');
require('dbClass.php');
///require('require.php');
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

function checkUser() {
	try {
		// check for missing parameters
		if ( !isset($_POST["name_first"]) ) {
			error("User First Name not provided.");
		}
		if ( !isset($_POST["name_last"]) ) {
			error("User Last Name not provided.");
		}
		if ( !isset($_POST["email"]) ) {
			error("User Email not provided.");
		}
		if ( !isset($_POST["phone_cell"]) ) {
			error("User Cell Phone Number provided.");
		}
		if ( !isset($_POST["password"]) ) {
			error("User Password provided.");
		}
		if ( !preg_match("/^[a-zA-Z]{2,62}$/", $_POST["name_first"]) ) {
			error("First name should range between 2 and 62 characters.");
		}
		if ( !preg_match("/^[a-zA-Z]{2,62}$/", $_POST["name_last"]) ) {
			error("Last name should range between 2 and 62 characters.");
		}
		if ( !preg_match("/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/", $_POST["email"]) ) {
			error("' ".$_POST["email"]." ' is not a valid email address.");
		}
		if ( !preg_match("/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/", $_POST["phone_cell"]) ) {
			error("' ".$_POST["phone_cell"]." ' is not a valid US phone number.");
		}
		if ( !preg_match("/^(?!.{31})(?=.{8})(?=.*[^A-Za-z])(?=.*[A-Z])(?=.*[a-z]).*$/", $_POST["password"]) ) {
			error("Password MUST contain at least 1 uppercase alphabetic character, 1 lowercase alphabetic character, 1 non-alphabetic character, and MUST be between 8 and 30 characters in length.");
		}
		// handle optional null parameters here
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
		if ( isset($_POST["phone_home"]) ) {
			if ( !preg_match("/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/", $_POST["phone_cell"]) ) {
				error("' ".$_POST["phone_home"]." ' is not a valid US phone number.");
			}
		}
	} catch ( Exception $e ) {
		error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
	}
}

function secure($pw) {
	// hashing done here
	return $pw;
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

checkUser();

try {
	// PASSWORD INITIALIZATION
	$password = secure($_POST["password"]);
	
	// // INSERT (REGISTER) NEW USER
	// $db = new Database();
	// $db->setup();
	// $sql = "INSERT INTO Users ( email, password, cwid, name_first, name_last, dob, medical_issues, blood_type, dorm_building, dorm_roomnum, phone_cell, phone_home ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );";
	// $types = "ssssssssssss";
	// $stmt = $db->prepare($sql);
	// if ( !mysqli_stmt_bind_param($stmt, $types, $_POST["email"], $password, $_POST["cwid"], $_POST["name_first"], $_POST["name_last"], $_POST["dob"], $_POST["medical_issues"], $_POST["blood_type"], $_POST["dorm_building"], $_POST["dorm_roomnum"], $_POST["phone_cell"], $_POST["phone_home"] ) ) {
	// 	error(mysqli_stmt_error($stmt)." (1)");
	// }
	// if ( !mysqli_stmt_execute($stmt) ) {
	// 	error(mysqli_stmt_error($stmt)." (2)");
	// }
	// mysqli_stmt_close($stmt);
	// $latestid = $db->insert_id(); 
	// $db->disconnect();

	// INSERT (REGISTER) NEW USER
	$db = new Database();
	$db->setup();
	$sql = "INSERT INTO Users ( email, password, cwid, name_first, name_last, dob, medical_issues, blood_type, dorm_building, dorm_roomnum, phone_cell, phone_home ) VALUES ( '".$_POST["email"]."', '".$password."', '".$_POST["cwid"]."', '".$_POST["name_first"]."', '".$_POST["name_last"]."', '".$_POST["dob"]."', '".$_POST["medical_issues"]."', '".$_POST["blood_type"]."', '".$_POST["dorm_building"]."', '".$_POST["dorm_roomnum"]."', '".$_POST["phone_cell"]."', '".$_POST["phone_home"]."' );";
	
	if ( $response = $db->send_sql($sql) ) {
		if ( !is_resource($response) ) {
			if ( $response == 1 ) {
			} else {
				// ADD ALL ANTICIPATED preg_match ERRORS HERE

				// error for existant email
				if (preg_match('/\bDuplicate entry\b/i', $response)) {
					error("Email already exists in database.");
				}

				// all other errors
				error($response);
			}
		}
	} else {
		error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
	}

	$latestid = $db->insert_id(); 
	$db->disconnect();
	
	// UPDATE "date_created" USING MySQL "NOW()" FUCNTION
	$db = new Database();
	$db->setup();
	$sql = "UPDATE Users SET date_created = NOW() WHERE email = '".$_POST["email"]."';";
	
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
	$result["uid"] = $latestid;
	echoJson($result);
	exit;
} catch ( Exception $e ) {
	error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
}
?>
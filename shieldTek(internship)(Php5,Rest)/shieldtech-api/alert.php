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

function checkAlert() {
	try {
		if ( !isset($_POST["uid"]) ) {
			error("No User ID provided.");
		}
	} catch ( Exception $e ) {
		error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
	}
}

function validate_lat($lat) {
	global $result;
	if ( preg_match('/^(\+|-)?((\d+)|(\d+)\.(\d+)|\.(\d+))$/', $lat) ) {
		if ( floatval($lat) >= (-90) && floatval($lat) <= (90) ) {
			return $lat;
		} else {
			$result["latitude_validation_error"] = "' ".$lat." ' does not exist.";
			error_log("' ".$lat." ' does not exist.", 0);
			return;
		}
	} else {
		$result["latitude_validation_error"] = "' ".$lat." ' is not a valid latitude.";
		error_log("' ".$lat." ' is not a valid latitude.", 0);
		return;
	}
}

function validate_long($long) {
	global $result;
	if ( preg_match('/^(\+|-)?((\d+)|(\d+)\.(\d+)|\.(\d+))$/', $long) ) {
		if ( floatval($long) >= (-180) && floatval($long) <= (180) ) {
			return $long;
		} else {
			$result["longitude_validation_error"] = "' ".$long." ' does not exist.";
			error_log("' ".$long." ' does not exist.", 0);
			return;
		}
	} else {
		$result["longitude_validation_error"] = "' ".$long." ' is not a valid longitude.";
		error_log("' ".$long." ' is not a valid longitude.", 0);
		return;
	}
}

function validate_timestamp($timestamp) {
	global $result;
	if ( preg_match('/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|(\+|-)\d{2}(:?\d{2})?|(\+|-)\d{4})$/', $_POST["timestamp"]) ) {
		try {
			$datetime = new DateTime($timestamp);
			$datetime->format('Y-m-d H:i:s');
			return $timestamp;
		} catch ( Exception $datetimeException ) {
			$result["timestamp_validation_error"] = "' ".$timestamp." ' is an invalid timestamp.";
			error_log("' ".$timestamp." ' is an invalid timestamp.", 0);
			return;
		}
	} else {
		$result["timestamp_validation_error"] = "' ".$timestamp." ' is an invalid timestamp.";
		error_log("' ".$timestamp." ' is an invalid timestamp.", 0);
		return;
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

// verify status is set
if ( !isset($_POST["action"]) ) {
    error("Action not set.");
} else {
	$action = $_POST["action"];
}

checkAlert();

if ( $action == "newalert" ) { // handles "newalert" action
	try {
		$status = "SOS";
		/*// INSERTS NEW TABLE ENTRY
		$db = new Database();
		$db->setup();
		$sql = "INSERT INTO Alerts (uid, alert_status) VALUES (?, ?);";
		$types = "ss";
		$stmt = $db->prepare($sql);
		if ( !mysqli_stmt_bind_param($stmt, $types, $_POST["uid"], $status) ) {
			error("Database error.");
		}
		if ( !mysqli_stmt_execute($stmt) ) {
			error("Database error.");
		}
		mysqli_stmt_close($stmt);
		$latestid = $db->insert_id();
		$db->disconnect();*/

		// INSERT (REGISTER) NEW USER
		$db = new Database();
		$db->setup();
		$sql = "INSERT INTO Alerts ( uid, alert_status ) VALUES ( '".$_POST["uid"]."', '".$status."' );";
		
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
		
		$latestid = $db->insert_id(); 
		$db->disconnect();

		$valid_lat = validate_lat($_POST["lat"]);
		$valid_long = validate_long($_POST["long"]);
		// CREATES LOCATION AND LOCATION HISTORY ARRAYS
		$initial_loc_toodee_array[0] = array( 'lat' => $valid_lat, 'long' => $valid_long );
		$location_history_toodee_array[0] = array( 'timestamp' => validate_timestamp($_POST["timestamp"]), 'latitude' => $valid_lat, 'longitude' => $valid_long );
		$initial_loc = json_encode($initial_loc_toodee_array);
		$location_history = json_encode($location_history_toodee_array);
		
		// UPDATES CREATED TABLE ENTRY WITH VALUES AFTER VALIDATION
		$db = new Database();
		$db->setup();
		$sql = "UPDATE Alerts SET initial_loc = '".$initial_loc."', initial_loc_lat = '".$valid_lat."', initial_loc_long = '".$valid_long."', location_history = '".$location_history."' WHERE aid = '".$latestid."';";
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
		$result["aid"] = $latestid;
		echoJson($result);
		exit;
	} catch ( Exception $e ) {
		error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
	}
}

if ( $action == "update" ) {
	try {
		$valid_lat = validate_lat($_POST["lat"]);
		$valid_long = validate_long($_POST["long"]);
		$current_loc_toodee_array[0] = array( 'lat' => $valid_lat, 'long' => $valid_long );
		$current_loc = json_encode($current_loc_toodee_array);

		// UPDATING LOCATION HISTORY
		$db = new Database();
		$db->setup();
		$sql = "SELECT location_history FROM Alerts WHERE aid = '".mysql_real_escape_string($_POST["aid"])."';";
		$db->send_sql($sql);
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
		$rslt = $fetched->fetch_assoc();
		$json = json_decode($rslt["location_history"]);
		array_push($json, array( 'timestamp' => validate_timestamp($_POST["timestamp"]), 'latitude' => validate_lat($_POST["lat"]), 'longitude' => validate_long($_POST["long"]) ));
		$updated_history = json_encode($json);
		$sql = "UPDATE Alerts SET current_loc = '".$current_loc_toodee_array."', current_loc_lat = '".$valid_lat."', current_loc_long = '".$valid_long."', location_history = '".$updated_history."' WHERE aid = '".mysql_real_escape_string($_POST["aid"])."';";
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

if ( $action == "cancel" ) {
	try {
		// INITIALIZING LOCATION VARIALBE
		$valid_lat = validate_lat($_POST["lat"]);
		$valid_long = validate_long($_POST["long"]);
		$location_toodee_array[0] = array( 'lat' => $valid_lat, 'long' => $valid_long );
		$last_location = json_encode($location_toodee_array);
		
		// UPDATING TABLE TO CANCEL STATUS
		$db = new Database();
		$db->setup();
		$sql = "SELECT location_history FROM Alerts WHERE aid = '".mysql_real_escape_string($_POST["aid"])."';";
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
		$json = json_decode($rslt["location_history"]);
		array_push($json, array( 'timestamp' => validate_timestamp($_POST["timestamp"]), 'latitude' => validate_lat($_POST["lat"]), 'longitude' => validate_long($_POST["long"]) ));
		$updated_history = json_encode($json);
		$sql = "UPDATE Alerts SET location_history = '".$updated_history."', end_time = NOW(), end_loc_lat = '".$valid_lat."', end_loc_long = '".$valid_long."', end_loc = '".$last_location."', alert_status = 'canceled' WHERE aid = '".mysql_real_escape_string($_POST["aid"])."';";
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
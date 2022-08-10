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

function echoJson($data)
{
    header('Content-Type: text/json');
    echo json_encode($data);
}

function error($msg)
{
    $result[0]["status"] = "ERROR";
    $result[0]["error_details"] = $msg;
    error_log($msg, 0); // enabled default PHP error logging on our server containing the passed message
    echoJson($result);
    exit;
}

$db = new Database();
$db->setup();
$sql = "SELECT * FROM Users";
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
$i = 0;
while ( $rslt = $response->fetch_assoc() ) {
    if ( !is_null($rslt) ) {
        foreach ( $rslt as $key => $value ) {
            if ( $key != 'password' ) {
                $result[$i][$key] = $value;
            }
        }
        $i++;
    }
}
if (!is_null($result)) {
    $db->disconnect();
    echo echoJson($result);
    exit;
}
$db->disconnect();
return false;
?>
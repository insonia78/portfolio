<?php
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
error_reporting(0);
ini_set('display_errors','0');
require('dbClass.php');
/*

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

if (!isset($_FILES["profile_img"])) {
	error('File not provided');
}

$file = $_FILES["profile_img"];
$file_name = $file['name'];
$file_tmp = $file['tmp_name'];
$file_size = $file['size'];
$file_error = $file['error'];

$file_ext = strtolower(end(explode('.', $file_name)));

$allowed = array('png', 'jpg', 'jpeg');

if (!in_array($file_ext, $allowed)) {
	error('Wrong file type.');
}
if ($file_error !== 0) {
	error('Something went wrong. [file error value !== 0]');
}
if (!($file_size <= 5000000)) {
	error('File size exceeds limit.');
}




?>
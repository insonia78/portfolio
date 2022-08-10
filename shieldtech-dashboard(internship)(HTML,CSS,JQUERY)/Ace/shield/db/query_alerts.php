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

  function echoJson ($data) {
    header('Content-Type: text/json');
    echo json_encode($data);
  }

  function error ($msg) {
    $result[0]["status"] = "ERROR";
    $result[0]["error_details"] = $msg;
    error_log($msg, 0); // enabled default PHP error logging on our server containing the passed message
    echoJson($result);
    exit;
  }

  $db = new Database();
  $db->setup();
  $sql = "SELECT * FROM Alerts WHERE alert_status = 'SOS' OR alert_status = 'canceled';";
  if ( $response = $db->send_sql($sql) ) {
    if ( !is_resource($response) ) {
      if ( $response == 1 ) {
        // continue with statement
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
          if ( $key != 'status' ) {
              $result[$i][$key] = $value;
          }
      }
      $db_loop = new Database();
      $db_loop->setup();
      $sql_loop = "SELECT * FROM Users WHERE uid = '".$result[$i]["uid"]."';";
      if ( $response_loop = $db_loop->send_sql($sql_loop) ) {
        if ( !is_resource($response_loop) ) {
          if ( $response_loop == 1 ) {
          } else {
            // ADD ALL ANTICIPATED preg_match ERRORS HERE


            // all other errors
            error($response_loop);
          }
        }
      } else {
        error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
      }
      $rslt_loop = $response_loop->fetch_assoc();
      foreach ( $rslt_loop as $key_loop => $value_loop ) {
        if ( $key_loop != 'uid' && $key_loop != 'password' ) {
          $result[$i][$key_loop] = $value_loop;
        }
      }
      $db_loop->disconnect();
      $i++;
    }
  }
  if (!is_null($result)) {
    $db->disconnect();
    $result[0]["status"] = "OK";
    echoJson($result);
    exit;
  }
  $db->disconnect();
  return false;
  // if ( !is_null($rslt) ) {
  //  foreach ( $rslt as $key => $value ) {
  //      if ( $key != 'status' ) {
  //          $result[$key] = $value;
  //      }
  //  }
  //  $sql = "SELECT * FROM Users WHERE uid = '".$result["uid"]."';";
  //  if ( !$fetched = $db->send_sql($sql) ) {
  //      error("Database fetching error.");
  //  }
  //  $rslt = $fetched->fetch_assoc();
  //  foreach ( $rslt as $key => $value ) {
  //      if ( $key != 'uid' && $key != 'password' ) {
  //          $result[$key] = $value;
  //      }
  //  }
  //  $db->disconnect();
  //  echoJson($result);
  //  exit;
  // }
  // $db->disconnect();
  // return false;
?>
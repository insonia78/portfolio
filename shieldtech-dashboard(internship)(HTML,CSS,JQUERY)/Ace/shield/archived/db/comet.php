<?php
  /*
    
    SHIELDtech Dashboard Comet Server API v0.1

  */
  require("dbClass.php");
  require("require.php");

  $aid_object = (isset($_POST['aids'])) ? $_POST['aids'] : null;
  $die_time = (time()+((isset($_POST['heartbeat'])) ? $_POST['heartbeat'] : 32));

  function echoJson ($data) {
    header('Content-Type: text/json');
    echo json_encode($data);
  }

  function error ($msg) {
    $pull['status'] = 'error';
    $pull['story'] = $msg;
    error_log($msg, 0); // enabled default PHP error logging on our server containing the passed message
    echoJson($pull);
    exit;
  }

  function heartbeat () {
    $pull['status'] = 'OK';
    $pull['story'] = 'heartbeat';
    echoJson($pull);
    exit;
  }

  function push ($pull) {
    $stat['status'] = 'OK';
    $stat['story'] = 'alert';
    array_push($pull, $stat);
    echoJson($pull);
    exit;
  }

  while (is_null($pull)) {
    $i = 0;
    $data = null;
    while ( (((mysqli_num_rows($data)) == 0) ? true : false) ) {
      if (time() > $die_time) { heartbeat(); }
      $aid = $aid_object[$i] ? $aid_object[$i] : '';
      $db = new Database();
      $db->setup();
      $sql = "SELECT * FROM Alerts WHERE alert_status = 'SOS' OR alert_status = 'canceled';";
      if ( $data = $db->send_sql($sql) ) {
        if ( !is_resource($data) ) {
          if ( $data == 1 ) {
          } else {
            // ADD ALL ANTICIPATED preg_match ERRORS HERE
  
            // all other errors
            error($data);
          }
        } 
        
      } else {
        error("Unknown error. Please contact an administrator with the following bracketed information: [ COMET SERVER ERROR  || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
      }
      $db->disconnect();
      $i++;
      usleep(250000);
    }
  
    $i = 0;
    while ( $rs = $data->fetch_assoc() ) {
      if ( !is_null($rs) && !(in_array($rs['aid'], $aid_object)) ) {
  
        foreach ( $rs as $key => $value ) {
            if ( $key != 'status' ) {
              $pull[$i][$key] = $value;
            }
        }
  
        $db_loop = new Database();
        $db_loop->setup();
        $sql_loop = "SELECT * FROM Users WHERE uid = '".$pull[$i]["uid"]."';";
        if ( $data_loop = $db_loop->send_sql($sql_loop) ) {
          if ( !is_resource($data_loop) ) {
            if ( $data_loop == 1 ) {
            } else {
              // ADD ALL ANTICIPATED preg_match ERRORS HERE
  
  
              // all other errors
              error($data_loop);
            }
          }
        } else {
          error("Unknown error. Exception thrown during validation, please contact an administrator with the following bracketed information: [ ".$e." || ".substr(date(DATE_RSS, time()), 0, 25)." ]");
        }
        $rs_loop = $data_loop->fetch_assoc();
        foreach ( $rs_loop as $key_loop => $value_loop ) {
          if ( $key_loop != 'uid' && $key_loop != 'password' ) {
            $pull[$i][$key_loop] = $value_loop;
          }
        }
        $db_loop->disconnect();
        $i++;
      }
    }
  }
  push($pull);
?>
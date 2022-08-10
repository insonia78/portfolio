<?php

/* file getLastIdProcessed.php
 * @uthor:Thomas Zangari
 * @date: 1/11/2016
 * 
 * the class deals with all the operations that have to do with the last id of the table 
 * 
 * 
 * 
 */



error_reporting(0);
ini_set('display_errors', '0');


class getLastIdProcessed {   
//put your code here 
  
  
  
  public function upDateId($db)
  {
      $table = "temp_input_feedback";
      $query = 'select max(id) from temp_input_feedback';
      
      $result = $db->send_sql($query);
      $r = mysqli_fetch_assoc($result);
      
      
      
      $id = ( $r['max(id)'] + 1);
      $query = "Update lastIdFromTheServer Set last_id='$id' where server = '$table' ";
      
      
      $result = $db->send_sql($query);
      
      return $result;
      
      
      
  }
  public function getTheLastIdProcessedFromTheServers( $server ,$db )
  {
     
      
      $query = "Select last_id From lastIdFromTheServer where server='$server';";
      
      
      $result = $db->send_sql($query);
      $h = mysqli_fetch_assoc($result);
      
      
  
      return $h['last_id'];
      
  }
  
  
  
 
  
   
}//end of class
?>
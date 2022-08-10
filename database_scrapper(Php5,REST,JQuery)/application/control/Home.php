<?php


/* Home.php  requires ../config/main.php 
 * 
 * @author: Thomas Zangari  
 * @date 1/11/2015 
 * 
 * The file gets the data from the temp_input_feedback table after authantication
 * 
 * 
 * 
 * 
 */

defined('BASEPATH') OR exit('No direct script access allowed');




$db = new Database();
 $db->connect();
$getLastIdProcessed = new getLastIdProcessed();

// gets the last id processed from the lastIdFromServer mysql table 

$id = $getLastIdProcessed->getTheLastIdProcessedFromTheServers('temp_input_feedback', $db);

$performActionOnDatabaseTables = new performActionOnDatabaseTables();



try {
   
  
    $query = "Select * from temp_input_feedback where id >= '$id'" ;


    $result = $db->send_sql($query);
    
    if ($result) {    
        include_once "../view/input_feedback_view.php";
    } else {
        
        include_once "../view/input_feedback_view.php";
        echo"<h2 style='color:red;'>You are not connected to the data base</h2>";
    }
} catch (Exception $e) {
    "echo" . $e->getMessage();
}
?>
<?php

/*
 * file:fetch-data-from-server.php
 * @author :Thomas Zangari
 * @data: 1/11/2015
 * 
 * the application does a manual fetch 
 * 
 * 
 */



defined('BASEPATH') OR exit('No direct script access allowed');   


try {
     $getLastIdProcessed = new getLastIdProcessed();
     $id = $getLastIdProcessed->getTheLastIdProcessedFromTheServers("temp_input_feedback", $db);
     
     
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
    
     
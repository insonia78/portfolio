<?php

/************************
 * file ../control/Home.php 
 * @author Thomas Zangari   
 * @date 1/12/2016
 * 
 * The file starts the application by capturing what was transfereb by the cron call 
 * it uses sessions to save information about the capturing of the data 
 * 
 * 
 * 
 **************************/



session_start();
require '../../Init.php';

require '../model/DBClass.php';

require '../model/getLastIdProcessed.php';

require '../model/getDataFromServerWithCurl.php';

require '../model/JsonHandler.php';

require '../model/Normalize_Data.php';

require '../model/performActionOnDatabaseTables.php';

require '../model/createToken.php';


 $ajaxtoken = "process";
 $fetch = "true" ;

 
$from_input_feedback_view = $_GET['fetch'];
$ajax = $_POST['ajax'];


if( md5($_POST['password']) ==  $passwordConfirm )
{
    
   
     require'../control/Home.php';
     
    $info =  explode(',',$_SESSION['info']);
   
    for($i = 0 ; $i < count($info); $i++)
    {
        
        echo $info[$i];
        
        
        
    }
    session_destroy();
}
else if ($from_input_feedback_view ==  "true") {
   
    
    //$ajaxtoken =  getRandomToken($length);
    //$fetch = getRandomToken($length);
    require'../control/get_data_from_servers.php';
    
} else if ($ajax ==  "process") {

     
    require '../control/concluded-the-process-from-the-view.php';
} 
else
{
    $location = "main.php";
    echo "<h2 style='color:red'>Wrong Password!</h2>";
    require'../../logIn.php';
    
}









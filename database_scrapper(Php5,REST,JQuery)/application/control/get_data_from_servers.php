<?php

/*get_data_from_servers.php
 * @author: Thomas Zangari  
 * @date: 1/11/2015
 * 
 * it makes a fetches to the servers when the fetch data button is pressed in the input_feedback_view  
 * 
 * 
 */

 
 defined('BASEPATH') OR exit('No direct script access allowed');        

 



error_reporting(0);
ini_set('display_errors', '0');

$performActionOnDatabaseTables = new performActionOnDatabaseTables();
$getLastIdProcessed = new getLastIdProcessed();

$db = new Database();

$db->connect();

$normalize_data = new Normalize_Data();
$Curldata =  new getDataFromServerWithCurl ();
$json = new JsonHandler();


$listOfUrls = $db->getURL();
$urlLenght = count($listOfUrls);


/***********************************************************************************************/

/***************************************************************************************************/




/***********************************************************************************************************/
 
  
// change functinality

     for($i = 0 ; $i < $urlLenght ; $i++)
     {
         
       
       $lastIdProcessed = $getLastIdProcessed->getTheLastIdProcessedFromTheServers($listOfUrls[$i],$db);
       
       $newId = Process_Url($listOfUrls[$i],$lastIdProcessed,$Curldata,$json,$db,$normalize_data,$performActionOnDatabaseTables,$from_input_feedback_view);
       
       if($newId != 'exit')
      {
          
       $performActionOnDatabaseTables->upDateIdtableOfTheServers(($newId + 1),$listOfUrls[$i],$db);
      
       
      }
     }
/****************************************************************************************************************************************************/

     
     
 if($from_input_feedback_view == "true" && $newId != 'exit')
{  
   
    include_once "fetch-data-from-servers.php";

    
}  
function Process_Url ($url,$lastIdProcessed,$Curldata,$json,$db,$normalize_data,$performActionOnDatabaseTables,$from_input_feedback_view)
{
    
    $result = $Curldata->sendRequestToServerWithCurl($url,$lastIdProcessed);
  
    $json_data = $json->decode($result);
  
    if($json_data == 0)
    {
       
     
       
         if($from_input_feedback_view == "true")
         {      
           
             include_once "fetch-data-from-servers.php";
             echo "<h2 class='information' style='position:relative;color:red;z-index:1;background-color:orange;'>No data fetch for ".$url."</h2>";
           
          }
          return 'exit';
          
        
      
    }
    else
    {
       $aData = $performActionOnDatabaseTables->insertJsonDataIntoDatabase($json_data,$normalize_data,$db);
     
       
       return $aData;
       
    }
    
    
     
    
   
   
    
}


 
       

?>
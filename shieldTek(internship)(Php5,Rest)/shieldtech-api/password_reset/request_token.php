<?php

error_reporting(0);
ini_set('display_errors', '0');

require_once('../../dbClass_for_password_reset.php');
require_once('../../dbClass.php');

echo'<style>
    .error{
    color:red;
    }
 </style>';

$validate = false;
$result = array();

if (!isset($_POST["apikey"])) {
$result["status"] = "INVALID_REQUEST";
$result["error_details"] = "No API key provided.";
echoJson($result);
exit;
}

// verify API key
if ($_POST["apikey"] != '77ce2d83add9f5359fbf2cc35ef7ea4fe06df05b') {
error("Invalid API key.");
}
/*
 * connecting to dbClass;
 */
$db = new Database();
$db->setup();

//if the two passwords match
try
{
    if (($_POST['email']) == null ) 
     {
        echo('<p class ="error">User Email not provided.</p>');
        //calling the html form for just the email
        
       Form();
     }
     $email = $_POST['email'];
     if ((filter_var($email, FILTER_VALIDATE_EMAIL)))
     {
         $validate = true;
          
     }
     else
     {
         echo('<p class="error">'.$_POST['email'].' is not a valid email address.</p>');
         Form();
     }
/*
 * cheking if it the email is registered
 */         
if (($validate == true) && ($_POST['token'] == null))  
{
    $email = $_POST['email'];
    
    $q = "SELECT email FROM Users Where email='$email'";
    if ($response = $db->send_sql($q)) 
    {
        $n = $db->getRow($response);

        if ($n == 0) 
        {
           echo'<p class="error">Emails is not register</p>';
           Form();
         } 
         else 
         {
             
             $token = getRandomToken(10);
             $q = "UPDATE Users SET token = '$token' WHERE email= '$email'";
             if ($response = $db->send_sql($q)) 
             {
                  
                  $db->sendEmail($token, $email);
                  
             }
         }  
     }
     $validate = false;
}


}catch( Exception $e)
{
    error("Unknown error.");
}




function getRandomToken($length) {
         $validCharacters = "ABCDEFGHIJKLMNPQRSTUXYVWZabcdefghijlmnopqrstuxyvwz0123456789";
         $validCharNumber = strlen($validCharacters);
         $result = "";

         for ($i = 0;$i < $length;$i++) 
         {
             $index = mt_rand(0, $validCharNumber - 1);
             $result .= $validCharacters[$index];
         }

         return $result;
     }
     function Form()
     {
        include_once('../../step1.php');
        die();
     }
     


$db->disconnect();
  ?>
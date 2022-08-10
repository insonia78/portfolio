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

/*
 * Checking if the email is typed correct 
 */
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
     if($_POST['token'] == null)
     {
        
         echo('<p class="error">You must enter a Momentary Password</p>');
         Form();
     }
     
    
/*
 * if token and email are correct
 */     
if (($token = $_POST["token"]) AND ( $email = $_POST['email']))
{
    //checking for email existens in the database
     $q = "SELECT email FROM Users Where email='$email'";
    if ($response = $db->send_sql($q)) 
    {
        $n = $db->getRow($response);

        if ($n == 0) 
        {
           echo'<p class="error">Emails is not register</p>';
           Form();
         }
    }
    
       $q = "SELECT token,email FROM Users Where token='$token'";
       $dbr = new db_pass_reset ();
       if($response = $dbr->connect_to_db($q))
       {
           
           $n = $dbr->CheckFields($response, $token, $email);
           
            if ($n != 2)
            {
                 echo'<p class="error">Momentary Password is not correct! </p>';
                 Form();
                 
            } 
            else 
            {    $token = $_POST['token'];
                // this part brings the user to the reset html page   
                include_once('../../ressetpassword.php');
                 
            }
           
        }
}
function Form()
{
   include_once('../../step2.php');
   die();  
}
?>

<?php

require_once('../../dbClass.php');
$token = $_POST['token'];
$db = new Database();
$db->setup();

if ( preg_match("/^(?!.{31})(?=.{8})(?=.*[^A-Za-z])(?=.*[A-Z])(?=.*[a-z]).*$/", $_POST["password1"]) ) {
     
     
}
else
{
    
    echo("Password MUST contain at least 1 uppercase alphabetic character, 1 lowercase alphabetic character, 1 non-alphabetic character, and MUST be between 8 and 30 characters in length.");
    $token = $_POST['token'];
    
    Form($token);
}
if($resetpassword = $_POST['resetpassword'] == null)
{
    echo ('Must Compleate All Fields');
    $token = $_POST['token'];
    
    Form($token);
}


if ((($password = $_POST['password1']) == ($resetpassword = $_POST['resetpassword']))AND $password != null) {
    $null = null;
   

    $token = $_POST['token'];
    $q = "UPDATE Users SET password ='$password' Where token ='$token'";
    
    if ($resp = $db->send_sql($q)) {
        echo '<p class="error"> password was changed</p>';
        $q2 = "UPDATE Users SET token ='$null' Where token ='$token'";
        if($db->send_sql($q2))
        {
            
        }
        else{
            echo'<p class="error">Was not able to erase the token</p>';
        }
      
    } else {
        echo '<p class="error">Was not able to reset the password</p>';
        
       Form($token);  
    }
}  
if (($password = $_POST['password1']) != ($resetpassword = $_POST['resetpassword'])) {
   echo'Passwords dont match';
    $token = $_POST['token'];
    Form();            
}
function Form($token)
{
   include_once('../../ressetpassword.php');
    die(); 
}
$db->disconnect();
?>

<?php
error_reporting(0);
session_start();
include ('config.php');
if($_SESSION['login_details']['user_id']!=""){
     header("Location:upcomming.php");
       exit;
}




$submit = $_POST['submit'];



if($submit=="Login"){
   $username = $_POST['username'];
   $password = sha1($_POST['password']);
   $query = "select * from internalusers where username='".$username."' and password='".$password."'";
   $result = mysql_query($query);
   $fetch = mysql_fetch_assoc($result);
   $count = mysql_num_rows($result);
   if($count==1){
       $login_ses['user_dept'] = $fetch['department'];
       $login_ses['user_name'] = $fetch['username'];
       $login_ses['user_id'] = $fetch['id'];
       $_SESSION['login_details'] = $login_ses;
       $ipaddress = get_client_ip();
       $insert = "insert into logging(eventUser,eventAction,eventIP) values('".$fetch['username']."','loging','".$ipaddress."');";
       mysql_query($insert);
       header("Location:upcomming.php");
       exit;
   }  else {
        $_SESSION['error'] = 'The usename or password you entered is incorrect. ';
   }
  
}

 
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Axon EMS Login</title>
<link rel="stylesheet" type="text/css" href="css/style.css" />
</head>

<body>
<div class="login_wrapper">
	<div class="login_content">
    	<a href="#" class="logo">
        	<img src="images/axon_logo.png" />
        </a><!--logo-->
        <div class="credentials">
            <form name="login" action="index.php" method="post">
            <div class="login_text">
                <h2>Sign In to AxTrax</h2>            
                <input type="text" placeholder="Email Address" name="username" required/>
                <input type="password" placeholder="Password" name="password" required/>
            </div><!--login text-->
            <?php if (isset($_SESSION['error'])){?>
         
            <p style="color: #C03523; font-size: 12px; padding-left: 20px;"><?php echo $_SESSION['error']; ?></p>
            <script>setTimeout("location.href='index.php'", 1000);</script>
            <?php } ?>
            <div class="actions">
                <p>
                    <input type="reset" class="cancel" value="Cancel" />
                    <input type="submit" class="login" value="Login" name="submit"/>
                </p>
            </div>
            </form>
        </div><!--credentials-->
        <p class="copy">&#169; 2015 Axon communications, Inc.</p>
    
    </div><!--login content-->

</div><!--login wrapper-->
</body>
</html>
<?php unset($_SESSION['error']);?>

<?php
error_reporting(0);
session_start();
include ('config.php');
 $_SESSION['login_details']['user_id'];
if($_SESSION['login_details']['user_id']==""){
     header("Location:index.php");
       exit;
}
$edit_id = $_REQUEST['edit_id'];
if($edit_id!=""){
    $query = "select * from videographers where vID = '".$edit_id."'";
    $result = mysql_query($query);
    $fetch = mysql_fetch_assoc($result);
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Axon-Videographer</title>
<link rel="stylesheet" type="text/css" href="css/style.css" />
<script src="js/jquery.js"></script>
<style>
    ul li label:first-child{
        color: #9b9b9c !important;
    font-family: "helveticasregularregular" !important;
    font-size: 12px !important;
    line-height: 25px !important;
    text-align: left !important;
    }
     ul li label:last-child{
        text-align: left !important;
        color: #555556 !important;
        font-family: "helveticasregularregular" !important;
    font-size: 12px !important;
    line-height: 25px !important;
    }
</style>
</head>

<body>
<div id="main_wrapper">
	<div class="main_content">
        <div class="header">
            <h1>Videographer Details</h1>
            <img src="images/logo_small.png" />
        </div><!--header-->
        <div class="enroll_content">
        	<a href="logout.php" style="float: right; margin-top: -30px;">+Logout</a>
        	<div class="tab_conatiner">
                <div class="tab_tit" id="tab1"><a href="upcomming.php">Upcoming</a></div>
                <div class="tab_tit" id="tab2"><a href="postponed.php">Postponed</a></div>
                <div class="tab_tit" id="tab2"><a href="cancelled.php">Cancelled</a></div>
                <div class="tab_tit" id="tab3"><a href="filmed.php">Filmed</a></div>
                <div class="tab_tit active_state" id="tab4"><a href="videographer.php">Videographers</a></div>
            </div><!--tab container-->
          
            <div class="enroll_text">
                 <?php if($_SESSION['success']!=''){?> <p class="success"><?php echo $_SESSION['success']; ?></p><script>setTimeout("location.href=''", 1000);</script><?php }?>
               <?php if($_SESSION['error']!=''){?> <p class="success"><?php echo $_SESSION['error']; ?></p><script>setTimeout("location.href=''", 1000);</script><?php }?>
               
            	<div class="video_detail">
                <h1>Videographer Information</h1>
              
                <ul class="enter_details" style=" padding-left: 150px;">
                 
                    <li>
                    <label>Videographer name</label>
                   <label><?php echo $fetch['Name'];?></label>
                    </li>
                    <li>
                    <label>Company name</label>
                    <label><?php echo $fetch['CompanyName'];?></label>
                    </li>
                    <li>
                    <label>Videographer phone</label>
                    <label><?php echo $fetch['PrimPhone'];?></label>
                    </li>
                    <li>
                    <label>Videographer cell</label>
                    <label><?php echo $fetch['SecPhone'];?></label>
                    </li>
                    <li>
                    <label>Videographer alternate</label>
                   <label><?php echo $fetch['videographer_alter'];?></label>
                    </li>
                    <li>
                    <label>videographer email</label>
                    <label><?php echo $fetch['Email'];?></label>
                    </li>
                    
                 <li>
                    <label>Street</label>
                    <label><?php echo $fetch['Street'];?></label>
                    </li>
                    <li>
                    <label>City</label>
                    <label><?php echo $fetch['City'];?></label>
                    </li>
                    <li>
                    <label>State</label>
                   <label><?php echo $fetch['State'];?></label>
                    </li>
                    <li>
                    <label>Zip</label>
                    <label><?php echo $fetch['Zip'];?></label>
                    </li>
                    <li>
                    <label>Camera</label>
                   <label><?php echo $fetch['Camera'];?></label>
                    </li>
                    <li>
                    <label>Ring Size</label>
                    <label><?php echo $fetch['RingSize'];?></label>
                    </li>
                    <li>
                    <label>Rate</label>
                    <label><?php echo $fetch['Rate'];?></label>
                    </li>
                    <li>
                    <label>Transfer</label>
                    <label><?php echo $fetch['Transfer'];?></label>
                    </li>
                    
                    <li>
                    <label>Teleprompter no.</label>
                   <label><?php echo $fetch['teleprompt'];?></label>
                    </li>
                </ul>
              
                </div><!--video detail-->	
                
  			</div><!--enroll text-->
        </div><!--enroll content-->
      <p class="copy">&#169; 2015 Axon communications, Inc.</p>
    </div><!--main_content-->

</div><!--main wrapper--> 
    <?php unset($_SESSION['error']);unset($_SESSION['success']);?>

</body>
</html>

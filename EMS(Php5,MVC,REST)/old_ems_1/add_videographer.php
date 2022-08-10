<?php
error_reporting(0);
session_start();
include ('config.php');
if($_SESSION['login_details']['user_id']=="" || $_SESSION['login_details']['user_dept']!=2 ){
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
</script>
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
                <div class="tab_tit" id="tab2"><a href="postponed.php">Postponed</a></div>                 <div class="tab_tit" id="tab2"><a href="cancelled.php">Cancelled</a></div>
                <div class="tab_tit" id="tab3"><a href="filmed.php">Filmed</a></div>
                <div class="tab_tit active_state" id="tab4"><a href="videographer.php">Videographers</a></div>
            </div><!--tab container-->
          
            <div class="enroll_text">
               <?php if($_SESSION['success']!=''){?> <p class="success"><?php echo $_SESSION['success']; ?></p><script>setTimeout("location.href=''", 1000);</script><?php }?>
               <?php if($_SESSION['error']!=''){?> <p class="success"><?php echo $_SESSION['error']; ?></p><script>setTimeout("location.href=''", 1000);</script><?php }?>
               
            	<div class="video_detail">
                <h1 <?php if($fetch['vID']==""){?>Register <?php }else{?> Update <?php } ?>>Videographer Information</h1>
                <form name="videographer" action="videographer.php" method="post" id="myForm">
                <ul class="enter_details">
                 
                    <li>
                    <label>Videographer name</label>
                    
                    <input type="text" name="Name" value="<?php echo $fetch['Name'];?>" required/>
                    </li>
                    <li>
                    <label>Company name</label>
                    <input type="text" name="CompanyName" value="<?php echo $fetch['CompanyName'];?>" required/>
                    </li>
                    <li>
                    <label>Videographer phone</label>
                    <input type="text" name="PrimPhone" onpaste="return false" value="<?php echo $fetch['PrimPhone'];?>"  onkeypress="return isNumberKey(event)" required />
                    </li>
                    <li>
                    <label>Videographer cell</label>
                    <input type="text" name="SecPhone" onpaste="return false"  value="<?php echo $fetch['SecPhone'];?>"  onkeypress="return isNumberKey(event)" required/>
                    </li>
                    <li>
                    <label>Videographer alternate</label>
                    <input type="text" name="videographer_alter" value="<?php echo $fetch['videographer_alter'];?>"/>
                    </li>
                    <li>
                    <label>videographer email</label>
                    <input type="email" name="Email" value="<?php echo $fetch['Email'];?>" required/>
                    </li>
                    
                 <li>
                    <label>Street</label>
                    <input type="text" name="Street" value="<?php echo $fetch['Street'];?>" />
                    </li>
                    <li>
                    <label>City</label>
                    <input type="text" name="City" value="<?php echo $fetch['City'];?>" />
                    </li>
                    <li>
                    <label>State</label>
                    <input type="text" name="State" value="<?php echo $fetch['State'];?>" />
                    </li>
                    <li>
                    <label>Zip</label>
                    <input type="text" name="Zip" onpaste="return false" value="<?php echo $fetch['Zip'];?>" onkeypress="return isNumberKey(event)" />
                    </li>
                    <li>
                    <label>Camera</label>
                    <input type="text" name="Camera" value="<?php echo $fetch['Camera'];?>" />
                    </li>
                    <li>
                    <label>Ring Size</label>
                    <input type="text" name="RingSize" value="<?php echo $fetch['RingSize'];?>" />
                    </li>
                    <li>
                    <label>Rate</label>
                    <input type="text" name="Rate" value="<?php echo $fetch['Rate'];?>" />
                    </li>
                    <li>
                    <label>Transfer</label>
                    <input type="text" name="Transfer" value="<?php echo $fetch['Transfer'];?>" />
                    </li>
                    
                    <li>
                    <label>Teleprompter no.</label>
                    <input type="text" name="teleprompt" value="<?php echo $fetch['teleprompt'];?>" />
                    </li>
                </ul>
                <div class="actions_list">
                <ul class="action_video">
                    <input type="hidden" name="edit_id" value="<?php echo $fetch['vID'];?>"/>
                    <li onclick="window.history.back()"><img src="images/back.png"  onmouseover="this.src='images/back_hover.png';" onmouseout="this.src='images/back.png';"  /></li>
                    <li onclick="document.getElementById('myForm').reset();"><img src="images/cancel.png"  onmouseover="this.src='images/cancel_hover.png';" onmouseout="this.src='images/cancel.png';" /></li>
                    <li><input type="image" src="images/submit_hover.png"  onmouseover="this.src='images/submit.png';" onmouseout="this.src='images/submit_hover.png';" /></li>
                </ul><!--action video-->
                </div>
                
                </form>
                </div><!--video detail-->	
                
  			</div><!--enroll text-->
        </div><!--enroll content-->
      <p class="copy">&#169; 2015 Axon communications, Inc.</p>
    </div><!--main_content-->

</div><!--main wrapper-->
<script type="text/javascript">
function isNumberKey(evt)
 
          {
             var charCode = (evt.which) ? evt.which : event.keyCode
             if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
 
             return true;
          }
</script>
 <?php unset($_SESSION['error']);unset($_SESSION['success']);?>
</body>
</html>

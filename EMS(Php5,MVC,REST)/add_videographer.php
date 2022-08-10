<!--

add videographer.php
version:final 

the page Innerjoin on videographers on assignments




-->



<?php
error_reporting(0);
session_start();
include ('config.php');
if($_SESSION['login_details']['user_id']=="" || $_SESSION['login_details']['user_dept']!=2 ){
     header("Location:index.php");
     exit;
}
$edit_id = $_REQUEST['edit_id'];
//print_r($edit_id);
if($edit_id!=""){
//echo "select * from videographers where vID = '".$edit_id."'"; exit;
    $query = "select * from videographers where vID = '".$edit_id."'";
    $result = mysql_query($query);
    $fetch = mysql_fetch_assoc($result);
}
//echo "select shootdate,shootername,AssignID from assignments INNER JOIN videographers ON assignments.shootername = videographers.Name where videographers.vID = '".$edit_id."'"; exit;
$query = "select shootdate,shootername,AssignID from assignments INNER JOIN videographers ON assignments.shootername = videographers.Name where videographers.vID = '".$edit_id."'";

$result = mysql_query($query);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Axon-Videographer</title>
<link rel="stylesheet" type="text/css" href="css/style.css" />
<script src="js/jquery.js"></script>
 <script>
$(function() {
$( document ).tooltip();
 
});
</script>
 <script type="text/javascript">
        $(document).ready(function(){
          
             setInterval(function(){ $('.autohide').hide(); }, 1500);
        });
       
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
                <a href="upcomming.php"><div class="tab_tit " id="tab1">Pending</div></a>
                <a href="postponed.php"><div class="tab_tit" id="tab2">Postponed</div></a>
                <a href="cancelled.php"><div class="tab_tit" id="tab2">Canceled</div></a>
                <a href="filmed.php"><div class="tab_tit" id="tab3">Filmed</div></a>
                <a href="queue.php"><div class="tab_tit">Queue</div></a>
                <a href="reorder.php"><div class="tab_tit">Reorders</div></a>
                <?php if($_SESSION['login_details']['user_dept']==2){?>
               <a href="videographer.php"> <div class="tab_tit active_state"  id="tab4">Videographers</div></a>
               <?php }?> 
            </div><!--tab container-->
          
            <div class="enroll_text">
               <?php if($_SESSION['success']!=''){?> <p class="success"><?php echo $_SESSION['success']; ?></p><?php }?>
               <?php if($_SESSION['error']!=''){?> <p class="success"><?php echo $_SESSION['error']; ?></p><?php }?>
               
               <h3 style="padding: 20px 0;text-align: center;"><?php if($fetch['vID']==""){?> Register <?php }else{?> Update <?php } ?> Videographer Information</h3>
                <div class="screen_details" style="margin: 0px; float: left;">
               <form name="videographer" action="videographer.php" method="post" id="myForm">
                   
            	<div class="screen_detail_top">
                    <div class="screen_top_left">
                <ul class="enter_details">
                 <li>
                    <div class="tlcon">Videographer name</div>
                    <div class="rlcon"> <input type="text" name="Name" value="<?php echo $fetch['Name'];?>" required /></div>
                    </li>
                    <li>
                    <div class="tlcon">Company name</div>
                    <div class="rlcon"> <input type="text" name="CompanyName" value="<?php echo $fetch['CompanyName'];?>" required/></div>
                    </li>
                    <li>
                    <div class="tlcon">Videographer phone</div>
                    <div class="rlcon"> <input type="text" name="PrimPhone" onpaste="return false" value="<?php echo $fetch['PrimPhone'];?>"  onkeypress="return isNumberKey(event)" required /></div>
                    </li>
                    <li>
                    <div class="tlcon">Videographer cell</div>
                    <div class="rlcon"> <input type="text" name="SecPhone" onpaste="return false"  value="<?php echo $fetch['SecPhone'];?>"  onkeypress="return isNumberKey(event)" required/></div>
                    </li>
                    <li>
                    <div class="tlcon">Videographer alternate</div>
                    <div class="rlcon"> <input type="text" name="videographer_alter" value="<?php echo $fetch['videographer_alter'];?>"/></div>
                    </li>
                    <li>
                    <div class="tlcon">videographer email</div>
                    <div class="rlcon"> <input type="email" name="Email" value="<?php echo $fetch['Email'];?>" required/></div>
                    </li>
                    <li>
                    <div class="tlcon">Street</div>
                    <div class="rlcon"> <input type="text" name="Street" value="<?php echo $fetch['Street'];?>" /></div>
                    </li>
                    <li>
                    <div class="tlcon">City</div>
                    <div class="rlcon"> <input type="text" name="City" value="<?php echo $fetch['City'];?>" /></div>
                    </li>
                    <li>
                    <div class="tlcon">State</div>
                    <div class="rlcon"> <input type="text" name="State" value="<?php echo $fetch['State'];?>" /></div>
                    </li>
                    <li>
                    <div class="tlcon">Zip</div>
                    <div class="rlcon"> <input type="text" name="Zip" onpaste="return false" value="<?php echo $fetch['Zip'];?>" onkeypress="return isNumberKey(event)" /></div>
                    </li>
                </ul>
                    </div>
                    <div class="screen_top_left">
                  <ul class="enter_details">
                 
                    <li>
                    <div class="tlcon">Camera</div>
                    <div class="rlcon"> <input type="text" name="Camera" value="<?php echo $fetch['Camera'];?>" /></div>
                    </li>
                    <li>
                    <div class="tlcon">Ring Size</div>
                    <div class="rlcon"> <input type="text" name="RingSize" value="<?php echo $fetch['RingSize'];?>" /></div>
                    </li>
                    <li>
                    <div class="tlcon">Rate</div>
                    <div class="rlcon"> <input type="text" name="Rate" value="<?php echo $fetch['Rate'];?>" /></div>
                    </li>
                    <li>
                    <div class="tlcon">Transfer</div>
                    <div class="rlcon"> <input type="text" name="Transfer" value="<?php echo $fetch['Transfer'];?>" /></div>
                    </li>
                    <li>
                    <div class="tlcon">Teleprompter no.</div>
                    <div class="rlcon"> <input type="text" name="teleprompt" value="<?php echo $fetch['teleprompt'];?>" /></div>
                    </li>
                    <li>
                    <div class="tlcon">Lighting</div>
                    <div class="rlcon"> <input type="text" name="Lighting" value="<?php echo $fetch['Lighting'];?>" /></div>
                    </li>
                       <li>
                    <div class="tlcon">Audio</div>
                    <div class="rlcon"> <input type="text" name="Audio" value="<?php echo $fetch['Audio'];?>" /></div>
                    </li> 
                      <li>
                    <div class="tlcon">Monitor</div>
                    <div class="rlcon"> <input type="text" name="Monitor" value="<?php echo $fetch['Monitor'];?>" /></div>
                    </li> 
                      <li>
                    <div class="tlcon">Additional Gear</div>
                    <div class="rlcon"> <input type="text" name="AdditionalGear" value="<?php echo $fetch['AdditionalGear'];?>" /></div>
                    </li>
                      <li>
                    <div class="tlcon">Notes</div>
                    <div class="rlcon"> <textarea  name="Notes"><?php echo $fetch['Notes'];?></textarea></div>
                    </li>
                </ul>
                      </div>  
                  </div>  
                <div class="actions_list">
                <ul class="action_video">
                    <input type="hidden" name="edit_id" value="<?php echo $fetch['vID'];?>"/>
                    <li onclick="window.history.back()"><img src="images/back.png"  onmouseover="this.src='images/back_hover.png';" onmouseout="this.src='images/back.png';"  /></li>
                    <li onclick="document.getElementById('myForm').reset();"><img src="images/cancel.png"  onmouseover="this.src='images/cancel_hover.png';" onmouseout="this.src='images/cancel.png';" /></li>
                    <li><input type="image" src="images/submit_hover.png"  onmouseover="this.src='images/submit.png';" onmouseout="this.src='images/submit_hover.png';" /></li>
                </ul><!--action video-->
                </div>
                
                </form></div>
               <div class="jobhistoryfull">
                   <h5 style="text-align: center; padding: 12px;">Job history listing</h5>
                   <div class="jobhistory">
               <table>
                    <?php while ($row = mysql_fetch_assoc($result)) {?>
                   <tr>
                       <td><?php echo $row['shootdate'];?></td><td><a href="enrolldetails.php?edit_id=<?php echo $row['AssignID'];?>">Job No. <?php echo $row['AssignID'];?></a></td><td><?php echo $row['shootername'];?></td>
                       
                   </tr> 
                   <?php  }?> 
               </table>
                </div></div>
  		</div><!--enroll text-->
        </div><!--enroll content-->
      <p class="copy">&#169; 2015 Axon communications, Inc.</p>
    </div><!--main_content-->

</div><!--main wrapper-->
<script type="text/javascript">
function isNumberKey(evt)
 
          {
             var charCode = (evt.which) ? evt.which : event.keyCode
             if (charCode > 31 && (charCode < 44 || charCode > 57))
                return false;
 
             return true;
          }
</script>
 <?php unset($_SESSION['error']);unset($_SESSION['success']);?>
</body>
</html>

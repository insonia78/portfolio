<?php
error_reporting(0);
session_start();
include ('config.php');
if($_SESSION['login_details']['user_id']==""){
     header("Location:index.php");
       exit;
}
$enroll_edit_id = $_POST['enroll_edit_id'];

if($enroll_edit_id!=''){
   $updatequery = "update assignments set 
    AssignStatus='".$_POST['AssignStatus']."',
    repname='".addslashes($_POST['repname'])."',
    repterritory='".addslashes($_POST['repterritory'])."',   
    repcell='".addslashes($_POST['repcell'])."',
    repemail='".addslashes($_POST['repemail'])."',
    practicename='".addslashes($_POST['practicename'])."',
    physname='".addslashes($_POST['physname'])."',
    practicestreet='".addslashes($_POST['practicestreet'])."',
    practicecity='".addslashes($_POST['practicecity'])."',
    practicestate='".addslashes($_POST['practicestate'])."',
    practicezip='".addslashes($_POST['practicezip'])."',
    practicephone='".addslashes($_POST['practicephone'])."',
    contactname='".addslashes($_POST['contactname'])."',
    contactemail='".addslashes($_POST['contactemail'])."',
    contactphone='".addslashes($_POST['contactphone'])."',
    enrollnotes='".addslashes($_POST['enrollnotes'])."',
    webcode='".addslashes($_POST['webcode'])."',
    partname='".addslashes($_POST['partname'])."',
    partname='".addslashes($_POST['partname'])."',
    part2name='".addslashes($_POST['part2name'])."',
    part2cred='".addslashes($_POST['part2cred'])."',
    part3name='".addslashes($_POST['part3name'])."',
    part3cred='".addslashes($_POST['part3cred'])."',
    part4name='".addslashes($_POST['part4name'])."',
    part4cred='".addslashes($_POST['part4cred'])."',
    shoottimemins='".addslashes($_POST['shoottimemins'])."',
    ampm='".addslashes($_POST['ampm'])."',
    shootdate='".addslashes($_POST['shootdate'])."',
    shootstreet='".addslashes($_POST['shootstreet'])."',
    shootcity='".addslashes($_POST['shootcity'])."',
    shootstate='".addslashes($_POST['shootstate'])."',
    shootzip='".addslashes($_POST['shootzip'])."',
    shootphone='".addslashes($_POST['shootphone'])."'
   where AssignID='".$enroll_edit_id."'";
mysql_query($updatequery);
//logging
$ipaddress = get_client_ip();
$update = $enroll_edit_id.' - enrollment details updated';
$insert = "insert into logging(eventUser,eventAction,eventIP) values('".$_SESSION['login_details']['user_name']."','".$update."','".$ipaddress."');";
mysql_query($insert);

$_SESSION['success']='Enrollment details updated successfully';
header("location:upcomming.php");
exit; 
}
$edit_id = $_REQUEST['edit_id'];
if($edit_id!=""){
    $query = "select * from assignments where AssignID = '".$edit_id."'";
    $result = mysql_query($query);
    $fetch = mysql_fetch_assoc($result);
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Axon-Update Screen Details</title>
<link rel="stylesheet" type="text/css" href="css/style.css" />
<script src="js/jquery.js"></script>

</head>

<body>
<div id="main_wrapper">
	<div class="main_content">
        <div class="header">
            <h1>Enrollment Details</h1>
            <img src="images/logo_small.png" />
        </div><!--header-->
        <div class="enroll_content">
        	<a href="logout.php" style="float: right; margin-top: -30px;">+Logout</a>
        	<div class="tab_conatiner">
                <div class="tab_tit active_state" id="tab1"><a href="upcomming.php">Upcoming</a></div>
                <div class="tab_tit" id="tab2"><a href="postponed.php">Postponed</a></div>
                <div class="tab_tit" id="tab2"><a href="cancelled.php">Cancelled</a></div>
                <div class="tab_tit" id="tab3"><a href="filmed.php">Filmed</a></div>
                <div class="tab_tit" id="tab4"><a href="videographer.php">Videographers</a></div>
            </div><!--tab container-->
          
            <div class="enroll_text">
                 <?php if($_SESSION['success']!=''){?> <p class="success"><?php echo $_SESSION['success']; ?></p><script>setTimeout("location.href=''", 1000);</script><?php }?>
               <?php if($_SESSION['error']!=''){?> <p class="success"><?php echo $_SESSION['error']; ?></p><script>setTimeout("location.href=''", 1000);</script><?php }?>
               <form name="enrollment" action="internal_update.php" method="post" id="myForm">
            	<div class="screen_details">
            	<div class="screen_detail_top">
               			 <div class="screen_top">
                           <div class="tlcon"><h3>Status</h3> </div>
                                <div class="rlcon">
                                     <select name="AssignStatus" required>
                                        <option value="">Select</option>
                                        <option value="pending" <?php if($fetch['AssignStatus']=="pending"){?>selected<?php }?>>Upcoming</option>
                                    <option value="postponed" <?php if($fetch['AssignStatus']=="postponed"){?>selected<?php }?>>Postponed</option>
                                     <option value="filmed" <?php if($fetch['AssignStatus']=="filmed"){?>selected<?php }?>>Filmed</option>
                                    <option value="cancelled" <?php if($fetch['AssignStatus']=="cancelled"){?>selected<?php }?>>Canceled</option>
                                    </select>
                                    
                               </div><!--rlcon-->
                           </div><!--screen top-->
                           <div class="screen_top">
                             
                                <div class="tlcon"><h3>Job No.</h3> </div>
                                <div class="rlcon"><?php echo $fetch['AssignID'];?></div><!--rlcon-->
                              
                            </div><!--screen top-->
                	<div class="screen_top_left">
                    	   <ul>
                            <li>
                                <div class="tlcon">&nbsp;</div>
                                <div class="rlcon"><h3>Representative Information</h3></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">name</div>
                                <div class="rlcon"><input type="text"  placeholder="name" name="repname" value="<?php echo $fetch['repname']; ?>" required/></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">territory</div>
                                <div class="rlcon"><input type="text"  placeholder="territory" name="repterritory" value="<?php echo $fetch['repterritory']; ?>" required/></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">cell</div>
                                <div class="rlcon"><input type="text" placeholder="cell" name="repcell" value="<?php echo $fetch['repcell']; ?>" required/></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Email</div>
                                <div class="rlcon"><input type="email" placeholder="Email" name="repemail" value="<?php echo $fetch['repemail']; ?>" required/></div><!--rlcon-->                             
                           </li>
                          
                        </ul>
                        
                        <ul>
                            
                            <li>
                                <div class="tlcon">&nbsp;</div>
                                <div class="rlcon"><h3>Practice Information</h3></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Practice name</div>
                                <div class="rlcon"><input type="text" placeholder="Practice name" name="practicename" value="<?php echo $fetch['practicename']; ?>" required/></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Physician name</div>
                                <div class="rlcon"><input type="text" placeholder="Physician name" name="physname" value="<?php echo $fetch['physname']; ?>" required/></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Street</div>
                                <div class="rlcon"><input type="text" placeholder="Street" name="practicestreet" value="<?php echo $fetch['practicestreet']; ?>" required/></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">City</div>
                                <div class="rlcon"><input type="text" placeholder="city" name="practicecity" value="<?php echo $fetch['practicecity']; ?>" required/></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">State</div>
                                <div class="rlcon"><input type="text" placeholder="State" name="practicestate" value="<?php echo $fetch['practicestate']; ?>" required/></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Zipcode</div>
                                <div class="rlcon"><input type="text" placeholder="Zipcode" name="practicezip" value="<?php echo $fetch['practicezip']; ?>" required/></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Practice phone</div>
                                <div class="rlcon"><input type="text" placeholder="Practice phone" name="practicephone" value="<?php echo $fetch['practicephone']; ?>" required/></div><!--rlcon-->                             
                           </li>
                        </ul>
                        
                        <ul>
                            
                            <li>
                                <div class="tlcon">&nbsp;</div>
                                <div class="rlcon"><h3>Key Contact person</h3></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Name</div>
                                <div class="rlcon"><input type="text" placeholder="Name" name="contactname" value="<?php echo $fetch['contactname']; ?>" required/></div><!--rlcon-->                             
                           </li>
                             <li>
                                <div class="tlcon">Email</div>
                                <div class="rlcon"><input type="text" placeholder="Email" name="contactemail" value="<?php echo $fetch['contactemail']; ?>" required/></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Phone</div>
                                <div class="rlcon"><input type="text" placeholder="Phone" name="contactphone" value="<?php echo $fetch['contactphone']; ?>" required/></div><!--rlcon-->                             
                           </li>
                            <li>
                                <div class="tlcon">Notes</div>
                                <div class="rlcon">
                                    <textarea placeholder="Notes" name="enrollnotes"><?php echo $fetch['enrollnotes']; ?></textarea>
                                    </div><!--rlcon-->                             
                           </li>
                        </ul>
                    </div><!--screen_top_left-->
                    <div class="screen_top_left">
                    <ul>
                           
                            <li>
                                <div class="tlcon">&nbsp;</div>
                                <div class="rlcon"><h3>Main Participant</h3></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">name</div>
                                <div class="rlcon"><input type="text" placeholder="name" name="partname" value="<?php echo $fetch['partname']; ?>" required/></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Credentials</div>
                                <div class="rlcon"><input type="text" placeholder="Credentials" name="partname" value="<?php echo $fetch['partname']; ?>" required/></div><!--rlcon-->                             
                           </li>
                         
                        </ul>
                        
                        <ul>
                            
                            <li>
                                <div class="tlcon">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                <div class="rlcon"><h3>Additional Participants</h3></div><!--rlcon-->                             
                           </li>
                            <li>
                                <div class="tlcon">name</div>
                                <div class="rlcon"><input type="text" placeholder="name" name="part2name" value="<?php echo $fetch['part2name']; ?>" /></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Credentials</div>
                                <div class="rlcon"><input type="text" placeholder="Credentials" name="part2cred" value="<?php echo $fetch['part2cred']; ?>" /></div><!--rlcon-->                             
                           </li>
                            <li>
                                <div class="tlcon">name</div>
                                <div class="rlcon"><input type="text" placeholder="name" name="part3name" value="<?php echo $fetch['part3name']; ?>" /></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Credentials</div>
                                <div class="rlcon"><input type="text" placeholder="Credentials" name="part3cred" value="<?php echo $fetch['part3cred']; ?>" /></div><!--rlcon-->                             
                           </li>
                            <li>
                                <div class="tlcon">name</div>
                                <div class="rlcon"><input type="text" placeholder="name" name="part4name" value="<?php echo $fetch['part4name']; ?>" /></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Credentials</div>
                                <div class="rlcon"><input type="text" placeholder="Credentials" name="part4cred" value="<?php echo $fetch['part4cred']; ?>" /></div><!--rlcon-->                             
                           </li>
                        </ul>
                        
                        <ul>
                            
                            <li>
                                <div class="tlcon">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                <div class="rlcon"><h3>shooting information</h3></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Shoot Time</div>
                                <div class="rlcon"><input type="text" placeholder="Shoot Time" name="shoottimehrs" style="width: 27%;" value="<?php echo $fetch['shoottimehrs']; ?>" />
                                <input type="text" placeholder="Shoot Time" name="shoottimemins" style="width: 27%;" value="<?php echo $fetch['shoottimemins']; ?>" />
                                <input type="text" placeholder="Shoot Time" name="ampm" style="width: 28%;" value="<?php echo $fetch['ampm']; ?>" /></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Shoot Date</div>
                                <div class="rlcon"><input type="text" placeholder="Shoot Date" name="shootdate" value="<?php echo $fetch['shootdate']; ?>" /></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Street</div>
                                <div class="rlcon"><input type="text" placeholder="Street" name="shootstreet" value="<?php echo $fetch['shootstreet']; ?>" /></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">City</div>
                                <div class="rlcon"><input type="text" placeholder="City" name="shootcity" value="<?php echo $fetch['shootcity']; ?>" /></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">State</div>
                                <div class="rlcon"><input type="text" placeholder="State" name="shootstate" value="<?php echo $fetch['shootstate']; ?>" /></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Zipcode</div>
                                <div class="rlcon"><input type="text" placeholder="Zipcode" name="shootzip" value="<?php echo $fetch['shootzip']; ?>" /></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Shoot phone</div>
                                <div class="rlcon"><input type="text" placeholder="Shoot phone" name="shootphone" value="<?php echo $fetch['shootphone']; ?>" /></div><!--rlcon-->                             
                           </li>
                            <li>
                                <div class="tlcon">Web Code</div>
                                <div class="rlcon"><input type="text" placeholder="Web Code" name="webcode" value="<?php echo $fetch['webcode']; ?>" /></div><!--rlcon-->                             
                           </li>
                       </ul>
                   </div><!--screen_top_left-->
                    
                </div><!--screen_detail_top-->
                  <div class="screen_detail_btm">
                	<div class="screen_btm_left">
                    	<ul>
                            <li>
                                <div class="btm_left">Videographer name</div>
                                <div class="btm_right"><?php echo $fetch['shootername']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">Company name</div>
                                <div class="btm_right"><?php echo $fetch['companyname']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">Videographer phone</div>
                                <div class="btm_right"><?php echo $fetch['shooterphone']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">Videographer cell</div>
                                <div class="btm_right"><?php echo $fetch['shootercell']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">Videographer alternate</div>
                                <div class="btm_right"><?php echo $fetch['shooteralt']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">Videographer email</div>
                                <div class="btm_right"><?php echo $fetch['shooteremail']; ?></div>
                            </li>
                            
                        </ul>
                    </div><!--screen_btm_left-->
                   <div class="screen_btm_left">
                    	<ul>
                            <li>
                                <div class="btm_left">Teleprompter no.</div>
                                <div class="btm_right"><?php echo $fetch['teleprompt']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">Ship out</div>
                                <div class="btm_right"><?php echo $fetch['foshipout']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">(Out track)</div>
                                <div class="btm_right"><?php echo $fetch['foouttrack']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">Ship in</div>
                                <div class="btm_right"><?php echo $fetch['foshipin']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">(In Track)</div>
                                <div class="btm_right"><?php echo $fetch['fointrack']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">(Tape in)</div>
                                <div class="btm_right"><?php echo $fetch['fotapein']; ?></div>
                            </li>
                            
                        </ul>
                    </div><!--screen_btm_left-->
                    
                
                </div><!--screen_detail_btm-->
                </div><!--screen details-->
                <div class="actions_list detail_action">
                <ul class="action_video">
                    <input type="hidden" name="enroll_edit_id" value="<?php echo $fetch['AssignID'];?>"/>
                    <li onclick="window.history.back()"><img src="images/back.png"  onmouseover="this.src='images/back_hover.png';" onmouseout="this.src='images/back.png';"  /></li>
                    <li onclick="document.getElementById('myForm').reset();"><img src="images/cancel.png"  onmouseover="this.src='images/cancel_hover.png';" onmouseout="this.src='images/cancel.png';" /></li>
                    <li><input type="image" src="images/submit_hover.png"  onmouseover="this.src='images/submit.png';" onmouseout="this.src='images/submit_hover.png';" /></li>
               
                </ul><!--action video-->
                </div>
                	
                 </form> 
  			</div><!--enroll text-->
        </div><!--enroll content-->
     <p class="copy">&#169; 2015 Axon communications, Inc.</p>
    </div><!--main_content-->
<script>
//    $('input[type="text"]').bind('keypress', function (event) {
//    var regex = new RegExp("^[a-zA-Z0-9]+$");
//    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
//    if (!regex.test(key)) {
//       event.preventDefault();
//       return false;
//    }
//});
    </script>
</div><!--main wrapper-->
 <?php unset($_SESSION['error']);unset($_SESSION['success']);?>
</body>
</html>

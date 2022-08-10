<?php
error_reporting(0);
session_start();
include ('config.php');
if($_SESSION['login_details']['user_id']==""){
     header("Location:index.php");
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
<title>Axon-Details Screen</title>
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
                
                <div class="screen_details">
            	<div class="screen_detail_top">
               			 <div class="screen_top">
                               
                                <div class="tlcon"><h3>Status</h3> </div>
                                <div class="rlcon" style="text-transform: capitalize;"><?php if($fetch['AssignStatus']=='pending'){echo 'Upcoming';}else{ echo $fetch['AssignStatus'];} ?></div><!--rlcon-->  
                           
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
                                <div class="rlcon"><?php echo $fetch['repname']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">territory</div>
                                <div class="rlcon"><?php echo $fetch['repterritory']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">cell</div>
                                <div class="rlcon"><?php echo $fetch['repcell']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Email</div>
                                <div class="rlcon"><?php echo $fetch['repemail']; ?></div><!--rlcon-->                             
                           </li>
                          
                        </ul>
                        
                        <ul>
                            
                            <li>
                                <div class="tlcon">&nbsp;</div>
                                <div class="rlcon"><h3>Practice Information</h3></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Practice name</div>
                                <div class="rlcon"><?php echo $fetch['practicename']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Physician name</div>
                                <div class="rlcon"><?php echo $fetch['physname']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Street</div>
                                <div class="rlcon"><?php echo $fetch['practicestreet'].', '.$fetch['practicestreet2']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">City</div>
                                <div class="rlcon"><?php echo $fetch['practicecity']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">State</div>
                                <div class="rlcon"><?php echo $fetch['practicestate']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Zipcode</div>
                                <div class="rlcon"><?php echo $fetch['practicezip']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Practice phone</div>
                                <div class="rlcon"><?php echo $fetch['practicephone']; ?></div><!--rlcon-->                             
                           </li>
                        </ul>
                        
                        <ul>
                            
                            <li>
                                <div class="tlcon">&nbsp;</div>
                                <div class="rlcon"><h3>Key Contact person</h3></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Name</div>
                                <div class="rlcon"><?php echo $fetch['contactname']; ?></div><!--rlcon-->                             
                           </li>
                             <li>
                                <div class="tlcon">Email</div>
                                <div class="rlcon"><?php echo $fetch['contactemail']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Phone</div>
                                <div class="rlcon"><?php echo $fetch['contactphone']; ?></div><!--rlcon-->                             
                           </li>
                            <li>
                                <div class="tlcon">Notes</div>
                                <div class="rlcon"><?php echo $fetch['enrollnotes']; ?></div><!--rlcon-->                             
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
                                <div class="rlcon"><?php echo $fetch['partname']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Credentials</div>
                                <div class="rlcon"><?php echo $fetch['partname']; ?></div><!--rlcon-->                             
                           </li>
                         
                        </ul>
                        
                        <ul>
                            
                            <li>
                                <div class="tlcon">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                <div class="rlcon"><h3>Additional Participants</h3></div><!--rlcon-->                             
                           </li>
                            <li>
                                <div class="tlcon">name</div>
                                <div class="rlcon"><?php echo $fetch['part2name']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Credentials</div>
                                <div class="rlcon"><?php echo $fetch['part2cred']; ?></div><!--rlcon-->                             
                           </li>
                            <li>
                                <div class="tlcon">name</div>
                                <div class="rlcon"><?php echo $fetch['part3name']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Credentials</div>
                                <div class="rlcon"><?php echo $fetch['part3cred']; ?></div><!--rlcon-->                             
                           </li>
                            <li>
                                <div class="tlcon">name</div>
                                <div class="rlcon"><?php echo $fetch['part4name']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Credentials</div>
                                <div class="rlcon"><?php echo $fetch['part4cred']; ?></div><!--rlcon-->                             
                           </li>
                        </ul>
                        
                        <ul>
                            
                            <li>
                                <div class="tlcon">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                <div class="rlcon"><h3>shooting information</h3></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Shoot Time</div>
                                <div class="rlcon"><?php echo $fetch['shoottimehrs'].':'.$fetch['shoottimemins'].' '.$fetch['ampm']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Shoot Date</div>
                                <div class="rlcon"><?php echo $fetch['shootdate']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Street</div>
                                <div class="rlcon"><?php echo $fetch['shootstreet'].', '.$fetch['shootstreet2']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">City</div>
                                <div class="rlcon"><?php echo $fetch['shootcity']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">State</div>
                                <div class="rlcon"><?php echo $fetch['shootstate']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Zip code</div>
                                <div class="rlcon"><?php echo $fetch['shootzip']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Shoot phone</div>
                                <div class="rlcon"><?php echo $fetch['shootphone']; ?></div><!--rlcon-->                             
                           </li>
                             <li>
                                <div class="tlcon">web code</div>
                                <div class="rlcon"><?php echo $fetch['webcode']; ?></div><!--rlcon-->                             
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
              
                	
              
  			</div><!--enroll text-->
        </div><!--enroll content-->
        <p class="copy">&#169; 2015 Axon communications, Inc.</p>
    </div><!--main_content-->

</div><!--main wrapper-->
 <?php unset($_SESSION['error']);unset($_SESSION['success']);?>
</body>
</html>

<!--

 




-->




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
    //Field opt table
   $fieldopt = mysql_query("select * from fieldops where assignID = '".$edit_id."'");
   $countfiled = mysql_num_rows($fieldopt); 
   if($countfiled==1){
   $fetch_filed = mysql_fetch_assoc($fieldopt);
   }else{
    $fetch_filed['shootername'] = '';
    $fetch_filed['companyname'] = '';
    $fetch_filed['shooterphone'] = '';
    $fetch_filed['shootercell'] = '';
    $fetch_filed['shooteralt'] = '';
    $fetch_filed['shooteremail'] = '';
    $fetch_filed['teleprompt'] = '';
    $fetch_filed['foshipout'] = '';
    $fetch_filed['foouttrack'] = '';
    $fetch_filed['foshipin'] = '';
    $fetch_filed['fointrack'] = '';
    $fetch_filed['fotapeexpectin'] = '';
    $fetch_filed['fotapein'] = '';
    $fetch_filed['foinvoicein'] = '';
    $fetch_filed['foinvoicewpaid'] = '';
    $fetch_filed['Lighting'] = '';
    $fetch_filed['Audio'] = '';
    $fetch_filed['Monitor'] = '';
    $fetch_filed['AdditionalGear'] = '';
    $fetch_filed['Notes'] = '';
   }
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
            <h1><?php if($_SESSION['login_details']['user_dept']==1){?>Client Services Queue<?php }else{?>Field Operations Queue<?php }?> </h1>
            <img src="images/logo_small.png" />
        </div><!--header-->
        <div class="enroll_content">
           
        	        	<a href="logout.php" style="float: right; margin-top: -30px;">+Logout</a>
        	<div class="tab_conatiner">
              <a href="upcomming.php"> <div class="tab_tit <?php if($fetch['AssignStatus']=='pending'){?>active_state<?php }?>" id="tab1">Pending</div></a>
                <a href="postponed.php"> <div class="tab_tit <?php if($fetch['AssignStatus']=='postponed'){?>active_state<?php }?>" id="tab2">Postponed</div></a>
               <a href="cancelled.php"><div class="tab_tit <?php if($fetch['AssignStatus']=='canceled'){?>active_state<?php }?>" id="tab2">Canceled</div></a>
                <a href="filmed.php"><div class="tab_tit <?php if($fetch['AssignStatus']=='filmed'){?>active_state<?php }?>" id="tab3">Filmed</div></a>
				
                <a href="queue.php"><div class="tab_tit">Queue</div></a>
                <a href="reorder.php"><div class="tab_tit">Reorders</div></a>
              <?php if($_SESSION['login_details']['user_dept']==2){?>
               <a href="videographer.php"> <div class="tab_tit" id="tab4">Videographers</div></a>
               <?php }?> 
            </div><!--tab container-->
            
            
            <!--
            
            part that gets fetch by the assignmets table 
            
            
            
            
            
            -->
            
            
          
            <div class="enroll_text">
                
                <div class="screen_details">
            	<div class="screen_detail_top">
                     <div class="screen_top" style="width: 100%; text-align: center;">
                             
                        <h3 style="float: left;line-height: 16px;text-align: right;width: 39%;">Job No.</h3>
                        <div class="rlcon" style="float: left;width: 20%;"><?php echo $fetch['AssignID'];?></div><!--rlcon-->
                              
                            </div><!--screen top-->
               			 <div class="screen_top">
                               
                                <div class="tlcon"><h3>Status</h3> </div>
                                <div class="rlcon" style="text-transform: capitalize;"><?php if($fetch['AssignStatus']=='pending'){echo 'Pending';}else{ echo $fetch['AssignStatus'];} ?></div><!--rlcon-->  
                           
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
                            <ul>
                            
                            <li>
                                <div class="tlcon">&nbsp;</div>
                                <div class="rlcon"><h3>&nbsp;</h3></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">Consent received</div>
                                <div class="rlcon"><?php echo $fetch['consent_received']; ?></div><!--rlcon-->                             
                           </li>
                             <li>
                                <div class="tlcon">1 week email</div>
                                <div class="rlcon"><?php echo $fetch['one_week_email']; ?></div><!--rlcon-->                             
                           </li>
                           <li>
                                <div class="tlcon">1 day call</div>
                                <div class="rlcon"><?php echo $fetch['one_day_call']; ?></div><!--rlcon-->                             
                           </li>
                            <li>
                                <div class="tlcon">Label sent</div>
                                <div class="rlcon"><?php echo $fetch['label_sent']; ?></div><!--rlcon-->                             
                           </li> <li>
                                <div class="tlcon">Job signed into post</div>
                                <div class="rlcon"><?php echo $fetch['job_signed_into_post']; ?></div><!--rlcon-->                             
                           </li> <li>
                                <div class="tlcon">Collateral approved</div>
                                <div class="rlcon"><?php echo $fetch['collateral_approved']; ?></div><!--rlcon-->                             
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
                                <div class="rlcon"><?php echo $fetch['partcred']; ?></div><!--rlcon-->                             
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
                                <div class="rlcon"><?php echo date("m-d-Y", strtotime($fetch['shootdate'])) ?></div><!--rlcon-->                             
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
                    
                <!--
                
                 part of the page that is edited from the field operator               
                 
                -->
                   
                   
                </div><!--screen_detail_top-->
                </div><!--screen details-->
                <div class="screen_details videoscreen">
                <div class="screen_detail_btm">
                <div class="screen_btm_left">
                    	<ul>
                            <li>
                                <div class="btm_left">Videographer name</div>
                                <div class="btm_right"><?php echo $fetch_filed['shootername']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">Company name</div>
                                <div class="btm_right"><?php echo $fetch_filed['companyname']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">Videographer phone</div>
                                <div class="btm_right"><?php echo $fetch_filed['shooterphone']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">Videographer cell</div>
                                <div class="btm_right"><?php echo $fetch_filed['shootercell']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">Videographer alternate</div>
                                <div class="btm_right"><?php echo $fetch_filed['shooteralt']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">Videographer email</div>
                                <div class="btm_right"><?php echo $fetch_filed['shooteremail']; ?></div>
                            </li>
                            
                        </ul>
                    </div><!--screen_btm_left-->
                   <div class="screen_btm_left">
                    	<ul>
                            <li>
                                <div class="btm_left">Teleprompter no.</div>
                                <div class="btm_right"><?php echo $fetch_filed['teleprompt']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">Ship out</div>
                                <div class="btm_right"><?php echo $fetch_filed['foshipout']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">(Out track)</div>
                                <div class="btm_right"><?php echo $fetch_filed['foouttrack']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">Ship in</div>
                                <div class="btm_right"><?php echo $fetch_filed['foshipin']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">(In Track)</div>
                                <div class="btm_right"><?php echo $fetch_filed['fointrack']; ?></div>
                            </li>
                             <li>
                                <div class="btm_left">Expected Footage In</div>
                                <div class="btm_right"><?php echo $fetch_filed['fotapeexpectin']; ?></div>
                            </li>
                            <li>
                                <div class="btm_left">(Footage In)</div>
                                <div class="btm_right"><?php echo $fetch_filed['fotapein']; ?></div>
                            </li>
                            
                        </ul>
                    </div><!--screen_btm_left-->
                      <div class="screen_btm_left">
                    	<ul>
                             <li>
                    <div class="btm_left">Lighting</div>
                    <div class="btm_right"><?php echo $fetch_filed['Lighting']; ?></div>
                    </li>
                       <li>
                    <div class="btm_left">Audio</div>
                    <div class="btm_right"><?php echo $fetch_filed['Audio']; ?></div>
                    </li> 
                      <li>
                    <div class="btm_left">Monitor</div>
                    <div class="btm_right"><?php echo $fetch_filed['Monitor']; ?></div>
                    </li> 
                      <li>
                    <div class="btm_left">Additional Gear</div>
                    <div class="btm_right"><?php echo $fetch_filed['AdditionalGear']; ?></div>
                    </li>
                      <li>
                          <div class="btm_left" >Notes</div>
                    <div class="btm_right rlcon"style="margin-bottom: 10px;"><?php echo $fetch_filed['Notes']; ?></div>
                    </li>
                    <li>
                    <div class="btm_left">Invoice In</div>
                    <div class="btm_right"><?php echo $fetch_filed['foinvoicein']; ?></div>
                    </li>
                    <li>
                    <div class="btm_left">Invoice Paid</div>
                    <div class="btm_right"><?php echo $fetch_filed['foinvoicewpaid']; ?></div>
                    </li>         
                 </ul>
                    </div><!--screen_btm_left-->
                </div><!--screen_detail_btm-->
                </div><!--screen details-->
				 <div class="actions_list detail_action">
                <ul class="action_video">
                    
                    <li onclick="window.history.back()"><img src="images/back.png"  onmouseover="this.src='images/back_hover.png';" onmouseout="this.src='images/back.png';"  /></li>
                    
               
                </ul><!--action video-->
                </div>
              
                	
              
  			</div><!--enroll text-->
        </div><!--enroll content-->
        <p class="copy">&#169; 2015 Axon communications, Inc.</p>
    </div><!--main_content-->

</div><!--main wrapper-->
 <?php unset($_SESSION['error']);unset($_SESSION['success']);?>
</body>
</html>

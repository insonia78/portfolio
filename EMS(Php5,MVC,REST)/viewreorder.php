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
   $query = "select * from reorders where reordernum = $edit_id";
   $result = mysql_query($query);
   $row = mysql_fetch_assoc($result);
   $ass_Id = '00'.$row['AssignID'];
   $query_ass = "select * from assignments where AssignID = '".$ass_Id."'";
   $result_ass = mysql_query($query_ass);
   $row_ass = mysql_fetch_assoc($result_ass);
  
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Axon-Reorder</title>
<link rel="stylesheet" type="text/css" href="css/style.css" />
<script src="js/jquery.js"></script>
<script type="text/javascript" src="js/image_radiocheck.js"></script> 
    <script type="text/javascript">
        $(document).ready(function(){
            $("input").radio_check();
             setInterval(function(){ $('.autohide').hide(); }, 1500);
        });
       
    </script>
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
                <a href="upcomming.php"><div class="tab_tit " id="tab1">Pending</div></a>
                <a href="postponed.php"><div class="tab_tit" id="tab2">Postponed</div></a>
                <a href="cancelled.php"><div class="tab_tit " id="tab2">Canceled</div></a>
                <a href="filmed.php"><div class="tab_tit" id="tab3">Filmed</div></a>
                <a href="queue.php"><div class="tab_tit">Queue</div></a>
                <a href="reorder.php"><div class="tab_tit active_state">Reorders</div></a>
                <?php if($_SESSION['login_details']['user_dept']==2){?>
               <a href="videographer.php"> <div class="tab_tit " id="tab4" >Videographers</div></a>
               <?php }?> 
            </div><!--tab container-->
          
            <div class="enroll_text">
               <?php if($_SESSION['success']!=''){?> <p class="success autohide"><?php echo $_SESSION['success']; ?></p><?php }?>
               <?php if($_SESSION['error']!=''){?> <p class="error autohide"><?php echo $_SESSION['error']; ?></p><?php }?>
			   
			           
							
							  
							
               
               <h3 style="padding: 20px 0;text-align: center;">Reorder Details Page</h3>
               <h3 style="float: left;line-height: 16px;text-align: right;width: 42%;margin-top:2px;font-size:15px;">Job No:</h3>
                        <div class="rlcon" style="float: left;width: 6%;"><?php echo $row['AssignID'];?></div><!--rlcon-->
                          <h3 style="float: left;line-height: 16px;text-align: right;width: 6%;margin-top:2px;font-size:14px;">HCP:</h3>
                        <div class="rlcon" style="float: left;width: 14%;"><?php echo $row_ass['physname'];?></div><!--rlcon-->  
                <div class="screen_details">
                    <form name="videographer" action="viewreorder.php" method="post" id="myForm">
                   
            	<div class="screen_detail_top">
                    <div class="screen_top_left reorder">
                <ul class="enter_details">
                 <li>
                    <div class="tlcon">Program</div>
                    <div class="rlcon"> <input type="text" name="program" value="<?php echo $row['program'];?>" required /></div>
                    </li>
                    <li>
                    <div class="tlcon">Holders</div>
                    <div class="rlcon"> <input type="text" name="dvdholders" value="<?php echo $row['dvdholders'];?>" required/></div>
                    </li>
                    <li>
                    <div class="tlcon">Changes</div>
                    <div class="rlcon"> 
                        <div class="txt-ico"><span>Yes</span><input type="radio" name="progchanges" value="1"> </input></div>
                        <div class="txt-ico"><span>No</span><input type="radio" name="progchanges" value="0"> </input></div>
                    </div>
                    </li>
                    <li>
                    <div class="tlcon">Notes</div>
                    <div class="rlcon">
                        <textarea name="reordernotes"><?php echo $row['reordernotes'];?></textarea>
                    </div>
                    </li>
                    
                </ul>
                    </div>
                  
                  </div>  
                <div class="actions_list">
                <ul class="action_video">
                    <input type="hidden" name="edit_id" value="<?php echo $fetch['vID'];?>"/>
					
                    <li><input type="image" src="images/senditful.png"  onmouseover="this.src='images/senditfulhover.png';" onmouseout="this.src='images/senditful.png';" /></li>
                    <li style="margin-left: -3px;"><input type="image" src="images/sendtopost.png"  onmouseover="this.src='images/sendtoposthover.png';" onmouseout="this.src='images/sendtopost.png';" /></li>
					
                </ul><!--action video-->
                <div  class="action_video" style="margin-top: 10px;"><div><div class='check'><input type="checkbox" name="radio">  <div class='check-img'></div></div> <label>Change verified</label></div> </div>
              </div>
                
                </form></div>
				 <div class="actions_list detail_action">
                <ul class="action_video">
                   
                    <li onclick="window.history.back()"><img src="images/back.png"  onmouseover="this.src='images/back_hover.png';" onmouseout="this.src='images/back.png';" style="margin-left:200px;"  /></li>
                    
               
                </ul><!--action video-->
                </div>
              
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

<?php
error_reporting(0);
session_start();
include ('config.php');
if($_SESSION['login_details']['user_id']==""){
     header("Location:index.php");
       exit;
}
//$query = "select shootdate,Name,AssignID,therapeuticArea,practicecity,physname,repname,AssignStatus from assignments LEFT JOIN videographers ON assignments.shootername=videographers.vID where AssignStatus IN ('postponed','cancelled') ORDER BY AssignStatus DESC";
$query = "select shootdate,shootername,AssignID,therapeuticArea,practicestate,physname,repname,AssignStatus from assignments where AssignStatus = 'postponed'";

$result = mysql_query($query);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Axon-Enrollment</title>
<link rel="stylesheet" type="text/css" href="css/style.css" />
<link rel="stylesheet" type="text/css" href="css/jquery-ui.css" />
<script src="js/jquery.js" type="text/javascript"></script>
<script src="js/jquery.dataTables.min.js" type="text/javascript"></script>
<script src="js/jquery.dataTables.bootstrap.js" type="text/javascript"></script>
<script src="js/custom.js" type="text/javascript"></script>
<script src="js/jquery-ui.js"></script>
 <script>
$(function() {
$( document ).tooltip();
});
</script>
<style>
    
.dataTables_filter{
    right: 12.8% !important;
}

</style>
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
                <div class="tab_tit" id="tab1"><a href="upcomming.php">Upcoming</a></div>
                <div class="tab_tit active_state" id="tab2"><a href="postponed.php">Postponed</a></div>
                <div class="tab_tit" id="tab2"><a href="cancelled.php">Cancelled</a></div>
                <div class="tab_tit" id="tab3"><a href="filmed.php">Filmed</a></div>
                <div class="tab_tit" id="tab4"><a href="videographer.php">Videographers</a></div>
            </div><!--tab container-->
            <div class="search_container">
            	  <div class="search_icon"><img src="images/search_icon.png" /></div>
            </div><!--search container-->
            <div class="enroll_text">
             <?php if($_SESSION['success']!=''){?> <p class="success"><?php echo $_SESSION['success']; ?></p><script>setTimeout("location.href=''", 1000);</script><?php }?>
               <?php if($_SESSION['error']!=''){?> <p class="success"><?php echo $_SESSION['error']; ?></p><script>setTimeout("location.href=''", 1000);</script><?php }?>
               	
            <div class="dummy">
                <table width="100%" cellpadding="0" cellspacing="0" class="video dataTable">
                  <thead style="padding-left:50px;">
                  <tr class="title">
                      <th style=" display: none;"></th>
                      <th class="active_title" align="center" style=" width: 110px !important;">Shoot Date<img src="images/arrow.png" />       </th>
                    <th align="center" style=" width: 90px !important;"> Job No.<img src="images/arrow.png" />  </th>
                    <th align="center" style=" width: 90px !important;">Brand<img src="images/arrow.png" /> </th>
                    <th align="center" style=" width: 150px !important;">Videographer<img src="images/arrow.png" /> </th>
                    <th align="center" style=" width: 120px !important;">Location <img src="images/arrow.png" /> </th>
                    <th align="center" style=" width: 120px !important;">HCP<img src="images/arrow.png" /></th>
                    <th align="center" style=" width: 120px !important;">Rep<img src="images/arrow.png" /> </th>                  
                    <th align="center" style=" width: 10px !important;">&nbsp;  </th>
                     <th align="center" >&nbsp; </th>
                  </tr>
                  </thead>
                 <tbody>
                <?php while ($row = mysql_fetch_assoc($result)) {?>
                         
                    
                  <tr class="bor">
                      <td style=" display: none;"><?php if($row['AssignStatus']=='postponed'){?>1<?php }else{ ?>2<?php }?></td>
                      <td ><?php echo $row['shootdate'];?></td>
                    <td><?php echo $row['AssignID'];?> </td>
                    <td><?php echo $row['therapeuticArea'];?></td>
                    <td <?php if(strlen($row['shootername'])>16){?> title="<?php echo $row['shootername'];?>" <?php }?>><?php if(strlen($row['shootername'])>16){ echo substr($row['shootername'],0,10).'...';}else{ echo $row['shootername']; }?></td>
                    <td <?php if(strlen($row['practicestate'])>15){?> title="<?php echo $row['practicestate'];?>" <?php }?>><?php if(strlen($row['practicestate'])>15){ echo substr($row['practicestate'],0,10).'...';}else{ echo $row['practicestate']; }?></td>
                    <td <?php if(strlen($row['physname'])>15){?> title="<?php echo $row['physname'];?>" <?php }?>><?php if(strlen($row['physname'])>15){ echo substr($row['physname'],0,10).'...';}else{ echo $row['physname']; }?></td>
                    <td <?php if(strlen($row['repname'])>15){?> title="<?php echo $row['repname'];?>" <?php }?>><?php if(strlen($row['repname'])>15){ echo substr($row['repname'],0,10).'...';}else{ echo $row['repname']; }?></td>
                                                     
                     <td width="5" style="background-color:#fff; border:none;"></td>
                    <td class="detail_in" colspan="2"><span class="tleft"><a href="enrolldetails.php?edit_id=<?php echo $row['AssignID'];?>">Details</a></span><span class="tright"><a href="<?php if($_SESSION['login_details']['user_dept']==1){?>internal_update<?php }else{?>field_update<?php }?>.php?edit_id=<?php echo $row['AssignID'];?>">Update</a></span></td>
                  </tr> 
                <?php  }?> 
                  </tbody>
			</table>
            	</div><!--dummy-->
  </div><!--enroll text-->
        </div><!--enroll content-->
        <p class="copy">&#169; 2015 Axon communications, Inc.</p>
    </div><!--main_content-->

</div><!--main wrapper-->
 <?php unset($_SESSION['error']);unset($_SESSION['success']);?>
</body>
</html>


<!--


ems final version 

This is the entry point to the application it differs consistently from the previous version 
if starts with the focus on the pending tab 
- it fetches the data from the assignments table to populate the fields it the lower part of the page





-->






<?php
error_reporting(0);
session_start();
//include ('config.php');
// if($_SESSION['login_details']['user_id']==""){
//      header("Location:index.php");
//        exit;
// }

// $status = $_REQUEST['status'];


// switch($status)
// {
//       case 'postponed':
//       {      
//           $query = "select shootdate,shootername,AssignID,therapeuticArea,practicestate,physname,repname,AssignStatus from assignments where AssignStatus = 'postponed'";         
        
//       }
//       case 'canceled':
//       {
//           $query = "select shootdate,shootername,AssignID,therapeuticArea,practicestate,physname,repname,AssignStatus from assignments where AssignStatus = 'canceled'"; 
          
//       }
//       case 'filmed':
//       {
//           $query = "select shootdate,shootername,AssignID,therapeuticArea,practicestate,physname,repname,AssignStatus,ppmultidoc from assignments where AssignStatus = 'filmed'";                    
//       }
//       default :
//       {
//           $query = "select shootdate,shootername,AssignID,therapeuticArea,practicestate,physname,repname,AssignStatus from assignments where AssignStatus = 'pending'";
          
//       }  
// }



// $result = mysql_query($query);

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
 <script type="text/javascript">
        $(document).ready(function(){
          
             setInterval(function(){ $('.autohide').hide(); }, 1500);
        });
       
    </script>
<style>
 .enroll_text .dummy table tr td:nth-child(9) {
    border: medium none !important;
}    
</style>
</head>

<body>
<div id="main_wrapper">
	<div class="main_content">
        <div class="header">
            <h1><?php if($_SESSION['login_details']['user_dept']==1){?>Client Services Queue<?php }else{?>Field Operations Queue<?php }?> </h1>
            <img src="images/logo_small.png" />
        </div><!--header-->
        <div class="enroll_content">
               
        	<a href="export.php?status=<?php $status ?>" style="float: right; margin-right: 168px; margin-top: -30px;">Export Pending</a> <a href="expt.php" style="float: right; margin-right: 82px; margin-top: -30px;">Export All </a>          	<a href="logout.php" style="float: right; margin-top: -30px;">+Logout</a>
        	<div class="tab_conatiner">
                <a href="upcomming.php"><div class="tab_tit active_state" id="tab1">Pending</div></a>
                <a href="upcomming.php?status='postponed'"><div class="tab_tit" id="tab2">Postponed</div></a>
                <a href="upcomming.php?status='canceled'"><div class="tab_tit" id="tab2">Canceled</div></a>
                <a href="upcomming.php?status='filmed'"><div class="tab_tit" id="tab3">Filmed</div></a>
                <a href="queue.php"><div class="tab_tit">Queue</div></a>
                <a href="reorder.php"><div class="tab_tit">Reorders</div></a>
                <?php if($_SESSION['login_details']['user_dept']==2){?>
               <a href="videographer.php"> <div class="tab_tit" id="tab4">Videographers</div></a>
               <?php }?> 
            </div><!--tab container-->
            <div class="search_container">
            	  <div class="search_icon"><img src="images/search_icon.png" /></div>
            </div><!--search container-->
            <div class="enroll_text">
            <div class='listmsg'>
             <?php if($_SESSION['success']!=''){?> <p class="success"><?php echo $_SESSION['success']; ?></p><?php }?>
               <?php if($_SESSION['error']!=''){?> <p class="success"><?php echo $_SESSION['error']; ?></p><?php }?>
              </div> 	
            <div class="dummy">
                <table width="100%" cellpadding="0" cellspacing="0" class="video dataTable">
                  <thead style="padding-left:50px;">
                  <tr class="title">
                    <th class="active_title" style="" align="center">Shoot Date<img src="images/arrow.png" /> </th>
                    <th align="center" style=" "> Job No.<img src="images/arrow.png" />  </th>
                    <th align="center" style="">Brand<img src="images/arrow.png" /> </th>
                    <th align="center" style="">Videographer<img src="images/arrow.png" /> </th>
                    <th align="center" style="">Location <img src="images/arrow.png" /> </th>
                    <th align="center" style="">HCP<img src="images/arrow.png" /></th>
                    <th align="center" style="">Rep<img src="images/arrow.png" /> </th>  
                    <th align="center" style=" ">Shoot Reminder 1 day<img src="images/arrow.png" /> </th>
                    <th align="center" style=" ">Shoot Reminder 4 day<img src="images/arrow.png" /> </th>
                    <th align="center" style="" >&nbsp;  </th>
                     <th align="center">&nbsp;</th>
                  </tr>
                  </thead>
                 <tbody>
                     
                     
        <!--   
       
        The application populates this part by fetching the data from the assignments table 
        
        
        
                     
                     
                     
            -->         
                <?php while ($row = mysql_fetch_assoc($result)) {
                 $fieldopt = mysql_query("select * from fieldops where assignID = '".$row['AssignID']."'");
                 
                 $countfiled = mysql_num_rows($fieldopt); 
    
                    ?>
                         
                    
                  <tr class="bor">
                      <td><?php echo date("m-d-Y", strtotime($row['shootdate']));?></td>
                    <td><?php echo $row['AssignID'];?> </td>
                    <td><?php echo $row['therapeuticArea'];?></td>
                    <td <?php if(strlen($row['shootername'])>20){?> title="<?php echo $row['shootername'];?>" <?php }?>><?php if(strlen($row['shootername'])>20){ echo substr($row['shootername'],0,15).'...';}else{ echo $row['shootername']; }?></td>
                    <td <?php if(strlen($row['practicestate'])>15){?> title="<?php echo $row['practicestate'];?>" <?php }?>><?php if(strlen($row['practicestate'])>15){ echo substr($row['practicestate'],0,10).'...';}else{ echo $row['practicestate']; }?></td>
                    <td <?php if(strlen($row['physname'])>15){?> title="<?php echo $row['physname'];?>" <?php }?>><?php if(strlen($row['physname'])>15){ echo substr($row['physname'],0,10).'...';}else{ echo $row['physname']; }?></td>
                    <td <?php if(strlen($row['repname'])>15){?> title="<?php echo $row['repname'];?>" <?php }?>><?php if(strlen($row['repname'])>15){ echo substr($row['repname'],0,10).'...';}else{ echo $row['repname']; }?></td>
                    <td><?php if($countfiled==1){ $fetch_filed = mysql_fetch_assoc($fieldopt);?>  
                        
                        <select name="onedayreminder" id="<?php echo $row['AssignID'];?>" class="onedayreminder">
                            <option value="">Select</option>
                            <option value="Phone" <?php if($fetch_filed['onedayreminder']=="Phone"){?>selected="selected" <?php }?> >Phone</option>
                            <option value="LM" <?php if($fetch_filed['onedayreminder']=="LM"){?>selected="selected" <?php }?> >LM</option>
                            <option value="Email" <?php if($fetch_filed['onedayreminder']=="Email"){?>selected="selected" <?php }?> >Email</option>
                    </select><?php }else{echo 'select';}?></td>  
                    <td><?php if($countfiled==1){ ?>
                        <select name="fourdayreminder" id="<?php echo $row['AssignID'];?>" class="fourdayreminder">
                            <option value="">Select</option>
                             <option value="Phone" <?php if($fetch_filed['fourdayreminder']=="Phone"){?>selected="selected" <?php }?> >Phone</option>
                            <option value="LM" <?php if($fetch_filed['fourdayreminder']=="LM"){?>selected="selected" <?php }?> >LM</option>
                            <option value="Email" <?php if($fetch_filed['fourdayreminder']=="Email"){?>selected="selected" <?php }?> >Email</option>
                        </select><?php }else{echo 'select';}?></td>                                     
                    <td width="5" style="background-color:#fff;border:none;"></td>
                    
                    <!--
                    
                    Is sending the data to the enrolldetails.php for updating the assignment table 
                    
                    -->
                    
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

<script type="text/javascript">
    $(document).ready(function(){
       
    $(".onedayreminder").change(function(){
       var onedayreminder = $(this).val();
      var jobno = $(this).attr('id');
      $.ajax
                        ({
                            type: "POST",
                            url: "videographer_list.php",
                            data: {onedayreminder: onedayreminder, jobno: jobno},
                            success: function(sivaraj)
                            {
                            //alert(sivaraj);
                            }
                        });
    });
     $(".fourdayreminder").change(function(){
       var fourdayreminder = $(this).val();
      var jobno = $(this).attr('id');
     
      $.ajax
                        ({
                            type: "POST",
                            url: "videographer_list.php",
                            data: {fourdayreminder: fourdayreminder, jobno: jobno},
                            success: function(sivaraj)
                            {
                            //alert(sivaraj);
                            }
                        });
    });
});
</script>
</body>
</html>


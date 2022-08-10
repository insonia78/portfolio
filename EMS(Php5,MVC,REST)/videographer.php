<?php
error_reporting(0);
session_start();
include ('config.php');
if($_SESSION['login_details']['user_id']==""){
     header("Location:index.php");
       exit;
}
//Delete the Vieographer
if(isset($_REQUEST['delete_id'])){
    $delete_id = $_REQUEST['delete_id'];
    $delete_query  = "DELETE FROM videographers WHERE vID='".$delete_id."'";
    mysql_query($delete_query);
    $_SESSION['success']='Videographer detail deleted successfully';
    header("location:videographer.php");
    exit;
}
$edit_id = $_POST['edit_id'];
if(isset($_POST['edit_id'])){
if($edit_id!=""){
$updatequery = "update videographers set Name='".addslashes($_POST['Name'])."',CompanyName='".addslashes($_POST['CompanyName'])."',Street='".addslashes($_POST['Street'])."',City='".$_POST['City']."',State='".addslashes($_POST['State'])."',Zip='".addslashes($_POST['Zip'])."',PrimPhone='".addslashes($_POST['PrimPhone'])."',SecPhone='".addslashes($_POST['SecPhone'])."',Email='".addslashes($_POST['Email'])."',Camera='".addslashes($_POST['Camera'])."',RingSize='".addslashes($_POST['RingSize'])."',Rate='".addslashes($_POST['Rate'])."',Transfer='".addslashes($_POST['Transfer'])."',teleprompt='".addslashes($_POST['teleprompt'])."',videographer_alter='".addslashes($_POST['videographer_alter'])."',Lighting='".addslashes($_POST['Lighting'])."',Audio='".addslashes($_POST['Audio'])."',Monitor='".addslashes($_POST['Monitor'])."',AdditionalGear='".addslashes($_POST['AdditionalGear'])."',Notes='".addslashes($_POST['Notes'])."' where vID='".$edit_id."'";
mysql_query($updatequery);
//logging
$ipaddress = get_client_ip();
$update = $edit_id.' - videographer updated';
$insert = "insert into logging(eventUser,eventAction,eventIP) values('".$_SESSION['login_details']['user_name']."','".$update."','".$ipaddress."');";
mysql_query($insert);

$_SESSION['success']='Videographer details updated successfully';
header("location:videographer.php");
exit;
}  else {                                                                                                                                                                                                                                                                                                                                                                                       
 $insert_query = "insert into videographers(Name,CompanyName,Street,City,State,Zip,PrimPhone,SecPhone,Email,Camera,RingSize,Rate,Transfer,teleprompt,videographer_alter,Lighting,Audio,Monitor,AdditionalGear,Notes) values('".addslashes($_POST['Name'])."','".addslashes($_POST['CompanyName'])."','".addslashes($_POST['Street'])."','".addslashes($_POST['City'])."','".addslashes($_POST['State'])."','".addslashes($_POST['Zip'])."','".addslashes($_POST['PrimPhone'])."','".addslashes($_POST['SecPhone'])."','".addslashes($_POST['Email'])."','".addslashes($_POST['Camera'])."','".addslashes($_POST['RingSize'])."','".addslashes($_POST['Rate'])."','".addslashes($_POST['Transfer'])."','".addslashes($_POST['teleprompt'])."','".addslashes($_POST['videographer_alter'])."','".addslashes($_POST['Lighting'])."','".addslashes($_POST['Audio'])."','".addslashes($_POST['Monitor'])."','".addslashes($_POST['AdditionalGear'])."','".addslashes($_POST['Notes'])."')";
 mysql_query($insert_query);
$inser_id = mysql_insert_id();
//logging
$ipaddress = get_client_ip();
$insert_value = $inser_id.' - New videographer inserted';
$insert = "insert into logging(eventUser,eventAction,eventIP) values('".$_SESSION['login_details']['user_name']."','".$insert_value."','".$ipaddress."');";
mysql_query($insert);

$_SESSION['success']='Videographer details inserted successfully';
header("location:videographer.php");
exit;
}}
$query = "select * from videographers";
$result = mysql_query($query);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Axon-VideoGrapher</title>
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
</head>

<body>
<div id="main_wrapper">
	<div class="main_content">
        <div class="header">
            <h1>Videographer Details</h1>
            <img src="images/logo_small.png" />
        </div><!--header-->
        <div class="enroll_content"><?php if($_SESSION['login_details']['user_dept']==1){?><a href="expt.php" style="float: right; margin-right: 82px; margin-top: -30px;">Export</a><?php }?>         	<a href="logout.php" style="float: right; margin-top: -30px;">+Logout</a>
        	       	<a href="logout.php" style="float: right; margin-top: -30px;">+Logout</a>
        	<div class="tab_conatiner">
                <a href="upcomming.php"><div class="tab_tit " id="tab1">Pending</div></a>
                <a href="postponed.php"><div class="tab_tit" id="tab2">Postponed</div></a>
                <a href="cancelled.php"><div class="tab_tit" id="tab2">Canceled</div></a>
                <a href="filmed.php"><div class="tab_tit" id="tab3">Filmed</div></a>
                <a href="queue.php"><div class="tab_tit">Queue</div></a>
                <a href="reorder.php"><div class="tab_tit">Reorders</div></a>
                <?php if($_SESSION['login_details']['user_dept']==2){?>
               <a href="videographer.php"> <div class="tab_tit active_state" id="tab4">Videographers</div></a>
               <?php }?> 
            </div><!--tab container-->
           <div class="search_container">
            	  <div class="search_icon"><img src="images/search_icon.png" /></div>
            </div><!--search container-->
            <div class="enroll_text">
                <div class='listmsg'>
                <?php if($_SESSION['success']!=''){?> <p class="success autohide"><?php echo $_SESSION['success']; ?></p><?php }?>
               <?php if($_SESSION['error']!=''){?> <p class="error autohide"><?php echo $_SESSION['error']; ?></p><?php }?>
               </div>
            	<div class="dummy">
                <table width="100%" cellpadding="0" cellspacing="0" class="video dataTable">
                  <thead style="padding-left:50px;">
                  <tr class="title">
                     <th style="display:none;" align="center">Id <img src="images/arrow.png" /> </th>
                     <th style=" " class="active_title" align="center">Name<img src="images/arrow.png" />       </th>
                    <th style=" " align="center">Phone (office)<img src="images/arrow.png" />  </th>
                    <th style=" " align="center">Phone (Cell)<img src="images/arrow.png" /> </th>
                    <th style="" align="center">Email<img src="images/arrow.png" /> </th>
                    <th style=" " align="center">Camera <img src="images/arrow.png" /> </th>
                    <th style=" " align="center">Transfer<img src="images/arrow.png" /></th>
                    <th style=" " align="center">Teleprompter<img src="images/arrow.png" /> </th>
                    <th style=" " align="center">Rate<img src="images/arrow.png" /></th>
                    <th align="center">&nbsp;  </th>
                    <th align="center">&nbsp;  </th>
                    <th align="center"><?php if($_SESSION['login_details']['user_dept']==2){?><a href="add_videographer.php"><img src="images/add.png" /></a> <?php }?> </th>
                  </tr>
                  </thead>
                 <tbody>
                <?php while ($row = mysql_fetch_assoc($result)) {?>
                 <?php $lname = explode(" ",$row['Name']);if(count($lname)>1){ $lastname = $lname[1]; } else {$lastname = $lname[0]; }
	          ?>
                  <tr class="bor">
                    <td style="display:none;"><?php echo $lastname;?></td>
                    <td <?php if(strlen($row['Name'])>27){?> title="<?php echo $row['Name'];?>" <?php }?>><?php if(strlen($row['Name'])>27){ echo substr($row['Name'],0,20).'...';}else{ echo $row['Name']; }?></td>
                    <td><?php echo $row['PrimPhone'];?></td>
                    <td><?php echo $row['SecPhone'];?></td>
                    <td ><a href="mailto:<?php echo $row['Email']; ?>" style="text-decoration: underline; color: #0000EE;" <?php if(strlen($row['Email'])>15){?> title="<?php echo $row['Email'];?>" <?php }?>><?php if(strlen($row['Email'])>15){ echo substr($row['Email'],0,10).'...';}else{ echo $row['Email']; }?></a></td>
                    <td <?php if(strlen($row['Camera'])>15){?> title="<?php echo $row['Camera'];?>" <?php }?>><?php if(strlen($row['Camera'])>15){ echo substr($row['Camera'],0,10).'...';}else{ echo $row['Camera']; }?></td>
                    <td <?php if(strlen($row['Transfer'])>15){?> title="<?php echo $row['Transfer'];?>" <?php }?>><?php if(strlen($row['Transfer'])>15){ echo substr($row['Transfer'],0,10).'...';}else{ echo $row['Transfer']; }?></td>
                    <td <?php if(strlen($row['teleprompt'])>15){?> title="<?php echo $row['teleprompt'];?>" <?php }?>><?php if(strlen($row['teleprompt'])>15){ echo substr($row['teleprompt'],0,10).'...';}else{ echo $row['teleprompt']; }?></td>
                    <td><?php echo $row['Rate'];?></td>                    
                    <td width="5" bgcolor="#fff" style="background-color:#fff;border:none;"></td>
                    <td style="background-color:#fff;border:none;"></td>
                    <td class="detail_in" colspan="3" style=" width: 180px;">
                        <span class="tleft" style=" width: 32%;"><a href="view_videographer.php?edit_id=<?php echo $row['vID']; ?>">Details</a></span>
                        <span class="tleft" style=" width: 33%;"><a href="<?php if($_SESSION['login_details']['user_dept']==2){?>add_videographer.php?edit_id=<?php echo $row['vID']; ?><?php }else{?>#<?php }?>">Update</a></span>
                        <span class="tright" style=" width: 32%;"><a href="<?php if($_SESSION['login_details']['user_dept']==2){?>videographer.php?delete_id=<?php echo $row['vID']; ?><?php }else{?>#<?php }?>">Delete</a></span>
                    </td>
                    
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

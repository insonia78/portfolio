<?php
error_reporting(0);
session_start();
include ('config.php');
if($_SESSION['login_details']['user_id']==""){
     header("Location:index.php");
       exit;
}
$edit_id = $_POST['edit_id'];
if(isset($_POST['edit_id'])){
if($edit_id!=""){
$updatequery = "update videographers set Name='".$_POST['Name']."',CompanyName='".$_POST['CompanyName']."',Street='".$_POST['Street']."',City='".$_POST['City']."',State='".$_POST['State']."',Zip='".$_POST['Zip']."',PrimPhone='".$_POST['PrimPhone']."',SecPhone='".$_POST['SecPhone']."',Email='".$_POST['Email']."',Camera='".$_POST['Camera']."',RingSize='".$_POST['RingSize']."',Rate='".$_POST['Rate']."',Transfer='".$_POST['Transfer']."',teleprompt='".$_POST['teleprompt']."',videographer_alter='".$_POST['videographer_alter']."' where vID='".$edit_id."'";
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
 $insert_query = "insert into videographers(Name,CompanyName,Street,City,State,Zip,PrimPhone,SecPhone,Email,Camera,RingSize,Rate,Transfer,teleprompt,videographer_alter) values('".$_POST['Name']."','".$_POST['CompanyName']."','".$_POST['Street']."','".$_POST['City']."','".$_POST['State']."','".$_POST['Zip']."','".$_POST['PrimPhone']."','".$_POST['SecPhone']."','".$_POST['Email']."','".$_POST['Camera']."','".$_POST['RingSize']."','".$_POST['Rate']."','".$_POST['Transfer']."','".$_POST['teleprompt']."','".$_POST['videographer_alter']."')";
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
<style>.detail_in{ width: 120px !important;}</style>

</head>

<body>
<div id="main_wrapper">
	<div class="main_content">
        <div class="header">
            <h1>Videographer Details</h1>
            <img src="images/logo_small.png" />
        </div><!--header-->
        <div class="enroll_content"><a href="logout.php" style="float: right; margin-top: -30px;">+Logout</a>
        	<a href="logout.php" style="float: right; margin-top: -30px;">+Logout</a>
        	<div class="tab_conatiner">
                <div class="tab_tit" id="tab1"><a href="upcomming.php">Upcoming </a></div>
                <div class="tab_tit" id="tab2"><a href="postponed.php">Postponed</a></div>
                <div class="tab_tit" id="tab2"><a href="cancelled.php">Cancelled</a></div>
                <div class="tab_tit" id="tab3"><a href="filmed.php">Filmed</a></div>
                <div class="tab_tit active_state" id="tab4"><a href="videographer.php">Videographers</a></div>
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
                    <th class="active_title" align="center">Name<img src="images/arrow.png" />       </th>
                    <th align="center">Phone (office)<img src="images/arrow.png" />  </th>
                    <th align="center">Phone (Cell)<img src="images/arrow.png" /> </th>
                    <th align="center">Email<img src="images/arrow.png" /> </th>
                    <th align="center">Camera <img src="images/arrow.png" /> </th>
                    <th align="center">Transfer<img src="images/arrow.png" /></th>
                    <th align="center">Teleprompter<img src="images/arrow.png" /> </th>
                    <th align="center">Rate<img src="images/arrow.png" /></th>
                    <th align="center">&nbsp;  </th>
                    <th align="center">&nbsp;  </th>
                    <th align="center"><?php if($_SESSION['login_details']['user_dept']==2){?><a href="add_videographer.php"><img src="images/add.png" /></a> <?php }?> </th>
                  </tr>
                  </thead>
                 <tbody>
                <?php while ($row = mysql_fetch_assoc($result)) {?>
                  <tr class="bor">
                    <td <?php if(strlen($row['Name'])>15){?> title="<?php echo $row['Name'];?>" <?php }?>><?php if(strlen($row['Name'])>16){ echo substr($row['Name'],0,10).'...';}else{ echo $row['Name']; }?></td>
                    <td><?php echo $row['PrimPhone'];?></td>
                    <td><?php echo $row['SecPhone'];?></td>
                    <td><a href="mailto:<?php echo $row['Email']; ?>" style="text-decoration: underline; color: #0000EE;"><?php echo $row['Email'];?></a></td>
                    <td <?php if(strlen($row['Camera'])>15){?> title="<?php echo $row['Name'];?>" <?php }?>><?php if(strlen($row['Camera'])>15){ echo substr($row['Camera'],0,10).'...';}else{ echo $row['Camera']; }?></td>
                    <td <?php if(strlen($row['Transfer'])>15){?> title="<?php echo $row['Transfer'];?>" <?php }?>><?php if(strlen($row['Name'])>15){ echo substr($row['Transfer'],0,10).'...';}else{ echo $row['Transfer']; }?></td>
                    <td <?php if(strlen($row['teleprompt'])>15){?> title="<?php echo $row['Name'];?>" <?php }?>><?php if(strlen($row['teleprompt'])>15){ echo substr($row['teleprompt'],0,10).'...';}else{ echo $row['teleprompt']; }?></td>
                    <td><?php echo $row['Rate'];?></td>                    
                    <td width="5" bgcolor="#fff" style="background-color:#fff;border:none;"></td>
                    <td style="background-color:#fff;border:none;"></td>
                    <td class="detail_in" colspan="2"><span class="tleft"><a href="view_videographer.php?edit_id=<?php echo $row['vID']; ?>">Details</a></span><span class="tright"><a href="<?php if($_SESSION['login_details']['user_dept']==2){?>add_videographer.php?edit_id=<?php echo $row['vID']; ?><?php }else{?>#<?php }?>">Update</a></span></td>
                    
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

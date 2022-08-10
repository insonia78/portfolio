<?php
error_reporting(0);
session_start();
include ('config.php');
if($_SESSION['login_details']['user_id']==""){
     header("Location:index.php");
       exit;
}
//$query = "select shootdate,Name,AssignID,therapeuticArea,practicecity,physname,repname,AssignStatus from assignments LEFT JOIN videographers ON assignments.shootername=videographers.vID where AssignStatus IN ('postponed','cancelled') ORDER BY AssignStatus DESC";
$query = "select * from reorders";

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
            <h1><?php if($_SESSION['login_details']['user_dept']==1){?>Client Services Queue<?php }else{?>Field Operations Queue<?php }?> </h1>
            <img src="images/logo_small.png" />
        </div><!--header-->
        <div class="enroll_content">
        	<a href="export.php?status='reorder'" style="float: right; margin-right: 168px; margin-top: -30px;">Export Reorder</a> <a href="expt.php" style="float: right; margin-right: 82px; margin-top: -30px;">Export All </a>       	<a href="logout.php" style="float: right; margin-top: -30px;">+Logout</a>
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
             <?php if($_SESSION['success']!=''){?> <p class="success autohide"><?php echo $_SESSION['success']; ?></p><?php }?>
               <?php if($_SESSION['error']!=''){?> <p class="error autohide "><?php echo $_SESSION['error']; ?></p><?php }?>
               </div>	
            <div class="dummy">
                <table width="100%" cellpadding="0" cellspacing="0" class="video dataTable">
                  <thead style="padding-left:50px;">
                  <tr class="title">
                  <!--  <th class="active_title" align="center" style=" width: 200px !important;">Date of Reorder<img src="images/arrow.png" />       </th>
                    <th align="center" style=" width: 100px !important;"> Job No.<img src="images/arrow.png" />  </th>
                    <th align="center" style=" width: 300px !important;">Location<img src="images/arrow.png" /> </th>
                    <th align="center" style=" width: 300px !important;">HCP<img src="images/arrow.png" /></th>
                    <th align="center" style=" width: 300px !important;">Rep<img src="images/arrow.png" /> </th> 
                    <th align="center" style=" width: 150px !important;">Shipped<img src="images/arrow.png" /> </th> 
                    <th align="center" style=" width: 10px !important;">&nbsp;  </th>
                    <th align="center" style=" width: 10px !important;">&nbsp;  </th>-->
					<th class="active_title" align="center" style=" ">Date of Reorder<img src="images/arrow.png" />       </th>
                    <th align="center" style=" "> Job No.<img src="images/arrow.png" />  </th>
                    <th align="center" style="">Location<img src="images/arrow.png" /> </th>
                    <th align="center" style="">HCP<img src="images/arrow.png" /></th>
                    <th align="center" style=" ">Rep<img src="images/arrow.png" /> </th> 
                    <th align="center" style=" ">Shipped<img src="images/arrow.png" /> </th> 
                    <th align="center" style=" ">&nbsp;  </th>
                    <th align="center" style=" ">&nbsp;  </th>
                  </tr>
                  </thead>
                 <tbody>
                <?php while ($row = mysql_fetch_assoc($result)) {
                    $ass_id = $row['AssignID'];
                 $query = "select AssignID,therapeuticArea,practicestate,physname,repname,AssignStatus from assignments where AssignID =$ass_id";
                 $result = mysql_query($query);
                 if(mysql_num_rows($result)>0){
                     $reorder = mysql_fetch_assoc($result);
                 }else{
                     $reorder['AssignID'] = '';
                    $reorder['practicestate'] = '';
                     $reorder['physname'] = '';
                     $reorder['repname'] = '';
                 }
                    ?>
                  <tr class="bor">
                    <td ><?php echo date("m-d-Y", strtotime($row['thedate']));?></td>
                    <td><?php echo $reorder['AssignID'];?> </td>
                    <td><?php echo $reorder['practicestate'];?> </td>
                    <td><?php echo $reorder['physname'];?> </td>
                    <td><?php echo $reorder['repname'];?> </td>
                    <td><?php echo $row['shipped'];?></td>                                
                     <td width="5" style="background-color:#fff; border:none;"></td>
                     <td class="detail_in" colspan="2"><span class="tleft"><a href="viewreorder.php?edit_id=<?php echo $row['reordernum'];?>">Details</a></span><span  style ="background-color:black;" class="tright"><div href="<?php if($_SESSION['login_details']['user_dept']==1){?>internal_update.php?edit_id=<?php echo $row['AssignID'];?><?php }else{?>javascript:void(0)<?php }?>"></div></span></td>
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


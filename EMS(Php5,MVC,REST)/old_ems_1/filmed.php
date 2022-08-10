<?php
error_reporting(0);
session_start();
include ('config.php');
if($_SESSION['login_details']['user_id']==""){
     header("Location:index.php");
       exit;
}
$query = "select shootdate,shootername,AssignID,therapeuticArea,practicestate,physname,repname,AssignStatus from assignments where AssignStatus = 'filmed'";
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
<script src="js/sweet-alert.min.js"></script>
<link rel="stylesheet" href="css/sweet-alert.css"></link>
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
 $(".pop_title").click(function(){
     var the_code = $(this).attr('id');
     $("#the_code").html(the_code);
	$("#pop_content").fadeIn();
	});
   $(".overlay").click(function(){
    $("#pop_content").fadeOut();
  });
  $(".close").click(function(){
    $("#pop_content").fadeOut();
   });
  window.onkeydown = function( event ) {
    if ( event.keyCode === 27 ) {
       $("#pop_content").fadeOut();
    }
	};
 });
</script>
<script type="text/javascript">
    $(document).ready(function(){
       
    $("#feedback_submit").click(function(){
        $('#q1').css('display','none');
        $('#q2').css('display','none');
        $('#q3').css('display','none');
        $('#q4').css('display','none');
        $('#q5').css('display','none');
        $('#q6').css('display','none');
                 
        var q1 = $('input[name=q1]:checked').val();
        var q2 = $('input[name=q2]:checked').val();
        var q3 = $('input[name=q3]:checked').val();
        var q4 = $('input[name=q4]:checked').val();
        var q5 = $('input[name=q5]:checked').val();
        var the_code = $("#the_code").html();
        var q6 = [];
        $('input[name=q6]:checked').each(function(i){
          q6[i] = $(this).val();
        });
        
        if($('input[name=q1]:checked').length ==''){
            
            $('#q1').css('display','block');
            return false;
        }
        if($('input[name=q2]:checked').length ==''){
            
            $('#q2').css('display','block');
            return false;
        }
        if($('input[name=q3]:checked').length ==''){
            
            $('#q3').css('display','block');
            return false;
        }
        if($('input[name=q4]:checked').length ==''){
            
            $('#q4').css('display','block');
            return false;
        }
        if($('input[name=q5]:checked').length ==''){
            
            $('#q5').css('display','block');
            return false;
        }if($('input[name=q6]:checked').length ==''){
            
            $('#q6').css('display','block');
            return false;
        }
       $.ajax
                        ({
                            type: "POST",
                            url: "feedback_sub.php",
                            data: "q1=" +q1+"&q2=" +q2+"&q3=" +q3+"&q4=" +q4+"&q5=" +q5+"&q6=" +q6+"&the_code=" +the_code,
                            success: function(sivaraj)
                            {
                             
                              $('input[type=radio]').prop('checked',false);
                               $('input[type=checkbox]').prop('checked',false);
                               swal("Feedback added successfully", "", "success");
                            }
                        });
    });
});
</script>
<style>
 .enroll_text .dummy table tr td:nth-child(7) {
    border: medium none !important;
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
                <div class="tab_tit" id="tab2"><a href="postponed.php">Postponed</a></div>
                <div class="tab_tit" id="tab2"><a href="cancelled.php">Cancelled</a></div>
                <div class="tab_tit active_state" id="tab3"><a href="filmed.php">Filmed</a></div>
                <div class="tab_tit" id="tab4"><a href="videographer.php">Videographers</a></div>
            </div><!--tab container-->
            
            <div class="search_container">
            	  <div class="search_icon"><img src="images/search_icon.png" /></div>
            </div><!--search container-->
            <div class="enroll_text">
             <?php if($_SESSION['success']!=''){?> <p class="success"><?php echo $_SESSION['success']; ?></p><script>setTimeout("location.href=''", 1000);</script><?php }?>
               <?php if($_SESSION['error']!=''){?> <p class="success"><?php echo $_SESSION['error']; ?></p><script>setTimeout("location.href=''", 1000);</script><?php }?>
               <p id="the_code" style=" display: none;"></p>
            <div class="dummy">
                <table width="100%" cellpadding="0" cellspacing="0" class="video dataTable">
                  <thead style="padding-left:50px;">
                  <tr class="title">
                    <th class="active_title" align="center">Shoot Date<img src="images/arrow.png" />       </th>
                    <th align="center" style=" width: 90px !important;"> Job No.<img src="images/arrow.png" />  </th>
                    <th align="center" style=" width: 90px !important;">Brand<img src="images/arrow.png" /> </th>
                    <th align="center" style=" width: 150px !important;">Videographer<img src="images/arrow.png" /> </th>
                    <th align="center" style=" width: 120px !important;">Location <img src="images/arrow.png" /> </th>
                    <th align="center" style=" width: 120px !important;">HCP<img src="images/arrow.png" /></th>
                    <th align="center" style=" width: 120px !important;">Rep<img src="images/arrow.png" /> </th>                  
                    <th align="center" style=" width: 10px !important;">&nbsp;  </th>
                     <th align="center">&nbsp;</th>
                  </tr>
                  </thead>
                 <tbody>
                <?php while ($row = mysql_fetch_assoc($result)) {?>
                         
                    
                  <tr class="bor">
                      <td ><?php echo $row['shootdate'];?></td>
                    <td ><?php echo $row['AssignID'];?> </td>
                    <td ><?php echo $row['therapeuticArea'];?></td>
                    <td <?php if(strlen($row['shootername'])>16){?> title="<?php echo $row['shootername'];?>" <?php }?>><?php if(strlen($row['shootername'])>16){ echo substr($row['shootername'],0,10).'...';}else{ echo $row['shootername']; }?></td>
                    <td <?php if(strlen($row['practicestate'])>15){?> title="<?php echo $row['practicestate'];?>" <?php }?>><?php if(strlen($row['practicestate'])>15){ echo substr($row['practicestate'],0,10).'...';}else{ echo $row['practicestate']; }?></td>
                    <td <?php if(strlen($row['physname'])>15){?> title="<?php echo $row['physname'];?>" <?php }?>><?php if(strlen($row['physname'])>15){ echo substr($row['physname'],0,10).'...';}else{ echo $row['physname']; }?></td>
                    <td <?php if(strlen($row['repname'])>15){?> title="<?php echo $row['repname'];?>" <?php }?>><?php if(strlen($row['repname'])>15){ echo substr($row['repname'],0,10).'...';}else{ echo $row['repname']; }?></td>
                                                          
                    <td  width="5" style="background-color:#fff;border:none;"></td>
                    <td  class="detail_in" colspan="2"><span class="tleft"><a href="enrolldetails.php?edit_id=<?php echo $row['AssignID'];?>">Details</a></span><span id="<?php echo $row['therapeuticArea'];?>" class="tright <?php if($_SESSION['login_details']['user_dept']==1){?> pop_title<?php } ?>"><a href="#">Feedback</a></span></td>
                  </tr> 
                <?php  }?> 
                  </tbody>
			</table>
            	</div><!--dummy-->
  </div><!--enroll text-->
  <div id="pop_content">
                         <div class="overlay"></div><!--overlay-->
                          	<div class="close"></div>
                           <div class="pop_text">
                           <div class="pop_text_inner">
                           
                               <h1>input feed back</h1>
                               <h3>you are inputting feedback for [HCP]</h3>
                               <div class="query1">
                               <p>This program helped me understand ways to manage my health.</p>
                               <ul>
                                   <li><p><input type="radio" name="q1" value="Strongly Agree"/></p><p>Strongly Agree</p></li>
                                   <li><p><input type="radio" name="q1" value="Agree"/></p><p>Agree</p></li>
                                   <li><p><input type="radio" name="q1" value="Neutral"/></p><p>Neutral</p></li>
                                   <li><p><input type="radio" name="q1" value="Disagree"/></p><p>Disagree</p></li>
                                   <li><p><input type="radio" name="q1" value="Strongly Disagree"/></p><p>Strongly Disagree</p></li>
                                </ul><p class="error" style="display: none;" id="q1">Please select any one</p>
                               </div><!--query-->
                               <div class="query1">
                               <p>The information will help me communicate more effectively with my doctor.</p>
                              <ul>
                                   <li><p><input type="radio" name="q2" value="Strongly Agree"/></p><p>Strongly Agree</p></li>
                                   <li><p><input type="radio" name="q2" value="Agree"/></p><p>Agree</p></li>
                                   <li><p><input type="radio" name="q2" value="Neutral"/></p><p>Neutral</p></li>
                                   <li><p><input type="radio" name="q2" value="Disagree"/></p><p>Disagree</p></li>
                                   <li><p><input type="radio" name="q2" value="Strongly Disagree"/></p><p>Strongly Disagree</p></li>
                                </ul><p class="error" style="display: none;" id="q2">Please select any one</p>
                               </div><!--query-->
                               <div class="query1">
                               <p>It was reassuring and comforting to have my own doctor involved in the program.</p>
                               <ul>
                                   <li><p><input type="radio" name="q3" value="Strongly Agree"/></p><p>Strongly Agree</p></li>
                                   <li><p><input type="radio" name="q3" value="Agree"/></p><p>Agree</p></li>
                                   <li><p><input type="radio" name="q3" value="Neutral"/></p><p>Neutral</p></li>
                                   <li><p><input type="radio" name="q3" value="Disagree"/></p><p>Disagree</p></li>
                                   <li><p><input type="radio" name="q3" value="Strongly Disagree"/></p><p>Strongly Disagree</p></li>
                                </ul><p class="error" style="display: none;" id="q3">Please select any one</p>
                               </div><!--query-->
                               <div class="query1">
                               <p>I would recommend this program to other patients.</p>
                              <ul>
                                   <li><p><input type="radio" name="q4" value="Strongly Agree"/></p><p>Strongly Agree</p></li>
                                   <li><p><input type="radio" name="q4" value="Agree"/></p><p>Agree</p></li>
                                   <li><p><input type="radio" name="q4" value="Neutral"/></p><p>Neutral</p></li>
                                   <li><p><input type="radio" name="q4" value="Disagree"/></p><p>Disagree</p></li>
                                   <li><p><input type="radio" name="q4" value="Strongly Disagree"/></p><p>Strongly Disagree</p></li>
                                </ul><p class="error" style="display: none;" id="q4">Please select any one</p>
                               </div><!--query-->
                               <div class="query1">
                               <p>Overall, I am satisfied with this program.</p>
                              <ul>
                                   <li><p><input type="radio" name="q5" value="Strongly Agree"/></p><p>Strongly Agree</p></li>
                                   <li><p><input type="radio" name="q5" value="Agree"/></p><p>Agree</p></li>
                                   <li><p><input type="radio" name="q5" value="Neutral"/></p><p>Neutral</p></li>
                                   <li><p><input type="radio" name="q5" value="Disagree"/></p><p>Disagree</p></li>
                                   <li><p><input type="radio" name="q5" value="Strongly Disagree"/></p><p>Strongly Disagree</p></li>
                                </ul><p class="error" style="display: none;" id="q5">Please select any one</p>
                               </div><!--query-->
                               <div class="query2">
                               <p>Which of the following parts of the program did you find most useful?</p>
                               
                               <p>  Choose as many as you wish.</p> <p class="error" style="display: none;" id="q6">Please select atleast any one</p>
                               <ul class="last">
                                   <li>
                                       <p><input type="checkbox" name="q6" value="What Are Psoriatic Arthritis and Plaque Psoriasis?" /><span>What Are Psoriatic Arthritis and Plaque Psoriasis?</span></p>
                                   </li>
                                   <li>
                                       <p><input type="checkbox" name="q6" value="Symptoms and Treatment Options"/><span>Symptoms and Treatment Options</span></p>
                                   </li>
                                   <li>
                                       <p><input type="checkbox" name="q6" value="About Otezla (apremilast"/><span>About Otezla (apremilast)</span></p>
                                   </li>
                                   <li>
                                       <p><input type="checkbox" name="q6" value="Taking Otezla"/><span>Taking Otezla</span></p>
                                   </li>
                                   <li>
                                       <p><input type="checkbox" name="q6" value="Healthy Living Tips"/><span>Healthy Living Tips</span></p>
                                   </li>
                               </ul>
                               
                               <input type="submit" class="submit" value="Submit" id="feedback_submit" /> 
                               </div><!--query-->
                                </div><!--pop text inner-->
                           </div><!--pop text-->
                        </div><!--pop content-->
                     
<!------------------------------------------------------------------------popup--------------------------------------------------------->
        </div><!--enroll content-->
        <p class="copy">&#169; 2015 Axon communications, Inc.</p>
    </div><!--main_content-->

</div><!--main wrapper-->
 <?php unset($_SESSION['error']);unset($_SESSION['success']);?>
</body>
</html>


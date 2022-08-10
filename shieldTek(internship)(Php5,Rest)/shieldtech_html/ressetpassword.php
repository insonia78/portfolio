<?php

?>
/
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transition//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
  <head>
     <meta http-equiv ="content-type" content="txt/html; charset=utf-8" />
     <title>Your FeedBack </title>
     <style type="text/css" >
	.fieldset{
	position:absolute;
	top:900px;
     background-color: rgb(255,246,205);
	 border: 1px solid rgb(233, 69,0);
	 float:left;
	 margin: 10px 0px 10px 2.5%;
	 width: 90%;
	 }
	 .legend{
     position:relative;
     left:-15px;	 
	 background-color: rgb(233,69,0);
	 color:white;
	 text-indent: 5px;
	 width:108%;
	 text-align:center;
	 }
	 /*Label Style */
	    .label{
		clear: left;
		display:block;
		float:left;
		margin: 7px 5% 7px 5px;
		width: 40%;
		}
				
	  /*Input Styles */
       .input{
      display:block;
      float:left;
      font-size: 0.9;
      margin:7px 0px;
      width:50%;
      }
    /*Text area styles */
     .textarea{
	   position:relative;
	   left: 40px;
       font-size:0.9;
       float:left;
       height:150px;
       margin: 10px 0px;
       width: 80%;
     }	
	 </style>
  </head>
  <body>
      <form action ="/shieldTek/shieldtech-api/password_reset/password_reset2.php" method ="POST" />
  
          <fieldset >
		      

                <p><label for = "email">password</label>
                  <input type="text" name = "password1" id="email"
				         placeholder="required field"/></p>
                 <p><label for = "email">re-password</label>
                  <input type="text" name = "resetpassword" id="email"
				         placeholder="required field"/></p>
                           
                  
                  <input type ="text" name ="token" id="token" 
				         placeholder="required field" value="<?php echo($token);?>" hidden/></p>                    
                              
           
                  <input type="submit" name = "submit" id= "submit" value="submit"/>					  
		 </fieldset>
		 </form>
 </body>
</html>
        		 


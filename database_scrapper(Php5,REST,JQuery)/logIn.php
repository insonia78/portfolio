



<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html lang="en">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->


        <script src= "application/js/jquery/jquery.js" ></script>
        <script src= "application/js/jquery/jquery-ui.js" ></script>
        <?php
        $action ;
        if ($location == "index.php") {
            
           $action = "application/config/main.php";
            ?>
             <link rel="stylesheet" href="application/css/jquery-ui.css">
             <link href="application/css/bootstrap.min.css" rel="stylesheet">

             <link href="application/css/bussiness_card.css" rel="stylesheet"> 
        <!--<link rel="stylesheet" href="style.css">-->

             <link rel="stylesheet" type="text/css" href="application/css/wpstyles.css">

        


            <?php
        }
        else if($location == "main.php")
        {
            $action = "main.php";
            ?>
             
             <link rel="stylesheet" href="application/css/jquery-ui.css">
             <link href="../css/bootstrap.min.css" rel="stylesheet">

             <link href="../css/bussiness_card.css" rel="stylesheet"> 
        <!--<link rel="stylesheet" href="style.css">-->

             <link rel="stylesheet" type="text/css" href="../css/wpstyles.css">
             
             
             <?php
            
            
        }
        else
        {
        define('BASEPATH') OR exit("direct access not allowed"); 

        }




        ?>

        <!-- Bootstrap -->

        







        <style>

            .highlight
            {
                background-color:#ca170c;

            }
            .tip
            {
                background-color:#fdfb1c;

            }


            #reg_form 
            {
                position:absolute;
                top:350px;
                left:360px;


            }
            .registration_container
            {
                position:absolute;
                top:350px;
                left:360px;


            }
            #register{


                width:300px;
                border:1px solid black;

            }
            .form-control
            {

                width:270px;
                z-index:5;
            }
            a
            {
                cursor:pointer;

            }
            .text
            {
                position:relative;
                left:60px;
            }
            label{

                text-align:center; 
            }
            .validateTips 
            { border: 1px solid transparent; padding: 0.3em; }
            .register_form
            {
                background-color:#88bff6;
                height: 750px;
                width: 400px;
                border:1px solid black;

            }
        </style>

    </head>



    <body class="box" text="#000000" style="height: 1100px; background: rgb(44, 54, 81);">
        <!-----------header------------------->
        <section>


            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>








            <form id="reg_form" action="<?php echo $action ?>" method="post">
                <h2>Log In </h2>
                <fieldset id="register">	 



                    <br><label for="password">Password</label><br>
                    <input type="password" name="password" value="" id="password" class="text ui-widget-content ui-corner-all form-control position"style="position:relative;left:3px;" ><br>

                    <!-- Allow form submission with keyboard without duplicating the dialog button 
                    <input type="submit" tabindex="-1" style="position:absolute; top:-1000px" id="submit">-->



                </fieldset>
                <input style="background: rgb(44, 54, 81);color:white;" class="form-control" type="submit" value="Submit" id="sb">
                <input name ="hidden" class="form-control" type="hidden" value="true" id="sb">

            </form>

            <!------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
            <!----------------------------------------------------------------------------------login dialog box ------------------------------------------------------------------------------------------->








        </section>	


    </body>
</html>
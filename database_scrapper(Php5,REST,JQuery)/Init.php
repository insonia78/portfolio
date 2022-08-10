<?php
/*********************************************
 * Init.php
 * @Author:Thomas Zangari
 * @data:1/11/2015
 * 
 * The file initializes the url that the application is going to process
 * and it sets up the Database connection and table that are going to store the data  * 
 * 
 * il holds the md5 password that enables to access the application from the LogIn.php file
 * 
 **********************************************/




$__DATABASE = array();
 

 

     $__DATABASE['user'] = "root";
     $__DATABASE['host'] = 'localhost';
     $__DATABASE['pw'] = "thomas78";
     $__DATABASE['database'] = "nostrovia_enrolment";
     $__DATABASE['table'] = 'temp_input_feedback';
     
     
     
     
     
     $__URL = array();
     
     
       $__URL[0] = 'http://localhost/enrollmenttest_db/get_data_from_table.php';
       $__URL[1] = 'http://localhost/input_feedback_understandingpsa/get_data_from_table.php';
      $__URL[2] = "http://localhost/input_feedback_bewellinformed/get_data_from_table.php";

     
     
     
     
     $BASEPATH = "http://localhost/input_feedback/index.php";
     define('BASEPATH', $BASEPATH);
     
     
     
   //@1234
     
     //$passwordConfirm = ae5515e371a599b8d82b244212209283;
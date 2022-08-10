<?php
session_start();
$_POST["apikey"] = '77ce2d83add9f5359fbf2cc35ef7ea4fe06df05b';
$_POST["action"] = 'newalert';

 $_POST["aid"] = '1055';
 $_POST["uid"] = '97';
 $_POST["lat"] = '43.43710';
 $_POST["long"] = '34.2233';
 //$_POST["timestamp"] = 'd2014-03-06T15:12:02-0200';
 $_POST["timestamp"] = date(DATE_ISO8601, time());

/*

aid
uid
start_time
end_time
initial_loc
end_loc
location_history
status

*/

$_POST["name_first"] = 'Robert';               // 1
$_POST["name_last"] = 'Oliveira';              // 2
$_POST["phone_cell"] = '9738561725';           // 4
$_POST["dob"] = '1991-05-27';                  // 6
$_POST["cwid"] = '10809340934068';                   // 7
$_POST["dorm_building"] = 'Freeman Hall';              // 8
$_POST["dorm_roomnum"] = '9b';               // 9
$_POST["medical_issues"] = 'insomnia';             // 10
$_POST["blood_type"] = 'A+';                   // 11
$_POST["phone_home"] = '9736694813';           // 12

$_POST["email"] = 'testingsssbugdfdfd2@montclair.edu'; // 3
$_POST["password"] = 'Strongpass12..';                 // 5






?>
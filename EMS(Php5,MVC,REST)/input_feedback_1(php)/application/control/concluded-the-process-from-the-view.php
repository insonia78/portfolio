<?php
/***************************
 * file concluded-the-process-from-the-view.php Requires : ../config/main.php
 *  @author:Thomas Zangari  
 * @date 1/11/2015
 * 
 * it fetched the data from the input_feedback_view.php with ajax call - processes it and writes to the database tables :temp_input_feedback
 * and feedback 
 *
**********************************/
defined('BASEPATH') OR exit('No direct script access allowed');



$performActionOnDatabaseTables = new performActionOnDatabaseTables();

$data_discarted = $_POST['data_tobe_erased'];
$id_processed = $_POST['id'];
$data_tobe_sent_to_feedback = $_POST['data_tobe_sent_to_feedback'];
$count_keep_data = count($data_tobe_sent_to_feedback);
$count = count($data_discarted);




//echo print_r($data_tobe_sent_to_feedback);
//echo print_r($data);

$confirmResponses = 0; // holds the of answers process to be compared with the count of the array 


$finalId;
$result = "";

$y = 0;
$answer = array();
$constanswer = array();
$responseTobeSentBack = "";
$db = new Database();

$db->connect();


foreach ($data_discarted as $id) {

    try {

        $response = $performActionOnDatabaseTables->upDateTempInputFeedbackTable($id, $db);
        
        
        // count how many rsponses where 
        if (isset($response)) {
            $confirmResponses++;
            $finalId = $id;
        }
    } catch (Exception $e) {
        echo $e->getMessage();
    }
}
if ($confirmResponses == $count) {
    $performActionOnDatabaseTables->upDateIdtableOfTheServers(( $id_processed + 1), 'temp_input_feedback', $db);
    $responseTobeSentBack .= "1,";
} else {
    $responseTobeSentBack .= "temp_input_feedeback_data data not updated,";
}

$confirmResponse = 0;

$answer['webcode'] = $data_tobe_sent_to_feedback[0];

$response = $performActionOnDatabaseTables->fetchDataFromAssignmentsToUpDateFeedBack($answer[0], $db);

setAssignmentData($response);

/*
 * iterator for the data that is going to be sent to the feedback table 
 * 
 * 
 * 
 */

for ($i = 0; $i < $count_keep_data; $i++) {

    if ($i % 7 == 0 && $i != 0) {

        $y = 0;
    }

    if ($answer['webcode'] != $data_tobe_sent_to_feedback[$i]) {
        $response = $performActionOnDatabaseTables->fetchDataFromAssignmentsToUpDateFeedBack($answer[$i], $db);

        setAssignmentData($response);
    }
    $y++;
    $i++;
    $answer['q1'] = $data_tobe_sent_to_feedback[$i];
    $y++;
    $i++;
    $answer['q2'] = $data_tobe_sent_to_feedback[$i];
    $y++;
    $i++;
    $answer['q3'] = $data_tobe_sent_to_feedback[$i];
    $y++;
    $i++;
    $answer['q4'] = $data_tobe_sent_to_feedback[$i];
    $y++;
    $i++;
    $answer['q5'] = $data_tobe_sent_to_feedback[$i];
    $y++;
    $i++;
    $answer['q6'] = $data_tobe_sent_to_feedback[$i];
    $q6 = count(explode("-", $answer['q6']));
    if ($q6 == 1) {
        $i++;
        $y++;
        $answer['q7'] = $data_tobe_sent_to_feedback[$i];
        $i++;
        $y++;
        $answer['q8'] = $data_tobe_sent_to_feedback[$i];
    } else {
        for ($x = 0; $x < (count($q6) - 1); $x++) {

            $response = $performActionOnDatabaseTables->upDateFeedbackTable($constanswer['repemail'], $constanswer['AssignId'], $z, (int) $q6[$x], $db);
        }
    }

    /////number of answers compleated and added to y 
    $confirmResponse += $y;
}




if ($confirmResponse == $count_keep_data) {

    $responseTobeSentBack .= "feedback data updated";
} else {
    $responseTobeSentBack .= "feedback data not updated";
}


echo $responseTobeSentBack;




function setAssignmentData($response) {
    global $constanswer;

    $data = mysqli_fetch_assoc($response);

    $constanswer['repemail'] = $data['repemail'];
    $constanswer['AssignId'] = $data['AssignId'];
}


?>
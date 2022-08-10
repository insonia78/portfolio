<?php

/*
 *  file performActionOnDatabaseTables.php
 *  @author :Thomas Zangari
 *  it performs the read and write to the databases 
 * 
 * 
 * 
 */


error_reporting(0);
ini_set('display_errors', '0');


class performActionOnDatabaseTables 
{
   
    
    
    function  upDateIdtableOfTheServers($newId,$server,$db) 
    {
        
    
    $query = "Update lastIdFromTheServer Set last_id='$newId' where server='$server'";
     $result = $db->send_sql($query);
     return $result;
    
    
     }
     function insertJsonDataIntoDatabase($json_data,$normilize_data,$db) {

         
        $count = count($json_data);
        $i = 0;
        $aData = array();

        
     

        while ($i < $count) {

            $aData['id'] = $json_data[$i];
            $i++;
            $aData['q1'] = $normilize_data->normalize_data($json_data[$i]);
            $i++;
            $aData['q2'] = $normilize_data->normalize_data($json_data[$i]);
            $i++;
            $aData['q3'] = $normilize_data->normalize_data($json_data[$i]);
            $i++;
            $aData['q4'] = $normilize_data->normalize_data($json_data[$i]);
            $i++;
            $aData['q5'] = $normilize_data->normalize_data($json_data[$i]);
            $i++;
            $aData['q6'] = $normilize_data->normalize_data($json_data[$i]);
            
            $i++;
            $aData['q7'] = $normilize_data->normalize_data($json_data[$i]);

            $i++;
            $aData['q8'] = $normilize_data->normalize_data($json_data[$i]);

            $i++;
            $aData['q9'] = $normilize_data->normalize_data($json_data[$i]);
            $i++;
           
            $aData['code'] = $json_data[$i];
            $i++;




            $query = "insert Into temp_input_feedback (q1,q2,q3,q4,q5,q6,q7,q8,q9,code,discarted) Values('" . $aData['q1'] . "','" . $aData['q2'] . "','" . $aData['q3'] . "','" . $aData['q4'] . "',"
                    . "'" . $aData['q5'] . "','" . $aData['q6'] . "','" . $aData['q7'] . "','" . $aData['q8'] . "','" . $aData['q9'] . "','" . $aData['code'] . "',''); ";

            $db->send_sql($query);
        }

 
        return $aData['id'];
    }
    
    function upDateTempInputFeedbackTable($data, $db)
    {
        
        $query = " Update temp_input_feedback Set discarted = 'true' where id='$data';";
        
        $response =  $db->send_sql($query);
        
        return $response ;
        
    }
    function fetchDataFromAssignmentsToUpDateFeedBack($code,$db)
    {
        
        $query = " Select repemail, AssignId from assignments where webcode='$code';";
        $result = $db->send_sql($query);
        return $result ;
        
    }
    function fetchDoctorFromAssignments($code,$db)
    {
        
        $query = " Select physname from assignments where webcode='$code';";
        $result = $db->send_sql($query);
        $data = mysqli_fetch_assoc($result);
        return $data['physname'] ;
        
    }
    function upDateFeedbackTable($email,$id,$index,$value,$db)
    {
        
        $query = " Insert into feedback (repEmail,assignID,answer_index,answer_value) Values('$email','$id','$index','$value')";
        
        $response =  $db->send_sql($query);
        
        return $response ;
        
    }
}
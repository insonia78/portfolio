<?php

/*
 * getDataFromServerWithCurl.php
 * @author:Thomas Zangari
 * 
 * The application does curl request to the servers and returns the result 
 * 
 */



error_reporting(0);
ini_set('display_errors', '0');


class getDataFromServerWithCurl  {

    //put your code here
    

    function sendRequestToServerWithCurl($url,$index) {
       
        $data = array('last_id' => $index );
        
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $result = curl_exec($ch);

       
        curl_close($ch);
       
        return $result;
    }

}

?>

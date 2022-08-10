<?php
//require('require.php');
/* 
 * SHIELDtech Alert API
 * v0.8.4
 * For use with mobile application
 * 
 * See documentation for full details
 * https://docs.google.com/document/d/1VUBmMxiK6zx31Fj6eMEQdZ2GGZrsHhaczWTDZxp8kqw/
 *
 *
 */
class db_pass_reset 
{
    
    private $db ;
    private $response;
    
    
   /*
    * It connects to the dbClass
    * @return the response form the send_sql   
    */
   public function connect_to_db($result)
   {
     
     
     $db = new Database();
     $db->setup(); 
     $response = $db->send_sql($result);  
     return $response;
   }
  /*
   * It checks if the fields in the database are equal to the parameters send in from
   * the password reset
   * @parm count it keeps the count of the matching fields 
   * @return $count it returns the count of the fileds that match
   */  
  public function CheckFields($result, $token, $email) {
   echo'<style>
    .error{
    color:red;
    }
 </style>';
    $count = 0;

 
    
    try {
        
        if ($array = mysqli_fetch_array($result, MYSQLI_ASSOC)) {

            if ($array['email'] == $email) {
                $count++;                
            }
            if ($array['token'] == $token) {
                $count++;
            }
        } else {
            echo'<p class="error"> An Error has Accoured. Contact the Administrator </p> ';
        }
           
    } catch (Exception $e) {
        echo $e->getMessage() . "<BR>";
        echo mysqli_error($result);
        exit;
    }
    return $count;
 }
}

 ?>
                            
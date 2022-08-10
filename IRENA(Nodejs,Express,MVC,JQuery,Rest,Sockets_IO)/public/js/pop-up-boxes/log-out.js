/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var log_out_pop_up_box = function()
{
  
  $(".log-in-pop-up-container").css("display","none");
  $(".log-out-pop-up-container").css("display", "block");
  $(".pop-up-box-modal").css("display", "block");
  
};
var compleate_log_out = function(url)
{
    
   $('<a href="' + url + '"></a>')[0].click();  
};
var log_out = function()
{
    
     $.ajax({
            type: 'POST',
            url: 'REQ_LOGOUT',
            data:{username:$("#username").attr("value")},
            success: function (msg) {
                console.log(msg.url);
                if(msg.response === "7001:SUCCESS_REQUEST")
                {
                      $(".log-in-pop-up-container").css("display","block");
                      $(".log-out-pop-up-container").css("display", "none");
                      $(".pop-up-box-modal").css("display", "none");  
                                           
               }
               setTimeout(compleate_log_out, 1000,msg.url);
                
            }
         
     });
    
};
var close_log_out = function()
{
  $(".log-in-pop-up-container").css("display","block");
  $(".log-out-pop-up-container").css("display", "none");
  $(".pop-up-box-modal").css("display", "none");  
}
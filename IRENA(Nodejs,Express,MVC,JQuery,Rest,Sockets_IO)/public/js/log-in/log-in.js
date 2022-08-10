/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var page_refresh_4 = 0;
$(document).ready(function () {
    if(page_refresh_4 === 1)
    {
        page_refresh_4 = 0;
        return;
    }
   
    page_refresh_4 = 1;    
    
});
function Log_in_pop_up()
{       
    $(".pop-up-box-modal").css("display","block");
    $(".log-in-pop-up-container").css("display","block");
}

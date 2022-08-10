/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function () {
    var ip = $(".ip").attr("value");
    var port = $(".port").attr("value");
setTimeout(go_to_instance, 3000,ip,port);
});
function go_to_instance(ip,port)
{
   
    $('<a href="https://' + ip + ':' + port +'"></a>')[0].click();

} 
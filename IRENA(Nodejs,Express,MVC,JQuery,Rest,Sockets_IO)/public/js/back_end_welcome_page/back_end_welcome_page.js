/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function () {
    var port = $(".port").attr("value");
    var ip = $(".ip").attr("value");
    console.log(ip);
    $(".timer-container").css("z-index", "20");

    new Circlebar({
        element: "#circlebar"
    });

    $('.welcome-page-container').css('height', $(window).height());
    setTimeout(go_to_instance, 10000, ip, port);

});

function go_to_instance(ip, port)
{
     $('<a href="https://' + 'www.stacked-services.com' + ':' + port + '/REQ_SYSTEM_BENEFFITS_TOOL"></a>')[0].click();
}


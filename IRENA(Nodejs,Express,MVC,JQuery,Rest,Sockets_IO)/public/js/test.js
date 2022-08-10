/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var ip;
var port;
var username;
var test_object = new Test_Object();
function closeCredentials()
{
    $(".request-answer").text("");
    $(".log-in-username").val("");
    $(".log-in-password").val("");
    $(".pop-up-box-modal").css("display", "none");
}
function go_to_instance(ip,port,username)
{
    $('<a href="https://' + 'www.stacked-services.com' + ':' + port + '/REQ_SYSTEM_BENEFFITS_TOOL"></a>')[0].click();

}
var already_called = 0;
function getCredentials()
{ 
    if(already_called === 1)
    {
        already_called = 0;
        return;
    }
    already_called = 1;
    $(".request-answer").text("");
    $(".log-in-ok").attr("onclick", "");
    $(".log-in-cancel").attr("onclick", "");
    if ($(".log-in-username").val() === "")
    {
        $(".request-answer").text("");
        $(".request-answer").append("- Insert username");
        $(".log-in-ok").attr("onclick", "getCredentials()");
        $('.log-in-cancel').attr("onclick", "closeCredentials()");
        return;
    }
    if ($(".log-in-password").val() === "")
    {
        $(".request-answer").text("");
        $(".request-answer").append("- Insert password");
        $(".log-in-ok").attr("onclick", "getCredentials()");
        $('.log-in-cancel').attr("onclick", "closeCredentials()");
        return;
    }
    var credentials = {
        password: $(".log-in-password").val(),
        username: $(".log-in-username").val()
    };
    console.log(JSON.stringify(credentials));
    alert("request");
    $.post("https://www.stacked-services.com/REQ_GET_COMETS_CREDENTIALS", credentials,
            function (msg) {
                console.log(msg);
                $(".log-in-pop-up-container").html(msg);
                var json; 
                 switch (test_object.Test_Response(msg))
                {
                    case 0://null
                    {
                        console.log("NULL");
                        break;
                    }
                    case 1://undefined
                    {
                        console.log("UNDEFINED");
                        break;
                    }
                    case 2: // String
                    {
                        console.log("STRING");
                        
                        json = JSON.stringify(msg);
                        msg = JSON.parse(msg);
                        break;
                    }
                    case 3: //Array
                    {
                        console.log("ARRAY");                        
                        break;
                    }
                    case 4://Object
                    {
                        console.log("OBJECT");
                        
                        break;
                    }
                    default: // dont know
                        break;

                }
                var response;
                if(!(typeof msg.response === 'undefined'))
                {   
                   
                    console.log(" >> MSG VALID");
                    response = msg.response.toString().split(":");
                }
                else
                {
                    console.log(msg);
                    console.log(">> MSG ERROS");
                    $(".request-answer").append("- " + msg.toString());
                    $(".log-in-pop-up-container").css("display", "none");
                    $(".error-message-pop-up-container").css("display", "block");
                    $(".log-in-ok").attr("onclick", "getCredentials()");
                    $('.log-in-cancel').attr("onclick", "closeCredentials()");
                    return;
                }                
                if (response[1] === 'ERR_CREDENTIAL_INVALID')
                {
                    $(".request-answer").append("- Credentials are invalid");
                    $(".log-in-ok").attr("onclick", "getCredentials()");
                    $('.log-in-cancel').attr("onclick", "closeCredentials()");
                } else if (response[1] === "CREDENTIAL_ACCEPTED")
                {                               
                        $(".time-background-container").css("display", "block");
                        $(".timer-container").css("z-index", "20");
                        $(".pop-up-box-modal").css("display", "none");
                        new Circlebar({
                            element: "#circlebar"

                        });                  
                        
                        $('.welcome-page-container').css('height', $(window).height());
                        setTimeout(go_to_instance, 10000,msg.url,msg.port,msg.username);
                        console.log(msg);                 

                }else if(msg.response === "error")
                {
                   $(".request-answer").append("- " + JSON.stringify(msg));
                    $(".log-in-pop-up-container").css("display", "none");
                    $(".error-message-pop-up-container").css("display", "block");
                    $(".log-in-ok").attr("onclick", "getCredentials()");
                    $('.log-in-cancel').attr("onclick", "closeCredentials()"); 
                }else
                {
                    $(".request-answer").append("- " + msg);
                    $(".log-in-pop-up-container").css("display", "none");
                    $(".error-message-pop-up-container").css("display", "block");
                    $(".log-in-ok").attr("onclick", "getCredentials()");
                    $('.log-in-cancel').attr("onclick", "closeCredentials()");
                }
            }
    );
}


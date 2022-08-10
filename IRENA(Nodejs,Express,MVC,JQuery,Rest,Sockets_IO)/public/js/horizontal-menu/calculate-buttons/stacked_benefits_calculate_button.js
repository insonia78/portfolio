/*
 * Copyright 2018 Acelerex Inc.
 */
var page_refresh_12 = 0;
$(document).ready(function () {
    if (page_refresh_12 === 1)
    {
        page_refresh_12 = 0;
        return;
    }

    page_refresh_12 = 1;
    $('#stacked-benefits-btn').on("click", make_stacked_benefits_calculation);
});
var stacked_benefits_scenario;
var stacked_benefits_case;
var make_stacked_benefits_calculation = function ()
{
    console.log("make_stacked_benefits_calculation");
    if(!set_calculation_sequence_status("stacked_benefits_calculation"))
        return;
    set_all_buttons_to_disable_status();
    set_data_to_default_benefits_bucket_output_es_buckets_table();
    var makeRequest = {
        username: $("#username").attr("value"),
        scenario: $('.scenario-option').val(),
        case: $('.case-option').val()
    };
    stacked_benefits_scenario = $('.scenario-option').val();
    stacked_benefits_case = $('.case-option').val();
    if ($('.scenario-option').val() === "")
    {
        swal(" Missing scenario ", "", "error");
        return;
    }
    if ($('.case-option').val() === "")
    {
        swal(" Missing case ", "", "error");
        return;
    }
    
    $.ajax({
        type: 'POST',
        url: 'REQ_STACKED_BENEFITS_CALCULATION',
        data: makeRequest,
        success: function (msg) {
            if (api_session_handler(msg) === true)
                return;
            console.log(JSON.parse(msg));
            switch (test_object.Test_Response(msg))
            {
                case 0://null
                    display_pop_up(msg);
                    break;
                case 1://undefined
                    display_pop_up(msg);
                    break;
                case 2: // String
                    start_stacked_benefits_data_request(JSON.parse(msg));
                    break;
                case 3: //Array
                    start_stacked_benefits_data_request(msg);
                    break;
                case 4://Object
                    start_stacked_benefits_data_request(msg);
                    break;
                default: // dont know
                    break;
            }
        }
    });


};
var start_request_stacked_benefits_data_request = false;
var start_stacked_benefits_data_request = function (msg)
{

    console.log(" >> make_stacked_benefits_calculation " + msg.response);
    if (msg.response === "IN_PROGRESS")
    {   
        if (start_request_stacked_benefits_data_request === false)
        {
            //var response = "Scenario: " + msg.scenario
              //      + "\n Case: " + msg.case
               //     + "\n Calculation: STACK BENEFITS calc Started";
            //swal("Status: Started", response, "success");
            $(".last-run-text").text("");
            $(".last-run-text").text("STACKED BENEFITS");
            $(".status-text").text("");
            $(".status-text").text(msg.response);
            $('#busyanim').addClass('spinning');
        }
        start_request_stacked_benefits_data_request = true;
       

        var makeRequest = {
            username: $("#username").attr("value"),
            scenario: stacked_benefits_scenario,
            case: stacked_benefits_case
        };
        $.ajax({
            type: 'POST',
            url: 'REQ_STACKED_BENEFITS_DATA',
            data: makeRequest,
            success: function (msg) {
                //if(api_session_handler(msg) === true)
                //return;
                switch (test_object.Test_Response(msg))
                {
                    case 0://null
                        display_pop_up(msg);
                        break;
                    case 1://undefined
                        display_pop_up(msg);
                        break;
                    case 2: // String
                        setTimeout(start_stacked_benefits_data_request, 1000, JSON.parse(msg));
                        break;
                    case 3: //Array
                        setTimeout(start_stacked_benefits_data_request, 1000, msg);
                        break;
                    case 4://Object
                        setTimeout(start_stacked_benefits_data_request, 1000, msg);
                        break;
                    default: // dont know
                        break;

                }
            }
        });
    } else if (msg.response === "COMPLETE")
    {
        set_all_buttons_to_enable_status();
        set_output_data_benefits_bucket_output_es_buckets_table(msg);
        var response = "Scenario: " + msg.scenario
                + "\n Case: " + msg.case
                + "\n Calculation: Stacked Benefits";
        swal("Status: Complete", response, "success");
        $('.input-headings button').removeClass('active');
        $('.output-headings button').addClass('active');
        document.getElementById('inputs').style.display = "none";
        document.getElementById('outputs').style.display = 'block';
        start_request_stacked_benefits_data_request = false;
        $(".status-text").text("");
        $(".status-text").text(msg.response);
        $('#stacked-benefits-btn').css("background-color","#42f4b0");
        $('#busyanim').removeClass('spinning');
    } else
    {        
        swal("Error", JSON.stringify(msg), "error");
        start_request_stacked_benefits_data_request = false;
        set_all_buttons_to_enable_status();
        set_calculation_sequence_status_to_false("stacked_benefits_calculation");
        $('#busyanim').removeClass('spinning'); 
    }
};

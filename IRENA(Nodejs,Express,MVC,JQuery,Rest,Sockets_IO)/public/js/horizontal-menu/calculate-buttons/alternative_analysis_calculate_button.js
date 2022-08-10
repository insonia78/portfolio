/*
 * Copyright 2018 Acelerex Inc.
 */
var page_refresh_10 = 0;
$(document).ready(function () {
    if (page_refresh_10 === 1)
    {
        page_refresh_10 = 0;
        return;
    }

    page_refresh_10 = 1;
    $('#alternative-analysis-btn').on("click", make_alternative_analysis_calculation);
});
var alternative_analysis_scenario;
var alternative_analysis_case;
var make_alternative_analysis_calculation = function ()
{
    console.log("make_alternative_analysis_calculation");
    set_calculation_sequence_status("alternative_analysis_calculation");
    set_all_buttons_to_disable_status();
    var makeRequest = {
        username: $("#username").attr("value"),
        scenario: $('.scenario-option').val(),
        case: $('.case-option').val(),
        active_tab: $('.wrapper .io-tab').find('.active').attr('id')
    };
    alternative_analysis_scenario = $('.scenario-option').val();
    alternative_analysis_case = $('.case-option').val();
    if ($('.scenario-option').val() === "")
    {
        swal("Error", " Missing Scenario ", "error");
        return;
    }
    if ($('.case-option').val() === "")
    {
        swal("Error", "Missing Case", "error");
        return;
    }
    $.ajax({
        type: 'POST',
        url: 'REQ_ALTERNATIVE_ANALYSIS_CALCULATION',
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
                    start_alternative_analysis_data_request(JSON.parse(msg));
                    break;
                case 3: //Array
                    start_alternative_analysis_data_request(msg);
                    break;
                case 4://Object
                    start_alternative_analysis_data_request(msg);
                    break;
                default: // dont know
                    break;
            }
        }
    });


};
var start_request_alternative_analysis_data_request = false;
var start_alternative_analysis_data_request = function (msg)
{
    console.log(" >> start_alternative_analysis_data_request " + msg.response);
    if (msg.response === "IN_PROGRESS")
    {
        
        $('#alternative-analysis-btn').css('background-color', '#42f4b0');
        var makeRequest = {
            username: $("#username").attr("value"),
            scenario: alternative_analysis_scenario,
            case: alternative_analysis_case
        };

        if (start_request_alternative_analysis_data_request === false)
        {
//            var response = "Scenario: " + msg.scenario
//                    + "\n Case: " + msg.case
//                    + "\n Calculation: ALTERNATIVE ANALISYS calc Started";
//            swal("Status: Started", response, "success");
            $(".last-run-text").text("");
            $(".last-run-text").text("ALTERNATIVE ANALISYS");
            $(".status-text").text("");
            $(".status-text").text(msg.response);
            $("#busyanim").addClass('spinning');
        }
        start_request_alternative_analysis_data_request = true;

        
        var makeRequest = {
            username: $("#username").attr("value"),
            scenario: alternative_analysis_scenario,
            case: alternative_analysis_case
        };
        $.ajax({
            type: 'POST',
            url: 'REQ_ALTERNATIVE_ANALYSIS_DATA',
            data: makeRequest,
            success: function (msg) {
                if (api_session_handler(msg) === true)
                    return;

                switch (test_object.Test_Response(msg))
                {
                    case 0://null
                        display_pop_up(msg);
                        break;
                    case 1://undefined
                        display_pop_up(msg);
                        break;
                    case 2: // String
                        setTimeout(start_alternative_analysis_data_request, 1000, JSON.parse(msg));
                        break;
                    case 3: //Array
                        setTimeout(start_alternative_analysis_data_request, 1000, msg);
                        break;
                    case 4://Object
                        setTimeout(start_alternative_analysis_data_request, 1000, msg);
                        break;
                    default: // dont know
                        break;

                }
            }
        });
    } else if (msg.response === "COMPLETE")
    {
        set_all_buttons_to_enable_status();
       
        
        var response = "Scenario: " + msg.scenario
                + "\n Case: " + msg.case
                + "\n Calculation: Alternative Analysis";
        swal("Status: Complete", response, "success");
        console.log(msg);
        set_data_to_installed_capacity_output_es_cap_tables(msg);
        set_data_to_demand_side_output_installed_cap_tables(msg);
        set_data_to_energy_capacity_output_es_cap_tables(msg);
        set_data_to_hydro_generation_output_installed_cap_tables(msg);
        set_data_to_renewables_output_installed_cap_table(msg);
        set_data_to_thermal_generation_output_installed_cap_tables(msg);
        //no ess tables
        set_data_to_thermal_generation_output_installed_cap_noess_tables(msg);
        set_data_to_renewables_output_installed_cap_noess_table(msg);
        set_data_to_hydro_generation_output_installed_cap_noess_tables(msg);
        set_data_to_energy_capacity_output_noess_cap_tables(msg);
        set_data_to_demand_side_output_installed_cap_noess_tables(msg);
        set_data_to_installed_capacity_output_noess_cap_tables(msg);
        $('.input-headings button').removeClass('active');
        $('.output-headings button').addClass('active');
        document.getElementById('inputs').style.display = "none";
        document.getElementById('outputs').style.display = 'block';
        $(".status-text").text("");
        $(".status-text").text(msg.response);
        start_request_alternative_analysis_data_request = false;
        $("#alternative-analysis-btn").css("background-color", "#42f4b0");
        $('#busyanim').removeClass('spinning');
    } else
    {
        
        var response = "scenario: " + msg.scenario
                + "\n case: " + msg.case
                + "\n calculation: Alternative Analysis"
                + "\n status:" + msg.response;
        $('#busyanim').removeClass('spinning');
        swal("Error", response, "error");
        start_request_alternative_analysis_data_request = false;
        set_all_buttons_to_enable_status();
        set_calculation_sequence_status_to_false("alternative_analysis_calculation");
    }
};

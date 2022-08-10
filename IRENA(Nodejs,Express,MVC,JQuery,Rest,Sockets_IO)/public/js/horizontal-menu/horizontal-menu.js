/*
 * Copyright 2018 Acelerex Inc.
 */
// It holds the data received from the api for internal use of the application
var scenario_and_cases_data_bucket = new Scenario_and_Cases_data_bucket();
// it what type the response from the API is ex string array obj
var test_object = new Test_Object();
// holds the number of refresh performed from the broswer 
var page_refresh = 0;
// it holds the status of the table list if open or closed 
var table_list_is_active = false;
var scenario_option;
var case_option;
$(document).ready(function () {
    // prevent double refresh 
    if (page_refresh === 1)
    {
        page_refresh = 0;
        return;
    }
    page_refresh = 1;
    // variable from the scenario input datalist

    scenario_option = $(".scenario-menu-container").find(".scenario-option");
    case_option = $(".scenario-menu-container").find(".case-option");
    var scenario_data_list = $(".scenario-menu-container").find("#scenario");
    var case_data_list = $(".scenario-menu-container").find("#case");
    req_scenario_and_cases();
    //set_focus_on_inputs();
    set_data_to_default_values();


    // notes menu tab
    $('.tabs .tab-links a').on('click', function (e) {
        var currentAttrValue = $(this).attr('href');
        $(currentAttrValue).show().siblings().hide();
        $(this).parent('li').addClass('active').siblings().removeClass('active');
        e.preventDefault();
    });

    //clearing values on focus on the input box
    scenario_option.on('focus', function () {
        scenario_option.val("");
        case_option.val("");
        set_data_to_default_values();
        clear_notes();
        clear_case_options();

    });
    case_option.on('focus', function () {
        case_option.val("");
        set_data_to_default_values();
        clear_notes();

    });
    //clearing values on focus on the input box
    scenario_option.on('focus',set_scenario_focus );
    case_option.on('focus', set_case_focus);
    scenario_option.on('keypress', scenario_option_event);
    scenario_option.on("click", scenario_option_event);
    case_option.on('keypress', case_option_event);
    case_option.on("click", case_option_event);

});
var set_scenario_focus = function()
{
    scenario_option.val("");
        case_option.val("");
        set_data_to_default_values();
        clear_notes();
        clear_case_options();
};
var set_case_focus = function()
{
    scenario_option.click();
};

//Resetting the tables to default state
var set_data_to_default_values = function ()
{
    console.log("set_data_to_default_values");
    set_data_to_default_values_energy_storage_cost_dynamic_table();
    set_data_to_default_values_fuel_price_forecast_table();
    set_data_to_default_values_tech_capital_dynamic_table();
    set_data_to_default_values_programs_renewables_tables();
    set_data_to_default_values_programs_planning_criteria_table();
    set_data_to_default_values_demand_side_table();
    set_data_to_default_values_demand_table();
    set_data_to_default_values_generation_conventional_table();
    set_data_to_default_values_renewables_generation_hydro_table();
    set_data_to_default_values_generation_renewables_table();
    set_data_to_default_values_hydro_monthly_energy_table();
    set_data_to_default_values_energy_storage_dynamic_table();
    set_data_to_default_installed_capacity_output_es_cap_tables();
    set_data_to_default_demand_side_output_installed_cap_tables();
    set_data_to_default_energy_capacity_output_es_cap_tables();
    set_data_to_default_hydro_generation_output_installed_cap_tables();
    set_data_to_default_renewables_output_installed_cap_table();
    set_data_to_default_thermal_generation_output_installed_cap_tables();
    set_data_to_default_benefits_bucket_output_es_buckets_table();
    set_data_to_default_fuel_usage_output_installed_cap_tables();
    set_data_to_default_values_calculation_settings();
    set_data_to_default_inputs_for_existing_table();
    set_data_to_default_co_outputs_table();
    set_data_to_default_pc_outputs_table();
    set_data_to_default_pc_metrics_table();
    set_data_to_default_pc_metrics_noess_table();
    set_graphs_to_default();
    //noess
    set_data_to_default_installed_capacity_output_noess_cap_tables();
    set_data_to_default_demand_side_output_installed_cap_noess_tables();
    set_data_to_default_energy_capacity_output_noess_cap_tables();
    set_data_to_default_hydro_generation_output_installed_cap_noess_tables();
    set_data_to_default_renewables_output_installed_cap_noess_table();
    set_data_to_default_thermal_generation_output_installed_cap_noess_tables();
    set_data_to_default_fuel_usage_output_installed_noess_tables();
    //Clear button colors
    $('#alternative-analysis-btn').css('background-color','#28b1d6;');
    $('#production-cost-btn').css('background-color','#28b1d6;');
    $('#emulator-btn').css('background-color','#28b1d6;');
    $('#stacked-benefits-btn').css('background-color','#28b1d6;');
    
    //Clear download links
    $('#production-cost-download-link').removeAttr("href");
    $('#emulator-download-link').removeAttr("href");
    $('#production-cost-download-link-noess').removeAttr("href");
    $('#emulator-download-link-noess').removeAttr("href");
    
};

var wiki = function () {
    $.get('REQ_WIKI_PAGE', function (data) {

        if (typeof data === "undefined")
            alert(" missing wiki url ");
        else
        {
            console.log(data);
            $('<a href="' + data + '" target="_blank"></a>')[0].click();

        }
    });
};
var set_focus_on_inputs = function ()
{
    console.log("set_focus_on_inputs");
    set_focus_on_input_programs_renewables_tables();
    set_focus_on_input_programs_planning_criteria_table();
    set_focus_on_input_programs_demand_side_table();
    set_focus_on_input_demand_table();
    set_focus_on_input_generation_conventional_table();
    set_focus_on_input_generation_hydro_table();
    set_focus_on_input_hydro_monthly_energy_table();
    set_focus_on_generation_renewables_table();
    set_focus_on_input_energy_storage_dynamic_table();
    set_focus_on_input_tech_capital_dynamic_table();
    set_focus_on_input_fuel_price_forecast_table();
    set_focus_on_input_energy_storage_cost_dynamic_table();

};
var req_scenario_and_cases = function ()
{
    console.log("- REQ_PROJECTS_AND_RUNS >> Request");
    var _username = $("#username").attr("value");
    var request = {username: _username};
    $.post('REQ_PROJECTS_AND_RUNS', request,
            function (msg) {
                if (api_session_handler(msg) === true)
                    return;
                console.log("msg");
                console.log(msg);
                switch (test_object.Test_Response(msg))
                {
                    case 0://null
                    {
                        console.log("NULL");
                        display_pop_up(msg);
                        break;
                    }
                    case 1://undefined
                    {
                        console.log("UNDEFINED");
                        display_pop_up(msg);
                        break;
                    }
                    case 2: // String
                    {
                        console.log("STRING");
                        process_response_array(JSON.parse(msg));
                        break;
                    }
                    case 3: //Array
                    {
                        console.log("ARRAY");
                        process_response_array(msg);
                        break;
                    }
                    case 4://Object
                    {
                        console.log("OBJECT");
                        process_response_array(msg);
                        break;
                    }
                    default: // dont know
                        break;

                }
            });
};
var clear_case_options = function ()
{
    $(".scenario-menu-container").find("#case").empty();
};
var case_option_event = function ()
{

    var scenario_option = $(".scenario-menu-container").find(".scenario-option").val();
    var case_option = $(".scenario-menu-container").find(".case-option");

    var _case = $(".scenario-menu-container").find(".case-option").val();
    if (scenario_option === "")
    {
        console.log("empty " + _case);
        return;
    }

    if (typeof scenario_option === 'undefined')
    {
        display_pop_up("scenario is undefined");
        return;
    }

    if (_case === "")
    {
        console.log("case is undefined");
        return;
    }
    if (typeof _case === 'undefined')
    {
        display_pop_up("case is undefined");
        return;
    }
    $(".case-text").text("");
    $(".case-text").text(_case);
    console.log(_case + ">> Getting Notes");
    set_case_notes(scenario_option, _case);
    console.log(_case + ">> Getting Data");
    get_case_data(scenario_option, _case);
    console.log("Got case data");
    
};
var scenario_option_event = function ()
{
    console.log(" >>>  Calling scenario");
    console.log(" >> scenario_option_event");
    var scenario_option = $(".scenario-menu-container").find(".scenario-option");
    var scenario = scenario_option.val();
    if (table_list_is_active === true)
    {
        create_table_list_search_dinamically(scenario);
    }
    if (scenario === "")
    {
        console.log("scenario_option_event >> scenario is empty");
        return;
    }
    if (typeof scenario === 'undefined')
    {
        console.log("scenario_option_event >> scenario is undefined");
        return;
    }
    $(".scenario-text").text("");
    $(".scenario-text").text(scenario);
    set_case_option(scenario);
    set_scenario_notes(scenario);
};
var display_pop_up = function (msg)
{
    swal("", msg, "error");
};
var process_response_array = function (msg)
{
    console.log("process_response_array >> process_response_array");
    if (typeof msg.response === 'undefined')
    {
        console.log(">> MSG IS undefined");
        display_pop_up(msg.toString());
        return;
    }
    var response = msg.response.toString().split(":");
    console.log("respose" + response);
    if (response[1] === 'SUCCESS_REQUEST')
    {
        console.log(' - REQ_PROJECTS_AND_RUNS >> Setting Projects and Runs');

        set_scenario_list(msg.scenario);
    } else
    {
        display_pop_up(msg.response);
        //api_session_handler(msg);
    }
};
/*
 * setting notes for scenario
 * @param {type} scenario
 * @returns {undefined}
 */
var set_scenario_notes = function (scenario)
{
    var temp = $(".scenario-menu-container").find(".select-editable-notes-container");
    temp.find(".scenario-notes").val("");
    console.log("set_scenario_notes >> Setting scenario notes");
    var scenario_notes = scenario_and_cases_data_bucket.getScenarioNotes(scenario);
    console.log("scenario_notes" + scenario_notes);
    var temp = $(".scenario-menu-container").find(".select-editable-notes-container");
    temp.find(".scenario-notes").val(scenario_notes);
    temp.find('.scenario-notes-tab')[0].click();
};
var clear_notes = function ()
{
    console.log(">> Clearing scenario notes");
    var temp = $(".scenario-menu-container").find(".select-editable-notes-container");
    temp.find(".select-editable-notes").val("");
    temp.find('.scenario-notes-tab')[0].click();
};
var set_case_notes = function (scenario, _case)
{
    var temp = $(".scenario-menu-container").find(".select-editable-notes-container");
    temp.find(".case-notes").val("");
    console.log("set_case_notes >> Setting case notes");
    var case_notes = scenario_and_cases_data_bucket.getCaseNotes(scenario, _case);
    console.log("case_notes " + case_notes);
    temp.find(".case-notes").val(case_notes);
    temp.find('.case-notes-tab')[0].click();
};
var get_case_data = function (scenario, _case)
{
    console.log("getcasedata-------------"+scenario);
    var response = scenario_and_cases_data_bucket.getCaseData(scenario, _case);
    
    $.ajax({
       url:'/REQ_CHECK_ZIP_EXISTS',
       type:'GET',
       data:{scenarios_and_cases_row_id:response.scenarios_and_cases_row_id},
       success: function(msg)
       {
           if(msg.PC_ZIP)
             $('#production-cost-download-link').attr("href","/REQ_PROD_DOWNLOAD/?scenarios_and_cases_row_id=" + response.scenarios_and_cases_row_id);
           if(msg.EM_ZIP) 
             $('#emulator-download-link').attr("href","/REQ_EM_DOWNLOAD/?scenarios_and_cases_row_id=" + response.scenarios_and_cases_row_id);
           if(msg.PC_NOESS_ZIP) 
             $('#production-cost-download-link-noess').attr("href","/REQ_PROD_NOESS_DOWNLOAD/?scenarios_and_cases_row_id=" + response.scenarios_and_cases_row_id);
           if(msg.EM_NOESS_ZIP) 
             $('#emulator-download-link-noess').attr("href","/REQ_EM_NOESS_DOWNLOAD/?scenarios_and_cases_row_id=" + response.scenarios_and_cases_row_id);
       }
    });
    //Set download link according to scenario and case
    
    
    if (response !== -1)
    {
        var date_array = [];
        console.log("get_case_data >> getting data from bucket");
        console.log(response);
        $(".created-on-text").text("");
        $(".created-on-text").text(response.date);
        $(".last-modified-text").text("");
        $(".last-modified-text").text(response.modification_date);
        if (response.alternative_analysis_calculation_status === "COMPLETE")
        {
            var calc_date = {};
            set_calculation_sequence_status("alternative_analysis_calculation");
            $("#alternative-analysis-btn").css("background-color", "#42f4b0");
            calc_date.type = "ALTERANTIVE ANALYSIS";
            calc_date.date = response.alternative_analysis_calculation_date;
            date_array.push(calc_date);
        }
         if (response.production_cost_calculation_status === "COMPLETE")
        {
            var calc_date = {};
            set_calculation_sequence_status("production_cost_calculation"); 
            $("#production-cost-btn").css("background-color", "#42f4b0");
            calc_date.type = "PRODUCTION COST";
            calc_date.date = response.production_cost_calculation_date;
            date_array.push(calc_date);
        }
        if (response.stacked_benefits_calculation_status === "COMPLETE")
        {
            var calc_date = {};
            set_calculation_sequence_status("stacked_benefits_calculation");
            $("#stacked-benefits-btn").css("background-color", "#42f4b0");
            
            calc_date.type = "STACKED BENEFITS";
            calc_date.date = response.stacked_benefits_calculation_date;
            date_array.push(calc_date);
        }
        if (response.emulator_calculation_status === "COMPLETE")
        {
            var calc_date = {};
            set_calculation_sequence_status("emulator_calculation");
            $("#emulator-btn").css("background-color", "#42f4b0");
            calc_date.type = "EMULATOR";
            calc_date.date = response.emulator_calculation_date;
            date_array.push(calc_date);
        }
        var swapped;
        do {
            swapped = false;
            for (var i = 0; i < date_array.length - 1; i++) {
                if (date_array[i].date > date_array[i + 1].date) {
                    var temp = date_array[i];
                    date_array[i] = date_array[i + 1];
                    date_array[i + 1] = temp;
                    swapped = true;
                }
            }
        } while (swapped);
        if (date_array.length > 0)
        {
            $(".status-text").text("COMPLETE");
            $(".last-run-text").text(date_array[date_array.length - 1].type);
        }
    }
    console.log("get_case_data >> getting data from database");
    var _username = $("#username").attr("value");
    var reqBody = {username: _username, scenario: scenario, case: _case};
    console.log(JSON.stringify(reqBody));
    $.ajax(
            {
                type: 'POST',
                url: 'REQ_GET_RUN_DATA',
                data: reqBody,
                success: function (msg) {
                    
                    console.log(" >> getting data");
                    if (api_session_handler(msg) === true)
                        return;
                    if (msg.response === "7001:SUCCESS_REQUEST") {
                        switch (test_object.Test_Response(msg))
                        {
                            case 0://null
                                display_pop_up(msg);
                                break;
                            case 1://undefined
                                display_pop_up(msg);
                                break;
                            case 2: // String
                                display_pop_up(msg);
                                break;
                            case 3: //Array
                                bind_case_data(msg);
                                break;
                            case 4://Object
                                bind_case_data(msg);
                                break;
                            default: // dont know
                                break;

                        }
                    } else
                    {
                        swal("Error", "Run was not saved\n" + JSON.stringify(msg.response)
                                + "\n" + JSON.stringify(msg.error), "error");
                    }
                }
            });
};
var bind_case_data = function (msg)
{
    console.log("bind_case_data >> bind");
    if (typeof msg.response === 'undefined')
    {
        display_pop_up(msg);
        return;
    }
    var response = msg.response.toString().split(":");
    if (response[1] === 'SUCCESS_REQUEST')
    {
        console.log(' - REQ_PROJECTS_AND_RUNS >> Setting Projects and Runs');
        //console.log(JSON.stringify(msg));
        //$('.created-on-text').text(msg.date);
        //$('.last-modified-text').text(msg.modification_date);
        bind_case_inputs(msg);
    } else
    {
        display_pop_up(msg);
    }
};
var set_scenario_list = function (values)
{
    if (typeof values === 'undefined')
    {
        console.log('scenario and cases are undefined');
        return;
    }
    console.log("set_scenario_list >> Setting Scenario Options");
    scenario_and_cases_data_bucket.setBucket(values);
    var scenario_list = $(".scenario-menu-container").find("#scenario");
    scenario_list.empty();
         
    for (var i = 0; i < values.length; i++)
    {
        console.log(i+":"+values[i].cases.length);
        scenario_and_cases_data_bucket.QuickSortCases(values[i]);      
        scenario_list.append("<option value='" + values[i].scenario + "' >"
                + values[i].cases.length + "</option>");
    }

};
var set_case_option = function (scenario)
{
    console.log("set_case_option >> Inserting Cases");

    if (typeof scenario === 'undefined')
    {
        console.log(">> scenario is undefined");
        return;
    }

    $(".scenario-menu-container").find("#case").empty();
    var cases = scenario_and_cases_data_bucket.getCases(scenario);
    if (cases === -1)
    {
        console.log(">> cases are empty");
        return;
    }
    for (var i = 0; i < cases.length; i++)
    {

        $(".scenario-menu-container").find("#case").append("<option value='" + cases[i].case + "' >"
                + cases[i].date + "</option>");
    }

};
var bind_case_inputs = function (inputs) {
    console.log(" >> bind_case_inputs");
    var scenario = inputs.scenario;
    var _case = inputs.case;
    
    scenario_and_cases_data_bucket.setCaseData(scenario, _case, inputs);
    console.log(scenario_and_cases_data_bucket.bucket);
    set_data_to_country(inputs);
    set_data_to_programs_renewables_tables(inputs);
    set_data_to_programs_planning_criteria_table(inputs);
    set_data_to_programs_programs_demand_side_table(inputs);
    set_data_to_demand_table(inputs);
    set_data_to_generation_conventional_table(inputs);
    set_data_to_generation_hydro_table(inputs);
    set_data_to_generation_renewables_table(inputs);
    set_data_to_hydro_monthly_energy_table(inputs);
    set_data_to_energy_storage_dynamic_table(inputs);
    set_data_to_programs_planning_criteria_table(inputs);
    set_data_to_energy_storage_cost_dynamic_table(inputs);
    set_data_to_tech_capital_dynamic_table(inputs);
    set_data_to_fuel_price_forecast_table(inputs);
    set_data_to_installed_capacity_output_es_cap_tables(inputs);
    set_data_to_installed_capacity_output_noess_cap_tables(inputs);
    set_data_to_demand_side_output_installed_cap_tables(inputs);
    set_data_to_demand_side_output_installed_cap_noess_tables(inputs);
    set_data_to_energy_capacity_output_es_cap_tables(inputs);
    set_data_to_energy_capacity_output_noess_cap_tables(inputs);
    set_data_to_hydro_generation_output_installed_cap_tables(inputs);
    set_data_to_hydro_generation_output_installed_cap_noess_tables(inputs);
    set_data_to_renewables_output_installed_cap_table(inputs);
    set_data_to_renewables_output_installed_cap_noess_table(inputs);
    set_data_to_thermal_generation_output_installed_cap_tables(inputs);
    set_output_data_inputs_for_existing_table(inputs);
    set_output_data_pc_metrics_table(inputs);
    set_output_data_pc_metrics_noess_table(inputs);
    set_data_to_thermal_generation_output_installed_cap_noess_tables(inputs);
    set_output_data_benefits_bucket_output_es_buckets_table(inputs);
    set_output_data_fuel_usage_output_installed_cap_tables(inputs);
    set_output_data_fuel_usage_output_installed_cap_noess_tables(inputs);
    
    set_data_to_calculation_settings(inputs);
    console.log("Completed inserting into calculation settings table");
    if (Object.keys(inputs.production_cost_output_files).length  > 0)
        getProdCsvFiles(inputs);
    if (Object.keys(inputs.emulator_output_files).length > 0)
        getEMCsvFiles(inputs);
    
    //update inputcharts
    //updateCapbyFuelChart('generation-cap-fuel');
    updateHydroGraph();

};
var redirect_to_log_in_page = function (url)
{
    console.log(">> redirect_to_log_in_page");
    $('<a href="' + url + '" ></a>')[0].click();
};
var api_session_handler = function (api_response)
{
    console.log(">> api_session_handler");
    if (api_response.response === "INVALID_OPERATION")
    {
        console.log("inside");
        setTimeout(redirect_to_log_in_page, 1000, api_response.url);
        return true;
    }
    if (api_response.response === "1000:ERR_INVALID_SESSION")
    {
        console.log("inside");
        setTimeout(redirect_to_log_in_page, 2000, api_response.url);
        return true;
    }
    if (api_response.response === "2000:ERR_EXPIRED_SESSION")
    {
        var data = {};
        data.scenario = $('.scenario-option').val();
        data.case = $('.case-option').val();
        data.scenario_notes = $('.scenario-notes').val();
        data.case_notes = $('.case-notes').val();
        get_data_from_demand_table(data);
        get_data_from_thermal_generation_parameters_table(data);
        get_data_from_existing_storage_dynamic_table(data);
        get_data_from_generation_hydro_monthly_energy_table(data);
        get_data_from_generation_hydro_table(data);
        get_data_from_generation_programs_renewables_tables_table(data);
        get_data_from_macro_economic_table(data);
        get_data_from_programs_demand_parameters_table(data);
        get_data_from_reserves_table(data);
        get_data_from_gen_by_fuel_dynamic_table(data);
        get_data_from_existing_storage_dynamic(data);
        get_data_from_calculation_settings(data);
        force_save_to_api(data);
        return true;
    }
    return false;
};
var force_save_to_api = function (data)
{
    console.log("force_save_to_api");
    $.ajax({
        type: 'POST',
        url: 'REQ_FORCE_SAVE_DATA',
        data: data,
        success: function (msg) {

            setTimeout(redirect_to_log_in_page, 2000, msg.response.url);

        }});

};

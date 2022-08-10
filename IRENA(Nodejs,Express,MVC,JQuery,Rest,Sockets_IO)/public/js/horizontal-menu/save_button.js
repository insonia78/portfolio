/*
 * Copyright 2018 Acelerex Inc.
 */
var page_refresh_1 = 0;
var save_button;
$(document).ready(function () {
    if (page_refresh_1 === 1)
    {
        page_refresh_1 = 0;
        return;
    }
    page_refresh_1 = 1;
    save_button = $('#save-btn');
    save_button.on("click", save_button_ajax_call);

});
var save_button_ajax_call = function () {
    console.log("save button pressed");
    save_button.off("click", save_button_ajax_call);
    if (validate_inputs() === 0) {

        var data = {data: []};
        get_data_to_save(data);
        scenario_and_cases_data_bucket.setToTempBucket(data);
        console.log(JSON.stringify("data:" + data));
        $.ajax(
                {
                    type: 'POST',
                    url: 'REQ_SAVE_DATA',
                    data: data,
                    success: function (msg) {
                        console.log(msg);

                        if (api_session_handler(msg) === true)
                            return;
                        reset_calculation_sequence();
                        if (msg.response === "7001:SUCCESS_REQUEST") {

                            swal("Data Saved", "", "success");
                            scenario_and_cases_data_bucket.setDataToBucket(msg.scenario, msg.case);
                            set_scenario_list(scenario_and_cases_data_bucket.bucket);
                            $("#production-cost-btn").css("background-color", "#28b1d6");
                            $("#alternative-analysis-btn").css("background-color", "#28b1d6");
                            $("#stacked-benefits-btn").css("background-color", "#28b1d6");
                            $("#emulator-btn").css("background-color", "#28b1d6");
                            $(".last-modified-text").text("");
                            $(".last-modified-text").text(msg.modification_date);
                            $(".status-text").text("");
                            $(".last-run-text").text("");
                            set_data_to_default_installed_capacity_output_es_cap_tables();
                            set_data_to_default_demand_side_output_installed_cap_tables();
                            set_data_to_default_energy_capacity_output_es_cap_tables();
                            set_data_to_default_hydro_generation_output_installed_cap_tables();
                            set_data_to_default_renewables_output_installed_cap_table();
                            set_data_to_default_thermal_generation_output_installed_cap_tables();
                            set_data_to_default_benefits_bucket_output_es_buckets_table();
                            set_data_to_default_fuel_usage_output_installed_cap_tables();
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

                        } else {
                            scenario_and_cases_data_bucket.DeleteFromTempBucket(msg.scenario, msg.case);
                            swal("Error", "Run was not saved\n" + JSON.stringify(msg.response)
                                    + "\n" + JSON.stringify(msg.error), "error");
                        }
                    }
                }
        ).always(function () {
            console.log('Start to update project run !!!');
            save_button.on("click", save_button_ajax_call);
        });


    } else {
        console.log("save aborted");
        save_button.on("click", save_button_ajax_call);
    }
};
var validate_inputs = function ()
{
    test_input_data_error = 0;
    if ($('.scenario-option').val() === "")
    {
        swal("Missing scenario", "", "error");
        return 1;
    }
    if ($('.case-option').val() === "")
    {
        swal("Missing case", "", "error");
        return 1;
    }
    if ($("#country").val() === "" || $("#country").val() === "Select a country")
    {
        swal("Missing Country", "", "error");
        return 1;
    }
    test_input_data_programs_renewables_tables();
    console.log("1");
    test_input_data_programs_planning_criteria();
    console.log("2");
    test_input_data_generation_renewables_table();
    console.log("3");
    test_input_data_demand_table();
    console.log("4");
    test_input_data_generation_conventional_table();
    console.log("5");
    test_input_data_generation_hydro_table();
    console.log("6");
    test_input_data_hydro_monthly_energy_table();
    console.log("7");
    test_input_data_energy_storage_dynamic_table();
    console.log("8");
    test_input_data_fuel_price_forecast_table();
    console.log("9");
    test_input_data_tech_capital_dynamic_table();
    console.log("10");
    test_input_energy_storage_cost_dynamic_table();
    console.log("11");
    test_input_data_programs_demand_side_table();
    console.log("12");
    if (test_input_data_error > 0)
        swal("Error", " You have errors in the fields ", "error");

    return test_input_data_error;

};
function get_data_to_save(valuationData) {
    console.log(">> start get Data From Tables");

    valuationData.username = $("#username").attr("value");
    valuationData.scenario = $('.scenario-option').val();
    valuationData.case = $('.case-option').val();
    valuationData.scenario_notes = $('.scenario-notes').val();
    valuationData.case_notes = $('.case-notes').val();
    get_data_from_country(valuationData);
    get_data_from_fuel_price_forecast_table(valuationData);
    get_data_from_tech_capital_dynamic_table(valuationData);
    get_data_from_energy_storage_cost_dynamic_table(valuationData);
    get_data_from_programs_renewables_table(valuationData);
    get_data_from_programs_planning_criteria_table(valuationData);
    get_data_from_programs_demand_side_table(valuationData);
    get_data_from_demand_table(valuationData);
    get_data_from_generation_conventional_table(valuationData);
    get_data_from_generation_hydro_table(valuationData);
    get_data_from_hydro_monthly_energy_table(valuationData);
    get_data_from_generation_renewables_table(valuationData);
    get_data_from_energy_storage_dynamic_table(valuationData);
    get_data_from_calculation_settings(valuationData);
    console.log(valuationData);
    console.log(">> finish get Data From Tables");

}


function populateResponse(response) {
    console.log(response);

    $('#P_cap_es_200C').html(Math.round(response.P_cap_es_200C * 100) / 100);
    $('#E_cap_es_200C').html(Math.round(response.E_cap_es_200C * 100) / 100);
    $('#P_cap_es_100C').html(Math.round(response.P_cap_es_100C * 100) / 100);
    $('#E_cap_es_100C').html(Math.round(response.E_cap_es_100C * 100) / 100);
    $('#P_cap_es_050C').html(Math.round(response.P_cap_es_050C * 100) / 100);
    $('#E_cap_es_050C').html(Math.round(response.E_cap_es_050C * 100) / 100);
    $('#P_cap_es_025C').html(Math.round(response.P_cap_es_025C * 100) / 100);
    $('#E_cap_es_025C').html(Math.round(response.E_cap_es_025C * 100) / 100);
}

//function validate_data(response) {
//  console.log("validating");
//
//  var string_to_validate = "";
//  var year2_required = false;
//
//  // this is a temp fix to disallow client user from changing the base runs
//  username = $('#username').val();
//  project = $('.scenario-option').val();
//  run = $('.case-option').val();
//  if ((username == "client") && (run == "1")) {
//    swal("", "Cannot modify run 1. Save as a new run number", "error");
//    return false;
//  }
//
//  string_to_validate = ($('.scenario-option').val());
//  if (!(validate_field(string_to_validate, "string"))) {
//    $('.scenario-option').focus();
//    swal("", "Invalid value for Project", "error");
//    return false;
//  }
//  string_to_validate = ($('.case-option').val());
//  if (!(validate_field(string_to_validate, "string"))) {
//    $('.case-option').focus();
//    swal("", "Invalid value for Run", "error");
//    return false;
//  }
//  string_to_validate = ($('#country').val());
//  if (!(validate_field(string_to_validate, "string"))) {
//    $('#country').focus();
//    swal("", "Invalid value for Country", "error");
//    return false;
//  }
//  string_to_validate = ($('#eneffpower').val());
//  if (isNaN(string_to_validate)) {
//    $('#eneffpower').focus();
//    swal("", "Invalid value for Energy Efficiency Power(MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#eneffeng').val());
//  if (isNaN(string_to_validate)) {
//    $('#eneffeng').focus();
//    swal("", "Invalid value for Energy Efficiency Energy(MWh)", "error");
//    return false;
//  }
//  string_to_validate = ($('#eneffcost').val());
//  if (isNaN(string_to_validate)) {
//    $('#eneffcost').focus();
//    swal("", "Invalid value for Energy Efficiency Cost($/MWh)", "error");
//    return false;
//  }
//  string_to_validate = ($('#demrespower').val());
//  if (isNaN(string_to_validate)) {
//    $('#demrespower').focus();
//    swal("", "Invalid value for Demand Response Power(MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#demreseng').val());
//  if (isNaN(string_to_validate)) {
//    $('#demreseng').focus();
//    swal("", "Invalid value for Demand Response Energy(MWh)", "error");
//    return false;
//  }
//  string_to_validate = ($('#demrescost').val());
//  if (isNaN(string_to_validate)) {
//    $('#demrescost').focus();
//    swal("", "Invalid value for Demand Response Cost($/MWh)", "error");
//    return false;
//  }
//  string_to_validate = ($('#distpvpower').val());
//  if (isNaN(string_to_validate)) {
//    $('#distpvpower').focus();
//    swal("", "Invalid value for Distributed PV Power(MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#distpveng').val());
//  if (isNaN(string_to_validate)) {
//    $('#distpveng').focus();
//    swal("", "Invalid value for Distributed PV Energy(MWh)", "error");
//    return false;
//  }
//  string_to_validate = ($('#distpvcost').val());
//  if (isNaN(string_to_validate)) {
//    $('#distpvcost').focus();
//    swal("", "Invalid value for Distributed PV Cost($/MWh)", "error");
//    return false;
//  }
//  string_to_validate = ($('#windcappol1').val());
//  if (isNaN(string_to_validate)) {
//    //    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#windcappol1').focus();
//    swal("", "Invalid value for Wind Capacity Year 1 (MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#windcappol2').val());
//  if (isNaN(string_to_validate)) {
//    $('#windcappol2').focus();
//    swal("", "Invalid value for Wind Capacity Year 2 (MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#windcost').val());
//  if (isNaN(string_to_validate)) {
//    $('#windcost').focus();
//    swal("", "Invalid value for Wind Cost ($/MWh)", "error");
//    return false;
//  }
//  string_to_validate = ($('#solarcappol1').val());
//  if (isNaN(string_to_validate))
//  //    if (!(validate_field(string_to_validate, "float", -1, 10000000))) 
//  {
//    $('#solarcappol1').focus();
//    swal("", "Invalid value for Solar Capacity Year 1 (MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#solarcappol2').val());
//  if (isNaN(string_to_validate)) {
//    $('#solarcappol2').focus();
//    swal("", "Invalid value for Solar Capacity Year 2 (MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#solarcost').val());
//  if (isNaN(string_to_validate)) {
//    $('#solarcost').focus();
//    swal("", "Invalid value for Solar Cost ($/MWh)", "error");
//    return false;
//  }
//  string_to_validate = ($('#demandprofile1 select').val());
//  if (!(validate_field(string_to_validate, "string"))) {
//    $('#demandprofile1').focus();
//    swal("", "Invalid value for Demand Profile 1st Year", "error");
//    return false;
//  }
//
//  //  if (!(validate_field(string_to_validate, "string"))) {
//  //      $('#demandprofile2').focus();
//  //      swal("", "Invalid value for Demand Profile 2nd Year", "error");
//  //      return false;
//  //  }
//  string_to_validate = ($('#inputpeak1').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#inputpeak1').focus();
//    swal("", "Invalid value for Peak Electricity Demand 1st Year", "error");
//    return false;
//  }
//  string_to_validate = ($('#inputpeak2').val());
//  if (isNaN(string_to_validate)) {
//    $('#inputpeak2').focus();
//    swal("", "Invalid value for Peak Electricity Demand 2nd Year", "error");
//    return false;
//  }
//  string_to_validate = ($('#inputenergy1').val());
//  //    if (!(validate_field(string_to_validate, "float", -1, 10000000))) 
//  if (isNaN(string_to_validate)) {
//    $('#inputenergy1').focus();
//    swal("", "Invalid value for Annual Energy Demand 1st Year", "error");
//    return false;
//  }
//  string_to_validate = ($('#inputenergy2').val());
//  if (isNaN(string_to_validate)) {
//    $('#inputenergy_yr2').focus();
//    swal("", "Invalid value for Annual Energy Demand 2nd Year", "error");
//    return false;
//  }
//  string_to_validate = ($('#peakdemgrowrt1').val());
//  if (isNaN(string_to_validate)) {
//    $('#peakdemgrowrt1').focus();
//    swal("", "Invalid value for Peak Demand Growth Rate 1st Year", "error");
//    return false;
//  }
//  string_to_validate = ($('#peakdemgrowrt2').val());
//  if (isNaN(string_to_validate)) {
//    $('#peakdemgrowrt2').focus();
//    swal("", "Invalid value for Peak Demand Growth Rate 2nd Year", "error");
//    return false;
//  }
//
//  string_to_validate = ($('#energydemgrowrt1').val());
//  if (isNaN(string_to_validate)) {
//    $('#energydemgrowrt1').focus();
//    swal("", "Invalid value for Energy Growth Rate 1st Year", "error");
//    return false;
//  }
//
//  string_to_validate = ($('#windcap1').val());
//  //    if (isNaN(string_to_validate)) 
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#windcap1').focus();
//    swal("", "Invalid value for Wind Installed Capacity Year 1", "error");
//    return false;
//  }
//
//  string_to_validate = ($('#windcap2').val());
//  if (isNaN(string_to_validate))
//  //    if (!(validate_field(string_to_validate, "float", -1, 10000000))) 
//  {
//    $('#windcap2').focus();
//    swal("", "Invalid value for Wind Installed Capacity Year 2", "error");
//    return false;
//  }
//
//
//  string_to_validate = ($('#basewind select').val()); //modified by J
//  if (!(validate_field(string_to_validate, "string"))) {
//    $('#basewind').focus();
//    swal("", "Invalid value for Wind Profile (%)", "error");
//    return false;
//  }
//
//  string_to_validate = ($('#solarcap1').val());
//  //    if (isNaN(string_to_validate)) 
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#solarcap1').focus();
//    swal("", "Invalid value for Solar Installed Capacity Year 1", "error");
//    return false;
//  }
//  string_to_validate = ($('#solarcap2').val());
//  if (isNaN(string_to_validate))
//  //    if (!(validate_field(string_to_validate, "float", -1, 10000000))) 
//  {
//    $('#solarcap2').focus();
//    swal("", "Invalid value for Solar Installed Capacity Year 2", "error");
//    return false;
//  }
//  string_to_validate = ($('#basesolar select').val()); //modified by J
//  if (!(validate_field(string_to_validate, "string"))) {
//    $('#basesolar').focus();
//    swal("", "Invalid value for Solar Profile (%)", "error");
//    return false;
//  }
//  string_to_validate = ($('#windpeakcap').val());
//  if (!(validate_field(string_to_validate, "float", -1, 100))) {
//    $('#windpeakcap').focus();
//    swal("", "Invalid value for Wind Cap at Peak (%)", "error");
//    return false;
//  }
//  string_to_validate = ($('#solarpeakcap').val());
//  if (isNaN(string_to_validate)) {
//    $('#solarpeakcap').focus();
//    swal("", "Invalid value for Solar Cap at Peak (%)", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng1_1').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydroEng1_1').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 1 (GWh) Jan", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng1_2').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydroEng1_2').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 1 (GWh) Feb", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng1_3').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydroEng1_3').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 1 (GWh) Mar", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng1_4').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydroEng1_4').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 1 (GWh) Apr", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng1_5').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydroEng1_5').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 1 (GWh) May", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng1_6').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydroEng1_6').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 1 (GWh) Jun", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng1_7').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydroEng1_7').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 1 (GWh) Jul", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng1_8').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydroEng1_8').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 1 (GWh) Aug", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng1_9').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydroEng1_9').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 1 (GWh) Sep", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng1_10').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydroEng1_10').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 1 (GWh) Oct", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng1_11').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydroEng1_11').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 1 (GWh) Nov", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng1_12').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydroEng1_12').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 1 (GWh) Dec", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng2_1').val());
//  if (isNaN(string_to_validate)) {
//    $('#hydroEng2_1').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 2 (GWh) Jan", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng2_2').val());
//  if (isNaN(string_to_validate)) {
//    $('#hydroEng2_2').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 2 (GWh) Feb", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng2_3').val());
//  if (isNaN(string_to_validate)) {
//    $('#hydroEng2_3').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 2 (GWh) Mar", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng2_4').val());
//  if (isNaN(string_to_validate)) {
//    $('#hydroEng2_4').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 2 (GWh) Apr", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng2_5').val());
//  if (isNaN(string_to_validate)) {
//    $('#hydroEng2_5').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 2 (GWh) May", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng2_6').val());
//  if (isNaN(string_to_validate)) {
//    $('#hydroEng2_6').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 2 (GWh) Jun", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng2_7').val());
//  if (isNaN(string_to_validate)) {
//    $('#hydroEng2_7').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 2 (GWh) Jul", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng2_8').val());
//  if (isNaN(string_to_validate)) {
//    $('#hydroEng2_8').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 2 (GWh) Aug", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng2_9').val());
//  if (isNaN(string_to_validate)) {
//    $('#hydroEng2_9').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 2 (GWh) Sep", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng2_10').val());
//  if (isNaN(string_to_validate)) {
//    $('#hydroEng2_10').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 2 (GWh) Oct", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng2_11').val());
//  if (isNaN(string_to_validate)) {
//    $('#hydroEng2_11').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 2 (GWh) Nov", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydroEng2_12').val());
//  if (isNaN(string_to_validate)) {
//    $('#hydroEng2_12').focus();
//    swal("", "Invalid value for Hydro Monthly Energy Year 2 (GWh) Dec", "error");
//    return false;
//  }
//  string_to_validate = ($('#hypmax1').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hypmax1').focus();
//    swal("", "Invalid value for Hydro Capacity Year 1 (MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#hypmax2').val());
//  if (isNaN(string_to_validate)) {
//    $('#hypmax2').focus();
//    swal("", "Invalid value for Hydro Capacity Year 2 (MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydrores1').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydrores1').focus();
//    swal("", "Invalid value for Hydro 1st Reserve Cost ($/MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydrores2').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydrores2').focus();
//    swal("", "Invalid value for Hydro 2nd Reserve Cost ($/MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#hydrores3').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#hydrores3').focus();
//    swal("", "Invalid value for Hydro 3rd Reserve Cost ($/MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#p_reserves').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#p_reserves').focus();
//    swal("", "Invalid value for Primary Reserves Provision (MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#s_reserves').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#s_reserves').focus();
//    swal("", "Invalid value for Secondary Reserves Provision (MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#t_reserves').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#t_reserves').focus();
//    swal("", "Invalid value for Tertiary Reserves Provision (MW)", "error");
//    return false;
//  }
//  string_to_validate = ($('#esrt2c').val());
//  if (isNaN(string_to_validate)) {
//    $('#esrt2c').focus();
//    swal("", "Invalid value for Round Trip Efficiency Short Duration(2C)", "error");
//    return false;
//  }
//  string_to_validate = ($('#esrt1c').val());
//  if (isNaN(string_to_validate)) {
//    $('#esrt1c').focus();
//    swal("", "Invalid value for Round Trip Efficiency 1C", "error");
//    return false;
//  }
//  string_to_validate = ($('#esrt5c').val());
//  if (isNaN(string_to_validate)) {
//    $('#esrt5c').focus();
//    swal("", "Invalid value for Round Trip Efficiency 0.5C", "error");
//    return false;
//  }
//  string_to_validate = ($('#esrt25c').val());
//  if (isNaN(string_to_validate)) {
//    $('#esrt25c').focus();
//    swal("", "Invalid value for Round Trip Efficiency 0.25C", "error");
//    return false;
//  }
//  string_to_validate = ($('#escost2c').val());
//  if (isNaN(string_to_validate)) {
//    $('#esrt2c').focus();
//    swal("", "Invalid value for Intallation Cost Short Duration(2C)", "error");
//    return false;
//  }
//  string_to_validate = ($('#escost1c').val());
//  if (isNaN(string_to_validate)) {
//    $('#escost1c').focus();
//    swal("", "Invalid value for Intallation Cost 1C", "error");
//    return false;
//  }
//  string_to_validate = ($('#escost5c').val());
//  if (isNaN(string_to_validate)) {
//    $('#escost5c').focus();
//    swal("", "Invalid value for Intallation Cost 0.5C", "error");
//    return false;
//  }
//  string_to_validate = ($('#escost25c').val());
//  if (isNaN(string_to_validate)) {
//    $('#escost25c').focus();
//    swal("", "Invalid value for Intallation Cost 0.25C", "error");
//    return false;
//  }
//  string_to_validate = ($('#esfom2c').val());
//  if (isNaN(string_to_validate)) {
//    $('#esfom2c').focus();
//    swal("", "Invalid value for FO&M Short Duration(2C)", "error");
//    return false;
//  }
//  string_to_validate = ($('#esfom1c').val());
//  if (isNaN(string_to_validate)) {
//    $('#esfom1c').focus();
//    swal("", "Invalid value for FO&M Medium-Short Duration(1C)", "error");
//    return false;
//  }
//  string_to_validate = ($('#esfom5c').val());
//  if (isNaN(string_to_validate)) {
//    $('#esfom5c').focus();
//    swal("", "Invalid value for FO&M Medium-Long Duration(0.5C)", "error");
//    return false;
//  }
//  string_to_validate = ($('#esfom25c').val());
//  if (isNaN(string_to_validate)) {
//    $('#esfom25c').focus();
//    swal("", "Invalid value for FO&M Long Duration(0.25C)", "error");
//    return false;
//  }
//  string_to_validate = ($('#esvom2c').val());
//  if (isNaN(string_to_validate)) {
//    $('#esvom2c').focus();
//    swal("", "Invalid value for VO&M Short Duration(2C)", "error");
//    return false;
//  }
//  string_to_validate = ($('#esvom1c').val());
//  if (isNaN(string_to_validate)) {
//    $('#esvom1c').focus();
//    swal("", "Invalid value for VO&M Medium-Short Duration(1C)", "error");
//    return false;
//  }
//  string_to_validate = ($('#esvom5c').val());
//  if (isNaN(string_to_validate)) {
//    $('#esvom5c').focus();
//    swal("", "Invalid value for VO&M Medium-Long Duration(0.5C)", "error");
//    return false;
//  }
//  string_to_validate = ($('#esvom25c').val());
//  if (isNaN(string_to_validate)) {
//    $('#esvom25c').focus();
//    swal("", "Invalid value for VO&M Long Duration(0.25C)", "error");
//    return false;
//  }
//  string_to_validate = ($('#popul').val());
//  if (isNaN(string_to_validate)) {
//    $('#popul').focus();
//    swal("", "Invalid value for Population", "error");
//    return false;
//  }
//  string_to_validate = ($('#carboncost').val());
//  if (isNaN(string_to_validate)) {
//    $('#carboncost').focus();
//    swal("", "Invalid value for Carbon Cost", "error");
//    return false;
//  }
//  string_to_validate = ($('#translength').val());
//  if (isNaN(string_to_validate)) {
//    $('#translength').focus();
//    swal("", "Invalid value for Length of Transmission Lines", "error");
//    return false;
//  }
//  string_to_validate = ($('#distlength').val());
//  if (isNaN(string_to_validate)) {
//    $('#distlength').focus();
//    swal("", "Invalid value for Length of Distribution Lines", "error");
//    return false;
//  }
//  string_to_validate = ($('#planresmargin').val());
//  if (isNaN(string_to_validate)) {
//    $('#planresmargin').focus();
//    swal("", "Invalid value for Planning Reserve Margin", "error");
//    return false;
//  }
//  string_to_validate = ($('#transcongind').val());
//  if (isNaN(string_to_validate)) {
//    $('#transcongind').focus();
//    swal("", "Invalid value for Transmission Congestion Indicator", "error");
//    return false;
//  }
//  string_to_validate = ($('#demforrisk').val());
//  if (isNaN(string_to_validate)) {
//    $('#demforrisk').focus();
//    swal("", "Invalid value for Demand Forecast Risk", "error");
//    return false;
//  }
//  string_to_validate = ($('#geodivind').val());
//  if (isNaN(string_to_validate)) {
//    $('#geodivind').focus();
//    swal("", "Invalid value for Geo Diversity Indicator", "error");
//    return false;
//  }
//  string_to_validate = ($('#outageIndices').val());
//  if (isNaN(string_to_validate)) {
//    $('#outageIndices').focus();
//    swal("", "Invalid value for Outage Indices", "error");
//    return false;
//  }
//  string_to_validate = ($('#vallossload').val());
//  if (isNaN(string_to_validate)) {
//    $('#vallossload').focus();
//    swal("", "Invalid value for Value of Loss Load", "error");
//    return false;
//  }
//  string_to_validate = ($('#renoutforrisk').val());
//  if (isNaN(string_to_validate)) {
//    $('#renoutforrisk').focus();
//    swal("", "Invalid value for Renewables Output Forecast Risk", "error");
//    return false;
//  }
//  string_to_validate = ($('#freregvalue').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#freregvalue').focus();
//    swal("", "Invalid value for Frequency Regulation Market Payment or Value", "error");
//    return false;
//  }
//  string_to_validate = ($('#peakcapital').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#peakcapital').focus();
//    swal("", "Invalid value for Value of Avoided Generation Cost", "error");
//    return false;
//  }
//  string_to_validate = ($('#convfactor').val());
//  if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//    $('#convfactor').focus();
//    swal("", "Invalid value for US Dollar to Local Currency Conversion Factor", "error");
//    return false;
//  }
//
//  // if a 2nd year demand profile is selected then the other 2nd year fields are required
//  if (($('#demandprofile2 select').val()) != "Select a region") { year2_required = true; }
//  if (year2_required == true) {
//
//    string_to_validate = ($('#windcap2').val());
//    //     if (isNaN(string_to_validate)) 
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#windcap2').focus();
//      swal("", "Value for Wind Capacity Year 2 (MW) is required", "error");
//      return false;
//    }
//    string_to_validate = ($('#solarcap2').val());
//    //     if (isNaN(string_to_validate)) 
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#solarcap2').focus();
//      swal("", "Value for Solar Capacity Year 2 (MW) is required", "error");
//      return false;
//    }
//    string_to_validate = ($('#inputpeak2').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#inputpeak2').focus();
//      swal("", "Value for Peak Electricity Demand 2nd Year is required", "error");
//      return false;
//    }
//    string_to_validate = ($('#inputenergy2').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#inputenergy2').focus();
//      swal("", "Value for Annual Energy Demand 2nd Year is required", "error");
//      return false;
//    }
//    //     string_to_validate = ($('#peakdemgrowrt2').val());
//    //     if (!(validate_field(string_to_validate, "float", -1, 10000000))) 
//    //     {
//    //       $('#peakdemgrowrt2').focus();
//    //       swal("", "Value for Peak Demand Growth Rate 2nd Year is required", "error");
//    //       return false;
//    //     }
//    string_to_validate = ($('#hydroEng2_1').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#hydroEng2_1').focus();
//      swal("", "Value for Hydro Monthly Energy Year 2 (GWh) Jan is required", "error");
//      return false;
//    }
//    string_to_validate = ($('#hydroEng2_2').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#hydroEng2_2').focus();
//      swal("", "Value for Hydro Monthly Energy Year 2 (GWh) Feb is required", "error");
//      return false;
//    }
//    string_to_validate = ($('#hydroEng2_3').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#hydroEng2_3').focus();
//      swal("", "Value for Hydro Monthly Energy Year 2 (GWh) Mar is required", "error");
//      return false;
//    }
//    string_to_validate = ($('#hydroEng2_4').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#hydroEng2_4').focus();
//      swal("", "Value for Hydro Monthly Energy Year 2 (GWh) Apr is required", "error");
//      return false;
//    }
//    string_to_validate = ($('#hydroEng2_5').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#hydroEng2_5').focus();
//      swal("", "Value for Hydro Monthly Energy Year 2 (GWh) May is required", "error");
//      return false;
//    }
//    string_to_validate = ($('#hydroEng2_6').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#hydroEng2_6').focus();
//      swal("", "Value for Hydro Monthly Energy Year 2 (GWh) Jun is required", "error");
//      return false;
//    }
//    string_to_validate = ($('#hydroEng2_7').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#hydroEng2_7').focus();
//      swal("", "Value for Hydro Monthly Energy Year 2 (GWh) Jul is required", "error");
//      return false;
//    }
//    string_to_validate = ($('#hydroEng2_8').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#hydroEng2_8').focus();
//      swal("", "Value for Hydro Monthly Energy Year 2 (GWh) Aug is required", "error");
//      return false;
//    }
//    string_to_validate = ($('#hydroEng2_9').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#hydroEng2_9').focus();
//      swal("", "Value for Hydro Monthly Energy Year 2 (GWh) Sep is required", "error");
//      return false;
//    }
//    string_to_validate = ($('#hydroEng2_10').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#hydroEng2_10').focus();
//      swal("", "Value for Hydro Monthly Energy Year 2 (GWh) Oct is required", "error");
//      return false;
//    }
//    string_to_validate = ($('#hydroEng2_11').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#hydroEng2_11').focus();
//      swal("", "Value for Hydro Monthly Energy Year 2 (GWh) Nov is required", "error");
//      return false;
//    }
//    string_to_validate = ($('#hydroEng2_12').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#hydroEng2_12').focus();
//      swal("", "Value for Hydro Monthly Energy Year 2 (GWh) Dec is required", "error");
//      return false;
//    }
//
//    string_to_validate = ($('#hypmax2').val());
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      $('#hypmax2').focus();
//      swal("", "Value for Hydro Capacity Year 2 (MW) is required", "error");
//      return false;
//    }
//  }
//
//
//  var $Conventional = $('#cap-by-fuel-dynamic>tbody');
//  var conventional_rows = $Conventional[0].childElementCount;
//  for (var k = 0; k < conventional_rows; k++) {
//    string_to_validate = $Conventional.find('.pconcap1:eq(' + k + ')').val();
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      swal("", "Invalid value for Capacity Year 1 (MW)", "error");
//      return false;
//    }
//    string_to_validate = $Conventional.find('.pconcap2:eq(' + k + ')').val();
//    if (isNaN(string_to_validate)) {
//      swal("", "Invalid value for Capacity Year 2 (MW)", "error");
//      return false;
//    }
//    string_to_validate = $Conventional.find('.fuelprice1:eq(' + k + ')').val();
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      swal("", "Invalid value for Fuel Price Year 1 ($/mmBTU)", "error");
//      return false;
//    }
//    string_to_validate = $Conventional.find('.fuelprice2:eq(' + k + ')').val();
//    if (isNaN(string_to_validate)) {
//      swal("", "Invalid value for Fuel Price Year 2 ($/mmBTU)", "error");
//      return false;
//    }
//    string_to_validate = $Conventional.find('.heatrate:eq(' + k + ')').val();
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      swal("", "Invalid value for Heat Rate (BTU/kWh)", "error");
//      return false;
//    }
//    string_to_validate = $Conventional.find('.vom:eq(' + k + ')').val();
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      swal("", "Invalid value for VO&M Cost ($/MWh)", "error");
//      return false;
//    }
//    string_to_validate = $Conventional.find('.p_reserve:eq(' + k + ')').val();
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      swal("", "Invalid value for 1st Reserve Cost ($/MW)", "error");
//      return false;
//    }
//    string_to_validate = $Conventional.find('.s_reserve:eq(' + k + ')').val();
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      swal("", "Invalid value for 2nd Reserve Cost ($/MW)", "error");
//      return false;
//    }
//    string_to_validate = $Conventional.find('.t_reserve:eq(' + k + ')').val();
//    if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//      swal("", "Invalid value for 3rd Reserve Cost ($/MW)", "error");
//      return false;
//    }
//    string_to_validate = $Conventional.find('.carbon_rate:eq(' + k + ')').val();
//    if (!(validate_field(string_to_validate, "float", -1, 100000))) {
//      swal("", "Invalid value for Carbon Rate (Ton/MWh)", "error");
//      return false;
//    }
//    string_to_validate = $Conventional.find('.carbon_rate:eq(' + k + ')').val();
//    if (isNaN(string_to_validate)) {
//      swal("", "Invalid value for Carbon Rate (Ton/MWh)", "error");
//      return false;
//    }
//
//    // if a 2nd year demand profile is selected then the other 2nd year fields are required
//    if (year2_required == true) {
//      string_to_validate = $Conventional.find('.pconcap2:eq(' + k + ')').val();
//      if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//        swal("", "Value for Capacity Year 2 (MW) is required", "error");
//        return false;
//      }
//
//      string_to_validate = $Conventional.find('.fuelprice2:eq(' + k + ')').val();
//      if (!(validate_field(string_to_validate, "float", -1, 10000000))) {
//        swal("", "Value for Fuel Price Year 2 ($/mmBTU) is required", "error");
//        return false;
//      }
//    }
//  }
//    
//  var $Existing = $('#existing-storage-dynamic>tbody');
//  var existing_rows = $Existing[0].childElementCount;
//  for (var l = 0; l < existing_rows; l++) 
//  {
//    string_to_validate = $Existing.find('.espcap:eq(' + l + ')').val();
//    if (isNaN(string_to_validate)) {
//      swal("", "Invalid value for Power Capacity", "error");
//      return false;
//    }
//    string_to_validate = $Existing.find('.esecap:eq(' + l + ')').val();
//    if (isNaN(string_to_validate)) {
//      swal("", "Invalid value for Energy Capacity", "error");
//      return false;
//    }  
//  }
//  
//  console.log("validated");
//  return true;
//}
//
//function validate_field(string_to_validate, ftype, min, max) {
//  console.log(string_to_validate);
//  if (string_to_validate == undefined) { return false; }
//  if (string_to_validate == null) { return false; }
//  if (validator.isEmpty(string_to_validate)) { return false; }
//  if (ftype == "integer") {
//    if (!(validator.isInt(string_to_validate, { gt: min, lt: max }))) { return false; }
//  }
//  if (ftype == "float") {
//    if (!(validator.isFloat(string_to_validate, { gt: min, lt: max }))) { return false; }
//  }
//  if (ftype == "string") {
//    if (string_to_validate == "Add Project") { return false; }
//    if (string_to_validate == "Add Run") { return false; }
//    if (string_to_validate == "add") { return false; }
//    if (string_to_validate == "Select a country") { return false; }
//    if (string_to_validate == "Select a region") { return false; }
//    if (string_to_validate == "Select a scenario") { return false; }
//  }
//  return true;
//
//  //    if (!(validator.isNumeric(string_to_validate))) { return false;}
//
//}
//

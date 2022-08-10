/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var set_all_buttons_to_disable_status = function ()
{
    $('#alternative-analysis-btn').off("click", make_alternative_analysis_calculation);
    $('#alternative-analysis-btn').css("opacity", "0.5");
    $('#emulator-btn').off("click", make_emulator_calculation);
    $('#emulator-btn').css("opacity", "0.5");
    $('#production-cost-btn').off("click", make_production_cost_calculation);
    $('#production-cost-btn').css("opacity", "0.5");
    $('#stacked-benefits-btn').off("click", make_stacked_benefits_calculation);
    $('#stacked-benefits-btn').css("opacity", "0.5");
    $('#save-btn').off("click", save_button_ajax_call);
    $('#save-btn').css("opacity", "0.5");
    $('#delete-btn').off("click", delete_from_database);
    $('#delete-btn').css("opacity", "0.5");
    $(".select-editable").attr("readonly",true);
    scenario_option.off('keypress', scenario_option_event);
    scenario_option.off("click", scenario_option_event);
    case_option.off('keypress', case_option_event);
    case_option.off("click", case_option_event);
    scenario_option.off('focus',set_scenario_focus );
    case_option.off('focus', set_case_focus);
    
};
var set_all_buttons_to_enable_status = function ()
{
    $('#alternative-analysis-btn').on("click", make_alternative_analysis_calculation);
    $('#emulator-btn').on("click", make_emulator_calculation);
    $('#production-cost-btn').on("click", make_production_cost_calculation);
    $('#stacked-benefits-btn').on("click", make_stacked_benefits_calculation);
    $('#save-btn').on("click", save_button_ajax_call);
    $('#delete-btn').on("click", delete_from_database);
    $('#alternative-analysis-btn').css("opacity", "1");
    $('#emulator-btn').css("opacity", "1");
    $('#production-cost-btn').css("opacity", "1");
    $('#stacked-benefits-btn').css("opacity", "1");
    $('#save-btn').css("opacity", "1");
    $('#delete-btn').css("opacity", "1");
    $(".select-editable").attr("readonly",false);
    
    scenario_option.bind('keypress', scenario_option_event);
    scenario_option.bind("click", scenario_option_event);
    case_option.bind('keypress', case_option_event);
    case_option.bind("click", case_option_event);
    scenario_option.on('focus',set_scenario_focus );
    case_option.on('focus', set_case_focus);
};
var alternative_analysis_status = false;
var production_cost_status = false;
var stacked_benefits_status = false;
var emulator_status = false;
var set_calculation_sequence_status = function (calculation_type)
{
    if (calculation_type === "alternative_analysis_calculation")
    {
        alternative_analysis_status = true;
        return true;
    }
    if (alternative_analysis_status)
    {
        if (calculation_type === "production_cost_calculation")
        {
            production_cost_status = true;
            return true;
        } else if (calculation_type === "stacked_benefits_calculation" && production_cost_status)
        {
            stacked_benefits_status = true;
            return true;
        } else if (calculation_type === "emulator_calculation" && production_cost_status)
        {
            emulator_status = true;
            return true;
        } else
        {
            if(!production_cost_status)
                calculation_type ="production_cost_calculation";
            else if(!stacked_benefits_status)
              calculation_type ="stacked_benefits_calculation";  
            swal("Error", calculation_type.toUpperCase() + " NOT PERFORMED", "error");
            return false;
        }
    } else
    {
        calculation_type ="alternative_analysis_calculation";
        swal("Error", calculation_type.toUpperCase() + " NOT PERFORMED", "error");
        return false;
    }
};
var set_calculation_sequence_status_to_false = function (calculation_type)
{
    if (calculation_type === "alternative_analysis_calculation")
    {
        alternative_analysis_status = false;
        return true;
    } else if (calculation_type === "production_cost_calculation")
    {
        production_cost_status = false;
        return true;
    } else if (calculation_type === "stacked_benefits_calculation" && production_cost_status)
    {
        stacked_benefits_status = false;
        return true;
    } else if (calculation_type === "emulator_calculation" && production_cost_status && stacked_benefits_status)
    {
        emulator_status = false;
        return true;
    }


};
var reset_calculation_sequence = function ()
{
    alternative_analysis_status = false;
    production_cost_status = false;
    stacked_benefits_status = false;
    emulator_status = false;
};
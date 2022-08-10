/*
 * Copyright 2018 Acelerex Inc.
 */


var set_data_to_country = function (inputs)
{
    console.log(" >> set_data_to_country");
    $('#country').val(inputs.country);
};

// new tables
var set_data_to_programs_renewables_tables = function (inputs)
{
    console.log(" >> set_data_to_programs_renewables_tables");
    for (var i = 0; i < inputs.programs_renewables_table.length; i++)
    {

        var keys = Object.keys(inputs.programs_renewables_table[i]);
        var values = Object.values(inputs.programs_renewables_table[i]);
        for (var z = 0; z < keys.length; z++)
        {
            $("#" + keys[z]).val(parseFloat(values[z]));
        }

    }

};

var set_data_to_programs_planning_criteria_table = function (inputs)
{
    console.log(" >> set_data_to_programs_planning_criteria_table");
    for (var i = 0; i < inputs.programs_planning_criteria_table.length; i++)
    {

        var keys = Object.keys(inputs.programs_planning_criteria_table[i]);
        var values = Object.values(inputs.programs_planning_criteria_table[i]);
        for (var z = 0; z < keys.length; z++)
        {
            $("#" + keys[z]).val(parseFloat(values[z]));
        }

    }
};

var set_data_to_programs_programs_demand_side_table = function (inputs)
{
    console.log(" >> set_data_to_programs_programs_demand_side_table");
    for (var i = 0; i < inputs.programs_demand_side_table.length; i++)
    {

        var keys = Object.keys(inputs.programs_demand_side_table[i]);
        var values = Object.values(inputs.programs_demand_side_table[i]);
        for (var z = 0; z < keys.length; z++)
        {
            $("#" + keys[z]).val(parseFloat(values[z]));
        }

    }
};
var set_data_to_demand_table = function (inputs)
{
    console.log(" >> set_data_to_demand_table");
    for (var i = 0; i < inputs.demand_table.length; i++)
    {

        var keys = Object.keys(inputs.demand_table[i]);
        var values = Object.values(inputs.demand_table[i]);
        for (var z = 0; z < keys.length; z++)
        {
            var temp_value = isNaN(values[z]);
            if (temp_value)
                $("#" + keys[z]).attr("value", values[z]);
            else
                $("#" + keys[z]).attr("value", parseFloat(values[z]));
        }

    }
};
var set_data_to_generation_conventional_table = function (inputs)
{
    console.log(" >> set_data_to_generation_conventional_table");
    var tbody = $(".generation-conventional-table").find("tbody");
    var tr = tbody.find("tr");
    var tr_clone = $(tr[0]).clone();
    var i = 0;
    var fuel_option_count = 0;
    
    for (var x = 0; x < tr.length; x++)
    {

        var children = $(tr[ x ]).children();
        for(;i < inputs.generation_conventional_table.length;i++)
        {
        
            if (typeof inputs.generation_conventional_table[i] === 'undefined')
            {
                console.log("undefined " + i + ":" + inputs.generation_conventional_table.length);
                continue;
            }
            var keys = Object.keys(inputs.generation_conventional_table[i]);
            var values = Object.values(inputs.generation_conventional_table[i]);

            for (var z = 0; z < keys.length; z++)
            {
                
                if(keys[z] === "fuel_options")
                {
                    ++fuel_option_count;
                    if(fuel_option_count === 2)
                        break;
                }
                for (var m = 0; m < children.length - 1; m++)
                {
                    
                    var tag = $(children[m]).children();
                    var id = $(tag).attr("id");
                    if (id === keys[z])
                    {
                        var is_string = isNaN(values[z]);
                        if (is_string)
                            $(tag).val(values[z]).prop("selected", true);
                        else
                            $(tag).attr("value", parseFloat(values[z]));
                        break;
                    }
                }
            }
            if(fuel_option_count === 2)
            {   
                fuel_option_count = 0;
                --i;
                break;
            }
        }        
    }// end of for loop
    var index = 0;
    while (inputs.generation_conventional_table.length > i)
    {
        var new_tr = $(tr_clone).clone();
        var children = $(new_tr).children();
        new_tr.find('td span.remove-btn')
        .html('<span class="input-group-btn"><a class="btn-remove btn btn-primary" type="button" data-index="'+index+'"><span class="glyphicon glyphicon-minus"></span></a></span>');
        index++;
        for(;i < inputs.generation_conventional_table.length;i++)
        {
            
            if (typeof inputs.generation_conventional_table[i] === 'undefined')
            {
                console.log("undefined " + i + ":" + inputs.generation_conventional_table.length);
                continue;
            }
            var keys = Object.keys(inputs.generation_conventional_table[i]);
            var values = Object.values(inputs.generation_conventional_table[i]);

            for (var z = 0; z < keys.length; z++)
            {
                
                if(keys[z] === "fuel_options")
                {
                    ++fuel_option_count;
                    if(fuel_option_count === 2)
                        break;
                }
                for (var m = 0; m < children.length - 1; m++)
                {
                    
                    var tag = $(children[m]).children();
                    var id = $(tag).attr("id");
                    if (id === keys[z])
                    {
                        var is_string = isNaN(values[z]);
                        if (is_string)
                        {
                            var option = $(tag).find("option");
                            for (var q = 0; q < option.length; q++)
                            {
                                
                                if ($(option[q]).val() === values[z])
                                {
                                    $(option[q]).attr("selected", "selected");
                                    break;
                                }
                            }

                        } else
                            $(tag).attr("value", parseFloat(values[z]));

                        break;
                    }
                }
            }
            if(fuel_option_count === 2)
            {   
                fuel_option_count = 0;
                --i;
                break;
            }
            
            
        }
        $(tbody).append("<tr>" + $(new_tr).html() + "</tr>");
        //set_focus_on_input_generation_conventional_table();
        updateCapbyFuelChart('generation-cap-fuel');
    }
};
var set_data_to_generation_hydro_table = function (inputs)
{
    for (var i = 0; i < inputs.generation_hydro_table.length; i++)
    {
        var keys = Object.keys(inputs.generation_hydro_table[i]);
        var values = Object.values(inputs.generation_hydro_table[i]);
        for (var z = 0; z < keys.length; z++)
        {
            $("#" + keys[z]).attr("value", parseFloat((values[z])));
        }

    }
};
var set_data_to_generation_renewables_table = function (inputs)
{
    console.log(" >> set_data_to_generation_renewables_table");
    for (var i = 0; i < inputs.generation_renewables_table.length; i++)
    {

        var keys = Object.keys(inputs.generation_renewables_table[i]);
        var values = Object.values(inputs.generation_renewables_table[i]);
        for (var z = 0; z < keys.length; z++)
        {
            var temp_value = isNaN(values[z]);
            if (temp_value)
                $("#" + keys[z]).attr("value", values[z]);
            else
                $("#" + keys[z]).attr("value", parseFloat(values[z]));
        }

    }
};
var set_data_to_hydro_monthly_energy_table = function (inputs)
{
    console.log(" >> set_data_to_hydro_monthly_energy_table");
    for (var i = 0; i < inputs.hydro_monthly_energy_table.length; i++)
    {
        var keys = Object.keys(inputs.hydro_monthly_energy_table[i]);
        var values = Object.values(inputs.hydro_monthly_energy_table[i]);
        for (var z = 0; z < keys.length; z++)
        {
            $("#" + keys[z]).attr("value", parseFloat(values[z]));
        }
    }
};
var set_data_to_energy_storage_dynamic_table = function (inputs)
{
    console.log(" >> set_data_to_energy_storage_dynamic_table");
    var tbody = $(".energy-storage-dynamic-table").find("tbody");
    var tr = tbody.find("tr");
    var tr_clone = $(tr[0]).clone();
    var i = 0;
    var y = 0;

    for (var x = 0; x < tr.length; x++)
    {
        var children = $(tr[ x ]).children();
        for (var y = 0; y < children.length - 1; y++)
        {

            if (typeof inputs.energy_storage_dynamic_table[i] === 'undefined')
            {
                console.log("undefined " + i + ":" + inputs.fuel_price_forecast_table.length);
                continue;
            }
            var keys = Object.keys(inputs.energy_storage_dynamic_table[i]);
            var values = Object.values(inputs.energy_storage_dynamic_table[i]);

            for (var z = 0; z < keys.length; z++)
            {
                for (var m = 0; m < children.length - 1; m++)
                {
                    var tag = $(children[m]).children();
                    
                    var id = $(tag).attr("id");
                    if (id === keys[z])
                    {
                        var is_select = $(tag).is('select');
                        if (is_select)
                            $(tag).val(values[z]).prop("selected", true);                        
                        else
                        {
                            $(tag).attr("value", parseFloat(values[z]));

                        }
                        break;
                    }
                }
            }
            i++;
        }
    }// end of for loop
    var index=0;
    while (inputs.energy_storage_dynamic_table.length > i)
    {
        var new_tr = $(tr_clone).clone();
        
        var children = $(new_tr).children();
        new_tr.find('td span.remove-btn')
        .html('<span class="input-group-btn"><a class="btn-remove btn btn-primary" type="button" data-index="'+index+'"><span class="glyphicon glyphicon-minus"></span></a></span>');
        index++;
        
        for (var y = 0; y < children.length - 1; y++)
        {
            if (typeof inputs.energy_storage_dynamic_table[i] === 'undefined')
            {
                console.log("undefined " + i + ":" + inputs.energy_storage_dynamic_table.length);
                continue;
            }
            var keys = Object.keys(inputs.energy_storage_dynamic_table[i]);
            var values = Object.values(inputs.energy_storage_dynamic_table[i]);

            for (var z = 0; z < keys.length; z++)
            {
                for (var m = 0; m < children.length - 1; m++)
                {
                    var tag = $(children[m]).children();
                    var id = $(tag).attr("id");
                    if (id === keys[z])
                    {
                        var is_select = $(tag).is('select');
                        if (is_select)
                        {
                            var option = $(tag).find("option");
                            for (var q = 0; q < option.length; q++)
                            {
                                if ($(option[q]).val() === values[z])
                                {
                                    $(option[q]).attr("selected", "selected");
                                    break;
                                }
                            }

                        } else
                            $(tag).attr("value", parseFloat(values[z]));
                        break;

                    }
                }
            }
            i++;
        }
        $(tbody).append("<tr>" + $(new_tr).html() + "</tr>");
        //set_focus_on_input_energy_storage_cost_dynamic_table();
    }
};
var set_data_to_fuel_price_forecast_table = function (inputs)
{
    console.log(" >> set_data_to_fuel_price_forecast_table");
    var tbody = $(".fuel-price-forecast-table").find("tbody");
    var tr = tbody.find("tr");
    var tr_clone = $(tr[0]).clone();
    var i = 0;
    var y = 0;
    console.log("tr " + tr.length);
    for (var x = 0; x < tr.length; x++)
    {        
        
        var children = $(tr[ x ]).children();

        for (var y = 0; y < children.length - 1; y++)
        {
            
            if (typeof inputs.fuel_price_forecast_table[i] === 'undefined')
            {
                console.log("undefined " + i + ":" + inputs.fuel_price_forecast_table.length);
                continue;
            }
            var keys = Object.keys(inputs.fuel_price_forecast_table[i]);
            var values = Object.values(inputs.fuel_price_forecast_table[i]);

            for (var z = 0; z < keys.length; z++)
            {
                
                for (var m = 0; m < children.length - 1; m++)
                {
                    console.log("m :" + m);
                    var tag = $(children[m]).children();
                    var id = $(tag).attr("id");
                    if (id === keys[z])
                    {

                        var is_string = isNaN(values[z]);
                        if (is_string)
                            $(tag).val(values[z]).prop("selected", true);
                        else
                        {
                            $(tag).attr("value", parseFloat(values[z]));
                            $(tag).val(parseFloat(values[z]));

                        }
                        break;
                    }
                }
            }
            
            i++;
        }
    }// end of for loop
    var index = 0
    while (inputs.fuel_price_forecast_table.length > i)
    {
        
        var new_tr = $(tr_clone).clone();
        new_tr.find('td span.remove-btn')
        .html('<span class="input-group-btn"><a class="btn-remove btn btn-primary" type="button" data-index="'+index+'"><span class="glyphicon glyphicon-minus"></span></a></span>');
        index++;
        var children = $(new_tr).children();

        for (var y = 0; y < children.length - 1; y++)
        {
            
            if (typeof inputs.fuel_price_forecast_table[i] === 'undefined')
            {
                console.log("undefined " + i + ":" + inputs.fuel_price_forecast_table.length);
                continue;
            }
            var keys = Object.keys(inputs.fuel_price_forecast_table[i]);
            var values = Object.values(inputs.fuel_price_forecast_table[i]);

            for (var z = 0; z < keys.length; z++)
            {
                
                for (var m = 0; m < children.length - 1; m++)
                {
                    
                    var tag = $(children[m]).children();
                    var id = $(tag).attr("id");

                    if (id === keys[z])
                    {
                        var is_string = isNaN(values[z]);
                        if (is_string)
                        {
                            var option = $(tag).find("option");
                            for (var q = 0; q < option.length; q++)
                            {
                                if ($(option[q]).val() === values[z])
                                {
                                    $(option[q]).attr("selected", "selected");
                                    break; 
                                }
                                
                            }

                        } else
                            $(tag).attr("value", parseFloat(values[z]));

                        break;
                    }
                }
            }
            
            i++;
        }
        $(tbody).append("<tr>" + $(new_tr).html() + "</tr>");
        //set_focus_on_input_fuel_price_forecast_table();
    }
};
var set_data_to_tech_capital_dynamic_table = function (inputs)
{
    console.log(" >> set_data_to_tech_capital_dynamic_table");
    var tbody = $(".tech-capital-dynamic-table").find("tbody");
    var tr = tbody.find("tr");
    var tr_clone = $(tr[0]).clone();
    var i = 0;
    var y = 0;
    console.log("tr " + tr.length);
    for (var x = 0; x < tr.length; x++)
    {

        var children = $(tr[ x ]).children();

        for (var y = 0; y < children.length - 1; y++)
        {


            if (typeof inputs.tech_capital_dynamic_table[i] === 'undefined')
            {
                console.log("undefined " + i + ":" + inputs.tech_capital_dynamic_table.length);
                continue;
            }
            var keys = Object.keys(inputs.tech_capital_dynamic_table[i]);
            var values = Object.values(inputs.tech_capital_dynamic_table[i]);

            for (var z = 0; z < keys.length; z++)
            {
                for (var m = 0; m < children.length - 1; m++)
                {
                    var tag = $(children[m]).children();
                    var id = $(tag).attr("id");
                    if (id === keys[z])
                    {
                        var is_string = isNaN(values[z]);
                        if (is_string)
                            $(tag).val(values[z]).prop("selected", true);
                        else
                        {
                            $(tag).attr("value", parseFloat(values[z]));
                            $(tag).val(parseFloat(values[z]));

                        }
                        break;
                    }
                }
            }
            i++;
        }
    }// end of for loop
    var index = 0;
    while (inputs.tech_capital_dynamic_table.length > i)
    {
        var new_tr = $(tr_clone).clone();
        new_tr.find('td span.remove-btn')
        .html('<span class="input-group-btn"><a class="btn-remove btn btn-primary" type="button" data-index="'+index+'"><span class="glyphicon glyphicon-minus"></span></a></span>');
        index++;
        var children = $(new_tr).children();

        for (var y = 0; y < children.length - 1; y++)
        {
            if (typeof inputs.tech_capital_dynamic_table[i] === 'undefined')
            {
                console.log("undefined " + i + ":" + inputs.generation_conventional_table.length);
                continue;
            }
            var keys = Object.keys(inputs.tech_capital_dynamic_table[i]);
            var values = Object.values(inputs.tech_capital_dynamic_table[i]);

            for (var z = 0; z < keys.length; z++)
            {
                for (var m = 0; m < children.length - 1; m++)
                {
                    var tag = $(children[m]).children();
                    var id = $(tag).attr("id");
                    if (id === keys[z])
                    {
                        var is_string = isNaN(values[z]);
                        if (is_string)
                        {
                            var option = $(tag).find("option");
                            for (var q = 0; q < option.length; q++)
                            {
                                if ($(option[q]).val() === values[z])
                                {
                                    $(option[q]).attr("selected", "selected");
                                    break;
                                }
                            }

                        } else
                            $(tag).attr("value", parseFloat(values[z]));

                        break;
                    }
                }
            }
            i++;
        }
        $(tbody).append("<tr>" + $(new_tr).html() + "</tr>");
        //set_focus_on_input_tech_capital_dynamic_table();
    }
};
var set_data_to_energy_storage_cost_dynamic_table = function (inputs)
{
    console.log(" >> set_data_to_energy_storage_cost_dynamic_table");
    var tbody = $(".energy-storage-cost-dynamic-table").find("tbody");
    var tr = tbody.find("tr");
    var tr_clone = $(tr[0]).clone();
    var i = 0;
    var y = 0;
    console.log("tr " + tr.length);
    for (var x = 0; x < tr.length; x++)
    {
        var children = $(tr[ x ]).children();

        for (var y = 0; y < children.length - 1; y++)
        {
            if (typeof inputs.energy_storage_cost_dynamic_table[i] === 'undefined')
            {
                console.log("undefined " + i + ":" + inputs.energy_storage_cost_dynamic_table.length);
                continue;
            }
            var keys = Object.keys(inputs.energy_storage_cost_dynamic_table[i]);
            var values = Object.values(inputs.energy_storage_cost_dynamic_table[i]);

            for (var z = 0; z < keys.length; z++)
            {
                for (var m = 0; m < children.length - 1; m++)
                {
                    var tag = $(children[m]).children();
                    var id = $(tag).attr("id");
                    if (id === keys[z])
                    {
                        var is_string = isNaN(values[z]);
                        if (is_string)
                            $(tag).val(values[z]).prop("selected", true);
                        else
                        {
                            $(tag).val(parseFloat(values[z]));
                            $(tag).attr("value", parseFloat(values[z]));
                        }
                        break;
                    }
                }
            }
            i++;
        }
    }// end of for loop
    var index=0;
    while (inputs.energy_storage_cost_dynamic_table.length > i)
    {
        var new_tr = $(tr_clone).clone();

        var children = $(new_tr).children();
        new_tr.find('td span.remove-btn')
        .html('<span class="input-group-btn"><a class="btn-remove btn btn-primary" type="button" data-index="'+index+'"><span class="glyphicon glyphicon-minus"></span></a></span>');
        index++;
        
        for (var y = 0; y < children.length - 1; y++)
        {
            if (typeof inputs.energy_storage_cost_dynamic_table[i] === 'undefined')
            {
                console.log("undefined " + i + ":" + inputs.energy_storage_cost_dynamic_table.length);
                continue;
            }
            var keys = Object.keys(inputs.energy_storage_cost_dynamic_table[i]);
            var values = Object.values(inputs.energy_storage_cost_dynamic_table[i]);

            for (var z = 0; z < keys.length; z++)
            {
                for (var m = 0; m < children.length - 1; m++)
                {
                    var tag = $(children[m]).children();
                    var id = $(tag).attr("id");
                    if (id === keys[z])
                    {
                        var is_string = isNaN(values[z]);
                        if (is_string)
                        {
                            var option = $(tag).find("option");
                            for (var q = 0; q < option.length; q++)
                            {
                                if ($(option[q]).val() === values[z])
                                {
                                    $(option[q]).attr("selected", "selected");
                                    break;
                                }
                                
                            }

                        } else
                            $(tag).attr("value", parseFloat(values[z]));

                        break;
                    }
                }
            }
            i++;
        }
        $(tbody).append("<tr>" + $(new_tr).html() + "</tr>");
        //set_focus_on_input_energy_storage_dynamic_table();
    }
};


var set_data_to_calculation_settings = function(inputs)
{
    console.log(" >> set_data_to_calculation_settings");
    for (var i = 0; i < inputs.calculation_settings_table.length; i++)
    {

        var keys = Object.keys(inputs.calculation_settings_table[i]);
        var values = Object.values(inputs.calculation_settings_table[i]);
        for (var z = 0; z < keys.length; z++)
        {
            if(keys[z]==="alt_an_years")
                $('#alt_an_years').val(values[z]);
            else
            {
            var temp_value = isNaN(values[z]);
            if (temp_value)
                $("#" + keys[z]).attr("value", values[z]);
            else
                $("#" + keys[z]).attr("value", parseFloat(values[z]));
            }
        }

    }
    
};
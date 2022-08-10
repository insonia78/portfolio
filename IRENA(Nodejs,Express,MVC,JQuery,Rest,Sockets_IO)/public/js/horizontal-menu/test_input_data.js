/*
 * Copyright 2018 Acelerex Inc.
 */
var test_input_data_error = 0;
var test_input_data_programs_renewables_tables = function()
{
    var tbody = $(".programs-renewables-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            verify_data($(children[y]),$(children[y]).val());
        }
    }
};
var test_input_data_fuel_price_forecast_table = function()
{
    var tbody = $(".fuel-price-forecast-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            verify_data($(children[y]),$(children[y]).val());
        }
    }
};

var test_input_data_tech_capital_dynamic_table = function()
{
    var tbody = $(".tech-capital-dynamic-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            verify_data($(children[y]),$(children[y]).val());
        }
    }
};
var test_input_energy_storage_cost_dynamic_table = function()
{
    var tbody = $(".energy-storage-cost-dynamic-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            verify_data($(children[y]),$(children[y]).val());
        }
    }
};

var test_input_data_programs_planning_criteria = function()
{
    var tbody = $(".programs-planning-criteria-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            verify_data($(children[y]),$(children[y]).val());
        }
    }
};

var test_input_data_programs_demand_side_table = function()
{
    var tbody = $(".programs-demand-side-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            verify_data($(children[y]),$(children[y]).val());
        }
    }
};

var test_input_data_demand_table = function()
{
    var tbody = $(".demand-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 1 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
          verify_data($(children[y]),$(children[y]).val());
        }
    }
};
var test_input_data_generation_conventional_table = function()
{
    var tbody = $(".generation-conventional-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            verify_data($(children[y]),$(children[y]).val());
        }
    }
};
var test_input_data_generation_renewables_table = function()
{
    var tbody = $(".generation-renewables-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 6; y < children.length;y++)
        {
            
            verify_data($(children[y]),$(children[y]).val());
        }
    }
};
var test_input_data_generation_hydro_table = function()
{
    var tbody = $(".generation-hydro-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            verify_data($(children[y]),$(children[y]).val());
        }
    }
};


var test_input_data_hydro_monthly_energy_table = function()
{
    var tbody = $(".hydro-monthly-energy-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            verify_data($(children[y]),$(children[y]).val());
        }
    }
};
var test_input_data_energy_storage_dynamic_table = function()
{
    var tbody = $(".energy-storage-dynamic-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            verify_data($(children[y]),$(children[y]).val());
        }
    }
};
var verify_data = function(input,value)
{
    
    if(isNaN(value))
    {
        input.css("border","2px red solid");
        test_input_data_error++;
        set_focus_on_input(input);
    }
    if(value === "")
    {
       input.val("0");
    }        
};


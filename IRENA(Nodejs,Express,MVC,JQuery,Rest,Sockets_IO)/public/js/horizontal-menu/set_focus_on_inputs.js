/*
 * Copyright 2018 Acelerex Inc.
 */
var set_focus_on_input_tech_capital_dynamic_table = function()
{    
    var tbody = $(".tech-capital-dynamic-table").find("tbody");
    var tr  = tbody.find("tr");
    
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {           
           set_focus_on_input($(children[y]));
        }
    }
};
var set_focus_on_input_fuel_price_forecast_table = function()
{    
    var tbody = $(".fuel-price-forecast-table").find("tbody");
    var tr  = tbody.find("tr");
    
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {   
          set_focus_on_input($(children[y]));
        }
    }
};
var set_focus_on_input_energy_storage_cost_dynamic_table = function()
{
    
    var tbody = $(".energy-storage-cost-dynamic-table").find("tbody");
    var tr  = tbody.find("tr");
    
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {           
           set_focus_on_input($(children[y]));
        }
    }
};
var set_focus_on_input_programs_renewables_tables = function()
{
    
    var tbody = $(".programs-renewables-table").find("tbody");
    var tr  = tbody.find("tr");
    
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {           
           set_focus_on_input($(children[y]));
        }
    }
};
var set_focus_on_input_programs_planning_criteria_table = function()
{
    var tbody = $(".programs-planning-criteria-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            set_focus_on_input($(children[y]));
        }
    }
};
var set_focus_on_input_programs_demand_side_table = function()
{
    var tbody = $(".programs-demand-side-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            set_focus_on_input($(children[y]));
        }
    }
};

var set_focus_on_input_demand_table = function()
{
    var tbody = $(".demand-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
          set_focus_on_input($(children[y]));
        }
    }
};
var set_focus_on_input_generation_conventional_table = function()
{
    var tbody = $(".generation-conventional-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            set_focus_on_input($(children[y]));
        }
    }
};



var set_focus_on_input_generation_hydro_table = function()
{
    var tbody = $(".generation-hydro-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            set_focus_on_input($(children[y]));
        }
    }
};
var set_focus_on_generation_renewables_table = function()
{
    
    var tbody = $(".generation-renewables-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {        
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length; y++)
        {  
            
            set_focus_on_input($(children[y]));                        
        }
    }
};
var set_focus_on_input_hydro_monthly_energy_table = function()
{
    var tbody = $(".hydro-monthly-energy-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            set_focus_on_input($(children[y]));
        }
    }
};
var set_focus_on_input_energy_storage_dynamic_table = function()
{
    var tbody = $(".energy-storage-dynamic-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            set_focus_on_input($(children[y]));
        }
    }
};
var set_focus_on_input = function(input)
{
    input.focus(function(){
        $(input).css("border","");
    });
};


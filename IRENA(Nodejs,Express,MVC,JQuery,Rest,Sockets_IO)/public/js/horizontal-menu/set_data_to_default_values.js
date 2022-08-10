/*
 * Copyright 2018 Acelerex Inc.
 */

// new tables
var set_data_to_default_values_fuel_price_forecast_table = function()
{
    var tbody = $(".fuel-price-forecast-table").find("tbody");
    var tr  = tbody.find("tr:first");
    $(tbody).empty();
    $(tbody).append(tr);
    for(var i = 0 ; i < tr.length;i++)
    {
        
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            $($(children[y])).val("0.0");
        }
    }
};
var set_data_to_default_values_tech_capital_dynamic_table = function()
{
    var tbody = $(".tech-capital-dynamic-table").find("tbody");
    var tr  = tbody.find("tr:first");
    $(tbody).empty();
    $(tbody).append(tr);
    for(var i = 0 ; i < tr.length;i++)
    {
        
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            $($(children[y])).val("0.0");
        }
    }
};
var set_data_to_default_values_energy_storage_cost_dynamic_table = function()
{
    var tbody = $(".energy-storage-cost-dynamic-table").find("tbody");
    var tr  = tbody.find("tr:first");
    $(tbody).empty();
    $(tbody).append(tr);
    for(var i = 0 ; i < tr.length;i++)
    {
        
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            $($(children[y])).val("0.0");
        }
    }
};
var set_data_to_default_values_programs_renewables_tables = function()
{
    var tbody = $(".programs-renewables-table").find("tbody");
    var tr  = tbody.find("tr");
    
    for(var i = 0 ; i < tr.length;i++)
    {
        
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            $($(children[y])).val("0.0");
        }
    }
};
var set_data_to_default_values_programs_planning_criteria_table = function()
{
    var tbody = $(".programs-planning-criteria-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            $(children[y]).val("0.0");
        }
    }
};
var set_data_to_default_values_demand_side_table = function()
{
   
    var tbody = $(".programs-demand-side-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            $(children[y]).val("0.0");
        }
    }
};

var set_data_to_default_values_demand_table = function()
{
    var tbody = $(".demand-table").find("tbody");
    var tr  = tbody.find("tr");
    
    for(var i = 1 ; i < tr.length;i++)
    {        
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length; y++)
        {            
            $(children[y]).attr("value","0.0");
             
        }
    }
};
var set_data_to_default_values_generation_conventional_table = function()
{
    var tbody = $(".generation-conventional-table").find("tbody");
    var tr  = tbody.find("tr:first");
    $(tbody).empty();
    $(tbody).append(tr);
    var children = $(tr[i]).find("input");
      for(var i = 0 ; i < tr.length;i++)
    {
        
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length; y++)
        {  
            $(children[y]).attr("value","0.0");                        
        }
    }
};




var set_data_to_default_values_renewables_generation_hydro_table = function()
{
    var tbody = $(".generation-hydro-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
       
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length; y++)
        {  
            $(children[y]).attr("value","0.0");                        
        }
    }
};
var set_data_to_default_values_generation_renewables_table = function()
{
    var tbody = $(".generation-renewables-table").find("tbody");
    var tr  = tbody.find("tr");
    
    for(var i = 0 ; i < tr.length;i++)
    {   
        var children = $(tr[i]).find("input");
        for(var y = 6; y < children.length; y++)
        {  
           console.log($(children[y]).attr("id"));
            if(y === 0)
                continue;
            $(children[y]).attr("value","0.0");                        
        }
    }
};
var set_data_to_default_values_hydro_monthly_energy_table = function()
{
    var tbody = $(".hydro-monthly-energy-table").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {        
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length; y++)
        {  
            $(children[y]).attr("value","0.0");                        
        }
    }
};
var set_data_to_default_values_energy_storage_dynamic_table = function()
{
    var tbody = $(".energy-storage-dynamic-table").find("tbody");
    var tr  = tbody.find("tr:first");
    $(tbody).empty();
    $(tbody).append(tr);
    for(var i = 0 ; i < tr.length;i++)
    {
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length; y++)
        {  
            $(children[y]).attr("value","0.0");                        
        }
    }
};

var set_data_to_default_values_calculation_settings = function()
{
   
   var tbody = $(".AA-settings-table ").find("tbody");
    var tr  = tbody.find("tr");
    for(var i = 0 ; i < tr.length;i++)
    {
        var select = $(tr[i]).find("select");
        for(var z = 0; z < select.length; z++)
        {  
            $(select[z]).val("2");                        
        } 
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length; y++)
        {              
            $(children[y]).val("0.0");                        
        }
    } 
   
};


 

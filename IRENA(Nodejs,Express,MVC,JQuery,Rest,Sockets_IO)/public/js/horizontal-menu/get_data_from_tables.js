/*
 * Copyright 2018 Acelerex Inc.
 */

/**************************************************************/
var get_data_from_country = function (inputs)
{      
    inputs.country = $('.scenario-menu-container').find('#country').val();    
};



var get_data_from_fuel_price_forecast_table = function(inputs)
{
    var tbody = $(".fuel-price-forecast-table").find("tbody");
    var tr  = tbody.find("tr");
    var fuel_price_forecast_table = 
            {
               table:"fuel_price_forecast_table",
               table_type:"dynamic",
               data:[]
            };
    
    for(var i = 0 ; i < tr.length;i++)
    {
        var data = '{';
        var select =   $(tr[i]).find("select");
        for(var z = 0 ; z < select.size(); z++)
        {
            data +=  '"'+ $(select[z]).attr("id")+'":"'+ $(select[z]).val()+'",';
        }
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            if(y === children.length - 1 )
            {
                
                data +=  '"'+ $(children[y]).attr("id")+'" :"'+ $(children[y]).val()+'"';
                continue;
            }
            data +=  '"'+ $(children[y]).attr("id")+'":"'+ $(children[y]).val()+'",';
            
           
        }
        data += '}';
        fuel_price_forecast_table.data.push(JSON.parse(data));
    }    
    inputs.data.push(fuel_price_forecast_table);
};
var get_data_from_tech_capital_dynamic_table = function(inputs)
{
    var tbody = $(".tech-capital-dynamic-table").find("tbody");
    var tr  = tbody.find("tr");
    var tech_capital_dynamic_table = 
            {
               table:"tech_capital_dynamic_table",
               table_type:"dynamic",
               data:[]
            };
    
    for(var i = 0 ; i < tr.length;i++)
    {
        var data = '{';
        var select =   $(tr[i]).find("select");
        for(var z = 0 ; z < select.size(); z++)
        {
            data +=  '"'+ $(select[z]).attr("id")+'":"'+ $(select[z]).val()+'",';
        }
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            if(y === children.length - 1 )
            {
                
                data +=  '"'+ $(children[y]).attr("id")+'" :"'+ $(children[y]).val()+'"';
                continue;
            }
            data +=  '"'+ $(children[y]).attr("id")+'":"'+ $(children[y]).val()+'",';
            
           
        }
        data += '}';
        tech_capital_dynamic_table.data.push(JSON.parse(data));
    }    
    inputs.data.push(tech_capital_dynamic_table);
};
var get_data_from_energy_storage_cost_dynamic_table = function(inputs)
{
    var tbody = $(".energy-storage-cost-dynamic-table").find("tbody");
    var tr  = tbody.find("tr");
    var energy_storage_cost_dynamic_table = 
            {
               table:"energy_storage_cost_dynamic_table",
               table_type:"dynamic",
               data:[]
            };
    
    for(var i = 0 ; i < tr.length;i++)
    {
        var data = '{';
        var select =   $(tr[i]).find("select");
        for(var z = 0 ; z < select.size(); z++)
        {
            data +=  '"'+ $(select[z]).attr("id")+'":"'+ $(select[z]).val()+'",';
        }
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            if(y === children.length - 1 )
            {
                
                data +=  '"'+ $(children[y]).attr("id")+'" :"'+ $(children[y]).val()+'"';
                continue;
            }
            data +=  '"'+ $(children[y]).attr("id")+'":"'+ $(children[y]).val()+'",';
            
           
        }
        data += '}';
        energy_storage_cost_dynamic_table.data.push(JSON.parse(data));
    }    
    inputs.data.push(energy_storage_cost_dynamic_table);
};
var get_data_from_programs_planning_criteria_table = function(inputs)
{
    var tbody = $(".programs-planning-criteria-table").find("tbody");
    var tr  = tbody.find("tr");
    var programs_planning_criteria_table = 
            {
               table:"programs_planning_criteria_table",
               table_type:"static",
               data:[]
            };
    
    for(var i = 0 ; i < tr.length;i++)
    {
        var data = '{';
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            if(y === children.length - 1 )
            {
                
                data +=  '"'+ $(children[y]).attr("id")+'" :"'+ $(children[y]).val()+'"';
                continue;
            }
            data +=  '"'+ $(children[y]).attr("id")+'":"'+ $(children[y]).val()+'",';
            
           
        }
        data += '}';
        programs_planning_criteria_table.data.push(JSON.parse(data));
    }    
    inputs.data.push(programs_planning_criteria_table);
};
var get_data_from_programs_renewables_table = function(inputs)
{
    var tbody = $(".programs-renewables-table").find("tbody");
    var tr  = tbody.find("tr");
    var programs_renewables_table = 
            {
               table:"programs_renewables_table",
               table_type:"static", 
               data:[]
            };
    
    for(var i = 0 ; i < tr.length;i++)
    {
        var data = '{';
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            if(y === children.length - 1 )
            {                
                data +=  '"'+ $(children[y]).attr("id")+'" :"'+ $(children[y]).val()+'"';
                continue;
            }
            data +=  '"'+ $(children[y]).attr("id")+'":"'+ $(children[y]).val()+'",';
            
           
        }
        data += '}';
        programs_renewables_table.data.push(JSON.parse(data));
    }    
    inputs.data.push(programs_renewables_table);
};
var get_data_from_programs_demand_side_table = function(inputs)
{
    var tbody = $(".programs-demand-side-table").find("tbody");
    var tr  = tbody.find("tr");
    var programs_demand_side_table = 
            {
              table:"programs_demand_side_table",
              table_type:"static",
              data:[]
            };
    for(var i = 0 ; i < tr.length;i++)
    {
        var data = '{';
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            if(y === children.length - 1 )
            {
                
                data +=  '"'+ $(children[y]).attr("id")+'" :"'+ $(children[y]).val()+'"';
                continue;
            }
            data +=  '"'+ $(children[y]).attr("id")+'":"'+ $(children[y]).val()+'",';
            
           
        }
        data += '}';
        programs_demand_side_table.data.push(JSON.parse(data));
    }    
    inputs.data.push(programs_demand_side_table);
};

var get_data_from_demand_table = function(inputs)
{
    var tbody = $(".demand-table").find("tbody");
    var tr  = tbody.find("tr");
    var demand_table = 
            {
              table:"demand_table",
              table_type:"static",
              data:[]
            };
    for(var i = 0 ; i < tr.length;i++)
    {
        var data = '{';
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            if(y === children.length - 1 )
            {
                
                data +=  '"'+ $(children[y]).attr("id")+'" :"'+ $(children[y]).val()+'"';
                continue;
            }
            data +=  '"'+ $(children[y]).attr("id")+'":"'+ $(children[y]).val()+'",';
            
           
        }
        data += '}';
        demand_table.data.push(JSON.parse(data));
    }    
    inputs.data.push(demand_table);
};
var get_data_from_generation_conventional_table = function(inputs)
{
    var tbody = $(".generation-conventional-table").find("tbody");
    var tr  = tbody.find("tr");
    var generation_conventional_table = 
            {
              table:"generation_conventional_table",
              table_type:"dynamic",
              data:[]
            };
    var data = "{";
    for(var i = 0 ; i < tr.length;i++)
    {
        var data = '{';
        var select =   $(tr[i]).find("select");
        for(var z = 0 ; z < select.size(); z++)
        {
            data +=  '"'+ $(select[z]).attr("id")+'":"'+ $(select[z]).val()+'",';
        }
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            if(y === children.length - 1 )
            {                
                data +=  '"'+ $(children[y]).attr("id")+'" :"'+ $(children[y]).val()+'"';
                continue;
            }
            data +=  '"'+ $(children[y]).attr("id")+'":"'+ $(children[y]).val()+'",';
            
           
        }
        data += '}';
        generation_conventional_table.data.push(JSON.parse(data));
        console.log(JSON.parse(data));
    }    
    inputs.data.push(generation_conventional_table);
};



var get_data_from_generation_hydro_table = function(inputs)
{
    var tbody = $(".generation-hydro-table").find("tbody");
    var tr  = tbody.find("tr");
    var generation_hydro_table = 
            {
              table:"generation_hydro_table",
              table_type:"static",  
              data:[]
            };
    for(var i = 0 ; i < tr.length;i++)
    {
        var data = '{';
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            if(y === children.length - 1 )
            {                
                data +=  '"'+ $(children[y]).attr("id")+'" :"'+ $(children[y]).val()+'"';
                continue;
            }
            data +=  '"'+ $(children[y]).attr("id")+'":"'+ $(children[y]).val()+'",';
            
           
        }
        data += '}';
        generation_hydro_table.data.push(JSON.parse(data));
    }    
    inputs.data.push(generation_hydro_table);
};

var get_data_from_hydro_monthly_energy_table = function(inputs)
{
    var tbody = $(".hydro-monthly-energy-table").find("tbody");
    var tr  = tbody.find("tr");
    var hydro_monthly_energy_table = 
            {
              table:"hydro_monthly_energy_table",
              table_type:"static",
              data:[]
            };
    for(var i = 0 ; i < tr.length;i++)
    {
        var data = '{';
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            if(y === children.length - 1 )
            {
                
                data +=  '"'+ $(children[y]).attr("id")+'" :"'+ $(children[y]).val()+'"';
                continue;
            }
            data +=  '"'+ $(children[y]).attr("id")+'":"'+ $(children[y]).val()+'",';
            
           
        }
        data += '}';
        hydro_monthly_energy_table.data.push(JSON.parse(data));
    }    
    inputs.data.push(hydro_monthly_energy_table);
};
var get_data_from_generation_renewables_table = function(inputs)
{
    
   var tbody = $(".generation-renewables-table").find("tbody");
    var tr  = tbody.find("tr");
    var generation_renewables_table = 
            {
              table:"generation_renewables_table",
              table_type:"static",
              data:[]
            };
    for(var i = 0 ; i < tr.length;i++)
    {
        var data = '{';
        var select =   $(tr[i]).find("select");
        for(var z = 0 ; z < select.size(); z++)
        {
            data +=  '"'+ $(select[z]).attr("id")+'":"'+ $(select[z]).val()+'",';
        }
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            if(y === children.length - 1 )
            {
                
                data +=  '"'+ $(children[y]).attr("id")+'" :"'+ $(children[y]).val()+'"';
                continue;
            }
            data +=  '"'+ $(children[y]).attr("id")+'":"'+ $(children[y]).val()+'",';
            
           
        }
        data += '}'; 
       generation_renewables_table.data.push(JSON.parse(data));
    }    
    inputs.data.push(generation_renewables_table);
};
var get_data_from_energy_storage_dynamic_table = function(inputs)
{
    var tbody = $(".energy-storage-dynamic-table").find("tbody");
    var tr  = tbody.find("tr");
    var energy_storage_dynamic_table = 
            {
              table:"energy_storage_dynamic_table",
              table_type:"dynamic",
              data:[]
            };
    for(var i = 0 ; i < tr.length;i++)
    {
        var data = '{';
        var select =   $(tr[i]).find("select");
        for(var z = 0 ; z < select.size(); z++)
        {
            data +=  '"'+ $(select[z]).attr("id")+'":"'+ $(select[z]).val()+'",';
        }
        var children = $(tr[i]).find("input");
        for(var y = 0; y < children.length;y++)
        {
            
            if(y === children.length - 1 )
            {
                
                data +=  '"'+ $(children[y]).attr("id")+'" :"'+ $(children[y]).val()+'"';
                continue;
            }
            data +=  '"'+ $(children[y]).attr("id")+'":"'+ $(children[y]).val()+'",';
            
           
        }
        data += '}';
       energy_storage_dynamic_table.data.push(JSON.parse(data));
    }    
    inputs.data.push(energy_storage_dynamic_table);
};

var get_data_from_calculation_settings = function(inputs)
{
    var calculation_settings_table = {
        table: "calculation_settings_table",
        table_type: "static",
        data: []
    };
    
    var tbody = $(".AA-settings-table").find("tbody");
    var tr = tbody.find("tr");
    
    for(var i = 0 ; i < tr.length;i++)
    {
        var data = '{';
        var select =   $(tr[i]).find("select");
        for(var z = 0 ; z < select.size(); z++)
        {
            data +=  '"'+ $(select[z]).attr("id")+'":"'+ $(select[z]).val()+'",';
        }
        var children = $(tr[i]).find("input");
        if (children.length===0)
        {
            data = data.slice(0,-1);
        }
        else
        {
            for(var y = 0; y < children.length;y++)
            {

                if(y === children.length - 1 )
                {

                    data +=  '"'+ $(children[y]).attr("id")+'" :"'+ $(children[y]).val()+'"';
                    continue;
                }
                data +=  '"'+ $(children[y]).attr("id")+'":"'+ $(children[y]).val()+'",';


            }
        }
        data += '}';
        console.log(data);
        calculation_settings_table.data.push(JSON.parse(data));
    }
    inputs.data.push(calculation_settings_table);
};
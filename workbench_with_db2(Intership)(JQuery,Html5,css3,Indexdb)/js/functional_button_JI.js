

var button_name = "";

var buttonobject = "";

var windowsProperty = "";

var aHref = "";
var B = false;

/******************

db variables
*******************/

var idbSupported = false;
var db;
var db_name = "functunality_buttons";
var db_table;
var openRequest ;
var e ;
var thisDB ;
var database;
var version ;

 
document.addEventListener("DOMContentLoaded", function(){
	
	
	
	
	$( "#add_functionality" )
      .button()
      .click(function() { 
	window.location.href = "functionality_button.html?N";  
   	  
	 
  });
    

	 
    if("indexedDB" in window) {
        idbSupported = true;
    }
	
	
	
	if(document.location.href[document.location.href.length - 1] == 'B')
	{
	
	    
		
        var url = document.location.href,
         params = url.split('?')[1].split('&'),
	     data = {},
		 tmp;
	
        
         for (var i = 0, l = params.length; i < l; i++) 
		 {
           tmp = params[i].split('=');
           data[tmp[0]] = tmp[1];
          
		   
		   button_name = data.button_name ;
           
           
		  
		   
			
		  
		 }  
		 
		
    
     
	
	 
    if(idbSupported) {
		
	     if(button_name)
		 {	
	         
             $(".container-document").addClass("hidden");
			 
			 $("#functionality_workbenck").removeClass("hidden");	
		     
			 openRequest = indexedDB.open(db_name);	 
            
		  }
		  else
		  {
			  $(".container-document").addClass("hidden");
              $("#functionality_workbenck").removeClass("hidden");				  
			  
		  }
		  
        openRequest.onupgradeneeded = function(e) {
			
            alert("Upgrading...");
		    thisDB = e.target.result;	
 
        }
       
        openRequest.onsuccess = function(e) {
			
             
			  
			
			db = e.target.result;
			
			var version = db.version;
			
			for(var y = 0 ; i < db.objectStoreNames.length ; y++)
			{		
                   
				
			      addButtons(db.objectStoreNames.item(i), y);
				 
				  
			}
			
				
				
							
			
			
        }
 
        openRequest.onerror = function(e) {
            alert("Error! Not Connected to IndexedDb ");
            console.dir(e);
        }
 
    }
	
	
	
	
	function addButtons(abutton_name, y)
	{
		
		 var transaction = db.transaction([abutton_name] , "readwrite" );
         var store = transaction.objectStore(abutton_name);
		 var index = store.index("name");
	
	    var checkKey =  index.getKey(abutton_name);
	
	    checkKey.onsuccess = function()
	    {
		
		  key = checkKey.result;
	
	
	    
	
	
	
	
	
	     var request = store.get(Number(key));
	  
          request.onsuccess = function(event) {
       
	   
	        
	     


		 var result = event.target.result;
		  
		  var name = result.button_setUp.name ;
          
		  var description = result.button_setUp.description ;		  
		  
		  var notes = result.button_setUp.notes ;
          
		  var bar = result.button_setUp.bar ;
          
		  var a_property = result.aproperty;
          
		  var popUpWindows = result.popUpWindowsProperty ;
		  

         for(var i = 0 ; i < aname.length ; i++)
			{
			
			       if( i == 0 )
				   {
				   
				       name = aname[i];
				   
				   
				   }
				   else
				   {
				   
				       name += aname[i];
				     
				   
				   }
			
			
			
			
			}		  
		  
		  createTheButton(name, description, notes, bar, a_property, popUpWindows ,y)
		
		
	   }
   }
}

function createTheButton(name, description, notes, bar, a_property, popUpWindows , y)
{
	
	var left = ( ( 410 * ( y - 1) ) + 5);
	
	 
	var document =[] ;
	    var buttonTemplate = '<button class ="button_container" style =" box-shadow: 10px 10px 5px #888888; background-color:##bbcbce; width:310px; border:1px solid black; position:absolute; top:80px; left:'+left+'px;" id="button#{button_name}">'	
	                        
	                      + '<input type ="button" value ="#{button_name}" id ="#{button_name}"><input type ="button" value ="Close!" id ="close#{button_name}"><br><br>'
						  + '<textarea rows ="5" cols ="20">#{description}</textarea><br><br>'
						  + '<input type ="button"  id ="add#{button_name}" value ="change configuration"><input type ="button" value ="Delete!" id ="delete#{button_name}">'
						  +'<br><br>'
						  +'</button>';
	   
	   
	  
	   
	 var aButton =  buttonTemplate.replace( /#\{button_name\}/g, name).replace( /#\{description\}/g, description);
	 
	 
	 
	 if(notes == true)
	 {
		 
		 
		 
	 }
	
	
	 
	 
	 $("#functionality_workbenck").find("#fun_container").append(aButton);
	 
	 
	 
	 
	 $("#functionality_workbenck").find("#close"+name).button().click(function(){
	  
	  
	  
	   $("#functionality_workbenck").find("#button"+name).css("background-color","#050505");
	  
	  for(var i = 0; i < popUpWindows.length; i++)
	  {
	        
			
			document[i].close() ;
	  }
	 
	 });
	 
	 
	 
	 
	 
	 
	 
	 $("#functionality_workbenck").find("#add"+name).button().click(function(){
	 
	 $("#functionality_workbenck").find("#button"+name).css("background-color","#e59a6c");
	 
	   window.location.href = "functionality_button.html?button_name="+name+"&F";
	 
	 });
	 
	 
	 
	 
	 $("#functionality_workbenck").find("#delete"+name).button().click(function(){
	 
	 
	
	 
	  if(db_name)
      { 
        
        
        database = db;
        version =  parseInt(database.version);
	
		version += 1;
		
        database.close();
		
	    
		
		if(version)
		{
		
           secondRequest = indexedDB.open(db_name,version);
	         
         
		}
		
       secondRequest.onupgradeneeded = function(e) {
		   
       alert("Upgrading...");
	   
       var thisDB = e.target.result;
			var location = document.referrer;
			
		    thisDB.deleteObjectStore(name);
		    
			alert("dataBase " + name + "Deleted!\nPlease Refresh!!!!!!!!!!!");
			
		
		}
	 
	 
	 }
	 
	 
	    	
	 });
	 
	 
	 
	 
	  
	 
		if(a_property != null && a_property != "")
		  {
			
		   for(var i = 0; i < a_property.length; i++)
		   {
		       
			   if(a_property[i].url != null)
		      
		      {
				
                
                 
			    var a = '<a href ="'+ a_property[i].url +'" target="_blank"> <button class = "'+ a_property[i].name +'">t</button></a>';
			    
			    $("#functionality_workbenck").find("#button" + name).append(a);
				$("#button" + name).find("." + a_property[i].name).hide();
				
			  }
			 
			
			 
		   }
		} 
	 
	 
	 $("#functionality_workbenck").find("#"+name).button().click(function(){
	 
	 
	 $("#functionality_workbenck").find("#button"+name).css("background-color","#e0dc85");
		 
	    
		  
		  if(notes == true)
	     {
		 
		 
		 
	     }
		  
		  
		  
		  
		   if(bar == true)
	       {
		 
  
 
    $( "#vtabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
    $( "#vtabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
	$("#vtabs").draggable();
	$("#vtab_pop").draggable();
		$("#vtab_pop").button().dblclick(function(){
	      
	       $(".workbench").find("#vtabs").toggleClass("hide")
		   .mouseout(function()
		   {
		      $(this).addClass("opacity");
		   }).mouseover(function()
		   {
		   
		      $(this).removeClass("opacity");

		       
		   });
	  });
 
  
 
   
 var verticalTab = '<div id ="vtab_pop" title ="dbl click to active/deactivate">'
                   + '<div id="vtabs" class = "hide selected" >'
				   +'<ul id ="sortable3">'
				   +'</ul></div></div>';

 $("#functionality_workbenck").find("#fun_container").append(verticalTab); 
		 
		 
		 
	 }		  
		  
		  if(a_property != null && a_property != "")
		  {
			
		   for(var i = 0; i < a_property.length; i++)
		   {
		      if(a_property[i] != "" && a_property[i] != null)
			  {
			     if(a_property[i].url != null )
		        {				
				   $("#button"+name).find("."+ a_property[i].name).show();
                   $("#button"+name).find("."+ a_property[i].name).focus();
                   $("#button"+name).find("."+ a_property[i].name).click();
                   $("#button"+name).find("."+ a_property[i].name).hide();
				  
			     
				 }
			  }
			 
			 
			 
		   }

		}
		
		if(popUpWindows != null)
        { 
	       for(var i = 0; i < popUpWindows.length; i++)
		   {
			   if(popUpWindows[i] != "" && popUpWindows[i] != null)
			   {
			      if(popUpWindows[i].url != null )
				  {
			        document[i] = window.open( popUpWindows[i].url , "", "width = 100", "height = 100") ;									           
	                document[i].moveTo( popUpWindows[i].x , popUpWindows[i].y ); 
	                document[i].resizeTo( popUpWindows[i].w , popUpWindows[i].h );
	             }
			   
			   
			   }
				 
			 
			 
			 
		   }
		}		   
		 
		 
	 });
     	 
	
	   
	   
   }
			   
	
	
	
	
	
	
	
	}// end of if	
	
	
	
	
	
},false);

 

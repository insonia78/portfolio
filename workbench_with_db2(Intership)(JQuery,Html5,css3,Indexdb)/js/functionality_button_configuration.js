var z = 0;
var i = 0 ;


var aHref = [] ;

var abutton_name = ""; 

var sticky_notes = false;

var side_bar = false;

var awindows ;
var a_property ;

var popUpWindows ;
var the_button_name ;

var notes_array = "";

var side_bar_array = "" ;


var button = "";
var exe_file = false ;
var objectStores = [];
var abutton = "";
var idbSupported = false;
var db;
var db_name = "functunality_buttons";
var db_table;
var openRequest ;
var e ;
var thisDB ;

var notes = "";
var bar = "";


 
document.addEventListener("DOMContentLoaded", function(){
	
   
   
   
   
   
   
   
   
   if("indexedDB" in window) {
        idbSupported = true;
    }
	
	
	if(document.location.href[document.location.href.length - 1] == 'F')
	{
	
	    
		
        var url = document.location.href,
         params = url.split('?')[1].split('&'),
	     data = {},
		 tmp;
	
       
         for (var i = 0, l = params.length; i < l; i++) 
		 {
           tmp = params[i].split('=');
           data[tmp[0]] = tmp[1];
          
		   
		   abutton_name = data.button_name ;
           
           
		  
		   
			
		  
		 }
		 
		 if(idbSupported) 
	    {
		
	     if(db_name)
		 {	
            	
		    
			 openRequest = indexedDB.open(db_name);	 
          
		  }
		 
        openRequest.onupgradeneeded = function(e) {
			
            alert("Upgrading...");
		    thisDB = e.target.result;	
 
        }
       
        openRequest.onsuccess = function(e) {
			
            alert("Success! Connected to IndexedDb ");
			
			db = e.target.result;	
            
			getData( abutton_name );			
			
        }
 
        openRequest.onerror = function(e) {
            alert("Error! Not Connected to IndexedDb ");
            console.dir(e);
        }
 
    }
	
function getData(button)
{  
		  
		 var transaction = db.transaction([ abutton_name ] , "readwrite" );
		 
         var store = transaction.objectStore( abutton_name );
		 
		 var index = store.index( "name" );
	
	     var checkKey =  index.getKey( abutton_name );
	
	    checkKey.onsuccess = function()
	    {
		
		    key = checkKey.result;	
	
	        var request = store.get( Number( key ) );
	  
            request.onsuccess = function(event) 
			{
       
	         var result = event.target.result;
		  
		     button = result.button_setUp ;
			
			notes_array = result.button_setUp.notes_array ;
		    
			the_button_name = result.name ;
			
            side_bar_array = result.button_setUp.side_bar_array ;           
			
			if(side_bar_array == null)
			{
				
				side_bar_array = [];
				
				
				
			}
			if(notes_array == null)
			{
				
				notes_array = [];
				
				
				
			}
			
			
			
			a_property = result.aproperty ;
          
		    popUpWindows = result.popUpWindowsProperty ;		  
		  
		 
		    infoButton( button );
			
		    info_a_Href( a_property );
			
		    infoWindows();
		
		
	   }
	  
		  
		
     }
 
 }// end of function
 
 var functionality_dialog = $( "#functionality_setUp" ).dialog({
      autoOpen: true,
      modal: true,
	  width: 1000,
	  height:1300,
      buttons: {
	   
        Add: function() {
			
			if( document.getElementById( 'sticky_notes' ).checked ) 
	       {
		       notes = true;
		 
	        }
	 
	  if( document.getElementById( 'side_bar' ).checked ) 
	 {
		    bar = true;
		 
	 }
			
			
			abutton =
			{
				
				name: $( '#functionality_setUp' ).find( "#button" ).val(),
		        description: $( '#functionality_setUp' ).find( "#popUp_description" ).val(),
                notes:notes,
                bar:bar,		
		        notes_array: notes_array,
		        side_bar_array: side_bar_array 
				
				
			}
			
			createTheButton() ;
			  					
          $( this ).dialog( "close" );
        },
        Cancel: function() {
			 window.location.href = "jira internship guide test with dataBase.html?button_name=J";
          $( this ).dialog( "close" );
        }
      },
      close: function() {
        form[ 0 ].reset();
      }
    });

 
    // addTab form: calls addTab function on submit and closes the dialog
    var form = functionality_dialog.find( "form" ).submit(function( event ) {
     
      dialog.dialog( "close" );
      event.preventDefault();
	  
    });

 
 // end of if
 

function infoButton( button )
{
	
	$( '#functionality_setUp' ).find( "#button" ).attr( 'value' , "" );
	
	$( '#functionality_setUp' ).find( "#popUp_description" ).append( "" ); 
	
	$( '#functionality_setUp' ).find( "#button" ).attr( 'value' , button.name );
	
	$( '#functionality_setUp' ).find( "#popUp_description" ).append( button.description ); 
	
	
	if( button.notes == true )
	{
	   $( '#functionality_setUp' ).find( '#sticky_notes' ).focus();
	   $( '#functionality_setUp' ).find( '#sticky_notes' ).click() ;
	}
	
	if(button.bar == true)
	{
	   $( '#functionality_setUp' ).find( '#side_bar' ).focus();
	   $( '#functionality_setUp' ).find( '#side_bar' ).click() ;
	}
	notes = button.notes;
	bar = button.bar;
	abutton =
	{
		name: $( '#functionality_setUp' ).find( "#button" ).val(),
		description: button.description,
        notes:button.notes,
        bar:button.bar,		
		 notes_array: notes_array,
		 side_bar_array: side_bar_array 
		
		
	}
	
	
	
}

/*******************************









*************************************/








function info_a_Href( a_property )
{
	var indexI = 0 ;
	var i ;
	var w = 0;
	
	for(var i = 0 ; i < a_property.length; i++)
	{
	   
            if( a_property[ i ] == "")
			{
				
				
			}
             else
			 {
				 
			 


     	   var left = 0;
					 
					 if( w == 0)
					 {
					    left = (230 * w) ;
					 }
					 else
					 {
						 left = ((230 * w) + (15 * w));
					 }
		
		
		aHref[ w ] = a_property[ i ];
		
		var atemplate = 
                                    '<div id ="aHref_container'+w+'" style ="background-color:white;border:1px solid black; width:240px;height:290px; position:absolute; top:130px; left:'+left+'px; float:left;" class ="a">'
				                     + '<label><u>Name of the a href'+ w +'</ul><br><input value = "#{aName}" width = "80px" type="url" id ="a_Name'+ w +'"><br>'
									 + '<label><u>Url for the a href '+ w +'</ul><br><input title = "#{aUrl}" value = "#{aUrl}" width = "80px" type="url" id ="a_Url'+ w +'"><br>'
									 + '<label>Description</label><br><textarea rows ="3" cols ="23" id = "a_description'+ w +'">#{aDes}</textarea><br><br>'
									 
									 + '<input id ="exe_file'+ w +'" type="checkbox" name="animal" value="aexe_file" />exe_file?<br />'
                                     
									 + '<input type ="button" id="aDelete'+ w +'" value = "delete!"><input type ="button" id="aAdd'+ w +'" value = "Add!"><img src ="images/cheked.jpg" width ="25" height="25" id="checked'+ w +'"></div><br><br>';
  
		
		
		var a = atemplate.replace( /#\{aName\}/g, a_property[i].name).replace( /#\{aUrl\}/g, a_property[i].url).replace( /#\{aDes\}/g, a_property[i].description);
		
		
		$( "#functionality_setUp" ).find( "#aInsert" ).append( a );
		 indexI = w++ ;
		 
		 indexI += 1;
		}
		
		
		$( "#functionality_setUp" ).find( ".a" ).mouseover(function(){

					      var a = $(this).attr( "id" )
						  
						  i = Number( a[a.length - 1] );
					
				  
				  $( "#functionality_setUp" ).find( "#aDelete" + i ).button().click(function()
			      {
					  $("#functionality_setUp").find( "#aHref_container" + i ).remove();
					  
					  
					  					 
								   
								   aHref[i] = "";
							   
							   
							
							   
							   
							   
						   
					  
				  });
				  
				  
				 });  
				  
				  
				  
				  $( "#functionality_setUp" ).find( "#aAdd" + i ).button().click(function()
			      {
					  
				    
				    
					   
					
				    var aLinks =
				    {
						
					  name : $("#a_Name"+i).val(),
					  description : $("#a_description"+i).val(),
					  url: $("#a_Url"+i).val(),			 
					  anewTab:exe_file
				    
					}
				    
					$("#functionality_setUp").find("#checked"+i).replaceWith('<img src ="images/changed.png" width ="25" height="25" id="checked">');
				    
					aHref[i] = aLinks ; 
					
					
					
					
					
	              });
				
				
			
		
	}
	 $("#functionality_setUp").find("#aHref").button().click(function()
			 {
				 
				 	 var left = 0;
					 
					 if( indexI == 0)
					 {
					    left = ( 230 * indexI ) ;
					 }
					 else
					 {
						 left = ( ( 230 * indexI )  + ( 15 * indexI ) );
					 }
				 
				 
				
				 var i = indexI ;
				  var atemplate = 
                                    '<div id ="aHref_container'+i+'" style ="background-color:white;border:1px solid black; width:240px;height:290px; position:absolute; top:130px; left:'+left+'px; float:left;" class ="a">'
				                     + '<label><u>Name of the a href'+ i +'</ul><br><input width = "80px" type="url" id = "a_Name'+i+'" ><br>'
									 + '<label><u>Url for the a href '+ i +'</ul><br><input width = "80px" type="url" id = "a_Url'+i+'" ><br>'
									 + '<label>Description</label><br><textarea rows ="3" cols ="23" id = "a_description'+i+'"></textarea><br><br>'
									 
									 + '<input id ="exe_file'+i+'" type="checkbox" name="animal" value="aexe_file" />exe_file?<br />'
                                     
									 + '<input type ="button" id="aDelete' + i + '" value = "delete!"><input type ="button" id="aAdd' + i + '" value = "Add!"></div><br><br>';
  
				 
				 $("#functionality_setUp").find( "#aInsert" ).append( atemplate );
				 
			     
				
				 
				  if( document.getElementById( 'exe_file' + i ).checked ) 
	              {
					  
		             exe_file = true;
		 
	              }
				   $("#functionality_setUp").find(".a").mouseover(function(){

					      var a = $(this).attr("id")
						  i = Number(a[a.length - 1]);
					 });
				  
				  $( "#functionality_setUp" ).find( "#aDelete" + i ).button().click(function()
			      {
					  $( "#functionality_setUp" ).find( "#aHref_container" + i ).remove();
					  
					var count = 0
					  
					  for(var y = i ; y <= aHref.length - 1 ;y++)
						   {
							   if(i == aHref.length - 1 )
							   {
								   aHref[i] = "";
								  
							   }
							   else
							   {
								   aHref[i] = aHref[ i + 1 ] ;
							   }
							   
							   count++ ;
							   
						   }
						   indexI = count + y ;
						 
					  
				  });
				  
				  
				  
				  
				  
				  
				  $( "#functionality_setUp" ).find( "#aAdd" + i ).button().click(function()
			      {
					  
					  
									
					   var anewName = $( "#a_Name" + i).val().split(' ');					 
					
					 
					var name ;
					
					for( var y = 0 ; y < anewName.length; y++ )
					{
						
						if( y == 0 )
						{
							
                          name = anewName[ y ]; 						    	
							
							
						}
						else
						{
						
    						name += anewName[ y ];
						
						}
						
					}
				   
					 
				    var aLinks =
				    {
					  name : name,
					  description : $( "#a_description" + i ).val(),
					  url: $("#a_Url" + i ).val(),			 
					  anewTab:exe_file
				    }
				   
				   $("#functionality_setUp").find( "#aHref_container" + i ).append('<img src ="images/cheked.jpg" width ="25" height="25" id="checked">');

				   aHref[ i ] = aLinks ; 

				   ++indexI;
				   
				   
				   
	              });
				
				 
			 });
	
	
	
	
}
	
function infoWindows()
{
	var z ;
	var h = 0 ;
	var zindex ;
	
	var aid ;
	
	for( i = 0 ; i < popUpWindows.length ; i++)
	{
		
		if( popUpWindows[ i ] == "")
		{
			
			continue;
			
		}
		else
		{
			
		z = h ;
		             var left = 0;
		
		
					 if(h  == 0)
					 {
					    left = ( ( 200 * h ) );
					 }
					 else
					 {
						 left = ( (200 * h ) + (35 * h ) );
					 }
		
	
	
	
	var popUpInfo = 
					                '<div class ="container" style ="background-color:white; width:220px;height:360px;border:1px solid black; position:absolute; top:80px; left:'+left+'px; float:left;" id ="w'+ h +'">'					               
									+'<text id ="' + h + '" ><u>POP Up Window '+ h  +'</u></text><br><br>'
									+' x = '+ popUpWindows[ i ].x +'<br>'
									+' y = '+ popUpWindows[ i ].y +'<br>'
									+' w = '+ popUpWindows[ i ].w +'<br>'
									+' h = '+ popUpWindows[ i ].h +'<br>'
									+' url = <input type ="url" value = "'+ popUpWindows[ i ].url +'"><br><br>d :'
									+' <textarea rows ="3" cols ="20"> '+ popUpWindows[ i ].description +'</textarea><br><br>'
									+'<input type="button" id="deleteW'+h+'" value="delete"><img width ="15" height="15" id="checked" src= "images/cheked.jpg"><br>';
									+'</div><br>' ;
									
	
	
	 $( "#functionality_setUp" ).find( "#popUpWindowContainer" ).append( popUpInfo );
	
	h++ ;
	
		
	 
	
					 
					$( "#functionality_setUp" ).find( ".container" ).mouseover(function(){

					      var a = $( this ).attr( "id" );
						  
						  aid = Number(a[a.length - 1]);
						  
						  
					 });
					 
					  $( "#functionality_setUp" ).find( "#deleteW" + z ).button().click(function()
			         {
						 
			               $("#functionality_setUp").find( "#w" + aid ).remove();
						   
						   $( "#popUp_setUp" ).find("#" + aid ).remove();
						   
						  
								   popUpWindows[ aid ] = "" ;
								   
							  	 
			        });
				
					 
		
					
	}		
					
				
	
	} // end of for 
	
	
	$( "#popUp_container" ).find( "#popUp_setUp1" ).button().click(function(){
			 
			 $( '#popUp_setUp' ).dialog( "open" );
			 
			 
			 
              
			  var q = 0 ;
			 
			 for(var u = 0 ; u < popUpWindows.length ; u++  )
			 {
				 
				 if( popUpWindows[ u ] == "" )
				 {
					 continue;
					 
				 }
				 else
				 {
					 
				 
				   
				 
				 var screentemplate = '<div  style = "position:absolute;top: #{y}; left:#{x}; width: #{w};heigth:#{h}; z-index:'+ q +'" class ="popUp ui-widget-content" id ="'+ q +'"><input type ="button" class = "confirm_position" id="confirm_position'+ q +'" value = "confirm_position"><img src ="images/cheked.jpg" width ="15" height="15" id="checked'+ q +'"><br><br>'
				                     +'<iframe  src ="#{src}" id="preview" style= "z-index:1; width:100%; height:100%;"  sandbox></iframe>'
									 +'<div style = "z-index:2; position:absolute; top:65px; left:0px;">'
									 + '<label>Url for the screen "'+ q +'"<br><input value ="#{url}" width = "80px" type="url" id = "popUp_Url' + q + '"><br>'
									 + "<label>Description</label><br><textarea rows ='7' cols ='23' id = 'popUp_description"+ q +"'>#{d}</textarea><br>"
									 + '</div>'
									 +'</div>';
				 
				
				 
				 var w = screentemplate.replace( /#\{y\}/g, popUpWindows[ u ].y).replace( /#\{x\}/g, popUpWindows[ u ].x).replace( /#\{w\}/g, popUpWindows[ u ].w).replace( /#\{h\}/g, popUpWindows[ u ].h)
				         .replace( /#\{url\}/g, popUpWindows[ u ].url).replace( /#\{d\}/g, popUpWindows[ u ].description).replace( /#\{src\}/g, popUpWindows[ u ].url);
		
		
		             
		
				 $( "#popUp_setUp" ).append( w );
				 z = q++ ;
				 
			 }
			 z += 1 ;
		}
	 
	 $( "#popUp_setUp" ).find( ".popUp" ).resizable();
               
         
	 $( "#popUp_setUp" ).find( ".popUp" ).draggable();
      
	 
	 
	
		 
	$( "#popUp_setUp" ).find( ".quick_menu_container" ).draggable();
  	
	
	
	  $("#popUp_setUp").find('.popUp').mouseover(function(){

				    var obj = $(this);
					
                   id = Number( $( this ).attr( "id" ) );	
		  
				 
				  $( this ).find( "#popUp_Url" + id ).mouseout(function(){
					  
					  
					  
		                try
						{                    
          
	                       obj.find( '#preview' ).attr( "src", $( this ).val() );
						}
						catch(e)
						{
							
						}
					  
					 
					  
				  });
				  
				  
				  
				  
	});
				   
				 
                   
				 
				 $("#popUp_setUp").find( ".confirm_position" ).button().click(function(e){
					 
					 alert("Registered..");
					 
					  
                                          
					  awindows = new windows();
					  
					  	button_name = $( "#button" ).val() ;					
	 
	                     button_description = $( "#popUp_description" ).val();					
						
						 awindows.x = e.screenX;
						
						awindows.y = e.screenY;
						
						awindows.w = $( "#popUp_setUp" ).find( ".popUp" ).width();
						
						awindows.h = $( "#popUp_setUp" ).find( ".popUp" ).height();
						
						awindows.url = $( "#popUp_setUp" ).find( "#popUp_Url" + id ).val();
						
						awindows.description = $( "#popUp_setUp" ).find( "#popUp_description" + id ).val();
						
						
						
						 $( "#" + id ).find( "#checked" ).replaceWith('<img src ="images/cheked.jpg" width ="25" height="25" id="checked">'); 
						 
					 popUpWindows[ id ] = awindows ;
					
					
					 
				
					 
			});
			
			 $( "#popUp_setUp" ).find( "#getAdd" ).button().click(function()
			 {				 
				
				 
				  
				  
				 
				 $( '#functionality_setUp' ).find( "#button" ).attr( 'value' , "" );
	
	              $( '#functionality_setUp' ).find( "#popUp_description" ).val( "" );
				  
				  $( '#functionality_setUp' ).find( "#button" ).attr( 'value' , button_name );
	
	              $( '#functionality_setUp' ).find( "#popUp_description" ).val( button_description );
				  
				  abutton =
				  {
					  name: button_name,
					  description: button_description,
					  notes:notes,
					  bar:bar,
					  notes_array: notes_array,
		              side_bar_array: side_bar_array 
					  
					  
				  }
				  
				  
				 $( "#popUp_setUp" ).dialog( "close" );
				 
				 var q = 0;
				 
				  for(var u = 0 ; u < popUpWindows.length ; u++  )
			     {
				       $( "#functionality_setUp" ).find("#w" + u ).remove() ;
				       $( "#popUp_setUp" ).find("#" + u).remove();
					   
					   
					   if( popUpWindows[ u ] == "" )
				       {
						  
						  
						             
					    
					 
				        }
				        else
				        {
				 
				       
					         
					   
					         
			
				 
				 
				 
				 var left = 0;
					 
					 
					 if( id == 0 )
					 {
					    left =  ( 200 * q )  ;
					 }
					 else
					 {
						 left =  ( 200 * q ) + ( 15 * q ) ;
					 }
					  
					 
					 
					 var popUpInfo = 
					                '<div class ="container" style ="background-color:white; width:220px;height:360px;border:1px solid black; position:absolute; top:80px; left:'+left+'px; float:left;" id ="w'+ q +'">'					               
									+'<text id ="' + q + '" ><u>POP Up Window '+ q  +'</u></text><br><br>'
									+' x = '+ popUpWindows[ u ].x +'<br>'
									+' y = '+ popUpWindows[ u ].y +'<br>'
									+' w = '+ popUpWindows[ u ].w +'<br>'
									+' h = '+ popUpWindows[ u ].h +'<br>'
									+' url = <input type ="url" value = "'+ popUpWindows[ u ].url +'"><br><br>d :'
									+' <textarea rows ="3" cols ="20"> '+ popUpWindows[ u ].description +'</textarea><br><br>'
									+'<input type="button" id="deleteW'+ q + '" value="delete"><img width ="15" height="15" id="checked" src= "images/cheked.jpg"><br>';
									+'</div><br>' ;
									
					 
					 
					 
					 
					 
					 
					 
					 $( "#functionality_setUp" ).find( "#popUpWindowContainer" ).append( popUpInfo );
					 
					 
					 
					 
					 
					 
					 $( "#functionality_setUp" ).find( ".container" ).mouseover(function(){

					      var a = $( this ).attr( "id" );
						  
						  zid = Number(a[a.length - 1]);
						  
						  
					 });
					 
					  $( "#functionality_setUp" ).find( "#deleteW" + q ).button().click(function()
			         {
						 
			               $("#functionality_setUp").find( "#w" + zid ).remove();
						   
						   $( "#popUp_setUp" ).find("#" + zid ).remove();
						   
						   
							   popUpWindows[ zid ] = "" ;
								   
							   
						 
						   
						   
			 
			        });
					q++;
				 
					
			     }
						 
		    }
				 
				 
				 
				 
				 
				 
			 });
	});
			  $( "#popUp_setUp" ).find( "#getScreen" ).button().click(function(e){

                
					 
					 
					
		  
				
				var screentemplate = '<div class ="popUp ui-widget-content hover" id ="'+ z +'" style ="z-index:'+ z +'"><input type ="button" id= "confirm_position'+z+'" class = "confirm_position" value = "confirm_position"><img width ="15" height="15" id="checked"><br><br>'
				                     + '<iframe  id="preview" style= "z-index:1; width:100%; height:100%;"  sandbox></iframe>'
									 +'<div style = "z-index:2; position:absolute; top:65px; left:0px;">'
   									 + '<label>Url for the screen "'+ z +'"<br><input width = "80px" type="text" id = "popUp_Url'+z+'"><br>'
									 + "<label>Description</label><br><textarea rows ='7' cols ='23' id = 'popUp_description"+z+"'></textarea><br>"
									 +'</div>'
									 + '</div>';
				 
				 $( "#popUp_setUp" ).append( screentemplate );
				 
				   $( "#popUp_setUp" ).find( ".popUp" ).resizable();
               
         
		        $( "#popUp_setUp" ).find( ".popUp" ).draggable();
				 
		
				 z++;
				 
              
  			     $("#popUp_setUp").find('.popUp').mouseover(function(){

				    var obj = $(this);
					
                   id = Number( $( this ).attr( "id" ) );	
		  
				 
				  $( this ).find( "#popUp_Url" + id ).mouseout(function(){
					  
					  
					  
		                try
						{                    
          
	                       obj.find( '#preview' ).attr( "src", $( this ).val() );
						}
						catch(e)
						{
							
						}
					  
					 
					  
				  });
				  
				  
				  
				  
			});
				   
				 
                   
				 
				 $("#popUp_setUp").find( ".confirm_position" ).button().click(function(e){
					 
					 alert("Registered..");
					 
					  awindows = new windows();
					      button_name = $( "#button" ).val() ;
	                    					
						
	 
	                     button_description = $( "#popUp_description" ).val();
					     
					     $( '#functionality_setUp' ).find( "#button" ).attr( 'value' , "" );
	
	                     $( '#functionality_setUp' ).find( "#popUp_description" ).append( "" );   
					    
                         $( '#functionality_setUp' ).find( "#button" ).attr( 'value' , button_name );
	
	                     $( '#functionality_setUp' ).find( "#popUp_description" ).append( button_description );
						
						
						
						
						awindows.x = e.screenX;
						
						awindows.y = e.screenY;
						
						awindows.w = $( "#popUp_setUp" ).find( ".popUp" ).width();
						
						awindows.h = $( "#popUp_setUp" ).find( ".popUp" ).height();
						
						awindows.url = $( "#popUp_setUp" ).find( "#popUp_Url" + id ).val();
						
						awindows.description = $( "#popUp_setUp" ).find( "#popUp_description" + id ).val();
						
						
						 $( this ).find( "#checked" ).replaceWith('<img src ="images/cheked.jpg" width ="25" height="25" id="checked">'); 
						 
					 popUpWindows[ id ] = awindows ;
					
					 
				
					 
			});
				 
				 
		  });	
			 $( "#popUp_setUp" ).find( "#getUrl" ).button().click(function()
			 {
				 var features = [];
				 features.push("scrollbars","menubar","location","toolbar");
				var document = window.open( "getUrl.html" , features.join(","), "width = 100", "height = 100") ;									           
	            document.moveTo( 800 , 600 ); 
	            document.resizeTo( 800 , 1000 );
	
				 
			 });
			 
			  $( "#functionality_setUp" ).find( "#agetUrl" ).button().click(function()
			 {
				 var features = [];
				 features.push("scrollbars","menubar","location","toolbar");
				var document = window.open( "getUrl.html" , features.join(","), "width = 100", "height = 100") ;									           
	             document.moveTo( 800 , 600 ); 
	            document.resizeTo( 800 , 1000 );
	
				 
			 });
			
			
			
			 $( "#popUp_setUp" ).find( "#getDelete" ).button().click(function()
			 {
				  var q = 0;
				 
				  for(var u = 0 ; u < popUpWindows.length ; u++  )
			     {
				 
				       if( popUpWindows[ u ] == "" )
				       {
					       continue;
					 
				        }
				        else
				        {
				 
				       
					         $( "#popUp_setUp" ).find("#" + q).remove();
					   
					         q++;
				 
				 
				 
				         }
						 
				 }
				 
				 $( "#popUp_setUp" ).dialog( "close" );
				 
			 });
			
 
 
 
 
  
 
 
 
}
 $( "#popUp_setUp" ).find( "#getUrl" ).button().click(function()
			 {
				 var features = [];
				 features.push("scrollbars","menubar","location","toolbar");
				var document = window.open( "getUrl.html" , features.join(","), "width = 100", "height = 100") ;									           
	            document.moveTo( 800 , 600 ); 
	            document.resizeTo( 800 , 1000 );
	
				 
			 });
			 
			  $( "#functionality_setUp" ).find( "#agetUrl" ).button().click(function()
			 {
				 var features = [];
				 features.push("scrollbars","menubar","location","toolbar");
				var document = window.open( "getUrl.html" , features.join(","), "width = 100", "height = 100") ;									           
	             document.moveTo( 800 , 600 ); 
	            document.resizeTo( 800 , 1000 );
	
				 
			 });

	 
			 



var popUp_setUp = $( "#popUp_setUp" ).dialog({
			 
      autoOpen: false,
      modal: true,
	  width: 3000,
	  height:2000,
       buttons: {
	   
        Add: function() {
			button_name = $( "#button" ).val() ;					
	 
	        button_description = $( "#popUp_description" ).val();	
            
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
        form[ 0 ].reset();
      }
    });
    

 
    // addTab form: calls addTab function on submit and closes the dialog
    var form = popUp_setUp.find( "form" ).submit(function( event ) {
     
      dialog.dialog( "close" );
      event.preventDefault();
	  
    });
		 




function createTheButton()
{
	
	
	var secondRequest = "";
	
	var database ;
	
    
			
	var transaction = db.transaction([ abutton_name ] , "readwrite" );
	
    var store = transaction.objectStore( abutton_name );
			
			
			var index = store.index( "name" );
	
	        var checkKey =  index.getKey( abutton_name );
	
	checkKey.onsuccess = function()
	{	
		
       var version = checkKey.result;
	   
	   
	
		   var request = store.get( version );
		   
		   request.onsuccess = function(e)
		   {
			   
			  var result = e.target.result;
			  
			 var button_configuration = 
			{
				name : the_button_name,
				button_setUp : abutton,
				popUpWindowsProperty : popUpWindows,
				aproperty : aHref,
				 notes_array: notes_array,
		         side_bar_array: side_bar_array 
				
				
			}
			  
			 
			  
			
			var success = store.put( button_configuration , version );
			  
			  success.onsuccess = function(e)
		    {
				
			  alert("The button was updated!");
			  window.location.href = "jira internship guide test with dataBase.html?button_name=J" ;
            
			}   
		  
		  }
	    
	 }
	 
   }
   
   
   
   
   
	
	
 }


  },false);

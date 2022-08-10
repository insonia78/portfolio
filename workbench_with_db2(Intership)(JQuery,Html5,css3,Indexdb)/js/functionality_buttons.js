

var z = 0;
var i = 0 ;

var popUpScreen = [];
var aHref = [] ;

var button_name = ""; 
 var button_description = "";
var sticky_notes = false;

var side_bar = false;

var notes_array = "";



var awindows ;
var zid = 0 ;
var button = "";
var exe_file = false ;
var objectStores = [];

var popUpArray = [];


var indexI = 0 ;

var idbSupported = false;
var db;
var db_name = "functunality_buttons";
var db_table;
var openRequest ;
var e ;
var thisDB ;

 
document.addEventListener("DOMContentLoaded", function(){
	
   if("indexedDB" in window) {
        idbSupported = true;
    }
if(document.location.href[document.location.href.length - 1] == 'N')
{
		
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
            for(var i = 0 ; i < db.objectStoreNames.length ; i++)
			{		
                   
				 
			      objectStores[String(db.objectStoreNames.item(i))] = db.objectStoreNames.item(i);
				 
				  
			}			
			
			
        }
 
        openRequest.onerror = function(e) {
            alert("Error! Not Connected to IndexedDb ");
            console.dir(e);
        }
 
    }

	
	
  
   
			 $("#functionality_setUp").find( "#aHref" ).button().click(function()
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
									 
									 + '<input id ="exe_file' + i + '" type="checkbox" name="animal" value="exe_file" />.exe File?<br />'
                                     
									 + '<input type ="button" id="aDelete' + i + '" value = "delete!"><input type ="button" id="aAdd' + i + '" value = "Add!"></div><br><br>';
  
				 
				 $("#functionality_setUp").find( "#aInsert" ).append( atemplate );
				 
			
				
				 
				  
				   $("#functionality_setUp").find(".a").mouseover(function(){
					    if( document.getElementById( 'exe_file' + i ).checked ) 
	              {
					 
		              exe_file = true;
		 
	              }

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
			 
 
	  
	 
	  if(document.location.href[document.location.href.length - 1] == 'N')
     {
	 
	  
	  
         $( "#popUp_container" ).find( "#popUp_setUp1" ).button().click(function(){
			 
			 
			 
			 
			 
			 $( '#popUp_setUp' ).dialog( "open" );				 
			 
		 
		 
		 
		 });
		 
	 }  
		  
		  $("#popUp_setUp").find(".quick_menu_container").draggable();
		 
		 
		 
		 
		 
		 /****************************************************
		 
		  seting up the pop up screen in the enviroment 
		 
		 
		 
		 
		 
		 ********************************************************/
		  var id = "";
		  
		  
					 
		
		
		 
		  $( "#popUp_setUp" ).find( "#getScreen" ).button().click(function(e){

                
		       
				
				var screentemplate = '<div class ="popUp ui-widget-content hover" id ="'+z+'" style ="z-index:'+ z +'"><input type ="button" id= "confirm_position'+z+'" class = "confirm_position" value = "confirm_position"><img width ="15" height="15" id="checked"><br><br>'
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
					  
					     
					     $( '#functionality_setUp' ).find( "#button" ).attr( 'value' , "" );
	
	                     $( '#functionality_setUp' ).find( "#popUp_description" ).append( "" );   
					    

						button_name = $( "#button" ).val() ;
						
						
	 
	                     button_description = $( "#popUp_description" ).val();
						
						
						
						awindows.x = e.screenX;
						
						awindows.y = e.screenY;
						
						awindows.w = $( "#popUp_setUp" ).find( ".popUp" ).width();
						
						awindows.h = $( "#popUp_setUp" ).find( ".popUp" ).height();
						
						awindows.url = $( "#popUp_setUp" ).find( "#popUp_Url" + id ).val();
						
						awindows.description = $( "#popUp_setUp" ).find( "#popUp_description" + id ).val();
						
						
						 $( "#" + id ).find( "#checked" ).replaceWith('<img src ="images/cheked.jpg" width ="25" height="25" id="checked">'); 
						 
					 
					
					 var left = 0;
					 
					 
					 if( id == 0 )
					 {
					    left =  ( 200 * id )  ;
					 }
					 else
					 {
						 left =  ( 200 * id ) + ( 15 * id ) ;
					 }
					  
					 
					 
					 var popUpInfo = 
					                '<div class ="container" style ="background-color:white; width:220px;height:360px;border:1px solid black; position:absolute; top:80px; left:'+left+'px; float:left;" id ="w'+ id +'">'					               
									+'<text id ="' + id + '" ><u>POP Up Window '+ id  +'</u></text><br><br>'
									+' x = '+ awindows.x +'<br>'
									+' y = '+ awindows.y +'<br>'
									+' w = '+ awindows.w +'<br>'
									+' h = '+ awindows.h +'<br>'
									+' url = <input type ="url" value = "'+ awindows.url +'"><br><br>d :'
									+' <textarea rows ="3" cols ="20"> '+ awindows.description +'</textarea><br><br>'
									+'<input type="button" id="deleteW'+id+'" value="delete"><img width ="15" height="15" id="checked" src= "images/cheked.jpg"><br>';
									+'</div><br>' ;
									
					 
					 
					 
					 
					 
					 
					 
					 $( "#functionality_setUp" ).find( "#popUpWindowContainer" ).append( popUpInfo );
					 
					 
					 
					 
					 popUpScreen[ id ] = awindows;
					 
					 $( "#functionality_setUp" ).find( ".container" ).mouseover(function(){

					      var a = $( this ).attr( "id" );
						  
						  zid = Number(a[a.length - 1]);
						  
						  
					 });
					 
					  $( "#functionality_setUp" ).find( "#deleteW" + id ).button().click(function()
			         {
						 
			               $("#functionality_setUp").find( "#w" + zid ).remove();
						   
						   $( "#popUp_setUp" ).find("#" + zid ).remove();
						   
						   for(var i = zid ; i <= popUpScreen.length - 1 ;i++)
						   {
							   
							   
							   if(zid == popUpScreen.length - 1)
							   {
								   popUpScreen[ i ] == "" ;
								   
							   }
							   else
							   {
							      popUpScreen[ i ] = popUpScreen[ i + 1] ;
							   }
							   
						   
						   
						   }
			 
			        });
				
					 
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
			 
			 
			 
			 
			 
			 $( "#popUp_setUp" ).find( "#getAdd" ).button().click(function()
			 {				 
				
				 z++;
				
				$("#button").attr( "value" , button_name.split(' ') );
			
    			
				
				$( "#popUp_description" ).append( button_description ); 			 
  
                 for( var y = 0 ; y < aHref.length ; y++ )
				 {					
					
					 $( "#a_Name" + y ).attr( 'value' , aHref[ y ].name );
					 $( "#a_description" + y ).append( aHref[ y ].description );
					 $( "#a_Url" + y ).attr( 'value' , aHref[ y ].url );
					 
					 
				 }					 


				
				 
				 $( "#popUp_setUp" ).dialog( "close" );
				 
				 
			 });
			 
			 
			 
			 $( "#popUp_setUp" ).find( "#getDelete" ).button().click(function()
			 {
				 
				 $( "#popUp_setUp" ).dialog( "close" );
				 
			 });
			 
			 
			 
			 
		 var popUp_setUp = $( "#popUp_setUp" ).dialog({
			 
      autoOpen: false,
      modal: true,
	  width: 3000,
	  height:2000,
       buttons: {
	   
        Add: function() {
            
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
		 
		 
	 
 
if(document.location.href[document.location.href.length - 1] == 'N')
{
	 
  
 
var functionality_dialog = $( "#functionality_setUp" ).dialog({
      autoOpen: true,
      modal: true,
	  width: 1000,
	  height:1300,
      buttons: {
	   
        Add: function() {
			getData();
		   createTheButton();
					
          $( this ).dialog( "close" );
        },
        Cancel: function() {
			
			window.location.href = "jira internship guide test with dataBase.html?=J";
          
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
}
	
	
	
  
  function getData()
  {
       var abutton_name = $("#button").val().split(' ');
	
          for(var i = 0 ; i < abutton_name.length; i++)
		  {
			  
			  
			    if( i == 0)
				{
					
					button_name = abutton_name[i];					
					
				}
				else
				{
		          button_name += abutton_name[ i ];
			    }
			  
			  
		  }
	   
	   

	   button_description = $( "#popUp_description" ).val();
	  
	 
	 
	 if( document.getElementById( 'sticky_notes' ).checked ) 
	 {
		 sticky_notes = true;
		 
	 }
	 
	  if( document.getElementById( 'side_bar' ).checked ) 
	 {
		 side_bar = true;
		 
	 }
	 
	 
	 button = 
	 {
		 name : button_name,
		 description : button_description,
		 notes : sticky_notes,
		 bar: side_bar,
		 notes_array: [],
		 side_bar_array:[]
		 
	 }
	 
	  
   	 
  }
  function createTheButton()
{
	//checkNames(button_name);
	
	var secondRequest = "";
	
	var database ;
	
    var version ;
	
	
	if(db_name)
   { 
        
        
        database = db;
        version =  parseInt( database.version );
	
		version += 1;
		
        database.close();
		
	    
		
		if(version)
		{
		
           secondRequest = indexedDB.open( db_name,version );
	         
         
		}
		
       secondRequest.onupgradeneeded = function(e) {
		   
       alert("Upgrading...");
	   
       var thisDB = e.target.result;
			
			
			
			
			
			if(!thisDB.objectStoreNames.contains( button_name ) ) 
			{
              
    		    var objectStore = thisDB.createObjectStore(button_name, {autoIncrement: true});
			   
				objectStore.createIndex( "name" , "name" , { unique : true });
				
				
				alert("the data has been updated");
            }
			else
			{
				alert("the button already exist");
				
			}
 
        }
		
		
		
		
		
		secondRequest.onsuccess = function(e) 
		{
            alert("Success! Connected to IndexedDb ");
            db = e.target.result;
			
			 var transaction = db.transaction([button_name] , "readwrite" );
			 
            var store = transaction.objectStore(button_name);
			
			var button_configuration = 
			{
				name : button_name,
				button_setUp : button,
				popUpWindowsProperty : popUpScreen,
				aproperty : aHref
				
				
				
			}
			
		
		      var request = store.add(button_configuration,version);
		
       
			   
		   
		   request.onsuccess = function(e)
		   {
			   
			  alert("The button is in the DataBase!");
			  
			  window.location.href = "jira internship guide test with dataBase.html?button_name=J" ;
            
			   
		   }
		}
   }
}



   function checkNames( button_name )
	{
		
		
		if( objectStores[String(button_name)] != null )
		{
			
			alert("The Button Already exists");
			
		    	
			
		}
		
		
		
		
	}
}

  },false);

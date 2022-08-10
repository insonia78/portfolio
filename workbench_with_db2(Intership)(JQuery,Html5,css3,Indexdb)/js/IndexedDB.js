
/*******************************
Grabbing the db_parameters from the  dataBase_dialog.html 



***********************************/





/****************************************

 database IndexedDb
 
******************************************/
var whichNumber = "";
    var n_tabs ;
    var check = 2; 
	
var preview  = false ;	
	
var files_fields = [];
	
	var workbench = false ;
	
	var acheck ;
	
    var tabCounter = 1;
	
	var stopPreview = true ;
	var divAccordion = "";
	
    var hAccordion = "";
	
	var afieldNumber = "";
	
    var tabId = "";
	
	var fieldNumber ;
	
	var tabs = "";
	
	var portletNumber1 = "";
	
	var url = [] ;
	
	var tabs = "";
	
	var active_accordion ;
	
    var active_accordion_id ;
	
    var active_tab ;
	
	var id = "";
	
	var check = false;
	
	var files = false,
	
	ul = "";  
	
	var Q = false;	
		
		
		
	var atabs = [] ;
	
    var aAccordion;
	
    var title ;
	
    var description;
	var link_toggle = false ;
	 

/******************

db variables
*******************/
var idbSupported = false;
var db;
var db_name ;
var name_db ;
var db_table;
var openRequest ;
var e ;
var thisDB ;
var atooltip = false;
 
document.addEventListener("DOMContentLoaded", function(){
	
    

	 
    if("indexedDB" in window) {
        idbSupported = true;
    }
	
	
	
	if(document.location.href[document.location.href.length - 1] == 'Q')
	{
	
        var url = document.location.href,
         params = url.split('?')[1].split('&'),
	     data = {},
		 tmp;
	
          
         for (var i = 0, l = params.length; i < l; i++) 
		 {
           tmp = params[i].split('=');
           data[tmp[0]] = tmp[1];
           data[tmp[1]] = tmp[2];
          	   
		   db_name = data.db_name;
           name_db = data.db_name ;		   
		   Q = true;
		  
		 } 



        		 
		 
		
     }	
	 
	 
	 
    
     
	
	 
    if(idbSupported && Q == true) {
	     if(db_name)
		 {	
             $(".container-document").removeClass("hidden");
			 $("#functionality_workbenck").addClass("hidden");	
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
			
              alert("Success! Connected to IndexedDb ");
			  
			var check = false;
			db = e.target.result;
			var range = db.objectStoreNames.length;
			var  i ;
			for( i = 0 ; i < db.objectStoreNames.length ; i++)
			{		
                   
				 
			      addAccordiondb(db.objectStoreNames.item(i));
				 
				  
			}
			
			if(i == db.objectStoreNames.length )
			{
				
				alert("CLICK ON A MASTER FOLDER TO ACTIVE IT!");
               
			}	
			
			
        }
 
        openRequest.onerror = function(e) {
            alert("Error! Not Connected to IndexedDb ");
            console.dir(e);
        }
		
    }
	
	
	
	
	
	
	 $( ".link_container" ).hide();
	
	
	/****************************
	
	
	
	********************************/
	
		 $("#main_buttons").find("#show_links").click(function()
	   {
		   link_toggle = !link_toggle;
		   if( link_toggle )
		   {
			    $( ".link_container" ).slideDown();
			 $( ".link_container" ).fadeIn();
			   
		   }
		   else
		   {
			   $( ".link_container" ).slideUp();
			    $( ".link_container" ).fadeOut();
			   
		   }
		 
		
		 
	 });
	
	 $("#main_buttons").find("#tool_bar_menu").click(function(){
		atooltip = !atooltip ;
		
      
    if(atooltip)
    { 	 
		 $( document ).tooltip(); 
		
    }
    else
	{
	    	$( document ).tooltip("destroy"); 
		
	}	
  

});

/******************************




***************************/
	
	
   $("#main_buttons").find("#show_preview").click(function(){
	
	if (preview) 
	{
		
		
		preview = !preview;
		
		
		
	 }
	 else 
	{
		
		
		preview = !preview;
		
		
		
	 }
	  
	
 
  });
  $("#main_buttons").find("#workbench").click(function(){
	  
	
	if (workbench) 
	{
		
		
		workbench = !workbench;
		
		
		
	 }
	 else 
	{
		
		
		workbench = !workbench;
		
		
		
	 }
	  
	
 
  });
  



var acounter = true ;

$(".data_container").mouseenter(function(){


 
 var count ;
 var portlet = $(".portlet");
 
 var li = $("li");
 
 portlet.mouseover(function(){

 var present = $(this);

 present.addClass("highlight");

 present.click(function(){

 
	  present.addClass("liSelected");
	 
	  
	  
	  li.click(function(){
	  
	 
	  present.removeClass("liSelected");
	  
	  
	  });
	
	});
	
   $(this).dblclick(function(){
   
    $(this).removeClass("liSelected");
	

    });
	  	
	
  });
  portlet.mouseout(function(){
  
    $(this).removeClass("highlight");
  
  });

  var document ;

		
   
  portlet.find(li).mouseover(function()
  {
     
    var link = $(this);
	var a = link.children("div").attr("value");
    var id = link.children("div").attr("id");	 
    var name = link.children("div").attr("name");
	
	
	 
	 
  
	  

	  if(preview)
	  {	
  
	   document = window.open( a , "", "width = 200", "height = 500") ;									           
	   document.moveTo( 800 , 500 ); 
	   document.resizeTo( 500 , 600 );
	
	}
	
	
/////////////////////////////////////////////	
	 
	 /***************************
	 
	  sending info to helpertabs.html(work bench)
	 
	 *************************/
/////////////////////////////////////////////
	 var e = true ;
	  $(".size").find(link).click(function()
	  {


		 
		 if(workbench)
	    { 
		  if(preview)
		  {
		    document.close();  
	  	  }
	  	  
	     window.location.href= "workBench.html?db_name=" + db_name + "&=" + a ;
	    }
        else
		{
			
		   if( ( acounter == true ) && !(typeof a === 'undefined'))
		   {
			   
			 
			  
			 window.open( a , ""  ,'width=400,height=200,toolbar=yes,'
					+ 'location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes,'
                    + 'resizable=yes');
				  
				 
				  acounter = false ;
				  
					
					 
				 
			 
			 
		    
		  }
		  
			
		}		
	  
	  });
  
       	  
		
		
	
	 
	});

	
	 
	 li.mouseout(function()
	 {
	   acounter = true ;
      document.close();
	  
	 
	 });
  });
 
  
  
  
  
  
//////////////////////////////////////////  
	
/**************************

 accordion structure
 

***************************/	

///////////////////////////////////////

 
 
	 
	
var accordion = $( "#accordion" ).accordion({
      collapsible: true,
	  heightStyle: "content",
     create: function()
	 {
	    
	   for(var i = 1 ; check == false ; i++)
	  {
		var find_which_number = $(".divAccordion"+i).attr("id");
					
		  if(find_which_number)
		  {
			  
			  $(".dinamicTab"+i).addClass( " ui-tabs ui-widget ui-widget-content ui-corner-all" )
               .children("ul")
              .addClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" );

	          $("#ul"+i).find("li").addClass("ui-state-default ui-corner-top ");
			  
			  
			   $(".portlet").addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
               .find( ".portlet-header" )
              .addClass( "ui-widget-header ui-corner-all" )
              .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

						
		  }
		  else
		 {
			
				n_tabs = i;
				check = !check;
		 }
	 }
	 check = !check;
					
					
	}
	 
	 
	 
	 
	 
	 	  
	  
});

////////////////////////////////////////////

/*************************************

Adding an Accordion

**************************************/

////////////////////////////////////////////





var dialog = $( "#accordion_dialog" ).dialog({
      autoOpen: false,
      modal: true,
	  width: 500,
	  height:700,
      buttons: {
        Add: function() {
          addAccordion();
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
    var form = dialog.find( "form" ).submit(function( event ) {
      addAccordion();
      dialog.dialog( "close" );
      event.preventDefault();
	  
    });


$( "#add_accordion" )
      .button()
      .click(function() { 	  
	 $('#accordion_dialog').dialog( "open" );
  });	 


  
var n_tabs = 1;

var version;

var database;
	
function addAccordion()
{
    
	title = $( "#accordion_title" ).val();
	
    tabCounter = 0;
	           
    	           	      
     description = $( "#accordion_content" ).val();
						 
		   
   
   
  
  
	for(var i = 1 ; check == false ; i++)
	{
		var find_which_number = $(".divAccordion"+i).attr("id");
					
		  if(find_which_number)
		  {			  
						
		  }
		  else
		 {				
				n_tabs = i;
				check = !check;
		 }
					
					
	}
	check = !check;
	
	
	var secondRequest;
	
	
	
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
			
			
			
			
			
			if(!thisDB.objectStoreNames.contains(title)) 
			{
              
    		    var objectStore = thisDB.createObjectStore(title, {autoIncrement: true});
			   
				objectStore.createIndex("n_tabs" , "n_tabs" , { unique : true });
				objectStore.createIndex("accordion", "accordion" , { unique : true });
				objectStore.createIndex("tabs", "tabs" , { unique : true });
				
				
				
            }
			else
			{
				alert("the accordion already exist");
				
			}
 
        }
		
		
		
		
		
		secondRequest.onsuccess = function(e) 
		{
                    alert("Success! Connected to IndexedDb ");
            db = e.target.result;
			
			 var transaction = db.transaction([title] , "readwrite" );
            var store = transaction.objectStore(title);
			
		   aAccordion = new newAccordion();
	       aAccordion.accordion = title;
		   
           aAccordion.description = description;
          		   
		   
          
	
      divAccordion = String( "divAccordion" + n_tabs );
	  hAccordion = String( "hAccordion" + n_tabs );
	  
	  aAccordion.id = divAccordion;
	  aAccordion.divAccordion = divAccordion ;
	  aAccordion.n_tabs = n_tabs;
	   aAccordion.hAccordion = hAccordion;	
	  aAccordion.tabs = "tabs" + n_tabs ;
     	  
	  
	   var newDiv = $("<h3 id = '"+ divAccordion +"'class = '"+ hAccordion + " ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons' value = "+title+" title ='"+ description +"'  >'"+ title +"'<span class='close_position ui-icon ui-icon-close' role='presentation'>Remove Accordion</span></h3><div class ='"+divAccordion+" ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active' id='ui-id-"+ n_tabs +"' value = '"+ title +"' aria-labelledby='"+ divAccordion+ "' role='tabpanel' aria-hidden='false' style='display: block;'></div>");
	   
	    
	  
	    
		   
		  accordion.append(newDiv);   
		  
	  	
	    divAccordion = String(".divAccordion"+ n_tabs);
	    hAccordion  = String("hAccordion"+ n_tabs);
        
	
  



		    
    
			   whichNumber  = String("dinamicTab" + hAccordion[(hAccordion.length - 1)]);
			 
              accordion.find(divAccordion).append($("<div id='tabs"+ n_tabs +"'   class =' selected " + whichNumber + "'></div>")
	          .addClass( " ui-tabs ui-widget ui-widget-content ui-corner-all" )
	          .append($("<ul><li><span class='preview ui-icon ui-icon-unlocked' role='presentation'>Expand</span></li></ul>")
	          .addClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" ))
	          );
			  id = whichNumber;
			  
			 accordion.accordion("refresh");
			 
			 
			  accordion.delegate( "span.ui-icon-close", "click", function() {
               
			   var accordionId = $( this ).closest( "h3" ).attr("value");
			   var accVersion =  $( this ).closest( "h3" ).attr("id");
			   
			   deleteAccordion(accordionId, accVersion) ;
			  
			  var panelId = $( this ).closest( "h3" ).remove().attr( "aria-controls" );
               
			  $( "#" + panelId ).remove();
             accordion.tabs( "refresh" );
            });
 
            accordion.bind( "keyup", function( event ) {
              if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
             var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
             $( "#" + panelId ).remove();
             accordion.tabs( "refresh" );
             }
          });
             
			  
			//  $(".ui-accordion-header-active").mouseover(function(){
		   var request = store.add(aAccordion,version); 
         
	       request.onerror = function(e) {
           alert("Error",e.target.error.name);
        //some type of error handler
          }
 
         request.onsuccess = function(e) {
         alert("table created");
         }
         	

        
		 	
     }
 
        secondRequest.onerror = function(e) 
		{
            alert("Error! Not Connected to IndexedDb ");
            console.dir(e);
        }
      
   
   
  
   
       
  }
  
		

 }//end of function accordition
 
 
 
 
 /////////////////////////////////////////////
 
 /*****************************
 
 adding Accordiondb
 
 
 ******************************/
 ////////////////////////////////////////////
 
 
 
function addAccordiondb( title2) 
{
	
	
	if(title2 == "")
	{
		
	  	
		
	}
	else
	{
		
	
    var key ; 	
	var anewTab ;
	var tabs ;
    
	
	
	var transaction = db.transaction([title2] , "readonly" ) ;
	
	var store = transaction.objectStore(title2);
	
	var index = store.index("accordion");
	
	var checkKey =  index.getKey(title2);
	
	checkKey.onsuccess = function()
	{
		
		key = checkKey.result;
	
	
	    
	
	
	
	
	
	  var request = store.get(Number(key));
	  
      request.onsuccess = function(event) {
       
	   var cursor = event.target.result;
     
	 
		
		 
	  		
		n_tabs = cursor.n_tabs;
		
	    description = cursor.description;		
		hAccordion = cursor.hAccordion;
		anewTab = cursor.anewTab;
		
	    tabs = cursor.tabs ;
		
		
		
	    var accordion = addAccordionToScreen( n_tabs , title2 , description , tabs );
		
		$("." + hAccordion).click(function(){
			 
			title = $(this).attr("value");
			
			var version = $(this).attr("id");
			version = Number(version[version.length - 1 ]) + 1;
			
			
			var transaction = db.transaction([title] , "readonly" ) ;
			
	        var store = transaction.objectStore(title);
			 var request = store.get(version);
			 request.onsuccess = function(event) {
				 
              
			  
	          var cursor = event.target.result;
		
        		n_tabs = cursor.n_tabs;
		
        		tabs = cursor.tabs
		
         		tabCounter = cursor.tabCounter + 1 ;
			   
			   
			   
			 }
			 request.onerror = function(event)
			 {
				 alert("Error " + event.target.result );
				 
			 }
			 
			 
		 });
		 
	     addTabdb( anewTab , divAccordion , accordion , tabs );         
		
		
	 	 
	  
	} // end of request
 

    request.onerror = function(event) 
	{
              
			  var cursor = event.target.result;
			  alert("657 Error" );
          

     }	

	 function addAccordionToScreen(n_tabs , title , description, tabs)
	 {
		
       divAccordion = String("divAccordion" + n_tabs);
	   
	   hAccordion = String("hAccordion" + n_tabs);
	  
	   var newDiv = $("<h3 id = '"+ divAccordion +"'class = '"+ title + " " + hAccordion + " ui-accordion-header ui-state-default  ui-corner-top ui-accordion-icons'  value ='"+ title +"' title ='"+ description +"'  >'"+ title +"'<span class='close_position ui-icon ui-icon-close' role='presentation'>Remove Accordion</span></h3><div class ='"+divAccordion+" ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active' id='ui-id-"+ n_tabs +"' value = '"+ title +"' aria-labelledby='"+ divAccordion+ "' role='tabpanel' aria-hidden='false' style='display: block;'></div>");
	   		   
	   accordion.append(newDiv);   
		  
	  	
	    divAccordion = String(".divAccordion"+ n_tabs);
	    hAccordion  = String("hAccordion"+ n_tabs);
        
	
  



		    
    
			   whichNumber  = String("dinamicTab" + hAccordion[(hAccordion.length - 1)]);
			 
              accordion.find(divAccordion).append($("<div id='"+ tabs +"'   class =' "+ title + "  selected " + whichNumber + " '></div>")
	          .addClass( " ui-tabs ui-widget ui-widget-content ui-corner-all" )
	          .append($("<ul><li><span class='preview ui-icon ui-icon-unlocked' role='presentation'>Expand</span></li></ul>")
	          .addClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" ))
	          );
			  
			  id = whichNumber;
			  
			 accordion.accordion("refresh");
			 
			 
			  accordion.delegate( "span.ui-icon-close", "click", function() {
				  
				  var accordionId = $( this ).closest( "h3" ).attr("value");
			      var accVersion =  $( this ).closest( "h3" ).attr("id");
			 
			 
			   deleteAccordion(accordionId, accVersion) ;
              var panelId = $( this ).closest( "h3" ).remove().attr( "aria-controls" );
              $( "#" + panelId ).remove();
             accordion.tabs( "refresh" );
            });
 
            accordion.bind( "keyup", function( event ) {
              if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
             var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
             $( "#" + panelId ).remove();
             accordion.tabs( "refresh" );
             }
          });
             
			  return accordion;			 
	  	
	}	 
			
 } 
		
 
//////////////////////////////////////////////////////////////////////
/***********************************************************

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Adding addTabdb


*****************************************************************/

//////////////////////////////////////////////////////////////////////////
		
		
		
		
		function addTabdb( anewTab , divAccordion , accordion , tabs1 ) 
		{
	
	    
	 
    
	
	
		
	      
		
	for(var i = 0; i  <  anewTab.length ; i++)
	{
	
	       if(anewTab[i] == "")
		   {
			   /////////
			   /*********
			   can be implemented for re-indexing  
			   
			   *********/
			   
			   ///////////
			   continue;
			   
		   }
		   else
		   {
	   
		 
	     var tabCounter = anewTab[i].tabCounter;
        
		
	     
		 
		 var tabTitle = anewTab[i].name,
		 
             tabContent = anewTab[i].description,
			 
             tabTemplate = "<li id = '#{id}' title = '#{title}'  value = '#{value}' class ='ui-state-default ui-corner-top ui-tabs-active ui-state-active'><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
      
		  id = anewTab[i].id;
		  
		  
		
		
		
        
        
		

		tabs = $("#"+ tabs1 ).tabs();
		
      
	  var label = tabTitle || "Tab " + tabCounter,
      
	  id = "tabs-" + i,
      
	  li = $( tabTemplate.replace( /#\{id\}/g, i ).replace( /#\{title\}/g, tabContent ).replace( /#\{href\}/g,"#" + id ).replace(/#\{value\}/g, label).replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),
        
	  tabContentHtml = tabContent || "Tab " + i + " content.";
 
       
      tabs.find( ".ui-tabs-nav" ).append(li);   
    
 
    
	  
	  tabs.delegate( "li.ui-state-active", "click", function() 
	  {
      
	    tabId = $( this ).closest( "li" ).attr( "aria-controls" );
     
      
      });
    
    // close icon: removing the tab on click
    tabs.delegate( "span.ui-icon-close", "click", function() {
      var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
	  
	  
	  
	  removeTableFromTheAccordionObject(panelId);
	  
      $( "#" + panelId ).remove();
	  
       tabs.tabs( "refresh" );
    
	});
 
    tabs.bind( "keyup", function( event ) {
      if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
        var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
        $( "#" + panelId ).remove();
        tabs.tabs( "refresh" );
      }
    });
	
   
	
  ///////////////////////////////////
  /*********************************
  
   Stop!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  ********************************/
  
  
  ////////////////////////////////
    
	 
     
     
	var a1 = '<div id = "'+ String(id) + '" class = "size ui-tabs-panel ui-widget-content ui-corner-bottom  ui-sortable"><div id="column'+ i +'" class = "column now ui-sortable-handle ui-sortable"><ul  id="sortable" class="trash document ui-state-default ui-corner-all " title=".ui-icon-trash"><span class="ui-icon ui-icon-trash"></span></ul></div></div>' ;
	   
	 
	
	  tabs.append(a1);
	 
	finished_tabs = addPortletDb(tabs , accordion , anewTab[i] , i ) ; 
	 
	   var active_tabs = Number(tabs.find( ".ui-tabs-active" ).attr("id"));
	   
	  
		   var id = Number( active_tabs );
		   
		   tabs.find( "#"+ id ).removeClass('ui-tabs-active ui-state-active');
		   
		   
		   
		   
	   
	 tabs.delegate( "ul.trash", "click", function() {
      
	  var liPath = $( this ).find( "li" ).attr( "value" );
	
	  
	  var panelId = $( this ).find( "li" ).attr( "id" );  
	  deleteField( panelId , liPath );
      $( "#" + panelId ).remove();
	  
      // tabs.tabs( "refresh" );
    
	});
    
	
  }
	
	

  } // end of for


	 
  
} // end of function

///////////////////////////////////////////////////////////////
/*********************************************************


 >>>>>>>>>>>>>>>>>>>>>>> addPortletDb



********************************************************/



/////////////////////////////////////////////////////////////



function addPortletDb( tabs , accordion , anewTab , tabId )
   {	
	     
          var html_portlet_template = '<div class="portlet" id = "#{portletId}" ><div class="portlet-header" title = "#{title}" value = "#{label}" >#{label}</li><span class="close_position ui-icon ui-icon-close" role="presentation">Remove Portlet</span></div><div class="portlet-content">#{ul}</div></div>';
          
		  
		  
		  
			  
			  for( var y = 0 ; y < anewTab.portlet.length ; y++)
			  {
				  
				  
				 if(anewTab.portlet[y] == "")
                 {
					 ////////////////
					 
					 /**********************
					 >>>>>>>>>>>.. It can be implemented for the reindexing of the tables 
					 
					 ***********************/
					 
					 ///////////////////////
					 continue ;
				 }
                  else
				  {
					  
				  				 
			  
		    
			
			var tabTitle = anewTab.portlet[y].name;
			
			
			
            var tabContent = anewTab.portlet[y].description ;
		    
			
			
			
			var fieldsdb =  anewTab.portlet[y].field;
			
		     
		 
			 var li = addField_Portlet_db( fieldsdb, y );
             
               	
			var ul = '<ul id="sortable" class="document">#{li}</ul>';
			 
			 ul = ul.replace( /#\{li\}/g,  li );
			 			  
		    
		
	        if(tabTitle == "")
		    {
			   tabTitle += 1 ; 
			 
			 
		    }
		 
		 
	
	 var html_portlet_dialog  =   html_portlet_template.replace( /#\{portletId\}/g, y ).replace( /#\{title\}/g,  tabContent ).replace( /#\{label\}/g, tabTitle ).replace(/#\{ul\}/g, ul );
        
       tabs.find(String("#column"+ tabId)).append(html_portlet_dialog);
	   
	    $(".portlet").addClass( ''+ tabTitle +' ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' )
         .find( ".portlet-header" )
         .addClass( "ui-widget-header ui-corner-all" )
         .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");
	     
		 
		 
		 $(".portlet").find("#trash").droppable({
		  
		  accept:"#sortable > li"
		  
		  
		  
	  })
        
		
	  $( ".portlet-toggle" ).click(function() {
      var icon = $( this );
      icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
      icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();	   
	  
	  });
	 
	  
     
	  
     $( "ul.document" ).sortable({
      connectWith: ".document",
      dropOnEmpty: true
    }).disableSelection();
	
	
	tabs.tabs( "refresh" );
	
	
	  $(".portlet").delegate( "span.ui-icon-close", "click", function() {
      
	  var portletId =  $( this ).closest( ".portlet" ).attr( "id" );
	    

		
	   removePortletFromTheAccordionObject(portletId);
	   
	  var panelId = $( this ).closest( ".portlet" ).remove().attr( "aria-controls" );
      $( "#" + panelId ).remove();
      
	  tabs.tabs( "refresh" );
    });
 
    $(".portlet").bind( "keyup", function( event ) {
      
	  if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
        
		var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
        
		$( "#" + panelId ).remove();
        
		tabs.tabs( "refresh" );
      
	  }
    
	});
	
	   
	tabs.tabs( "refresh" );
	accordion.find(tabs).append(tabs);
	
	
	
		}	 
	
	
     } // end of anewTbas for loop
		  
	 
 } // end of addPortletloop;

	
	
	
		
		
//////////////////////////////////////////////////
		
/******************************


addField_Portlet_db( fields, i )

****************************************/		
		
		
//////////////////////////////////////////////////
		
		
		
		function addField_Portlet_db( fields, y )
	   {
		   var li = "";
		   var ali = "";
           var fieldPath ;
           var firstOne = false ;
           var afirstOne = false ;			   
		var liTemplate = '<li id = "#{title}" value = "#{path}" title = "#{description}" class="ui-state-default"><div value ="#{url}" name ="#{title}"><img width ="18" height="18" src="#{image}">#{title}</div></li>';
		 
          for(var i = 0 ; i < fields.length; i++ )
		  {
			  fieldPath = y + "/" + i ;
			 
			 
    		  
			  if(fields[i] == null || fields[i] == "")
			  {
				  /****************
				  
				    use to reindex the fields;
				  
				  ***************/
			      continue ;	  
			  }
			  else
			  {
				  
				  
			   var url = fields[i].url;
			  
			  
			  if(typeof url == 'string')
			  {
				  
				  var src =  fields[i].image ;
			      var fieldTitle = fields[i].file_name;
			      var description = fields[i].description ;
				  if(firstOne == false)
			      {
				       li = liTemplate.replace( /#\{description\}/g, description ).replace( /#\{title\}/g, fieldTitle ).replace( /#\{url\}/g, url ).replace( /#\{path\}/g, fieldPath ).replace( /#\{image\}/g, src );
		               firstOne = true ;
			       }
			       else
			       {
		  
			           li += liTemplate.replace( /#\{description\}/g, description ).replace( /#\{title\}/g, fieldTitle ).replace( /#\{url\}/g, url ).replace( /#\{path\}/g, fieldPath ).replace( /#\{image\}/g, src );
			   
			        }
				  
				  
			  }
			  if(typeof url === 'object' )
			  {
				  
				  var src =  fields[i].image ;
			      var fieldTitle = fields[i].url.name;
			      var description = fields[i].description ;
				  var aurl = URL.createObjectURL(url);
				  var aliTemplate = '<li id = "#{title}" value = "#{path}" title = "#{description}" class="ui-state-default"><a href ="#{url}" name ="#{title}"><img width ="18" height="18" src="#{image}">#{title}</a></li>';
		 
				  if(afirstOne == false)
			      {
				       ali = aliTemplate.replace( /#\{description\}/g, description ).replace( /#\{title\}/g, fieldTitle ).replace( /#\{url\}/g, aurl ).replace( /#\{path\}/g, fieldPath ).replace( /#\{image\}/g, src );
		               afirstOne = true ;
			       }
			       else
			       {
		  
			           ali += aliTemplate.replace( /#\{description\}/g, description ).replace( /#\{title\}/g, fieldTitle ).replace( /#\{url\}/g, aurl ).replace( /#\{path\}/g, fieldPath ).replace( /#\{image\}/g, src );
			   
			        }
				  
			  }
			  
			  
			  
			 }
		  }	
            
          if(ali != "" && li !="")
		  {
			  li += ali;
		  }

          if( li == "")
		  {
			  li = ali;
			  
		  }			  
		 
		return li ;
		
	  
        
	    }
		 $("."+ "ui-accordion-header-active").mouseover(function(){
			 
			title = $(this).attr("value");
			
			 
		 });
			    
	
	
	
              
	
	
	
	
	
	
	
	
	}  // end of checkKey	

 
 
 
 
 
 
 
 }//end of function overloaded accordion	

 
 
 
 /*****************************************************

   








********************************************/








 
  
  function deleteAccordion(title1, accVersion)
 {
	 if(db_name)
   { 
        
        var deleteRequest ;
        database = db;
        version =  parseInt(database.version);
	
		version += 1;
		
        database.close();
		
	    
		
		if(version)
		{
		
           deleteRequest = indexedDB.open(db_name,version);
	         
         
		}
		
       deleteRequest.onupgradeneeded = function(e) {
		   
       alert("Upgrading...");
	   
       var thisDB = e.target.result;
	
	   
	   
	  var deleteSuccess =  thisDB.deleteObjectStore(title1);
	   
	 
	  
	 }
	  deleteRequest.onsuccess = function(event) {
	  
	  alert("Master Folder has been deleted");
	  
	  }
     deleteRequest.onerror = function(event) {
	  
	  alert("Master Folder NOT! has been deleted");
	  
	  }
   }
 }
 
    // modal dialog init: custom buttons and a "close" callback resetting the form inside
    var dialog = $( "#dialog" ).dialog({
      autoOpen: false,
      modal: true,
	  width: 500,
	  height:300,
      buttons: {
        Add: function() {
			 
          addTab();
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
    var form = dialog.find( "form" ).submit(function( event ) {
      addTab();
      dialog.dialog( "close" );
      event.preventDefault();
    });
	
	
	 $( "#add_tab" )
      .button()
      .click(function() {
		  getTabNumber(); 
        dialog.dialog( "open" );
      });
	  
	  
/////////////////////////////////////////////////////////////////
	  
 /*********************************
 
 
>>>>>>>>>>>>>>>>>>>> Adding a tab
 
 
 
 ****************************************/
 
 ////////////////////////////////////////////////////////////////
 
 
    // actual addTab function: adds new tab using the input from the form above
    function addTab() {
		
		
		
		active_accordion = $("."+ "ui-accordion-content-active");
	 	
		active_accordion_id =  active_accordion.attr("id");
	    
        title = active_accordion.attr("value");		
		
		
		
		var tabTitle = $( "#tab_title" ),
             tabContent = $( "#tab_content" ),
              tabTemplate = "<li id = '#{id}' title = '#{title}'  value = '#{value}' class ='ui-state-default ui-corner-top ui-tabs-active ui-state-active'><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
      
			 id = "tabs" + active_accordion_id[active_accordion_id.length - 1],
			 column = "column" + tabCounter;
		
        
		
		
     
		
		

		tabs = $("#" + id ).tabs();
		
      var label = tabTitle.val() || "Tab " + tabCounter,
        id = "tabs-" + tabCounter;
        var li = $( tabTemplate.replace( /#\{id\}/g, tabCounter ).replace( /#\{title\}/g, tabContent.val() ).replace(/#\{value\}/g, label).replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),
        
		tabContentHtml = tabContent.val() || "Tab " + tabCounter + " content.";
        
	
        
	   
	   tabs.find( ".ui-tabs-nav" ).append(li);
	   

	 var a1 = '<div id = "'+ String(id) + '" class = "size ui-tabs-panel ui-widget-content ui-corner-bottom  ui-sortable"><div id="column'+ tabCounter +'" class = "column now ui-sortable-handle ui-sortable"><ul width = "30" id="sortable" class=" trash document ui-state-default ui-corner-all " title=".ui-icon-trash"><span class="ui-icon ui-icon-trash"></span></ul></div></div>' ;
	   
      tabs.append(a1);
	  
    
	  
	  tabs.delegate( "li.ui-state-active", "click", function() 
	  {
         tabId = $( this ).closest( "li" ).attr( "aria-controls" );
     
      
      });
	  
	  tabs.delegate( "ul.trash", "click", function() {
      
	  var liPath = $( this ).find( "li" ).attr( "value" );
	  	  
	  var panelId = $( this ).find( "li" ).attr( "id" );  
	   deleteField( panelId , liPath );
	  
      $( "#" + panelId ).remove();
	  
       tabs.tabs( "refresh" );
    
	});
    
    // close icon: removing the tab on click
    tabs.delegate( "span.ui-icon-close", "click", function() {
     var liPath = $( this ).find( "li" ).attr( "value" );
	  
	  
	  
	  var panelId = $( this ).find( "li" ).attr( "id" );  
	  deleteField( panelId , liPath );
      $( "#" + panelId ).remove();
	  
       tabs.tabs( "refresh" );
    });
 
    tabs.bind( "keyup", function( event ) {
      if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
        var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
        $( "#" + panelId ).remove();
        tabs.tabs( "refresh" );
      }
    });
	
	
	
	tabs.tabs( "refresh" );
	
	///////////////////////////////////////////////////////////////////////////		  
		  /*************************************************
          
		  
>>>>>>>>>>>>> Adding  the tab properties to the accordion
		  
		  
		  
         ************************************************/ 
///////////////////////////////////////////////////////////////  
     	
         
         addingTableToTheAccordionObject( label , id , tabCounter , tabContent.val(), column );
		
		
		
////////////////////////////////////////////////////////////////////////////////////////
	accordion.find(tabs).append(tabs);
	 
	 
}
function deleteField( fieldId , path )
{
	try
	{
		path = path.split('/');
	}	
	catch(e)
	{
		
	}
	
	
	
	active_accordion = $("."+ "ui-accordion-content-active");
	 	
    var currentTab = Number(active_accordion.find(".ui-tabs-active").attr("id"));
	
	title = active_accordion.attr("value");
	
    var result ;
	
	var database = db;
	   
	var transaction = db.transaction([title], "readwrite" );
	
		
    var store = transaction.objectStore(title);
	
	var index = store.index("accordion");
	
	var checkKey =  index.getKey(title);
	
	checkKey.onsuccess = function()
	{	
		
       version = checkKey.result;
	   
	   var request = store.get(Number(version));
	
	   request.onsuccess = function(e) 
	   {
		
       result = e.target.result;
	   
	   result.anewTab[currentTab].portlet[path[0]].field[path[1]] = "";
	   result.anewTab[currentTab].portlet[path[0]].field[path[1]].file_name = "";
	    
		store.put(result,version) ;
		alert("field erased");
	
    	}
	
	}
	
	
	
	
	
}
////////////////////////////////
/***********************


***************************/

////////////////////////

function getTabNumber()
{
	active_accordion = $("."+ "ui-accordion-content-active");
	 	
    active_accordion_id =  active_accordion.attr("id");
	
	title = active_accordion.attr("value");
	
    var result ;
	
	var database = db;
	   
	var transaction = db.transaction([title], "readwrite" );
	
		
    var store = transaction.objectStore(title);
	
	var index = store.index("accordion");
	
	var checkKey =  index.getKey(title);
	
	checkKey.onsuccess = function()
	{	
		
       version = checkKey.result;
	   
	   var request = store.get(Number(version));
	
	   request.onsuccess = function(e) 
	   {
		
       result = e.target.result;
	   
	   tabCounter = Number(result.tabCounter) ;
	  
	
    	}
	
	}

}


function removeTableFromTheAccordionObject(panelId)
 {
	 active_accordion = $("."+ "ui-accordion-content-active");
	    
     title = active_accordion.attr("value");		
	 
	var result ;
	
	var database = db;
	
    
	
	var transaction = db.transaction([title], "readwrite" );
	
	var store = transaction.objectStore(title);
	var index = store.index("accordion");
	
	var checkKey =  index.getKey(title);
	
	checkKey.onsuccess = function()
	{
		
		key = checkKey.result;
	
      
	tabCounter = Number(panelId[panelId.length - 1]);
    
	
  		
		
        
	var request = store.get(Number(key));
	
	request.onsuccess = function(e) {
		
       result = e.target.result;
	
        
		result.anewTab[tabCounter] = "" ;
        
      		
	    
		var request = store.put(result,key);
	 
	request.onerror = function(e) {
		
           alert("Error",e.target.error.name);
        
          }
 
     request.onsuccess = function(e) 
	 {
         
           alert("The tab has been deleted"); 
	 }
	
	
	
	
	}
 }// end of checkKey
	
} // end of removeTab



//////////////////////////////////////////////////////////////////

/***************************************



>>>>>>>>>>>>>> Adding the tab to the accordion


**********************************************/


//////////////////////////////////////////////////////



 function addingTableToTheAccordionObject( label , id , tabCounter , description , column )
 {
	 
	var result ;
	
	var database = db;
	
    
	
	var transaction = db.transaction([title], "readwrite" );
	
	var store = transaction.objectStore(title);
    
	tabCounter = Number(tabCounter);
    
	
  		
		
        
	var request = store.get(Number(version));
	
	request.onsuccess = function(e) {
		
       result = e.target.result;
	
        
		result.anewTab[tabCounter] = new setTabs();
        result.anewTab[tabCounter].name = label ;
        result.anewTab[tabCounter].id = id;
       
		result.anewTab[tabCounter].description = description ;
        result.anewTab[tabCounter].column = column ;
        result.tabCounter = tabCounter + 1 ;		
	    
		var request = store.put(result,version);
	 
	request.onerror = function(e) {
		
           alert("Error",e.target.error.name);
        
          }
 
     request.onsuccess = function(e) 
	 {
        
         
	 }
	
	
	
	
	}
	
}




	
 
//////////////////////////////////////////////////////////////////	
    
	/*****************************
	
	adding a portlet
	
	******************************/
	
  	
 //////////////////////////////////////////////////////// 
 
 
 
 
  
 var tabTitle = "",
     tabContent = "";
	 
	  var url_title = "";
	 
	 var url_portlet = "";
	 
	 var url_description_portlet = "";
	 
	 var files_portlet = [];
	 
	 var file_image = "";
	 
	 var file_content =  "";
	 
	 var file_name = "";
	 
	 var afile_image = "";
	 
	 var afile_content =  "";
	 
	 var afile_name = "";
	 
var z = 0;	
 var i = 0;
   
   var portlet_dialog = $("#portlet_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 800,
	    height:1000,
		 buttons: {
        Add: function() {
          
		  
		   url_title += '&'+ $("#url_container").find("#url_title"+i).val();
	 
	  url_portlet += '&' + $("#url_container").find("#url_portlet"+i).val();
	 
	  url_description_portlet += '&' + $("#url_container").find("#url_description_portlet"+i).val();
		
      i = 0;
	  z = 0;
		  addPortlet();
		
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
	
	
	var form = portlet_dialog.find( "form" ).submit(function( event ) {
      addPortlet();
      dialog.dialog( "close" );
      event.preventDefault();
    });	  
    
	
	
	function addPortlet()
   {
	 
	    var aula = "";
		
		var arrayLength = 0 ;
		
	     var aportletNumber = portletNumber1; 
		
		 active_accordion = $("."+ "ui-accordion-content-active");
		 
		 active_accordion_id = active_accordion.attr("id");
		 
		 tabs = "tabs" + active_accordion_id[active_accordion_id.length - 1 ];
		 
		 tabs = $("#"+tabs).tabs();
		 
         var active_tab  = tabs.find('.ui-tabs-active').attr("id");
		 
		  var html_portlet_template = '<div class="portlet" id = "#{label}" ><div class= " portlet-header " title = "#{title}" value = "#{label}" >#{label}</span></li><span class="close_position ui-icon ui-icon-close" role="presentation">Remove Portlet</span></div><div class="portlet-content">#{ul}</div></div>';
          
		  portletTitle = $( "#tab_title_portlet" ).val(),
         
		 portletContent = $( "#tab_description_portlet" ).val();
		 
		
		  addingPortletToTheAccordionObject( portletTitle , portletContent, aportletNumber );
		 
		 if(url_portlet != "&" && url_portlet != "")
		  {
			  
			  var url = url_portlet.split('&') ;
			  
		      
              
		      var urlDescription  = url_description_portlet.split('&') ; 
		 
		      var aurl_title = url_title.split('&');
			 arrayLength = aurl_title.length;
			
			 var li = addField_Portlet( url , urlDescription , 'images/url.png' ,  aurl_title , aportletNumber, arrayLength  );
		
			 ul = '<ul id="sortable" class="document">#{li}</ul>';
			 
			 ul = ul.replace( /#\{li\}/g,  li );
			  
			 			  
		  }
		  else
		  {
			   ul = '<ul id="sortable" class="document"></ul>';
			  
		  }
		
		  if(file_name != "" && file_name != "&")
		  {
			  

			  var afile_image = file_image.split('&');
			  
			  var afile_name = file_name.split('&');
			  
			  var afile_content = file_content.split('&');

			 
			 var li = readfiles( files_portlet , afile_image , afile_name , afile_content, aportletNumber ,arrayLength);
			 
			 var aul = '<ul id="sortable" class="document">#{li}</ul>';
			 
			 aula = aul.replace( /#\{li\}/g,  li );
			 
			  
		  }
		
	     
	//var html_portlet_dialog  =   html_portlet_template.replace( /#\{title\}/g,  portletContent ).replace( /#\{label\}/g, portletTitle ).replace(/#\{ul\}/g,ul );
        
      html_portlet_dialog = '<div class="portlet" id = "'+ portletNumber1 +'" ><div class = " portlet-header " title = "'+ portletContent +'" value = "'+ portletTitle +'" >'+ portletTitle +'<span class="close_position ui-icon ui-icon-close" role="presentation">Remove Portlet</span></div><div class="portlet-content">'+ ul +''+ aula +'</div></div>';
	   
	   
	   tabs.find(String("#column"+ active_tab)).append(html_portlet_dialog);
       
	   // accordion.find(tabId2).children(String("#column"+tabId[tabId.length - 1])).append("text");//.append(html_portlet_dialog);
       
	   $(".portlet").addClass( 'ui-widget ui-widget-content ui-helper-clearfix ui-corner-all' )
         .find( ".portlet-header" )
         .addClass( "ui-widget-header ui-corner-all" )
         .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");
	
      


	
////////////////////////////////////////////////
		 /******************************
		 
		 >>>>>>>>>>>>>>>>>>>>>>>>>>.........
		  
		  *******************************/
		  
		  tabs.tabs( "refresh" );
		  
		  
//////////////////////////////////////////////////     






   
		
	  $( ".portlet-toggle" ).click(function() {
      var icon = $( this );
      icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
      icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();	   
	  
	  });
	 
	  
     
	  
     $( "ul.document" ).sortable({
      connectWith: ".document",
      dropOnEmpty: true
    }).disableSelection();
	
	
	
	tabs.tabs( "refresh" );
	
	 

	 $(".portlet").delegate( "span.ui-icon-close", "click", function() {
		 
	   var portletId =  $( this ).closest( ".portlet" ).attr( "id" );
		
	   removePortletFromTheAccordionObject(portletId);
	   
      var panelId = $( this ).closest( ".portlet" ).remove().attr( "aria-controls" );
      
	  $( "#" + panelId ).remove();
      
	  tabs.tabs( "refresh" );
    
	});
 
    $(".portlet").bind( "keyup", function( event ) {
		
      if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
        
		var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
        
		$( "#" + panelId ).remove();
        
		tabs.tabs( "refresh" );
      
	  }
    });
	
	tabs.tabs( "refresh" );
	
	 accordion.find(tabs).append(tabs);
	 
	//  $('#accordion').accordion("refresh");
	
 } 
 
  $("#portlet_dialog").find("#new_Url")
	  .button()
	   .click(function(){
		   
		   if( i == 0)
		   {
			    url_title = '&'+ $("#url_container").find("#url_title"+i).val();
	 
	           url_portlet = '&' + $("#url_container").find("#url_portlet"+i).val();
	 
	            url_description_portlet = '&' + $("#url_container").find("#url_description_portlet"+i).val();
			   
			   
		   }
		   else
		   {
			   
		   
		   
	         url_title += '&'+ $("#url_container").find("#url_title"+i).val();
	 
	         url_portlet += '&' + $("#url_container").find("#url_portlet"+i).val();
	 
	         url_description_portlet += '&' + $("#url_container").find("#url_description_portlet"+i).val();
			 
		}
    	
	
	   ++i;	
		   
		   var fieldset_template = '<fieldset>'
		                           + '<label for="field_title">Name of the Url</label>'
								   + '<br>'
								   + '<input type="text" name="tab_title" id="url_title'+i+'"  class="ui-widget-content ui-corner-all">'
								   + '<br>'
								   + '<label for="field_title">Url</label>'
								   + '<br>'
								   + '<input id = "url_portlet'+i+'" style ="width:600px" type="url" name="url" title = "paste your url here"  class="ui-widget-content ui-corner-all">'
								   + '<br>'
								   + '<label for="fied_content">Url Description</label>'
								   + '<br>'
								   +'<textarea name="field_content" id="url_description_portlet'+i+'" class="ui-widget-content ui-corner-all"></textarea>'
								   + '<br>'
								   + '</fieldset>'
			   
              			   
		     $("#portlet_dialog").find("#url_container").append(fieldset_template);		   
		tabs.tabs( "refresh" );
	        
	   });	
 
  $("#add_portlet")
	  .button()
	   .click(function(){
		       url_title = "";
			   url_portlet = "";
			   url_description_portlet = "";
		       file_image = "";
			   file_name =  "";
			   file_content = "";
			   getPortletNumber();
               z = 0;
               i = 0;
               acheck = false ;			   
		     $("#portlet_dialog").dialog("open");		   
		
	   });	
/////////////////////////////////////////////////////////////////////////////////////
  /***********************************************
  
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>removePortletFromTheAccordionObject
  
	
***********************************************/

//////////////////////////////////////////////////////////////////
	   
	   
	   
	   
	   function removePortletFromTheAccordionObject(portletId)
     {
	
	var result ;
	var database = db;
    var version ;
	var anewTab ;
	
	
	
     active_accordion = $("."+ "ui-accordion-content-active");
	 	
    active_accordion_id =  active_accordion.attr("id");
	
	title = active_accordion.attr("value");
	
    tabCounter = Number( $("#tabs" + active_accordion_id[active_accordion_id.length - 1 ]).find(".ui-tabs-active").attr("id"));	
	
	
	
    var transaction = db.transaction([title], "readwrite" );
	
	var store = transaction.objectStore(title);
	 
	var index = store.index("accordion");
	
	var checkKey =  index.getKey(title);
	
	checkKey.onsuccess = function()
	{	
		
       version = checkKey.result;
	   
	   var request = store.get(Number(version));
	 
	
		
		
        
	
	request.onsuccess = function(e) {
		
    result = e.target.result;
	
	
	
	  if(result)
	  {
		    
		    result.anewTab[tabCounter].portlet[portletId] = "";
		      
		
			
	      var request =  store.put( result, version );
		  
	     request.onsuccess = function(e) 
		 {
			 
			 alert("portlet erased");
			 
			 
		 }
		 
		 
	     request.onerror = function(e) 
		{
           alert("1603 Error", e.target.error.name );
        //some type of error handler
        }
	       
	    
		
		
		}
	}
		
		
        request.onerror = function(e) 
		{
      
    	  alert(" 1618 Error", e.target.error.name );
        
          }
	}// end of getKey
	
	
	
	
}
	
	   
	   
	   
	   
	   
	   
/////////////////////////////////////////////////////////////////////////////////////
  /***********************************************
  
  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>addingPortletToTheAccordionObject
  
	
***********************************************/

//////////////////////////////////////////////////////////////////

function getPortletNumber()
{
	
	var result ;
	var database = db;
    var version ;
	var anewTab ;
	var portletNumber ;
	
	
     active_accordion = $("."+ "ui-accordion-content-active");
	 	
    active_accordion_id =  active_accordion.attr("id");
	
	title = active_accordion.attr("value");
	
    tabCounter = Number( $("#tabs" + active_accordion_id[active_accordion_id.length - 1 ]).find(".ui-tabs-active").attr("id"));	
	
	
	
	
    var transaction = db.transaction([title], "readwrite" );
	
	var store = transaction.objectStore(title);
	
	var index = store.index("accordion");
	
	var checkKey =  index.getKey(title);
	
	checkKey.onsuccess = function()
	{
		
		version = checkKey.result;
	
	 
	   
	
	   
	 
	 
	 var request  = store.get(version);
	 
	
		
		
        
	
	request.onsuccess = function(e) {
		
    result = e.target.result;
	
	 portletNumber1 = result.anewTab[tabCounter].portletNumber ;
	
	
    	
	
	}
	request.onerror = function(e){
		
		alert( "1980 Error" );
		
	}
 }
}






function addingPortletToTheAccordionObject( tabTitle , description , aportletNumber )
{
	
	var result ;
	var database = db;
    var version ;
	var anewTab ;
	
	
	
	
     active_accordion = $("."+ "ui-accordion-content-active");
	 	
    active_accordion_id =  active_accordion.attr("id");
	
	title = active_accordion.attr("value");
	
    tabCounter = Number( $("#tabs" + active_accordion_id[active_accordion_id.length - 1 ]).find(".ui-tabs-active").attr("id"));	
	
	
	
    var transaction = db.transaction([title], "readwrite" );
	
	var store = transaction.objectStore(title);
	 
	
	var index = store.index("accordion");
	
	var checkKey =  index.getKey(title);
	
	checkKey.onsuccess = function()
	{	
		
       version = checkKey.result;
	   
	   var request = store.get(Number(version));        
	
	   request.onsuccess = function(e) {
		
       result = e.target.result;
	
	 
	
	  
	  
	  if(result)
	  {
		    
		    result.anewTab[tabCounter].portlet[aportletNumber] = new setPortlet();
		    result.anewTab[tabCounter].portlet[aportletNumber].name = tabTitle;;		  
	        result.anewTab[tabCounter].portlet[aportletNumber].description = description ;
	        result.anewTab[tabCounter].portletNumber = aportletNumber + 1;
		    
			
	      var request =  store.put(result, version );
		   
		   
		 request.onsuccess = function(e) 
		 {
			 
			
			
			 
		 }
		 
		 
	     request.onerror = function(e) 
		{
           alert("1603 Error", e.target.error.name );
        //some type of error handler
        }
	       
	    
		
		
		}
	}
		
		
        request.onerror = function(e) 
		{
      
    	  alert(" 1618 Error", e.target.error.name );
        
          }
       
	}
	
	
	
}
	




/////////////////////////////////////////////////////

	
	/***********************
	
	 add Field
	
	************************/
	
	
//////////////////////////////////////////////////////	
 
 var field_title = ""  ;
 var url = "" ;
 var field_url = "";
 var y = 0;
 
 $("#field_dialog").find("#field_new_Url")
	  .button()
	   .click(function(){
		   
	  field_title += '&'+ $("#aurl_container").find("#field_title"+y).val();
	 
	  url += '&' + $("#aurl_container").find("#url"+y).val();
	 
	  field_url += '&' + $("#aurl_container").find("#field_url"+y).val();
		
    	
	
	   ++y;	
		   
		   var fieldset_template = '<fieldset>'
		                           + '<label for="field_title">Name of the Url</label>'
								   + '<br>'
								   + '<input type="text" name="tab_title" id="field_title'+y+'"  class="ui-widget-content ui-corner-all">'
								   + '<br>'
								   + '<label for="field_title">Url</label>'
								   + '<br>'
								   + '<input id = "url'+y+'" style ="width:600px" type="url" name="url" title = "paste your url here"  class="ui-widget-content ui-corner-all">'
								   + '<br>'
								   + '<label for="fied_content">Url Description</label>'
								   + '<br>'
								   +'<textarea name="field_content" id="#field_url'+y+'" class="ui-widget-content ui-corner-all"></textarea>'
								   + '<br>'
								   + '</fieldset>'
			   
              			   
		     $("#field_dialog").find("#aurl_container").append(fieldset_template);		   
		//tabs.tabs( "refresh" );
	        
	   });	
	
	
	
	
$( "#add_field")
      .button()
      .click(function() {
		  
		   field_title = "";
		   url = "";
		   field_url = "";
		   
		    afile_image = "";
			afile_name =  "";
			afile_content = "";
			y = 0;
			z = 0 ;
			acheck = false ;
		  getOnlyFieldNumber();
		  
        $( '#field_dialog' ).dialog( "open" );
      });
	  
	  
	  
	  
	  
	  
function getOnlyFieldNumber()
{
	var aportletNumber = $(".liSelected").attr("id");
	active_accordion = $("."+ "ui-accordion-content-active");
	active_accordion_id = active_accordion.attr("id");	
   
	
	title = active_accordion.attr("value");
	
    tabCounter = Number( $("#tabs" + active_accordion_id[active_accordion_id.length - 1 ]).find(".ui-tabs-active").attr("id"));	
	
	
	
	
    var transaction = db.transaction([title], "readwrite" );
	
	var store = transaction.objectStore(title);
	
	 
	var index = store.index("accordion");
	var checkKey =  index.getKey(title);
	
	checkKey.onsuccess = function()
	{
		
		key = checkKey.result;
	
	
	    
	
	
	
	
	
	  var request = store.get(Number(key));        
	
	request.onsuccess = function(e) {
		
    result = e.target.result;
	 
	
	 
	 afieldNumber = result.anewTab[tabCounter].portlet[aportletNumber].fieldNumber; 
	 
	
	
	}
	request.onerror = function()
	{
		
		alert("Cant get the file/url arrayNumber!");
		
	}
	
  }	
		
}  
	  
	var field_dialog = $("#field_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 1000,
	    height:700,
		 buttons: {
        Add: function() {
			
		field_title += '&'+ $("#aurl_container").find("#field_title"+y).val();
	 
	    url += '&' + $("#aurl_container").find("#url"+y).val();
	 
	   field_url += '&' + $("#aurl_container").find("#field_url"+y).val();
		
      
       	   
          addField();
		 
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
	
	var form = field_dialog.find( "form" ).submit(function( event ) {
      addField();
	  
      dialog.dialog( "close" );
      event.preventDefault();
    });	 

    function addField()
	{
		var aurl = "" ;
		var li = "";
		var ali = "";
		var aportletNumber = $(".liSelected").attr("id");
		var y = 0 ;
		var afieldNumber2 = "" ;
        var currentPath = "";
	 
		
		 active_tab = $( ".ui-tabs-nav" ).find( '.ui-tabs-active' ).attr( "aria-controls" );
			
		if(url != "&" && url != "")
	  {
		  
		 aurl = url.split('&');
		 
		 var liTemplate = '<li id = "#{title}" value = "#{path}" title = "#{description}" class="ui-state-default"><div value ="#{url}"><img width ="18" height="18" src="#{image}">#{title}</div></li>';
		
		var description = field_url.split('&');
		
	
		
		var fieldTitle = field_title.split('&'); 
	    	
		var urlLength = (fieldTitle.length) + (afieldNumber - 1);
		
		
	
		
		for(var i = afieldNumber  ; i < urlLength ; i++)
		{
		   
		  currentPath = aportletNumber +"/" + i;
		   
		  y = (i - (afieldNumber - 1)); 
			
		 afieldNumber2 = addingField_Only_ToTheAccordionObject( fieldTitle[y] , description[y] , 'images/url.png' , aurl[y] , aportletNumber , i );	
		 
		  if(i == afieldNumber )
		  {
			
			li = liTemplate.replace( /#\{description\}/g, description[y] ).replace( /#\{title\}/g, fieldTitle[y] ).replace( /#\{url\}/g, aurl[y] ).replace( /#\{path\}/g, currentPath ).replace( /#\{image\}/g, 'images/url.png');
		  
		    
		  
		  }
		  else
		  {
			li += liTemplate.replace( /#\{description\}/g, description[y] ).replace( /#\{title\}/g, fieldTitle[y]).replace( /#\{url\}/g, aurl[y] ).replace( /#\{path\}/g, currentPath ).replace( /#\{image\}/g, 'images/url.png' );
		  
		  }
       
		
	     
		}
	}
	    
		  if(afile_name != "" && afile_name != "&")
		  {
			
			  
			  var liTemplate = '<li id = "#{title}" value = "#{path}" title = "#{description}" class="ui-state-default"><div value ="#{file}"><img width ="18" height="18" src="#{image}">#{title}</div></li>';
		
			  var astart = 0;
			  
			  var aFile_image = afile_image.split('&');
			  
			  var aFile_name = afile_name.split('&');
			  
			  var aFile_content = afile_content.split('&');
			  
			  if(afieldNumber2 == 0)
			  {
				 
				  var urlLength = aFile_name.length + afieldNumber -1 
				  astart = afieldNumber ;
			  }
			  else
			  {
				  
				  
				  var urlLength = (aFile_name.length) + (afieldNumber2 - 1) ;			  
				  astart = afieldNumber2;
			  }
			  
				  
			  
			  
           
		for(var i = astart; i < urlLength ; i++)
		{	
			 currentPath = aportletNumber + "/" + i;
			 
			 var z = (i - (astart - 1)); 
			 
			 
			 
			 readfiles_fields( files_fields[z - 1] , aFile_image[z] , aFile_name[z] , aFile_content[z], aportletNumber, i);
			 
			 
			 var aul = '<ul id="sortable" class="document">#{li}</ul>';
			 
			  if(i == afieldNumber2 )
		      {
				   ali = liTemplate.replace( /#\{description\}/g, aFile_content[z] ).replace( /#\{title\}/g, aFile_name[z] ).replace( /#\{file\}/g, files_portlet[z] ).replace( /#\{path\}/g, currentPath ).replace( /#\{image\}/g, src );
		
				  
			  }
			  else
			  {
				  ali += liTemplate.replace( /#\{description\}/g, aFile_content[z] ).replace( /#\{title\}/g, aFile_name[z] ).replace( /#\{file\}/g, files_portlet[z] ).replace( /#\{path\}/g, currentPath ).replace( /#\{image\}/g, src );
		
				  
			  }
			 
			 
			  
		  }
		}
		
			
		$( ".liSelected" ).find("#sortable").append(li);  
	    $( ".liSelected" ).find("#sortable").append(ali);
	     //window.location.href = "jira internship guide test with dataBase.html?db_name=" + name_db +"&Q"; 
        
	}
	
	function addField_Portlet( aurl , adescription , src , atitle, aportletNumber, arrayLength )
	{
		
		var currentPath ;
		var li = "" ;
        active_tab = $( ".ui-tabs-nav" ).find( '.ui-tabs-active' ).attr( "aria-controls" );
		
	
		
		for(var i = 1 ; i < arrayLength  ; i++)
		{
		   currentPath = aportletNumber + "/" + i ;
		   
		   var url = aurl[i];
		
		   var description = adescription[i];
		
		   var fieldTitle = atitle[i];
		
		  
		
		   var fieldCounter = addingFieldToTheAccordionObject( fieldTitle , description , src , url, aportletNumber , i );	
		
       	
		   var liTemplate = '<li id = "#{title}" value = "#{path}" title = "#{description}" class="ui-state-default"><div value ="#{file}"><img width ="18" height="18" src="#{image}">#{title}</div></li>';
		
		  li += liTemplate.replace( /#\{description\}/g, description ).replace( /#\{title\}/g, fieldTitle ).replace( /#\{file\}/g, url ).replace( /#\{path\}/g, currentPath ).replace( /#\{image\}/g, src );
		
		}
		return li ;
		
	  
        
	}
	
	
	function addingField_Only_ToTheAccordionObject( fieldTitle , description , src , url , aportletNumber, i )
	{
		
     
	 var afieldNumber = i + 1 ;
	 
	 active_accordion = $("."+ "ui-accordion-content-active");
	 	
    
	
	title = active_accordion.attr("value");
	
    tabCounter = Number( $("#tabs" + active_accordion_id[active_accordion_id.length - 1 ]).find(".ui-tabs-active").attr("id"));	
	
	
	
	
    var transaction = db.transaction([title], "readwrite" );
	
	var store = transaction.objectStore(title);
	 
	var index = store.index("accordion");
	
	var checkKey =  index.getKey(title);
	
	checkKey.onsuccess = function()
	{	
		
       version = checkKey.result;
	   
	   var request = store.get(Number(version));        
	
	   request.onsuccess = function(e) {
		
    result = e.target.result;
	 
	 //afieldNumber = result.anewTab[tabCounter].portlet[aportletNumber].fieldNumber ;
	 
	
	 if(result)
	  {
		   
		   
		    result.anewTab[tabCounter].portlet[aportletNumber].field[afieldNumber] = new setField();
		    result.anewTab[tabCounter].portlet[aportletNumber].field[afieldNumber].file_name = fieldTitle ;
            result.anewTab[tabCounter].portlet[aportletNumber].field[afieldNumber].fieldNumber = afieldNumber ;
           
			result.anewTab[tabCounter].portlet[aportletNumber].field[afieldNumber].image = src;
	        result.anewTab[tabCounter].portlet[aportletNumber].field[afieldNumber].description = description ;
			result.anewTab[tabCounter].portlet[aportletNumber].field[afieldNumber].url = url ;
	        result.anewTab[tabCounter].portlet[aportletNumber].fieldNumber = afieldNumber + 1;
		
			
	      var request =  store.put( result , version );
		  
	     request.onsuccess = function(e) 
		 {
			 
			
			 
		    afieldNumber += 1 ;
		    	
            return afieldNumber ; 
			 
		 }
		 
		 
	     request.onerror = function(e) 
		{
           alert("1359 Error", e.target.error.name );
        //some type of error handler
        }
	       
	    
		
		
		}
	}
		
		
        request.onerror = function(e) 
		{
      
    	  alert(" 1373 Error", e.target.error.name );
        
          }
	}// end of key
       
	
	
	
	
	
		
		
		
	}

function addingFieldToTheAccordionObject( fieldTitle , description , src , url , aportletNumber , i )
    {
	
	var result ;
	var database = db;
    var version ;
	var anewTab ;
	
	
	
	active_accordion = $("."+ "ui-accordion-content-active");
		 
		 active_accordion_id = active_accordion.attr("id");
		 
		 tabs = "tabs" + active_accordion_id[active_accordion_id.length - 1 ];
		 
		 tabs = $("#"+tabs).tabs();
  
	
	var currentTab = tabs.find(".ui-tabs-active").attr("id");
	 
	 
	currentTab = Number(currentTab);
    
	var transaction = db.transaction([title], "readwrite" );
	
	var store = transaction.objectStore(title);
	 
	var index = store.index("accordion");
	
	var checkKey =  index.getKey(title);
	
	checkKey.onsuccess = function()
	{	
		
       version = checkKey.result;
	   
	   var request = store.get(Number(version));
	 
	
	 
	
		
		
        
	
	request.onsuccess = function(e) {
	
    result = e.target.result;
	 
	
	
	
	 
	 
	 var afieldNumber = i ;
	 
	
     
	
	 
	 var path ; 
	 
	  if(result)
	  {
		   
		    
		    result.anewTab[Number(currentTab)].portlet[aportletNumber].field[afieldNumber] = new setField();
		    
			
			result.anewTab[Number(currentTab)].portlet[aportletNumber].field[afieldNumber].file_name = fieldTitle ;
            result.anewTab[Number(currentTab)].portlet[aportletNumber].field[afieldNumber].fieldNumber = afieldNumber ;
           
			 result.anewTab[Number(currentTab)].portlet[aportletNumber].field[afieldNumber].image = src ;
	        result.anewTab[Number(currentTab)].portlet[aportletNumber].field[afieldNumber].description = description ;
			result.anewTab[Number(currentTab)].portlet[aportletNumber].field[afieldNumber].url = url ;
	        result.anewTab[Number(currentTab)].portlet[aportletNumber].fieldNumber = afieldNumber + 1;
            
			
			
			path = result.anewTab[Number(currentTab)];
			path += "/"+ result.anewTab[Number(currentTab)].portlet[aportletNumber];
			path += "/" + result.anewTab[Number(currentTab)].portlet[aportletNumber].field[afieldNumber].file_name; 
			
		    var request = store.put(result, version);
	 
	     request.onsuccess = function(e) 
		 {
			 
			// window.location.href = "jira internship guide test with dataBase.html?db_name=" + name_db +"&Q";
			 
		 }
		 
	  }
	  
	} // end of onsuccess
	
  } // end of getKey
  
} // end of addingFieldToTheAccordionObject
	
	
	
	
	
	
	
  
var name ="";
var file_template = '<fieldset>'
                    +'<img id = "#{image}" value ="#{file_name}" width ="25" heigth ="25" src="#{icon}" > <text>#{file_name}</text>'
					+'<br>'					
					+'<label for="file_content">Description</label>'
					+'<br>'
	                +'<textarea name="db_content" id="#{file_content}" class="ui-widget-content ui-corner-all"></textarea>'
					+'</fieldset><br>';
 
var src = ""; 

function readfiles_fields( files , afile_image , afile_name , afile_content, aportletNumber, i ) {
     var currentPath ;
	 var li = "" ;   
     var liTemplate = '<li id = "#{title}" value = "#{path}" title = "#{description}" class="ui-state-default"><div value ="#{file}"><img width ="18" height="18" src="#{image}">#{title}</div></li>';
		
		 
 
  
       var blob = new Blob([files],{ type: files.type } );
	   var file = new File([blob], files.name, {type: files.type } );
	   
	  
        
        active_tab = $( ".ui-tabs-nav" ).find( '.ui-tabs-active' ).attr( "aria-controls" );
		
		currentPath = aportletNumber + "/" + i ;
		   
		
		
		   var description = afile_content;
		
		   var fieldTitle = afile_name;
		   
		   var src = afile_image;
		
		 
		
		    addingField_Only_ToTheAccordionObject( fieldTitle , description , src , file, aportletNumber , i );	
		
       	
		   
		  
		
    
   
	
    
   
  
 
 
}
function readfiles( files , afile_image , afile_name , afile_content, aportletNumber, length) {
     var currentPath ;
	 var li = "" ;   
     var liTemplate = '<li id = "#{title}" value = "#{path}" title = "#{description}" class="ui-state-default"><div value ="#{file}"><img width ="18" height="18" src="#{image}">#{title}</div></li>';
		
		
		
  for (var i = length ; i < (files.length + length); i++) {
        
	   var yz = i - length ;
	   
       try
	   {
          
        	  
         var blob = new Blob([files[yz]],{type: files[yz].type});
	   
	     var file = new File([blob], files[yz].name, {type: files[yz].type } );
	    
	    
	    
		
		}
		catch(e)
	   {
		   alert("something went wrong" + e)
		   
	   }
	   

        
        
        active_tab = $( ".ui-tabs-nav" ).find( '.ui-tabs-active' ).attr( "aria-controls" );
		currentPath = aportletNumber + "/" + i ;
		   
		
		
		   var description = afile_content[yz + 1];
		
		   var fieldTitle = afile_name[yz + 1];
		   
		   var src = afile_image[yz + 1];
		
		 
		
		   var fieldCounter = addingFieldToTheAccordionObject( fieldTitle , description , src , file, aportletNumber , i );	
		
       	
		   
		   li += liTemplate.replace( /#\{description\}/g, description ).replace( /#\{title\}/g, fieldTitle ).replace( /#\{file\}/g, file ).replace( /#\{path\}/g, currentPath ).replace( /#\{image\}/g, src );
		
	  
	   
		
    
   
	
    
   
  }
 
 return li ;
}
	
var holder = document.getElementById('holder');
var aholder = document.getElementById('aholder');



if(holder != "")
{
	
        
holder.ondragover = function () { this.className = 'hover'; return false; };
holder.ondragend = function () { this.className = ''; return false; };
holder.ondrop = function (e) {
  this.className = '';
  e.preventDefault();
  files_portlet[z] = e.dataTransfer.files[0] ;
  var fileName = e.dataTransfer.files[0].name ;
  var fileType =  e.dataTransfer.files[0].name.split(".");
 
  if(fileType[1] == 'docx' || fileType[1] == "doc" )
  {
	  src = "images/doc.png";
	  
	  
  }
  else if(fileType[1] == 'xlsx' || fileType[1] == 'cvs' || fileType[1] == 'xlm' || fileType[1] == 'xls')
  {
	  src = "images/excel.png";
	  
  }
  else if(fileType[1] == 'pdf')
  {
	  src = "images/pdf.png";
	  
  }
  else
  {
	  src = "images/file.png";
	  
  }
  
  var file_fields = file_template.replace( /#\{image\}/g, 'image' + z ).replace( /#\{icon\}/g, src ).replace( /#\{file_name\}/g, fileName ).replace( /#\{file_content\}/g, 'file_content'+ z );
  
  $("#portlet_dialog").find("#file_names").append(file_fields);
   if(acheck == false)
   {
	   acheck = true ;
      file_image = '&' + $("#file_names").find("#image"+z).attr("src");
      file_name = '&' + $("#file_names").find("#image"+z).attr("value");
      file_content = '&' + $("#file_names").find("#file_content"+z).val();
   }
   else
   {
	   file_image += '&' + $("#file_names").find("#image"+z).attr("src");
      file_name += '&' + $("#file_names").find("#image"+z).attr("value");
      file_content += '&' + $("#file_names").find("#file_content"+z).val();
   
	   
   }
  
   ++z;
  
 } 
}
if(aholder != "")
{
aholder.ondragover = function () { this.className = 'hover'; return false; };
aholder.ondragend = function () { this.className = ''; return false; };
aholder.ondrop = function (e) {
	
  this.className = '';
  e.preventDefault();
  files_fields[z] = e.dataTransfer.files[0] ;
  var fileName = e.dataTransfer.files[0].name ;
  var fileType =  e.dataTransfer.files[0].name.split(".");
 
 
 
  if(fileType[1] == 'docx' || fileType[1] == "doc" )
  {
	  src = "images/doc.png";
	  
	  
  }
  else if(fileType[1] == 'xlsx' || fileType[1] == 'cvs' || fileType[1] == 'xlm' || fileType[1] == 'xls')
  {
	  src = "images/excel.png";
	  
  }
  else if(fileType[1] == 'pdf')
  {
	  src = "images/pdf.png";
	  
  }
  else
  {
	  src = "images/file.png";
	  
  }	  
  var file_fields = file_template.replace( /#\{image\}/g, 'image' + z ).replace( /#\{icon\}/g, src ).replace( /#\{file_name\}/g, fileName ).replace( /#\{file_content\}/g, 'file_content'+ z );
  
  
  $("#field_dialog").find("#afile_names").append(file_fields);
 
  if( acheck == false)
  {
	  
	  afile_image = '&' + $("#afile_names").find("#image"+z).attr("src");
   
   afile_name = '&' + $("#afile_names").find("#image"+z).attr("value");
   
   afile_content = '&' + $("#afile_names").find("#file_content"+z).val();
   acheck = true;
	  
  }
  else
  {
     afile_image += '&' + $("#afile_names").find("#image"+z).attr("src");
   
     afile_name += '&' + $("#afile_names").find("#image"+z).attr("value");
   
     afile_content += '&' + $("#afile_names").find("#file_content"+z).val();
  }
   
   ++z;
 } 
}
  
$("#update").button().click(function(){
	
	window.location.href = "jira internship guide test with dataBase.html?db_name=" + name_db +"&Q";
	
	
});
$("#aupdate").button().click(function(){
	
	window.location.href = "jira internship guide test with dataBase.html?db_name=" + name_db +"&Q";
	
	
});
$("#bupdate").button().click(function(){
	
	window.location.href = "jira internship guide test with dataBase.html?db_name=" + name_db +"&Q";
	
	
});
$("#portlet_dialog").find("#agetUrl").button().click(function()
{
				 var features = [];
				 features.push("scrollbars","menubar","location","toolbar");
				var document = window.open( "getUrl.html" , features.join(","), "width = 100", "height = 100") ;									           
	             document.moveTo( 800 , 600 ); 
	            document.resizeTo( 800 , 1000 );
	
				 
});
$("#field_dialog").find("#bgetUrl").button().click(function()
{
	
				 var features = [];
				 features.push("scrollbars","menubar","location","toolbar");
				var document = window.open( "getUrl.html" , features.join(","), "width = 100", "height = 100") ;									           
	             document.moveTo( 800 , 600 ); 
	            document.resizeTo( 800 , 1000 );
	
				 
});

	
	
$(this).accordion("refresh"); 
		 
		 
      
	
},false); // end of document
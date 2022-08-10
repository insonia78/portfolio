
$(document).ready(function(){
	
	
	
	
	
	
    var whichNumber = "";
    var n_tabs = 1;
    var check = 2; 
    var tabCounter = 2;
	var divAccordion = "";
    var hAccordion = "";
    var tabId = "";
    var Url = "";
	
	
	
var tabTitle = $( "#tab_title" ),
      tabContent = $( "#tab_content" ),
      tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
      
	    
		
    
    var tabs = $( ".selected" ).tabs();
 
    // modal dialog init: custom buttons and a "close" callback resetting the form inside
    var dialog = $( "#dialog" ).dialog({
      autoOpen: false,
      modal: true,
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
 
    // actual addTab function: adds new tab using the input from the form above
    function addTab() {
      var label = tabTitle.val() || "Tab " + tabCounter,
        id = "tabs-" + tabCounter,
        li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),
        tabContentHtml = tabContent.val() || "Tab " + tabCounter + " content.";
 
      tabs.find( ".ui-tabs-nav" ).append( li );
	  var a1 = '<div id = "'+ String(id) + '" class = "ui-tabs-panel ui-widget-content ui-corner-bottom .column ui-sortable"><div id="column'+ tabCounter +'" class = "column ui-sortable-handle ui-sortable"</div></div>' ;
	  
      tabs.append( a1);
      
	  tabs.tabs( "refresh" );
      
    }
 
    // addTab button: just opens the dialog
    $( "#add_tab" )
      .button()
      .click(function() {
        dialog.dialog( "open" );
		var id = $(".workbench").find(".confirm_opacity").attr("id");
		
		tabs = $("#"+id).tabs();
      });
	  tabs.delegate( "li.ui-state-active", "click", function() {
      tabId = $( this ).closest( "li" ).attr( "aria-controls" );
      
      
    });
    
    // close icon: removing the tab on click
    tabs.delegate( "span.ui-icon-close", "click", function() {
      var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
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
 
	
    
	/*****************************
	
	adding a portlet
	
	******************************/
	
	$("#add_portlet")
	  .button()
	   .click(function(){
			     
		     $("#portlet_dialog").dialog("open");		   
		
	   });	
  var html_portlet_dialog = '<div class="portlet" ><div class="portlet-header"></div><div class="portlet-content"><ul id="sortable" class="document"><li class="ui-state-default">li</li></ul></div></div>';
   
   
   var portlet_dialog = $("#portlet_dialog").dialog({
		autoOpen: false,
		modal: true,
		 buttons: {
        Add: function() {
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
	  
     
      
      
      
	 
	   tabs.find(String("#column"+ tabId[tabId.length - 1 ])).append(html_portlet_dialog);
       // accordion.find(tabId2).children(String("#column"+tabId[tabId.length - 1])).append("text");//.append(html_portlet_dialog);
        $(".portlet").addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
         .find( ".portlet-header" )
         .addClass( "ui-widget-header ui-corner-all" )
         .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");
	      
		  
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
	//  $('#accordion').accordion("refresh");
  }
  
 

  
});//end document
  
	
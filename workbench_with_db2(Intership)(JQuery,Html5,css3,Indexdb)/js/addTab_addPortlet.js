$(document).ready(function(){
/******************************
tool tip

********************************/

$( document ).tooltip();  
	
/**************************

 accordion structure
 

***************************/	



    var whichNumber = "";
    var n_tabs ;
    var check = 2; 
    var tabCounter = 1;
	var divAccordion = "";
    var hAccordion = "";
    var tabId = "";
	var tabs = ""
	var url = [] ;
	var tabs = "";
	var active_accordion = "";
    url[0] = "C:\\UsersTZANGARI\\Desktop\\Jira internship workbench\\main";   
	 var id = "";
	 var check =false; 
	 var files = false,
	    ul = "";  
	 
	
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
			  
			  $(".dinamicTab"+i).addClass( " selected ui-tabs ui-widget ui-widget-content ui-corner-all" )
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
  
	/*************************************

Adding an Accordion

**************************************/







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
//<div class="divAccordion1 ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active" id="ui-id-1" aria-labelledby="divAccordion1" role="tabpanel" aria-hidden="false" style="display: block;">

function addAccordion()
{
    
 var title = $("#accordion_title").val();
   
  var  description = $("#accordion_content").val();
  
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
   
   
      divAccordion = String("divAccordion"+ n_tabs);
	   hAccordion = String("hAccordion"+ n_tabs);
	  
	   var newDiv = $("<h3 id = '"+ divAccordion +"'class = '"+ hAccordion + " ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons' title ='"+ description +"'  >'"+ title +"'<span class='close_position ui-icon ui-icon-close' role='presentation'>Remove Accordion</span></h3><div class ='"+divAccordion+" ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active' id='ui-id-"+ n_tabs +"' value = '"+ title +"' aria-labelledby='"+ divAccordion+ "' role='tabpanel' aria-hidden='false' style='display: block;'></div>");
	   
	    
	  //  var newDiv = $("<h3 class = '"+ hAccordion +" ui-accordion-header ui-state-default ui-accordion-header-active ui-state-active ui-corner-top ui-accordion-icons' contenteditable='true' >hello</h3><div class ='"+divAccordion+" ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active'></div>");
	   
	    
		   
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
		

 }//end of function accordition
	
 
	
	
	
	
	
	 
	 
	 
	
	 
	/* 
 
	 $(".dinamicTab1").addClass( " selected ui-tabs ui-widget ui-widget-content ui-corner-all" )
  .children("ul")
  .addClass( "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" );

	 $("#ul1").find("li").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active");
	*/	 
   		 /**************************
		   adding a tab
		   
		   *********************/
/*		   
	 id = accordion.find(".selected").attr("id");
     alert(id);
	 
      var tabTitle = $( "#tab_title" ),
      tabContent = $( "#tab_content" ),
      tabTemplate = "<li title = '#{title}' ><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
      
	*/  
  
 
    // modal dialog init: custom buttons and a "close" callback resetting the form inside
    var dialog = $( "#dialog" ).dialog({
      autoOpen: false,
      modal: true,
	  width: 500,
	  height:700,
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
        dialog.dialog( "open" );
      });
 
    // actual addTab function: adds new tab using the input from the form above
    function addTab() {
		active_accordion = $("."+ "ui-accordion-content-active");
		
		 var tabTitle = $( "#tab_title" ),
             tabContent = $( "#tab_content" ),
             tabTemplate = "<li title = '#{title}'  value = '#{value}'><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
      
		id = active_accordion.find(".selected").attr("id");
		
        
		if(id == "tabs1" && tabCounter == 1)
		{
			tabCounter += 1;
		}
		
		 tabs = $("#" + id ).tabs();
		
      var label = tabTitle.val() || "Tab " + tabCounter,
        id = "tabs-" + tabCounter,
        li = $( tabTemplate.replace( /#\{title\}/g, tabContent.val() ).replace(/#\{value\}/g, label).replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),
        
		tabContentHtml = tabContent.val() || "Tab " + tabCounter + " content.";
 
       
       tabs.find( ".ui-tabs-nav" ).append(li);
	   

	 var a1 = '<div id = "'+ String(id) + '" class = "size ui-tabs-panel ui-widget-content ui-corner-bottom  ui-sortable"><div id="column'+ tabCounter +'" class = "column ui-sortable-handle ui-sortable"</div></div>' ;
	    
      tabs.append(a1);
      ++tabCounter;
	   
	  
	  
	 
	 
      
    
  //accordion.accordion("refresh");
    // addTab button: just opens the dialog
    
	  
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
	tabs.tabs( "refresh" );
	 accordion.find(tabs).append(tabs);
}
	
 
	
    
	/*****************************
	
	adding a portlet
	
	******************************/
	var tabTitle = "",
         tabContent = "";
  	
  
  
 
   
   var portlet_dialog = $("#portlet_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 500,
	    height:700,
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
	     
          var html_portlet_template = '<div class="portlet"  ><div class="portlet-header" title = "#{title}" value = "#{label}" >"#{label}"<span class="close_position ui-icon ui-icon-close" role="presentation">Remove Portlet</span></div><div class="portlet-content">"#{ul}"</div></div>';
          tabTitle = $( "#tab_title_portlet" ),
         tabContent = $( "#tab_description_portlet" );
		
	 alert("939"+window.files);
	 if(window.files == false)
    {	 
       ul = '<ul id="sortable" class="document"></ul>';
    
	}
	alert("ul"+ ul);
	window.files = false;
	var html_portlet_dialog  =   html_portlet_template.replace( /#\{title\}/g,  tabContent.val() ).replace( /#\{label\}/g, tabTitle.val() ).replace(/#\{ul\}/g,ul );
        
      
	 
	   tabs.find(String("#column"+ tabId[tabId.length - 1 ])).append(html_portlet_dialog);
       // accordion.find(tabId2).children(String("#column"+tabId[tabId.length - 1])).append("text");//.append(html_portlet_dialog);
        $(".portlet").addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
         .find( ".portlet-header" )
         .addClass( "ui-widget-header ui-corner-all" )
         .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");
	      /******************************
		  Read File
		  
		  *******************************/
        
		
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
 
  $("#add_portlet")
	  .button()
	   .click(function(){
			     
		     $("#portlet_dialog").dialog("open");		   
		
	   });	
  
	
	
	/***********************
	
	 add Field
	
	************************/
$( "#add_field")
      .button()
      .click(function() {
        $('#field_dialog').dialog( "open" );
      });
	var field_dialog = $("#field_dialog").dialog({
		autoOpen: false,
		modal: true,
		width: 500,
	    height:700,
		 buttons: {
        Add: function() {
		  var liTemplate = $('<li id = "l2"  class="ui-state-default">Create a New Issue Skeleton</li>');
          addField(liTemplate);
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
	
    function addField(li)
	{
		var fileInput = document.getElementById("myfileinput");

// files is a FileList object (simliar to NodeList)
        var files = fileInput.files;
         
        for (var i = 0; i < files.length; i++) {
        alert("Filename " + files[i].name);
        }
		
	     
	    $(".selected").find("#sortable").append(li.append($("<a></a>").attr("value",path)));
	    $(".selected").removeClass("selected");
	
	}	
	
	
	
	
	
	
	
  /******************************
  
    capturing the files for the li elements 
  
  
  
  ************************************/
  /*
   function readfiles(files) {
/*********************************
write in location of the system 


        var name = "";
        url[1] = accordion.find("."+ "ui-accordion-content-active").attr("value");
        alert("1072"+ url[1]);	
        url[2] =   accordion.find("."+ "ui-accordion-content-active").find("." + 'ui-tabs-active').attr("value");
        alert("1074"+url[2]);
       // url[3] = tabTitle;  
        alert("1076" + url[3]);	 
	    var urlpath = url[0]+"\\"+url[1]+"\\"+url[2]+"\\"+url[3];
	     alert(urlpath);
	    var file = "";
        for (var i = 0; i < files.length; i++) {
  alert('1081');
  var fileInput = document.getElementById("myfileinput");

// files is a FileList object (simliar to NodeList)
        var files = fileInput.files;
         alert(fileInput);   
        for (var z = 0; i < files.length; z++) {
        alert("Filename " + files[z].name);
		}
     
    var name = files[i].name;
    
	   
	
    var blob = new Blob([files[i]],{type: 'application/octet-binary'});
	path = URL.createObjectURL(blob); //reader.readAsDataURL(files[i]);
	$(".quickView").attr("src",path);
	var a = document.createElement("a");
    var file = new Blob([file[i]], {type: 'application/octet-binary'});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
	 
  
   
   
  }
  
}	
*/
var name ="";
function readfiles(files) {
        var fill_ul ="";
        url[1] = accordion.find("."+ "ui-accordion-content-active").attr("value");
        alert("1072"+ url[1]);	
        url[2] =   accordion.find("."+ "ui-accordion-content-active").find("." + 'ui-tabs-active').attr("value");
        alert("1074"+url[2]);
        url[3] = $( "#tab_title_portlet" ).val();  
        alert("1076" + url[3]);	 
	    var urlpath = url[0]+"\\"+url[1]+"\\"+url[2]+"\\"+url[3];
	     alert(urlpath);
  for (var i = 0; i < files.length; i++) {
  
    
    name = files[0].name;
	fill_ul = fill_ul + '<li  id ="'+ i +'"    value = "' + name + '"class="ui-state-default"><a value = "'+ name +'">'+ name +'</a></li>';
    
    
    var blob = new Blob([files[0]],{type: 'multipart/form-data'});
	var path = URL.createObjectURL(blob); //reader.readAsDataURL(files[i]);
	//document.getElementById('image').src = url;
  }
  ul = '<ul id="sortable" class="document">'+ fill_ul +'</ul>';
  window.files = true;
  alert(ul + "files" + files);
}	
var holder = document.getElementById('holder');
holder.ondragover = function () { this.className = 'hover'; return false; };
holder.ondragend = function () { this.className = ''; return false; };
holder.ondrop = function (e) {
  this.className = '';
  e.preventDefault();
  readfiles(e.dataTransfer.files);
} 

  

function addField(li)
	{
	      
	    $(".selected").find("#sortable").append("<li class='ui-state-default' value ='"+ path +"'>thomas</li>");
	    $(".selected").removeClass("selected");
	
	}
	
	/*
	function save_content_to_file(content, filename){
    var dlg = false;
    with(document){
     ir=createElement('iframe');
     ir.id='ifr';
     ir.location='about.blank';
     ir.style.display='none';
     body.appendChild(ir);
      with(getElementById('ifr').contentWindow.document){
           open("text/plain", "replace");
           charset = "utf-8";
           write(content);
           close();
           document.charset = "utf-8";
           dlg = execCommand('SaveAs', false, filename);
       }
       body.removeChild(ir);
     }
    return dlg;
}
*/	

    
    
    
    
		 
		 
		$(this).accordion("refresh"); 
		 
		 
       // }//end of create function
	  //}); //end of accordion for static   

             
			  
			//  $(".ui-accordion-header-active").mouseover(function(){
		
		

	 
		 
   		 /**************************
		   adding a tab
		   
		   
		 
	 
      var tabTitle = $( "#tab_title" ),
      tabContent = $( "#tab_content" ),
      tabTemplate = "<li title = '#{title}' ><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
      
	  
    
    var tabs = $( "."+ id );
 
 
 
     
 
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
        li = $( tabTemplate.replace( /#\{title\}/g, tabContent.val() ).replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),
        tabContentHtml = tabContent.val() || "Tab " + tabCounter + " content.";
 
      tabs.find( ".ui-tabs-nav" ).append("475" );
	  var a1 = '<div id="document_link" ><div id = "'+ String(id) + '" class = "size .size ui-tabs-panel ui-widget-content ui-corner-bottom .column ui-sortable"><div id="column'+ tabCounter +'" class = "column ui-sortable-handle ui-sortable"</div></div></div>' ;
	  
      tabs.append( $(a1).insertAfter(tabs.find(".ui-tabs-nav")));
      ++tabCounter;
	  tabs.tabs( "refresh" );
      
    }
 
    // addTab button: just opens the dialog
    $( "#add_tab" )
      .button()
      .click(function() {
        dialog.dialog( "open" );
      });
	  tabs.delegate( "li.ui-state-active", "click", function() {
      tabId = $( this ).closest( "li" ).attr( "aria-controls" );
      url[2] = String("/"+ tabId);
      
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
	

	
  	
  
  
  var tabTitle = $( "#tab_title_portlet" ),
   tabContent = $( "#tab_description_portlet" );
   
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
	     
          var html_portlet_template = '<div class="portlet" ><div class="portlet-header" title = "#{title}" >"#{label}"</div><div class="portlet-content">"#{ul}"</div></div>';
  
		
	  
     var ul = '<ul id="sortable" class="document"><li id = "' + name + '"class="ui-state-default"><a value = "'+ name +'">'+ name +'</a></li></ul>';
     alert(ul + "205"+name);    
	var html_portlet_dialog  =   html_portlet_template.replace( /#\{title\}/g, tabTitle.val()).replace( /#\{label\}/g, tabContent.val() ).replace(/#\{ul\}/g,ul );
        url[3] =String("/" + tabTitle.val()); 
      
	 
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
 
  $("#add_portlet")
	  .button()
	   .click(function(){
			     
		     $("#portlet_dialog").dialog("open");		   
		
	   });	
  
	
	
	/***********************
	
	 add Field
	
	
$( "#add_field")
      .button()
      .click(function() {
        $('#field_dialog').dialog( "open" );
      });
	var field_dialog = $("#field_dialog").dialog({
		autoOpen: false,
		modal: true,
		 buttons: {
        Add: function() {
		  var liTemplate = $('<li id = "l2"  class="ui-state-default"><Create a New Issue Skeleton</li>');
          addField(liTemplate);
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
    function addField(li)
	{
		var fileInput = document.getElementById("myfileinput");

// files is a FileList object (simliar to NodeList)
        var files = fileInput.files;
         alert(fileInput);   
        for (var i = 0; i < files.length; i++) {
        alert("Filename " + files[i].name);
        }
		
	     alert("250"+ path); 
	    $(".selected").find("#sortable").append(li.append($("<a></a>").attr("value",path)));
	    $(".selected").removeClass("selected");
	
	}	
	
	
	
	
	
	
	
  /******************************
  
    capturing the files for the li elements 
  
  
  
 
  var path = "";
  
		function readfiles(files) {
  for (var i = 0; i < files.length; i++) {
  
    
     alert(files[i].name);
     name = files[i].name; 
    var blob = new Blob([files[0]],{type: 'multipart/form-data'});
	path = URL.createObjectURL(blob); //reader.readAsDataURL(files[i]);
	//document.getElementById('image').src = path;
  }
}	
var holder = document.getElementById('holder');
holder.ondragover = function () { this.className = 'hover'; return false; };
holder.ondragend = function () { this.className = ''; return false; };
holder.ondrop = function (e) {
  this.className = '';
  e.preventDefault();
  readfiles(e.dataTransfer.files);
} 
function addField(li)
	{
	     alert("259"+ path); 
	    $(".selected").find("#sortable").append("<li class='ui-state-default' value ='"+ path +"'>thomas</li>");
	    $(".selected").removeClass("selected");
	
	}
			// $('#accordion').accordion("refresh");  
		


  //  }//end of function accordition
  ************************/
	
}); // end of document
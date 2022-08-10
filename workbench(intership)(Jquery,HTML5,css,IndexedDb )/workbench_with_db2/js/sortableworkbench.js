
$(document).ready(function() {
try
{ 
     


 
 $(function() {
	 
    $( ".column" ).sortable({
      connectWith: ".column",
      handle: ".portlet-header",
      cancel: ".portlet-toggle",
      placeholder: "portlet-placeholder ui-corner-all",
	 containment: "parent"
    });
 
    $( ".portlet" )
      .addClass( "ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" )
      .find( ".portlet-header" )
        .addClass( "ui-widget-header ui-corner-all" )
        .prepend( "<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");
 
    $( ".portlet-toggle" ).click(function() {
      var icon = $( this );
      icon.toggleClass( "ui-icon-minusthick ui-icon-plusthick" );
      icon.closest( ".portlet" ).find( ".portlet-content" ).toggle();
    });
  });
   
   $(".portlet").click(function(){
	   
	   
	    if(!(1|$( ".column" ).sortable( "enable" )) == false)
		{
			//1|$( ".link_container" ).sortable( "disable" );
			1|$( ".column" ).sortable( "disable" );
			$( ".portlet" ).draggable({
		   
             containment :"parent"
			
             });
			
			
		}   
		else
		{
			
		    1|$( ".portlet" ).draggable({
				containment :"parent"
			});
		
			1|$( ".link_container" ).sortable( "disable" );
			1|$( ".column" ).sortable( "disable" );
			
			
			
		}
		    	
      
	   
});
}catch(err)
{
	alert( "rerfresh");
}
});
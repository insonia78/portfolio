 $(document).ready(function(){
 
 $( "#fun_container" ).find("#vtab_pop").button().dblclick(function(){
		
		
		
		$( "#fun_container" ).find("#vtab_add").toggleClass("hidden");
	    

		$( "#fun_container" ).find("#vtab_add").button().click(function(){
		  
		      dialog.dialog( "open" );
			  
		});
		
		var holder = document.getElementById('holder');
        var aholder = document.getElementById('aholder');



if(holder != "")
{
	alert('');
holder.ondragover = function () { this.className = 'hover'; return false; };
holder.ondragend = function () { this.className = ''; return false; };
holder.ondrop = function (e) {
  this.className = '';
  e.preventDefault();
  files_portlet[z] = e.dataTransfer.files[0] ;
  var fileName = e.dataTransfer.files[0].name ;
  var fileType =  e.dataTransfer.files[0].name.split(".");
}
}
			 
			 $("#screen_S").find("#add").button().click(function(){		 
			
			   var obj = new Screen_s();
			  
			    var   img_template = '<fieldset id="the_screen'+ i +'" style = " width:290px; height:150px;" >'
		                           + '<label for="field_title">Name of the screeshot</label>'
								   + '<br>'
								   + '<input type="text" name="tab_title" id="src_title'+i+'"  class="ui-widget-content ui-corner-all">'
								   + '<br>'
								   + '<label for="field_title">Src</label>'
								   + '<br>'
								   + '<input id = "src'+i+'" style ="width:220px" type="url" name="url" title = "paste your url here"  class="ui-widget-content ui-corner-all">'
								   + '<br>'
								   + '<label for="fied_content">Url Description</label>'
								   + '<br>'
								   +'<textarea name="field_content" id="src_description' + i + '" class="ui-widget-content ui-corner-all"></textarea>'
								   + '<br>'
								   + '<form style ="position:relative; left:230px; top: -185px;" enctype="multipart/form-data"><div class="form-group"><text></text><br><form method="post" action="#"><input id = "myfileinput" type="file" hidden><div id="imHolder"  style="font-size:20px;color:blue;text-align:center;width:140px; height:130px; border: 10px dashed #ccc" id="imHolder" >Upload your File</div></form>'
								   
								   + '</fieldset>'
			   
               			   
              
			  $( "#screen_S " ).find("#screen_container").append( img_template );
			  
			 
			
			 
			   $( "#screen_container" ).find("#the_screen"+ i).mouseout(function(){
			       
					
					 obj.name = $( this ).find("#src_title" + i ).val();
					 if(obj.name == $( this ).find("#src" + i ).val() )
					 {
					 
					 }
					 else
					 {
					 
					  obj.src = $( this ).find("#src" + i ).val(); 
			         }
					 
					 obj.description = $( this ).find( "#src_description" + i).val();
                      
                     screen_s[ i ] = obj;   					  
			       
			   
			   
			   
			   });
			   
			   
			   i++;
			  

			  });
			  
			  
			  
			 $("#screen_S").find("#delete").button().click(function(){
			 
			 
			 $("#screen_S").find("#the_screen" + (i -1)).remove();
			 
			   screen_s[ i - 1] = "";
			   i-- ;
			 
			 
			 });
			 
			 var y = 0;
			 
			 
			  $("#files").find("#add").button().click(function(){		 
			
			  
			  
			    var   file_template = '<fieldset id="the_screen'+ y +'" style = " width:290px; height:150px;" >'
		                           + '<label for="field_title">Name of the screeshot</label>'
								   + '<br>'
								   + '<input type="text" name="tab_title" id="url_title'+ y + '"  class="ui-widget-content ui-corner-all">'
								   + '<br>'
								   + '<label for="field_title">Url</label>'								   
								   + '<br>'
								   + '<input id = "url' + y + '" style ="width:220px" type="url" name="url" title = "paste your url here"  class="ui-widget-content ui-corner-all">'
								   + '<br>'
								   + '<label for="fied_content">Url Description</label>'
								   + '<br>'
								   +'<textarea name="field_content" id="url_description' + y + '" class="ui-widget-content ui-corner-all"></textarea>'
								   + '<br>'
								   + '<form style ="position:relative; left:230px; top: -185px;" enctype="multipart/form-data"><div class="form-group"><text></text><br><form method="post" action="#"><input id = "myfileinput" type="file" hidden><div id="holder"  style="font-size:20px;color:blue;text-align:center;width:40px; height:130px; border: 10px dashed #ccc" id="holder" >Upload your File</div></form>'
								   
								   + '</fieldset>';
			   
               			   
              
			  $( "#files " ).find("#file_container").append( file_template );
			   $( "#screen_container" ).find("#the_screen"+ y).mouseout(function(){
			        var obj = new Files();
					
					 obj.name = $( this ).find("#url_title" + y ).val();
					 obj.url = $( this ).find("#url" + y ).val(); 
			         obj.description = $( this ).find( "#url_description" + y).val();
                      var fileType = obj.name.split(".") 
					  
					  if(fileType[1] == 'docx' || fileType[1] == "doc" )
                      {
	                      obj.image = "images/doc.png";
	  
	  
                      }
                      else if(fileType[1] == 'xlsx' || fileType[1] == 'cvs' || fileType[1] == 'xlm' || fileType[1] == 'xls')
                     {
	                    obj.image = "images/excel.png";
	  
                     }
                     else if(fileType[1] == 'pdf')
                    {
	                    obj.image = "images/pdf.png";
	  
                    }
                    else
                   {
	                  obj.image = "images/file.png";
	  
                    }	  
					  
					  
					  
					  
                     files[ y ] = obj;   					  
			       
			   
			   
			   
			   });
			  
			   y++;
			  

			  });
			  
			  
			 $("#files").find("#delete").button().click(function(){
			 
			 
			 $("#files").find("#the_screen" + (y - 1 )).remove();
			   y-- ;
			 
			 
			 });
			 var z = 0;
			 $("#notes").find("#add").button().click(function(){		 
			
			  
			  
			    var   img_template = '<fieldset id="the_screen'+ z +'" style = "position:absolute; width:290px; height:150px;" >'
		                           
								   +'<textarea rows = "8" cols = "18" name= "field_content" id="url_description_portlet' + z + '" class="ui-widget-content ui-corner-all"></textarea>'
								   + '<br>'
								   + '</fieldset>'
			   
               			   
              
			  $( "#notes " ).find("#notes_container").append( img_template );
			  
			   
			  

			  });
			  
			  
			 $("#notes").find("#delete").button().click(function(){
			 
			 
			 $("#notes").find("#the_screen" + z).remove();
			   
			 
			 
			 });
 });
 
 });
			 
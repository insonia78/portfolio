
 /*****************************************************
  
  
    creating an object where to store the tabs portlets and fiels with relative files or url links 
	
  
  
  
  **************************************************/

   
   
   var name ,
       newTab,
	   allTabs = [],
	   index,
       aportlet;
	   
	   
	   var newAccordion = function()
      {
	      this.accordion = "";
		  this.description = "";
		  this.divAccordion = "";
		  this.hAccordion = "";
		  this.n_tabs ="";
		  this.tabId = "";
		  this.tabCounter = 0 ;
		  this.anewTab = [];
		  this.tabs = "" ;
		  
      }
	  
	   var setTabs = function()
	   {	      
			   this.name ; 
		       this.id ;
			   this.description ;
                
			   this.portletNumber = 0;
               this.column ;			   
		       this.portlet = [] ;   
		   
	   }
   
  
    var setPortlet = function()
	   {	      
			    
		       this.name ;
			   this.description ;
			   this.portletCounter ;
               this.fieldNumber = 0;	   
		       this.field = [];     
		   
	   }
	   
	var setField = function()
	{
		
		this.url ;
		this.image ;
		this.file_name ;
		this.fieldTitle ;
		this.description ;
		this.fieldNumber ;
	}
	var windows = function()
	{
		this.x ;
		this.y ; 
		this.w ;
		this.h ; 
		this.url ; 
		this.description ; 
						 
						 
	}
	var stickyNotes = function()
	{
		
		this.y = 0;
		this.X = 0;
		this.Y = 0 ;
		this.text = "";
		
		
		
		
	}
	var Screen_s = function()
	{
		
		
		this.name;
		this.src ;
		this.description ;
		this.srcUrl ;
		
		
		
	}
	
	var Files = function()
	{
		
		this.name ;
		this.url ;
		this.description ;
		this.image ;
		this.urlUrl;
		
	}
	
	var side_array = function()
	{		
		this.tab_name;
		this.description ;
		
		this.screen_s;
		this.files ;
		this.notes ;
		
	}
	
  
   
	   
       
	   
  




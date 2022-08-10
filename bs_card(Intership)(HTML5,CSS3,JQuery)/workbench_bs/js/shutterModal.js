// Shutter Modal js
// Copyright (c) 2015 Sandeep MT - http://mtsandeep.com
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
// credits for vertically centering http://christopheraue.net/2014/02/20/centering-with-vertical-align-middle/
;(function($){ 
	$.fn.extend({  
		shutterModal: function(options) {

			var defaults = {
				background: 'rgba(0,0,0,0.6)',
				zIndex:99,
				url: '',
				easing: 'swing',
				duration: 1000,
				showAfter: 0,
				hideAfter: 0,
				close: true,
				escClose: true,
				remove: false,
				onLoad : function(){},
				onClose : function(){}
			};
			  
			var options = $.extend(defaults, options); 
			return this.each(function() {
				var o = options; 
				
				var windowHeight = $(window).height();
				var pageCover = '<div id="shutter-cover" style="position:absolute;top:0;left:0;width:100%;height:100%;background:'+o.background+';z-index:'+o.zIndex+';margin-top:-'+windowHeight+'px;"></div>';
				var close ='<a class="shutter-close" href="#">X</a>';
				
				var element = $(this);
				var $this = prepareShutter(element);
				
				if(o.showAfter) {
					setTimeout(function() {
						shutter();
					}, o.showAfter);
				} else {
					shutter();
				}
				
				if(o.hideAfter){
					 setTimeout(function() {
						closeShutter();
					  }, o.showAfter+o.hideAfter);
				} else if(o.remove){
					closeShutter();
				}
				
				if(o.escClose) {
					$(document).bind('keyup.shutter', function(e){
					   if (e.which == 27) {
							closeShutter();
					   }
					});
				}
				
				$this.delegate('.shutter-close','click', function(e) { //replacing live with delegate to support v1.7
					e.preventDefault();
					closeShutter();
				});
				
				on_resize(function(){
					fixPosition();
				});
				
				function prepareShutter(element){
					$('body').append(pageCover); //added the page cover to body
					var contentWrapper = $('<div id="shutter-content"></div>');
					
					if(o.url){ //check if url is provided, if yes load that to the div
						$('body').find('#shutter-cover').html(contentWrapper);
						$.get( o.url, function(data) {
							$('body').find('#shutter-content').append(data).css('z-index',o.zIndex+9).addClass('shutter'); // appending so as not to remove the close button
							fixPosition(); // make sure size is properly done after getting content
						});
					} else {
						var modalContent = contentWrapper.html(element.clone().show());
						modalContent.css('z-index',o.zIndex+9).addClass('shutter');
						$('body').find('#shutter-cover').html(modalContent);
					}
					
					return $('body').find('#shutter-content');
				}
				
				function shutter(){
					showClose();
					fixPosition();
					$('body').find('#shutter-cover').animate({marginTop:0}, o.duration, o.easing, function(){
						o.onLoad($this); //callback after shutter is loaded and displayed
					});					
				}
				
				function showClose(){
					if(o.close){
						if ($this.children('.shutter-close').length){
							$this.children('.shutter-close').show();
						} else {
							$this.prepend(close);
						}
					}
				}
				
				function fixPosition(){
					var remainingHeight = $(window).height() - $this.outerHeight();
					var remainingWidth = $(window).width() - $this.outerWidth();
					if(remainingHeight < 40){ // 20px at top between the content and window
						$('#shutter-cover').css({'height':$this.outerHeight(true)});
					} else {
						$('#shutter-cover').css({'height':'100%'});
					}
					if(remainingWidth < 40){
						$('#shutter-cover').css({'width':$this.outerWidth()});
					} else {
						$('#shutter-cover').css({'width':'100%'});
					}
				}
				
				// resize with delay
				function on_resize(c,t){
					$(window).bind('resize.shutter',function(){ 
						clearTimeout(t);	
						t = setTimeout(c, 50); 
					});
				}
					
				function closeShutter(){
					$(window).unbind('resize.shutter');
					$(document).unbind('keyup.shutter');
					if($(window).height() > $this.outerHeight(true)){
						var requiredHeight = $(window).height();
					} else {
						var requiredHeight = $this.outerHeight(true);
					}
					$('#shutter-cover').animate({marginTop:-requiredHeight}, o.duration, o.easing, function(){
						o.onClose($this); //callback after shutter is removed
						$('#shutter-cover').remove(); //remove everything
					});
				}
			
			}); 
		} 
	}); 
})(jQuery);
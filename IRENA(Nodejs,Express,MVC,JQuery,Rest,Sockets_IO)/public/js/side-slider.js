
$(document).ready(function () {
   
    // Scenario tab show  
    $.fn.sideSlider = function (options) {
        
        var $this = $(this);
        var settings = $.extend({
            speed: 1,
            side: 'right',
            complete: null
        }, options);

        var side = 'marginRight';
        if (settings.side == 'left') {
            side = 'marginLeft';
        }
        var _switch = true;
        var speed_multiplier = parseInt(settings.speed);
        var finish = $this.css(side).replace('px', '');
        var distance = $('#sideslider').width();
        var start = $('.sideslider').css(side).replace('px', '');

        
        $('#sideslider > .sideslider-tab, #sideslider > .sideslider-close').click(function ()
        {
            
            if (_switch)
            {
                if ($this.css(side).replace('px', '') == start)
                {
                    if (side == 'marginRight') {
                        $this.animate({marginRight: "+=" + distance}, speed_multiplier * 1000, function () {
                            finish = $this.css(side).replace('px', '');
                        });
                    } else if (side == 'marginLeft')
                    {
                        $this.animate({marginLeft: "+=" + distance}, speed_multiplier * 1000, function () {
                            finish = $this.css(side).replace('px', '');
                        });
                    }
                }
                _switch = false;
            } else
            {
                if ($this.css(side).replace('px', '') == finish)
                {
                    if (side == 'marginRight') {
                        $this.animate({marginRight: "-=" + distance}, speed_multiplier * 1000, function () {
                            start = $this.css(side).replace('px', '');
                        });
                    } else if (side == 'marginLeft')
                    {
                        $this.animate({marginLeft: "-=" + distance}, speed_multiplier * 1000, function () {
                            start = $this.css(side).replace('px', '');
                        });
                    }
                    _switch = true;
                }
            }

        });

        return $this.each(function () {

            if ($.isFunction(settings.complete)) {
                settings.complete.call(this);
            }
        });
    }
    /////////////////////////////////////////////////////////////////////////////////////////////
    //tabs slide show

    $.fn.sideSlider1 = function (options) {
        var $this = $(this);
        var settings = $.extend({
            speed: 1,
            side: 'right',
            complete: null
        }, options);

        var side = 'marginRight';
        if (settings.side == 'left') {
            side = 'marginLeft';
        }
        var _switch = true;
        var speed_multiplier = parseInt(settings.speed);
        var finish = $this.css(side).replace('px', '');
        var distance = $('#sideslider1').width();
        var start = $('.sideslider1').css(side).replace('px', '');


        $(' #sideslider1 > .sideslider-tab, #sideslider1 > .sideslider-close').click(function ()
        {
            if (_switch)
            {
                if ($this.css(side).replace('px', '') == start)
                {
                    if (side == 'marginRight') {
                        $this.animate({marginRight: "+=" + distance}, speed_multiplier * 1000, function () {
                            finish = $this.css(side).replace('px', '');
                        });
                    } else if (side == 'marginLeft')
                    {
                        $this.animate({marginLeft: "+=" + distance}, speed_multiplier * 1000, function () {
                            finish = $this.css(side).replace('px', '');
                        });
                    }
                }
                _switch = false;
            } else
            {
                if ($this.css(side).replace('px', '') == finish)
                {
                    if (side == 'marginRight') {
                        $this.animate({marginRight: "-=" + distance}, speed_multiplier * 1000, function () {
                            start = $this.css(side).replace('px', '');
                        });
                    } else if (side == 'marginLeft')
                    {
                        $this.animate({marginLeft: "-=" + distance}, speed_multiplier * 1000, function () {
                            start = $this.css(side).replace('px', '');
                        });
                    }
                    _switch = true;
                }
            }
        });

        return $this.each(function () {

            if ($.isFunction(settings.complete)) {
                settings.complete.call(this);
            }
        });
    }
    /***************************************************************/
    // help side show
    $.fn.sideSlider2 = function (options) {
        var $this = $(this);
        var settings = $.extend({
            speed: 1,
            side: 'right',
            complete: null
        }, options);

        var side = 'marginRight';
        if (settings.side == 'left') {
            side = 'marginLeft';
        }
        var _switch = true;
        var speed_multiplier = parseInt(settings.speed);
        var finish = $this.css(side).replace('px', '');
        var distance = $('#sideslider2').width();
        var start = $('.sideslider2').css(side).replace('px', '');


        $(' #sideslider2 > .sideslider-tab, #sideslider2 > .sideslider-close').click(function ()
        {
            if (_switch)
            {
                if ($this.css(side).replace('px', '') == start)
                {
                    if (side == 'marginRight') {
                        $this.animate({marginRight: "+=" + distance}, speed_multiplier * 1000, function () {
                            finish = $this.css(side).replace('px', '');
                        });
                    } else if (side == 'marginLeft')
                    {
                        $this.animate({marginLeft: "+=" + distance}, speed_multiplier * 1000, function () {
                            finish = $this.css(side).replace('px', '');
                        });
                    }
                }
                _switch = false;
            } else
            {
                if ($this.css(side).replace('px', '') == finish)
                {
                    if (side == 'marginRight') {
                        $this.animate({marginRight: "-=" + distance}, speed_multiplier * 1000, function () {
                            start = $this.css(side).replace('px', '');
                        });
                    } else if (side == 'marginLeft')
                    {
                        $this.animate({marginLeft: "-=" + distance}, speed_multiplier * 1000, function () {
                            start = $this.css(side).replace('px', '');
                        });
                    }
                    _switch = true;
                }
            }
        });

        return $this.each(function () {

            if ($.isFunction(settings.complete)) {
                settings.complete.call(this);
            }
        });
    }
});
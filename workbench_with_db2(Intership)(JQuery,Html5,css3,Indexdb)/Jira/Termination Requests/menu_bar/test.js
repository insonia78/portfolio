
window.onload = start();

function start()
{

document.write('<html><head><link href="menu_bar/scrolling.css" rel="stylesheet" type="text/css"> '+
'<link href="menu_bar/menupuncher.css" rel="stylesheet" type="text/css">'+
'<script src="menu_bar/jquery.min.js"></script>'+
'<script src="menu_bar/menupuncher.js"></script>'+
'<script src="js/Word_Export_PlugIn/FileSaver.js"></script>'+ 
'<script src="js/Word_Export_PlugIn/jquery.wordexport.js"></script>'+ 
'<script type="text/javascript">'+
    'jQuery(document).ready(function($) {'+
        '$("a.word-export").click(function(event) {'+
            '$("#page-content").wordExport();'+
        '});'+
    '});'+
'</script>'+



'</head>'+
'<body class="f1-nav">'+
		'<div class="panel">'+
			 '<div class="row">'+
				'<div class="small-12 medium-12 medium-centered columns">'+
					'<a class="word-export" href="javascript:void(0)"><button> Export as .doc</button></a>'+ 
					
				'</div>'+
			'</div>'+
		'</div>'+
		

		'<header>'+
			'<div class="row">'+
				'<div class="small-4 medium-6 columns">'+
					'<span class="factor1">System Menu</span><span class="tag">System Menu</span>'+
				'</div>'+
				'<div class="small-4 medium-2 columns">'+
					'<a id="nav-toggle" class="mm_open"><span></span></a>'+
				'</div>'+
			'</div>'+
		'</header>'+
'<div id="page-content">' );
}



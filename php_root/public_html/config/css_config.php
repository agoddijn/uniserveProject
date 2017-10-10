<?php


$css = array();

$css['body, li, ol, p, table, td, th, tr, a, ul, blockquote, div'] = array(
	//'font-family' => 'Arial, Verdana, Helvetica, sans-serif',
	'font-family' => 'Tahoma, Geneva, sans-serif',
	'font-size' => '12px',
	'color' => '#0D0700'
);

$css['body'] = array(
	'background-color' => '#ffffff',
	'margin-left' => '0px',
	'margin-top' => '0px',
	'margin-right' => '0px',
	'margin-bottom' => '30px'
);

$css['a'] = array(
	'color' => '#00527f',
	'text-decoration' => 'none'
);

$css['.disabled'] = array(
	'color' => '#999999'
);

$css['.error'] = array(
	'color' => '#CC0000',
	'font-weight' => 'bold'
);

$css['a:hover'] = array(
	'text-decoration' => 'underline'
);

$css['div.divider'] = array(
	'margin-top' => '9px',
	'border-bottom' => '1px solid #cccccc',
	'margin-bottom' => '10px',
	'display' => 'block'
);

$css['td.page'] = array(
	'border-style' => 'solid',
	'border-width' => '10px 2px',
	'border-color' => '#'.$brands['main_colour'],
	'padding' => '10px'
);

$css['.subtitle'] = array(
	'font-size' => '14px',
	'color' => '#00527f',
	'font-weight' => 'bold',
	'white-space' => 'nowrap'
);

$css['.title'] = array(
	'font-size' => '16px',
	'color' => '#'.$brands['main_colour'],
	'font-weight' => 'bold',
	'white-space' => 'nowrap',
	'display' => 'block'
);

$css['td.tab_colour'] = array(
	'background' => '#'.$brands['main_colour']
);


$css['td.bg-main'] = array(
	'background' => '#'.$brands['header_colour']
);

$css['td.bg-alt'] = array(
	'background' => '#'.$brands['sub_colour']
);

$css['table.vlist td'] = array(
	'padding' => '4px 2px',
	'vertical-align' => 'top'
);

$css['table.vlist tr.header td'] = array(
	'font-weight' => 'bold',
	'background' => '#'.$brands['sub_colour'],
	'color' => '#ffffff',
	'border-style' => 'none',
	'padding-top' => '3px',
	'padding-bottom' => '3px',
	'border-right' => '2px solid #ffffff',
	'padding-left' => '5px',
	'white-space' => 'nowrap'
);

$css['table.vlist tr.footer td'] = array(
	'font-weight' => 'bold',
	'color' => '#000000',
	'border-style' => 'none',
	'padding-top' => '3px',
	'padding-bottom' => '3px',
	'border-right' => '2px solid #ffffff',
	'padding-left' => '5px',
	'white-space' => 'nowrap',
	'border-top' => '2px solid #eff0f2'
);

$css['table.vlist tr.alt td'] = array(
	'background' => '#eff0f2',
	'border-right' => '2px solid #ffffff'
);



$css['table.hlist td'] = array(
	'padding' => '4px 2px',
	'border-bottom' => '1px solid #eff0f2',
	'vertical-align' => 'top'
);

$css['table.hlist td.header'] = array(
	'font-weight' => 'bold',
	'border-style' => 'none',
	'white-space' => 'nowrap'
);


//
// Current Day and Hover (Calendar)
//
$css['.cal_today'] = array(

        'font-size'             => '12px',
        'color'                 => '#003366',
        'background-color'      => '#CCEECC'
);
$css['.cal_avail'] = array(

        'font-size'             => '12px',
        'color'                 => '#003366',
        'background-color'      => '#FFFFCC'
);


$css['table.buttonbar'] = array(
	'height'				=> '24px',
	'background'			=> '#'.$brands['sub_colour'],
	'white-space'		=> 'nowrap'
);

$css['table.buttonbar td.left'] = array(
	'background'		=> 'url(/images/button/left.gif) no-repeat left top',
	'width'				=> '10px',
	'white-space'		=> 'nowrap'
);

$css['table.buttonbar td.right'] = array(
	'background'		=> 'url(/images/button/right.gif) no-repeat right top',
	'width'				=> '10px',
	'white-space'		=> 'nowrap'
);

$css['table.buttonbar td.button'] = array(
	'line-height'		=> '24px',
	'padding-right'		=> '5px',
	'padding-left'		=> '5px',
	'color'				=> '#'.$gHtml->adjust_hex_colour($brands['sub_colour'], -50),
	'font-weight'		=> 'bold',
	'white-space'		=> 'nowrap'
);

$css['table.buttonbar td.button a'] = array(
	'color'		=> '#ffffff'
);

$css['table.buttonbar td.div'] = array(
	'background'		=> '#ffffff',
	'width'				=> '2px',
	'white-space'		=> 'nowrap'
);

// VoIP submenus
$css['span.voip_btn'] = array(
	'border'			=> "solid #888888 1px",
	'background-color'	=> "#{$brands['main_colour']}",
	'color'				=> 'white',
	'font-weight'		=> 'bold',
	'padding'			=> '.3em'
);

$css['a.voip_btn'] = array(
	'border'			=> "solid #888888 1px",
	'background-color'	=> "#{$brands['main_colour']}",
	'color'				=> 'white',
	'font-weight'		=> 'bold',
	'padding'			=> '.3em'
);

$css['a.voip_btn:hover'] = array(	
	'background-color'	=> '#'.$gHtml->adjust_hex_colour($brands['main_colour'], -20),	
	'text-decoration'	=> 'none'
);


$css['input, textarea, select'] = array(
	//'width'			=>'375px',
	'display'		=>'inline',
	'border'		=>'1px solid #999',
	'padding-left'		=>'10px',
	'height'		=>'25px',
	'-webkit-box-shadow'	=>'1px 1px 5px rgba(0, 0, 0, 0.3)',
	'-moz-box-shadow'	=>'1px 1px 5px rgba(0, 0, 0, 0.3)',
	'box-shadow'		=>'1px 1px 5px rgba(0, 0, 0, 0.3)',
	'-webkit-border-radius'	=>'3px',
	'-moz-border-radius'	=>'3px',
	'border-radius'		=>'3px',
);

$css['input.radio'] = array(
	'display'		=>'inline',
	'border'		=>'0px solid #999',
	'padding-left'		=>'0px',
	'height'		=>'23px',
	'-webkit-box-shadow'	=>'0px 0px 0px rgba(0, 0, 0, 0)',
	'-moz-box-shadow'	=>'0px 0px 0px rgba(0, 0, 0, 0)',
	'box-shadow'		=>'0px 0px 0px rgba(0, 0, 0, 0)',
	'-webkit-border-radius'	=>'0px',
	'-moz-border-radius'	=>'0px',
	'border-radius'		=>'0px',
	'position'		=>'relative',
	'font-weight'		=>'bold',
	'padding-right'		=>'0px'
); 

$css['textarea'] = array(
	'height'		=> '150px',
	'width'			=> '350px',
);

$gConfig['css'] = $css;
unset($css);

?>

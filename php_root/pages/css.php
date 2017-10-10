<?php
//
// If we are allowed to Cache the CSS file..
//
if ($gConfig['html']['css_cache'] == true) {
	$mod_gmt = gmdate('D, d M Y H:i:s', getlastmod()) . ' GMT';
	header('Last-Modified: ' . $mod_gmt);
	header('Cache-Control: public, max-age=14400');
	header('Expires: '.gmdate('D, d M Y H:i:s', time()+14400).' GMT');
	header('Pragma: public');
} else {
	header('Expires: -1');
	header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
}

header('Content-type: text/css');

require(DIR_BASE . "/config/css_config.php");

if (is_array($gConfig['css'])) {
	foreach ($gConfig['css'] as $class => $params) {
		echo "$class{";
		if (is_array($params)) {
			foreach ($params as $key => $val) {
				echo "$key:$val;";
			}
		}
		echo "}\n\n";
	}
}

// Below CSS is for menu display
?>
#menu_ul {
	padding: 0;
	width: <?=$gConfig['html']['width']?>px;
	margin: 0 auto;
}

#menu_ul li {
	float: left;
	list-style: none;
	position: relative;
	border-right: 2px solid #ffffff;
}

#menu_ul a {
	display: block;
	padding: 10px 8px;
	color: #525151;
	font-size: 13px;
	font-weight: bold;
	white-space: nowrap;
	background: #e0e0e0;
}

#menu_ul a:hover  {
	text-decoration:none;
}

#menu_ul ul {
	margin:0;
	padding:0;
	display:none;
	position: absolute;
	top: 100%;
	left: -1px;
	background: #<?=$gHtml->adjust_hex_colour($brands['main_colour'], 26)?>;
	border: 1px solid #ffffff;
}

#menu_ul ul li {
	float: none;
	border-style: none;
}

#menu_ul ul a {
	padding: 4px 10px;
	color: #ffffff;
	font-size: 12px;
	font-weight: normal;
	background: transparent;
}

#menu_ul ul a:hover  {
	background: #<?=$brands['main_colour']?>;
}

#menu_ul a.current_menu, #menu_ul a.hover {
	color: #ffffff;
	background: #<?=$brands['main_colour']?>;
}

#menu_ul img {
	vertical-align:middle;
	width: 7px;
	height: 4px;
	border-style: none;
	margin-left: 10px;
}

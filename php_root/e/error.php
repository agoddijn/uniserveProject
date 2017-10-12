<?php

$error = @$_REQUEST['err'];

	header("Expires: -1");
	header("Cache-Control: no-store, no-cache, must-revalidate, pre-check=0, post-check=0");

	header("Content-type: text/html; charset=utf-8");
	header("Vary: Accept-Language");

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html lang="en_ca">


	<head>
		<title>
Uniserve My Account
		</title>
		<link href="/css/myaccount.css" rel="stylesheet" type="text/css"/>
		<link rel="shortcut icon" sizes="32x32" href="/images/uniserve_favicon.ico" />

		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
		
		<meta http-equiv="imagetoolbar" content="no"/>
		<meta name="mssmarttagspreventparsing" content="true"/>
		<meta name="keywords" content="uniserve, my account, myaccount"/>
		
		<link rel="stylesheet" type="text/css" href="/js_src/jquery-ui-1.11.1/jquery-ui.min.css">
		<script type="text/javascript" src="/js_src/jquery-1.11.1.min.js"></script>
		<script type="text/javascript" src="/js_src/jquery-ui-1.11.1/jquery-ui.min.js"></script>
	</head>
	<body>

	<style>
		label, input { display:block; }
		input.text { margin-bottom:12px; width:95%; padding: .4em; }
		fieldset { padding:0; border:0; margin-top:25px; }
    	</style>
 
		
	<header>
	<!-- Main Header Section -->
	<table width="100%" align="center" cellpadding="0" cellspacing="0" border="0">
		<tr>
			<td class="bg-main" align="left" height="90"  valign="middle">
				<a href="http://www.uniserve.com"><img src="/images/uniserve_logo.png" /></a>
				
			</td>
			<td>
				<ul id="account_ul">
				</ul>
				<div style="clear:both;"></div>
			</td>
		</tr>
	</table>
	</header>
<?php
require(DIR_BASE.'/templates/menu.php');
?>

<table width="100%" cellpadding="0" cellspacing="0" align="center" border="0">
<tr>
	<td class="page">	
<?php
// Error Page Details
?>
	<h2><b>ERROR: <?=$error;?></b></h2>
<?php
	if ($error == '400') {
		echo "<h4>Bad Request. Please don't be bad.</h4><br />";
	} else if ($error == '401') {
		echo "<h4>Unauthorized Access Attempt. Proper authorization is required for this page.</h4><br />";
	} else if ($error == '403') {
		//echo "<img src='../images/ysnp.gif'>";
		echo "<h4>Access Forbidden.  You shall not pass.</h4><br />";
	} else if ($error == '404') {
		//echo "<img src='../images/ntdyalf.jpg'>";
		echo "<h4>This is not the page you are looking for.</h4><br />";
	}
	else if ($error == '500') {
		echo "<h4>One of the squirrels fell of the wheel.  This internal server error has resulted in our inability to do what you need done.</h4><br />";
	}
	else {
		echo "<h4>Unknown Error.  We are not sure what happened to get you here, but the horrific experience has not gone un-noticed.</h4><br />";
	}
?>

	</td>
</tr>
</table>
<?php
//
// Include the footer
//
require(DIR_BASE . "/templates/footer.php");

?>

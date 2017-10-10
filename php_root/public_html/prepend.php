<?php

//
// Main Prepend File - This file get's included before EVERY .php
// file under this web root.

ob_start();

date_default_timezone_set('America/Vancouver');

require_once("config/defines.php");

require_once(DIR_BASE . "/lib/Error.php");
include_once(DIR_BASE . "/lib/Logs.php");

$gLog = &PLog::singleton();
$gError = &PError::singleton();

//
// Load the Config File
//
$gConfig = array();
include_once(DIR_BASE . "/config/config.php");


require_once(DIR_BASE . "/lib/Timer.php");
$gTimer = new PTimer();

include_once(DIR_BASE . "/lib/Base.php");
$gBase = &Base::singleton();

include_once(DIR_BASE . "/lib/Browser.php");
$gBrowser = &PBrowser::singleton();

include_once(DIR_BASE . "/lib/Messages.php");
$gMessage = &Messages::singleton();

include_once(DIR_BASE . "/lib/User.php");
include_once(DIR_BASE . "/lib/Sessions.php");
$gSession = &PSession::singleton();
$gUser = new PUser();

include_once(DIR_BASE . "/lib/Checks.php");
$gChecks = &PChecks::singleton();

include_once(DIR_BASE . "/lib/Main.php");
$gMain = &PMain::singleton();

include_once(DIR_BASE . "/lib/Actions.php");
$gActions = PActions::singleton();

include_once(DIR_BASE . "/lib/Db.php");
$gDb = new PDb (DB_PGSQL);

try{
	$gDb->Open('UBC');
} catch(Exception $e){
	echo"
<html><head><title>ERROR</title></head>
<body>
<div style='align: center; font-size:17px; font-family:Arial; font-weight:bold; color:#007FFF;'>
The database failed to connect.  Please check your configuration settings.
</div>

</body>
</html>
";
	exit;
}


if (in_array($_SERVER["REQUEST_URI"], $gConfig['ignored_urls'])) {
	$gError->_disable();
}

$_SESSION['brands'] = array( 'client' => 1, 
		'contact_name' => '', 
		'contact_email' => 
		'help@uniserve.com', 
		'contact_phone' => '1-877-864-7378', 
		'message' => '', 
		'head_keywords' => 'uniserve, my account, myaccount', 
		'head_close' => '', 
		'body_close' => '', 
		'main_url' => 'www.uniserve.com', 
		'protocol' => 'https');

$brands = $_SESSION['brands'];


if (@$brands['main_colour'] == '') {
	$brands['main_colour'] = '2D71B6';
}
if (@$brands['sub_colour'] == '') {
	$brands['sub_colour'] = '007FFF';
}
if (@$brands['header_colour'] == '') {
	$brands['header_colour'] = 'ffffff';
}

bindtextdomain("messages", DIR_BASE . "/locale");
bind_textdomain_codeset("messages", 'UTF-8');
textdomain("messages");
setcookie('lang', 'en_CA', time()+172800, '/');
$_COOKIE['lang'] = 'en_CA';
setlocale(LC_ALL,'en_CA','en','en_US','en_GB','en_CA.UTF8','en.UTF8','en_CA.UTF-8');
putenv('LANG='.$_COOKIE['lang']);


// load module based prepend files
$modules = array_diff(scandir(DIR_BASE . "/modules"), array('..', '.'));
foreach($modules as $module) {
	include_once("modules/".$module."/prepend.php");
}


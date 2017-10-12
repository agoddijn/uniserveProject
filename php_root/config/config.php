<?php

// If we should cache the CSS File. This keeps the user from
// having to download the CSS file EVERY time. (Leave this
// off until it's actually in production.)
//
$gConfig['html']['css_cache']	= false;
$gConfig['html']['width']	= "100%";

//
// Titles
//
$gConfig['esm_title']		= "My Account";
$gConfig['esm_short_title']	= "USM";

//
// Admin user (receives admin e-mails
//
$gConfig['admin_email']		= "devmessages@uniserve.com";
$gConfig['help_email']		= $gConfig['admin_email'];
$gConfig['billing_email']   = $gConfig['admin_email'];

$gConfig['customer_service_email']   = $gConfig['admin_email'];
$gConfig['alert_email']		= $gConfig['admin_email'];

//
// Database Settings
$gConfig['UBC']['host']          = "127.0.0.1";
$gConfig['UBC']['name']          = "ubc03";
$gConfig['UBC']['user']          = "ubc03";
$gConfig['UBC']['pass']          = "olivepepsi";

//
// API Settings
$gConfig['API']['host']          = "127.0.0.1:3031";
$gConfig['API']['authtoken']        = "tfFu9iEUfNjmW6Oj3sOSPS4BKGeBKTaJ";

//
// Define the session type: either "db" or "file"
//
$gConfig['session']['type']		= "file";

//
// Debug Log Mode
//
$gConfig['debug_log']		= true;


//
// Error Types
//
$gConfig['error_types'] = array(

	E_ERROR 		=> "Error",
	E_WARNING  		=> "Warning",
	E_PARSE 		=> "Parsing Error",
	E_NOTICE		=> "Notice",
	E_CORE_ERROR		=> "Core Error",
	E_CORE_WARNING		=> "Core Warning",
	E_COMPILE_ERROR		=> "Compile Error",
	E_COMPILE_WARNING	=> "Compile Warning",
	E_USER_ERROR 		=> "User Error",
	E_USER_WARNING		=> "User Warning",
	E_USER_NOTICE		=> "User Notice",
	E_ALL			=> "All Errors"
);

$gConfig['user_errors'] = array(

	0	=> E_USER_ERROR,
	1	=> E_USER_WARNING,
	2	=> E_USER_NOTICE
);

//
// Ignored URLs (urls we don't need to authenticate to
// access from site)
//
$gConfig['ignored_urls'] = array(
	URL_SUB . "/pages/css.php",
	URL_SUB . "/pages/logo.php",
);

//
// Days
//
$gConfig['days'] = array(
	0	=> _("Sunday"),
	1	=> _("Monday"),
	2	=> _("Tuesday"),
	3	=> _("Wednesday"),
	4	=> _("Thursday"),
	5	=> _("Friday"),
	6	=> _("Saturday")
);

//
// Months
//
$gConfig['months'] = array(
	'01'	=> _("Jan"),
	'02'	=> _("Feb"),
	'03'	=> _("Mar"),
	'04'	=> _("Apr"),
	'05'	=> _("May"),
	'06'	=> _("Jun"),
	'07'	=> _("Jul"),
	'08'	=> _("Aug"),
	'09'	=> _("Sep"),
	'10'	=> _("Oct"),
	'11'	=> _("Nov"),
	'12'	=> _("Dec")
);

//
// Full Months
//
$gConfig['full_months'] = array(
	_("January") => 1,
	_("February") => 2,
	_("March") => 3,
	_("April") => 4,
	_("May") => 5,
	_("June") => 6,
	_("July") => 7,
	_("August") => 8,
	_("September") => 9,
	_("October") => 10,
	_("November") => 11,
	_("December") => 12
);

//
// Enable/Disable Language Options
//
$gConfig['enable_languages']	= "no";

$gConfig['languages']['en_CA']	= array(
		'code'	=> "en",
		'charset'	=> "UTF-8",
		'locale'	=> array('en_CA','en','en_US','en_GB','en_CA.UTF8','en.UTF8','en_CA.UTF-8'),
		'description' => "English Canada",
		'alias'	=> "English"
);
$gConfig['languages']['fr_CA']	= array(
		'code'	=> "fr",
		'charset'	=> "UTF-8",
		'locale'	=> array('fr_CA','fr','fr_FR','fr_CA.UTF8','fr.UTF8','fr_CA.UTF-8'),
		'description' => "French Canada",
		'alias'	=> "French"
);


//
// Load the other config files
//
require_once(DIR_BASE . "/config/reference_tables.php");
require_once(DIR_BASE . "/config/defaults.php");

?>

<?php

//
// -------------- THESE NEED TO BE SET RIGHT ------------------ //
//
@define("URL_HOST", $_SERVER['HTTP_HOST']);
@define("URL_SUB", "");
@define("DIR_BASE", "/home/ubc03/public_html");
@define("DIR_LIB", "/home/ubc03/public_html/lib");
@define('URL_PROTOCOL', empty($_SERVER['HTTPS']) ? 'http' : 'https');

//
// ------------------------------------------------------------ //
//

@define("URL_ROOT", "http://" . URL_HOST);
@define("URL_BASE", URL_ROOT . URL_SUB);

@define("ESM_VERSION", "5.0.dev");
@define("ESM_BUILD", "9360");

@define("PUSER_CONTACT_EMAIL", $gConfig['help_email']);
@define("EUI_AUTH_METHOD_PASSWORD", 5);

//
// Script error codes
//
@define("FATAL", E_USER_ERROR);
@define("ERROR", E_USER_WARNING);
@define("WARNING", E_USER_NOTICE);

//
// Username lengths
//
@define('MAX_USERNAME_LENGTH', 16);
@define('MIN_USERNAME_LENGTH', 2);

//
// Password Lengths
//
@define('MAX_PASSWORD_LENGTH', 20);
@define('MIN_PASSWORD_LENGTH', 2);


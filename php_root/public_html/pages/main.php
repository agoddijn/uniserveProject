<?php
//
// Load the requested page
//

switch ($p) {

	//
	// Main Welcome Page
	//
	case 'welcome' :

		require_once (DIR_BASE . "/templates/welcome.php");
		break;


	default :
		header ( "Location: " . URL_BASE . "/404.html" );
		exit ();
		break;
		
}
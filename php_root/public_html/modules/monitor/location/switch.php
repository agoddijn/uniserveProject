<?php

//
// Load the requested page
//
switch($page) {
	
	// examples
	case "level1a":
	case "level1b":
	case "level1c":
				
		require_once(DIR_BASE . "/modules/monitor/templates/level1.php");

	break;
	
	case "level2a":
	case "level2b":
	case "level2c":
	
		require_once(DIR_BASE . "/modules/monitor/templates/level2.php");
	
	break;
	//
	// Default Page
	//
	default:
	case "monitor":
		//
		// Display any message from the $gMessage class if there are any
		//
		if ($gMessage->waiting()) $gMessage->display();

		require_once(DIR_BASE . "/modules/monitor/templates/monitor.php");
		
	break;
}

?>

<?php

//
// Load the requested page
//
switch($page) {
	
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

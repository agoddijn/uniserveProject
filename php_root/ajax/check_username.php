<?php
if ( ! $gUser->_logged_in()) {
	return;
}

if (preg_match('/^[a-z][a-z0-9_\.\-]{1,14}[a-z0-9]$/i', $_GET['username']) == 0) {
	exit('<font color="red">'._('Invalid').'</font>');
} else {
	//$billing = new Billing((string)$gUser->id, 'ESM', $_SESSION['brands']['allibill_domain']);	//BILLING INSTANCE

	$result = $gBilling->username_exists($_GET['username']);
	if ($result['return'] != 0) {
		exit('<font color="red">'._('Exists').'</font>');
	}

}

exit('<font color="green">'._('Good').'</font>');
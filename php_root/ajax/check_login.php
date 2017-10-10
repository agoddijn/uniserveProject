<?php
// This will take a login username and check it against the ums database.  The login username
// needs to be in the form of an email address, and the domain name must exist in ums for it
// to work.
$login = $_REQUEST['login'];
$login_parts = explode('@',$login);
$username = $login_parts[0];
$domain = $login_parts[1];
if (strlen($username) > 0) {
	if (preg_match('/^[a-z][a-z0-9_\.\-]{1,14}[a-z0-9]$/i', $username) == 0) {
		echo "bad";
	} else {
		$ums = new UMS();
		if($ums->get_realmid($domain) === NULL) {
			echo "bad_domain";	
		}
		$search = $ums->get_user($username,$domain);
		if (count($search) > 1) {
			echo "taken";
		} else {
			echo "good";
		}
	
	}
} else {
	echo "empty";
}
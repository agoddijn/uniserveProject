<?php


foreach($vars as $key => $value) {
		if (preg_match('/^action_.*$/', $key) == 1) {
                if (substr_count($key, "_") >= 2)
                        list($bunk, $action, $args) = explode("_", $key);
                else
                        list($bunk, $action) = explode("_", $key);
        }
}

//
// Main Switch for App Actions
//
switch($action) {
	case "login":		
		
		$service_count = 0;	
		$authorized = 0;

		// verify the login
		include(DIR_BASE . "/pages/login_authentication.php");

		if ($authorized) {
			apache_note('email', $vars['email']);
			apache_note('status', 'SUCCESS');
			
			// load the initial services list
			include(DIR_BASE . "/pages/login_services.php");
			
			$gUser->services_details['count'] = $service_count;
			$gUser->_register_user();

			$log_message = $gUser->email . " logged in through the Uniserve MyAccount portal." ;
	
			$gLog->log(sprintf("User %s logged in: %s", $gUser->email, $log_message));
			
			if ($vars['p'] == 'welcome' || $vars['p'] == '') $vars['p'] = 'welcome';
			if (count($gUser->devices) > 0) $vars['p'] = 'monitor';
			header("Location: /?p=" . $vars['p']);
	
			exit;
		} else {
			$gMessage->_error->add('Error Loggin', 'Login Attempt Failed');
		}
			
		break;

	//
	// Logout
	//
	case "logout":
		//
		// Set the logout message
		//
		switch($args) {
			case "failed":
				if (isset($_SESSION['redirect_url'])) {
					$redirect_url = $_SESSION['redirect_url'];
				}
				$message = _("Authentication Failed");
				apache_note('status', 'LOGOUT');
			break;
			case "data":
				if (isset($_SESSION['redirect_url'])) {
					$redirect_url = $_SESSION['redirect_url'];
				}
				$message = _("The e-mail address you provided does not have any services registered. Please check the spelling and try again, or use the e-mail address of a master account.");
				apache_note('status', 'LOGOUT');
			break;
			case "user":
				if (isset($_SESSION['redirect_url'])) {
					$redirect_url = $_SESSION['redirect_url'];
				}
				$message = _("You have been logged out.<br/>Thank you for using MyAccount Uniserve.");
				apache_note('status', 'LOGOUT');
			break;
			case "session":
				if (isset($_SESSION['redirect_url'])) {
					$redirect_url = $_SESSION['redirect_url'];
				}
				$message = _("You have been automatically logged out because your session timed out.");
				apache_note('status', 'LOGOUT');
			break;
			case "fatal":
				$message = _("You have been automatically logged out due to a fatal system error. A representative has been notified of the error.");
				apache_note('status', 'LOGOUT');
			break;
			case "inactive":
				$message = _("Your account is not active.  Please contact the Sales department to get your account re-instated.");
				apache_note('status', 'LOGOUT');
			break;
			case "nocsr":
				$message = _("CSR login failed.");
				apache_note('status', 'LOGOUT');
			break;
			case "noaccount":
				$message = _("No account is setup to use that login on this interface.");
				apache_note('status', 'LOGOUT');
			break;
			case "missing":
				$message = _("Your email address is not formatted correctly or your password is missing.");
				apache_note('status', 'LOGOUT');
			break;
			case "wholesaler":
				$message = _("Authentication Failed. You are not permitted to use this interface with the attempted login.");
				apache_note('status', 'LOGOUT');
			break;
			case "incomplete":
				$message = _("We don't have enough information to show the requested page.  Please login again so we can retrieve the necessary details.");
				apache_note('status', 'LOGOUT');
			break;
			default:
				$message = sprintf("%s: %s", _("You have been logged out because of error"), $args);
				apache_note('status', 'LOGOUT');
		}
		
		if ( ($args == "session") || ($args == "user") ) {
			if (isset($gUser->email)) {
				$gLog->log(sprintf("User %s logged out: %s", $gUser->email, $message));
			}
		}
		
		switch($args) {
			case "user":
			case "session":
			case "incomplete":
				$gMessage->_notice->add("login", $message);
			break;
			default:
				$gMessage->_error->add("login", $message);
		}

		//
		// Clear the session
		//
		if (isset($redirect_url)) {
			$_SESSION['redirect_url'] = $redirect_url;
		} else {
			$gSession->_end();
			$gUser = new PUser();
			$gUser->_register_user();
			
			if (isset($redirect_url)) {
				$_SESSION['redirect_url'] = $redirect_url;
			}
		}

	break;
}

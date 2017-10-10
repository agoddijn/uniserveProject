<?php

//
// Custom Error Handler Class
//
// Start Nov25th, 2003 - Mike (mike@deadmime.com)
//


//function format_dtrace_entry($entry) {
//	require_once (DIR_BASE . "/lib/JSON.php");
//	$json = new Services_JSON(SERVICES_JSON_SUPPRESS_ERRORS);
//	$file = '"' . $entry['file'] . '":' . $entry['line'];
//	$fn = $entry['function'];
//	$args = @preg_replace("/[\\s 	]+/"," ",$entry['args']);
//	$jargs = $json->encode($args);
//	return "$file  $fn ($jargs)";
//}


class PError {

	private $disabled = false;

	static function &singleton() {

		static $gError;

		if (!isset($gError)) 
			$gError = new PError;

		return $gError;
	}	

	function __construct() {

		error_reporting(E_ALL);
		set_error_handler(array($this,"_assign"));
	}

	function _disable() {
		$this->disabled = true;
	}

	/*	This is a possible entry point, when an error is not 
	 *		deliberately programmer-provoked.
	 *	It's set as the error_handler in the pError ctor.
	 *	It prettifies the error message a little bit to 
	**/
	function _assign($_errno, $_errstr, $_errfile, $_errline) {
	
		if (error_reporting() == 0)		return;		// detects '@' in expression
		if ($this->disabled == true)	return;		// I don't really know why you'd disable all error reporting

		global $gConfig;
		global $gLog;

		$errorNumToName = array (
					E_ERROR				=> 'Error',
					E_WARNING			=> 'Warning',
					E_PARSE				=> 'Parsing Error',
					E_NOTICE			=> 'Notice',
					E_CORE_ERROR		=> 'Core Error',
					E_CORE_WARNING		=> 'Core Warning',
					E_COMPILE_ERROR		=> 'Compile Error',
					E_COMPILE_WARNING	=> 'Compile Warning',
					E_USER_ERROR		=> 'User Error',
					E_USER_WARNING		=> 'User Warning',
					E_USER_NOTICE		=> 'User Notice',
					E_STRICT			=> 'Runtime Notice',
					4096				=> 'Recoverable Error',			// E_RECOVERABLE_ERROR (since PHP 5.2.0)
					8192				=> 'Deprecated Notice',			// E_DEPRECATED (since PHP 5.3.0)
					16384				=> 'User Deprecated Warning'	// E_USER_DEPRECATED (since PHP 5.3.0)
		);


		$message = sprintf("Error (%s): %s in %s (line %d)", 
			$errorNumToName[$_errno], 
			$_errstr, $_errfile, $_errline);
			
		$gLog->log($message);		// this is supposed to send to syslog, dunno if it works
		error_log($message);		// this is supposed to send to the apache log

		switch($_errno) {
			
			// On any sort of ERROR..
			case E_USER_ERROR:
			case E_ERROR:
			case E_CORE_ERROR:
			case E_COMPILE_ERROR:
			case E_PARSE:
				if (true == $gConfig['debug_log']) {
					// let the user know, since the user is presumably a dev
					echo "<b>$message</b><br/>\n<pre>"; debug_print_backtrace(); echo "</pre>\n";
				} else {
					// If debug is disabled, and we had a fatal error, then we'd better notify someone!
					$this->_sendmessage($message); // Send an e-mail to the administrators
					$this->_die(); // Redirect the user to a safe page
					exit();
				}
			break;

			// On any sort of warnings
			case E_WARNING:
			case E_CORE_WARNING:
			case E_COMPILE_WARNING:
			case E_USER_WARNING:
				if (true == $gConfig['debug_log']) {
					// let the user know, since the user is presumably a dev
					echo "<b>$message</b><br/>\n<pre>"; debug_print_backtrace(); echo "</pre>\n";
				}

			case E_NOTICE:
			case E_USER_NOTICE:
			case E_STRICT:
				// We don't do anything else interesting in these cases, but I left the cases here as a stub.
			default:
				// We don't do anything else interesting in these cases, but I left the cases here as a stub.
			break;
		}

	}

	//
	// Die and redirect to a safe page.
	//
	function _die($_message = NULL) {

		global $gSession;

		//
		// End the session
		//
		$gSession->_end();

		//
		// Redirect to a logout page
		//
		?>
		<script language="javascript" type="text/javascript">
		<!--
			parent.location = '<?=URL_BASE;?>/pages/login.php?action_logout_fatal';
		//-->
		</script>
		<?php

		exit();
	}

	//
	// Send a admin error alert
	//
	// Some code calls this directly, for example some of the logout code.
	function _sendmessage($_message = NULL) {

		global $gConfig;

//		$debugtrace = array_map("format_dtrace_entry",array_slice(debug_backtrace(),3));
//		$trace = "\n\nSTACK TRACE: " . print_r($debugtrace,true);

		ob_start();
		debug_print_backtrace();
		$trace = ob_get_contents();
		ob_end_clean();

		$body = sprintf("Fatal Services Error:\n\n%s\n\nStack Trace:\n%s\n\nPOST Dump:\n%s\n\nGET Dump:\n%s\n\nSession Dump:".
			"\n%s\n\nCookie Dump:\n%s\n\n", $_message, $trace, print_r($_POST, true), print_r($_GET, true), 
			print_r($_SESSION, true), print_r($_COOKIE, true));

		mail($gConfig['admin_email'], "Fatal Services Error", $body);

		return true;
	}

	 
	// This is the intended entry point for this class.
	// Other code calls gError->_error("omg, we crashed, help!") or whatever.
	// Of course, unanticipated errors will skip this, and go right to _assign.
	function _error($_message = NULL) {
		trigger_error($_message, E_USER_ERROR);
	}
	function _warn($_message = NULL) {
		trigger_error($_message, E_USER_WARNING);
	}

};

?>

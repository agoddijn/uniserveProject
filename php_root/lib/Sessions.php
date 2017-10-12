<?php

class PSession {

	private $_id;
	private $use_timeout;

	//
	// Initialize the class, and start a session.
	//
	static function &singleton($_use_timeout = true) {
		
		static $gSession;

		$use_timeout = $_use_timeout;

		if (!isset($gSession)) {
			$gSession = new PSession();
			$gSession->_start();
		}

		if ($use_timeout && $gSession->_isset('userobj'))
			$gSession->_check_timeout();

		return $gSession;
	}
	
	function _check_timeout() {

		global $gConfig;

		//
		// If the user set their timeout value to 0, then don't do
		// any of this (0 means disable)
		//
		if ($this->_isset("timeout")) {
			$cur_timeout = $this->_get("timeout");
			if ( (isset($cur_timeout)) && ($cur_timeout < time()) ) {

				$this->_end();
				include_once(DIR_BASE . "/js/session_logout.php");
					
				exit();
			}
		}
			
		$this->_put("timeout", time() + $gConfig['defaults']['session_timeout']);
	}

	//
	// Start a Session.
	//
	function _start() {

		global $gConfig;

		switch($gConfig['session']['type']) {
			case "db":
				session_set_save_handler(
					array(&$this, '_open'),
					array(&$this, '_close'),
					array(&$this, '_read'),
					array(&$this, '_write'),
					array(&$this, '_destroy'),
					array(&$this, '_gc')
				);
			break;
			case "file":
			default:
				;
		}

		//
		// Make sure nothing in the session get's cached.
		//
		session_cache_limiter("nocache");
 		
		if (!@session_start()) {
			return false;
		}
		$this->_id = session_id();		

		return true;
	}

	//
	// End a session.
	//
	function _end() {

		$this->_clear();
		return @session_destroy();
	}

	//
	// Clears all session Variables..
	//
	function _clear() {

		session_unset();
		unset($this->_id);

		foreach($_SESSION as $key)
			unset($_SESSION[$key]);
	}

	//
	// Fetches a value from a session
	//
	function _get($var) {
		return isset($_SESSION[$var]) ? $_SESSION[$var] : NULL;
	}


	//
	// Registers a variable with a session.
	//
	function _put($var, $val) {
		
		if (!isset($var)) 
			return false;

		$_SESSION[$var] = $val;
	}

	//
	// Checks to see if a variable is registered
	//
	function _isset($var) {
		return isset($_SESSION[$var]);
	}

	//
	// UnRegisters a variable from the session.
	//
	function _unset($var) {
		unset($_SESSION[$var]);
	}

	static function _open($_save_path, $_session_name) {		

		global $gDb;
		$gDb->Open( 'esm' );

		return true;
	}
	static function _close() {
	
		global $gDb;
		//$gDb->Close();

		return true;
	}
	static function _read($_id) {

		global $gDb;

		$res = $gDb->Query(sprintf("select data from sessions where id = '%s' limit 1", $_id));
		if ($gDb->NumRows($res)) {

			list($data) = $gDb->FetchRow($res);
			$gDb->FreeResult($res);
		} else {
			$gDb->Query(sprintf("insert into sessions (id, last_change, data) values ('%s', now(), '')", 
				$_id));
		}

		return (strlen($data) > 0) ? $data : "";
	}
	static function _write($_id, $_data) {

		global $gDb;

		$gDb->Query(sprintf("update sessions set data = '%s', last_change = now() where id = '%s'", 
			$_data, $_id));
		return true;
	}
	static function _destroy($_id) {

		global $gDb;
		
		$gDb->Query(sprintf("delete from sessions where id = '%s'", $_id));
		return true;
	}
	static function _gc($_max_lifetime) {

		global $gDb;

		$gDb.Query(sprintf("delete from sessions where (extract(epoch from now()) - extract(epoch from 
			last_change)) > %d", $_max_lifetime));

		return true;
	}
}

?>

<?php

class PLog {

	static function &singleton() {

		static $gLog;

		if (!isset($gLog)) {
			$gLog = new PLog();
		}
		return $gLog;
	}

	//
	// Write to the syslog
	//
	function log($_data) {
		syslog(LOG_ERR, "MA: " . $_data);
	}
};

?>

<?php

class PTimer {
	
	private $start;
	private $end;

	function __construct() {

		list($usec, $sec) = explode(" ", microtime());
		$this->start = ((float)$usec + (float)$sec);
	}

	function _results($_u, $_p) {
		global $gDb;
		
		list($usec, $sec) = explode(" ", microtime());
		$this->end = ((float)$usec + (float)$sec);

		$execution = number_format($this->end - $this->start,6);
		
		printf("\n<!-- Total Execution Time: %s seconds (%d queries) //-->\n", 
			$execution, $gDb->count);

	}

}

?>

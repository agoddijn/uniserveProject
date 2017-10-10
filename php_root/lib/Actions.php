<?php

class PActions {

	static function &singleton() {

		static $gActions;

		if (!isset($gActions)) {
			$gActions = new PActions;
		}

		return $gActions;
	}
}
	//

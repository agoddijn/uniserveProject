<?php

class PLang {

	public $language;
	
	static function &singleton() {
		
		static $gLang;

		if (!isset($gLang)) 
			$gLang = new PLang;

		return $gLang;
	}

	function __construct() {
		global $gConfig;

		$this->_load();

		if (!$this->language) {
			if (isset($_COOKIE['lang'])) {
				$this->language = $_COOKIE['lang'];
			} else {
				$this->language = $gConfig['defaults']['language'];
			}

			$this->_register();
		}
	}
	function __destruct() {
		$this->_register();
	}

	function _load() {

		global $gSession;

		$obj = $gSession->_get("lang");
		if (isset($obj)) {
			foreach($obj as $key => $val) {
				$this->$key = $val;
			}
		}
	}

	function _register() {

		global  $gSession;
		
		if ($gSession->_isset("lang"))
			$gSession->_unset("lang");

		$gSession->_put("lang", $this);
	}

	//
	// Sets the New Language
	//
	function _set($_language = NULL) {

		global $gConfig;

		//
		// Set the local Var
		//
		if (!isset($_language)) 
			$this->language = $gConfig['defaults']['language'];
		else
			$this->language = $_language;

		$this->_set_cookie();
		$this->_set_domain();

		return true;
	}
	
	function _get_language() {
		return $this->language;
	}
	

	//
	// returns the language code
	//
	function _code() {

		global $gConfig;

		if (!$this->language)
			return NULL;

		return $gConfig['languages'][$this->language]['code'];
	}

	//
	// returns the character set
	//	
	function _charset() {

		global $gConfig;

		if (!$this->language)
			return NULL;

		return $gConfig['languages'][$this->language]['charset'];
	}	

	//
	// returns the name
	//	
	function _name() {

		global $gConfig;

		if (!$this->language)
			return NULL;

		return $gConfig['languages'][$this->language]['description'];
	}	

	//
	// returns the alias
	//	
	function _alias() {

		global $gConfig;

		if (!$this->language)
			return NULL;

		return $gConfig['languages'][$this->language]['alias'];
	}	
	
	//
	// returns the locale
	//	
	function _locale() {

		global $gConfig;

		if (!$this->language)
			return NULL;

		return $gConfig['languages'][$this->language]['locale'];
	}


	//
	// Set the GetText Domain
	//
	function _set_domain() {

		
		bindtextdomain("messages", DIR_BASE . "/locale");
		bind_textdomain_codeset("messages", $this->_charset());
		textdomain("messages");
		
		//
		// Set the environment Vars
		//
		setlocale(LC_ALL, $this->_locale());
		putenv("LANG=" . $this->_code());

		if (!headers_sent()) {
			header("Content-Type: text/html; charset=" . $this->_charset());
		}

		return true;
	}			

	//
	// returns true if the language id is valid
	//
	function _valid($_index) {

		global $gConfig;

		if (isset($gConfig['languages'][$_index]))
			return true;

		return false;
	}

	//
	// Set a cookie with the current language in it.
	//
	function _set_cookie() {
		
		//
		// Set the cookie to expire in 48 hrs.
		//
		setcookie("lang", $this->language, time() + 172800, "/");
		$_COOKIE["lang"] = $this->language;

		return true;
	}

};      

?>

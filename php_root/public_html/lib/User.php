<?php

class PUser {

	var $email;
	var $services			= array();
	var $services_details	= array();	
	var $devices			= array();
	
	var $company_id 		= 1;
	var $company_name		= "Uniserve";
	var $contact_name		= "Uniserve Customer Service";
	var $contact_email		= PUSER_CONTACT_EMAIL;
	var $contact_phone		= "1-877-864-7378";
	
	var $id;
	var $platid;
	var $ap_id;
	var $cust_name;
	var $classname;
	var $staffid = 1;
	var $csr_session = false;
	var $wholesale_session = false;

	var $main_colour	= "e54e00";
	var $sub_colour		= "b3a59e";

	var $auth_method	= EUI_AUTH_METHOD_PASSWORD;
	
	var $can_account_settings = 0;		// Overarching back story, not meant for project work
	var $can_company_settings = 0;		// but left here for future reference, and possible
	var $can_change_password = 0;		// throw away stretch goal. User beware!

	function PUser() {
		$this->_load_user();
		register_shutdown_function(array(&$this, "_PUser"));
	}

	function _PUser() {
		$this->_register_user();
	}

	//
	// Loads all the users details from the session to the global User
	// object.
	//
	function _load_user() {
		
		global $gSession;

		if ($this->_logged_in()) {

			$obj = $gSession->_get("userobj");
			foreach($obj as $key => $val) {
				$this->$key = $val;
			}
		}
	}

	//
	// Registers all the global user object vars to the session.
	//
	function _register_user() {

		global $gSession;
		global $gConfig;

		if (isset($this->email) || isset($this->ap_id))
			$gSession->_put("userobj", $this);
	}
	
	//
	// Returns true/false if the user is logged in
	//
	function _logged_in() {

		global $gSession;
		return $gSession->_isset("userobj");
	}
	
};

?>

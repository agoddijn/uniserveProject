<?php

class PChecks {

	static function &singleton() {

		static $gChecks;

		if (!isset($gChecks)) {
			$gChecks = new PChecks;
		}

		return $gChecks;
	}

	//
	// returns true/false if the given port (phone number) exists for the given client/service
	// type.
	//
	function port_exists($_client, $_service, $_areacode, $_prefix, $_suffix) {

		global $gDb;

		switch($_service) {
			case SERVICE_TYPE_ADSL:
				$res = $gDb->Query(sprintf("select ap.id from assigned_products ap, adsl_port_settings aps
					where aps.areacode = '%s' and aps.prefix = '%s' and aps.suffix = '%s' and
					aps.assigned_product = ap.id and ap.client = %d limit 1",
					$_areacode, $_prefix, $_suffix, $_client));
			break;
			case SERVICE_TYPE_LD:
				$res = $gDb->Query(sprintf("select ap.id from assigned_products ap, ld_port_settings lps
					where lps.areacode = '%s' and lps.prefix = '%s' and lps.suffix = '%s' and
					lps.assigned_product = ap.id and ap.client = %d limit 1",
					$_areacode, $_prefix, $_suffix, $_client));
			break;
		}

		if ($gDb->NumRows($res) == 1) {
			$gDb->FreeResult($res);
			return 1;
		}

		return 0;
	}

	function plat_active ( $_account ) {
		global $gConfig;
		global $gMain;

		$gBilling = new Billing( 'Auto', 'Checks Library', $_SESSION['brands']['allibill_domain'], $_account );	//BILLING INSTANCE
		$customer_xml = $gBilling->get_account('id', $_account);//TODO Not sure about that one

		$customer = new SimpleXMLElement( $customer_xml );

		if ($customer->customer->active != 'Y')
			return 0;
		else
			return 1;
	}

	//
	// Return true/false if a assigned_product is active, based on if it
	// has a billed_product attached to it.
	//
	function ap_is_active($_ap) {

		global $gDb;

		$res = $gDb->Query(sprintf("select id from billed_products where assigned_product = %d and
			stop_date is null", $_ap));
		if ($gDb->NumRows($res) > 0) {

			$gDb->FreeResult($res);
			return 1;
		}

		return 0;
	}

	function diffDate($datestr1="0000-00-00 00:00:00", $datestr2="0000-00-0000:00:00"){
	    $date1 = strtotime($datestr1);
	    $date2 = strtotime($datestr2);
	    $datediff = abs($date1-$date2);
	    $seconds  = $datediff%60;
	    $minutes  = (($datediff-$seconds)%3600)/60;
	    $days     = ($datediff-$seconds-($minutes*60))/86400;
	    $hours    = (($datediff-$seconds-($minutes*60))/3600)-(floor($days)*24);

	    $diffarray = array (
	        "days"    => floor($days),
	        "hours"   => $hours,
	        "minutes" => $minutes,
	        "seconds" => $seconds
	        );
	    return $diffarray;
	}

	//
	// Returns true/false if a assigned_product has any open (not completed and not rejected)
	// orders assigned to it.
	//
	function ap_has_pending_orders($_ap) {

		global $gDb;

		$res = $gDb->Query(sprintf("select id from orders where assigned_product = %d and
			status not in (%d,%d)", $_ap, ORDER_STATUS_COMPLETED, ORDER_STATUS_REJECTED));
		if ($gDb->NumRows($res) > 0) {

			$gDb->FreeResult($res);
			return 1;
		}

		return 0;
	}

	//
	// Check Credit Card
	//
	function check_credit_card (&$_data) {
		global $gMessage;

		if (strlen($_data["ccnum"]) == 0)
			$gMessage->_error->add('ccnum', _("ERROR: please provide a valid credit card number."));
		if ($_data['cvd'] == '') {
			$gMessage->_error->add('cvd', _('ERROR: please enter card security code.'));
		}

		/*
		if (strlen($_data["postal_code"]) == 0)
			$gMessage->_error->add('postal_code', _("ERROR: please enter postal code."));
		*/

		$_data['amount'] = trim($_data['amount']);
		if ($_COOKIE['lang'] == 'fr_CA') {
			if(stripos($_data['amount'],',') !== FALSE) {
				$_data['amount'] = preg_replace('/,/', '.', $_data['amount']);
			}
		} else {
			if(stripos($_data['amount'],',') !== FALSE) {
				$_data['amount'] = preg_replace('/,/', '', $_data['amount']);
				$_data['odd'] = 1;
			}
		}
		// Here we have only taken out possible commas, and will now check to see if what we have remaining is a number
		if ( ! is_numeric($_data['amount'])) {
			$gMessage->_error->add('amount', _('ERROR: please enter a valid amount.'));
			return 0;
		}
		if(stripos($_data['amount'],'.') === FALSE) {
			// if we have no period then we assume the cents are not included and we add them
			$_data['amount'] .= '00';
			$_data['odd'] = 1;
		}
		if(substr($_data['amount'],-2,1) == '.') {
			// if we only have one digit after the period we add a 0
			$_data['amount'] .= '0';
			$_data['odd'] = 1;
		}
		// here we strip all non-digits
		$_data['amount'] = preg_replace('/\D/', '', $_data['amount']);
		// here we add the decimal place back in
		$_data['amount'] = substr($_data['amount'], 0, strlen($_data['amount']) - 2) . '.' . Substr($_data['amount'],-2,2);

		if ( ! is_numeric($_data['amount'])) {
			$gMessage->_error->add('amount', _('ERROR: please enter a valid amount.'));
		}

		if ($gMessage->waiting()) {
			return 0;
		}

		return 1;
	}

	/**
	 * Provides generic phone number check
	 */
	function check_phone_fields($area,$prefix,$line_num,$field_name){
		global $gMessage, $gConfig;
		if(empty($area) || empty($prefix) || empty($line_num) ){
			$gMessage->_error->add($field_name, _("ERROR: please provide a valid $field_name. Received ($area) $prefix-$line_num "));
			return 0;
		}

		if (preg_match('/^\d{3}$/', $area) != 1) {
			$gMessage->_error->add($field_name, _("ERROR: please provide a valid area code for $field_name."));
			return 0;
		}
		if (preg_match('/^\d{3}$/', $prefix) != 1) {
			$gMessage->_error->add($field_name, _("ERROR: please provide a valid prefix for $field_name."));
			return 0;
		}
		if (preg_match('/^\d{4}$/', $line_num) != 1) {
			$gMessage->_error->add($field_name, _("ERROR: please provide a valid line number for $field_name."));
			return 0;
		}

		return 1;
	}

	//
	// Check Phone Number
	//
	function check_phone_number(&$_data) {

		global $gMessage;
		global $gBase;
		global $gConfig;

		if ( (isset($_data['areacode'])) && (isset($_data['prefix'])) && (isset($_data['suffix'])) ) {
			$_data['phone'] = $_data['areacode'] . "-" . $_data['prefix'] . "-" . $_data['suffix'];

			if (!$gBase->Valid(TYPE_PHONE, $_data['phone']))
				$gMessage->_error->add("phone", _("ERROR: invalid phone number provided, please try again."));
		} else
			$gMessage->_error->add("phone", _("ERROR: invalid phone number provided, please try again."));

		//
		// Check the areacode
		//
		if (!in_array($_data['areacode'], $gConfig['areacodes'])){
			$gMessage->_error->add("phone", _("ERROR: invalid Canadian area code: {$_data['areacode']}; please try again."));
		}

		if ($gMessage->waiting())
			return 0;

		return 1;
	}

	//
	// this function is used to check the format of the contact phone number specified by customer
	// the contact phone could be "" return true
	// it must be 10 digit and have valid areacode
	//
	function check_phone_format (&$_data){

		global $gMessage;
		global $gConfig;

		if (!@$_data['contact_phone'])
			$_data['contact_phone'] = $_data['contact_phone1'].$_data['contact_phone2'].$_data['contact_phone3'];
		$_data['contact_phone'] = preg_replace("/[^0-9]/", "", $_data['contact_phone']);

		//
		// user did not specify any phone
		//
		if ( $_data['contact_phone'] == '' ) {
			$gMessage->_error->add("contact phone", _("ERROR: please provide a contact phone number."));
			return 0;
		}

		//
		// check digit, for now we only allow 10 digit
		//
		if ( strlen ($_data['contact_phone']) != 10 ) {
			$gMessage->_error->add("contact phone", _("ERROR: contact phone is an invalid format."));
			return 0;
		}

		//
		// check areacode
		//

		if (!in_array(substr($_data['contact_phone'], 0, 3), $gConfig['areacodes'])){
			$gMessage->_error->add("areacode", _("ERROR: invalid Canadian area code for contact phone number; please try again."));
			return 0;
		}


		return 1;

	}

	//
	// Validates a ports (adsl port) address. Used for the availability check, and
	// the move order pages.
	//
	//	- we need *at least* the street_num, street_name and city
	//	- street_name can only be letters, digits or spaces (no symbols)
	//	- numbered street names must contain their suffix (31 should be 31st)
	//
	function check_port_address(&$_data) {

		global $gMessage;
		global $gBase;

		//
		// Check that the three main fields are filled in
		//
		if (!$gBase->Valid(TYPE_NUM, $_data['streetnum'], 0, 99999999))
			$gMessage->_error->add("streetnum", _("ERROR: invalid street number provided; please try again."));
		if (!$gBase->Valid(TYPE_STRING, $_data['streetname'], 1, 255))
			$gMessage->_error->add("streetname", _("ERROR: invalid street name provided; please try again."));
		if (!$gBase->Valid(TYPE_STRING, $_data['city'], 1, 255))
			$gMessage->_error->add("city", _("ERROR: invalid city name provided; please try again."));

		if ($gMessage->waiting())
			return 0;

		//
		// Make sure the street name is only letters, numbers and spaces
		//
		if (!preg_match("/^[a-zA-Z0-9\s]{1,}$/", $_data['streetname']))
			$gMessage->_error->add("streetname", _("ERROR: street names can only contain letters, numbers and spaces (no symbols), please try again."));

		//
		// If the street name is completely numeric, then add
		// the appropriate suffix (st/nd/rd/th)
		//
		if (is_numeric($_data['streetname']))
			$_data['streetname'] = $_data['streetname'] . $gBase->NumericSuffix($_data['streetname']);

		if ($gMessage->waiting())
			return 0;

		return 1;
	}

	//
	// Validates user (admin) settings- used on the update and create
	// functions for users (admins)
	//
	function check_user_settings(&$_data) {

		global $gMessage;
		global $gBase;
		global $gDb;

		//
		// Validate
		//
		if (!$gBase->Valid(TYPE_STRING, $_data['name'], 1, 250))
			$gMessage->_error->add("name", _("ERROR: invalid Name provided. Please check your input and try again."));
		if (!$gBase->Valid(TYPE_EMAIL, $_data['email'], 1, 250))
			$gMessage->_error->add("email", _("ERROR: invalid Email provided. Please check your input and try again."));

		if (!$gBase->Valid(TYPE_STRING, $_data['username'], MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH))
			$gMessage->_error->add("username",
				sprintf(_("ERROR: invalid Username provided. Usernames must be between %d and %d characters."),
					MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH));

		if (!$gBase->Valid(TYPE_STRING, $_data['password'], MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH))
			$gMessage->_error->add("password",
				sprintf(_("ERROR: invalid Password provided. Password must be between %d and %d characters."),
					MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH));

		if ($gMessage->waiting())
			return 0;

		//
		// Escape any data
		//
		$_data['name'] 		= addslashes(stripslashes(($_data['name'])));
		$_data['email'] 	= strtolower($_data['email']);
		$_data['username'] 	= strtolower($_data['username']);

		//
		// Check for any missing check box values
		//
		if (!isset($_data['active']))
			$_data['active'] = 0;

		if (!isset($_data['can_order']))
			$_data['can_order'] = 0;
		if (!isset($_data['can_note']))
			$_data['can_note'] = 0;
		if (!isset($_data['can_mac']))
			$_data['can_mac'] = 0;
		if (!isset($_data['can_reports']))
			$_data['can_reports'] = 0;

		return 1;
	}

	//
	// Checks data as a list of company (client) settings
	//
	function check_company_settings(&$_data) {

		global $gBase;
		global $gMessage;

		//
		// Validate the input
		//
		if (!$gBase->Valid(TYPE_STRING, $_data['company_name'], 1, 250))
			$gMessage->_error->add("company_name", _("ERROR: invalid company name provided. Please check your input and try again."));
		if (!$gBase->Valid(TYPE_STRING, $_data['company_exec_name'], 1, 250))
			$gMessage->_error->add("company_exec_name", _("ERROR: invalid contact name provided. Please check your input and try again."));
		if (!$gBase->Valid(TYPE_EMAIL, $_data['company_exec_email'], 1, 250))
			$gMessage->_error->add("company_exec_email", _("ERROR: invalid contact email provided. Please check your input and try again."));

		if (!$gBase->Valid(TYPE_STRING, $_data['company_admin_name'], 1, 250))
			$gMessage->_error->add("company_admin_name", _("ERROR: invalid admin name provided. Please check your input and try again."));
		if (!$gBase->Valid(TYPE_EMAIL, $_data['company_admin_email'], 1, 250))
			$gMessage->_error->add("company_admin_email", _("ERROR: invalid admin email provided. Please check your input and try again."));

		if ($gMessage->waiting())
			return 0;

		//
		// Escape any data
		//
		$_data['company_name']		= addslashes(stripslashes($_data['company_name']));
		$_data['company_exec_name']	= addslashes(stripslashes($_data['company_exec_name']));
		$_data['company_admin_name']	= addslashes(stripslashes($_data['company_admin_name']));

		return 1;
	}


};

?>

<?php

//
// For forms with mutiple submit buttons.
//
// There is no good way to have mutilple submit buttons on a form
// without using javascript. The only way I could figure out, was
// to name each submit button on the forms different names.
//
// Names go like "action_xxxx" where xxxx is the actual *value* for
// the action. We split by _, and assign the rest as the value of
// the action.
//
foreach($vars as $key => $value) {
		if (preg_match('/^action_.*$/', $key) == 1) {
                if (substr_count($key, "_") >= 2)
                        list($bunk, $action, $args) = explode("_", $key);
                else
                        list($bunk, $action) = explode("_", $key);
        }
}

if (!isset($action)) {
	$action = $vars['action'];
}


//
// Main Switch for App Actions
//
switch($action) {
	case "cv2sso":
		// TODO: ensure that the id specified does indeed belong to this customer!!!
		$port_input = trim($vars['port']);
		$valid_port = false;

		$voip_list = $gMain->check_voip( $gUser->email );
		foreach ($voip_list->voip as $voipacct) {
			if ((string)$voipacct->galaxy_id === $port_input){	$valid_port = true;	}
		}

		if ($valid_port){
			include('lib/galaxy_sso_client.php');
			$sso = new rscClient($port_input);
			$sso->negotiate();
			$rd = $sso->getRedirect();
			$num_matches = 0;
			$rd = str_replace("://wl","://uniserve",$rd,$num_matches);
			header ( 'Location: ' . $rd );
		} else {
			$vars['p'] = 'cv2';
			$vars['kill_entire_window'] = true;
		}
	break;

	case "submit911":
		// THIS IS AN ABHORRENT MONKEYPATCH
		// But the problem is that I don't know if gConfig[provinces] does anything else
		// So we're just patching it inline here.  Commented in the config file too.
		for($i = 0 ; $i < count($gConfig['provinces']); $i++)
			{
			if (isset($gConfig['provinces'][$i]))
				{
				if ($gConfig['provinces'][$i]['abbr'] == 'QU') $gConfig['provinces'][$i]['abbr'] = 'QC';
				if ($gConfig['provinces'][$i]['abbr'] == 'YU') $gConfig['provinces'][$i]['abbr'] = 'YT';
				if ($gConfig['provinces'][$i]['abbr'] == 'NF') $gConfig['provinces'][$i]['abbr'] = 'NL';
				}
			}
		// END OF GODLESS BLETCHERY

		$currentDID = str_replace("-","",substr($vars['select_phone'], 1, 12));

		//Debug stuff...
		//print_r($vars);
		//print_r($gUser->voip_array);
		//break;

		//Check wether the "currentDID" is one we have permission to modify
		$phone_array = array_keys($gUser->voip_array);
		if (!in_array($vars['select_phone'], $phone_array))
			$gMessage->_error->add("notdidowner",_("You do not have permission to set e911 information for this phone number."));

		$submitInfo911 = array(	'firstName' => 		$vars['911firstName'],
					'lastName' => 		$vars['911lastName'],
					'streetNum' => 		$vars['911streetNum'],
					'streetName' => 	$vars['911streetName'],
					'addressType' => 	$vars['911addrType'],
					'addressTypeNum' => 	(isset($vars['911addrTypeNum']) ? $vars['911addrTypeNum'] : "") ,
					'city' => 		$vars['911city'],
					'prov' => 		$vars['911prov'],
					'zip' => 		$vars['911zip'],
					'country' => 		$vars['911country'],
					'language' => 		$vars['911lang']);

		//Input validation helper function
		function validate_input_length(&$variable, $length, $internal_errcode, $plaintext_errcode, $req = false)
			{
			global $gMessage;
			$variable = trim($variable);
			if (strlen($variable) > $length)
				$gMessage->_error->add($internal_errcode . "_too_long", sprintf(_("%s must not exceed %d characters"),$plaintext_errcode,$length));
			if ($req && empty($variable))
				$gMessage->_error->add($internal_errcode . "_empty", sprintf(_("%s is a required field"),$plaintext_errcode));
			}

		validate_input_length($submitInfo911['firstName'],30,"911firstName",_("First Name"));
		validate_input_length($submitInfo911['lastName'],30,"911lastName",_("Last Name"));
		validate_input_length($submitInfo911['streetNum'],10,"911streetNum",_("Street #"), true);
		validate_input_length($submitInfo911['streetName'],60,"911streetName",_("Street Name"), true);
		validate_input_length($submitInfo911['addressTypeNum'],60,"911addrTypeNum",_("Unit number"));
		validate_input_length($submitInfo911['city'],60,"911city",_("City"), true);

		$connexon = new Connexon();

		//Error if addressType has a value AND is not among the valid types
		if (!empty($submitInfo911['addressType']) && !in_array($submitInfo911['addressType'], $connexon->getAddressTypeArray()) && $submitInfo911['addressType'] != "none")
			$gMessage->_error->add("911addrType_invalid",_("Address Type is invalid"));

		$validProvinces = array();
		foreach($gConfig['provinces'] as $oneProvince)
			array_push($validProvinces, $oneProvince['abbr']);

		if (!in_array($submitInfo911['prov'], $validProvinces))
			$gMessage->_error->add("911prov_invalid",_("Province is invalid"));

		// "zipcode" validation: remove spaces and dashes, then ensure that it's A1A1A1
		$submitInfo911['zip'] = trim(strtoupper(str_replace('-','',str_replace(' ','',$submitInfo911['zip']))));
		if (!preg_match('/^([A-Z][0-9]){3}$/',$submitInfo911['zip']))
			$gMessage->_error->add("badinput",_("Invalid Postal Code"));

		if ($submitInfo911['country'] != "CAN")
			$gMessage->_error->add("911country_invalid",_("Country is invalid"));

		if ($submitInfo911['language'] != "EN" && $submitInfo911['language'] != "FR")
			$gMessage->_error->add("911lang_empty", _("Preferred language is a required field"));

		//Go ahead with validation at Connexon  if no error was found until now
		if (!$gMessage->waiting())
			{
			$connResult = $connexon->validateAddress($submitInfo911['streetNum'],
								$submitInfo911['streetName'],
								$submitInfo911['city'],
								$submitInfo911['prov'],
								$submitInfo911['country'],
								$submitInfo911['zip']);
			if ($connResult->status == 0) 	//Exact match!
				{
				//Determine wether we need to add a new entry or update an existing one
				$connQryResult = $connexon->queryResidential($currentDID);

				$connUpdtResult = null;

				if ($connQryResult->status == -1) //The did does not exist, add a new entry
					$connUpdtResult = $connexon->addResidential($currentDID,
									$submitInfo911['firstName'],$submitInfo911['lastName'],
									$submitInfo911['streetNum'],$submitInfo911['streetName'],
									$submitInfo911['addressType'],$submitInfo911['addressTypeNum'],
									$submitInfo911['city'],$submitInfo911['prov'],$submitInfo911['country'],
									$submitInfo911['zip'],$submitInfo911['language']);
				else //Status would be == 0 here... the did exists, update the entry
					{
					//Check wether a previously submitted request is still pending...
					if ($connQryResult->subscriberInfo->status != "progress" && $connQryResult->subscriberInfo->status != "pending")
						{
						$connUpdtResult = $connexon->updateResidential($currentDID,
								$submitInfo911['firstName'],$submitInfo911['lastName'],
								$submitInfo911['streetNum'],$submitInfo911['streetName'],
								$submitInfo911['addressType'],$submitInfo911['addressTypeNum'],
								$submitInfo911['city'],$submitInfo911['prov'],$submitInfo911['country'],
								$submitInfo911['zip'],$submitInfo911['language']);
						}
					else
						{
						$gMessage->_warn->add("911_address_update", _("There is another 911 address submission for this DID that is still in ").$connQryResult->subscriberInfo->status._(" status."));
						}
					}

				if (!$gMessage->waiting()) //Success!
					{
						$msg = _("Your request has been recorded.  Please note, it may take several hours for this change to take effect.");
						$gMessage->_notice->add("success", $msg);
					$vars['911submitsuccess'] = true;

					//Update also our caching db

					//Find the latest voip order id:
					$orderId = $gUser->voip_array[$vars['select_phone']]['order_id'];
					$orderAP = "";

					//Find the Assigned product for that order id:
					$sql = "SELECT assigned_product
						FROM orders
						WHERE id = '".$gDb->Escape($orderId)."'";
					$res = $gDb->Query($sql);
					if ($gDb->NumRows($res) > 0)
						{
						$row = $gDb->FetchRow($res);
						$orderAP = $row[0];
						}

					//Find the correct IN order id based on the assigned product
					$sql = "SELECT id
						FROM orders
						WHERE type = '1' AND assigned_product = '".$gDb->Escape($orderAP)."'";
					$res = $gDb->Query($sql);
					if ($gDb->NumRows($res) > 0)
						{
						$row = $gDb->FetchRow($res);
						$orderId = $row[0];
						}

					//Find the correct province id:
					$provinceId = 0;
					for($i = 0 ; $i < count($gConfig['provinces']); $i++)
						{
						if (isset($gConfig['provinces'][$i]))
							{
							if ($gConfig['provinces'][$i]['abbr'] == $submitInfo911['prov'])
								{
								$provinceId = $i;

								/***/
								break;
								/***/
								}
							}
						}

					$sql = "SELECT assigned_product
							FROM addresses_voip
							WHERE assigned_product = '".$gDb->Escape($orderAP)."'
								AND did = '".substr($vars['select_phone'], 1, 12)."'
								AND type = '2'";
					$res = $gDb->Query($sql);
					if ($gDb->NumRows($res) > 0) //Is there an entry in the db for this order?
						{
						//Yes, so update
						$sql = "UPDATE addresses_voip
							SET apt = '".$gDb->Escape($submitInfo911['addressTypeNum'])."',
								street_name = '".$gDb->Escape($submitInfo911['streetName'])."',
								city = '".$gDb->Escape($submitInfo911['city'])."',
								postal = '".$gDb->Escape($submitInfo911['zip'])."',
								province = '".$gDb->Escape($provinceId)."',
								contact = '".$gDb->Escape($submitInfo911['firstName']." ".$submitInfo911['lastName'])."',
								add_type = '".$gDb->Escape($submitInfo911['addressType'])."',
								streetnum = '".$gDb->Escape($submitInfo911['streetNum'])."',
								lang = '".$gDb->Escape($submitInfo911['language'])."'
							WHERE assigned_product = '".$gDb->Escape($orderAP)."'
								AND did = '".substr($vars['select_phone'], 1, 12)."'
								AND type = '2'";
						$gDb->Query($sql);
						}
					else
						{
						//No, so insert
						$sql = "INSERT INTO addresses_voip
								(assigned_product, did, type, apt, street_name, city, postal, province, contact, add_type, streetnum, lang)
							VALUES ('".$gDb->Escape($orderAP)."',
								'".substr($vars['select_phone'], 1, 12)."',
								'2',
								'".$gDb->Escape($submitInfo911['addressTypeNum'])."',
								'".$gDb->Escape($submitInfo911['streetName'])."',
								'".$gDb->Escape($submitInfo911['city'])."',
								'".$gDb->Escape($submitInfo911['zip'])."',
								'".$gDb->Escape($provinceId)."',
								'".$gDb->Escape($submitInfo911['firstName'])." ".$submitInfo911['lastName']."',
								'".$gDb->Escape($submitInfo911['addressType'])."',
								'".$gDb->Escape($submitInfo911['streetNum'])."',
								'".$gDb->Escape($submitInfo911['language'])."')";
						$gDb->Query($sql);
						}
					}
				else 	//We fail miserably
					{
					if (!$connUpdtResult) //This should only happen for a status==progress or status==pending
						$gMessage->_error->add("failure", _("A previously submitted change address request is still pending. Please retry in 12 hours."));
					else if ($connUpdtResult->status != 0)
					$gMessage->_error->add("failure", _("A problem has occured, please contact one of our representative for assistance."));
					}
				}
			else		//No match, suggestions were returned
				{
				$alternatives = array();

				if (!is_array($connResult->alternatives)) {
					array_push($alternatives, array('houseNumberLow' => $connResult->alternatives->houseNumberRange->low,
									'houseNumberHigh' => $connResult->alternatives->houseNumberRange->high,
									'streetName' => $connResult->alternatives->streetName,
									'city' => $connResult->alternatives->city,
									'prov' => $connResult->alternatives->state,
									'zip' => str_replace(" ", "", $connResult->alternatives->zipCode)));

				} else {
					foreach($connResult->alternatives as $alternative)
						{
						array_push($alternatives, array('houseNumberLow' => $alternative->houseNumberRange->low,
										'houseNumberHigh' => $alternative->houseNumberRange->high,
										'streetName' => $alternative->streetName,
										'city' => $alternative->city,
										'prov' => $alternative->state,
										'zip' => str_replace(" ", "", $alternative->zipCode)));
						}
				}

				$suggStr = "";

				$titles = array(	"streetName" => _('Closest street name match'),
							"city" => _('Closest city match'),
							"prov" => _('Closest province match'),
							"zip" => _('Closest postal code match'));
				$counter = 0;
				foreach($alternatives as $alternative)
					{
					$suggStr .= "Suggestion ".++$counter."<br><ul>";

					$suggStr .= "<li>"._("Street number must be in range").": <b>{".$alternative['houseNumberLow']."} to {".$alternative['houseNumberHigh']."}</b></li>";

					foreach($titles as $k=>$v)
						{
						if (strtoupper($submitInfo911[$k]) != strtoupper($alternative[$k]))
							$suggStr.="<li>".$v.": <b>{".$alternative[$k]."}</b></li>";
						}

					$suggStr .= "</ul>";
					}

				$gMessage->_error->add("failure", _("The specified address is invalid.  Please see below for suggested corrections.")."<br>".$suggStr);
				}
			}

		$vars['submitInfo911'] = $submitInfo911; //This will be passed to the functions in main.php

		//print_r($vars);
		break; /************************************************/
		// validation of DID (a.k.a. sub-sub-page)
		$sbsb_page = @$vars['sbsb_page'];
		$myvoips = $gMain->check_voip( $gUser->email );
		$mydids = array();
		foreach ($myvoips as $_mv){
			$mydids[] = (string)$_mv->voip_port;
		}
		//var_dump($mydids,$vars['sbsb_page']); exit;
		if (! in_array($sbsb_page,$mydids)){
			$gMessage->_error->add("notdidowner",_("You do not have permission to set e911 information for this phone number."));
		}
		// stuff we could do:
		//   verify addrType in list ... or not
		//   verify country is Canada ... or not
		//   verify province is in list ... or not
		//   verify lang is allowed ... or not

		// name validation: lengths specified in UP-107
		function validate_input_length(&$variable, $length, $internal_errcode, $plaintext_errcode, $req = false){
			global $gMessage;
			$variable = trim($variable);
			if (strlen($variable) > $length){
				$gMessage->_error->add($internal_errcode . "_too_long", sprintf(_("%s must not exceed %d characters"),$plaintext_errcode,$length));
			}
			if ($req && empty($variable)){
				$gMessage->_error->add($internal_errcode . "_empty", sprintf(_("%s is a required field"),$plaintext_errcode));
			}
		}
		validate_input_length($vars['911firstName'],30,"911firstName",_("First Name"));
		validate_input_length($vars['911lastName'],30,"911lastName",_("Last Name"));
		validate_input_length($vars['911streetNum'],10,"911streetNum",_("Street #"), true);
		validate_input_length($vars['911streetName'],60,"911streetName",_("Street Name"), true);
		validate_input_length($vars['911addrTypeNum'],60,"911addrTypeNum",_("Unit number"));
		validate_input_length($vars['911city'],60,"911city",_("City"), true);

		if (strtolower($vars['911lang']) != 'en' && strtolower($vars['911lang']) != 'fr'){
			$gMessage->_error->add("911lang_empty", _("Preferred language is a required field"));
		}

		// "zipcode" validation: remove spaces and dashes, then ensure that it's A1A1A1
		$vars['911zip'] = trim(strtoupper(str_replace('-','',str_replace(' ','',$vars['911zip']))));
		if (!preg_match('/^([A-Z][0-9]){3}$/',$vars['911zip'])){
			$gMessage->_error->add("badinput",_("Invalid Postal Code"));
		}

		if (!$gMessage->waiting()) {
			$addrInfo = array();
			$addrInfo['DID']		= $sbsb_page;
			$addrInfo['firstName']	= $vars['911firstName'];
			$addrInfo['lastName']	= $vars['911lastName'];
			$addrInfo['streetNum']	= $vars['911streetNum'];
			$addrInfo['streetName']	= $vars['911streetName'];
			$addrInfo['addType']	= $vars['911addrType'];
			$addrInfo['addTypeNum']	= $vars['911addrTypeNum'];
			$addrInfo['city']		= $vars['911city'];
			$addrInfo['country']	= $vars['911country'];
			$addrInfo['prov']		= $vars['911prov'];
			$addrInfo['zip']		= $vars['911zip'];
			$addrInfo['lang']		= $vars['911lang'];

			list($x_werk,$x_cont) = $gMain->set_911_addresses($addrInfo);

			if ($x_werk){
				$msg = _("Your request has been recorded.  Please note, it may take several hours for this change to take effect.");
				if(count($mydids) > 1){
					$msg.=sprintf("<br/><br/><b>"
						. _("IMPORTANT: You have set the emergency location for this phone number (%s) only.  Please make sure to configure emergency addresses for your other digital phone numbers as well.")
						. "</b>",$sbsb_page);
				}
				$gMessage->_notice->add("success", $msg);

			} else {

				// The contents of the response will be a scalar string, except in the case that the request failed
				// and an array of suggestions was returned
				if($x_cont->kindOf()==='scalar'){
					$error_desc = $x_cont->scalarval();

					$error_reporting_codes = array(	"unauthenticated"=>"AUT",
													"database_access_error"=>
													"DAE","system_error"=>"SYS",
													"did_does_not_exist"=>"DDNE"
												);

					if(strtolower($error_desc) == 'not_supported'){
						$gMessage->_error->add("failure", _("This address is currently locked while a previous change is being processed.  Please allow 24hrs between change requests."));
					} else {
						if (in_array(strtolower($error_desc) , array_keys($error_reporting_codes))){
							$error_code = $error_reporting_codes[strtolower($error_desc)];
						} else {
							$error_code = "UNK";
						}
						$gMessage->_error->add("failure",
								sprintf(_("Internal error (code: %s).  Please try again later, or contact a service representative"),$error_code));
						error_log("Internal system error, user was given code $error_code, because KBT sent us `$error_desc`.  "
								. "Here are the parameters that PHP sent to its set_911_address function: " . print_r($addrInfo,true));
					}
				} else {
					$suggestions = array();
					for($i=0;$i < $x_cont->arraysize(); $i++){
						$suggestions[$i]['country'] = $x_cont->arraymem($i)->structmem('country')->scalarval();
						$suggestions[$i]['city'] = $x_cont->arraymem($i)->structmem('city')->scalarval();
						$suggestions[$i]['streetNumRangeLow'] = $x_cont->arraymem($i)->structmem('streetNumRangeLow')->scalarval();
						$suggestions[$i]['streetNumRangeHigh'] = $x_cont->arraymem($i)->structmem('streetNumRangeHigh')->scalarval();
						$suggestions[$i]['streetNum'] = $x_cont->arraymem($i)->structmem('streetNum')->scalarval();
						$suggestions[$i]['province'] = $x_cont->arraymem($i)->structmem('province')->scalarval();
					}

					$suggStr = "";

					$titles = array(
									"streetNum"=>_('Nearest valid street number'),
									"city"=>_('Closest city match'),
									"province"=>_('Closest province match'),
									"country"=>_('Closest country match'));
					foreach($suggestions as $sugg){

						$suggStr .= "<ul>";
						foreach($titles as $k=>$v){
							if(!empty($sugg[$k])){
									$suggStr.="<li>$v: <b>{$sugg[$k]}</b></li>";
							}
						}
						if(!empty($sugg['streetNumRangeLow'])){
							$suggStr .= "<li>"._("Street number must be in range").": <b>{$sugg['streetNumRangeLow']} to {$sugg['streetNumRangeHigh']}</b></li>";
						}
						$suggStr .= "</ul>";
					}

					$gMessage->_error->add("failure", _("The specified address is invalid.  Please see below for suggested corrections.").$suggStr);

				}
			}
		}

	break;

	case "cancel911edit":

	break;

	case "cancel":
		if (strlen($args) > 0)
			$vars['p'] = $args;
	break;

	//
	// Add a MAC address
	//
	case 'addmac':
		if (isset($vars['port'], $gUser->services_details[SERVICE_TYPE_ADSL][$vars['port']])) {
			$gActions->add_mac($_POST);
		}
		break;

	//
	// Remove a MAC address
	//
	case 'removemac':
		if (isset($vars['port'], $gUser->services_details[SERVICE_TYPE_ADSL][$vars['port']])) {
			$_POST['mac'] = $args;
			$gActions->remove_mac($_POST);
		}
		break;

	//
	// Change password (for users using "Password" authentication method)
	//
	case 'changepass':
		if (isset($vars['port'], $gUser->services_details[SERVICE_TYPE_ADSL][$vars['port']])) {
			$gActions->change_ap_password($_POST);
		}
		break;

	//
	// Change an end-user password
	//
	case "changepassword":
		if (isset($gUser->show_menu['show_passwd'][$_POST['auth_id']])) {
			$gActions->change_eui_password($_POST);
		}
		$vars['p'] = 'password';
	break;

	//
	// Change email forwarding
	//
	case "changeforwarding":
		if (isset($gUser->show_menu['show_forward'][$_POST['auth_id']])) {
			$gActions->change_email_forwarding($_POST);
		}
	break;

	//
	// Change legacy alias forwarding
	//
	case "editaliaslegacy":
		if (isset($gUser->services_details[SERVICE_TYPE_EMAIL][$_POST['platid']])) {
			$data = array(
					'forwardto' 		=> $_POST['destination'],
					'enable_forward'	=> TRUE,
					'auth_id'		=> $_POST['platid']
				);
			$gActions->change_email_forwarding($data);
		}
		$vars['p'] = 'email';
	break;

	//
	// Change email auto-reply message
	//
	case "changevacation":
		if (isset($gUser->show_menu['show_vacation'][$_POST['auth_id']])) {
			$gActions->change_vacation($_POST);
		}
	break;

	//
	// Collect credit card information
	//
	case "payinvoice":

		if ($gChecks->check_credit_card($_POST)) {
			if(isset($_POST['odd']) && $_POST['odd'] == 1)
				$gMessage->_warn->add('odd', _('The payment amount has been modified since you entered it, please confirm that the payment amount is what you intended.'));
			$vars['p'] = 'payment_confirm';
		} else {
			$vars['p'] = 'payment';
		}
	break;

	case 'ModifyPayment':
		$vars['p'] = 'payment';
	break;

	//
	// Send the invoice
	//
	case "mailinvoice":
		if (!$gBase->Valid(TYPE_EMAIL, $_POST['email_add'], 1, 250))
			$gMessage->_error->add("client", _("ERROR: invalid email address provided!"));
		else {
			ob_clean();
			require_once(DIR_BASE . "/templates/payment_sendpdf.php");
			$gMessage->_notice->add("info", "Invoice successfully sent to: " . $_POST['email_add']);
		}
		$vars['p'] = 'payment';
	break;

	//
	// Post the payment after gathering credit card info
	//
	case "postpayment":
		$gActions->post_payment($_POST);
		$vars['p'] = 'payment';
	break;

	//
	// Set up auto-payment by credit card
	//
	case "autopayccsetup":
		$_POST['ccnumber'] = preg_replace('/[^0-9]/', '', $_POST['ccnumber']);
		$gActions->autopay_cc($_POST);
		$vars['p'] = 'autopaycc';
	break;

	//
	// Set up PAD payment
	//
	case "autopaybanksetup":
		$gActions->autopay_bank($_POST);
		$vars['p'] = 'autopaypap';
	break;

	//
	// Cancel PAD payment
	//
	case 'cancelPAD':
		$gActions->cancel_autopay_bank();
		$vars['p'] = 'autopaypap';
	break;

	//
	// Save spam settings
	//
	case "spamsubmit":
		if (isset($gUser->show_menu['show_antispam'][$_POST['auth_id']])) {
			$gActions->spam_set_prefs($_POST);
		}
	break;

	//
	// Add address to spam filter
	//
	case "spamaddaddress":
		if (isset($gUser->show_menu['show_antispam'][$_POST['auth_id']])) {
			$gActions->spam_add_address($_POST);
		}
	break;

	//
	// Update spam filter address
	//
	case "spamupdateaddress":
		if (isset($gUser->show_menu['show_antispam'][$_POST['auth_id']])) {
			$_POST['userid'] = $gUser->show_menu['show_antispam'][$_POST['auth_id']]['userid'];
			$gActions->spam_update_address($_POST);
		}
	break;

	//
	// Delete spam filter address
	//
	case "SpamDeleteAddress":
		if (isset($gUser->show_menu['show_antispam'][$vars['auth_id']])) {
			$gActions->spam_delete_address($gUser->show_menu['show_antispam'][$vars['auth_id']]['userid'], $vars['id']);
		}
	break;

	case "createmailbox":
		$gActions->create_mailbox($_POST);
		$vars['p'] = 'email';
	break;

	case "createalias":
		$gActions->create_mailbox($_POST);
		$vars['p'] = 'email';
	break;

	case "removemailbox":
		if (isset($gUser->services_details[SERVICE_TYPE_EMAIL][$_POST['authid']])) {
			$gActions->remove_mailbox($_POST);
		}
		$vars['p'] = 'email';
	break;

	case "activatemailbox":
		if (isset($gUser->services_details[SERVICE_TYPE_EMAIL][$_POST['authid']])) {
			$gActions->activate_mailbox($_POST);
		}
		$vars['p'] = 'email';
	break;

	case "removealias":
		if (isset($gUser->services_details[SERVICE_TYPE_EMAIL][$_POST['authid']])) {
			$gActions->remove_alias($_POST);
		}
		$vars['p'] = 'email';
	break;

	case "activatealias":
		if (isset($gUser->services_details[SERVICE_TYPE_EMAIL][$_POST['authid']])) {
			$gActions->activate_alias($_POST);
		}
		$vars['p'] = 'email';
	break;

	case "editalias":
		if (isset($gUser->services_details[SERVICE_TYPE_EMAIL][$_POST['authid']])) {
			$data = array(
					'forwardto' 		=> $_POST['destination'],
					'enable_forward'	=> TRUE,
					'auth_id'		=> $_POST['authid']
				);
			$gActions->change_email_forwarding($data);
		}
		$vars['p'] = 'email';
	break;

	case "createmailboxlegacy":
		$gActions->create_mailbox($_POST);
		$vars['p'] = 'email';
	break;

	case "createaliaslegacy":
		$gActions->create_mailbox($_POST);
		$vars['p'] = 'email';
	break;

	case 'updatepersonal':
		if ( ! $gBase->Valid(TYPE_EMAIL_LIBERAL, $_POST['email'])) {
			$gMessage->_error->add('email', _('ERROR: invalid email address provided!'));
		} else {
			$_POST['phone'] = $_POST['phone_1'].$_POST['phone_2'];
			$_POST['MobileNumber'] = $_POST['MobileNumber_1'].$_POST['MobileNumber_2'];
			$_POST['WorkTelephone'] = $_POST['WorkTelephone_1'].$_POST['WorkTelephone_2'];
			$_POST['AccountNumber'] = $gUser->platid;

			$user = (string)(($gUser->csr_session)? $gUser->staffid : $gUser->platid);
			$billing = new Billing($user, 'MA', $_SESSION['brands']['allibill_domain'], $gUser->platid);	//BILLING INSTANCE
			$res = $billing->edit_account($_POST);
			if ($res['status'] == Billing::SUCCESS) {

				$gMessage->_notice->add('update', _('Personal Information was updated successfully.'));
			} else {
				$gMessage->_error->add('update', _('There was an internal error.'));
			}
		}

		$vars['p'] = 'personal';
	break;

	case 'emailstatement':
		$user = (string)(($gUser->csr_session)? $gUser->staffid : $gUser->platid);
		$billing = new Billing($user, 'MA', $_SESSION['brands']['allibill_domain'], $gUser->platid);	//BILLING INSTANCE
		$result = $billing->edit_account(array(
				'AccountNumber'		=> $gUser->platid,
				'BillDestination'	=> 'E'));
		if ($result['status'] == Billing::SUCCESS) {
			$gMessage->_notice->add('emailstatement', _('You have successfully switched to receiving your statements by email.'));

		} else {
			$gMessage->_error->add('emailstatement', _('ERROR: failed to switch to email statement!'));
		}

		$vars['p'] = 'personal';
	break;

	case 'changeaccount':
		if ($gUMS->change_login_account($gUser->platid, $_POST['ums_account'])) {
			$gMessage->_notice->add('changeaccount', _('You have successfully changed login account.'));

			$gUser->email = $_POST['ums_account'];
		} else {
			$gMessage->_error->add('changeaccount', _('ERROR: failed to change login account!'));
		}

		$vars['p'] = 'personal';
	break;

	case "addvalias":
		if ( ! preg_match("/^[^\s\"@]{3,50}$/", $vars['add_alias'])) {
			$gMessage->_error->add("valiasadd_invalid_alias", sprintf(_("Invalid alias: %s"),htmlspecialchars($vars['add_alias'])));
		}

		$addies = preg_split('/\s*,\s*/', $vars['add_forwardto'], NULL, PREG_SPLIT_NO_EMPTY);
		foreach ($addies as $addy){
			if (!$gBase->Valid(TYPE_EMAIL, $addy, 1, 250)){
				$gMessage->_error->add("valiasadd_invalid_forwardto", sprintf(_("Invalid forwarding address: %s"),htmlspecialchars($addy)));
			}
		}
		if ( ! isset($gUser->services[SERVICE_TYPE_VDOMAIN][$vars['domainid']])) {
			$gMessage->_error->add("valiasadd_invalid_vd", _("Error reading or authorizing selected domain"));
		}

		if ( ! $gMessage->waiting() && $gActions->add_valias($vars['add_alias'], $vars['domainid'], implode(',', $addies))) {
			$gMessage->_notice->add("valiasadd_success", _("Alias added succesfully!"));
		}
	break;

	case "delvalias":
		if ( ! isset($gUser->services[SERVICE_TYPE_VDOMAIN][$vars['domainid']])) {
			$gMessage->_error->add("valiasadd_invalid_vd", _("Error reading or authorizing selected domain"));
		}

		if ( ! $gMessage->waiting() && $gActions->delete_valias($vars['domainid'], $vars['aliasid'])) {
			$gMessage->_notice->add("valiasdel", _("Alias deleted succesfully!"));
		}

		$vars['p'] = 'vdomain';
	break;

	case 'downloadVM':
		if (isset($gUser->voip_array[$vars['select_phone']]) && ! $gUser->csr_session && $gUser->voip_array[$vars['select_phone']]['is_enhanced']) {
			$contents = file_get_contents('http://sip.voicemail.uniserve.ca:8080/EnticeWS/Ajax?action=getVM&mailbox='.str_replace('-', '', substr($vars['select_phone'], 1, 12)).'&mn='.$vars['message_num'].'&msgFolder='.$vars['message_folder'].'&resellerId='.$brands['voip_reseller_id'].'&subscriberId='.substr($vars['select_phone'], 13));
			if (strpos($contents, 'No matching records found') === FALSE) {
				foreach ($http_response_header as $header_line) {
					header($header_line);
				}

				if ( ! empty($_SERVER['HTTPS'])) {
					header('Pragma: private'); // Required by IE
				}

				echo $contents;
				exit;
			}
		}
		$vars['p'] = 'voice_mail';

	break;

	case 'deleteVM':
		if (isset($gUser->voip_array[$vars['select_phone']], $vars['delete_array']) && ! $gUser->csr_session && $gUser->voip_array[$vars['select_phone']]['is_enhanced']) {
			foreach ($vars['delete_array'] as $message_num => $message_folder) {
				$result_obj = $gEntice->delete_voice_mail_message(substr($vars['select_phone'], 13), str_replace('-', '', substr($vars['select_phone'], 1, 12)), $message_num, $message_folder);
			}
		}

	break;

	case 'updateCallPreferences':
		if (isset($gUser->voip_array[$vars['select_phone']])) {
			$gEntice->update_call_preferences($vars);
			$gMessage->_notice->add('updateCallPreferences', _('Updated.'));
		}

	break;

	case 'ChangeOldEmail':
		if (isset($_SESSION['account_list'][$_POST['email_address']])) {
			// Create new Plat account
			$username = ($_POST['suggestion'] != '')? $_POST['suggestion'] : $_POST['username'];
			$result = $gActions->old_email_update($username.'@uniserve.com', $_POST['password'], $_SESSION['account_list'][$_POST['email_address']]['auth_id'], $_POST['email_address'], $_POST['billflex_id']);
			if ($result == 1) { // Success
				$_SESSION['new_email_address'] = $username.'@uniserve.com';
			} else {
				$vars['step'] = '2';
			}
		} else {
			$vars['step'] = '2';
		}

	break;

	case 'activateemail':
		$data['authid'] = $vars['authid'];
		$gActions->activate_mailbox($data);
		$vars['p'] = 'email';

	break;

	case 'deactivateemail':
		$data['authid'] = $vars['authid'];
		$gActions->remove_mailbox($data);
		$vars['p'] = 'email';

	break;

}

?>

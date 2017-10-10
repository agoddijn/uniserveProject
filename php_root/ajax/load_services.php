<?php
// Load Services
// We will call this whenever we need to load or re-load the services list for a login.
// The services list will be stored in the $gUser->services_details array, so we need to call this
// code when the $gUser->services_details array is empty or not set, or when $gUser->services_details['load'] is true.
//

(isset($gUser->services_details))?$services=$gUser->services_details:$services=array();
$load = $_REQUEST['load'];
$allibill = $_REQUEST['allibill'];
$wholesaler = $_REQUEST['wholesaler'];

if ($wholesaler == 0) {
	$billing = new Billing('admin', 'MA', $allibill);	//BILLING INSTANCE
	//ESM Services (LD,ADSL,F2E,VOIP,BUSVOIP)
	// Create $gUser->services_details and $gUser->voip_array

	$tmp = array();
	$tmp['port'] = array();
	foreach($gUser->services as $_type => $_ar){
		if ($_ar && ($_type != SERVICE_TYPE_DIALUP) && ($_type != SERVICE_TYPE_VDOMAIN)){
			foreach ($_ar as $_ap){
				array_push($tmp['port'],$_ap);
			}
		}
	}
	if (count($tmp['port']) > 0){
		$_pd = $gMain->port_details($gUser->company_id,$tmp);		// This call is appallingly slow for customers with LD ports
		if (count($tmp['port']) == 1) {
			$t = array($_pd['assigned_product_id'] => $_pd);
			$_pd = $t;
		}
		foreach($gUser->services as $_type => $_ar){
			if ($_ar && ($_type != SERVICE_TYPE_DIALUP) && ($_type != SERVICE_TYPE_VDOMAIN)){
				foreach ($_ar as $_ap) {
					// $_pd[$_ap] sometimes is not set (example: port 70912, cancelled "In" order)
					if (isset($_pd[$_ap]) && $_pd[$_ap]['status_text'] != _('Rejected')) {
						if ( ! isset($services[$_type])){
							$services[$_type] = array();
						}

						$services[$_type][$_ap] = $_pd[$_ap];
					}
				}
			}
		}
	}
	// Create $gUser->voip_array
	if (isset($services[SERVICE_TYPE_VOIP])) {
		$voip_array = array();
		$gUser->has_active_voip = FALSE;
		$is_uniserve = FALSE;
		$is_galaxy = FALSE;
		$is_kbt = FALSE;
		foreach ($services[SERVICE_TYPE_VOIP] as $voip) {
			$index = (($voip['status_text'] == _('Canceled'))? 1 : 0).$voip['port'].$voip['subscriber_id'];
			$voip_array[$index] = array();
			$voip_array[$index]['galaxy_id'] = $voip['galaxy_id'];
			$voip_array[$index]['galaxy_sub_id'] = $voip['galaxy_sub_id'];
			$voip_array[$index]['order_id'] = $voip['order_id'];
			$voip_array[$index]['clients_id'] = $voip['clients_id'];
			$voip_array[$index]['services_provider'] = $voip['services_provider'];
			$voip_array[$index]['is_enhanced'] = (substr($voip['provider_param'], -1) == 'E')? TRUE : FALSE;


			if ($voip['services_provider'] == PROVIDER_UNISERVE) {
				$is_uniserve = TRUE;
			} elseif ($voip['services_provider'] == PROVIDER_GALAXY) {
				$is_galaxy = TRUE;
			} elseif ($voip['services_provider'] == PROVIDER_KBT) {
				$is_kbt = TRUE;
			}

			if (($voip['status_text'] != _('Canceled'))) {
				$voip_array[$index]['feature_type_id'] = $gEntice->create_feature_type_id_array((int)$voip['provider_param']);
				$gUser->has_active_voip = TRUE;
			}
		}
		if ($is_uniserve || ($is_galaxy && ! $gUser->has_active_voip) || ($is_kbt && ! $gUser->has_active_voip)) {
			$gUser->voip_provider = PROVIDER_UNISERVE;
		} elseif ($is_galaxy) {
			$gUser->voip_provider = PROVIDER_GALAXY;
		} else {
			$gUser->voip_provider = PROVIDER_KBT;
		}
		ksort($voip_array);
		$gUser->voip_array = $voip_array;
		// Add some extra info from Entice
		if ($is_uniserve) {
			$gEntice->add_product_info();
		}
	}

	if (isset($gUser->services[SERVICE_TYPE_BUSINESS_VOIP])) {
		$sql = 'SELECT custid
				FROM business_voip
				WHERE assigned_product = '.$gUser->services[SERVICE_TYPE_BUSINESS_VOIP][0];
		$res = $gDb->Query($sql);
		if ($row = $gDb->FetchAssoc($res)) {
			$services[SERVICE_TYPE_BUSINESS_VOIP] = array();
			$services[SERVICE_TYPE_BUSINESS_VOIP][$ap_id] = array(
						'services_type'					=> SERVICE_TYPE_BUSINESS_VOIP,
						'status_text'					=> _('Active'),
						'assigned_product_first_name'	=> $assigned_product_first_name,
						'assigned_product_last_name'	=> $assigned_product_last_name,
						'current_product_description'	=> _('Business VoIP'),
					);
			$voip_array = array();
			$result_xml = $gEntice->get_did_by_customer_id($row['custid'], 2);
			if ($result_xml) {
				$result_obj = simplexml_load_string($result_xml);
				if (isset($result_obj->data->row)) {
					$gUser->has_active_voip = TRUE;

					foreach ($result_obj->data->row as $one_row) {
						$did_number = (string)$one_row->DID_NUMBER;
						$did_number = substr($did_number, 0, 3).'-'.substr($did_number, 3, 3).'-'.substr($did_number, 6);
						$index = '0'.$did_number.(string)$one_row->PPR_USER_ID;
						$voip_array[$index] = array();
						$voip_array[$index]['order_id'] = $order_id;
						$voip_array[$index]['services_provider'] = PROVIDER_UNISERVE;
					}

					ksort($voip_array);
				}
			}
			$gUser->voip_array = $voip_array;
		}
	}

	//BillFlex DE Services
	// Load the details for the Unknown Services
	if(isset($services[SERVICE_TYPE_UNKNOWN])) {
		foreach($services[SERVICE_TYPE_UNKNOWN] as $dial) {
			$result = $billing->get_authcode($dial['auth_id']);	//TODO U
			$product_class = $gMain->get_product_class($result['return']['product_offering']);
			$service_details = array();
			if ($product_class > 1) {
				$service_details['services_type'] = SERVICE_TYPE_DIALUP;
				$service_details['current_product_description'] = _('Dialup and Email');
			} elseif ($product_class == 1) {
				$service_details['services_type'] = SERVICE_TYPE_EMAIL;
				$service_details['current_product_description'] = _('Email');
			} elseif ($product_class == 0) {
				$service_details['services_type'] = SERVICE_TYPE_EMAIL;
				$service_details['current_product_description'] = _('Email Alias');
			} else {
				$service_details['services_type'] = SERVICE_TYPE_UNKNOWN;
				$service_details['current_product_description'] = _('Unknown Service');
			}
			$service_details['assigned_product_last_name'] = '';
			$service_details['assigned_product_first_name'] = $dial['assigned_product_first_name'];
			$service_details['port'] = $dial['port'];
			$service_details['auth_id'] = $dial['auth_id'];
			$service_details['status_text'] = $dial['status_text'];

			if ( ! isset($services[$service_details['services_type']])) {
				$services[$service_details['services_type']] = array();
			}
			unset($services[SERVICE_TYPE_UNKNOWN][$dial['auth_id']]);
			$services[$service_details['services_type']][$dial['auth_id']] = $service_details;
		}
	}

	// redo show menu and VDOMAIN
	// Populate $gUser->show_menu and $gUser->services[SERVICE_TYPE_VDOMAIN]
	// Note: "email" page regenerates $gUser->show_menu
	$userid_array = array();

	$show_menu = array();
	$show_menu['show_passwd'] = array();
	$show_menu['show_forward'] = array();
	$show_menu['show_vacation'] = array();
	$show_menu['show_antispam'] = array();
	if (isset($gUser->authids) && is_array($gUser->authids) && count($gUser->authids) > 0) {

		$result = $gUMS->get_users_by_auth_ids($gUser->authids);
		foreach ($result as $row) {
			$email = $row['username'].'@'.$row['domainname'];
			if ($row['show_passwd'] == 'Y') {
				$show_menu['show_passwd'][$row['authid']] = $email;
			}
			if ($row['show_forward'] == 'Y') {
				$show_menu['show_forward'][$row['authid']] = $email;
			}
			if ($row['show_vacation'] == 'Y') {
				$show_menu['show_vacation'][$row['authid']]['email'] = $email;
				$show_menu['show_vacation'][$row['authid']]['userid'] = $row['id'];
			}
			if (($row['antispam'] == 'Y' && $row['show_antispam'] == 'Y') || $gUser->csr_session) {
				$show_menu['show_antispam'][$row['authid']]['email'] = $email;
				$show_menu['show_antispam'][$row['authid']]['userid'] = $row['id'];
			}
			$userid_array[] = $row['id'];
		}

	}
	$gUser->show_menu = $show_menu;

	if (count($userid_array) > 0) {
		$gUser->services[SERVICE_TYPE_VDOMAIN] = $gUMS->get_vdomains($userid_array);
	}

	$gUser->classname 		= $gUser->ums_res==null ? 'CSR Override'		: $gUser->ums_res['classname'];
	$gUser->show_usage 		= $gUser->ums_res==null ? 'Y'			: $gUser->ums_res['show_usage'];
	$gUser->show_passwd 		= $gUser->ums_res==null ? 'N'			: $gUser->ums_res['show_passwd'];
	$gUser->show_forward		= $gUser->ums_res==null ? 'N'			: $gUser->ums_res['show_forward'];
	$gUser->show_ledger 		= $gUser->ums_res==null ? 'Y'			: $gUser->ums_res['show_ledger'];
	$gUser->show_vacation 		= $gUser->ums_res==null ? 'N'			: $gUser->ums_res['show_vacation'];
	$gUser->show_cancel 		= $gUser->ums_res==null ? 'N'			: $gUser->ums_res['show_cancel'];
	$gUser->show_antispam 		= $gUser->ums_res==null ? 'N'			: $gUser->ums_res['show_antispam'];
	$gUser->antispam 			= $gUser->ums_res==null ? null			: $gUser->ums_res['antispam'];
	$gUser->forwardto 			= $gUser->ums_res==null ? ''			: $gUser->ums_res['forwardto'];
	$gUser->vacation 			= $gUser->ums_res==null ? ''			: $gUser->ums_res['vacation'];
	$gUser->bill_aa 			= $gUser->ums_res==null ? 'N'			: $gUser->ums_res['bill_aa'];
	$gUser->aa_firstuse 		= $gUser->ums_res==null ? 'Y'			: $gUser->ums_res['aa_firstuse'];
	$gUser->status 			= $gUser->ums_res==null ? 'Not active'		: $gUser->ums_res['status'];
	$gUser->ums_bill_date		= $gUser->ums_res==null ? 1			: $gUser->ums_res['bill_day'];
	$gUser->ums_class_number		= $gUser->ums_res==null ? 'n/a' 			: $gUser->ums_res['class'];
	$gUser->id 			= $gUser->ums_res==null ? 0			: $gUser->ums_res['id'];

	if ($gUser->g_platid == 0) {
		$allowables = $gMain->get_allowable_emails($gUser->platid);
		$gUser->freemails = $allowables['freemails'];
		$gUser->freealiases = $allowables['freealiases'];
	}

} else {
	$show_menu = array();
	$show_menu['show_passwd'] = array();
	$show_menu['show_forward'] = array();
	$show_menu['show_vacation'] = array();
	$show_menu['show_antispam'] = array();
	$gUser->show_menu = $show_menu;
}

// return the services array
$gUser->services_details=$services;
// display the services
// set this to 0 or else we will get stuck in an infinite loop when we reload the page.
$gUser->services_details['load']=0;
?>
<!-- When we are done loading the services we will reload the page from here so that the menus are properly
       setup with the correct DE services-->
<script type="text/javascript" language="javascript">
	$(document).ready(function() {
		window.location.reload();
	});
</script>

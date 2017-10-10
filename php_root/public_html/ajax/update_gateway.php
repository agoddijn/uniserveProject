<?php
$data = $_REQUEST;

// update the gateway_location value in the adsl_port_settings table
$sql = sprintf("update adsl_port_settings set gateway_location = '%s' where assigned_product = %d", $data['gateway_location'], $data['gateway_apid']);
$gDb->Query($sql);

// find out if the service has been assigned to a modem
$sql = sprintf("select i.serial_number, i.lan_mac_address, i.wan_mac_address, i.status,
			ii.hwid, ii.model, ii.description
		from inventory i
		inner join inventory_items ii on ii.id = i.model
		where i.assigned_product  = %d", $data['gateway_apid']);
$res = $gDb->Query($sql);
// Update the ACS if necessary
if($gDb->NumRows($res) > 0) {
	// Update the modem in ACS if the status is 'assigned' or 'active'
	$gACS = new voACS($gConfig['acs_server']);
	while ($modem = $gDb->FetchAssoc($res)) {
		if (in_array($modem['status'], array(3,4))) {
			$acs_modem = $gACS->update_modem(array('serialno' => strtolower($modem['lan_mac_address']), 'hwid' => $modem['hwid'], 'gateway_location' => $data['gateway_location']));
			if ($acs_modem['status'] == $gACS::SUCCESS) {
				//update the service details in the $gUser array
				$gUser->services_details[SERVICE_TYPE_ADSL][$data['gateway_apid']]['gateway_location'] = $data['gateway_location'];
				error_log("updated the gateway_location for " . strtolower($modem['lan_mac_address']) . " on the ACS server to " . $data['gateway_location']);
			} else {
				error_log("failed to update the gateway_location for " . strtolower($modem['lan_mac_address']) . " on the ACS server to " . $data['gateway_location']);
			}
		}
	}
}

?>

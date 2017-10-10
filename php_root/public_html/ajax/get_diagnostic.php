<?php
/**
 * Retrieve diagnostic informatio from Bell and Telus websites
 */

function show_error($message = NULL) {
	exit('<font color="red">'.(is_null($message)? _('Diagnostics are temporarily unavailable due to maintenance. Please try again later.') : $message).'</font>');
}

if ( ! isset($_GET['port'])
		|| ! isset($gUser->services_details[SERVICE_TYPE_ADSL][$_GET['port']])
		|| $gUser->services_details[SERVICE_TYPE_ADSL][$_GET['port']]['status_text'] == _('Canceled')
		|| $gUser->services_details[SERVICE_TYPE_ADSL][$_GET['port']]['status_text'] == _('Not active')) {
	show_error();
}

$adsl_port = $gUser->services_details[SERVICE_TYPE_ADSL][$_GET['port']];

if ($adsl_port['services_provider'] == PROVIDER_TELUS) {
	$data = array();
	if (strlen($adsl_port['adsl_pseudo_number']) == 12) {
		$data['pseudo']['area'] = substr($adsl_port['adsl_pseudo_number'],0,3);
		$data['pseudo']['prefix'] = substr($adsl_port['adsl_pseudo_number'],4,3);
		$data['pseudo']['suffix'] = substr($adsl_port['adsl_pseudo_number'],8,4);
	} else {
		$data['phone']['area'] = substr($adsl_port['port'],0,3);
		$data['phone']['prefix'] = substr($adsl_port['port'],4,3);
		$data['phone']['suffix'] = substr($adsl_port['port'],8,4);
	}

	require('VPOP.php');
	$vpop = new VPOP($data);

	if ($vpop->login == 1) {
		$result = $vpop->vpop_mainmenu("DIAGNOSTIC_TOOL","ASDL VPOP Service - diagnostics");
		if ($result == 1) {
			$diag = $vpop->vpop_diagnostic();
			if ($diag['error'] === FALSE) {
?>
<table class="sync_rate">
<tr>
	<th><?=_('Date')?></th>
	<th><?=_('Status')?></th>
	<th><?=_('Downstream Speed (Kbs)')?></th>
	<th><?=_('Upstream Speed (Kbs)')?></th>
	<th><?=_('Downstream Attenuation (dB)')?></th>
	<th><?=_('Upstream Attenuation (dB)')?></th>
</tr>
<tr>
	<td><?=$diag[0]['date']?></td>
	<td><?=$diag[0]['status']?></td>
	<td><?=$diag[0]['currentStateD']?></td>
	<td><?=$diag[0]['currentStateU']?></td>
	<td><?=$diag[0]['AttenuationD']?></td>
	<td><?=$diag[0]['AttenuationU']?></td>
</tr>
</table><br />
<table class="sync_rate">
<tr>
	<th><?=_('Downstream SNR Margin (dB)')?></th>
	<th><?=_('Upstream SNR Margin (dB)')?></th>
	<th><?=_('Downstream Output Power (dBm)')?></th>
	<th><?=_('Upstream Output Power (dBm)')?></th>
</tr>
<tr>
	<td><?=$diag[0]['SNRMarginD']?></td>
	<td><?=$diag[0]['SNRMarginU']?></td>
	<td><?=$diag[0]['OutputPowerD']?></td>
	<td><?=$diag[0]['OutputPowerU']?></td>
</tr>
</table>

<div style="margin-top:15px;"><?=_('Provided for informational purposes only, with no warranty or guarantee.')?></div>
<?php
			} else {
				show_error();
			}
		} else {
			show_error();
		}
	} else {
		show_error();
	}
} elseif ($adsl_port['services_provider'] == PROVIDER_AEBC) {
	$data = array();
	if (strlen($adsl_port['adsl_pseudo_number']) == 12) {
		$data['pseudo'] = preg_replace('/\\d/', '', $adsl_port['adsl_pseudo_number']);
	} else {
		$data['phone'] = preg_replace('/\\d/', '', $adsl_port['port']);
	}

	$gAEBC = new AEBC();

	$diag = $gAEBC->vpop_diagnostic($data);
	if ($diag['error'] === FALSE) {
?>
<table class="sync_rate">
<tr>
	<th><?=_('Date')?></th>
	<th><?=_('Status')?></th>
	<th><?=_('Downstream Speed (Kbs)')?></th>
	<th><?=_('Upstream Speed (Kbs)')?></th>
	<th><?=_('Downstream Attenuation (dB)')?></th>
	<th><?=_('Upstream Attenuation (dB)')?></th>
</tr>
<tr>
	<td><?=$diag[0]['date']?></td>
	<td><?=$diag[0]['status']?></td>
	<td><?=$diag[0]['currentStateD']?></td>
	<td><?=$diag[0]['currentStateU']?></td>
	<td><?=$diag[0]['AttenuationD']?></td>
	<td><?=$diag[0]['AttenuationU']?></td>
</tr>
</table><br />
<table class="sync_rate">
<tr>
	<th><?=_('Downstream SNR Margin (dB)')?></th>
	<th><?=_('Upstream SNR Margin (dB)')?></th>
	<th><?=_('Downstream Output Power (dBm)')?></th>
	<th><?=_('Upstream Output Power (dBm)')?></th>
</tr>
<tr>
	<td><?=$diag[0]['SNRMarginD']?></td>
	<td><?=$diag[0]['SNRMarginU']?></td>
	<td><?=$diag[0]['OutputPowerD']?></td>
	<td><?=$diag[0]['OutputPowerU']?></td>
</tr>
</table>

<div style="margin-top:15px;"><?=_('Provided for informational purposes only, with no warranty or guarantee.')?></div>
<?php
	} else {
		show_error($diag['error']);
	}
} else {
	require('Nexxia.php');
	$data = array();

	// Get provider order ID
	$sql =
		"SELECT MAX(provider_order_id) AS provider_order_id
		FROM orders
		WHERE assigned_product = ".(int)$_GET['port']."
			AND (provider_order_id LIKE 'TSI%' OR provider_order_id LIKE 'INC%')
			AND status = 5
			AND type != 2";
	$result = $gDb->Query($sql);
	if ($row = $gDb->FetchAssoc($result)) {
		if (strpos($row['provider_order_id'], 'TSI') === 0) {
			$data['username'] = $config['site_nexxia_uniserve_user'];
			$data['password'] = $config['site_nexxia_uniserve_pass'];
		} else {
			$data['username'] = $config['site_nexxia_internet_user'];
			$data['password'] = $config['site_nexxia_internet_pass'];		
		}
	} else {
		show_error();
	}

	$data['db'] = $gDb;
	$data['provider_order_id'] = $row['provider_order_id'];
	$data['phone'] = $adsl_port['port'];

	$nexxia = new Nexxia($data);

	$sync_rate = $nexxia->check_sync_rate();
	if (strpos($sync_rate, '<table') === FALSE) {
		show_error();
	} else {
		$search = array();
		$replace = array();
		
		$search[] = 'Line Status';
		$replace[] = _('Line Status');
		
		$search[] = 'UpTime';
		$replace[] = _('UpTime');

		$search[] = 'Line Profile Name';
		$replace[] = _('Line Profile Name');

		$search[] = 'Last State Change';
		$replace[] = _('Last State Change');

		$search[] = 'Operational Status';
		$replace[] = _('Operational Status');

		$search[] = 'Speed';
		$replace[] = _('Speed');

		$search[] = 'Relative Capacity Occupation';
		$replace[] = _('Relative Capacity Occupation');

		$search[] = 'Noise Margin';
		$replace[] = _('Noise Margin');

		$search[] = 'Signal Power';
		$replace[] = _('Signal Power');

		$search[] = 'Attenuation';
		$replace[] = _('Attenuation');

		$search[] = 'Block count';
		$replace[] = _('Block count');

		$search[] = 'UpStream';
		$replace[] = _('UpStream');

		$search[] = 'DownStream';
		$replace[] = _('DownStream');

		// Line Status
		$search[] = 'Out of Service';
		$replace[] = _('Out of Service');
		
		$search[] = 'In Service';
		$replace[] = _('In Service');
		
		echo str_replace($search, $replace, $sync_rate);
?>
<div style="margin-top:15px;"><?=_('Provided for informational purposes only, with no warranty or guarantee.')?></div>
<?php
	}
}


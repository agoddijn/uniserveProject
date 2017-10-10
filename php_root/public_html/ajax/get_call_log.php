<?php
/**
 * Retrieve call log array from the Entice voice server.
 *
 */

function show_error($message = NULL) {
	exit('<font color="red">'.(is_null($message)? _('Unable to Retrieve the Call Log. Please try again later.') : $message).'</font>');
}

if ( !isset($_GET['phone']) || !isset($_GET['date_range']) ) {
	show_error();
}

$call_records = $gEntice->get_call_log(substr($_GET['date_range'], 0, 10), substr($_GET['date_range'], -10), $_GET['phone']);
?>
<div style="margin-top:30px;">
<?php
	$href = $_GET['rate_table_url'];
	if ($href != '') {
?>
<div style="width:100%;text-align:right;margin-bottom:5px;"><a href="<?=$href?>" target="_blank" ><?=_("View full international calling rates here");?></a></div>
<?php
	}

	if (count($call_records) > 0) {
		$total_charged_calls = 0;
		$total_charges = 0;
		
		if ($_GET['show_charge'] == 't') {
?>
<font size=1>Highlighted calls have generated charges. Italic charges ( e.g. <i>$5.00</i> ) have not yet been billed, final charges may be different.</font><br /><br />
<?php
		}
?>
<table id="call_log" class="tablesorter">
<thead>
<tr>
<th><?=_('Type')?></th>
<th><?=_('Number')?></th>
<th><?=_('Time of Call')?></th>
<th><?=_('Call Length')?></th>
<?php
		if ($_GET['show_charge'] == 't') {
?>
<th><?=_('Call Charge')?></th>
<?php
		}
?>
</tr>
</thead> 
<tbody>
<?php
		foreach ($call_records as $time => $record) {
			$call_charge_legit = 1;
			if ($_GET['show_charge'] == 't' && $record['charge'] > 0) { 
				$call_charge_legit = 0;
				// We need to correct the charge based on the Data Warehouse.  IF the call has not yet been billed by 
				// BillFLex then we show the estimated charge from Entice, in italics.
				$phone = preg_replace('/-/','',substr($_GET['phone'],1,12));
				$invdate = substr($_GET['date_range'], -10);
				$invoicedate = date("mdY", strtotime($invdate . " + 1 day"));
				$call_data = $gData->get_billed_call($phone, substr($time, 0, -5), $invoicedate);
				if (count($call_data) > 0) {
					$record['charge'] = $call_data['call_amount'];
					$call_charge_legit = 1;
				}
				$total_charged_calls++;
				$total_charges += $record['charge'];
			?>
			<tr class=odd>
			<? } else { ?>
			<tr>
			<? } ?>
			<td><?
			if ($record['type']==1) {
				echo _('Outbound');
			} else {
				if ($record['length'] != '00:00:00') {
					echo _('Inbound');
				} else {
					echo _('Missed');
				}
			}
?></td>
<td><?php
			$number_length = strlen($record['number']);
			if ($number_length == 11 && $record['number'][0] == '1') {
				echo '1 ('.substr($record['number'], -10, -7).') '.substr($record['number'], -7, -4).'-'.substr($record['number'], -4);
			} elseif ($number_length == 10) {
				echo '('.substr($record['number'], 0, -7).') '.substr($record['number'], -7, -4).'-'.substr($record['number'], -4);
			} else {
				echo $record['number'];
			}
?></td>
<td><?=substr($time, 0, -5)?></td>
<td><?=$record['length']?></td>
<?php
			if ($_GET['show_charge'] == 't') {
?>
<td><?=($call_charge_legit == 1 ? "" : "<i>");?>$<?=number_format($record['charge'],2)?><?=($call_charge_legit == 1 ? "" : "</i>");?></td>
<?php
			}
?>
</tr>
<?php
		}
		if ($_GET['show_charge'] == 't') {
?>
<tr><td colspan=4 align=right><b>Total Number of calls charged - <?=$total_charged_calls;?></b></td><td><b>$<?=number_format($total_charges,2);?></b></td></tr>
<?php
		}
?>
</tbody>
</table>
<?php
	} else {
?>
<span><?=_('No records to display.')?></span>
<?php
	}
?>
</div>



<?php
// Load the devices for the logged in customer


$service_count = 0;
$devices = array();

$sql = sprintf("select * from msp_device, msp_site where msp_site.company_recid = '%s'",$gUser->id);

$res = $gDb->Query($sql);
while ($row = $gDb->FetchAssoc($res)){
	$devices[] = $row;
}
$gUser->devices = $devices;


?>

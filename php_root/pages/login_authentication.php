<?php

/////
// Authentication Code
///

try {
	$sql = sprintf("select * from msp_company where username = '%s' and password = '%s'",$gDb->escape($vars['email']), $gDb->escape($vars['password']));
	$res = $gDb->Query($sql);
} catch (Exception $e) {
	error_log($e->getMessage());
}

if ($gDb->NumRows($res) == 1){
	$row = $gDb->FetchAssoc($res);
	$gUser->id = $row['company_recid'];
	$gUser->email = $vars['email'];
	$authorized = 1;
}
?>

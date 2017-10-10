<?php
// Authorize Credit Card
//
// We will use the Optimal methods here to authorize the credit card given from 
// an Add Customer form.  Only accounts that have an authorized credit card
// will be added to BillFlex

require_once('Optimal.php');

$optimal = new Optimal(false);

$name = explode(' ', $_POST['credit_card_name']);
$first_name = $name[0];
$last_name = $name[1];

$parameters = array(
	'merchantRefNum'	=> '000000001',
	'cardNum'		=> $_POST['payment_method_cc_no'],
	'month'		=> substr($_POST['payment_method_cc_expiry'],0,2),
	'year'		=> '20' . substr($_POST['payment_method_cc_expiry'],2,2),
	'cvd'		=> $_POST['payment_method_cc_cvv'],
	'firstName'	=> $first_name,
	'lastName'	=> $last_name,
	'zip' 		=> @$_POST['zip']
);
$res = $optimal->verify_card($parameters);

if ($res->ccTxnResponseV1->cvdResponse == 'M') {
	$response = 'authorized';
} else {
	$response = 'not_authorized';
}

print trim($response);

?>

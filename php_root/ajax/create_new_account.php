<?php
//
// Create New BillFlex Account
//
header('Content-Type: application/json');
$return = array(
		'status'	 	=> 0,	// Success or error
		'description'	=> 'Failed to add new customer',			// Description of error
		'return'		=> NULL,			// Return data
		'account_id'	=> NULL
	);
$data = $_REQUEST;
global $gUser;
global $gUMS;
global $gDb;
$brands = $_SESSION['brands'];
require_once('Billing.php');
$gBilling = new Billing('Admin', 'MA', $data['billflex'], '000001000');	//BILLING INSTANCE

// DEBUG
$debug = fopen('/tmp/debug.log', 'a');

if (isset($gUser->account) && $gUser->new_customer && $data['tos_agree'])	 {
	$account = $gUser->account;
	$res_add = $gBilling->add_contract($account);
	if($res_add['status'] == Billing::SUCCESS) {
		$billing = new Billing('Admin', 'MA', $data['billflex'], $res_add['return']);	//BILLING INSTANCE
		$res_complete = $gBilling->complete_order();	//TODO U
		if($res_complete['status'] == Billing::SUCCESS) {
			$account_id = $res_complete['return'];
			$username = $gUser->account['login_username'];
			$password = $gUser->account['password1'];
			// We want to add the login_username to the account now
			$service = array();
			$service['productOffer'] = 'DER2943MYA';   // MyAccount Access
			$service['userName'] = $username;
			$service['passwd'] = $password;
			$service['description'] = 'MyAccount login (' . $username . ')';
			$service['status'] = 'Active';
			$res_service = $gBilling->add_service($username, 'DE', $service);
			$authid = $res_service['return'];
			// Need to add the service to UMS as well (class 0)
			$username_parts = explode('@', $username);
			$user = $username_parts[0];
			$res_ums = $gUMS->add_user($user, 0, $password,$authid,0,$account_id,1);
			// if the user is added to UMS we can try to set the login to the new, now permanent, username
			// from the temporary login

			// we need to attempt to add all the other services from the cart now, using the DSItem classes
			// with an order() method.

			// We want to reload all the services into the $gUser object now??  maybe not??

			// return the details of all this work now.
			$res_service['account_id'] = $account_id;
			echo json_encode($res_service);
			fclose($debug);
			exit;

		} else {
			// return the account number even though it is not activated
			$res_complete['account_id'] = $res_add['return'];
			echo json_encode($res_complete);
			fclose($debug);
			exit;
		}
	} else {
		// return failure with a null account_id
		$res_add['account_id'] = NULL;
		echo json_encode($res_add);
		fclose($debug);
		exit;
	}
}
echo json_encode($return);
?>
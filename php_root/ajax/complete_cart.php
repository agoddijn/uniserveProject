<?php
//
// Create New BillFlex Account
//
require_once('Billing.php');

header('Content-Type: application/json');
$return = array(
		'status'	 	=> 0,	// Success or error
		'description'	=> 'Failed to complete the cart',			// Description of error
		'return'		=> NULL,			// Return data
		'account_id'	=> NULL
	);
$data = $_REQUEST;
global $gUser;
global $gUMS;
global $gDb;
$brands = $_SESSION['brands'];

$gBilling = new Billing('Admin', 'MA', $brands['allibill_domain'], '000001000'); 	//BILLING INSTANCE

// DEBUG
$debug = fopen('/tmp/debug.log', 'a');
fwrite($debug, "Hello");
if (@$data['tos_agree']) {
	if (isset($gUser->account) && $gUser->new_customer) {
		$account = $gUser->account;
		$res_add = $gBilling->add_contract($account);
		fwrite($debug, print_r($res_add,true));
		if($res_add['status'] == Billing::SUCCESS) {
			$billing = new Billing('Admin', 'MA', $brands['allibill_domain'], $res_add['return']); 	//BILLING INSTANCE
			$billing->account_contract = "C";
			$res_complete = $billing->complete_order();	//TODO U
			fwrite($debug, print_r($res_complete,true));
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
				$res_service = $billing->add_service($username, 'DE', $service);
				$authid = $res_service['return'];
				// Need to add the service to UMS as well (class 0)
				$username_parts = explode('@', $username);
				$user = $username_parts[0];
				$res_ums = $gUMS->add_user($user, 0, $password,$authid,0,$account_id,1);
				// Now we will reset the login in $gUser to be the now permanent login
				$ums_res = $gUMS->ums_auth_nopass($account_id);
				$gUser->ums_res = $ums_res;
				$gUser->ums_res['authid'] = $authid;
				$gUser->email = substr($gUser->email, 0, -11);
				$gUser->ap_id = '';
				// Here we set it up to load the services when the user clicks on the My Services menu
				$gUser->services_details['load'] = 1;
				$gUser->services_details[0][$authid] = array(
						'class' 						=> -1,
						'current_product_description'		=> 'New Service',
						'assigned_product_last_name'	=> '',
						'assigned_product_first_name'	=> '',
						'port'							=> $gUser->email,
						'auth_id'						=> $authid,
						'status_test'					=> 'Active'
						);
				$gUser->services_details['count'] = 1;

				$gUser->platid = $account_id;
				$gUser->g_platid = 0;
				$gUser->authids[0] = $authid;
				$gUser->show_menu['show_passwd'] = 'N';
				$gUser->show_menu['show_forward'] = 'N';
				$gUser->show_menu['show_vacation'] = 'N';
				$gUser->show_menu['show_anitspam'] = 'N';
				$gUser->show_usage = $ums_res['show_usage'];
				$gUser->show_passwd = $ums_res['show_passwd'];
				$gUser->show_ledger = $ums_res['show_ledger'];
				$gUser->show_vacation = $ums_res['show_vacation'];
				$gUser->show_antispam = $ums_res['show_antispam'];
				$gUser->show_forward = $ums_res['show_forward'];
				$gUser->show_cancel = $ums_res['show_cancel'];
				$gUser->vacation = $ums_res['vacation'];
				$gUser->status = $ums_res['status'];
				$gUser->bill_date = $ums_res['bill_date'];
				unset($gUser->account);
				unset($gUser->new_customer);
				$return['account_id'] = $res_complete['return'];
				// Moving on!!
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
	} else {
		// If this is not a new customer then we know who it is.
		$return['account_id'] = $gUser->platid;

	}

	// Create the billflexCustomer object in the shopping cart
	$billflexCustomer = $gCart->getBillflexCustomer();
	$billflexCustomer->loadBillFlexCustomer($return['account_id']);
	$gCart->setBillflexCustomer($billflexCustomer);
	$gCart->save_cart();

	// Now we will order the services in the cart using the order() method in the CartItem classes
	$orders = array();
	global $gCart;
	$gCart->rewind();
	while ($gCart->valid()) {
		$it = $gCart->current();
		$item = $it['item'];
		fwrite($debug, print_r($item, true));
		if($item->order($gCart->getBillflexCustomer())) {
			$gUser->service_details['count'] = $gUser->service_details['count']++;
			$gUser->service_details['load'] = 1;
			fwrite($debug, "remove_item\n");
			$gCart->remove_item($item);
			$gCart->save_cart();
		}
		$gCart->next();
	}
}
// Register the User
$gUser->_register_user();

$return['status'] = 1;
$return['description'] = 'Success';
$return['return'] = $orders;
$_SESSION['order_completed'] = $return;

fwrite($debug, print_r($_SESSION['order_completed'], true));
fclose($debug);
// Return the $return array
echo json_encode($return);


?>

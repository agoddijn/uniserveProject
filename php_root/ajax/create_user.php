<?php
// Create User
//
// We will take the details from the Create New Account form and stuff them into a $gUser object so that 
// MyAccount will believe we have all we need to proceed with the shopping cart checkout.  We will not
// load any services for this account (as the account does not really exist yet) so they won't be able to do 
// anything else on MyAccount.
//
/**
[email] => $login
    [wholesaler] => 0	
    [taxProfile] => BC
    [taxRate] => 0.12
    
 create $gUser['account'] array with the new account details
 */
 global $gUser;
 
 $data = $_POST;
 $gUser->account = $data;
 $gUser->new_customer = 1;
 $gUser->wholesaler = 0;
 $gUser->email = $data['login_username'] . '(temporary)';
 $gUser->taxProfile = $data['state'];
 $gUser->taxRate = $gConfig['tax_rates'][$data['state']];
 
 $gUser->g_platid 			= 0;
$gUser->classname 		= 'Customer Login';
$gUser->show_usage 		= 'N';
$gUser->show_passwd 		= 'N';
$gUser->show_forward		= 'N';
$gUser->show_ledger 		= 'N';
$gUser->show_vacation 		= 'N';
$gUser->show_cancel 		= 'N';
$gUser->show_antispam 		= 'N';
$gUser->antispam 			= null;
$gUser->forwardto 			= '';
$gUser->vacation 			= '';
$gUser->bill_aa 			= 'N';
$gUser->aa_firstuse 		= 'N';
$gUser->status 			= 'Active';
$gUser->ums_bill_date		= 1;
$gUser->ums_class_number		= 'n/a';
$gUser->id 			= 0;
 
$gUser->ap_id = 0;
$gUser->wholesale_session = true;
$gUser->cust_name = $data['first_name'] . ' ' . $data['last_name'];

	
$gUser->_register_user();
 
print "done";
?>

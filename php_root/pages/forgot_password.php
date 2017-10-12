<?php
/**
 * Password Recovery page
 */
require (DIR_BASE.'/lib/recaptchalib.php');

// Form is submitted
if (isset($_POST['recaptcha_response_field'])) {
	// Validate captcha
	$resp = recaptcha_check_answer(RECAPTCHA_PRIVATE_KEY, $_SERVER['REMOTE_ADDR'], $_POST['recaptcha_challenge_field'], $_POST['recaptcha_response_field']);
	if (! $resp->is_valid) {
		$gMessage->_error->add('captcha', _('ERROR: Security code is incorrect.'));
	} else {
		list ($user, $domain) =  explode('@', $_POST['username']);

		$res = $gUMS->ums_auth_nopass( $_POST['username']);

		if (!$res) {
			$gMessage->_error->add('not_found', _('ERROR: No matching account found.'));
		} else {

			$platid = $res['platid'];

			//$billing = new Billing((string)$platid, 'MA', $_SESSION['brands']['allibill_domain'], $platid);	//BILLING INSTANCE
			if ($gBilling->db === NULL) {
				$gMessage->_error->add('database', _('ERROR: System error occurred.').' (02)');
			} else {
				if ($gBilling->customer_id == Billing::INVALID_CUSTOMER_ID) {
					$gMessage->_error->add('not_found', _('ERROR: No matching account found.'));
				} else {
					$result = $gBilling->get_customer($company_id);
					$row = $result['return'];

					if ($row['guarantor'] > 0) {
						$platid = $row['guarantor'];
						$child_zip = $row['zip'];
					}

					$billing = new Billing((string)$platid, 'MA', $_SESSION['brands']['allibill_domain'],  $platid);	//BILLING INSTANCE
					$result = $gBilling->get_zip_and_payment_info();
					$row = $result['return'];
					if ( ! $row) {
						$gMessage->_error->add('not_found', _('ERROR: No matching account found.'));
					} else {
						if (isset($child_zip)) {
							$row['zip'] = $child_zip;
						}

						if ( strtoupper(str_replace(' ', '', $_POST['postal_code'])) == strtoupper(str_replace(' ', '', $row['zip']))
								&& $row['pmt_total'] == $_POST['payment_amount']
								&& ( ($row['stmtmethod'] == 'CREDIT CARD' && strlen($row['ccnumber']) > 4 && substr($row['ccnumber'], -4) == $_POST['card_number'])
									|| ($row['stmtmethod'] == 'EXTERNAL1' && strlen($row['routenumber']) > 4 && substr($row['routenumber'], -4) == $_POST['card_number']) ) ) {
							// Passed check, go to login action
							$_POST['action_login'] = TRUE;
							$_POST['email'] = $_POST['username'];
							$_POST['password'] = 'DummyPass';
							$_POST['auth_profile'] = '5';
							$gUser->forgot_password_login = TRUE;
							require(DIR_BASE.'/pages/login.php');
						} else {
							$gMessage->_error->add('not_found', _('ERROR: No matching account found.'));
						}
					}
				}
			}
		}

	}
}

$new_page_title = _('Reset Password');
require (DIR_BASE . '/templates/header.php');
?>
<style>
#form_table > tbody > tr > td {
	vertical-align:text-top;
	padding-top: 15px;
	font-weight: bold;
}
</style>

<table width="900" cellspacing="0" cellpadding="0" align="center" style="border-color:#<?=$brands['main_colour']?>;border-style:solid;border-width:2px;">
<tr>
<td style="padding:10px;" >
<div class="title"><?=_('Reset Password')?></div>
<div class="divider"></div>
<?php
$gMessage->display();
?>

<form name="order" method="post" action="<?=$_SERVER['PHP_SELF']?>">
<table width="70%" align="center" id="form_table" align="center" >
	<tr>
		<td><?=_('Username (email address)');?>:</td>
		<td><input type="text" maxlength="80" size="30" value="<?=isset($_POST['username'])? $_POST['username'] : ''?>" name="username" id="username"/></td>
	</tr>
	<tr>
		<td><?=_('Last 4 digits of credit card (or bank account) number');?>:</td>
		<td><input name="card_number" id="card_number" type="text" size="4" maxlength="4" value="<?=isset($_POST['card_number'])? $_POST['card_number'] : ''?>"/></td>
	</tr>
	<tr>
		<td><?=_('Latest payment amount');?>:</td>
		<td><input type="text" maxlength="7" size="7" value="<?=isset($_POST['payment_amount'])? $_POST['payment_amount'] : ''?>" name="payment_amount" id="payment_amount"/></td>
	</tr>
	<tr>
		<td><?=_('Postal code');?>:</td>
		<td><input type="text" maxlength="10" size="7" value="<?=isset($_POST['postal_code'])? $_POST['postal_code'] : ''?>" name="postal_code" id="postal_code"/></td>
	</tr>
	<tr>
		<td><?=_('Security code confirmation');?>:</td>
		<td><?=recaptcha_get_html(RECAPTCHA_PUBLIC_KEY)?></td>
	</tr>
</table>
<div style="text-align:center; margin:30px">
	<input type="submit" value="<?=_('Submit')?>" name="order"/>
</div>
</form>

</td>
</tr>
</table>


<script language="javascript" type="text/javascript">
$(document).ready(function(){
	$('#username').focus();
	disable_enter_key_submit();

	$('input:text').blur(function(e) {
		$(this).val(jQuery.trim($(this).val()));
	});

	$('#postal_code').blur(function() {
		$(this).val($(this).val().toUpperCase());
	});

	$('form').submit(function() {
		var message_holder, focus_object;

		function add_message(object, message) {
			if (message_holder == undefined) {
				focus_object = object;
				message_holder = message;
			} else {
				message_holder += '\n' + message;
			}
		}

		if ($('#username').val() == '') {
			add_message($('#username'), '<?=_('Please enter username.');?>');
		} else if ( ! /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.[A-Za-z]{2,4}$/.test($('#username').val())) {
			add_message($('#username'), '<?=_('Username is incorrect.');?>');
		}

		if ($('#card_number').val() == '' ||  ! /^\d{4}$/.test($('#card_number').val())) {
			add_message($('#card_number'), "<?=_('Please enter last 4 digits of credit card (or bank account) number.');?>");
		}

		if ($('#payment_amount').val() == '') {
			add_message($('#payment_amount'), '<?=_('Please enter latest payment amount.');?>');
		} else if (isNaN($('#payment_amount').val())) {
			add_message($('#payment_amount'), '<?=_('Payment amount is not a valid number.');?>');
		}

		if ($('#postal_code').val() == '') {
			add_message($('#postal_code'), '<?=_('Please enter postal code.');?>');
		}

		if ($('#recaptcha_response_field').val() == '') {
			add_message($('#recaptcha_response_field'), '<?=_('Please enter security code.');?>');
		}

		if (message_holder != undefined) {
			alert(message_holder);
			$(focus_object).focus();
			return false;
		} else {
			return true;
		}
	});
});
</script>

<?php
require (DIR_BASE . '/templates/footer.php');

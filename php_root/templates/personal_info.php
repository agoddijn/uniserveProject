<style type="text/css">

#ums_account_td div {
	margin: 3px 0;
	vertical-align: middle;
}
</style>

<script language="javascript" type="text/javascript">
$(document).ready(function() {
	disable_enter_key_submit();

	$('input:text').on('blur', function(e) {
		$(this).val(jQuery.trim($(this).val()));
	});

	$('#action_emailstatement').click(function() {
		return confirm('You are requesting to switch to email statements. Do you want to continue?');
	});

	$('#phone_1, #phone_2, #MobileNumber_1, #MobileNumber_2, #WorkTelephone_1, #WorkTelephone_2, #ExtNo').keyup(function(e) {
		this.value = this.value.replace(/\D/g, '');
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

		if ($('#name').val() == '') {
			add_message($('#name'), 'Please enter Full Name.');
		}

		if ($('#addr1').val() == '') {
			add_message($('#addr1'), 'Please enter Address.');
		}

		if ($('#city').val() == '') {
			add_message($('#city'), 'Please enter City.');
		}

		$('#zip').val($('#zip').val().toUpperCase());
		if ($('#zip').val() == '') {
			add_message($('#zip'), 'Please enter Postal Code.');
		} else if ($('#country').val() == 'CAN' && ! /^[A-Z]\d[A-Z]\s*\d[A-Z]\d$/.test($('#zip').val())) {
			add_message($('#zip'), 'Postal Code is incorrect.');
		}

		if ($('#email').val() == '') {
			add_message($('#email'), 'Please enter Email Address.');
		} else if ( ! /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.[A-Za-z]{2,4}$/.test($('#email').val())) {
			add_message($('#email'), 'Email Address is incorrect.');
		}

		if ($('#phone_1').val() == '' && $('#phone_2').val() == '') {
			add_message($('#phone_1'), 'Please enter Home Phone.');
		} else if ( ! /^[0-9]{3,3}$/.test($('#phone_1').val()) ||  ! /^[0-9]{7,7}$/.test($('#phone_2').val())) {
			add_message($('#phone_1'), 'Home Phone is incorrect.');
		}

		if (message_holder != undefined) {
			alert(message_holder);
			$(focus_object).focus();
			return false;
		} else {
			return true;
		}
	});

	$('input[name=ums_account]').click(function() {
		$('#action_changeaccount').attr('disabled', $(this).parent().has('b').length > 0);
	});
});
</script>

<div class="title"><?=_('Personal Information')?></div>
<?=$gHtml->WriteDivider()?>

<table style="margin-top:20px;" border="0" cellspacing="0" cellpadding="0" <?=($show_switch_statement)? 'width="100%"' : 'width="640px" align="center"'?>>
<tr>
<td>
<div class="form_table">
<form method="post" action="/">
	<label>
		<div><?=_('Full Name')?>:</div>
		<input class="text" type="text" name="name" id="name" value="<?=@$customer['name']?>" />
	</label>
	<label>
		<div><?=_('Language')?>:</div>
		<select class="text" name="Language">
			<option value="E" <?=(@$customer['Language'] == 'E')? 'selected="selected"' : ''?>>English</option>
			<option value="F" <?=(@$customer['Language'] == 'F')? 'selected="selected"' : ''?>>Français</option>
		</select>
	 </label>
	 <label>
		<div><?=_('Address')?>:</div>
		<input class="text" type="text" id="addr1" name="addr1" value="<?=@$customer['addr1']?>" maxlength = "80">
	 </label>
	 <label>
	 	<div><?=_('City')?>:</div>
	 	<input class="text" type="text" id="city" name="city" value="<?=@$customer['city']?>"maxlength = "20">
	 </label>
	 <label>
	 	<div><?=_('Province')?>:</div>
		<select name="state">
			<option value="AB" <?=(@$customer['state']=='AB')? 'selected="selected"' : ''?>><?=_("Alberta")?></option>
			<option value="BC" <?=(@$customer['state']=='BC')? 'selected="selected"' : ''?>><?=_("British Columbia")?></option>
			<option value="MB" <?=(@$customer['state']=='MB')? 'selected="selected"' : ''?>><?=_("Manitoba")?></option>
			<option value="NB" <?=(@$customer['state']=='NB')? 'selected="selected"' : ''?>><?=_("New Brunswick")?></option>
			<option value="NL" <?=(@$customer['state']=='NL')? 'selected="selected"' : ''?>><?=_("Newfoundland")?></option>
			<option value="NT" <?=(@$customer['state']=='NT')? 'selected="selected"' : ''?>><?=_("Northwest Territories")?></option>
			<option value="NS" <?=(@$customer['state']=='NS')? 'selected="selected"' : ''?>><?=_("Nova Scotia")?></option>
			<option value="NU" <?=(@$customer['state']=='NU')? 'selected="selected"' : ''?>><?=_("Nunavut")?></option>
			<option value="ON" <?=(@$customer['state']=='ON')? 'selected="selected"' : ''?>><?=_("Ontario")?></option>
			<option value="PE" <?=(@$customer['state']=='PE')? 'selected="selected"' : ''?>><?=_("Prince Edward Island")?></option>
			<option value="QC" <?=(@$customer['state']=='QC')? 'selected="selected"' : ''?>><?=_("Quebec")?></option>
			<option value="SK" <?=(@$customer['state']=='SK')? 'selected="selected"' : ''?>><?=_("Saskatchewan")?></option>
			<option value="YT" <?=(@$customer['state']=='YT')? 'selected="selected"' : ''?>><?=_("Yukon")?></option>
			
			<option value="AL" <?=(@$customer['state']=='AL')? 'selected="selected"' : ''?>>Alabama</option>
			<option value="AK" <?=(@$customer['state']=='AK')? 'selected="selected"' : ''?>>Alaska</option>
			<option value="AZ" <?=(@$customer['state']=='AZ')? 'selected="selected"' : ''?>>Arizona</option>
			<option value="AR" <?=(@$customer['state']=='AR')? 'selected="selected"' : ''?>>Arkansas</option>
			<option value="CA" <?=(@$customer['state']=='CA')? 'selected="selected"' : ''?>>California</option>
			<option value="CO" <?=(@$customer['state']=='CO')? 'selected="selected"' : ''?>>Colorado</option>
			<option value="CT" <?=(@$customer['state']=='CT')? 'selected="selected"' : ''?>>Connecticut</option>
			<option value="DE" <?=(@$customer['state']=='DE')? 'selected="selected"' : ''?>>Delaware</option>
			<option value="DC" <?=(@$customer['state']=='DC')? 'selected="selected"' : ''?>>District of Columbia</option>
			<option value="FL" <?=(@$customer['state']=='FL')? 'selected="selected"' : ''?>>Florida</option>
			<option value="GA" <?=(@$customer['state']=='GA')? 'selected="selected"' : ''?>>Georgia</option>
			<option value="HI" <?=(@$customer['state']=='HI')? 'selected="selected"' : ''?>>Hawaii</option>
			<option value="ID" <?=(@$customer['state']=='ID')? 'selected="selected"' : ''?>>Idaho</option>
			<option value="IL" <?=(@$customer['state']=='IL')? 'selected="selected"' : ''?>>Illinois</option>
			<option value="IN" <?=(@$customer['state']=='IN')? 'selected="selected"' : ''?>>Indiana</option>
			<option value="IA" <?=(@$customer['state']=='IA')? 'selected="selected"' : ''?>>Iowa</option>
			<option value="KS" <?=(@$customer['state']=='KS')? 'selected="selected"' : ''?>>Kansas</option>
			<option value="KY" <?=(@$customer['state']=='KY')? 'selected="selected"' : ''?>>Kentucky</option>
			<option value="LA" <?=(@$customer['state']=='LA')? 'selected="selected"' : ''?>>Louisiana</option>
			<option value="ME" <?=(@$customer['state']=='ME')? 'selected="selected"' : ''?>>Maine</option>
			<option value="MD" <?=(@$customer['state']=='MD')? 'selected="selected"' : ''?>>Maryland</option>
			<option value="MA" <?=(@$customer['state']=='MA')? 'selected="selected"' : ''?>>Massachusetts</option>
			<option value="MI" <?=(@$customer['state']=='MI')? 'selected="selected"' : ''?>>Michigan</option>
			<option value="MN" <?=(@$customer['state']=='MN')? 'selected="selected"' : ''?>>Minnesota</option>
			<option value="MS" <?=(@$customer['state']=='MS')? 'selected="selected"' : ''?>>Mississippi</option>
			<option value="MO" <?=(@$customer['state']=='MO')? 'selected="selected"' : ''?>>Missouri</option>
			<option value="MT" <?=(@$customer['state']=='MT')? 'selected="selected"' : ''?>>Montana</option>
			<option value="NE" <?=(@$customer['state']=='NE')? 'selected="selected"' : ''?>>Nebraska</option>
			<option value="NV" <?=(@$customer['state']=='NV')? 'selected="selected"' : ''?>>Nevada</option>
			<option value="NH" <?=(@$customer['state']=='NH')? 'selected="selected"' : ''?>>New Hampshire</option>
			<option value="NJ" <?=(@$customer['state']=='NJ')? 'selected="selected"' : ''?>>New Jersey</option>
			<option value="NM" <?=(@$customer['state']=='NM')? 'selected="selected"' : ''?>>New Mexico</option>
			<option value="NY" <?=(@$customer['state']=='NY')? 'selected="selected"' : ''?>>New York</option>
			<option value="NC" <?=(@$customer['state']=='NC')? 'selected="selected"' : ''?>>North Carolina</option>
			<option value="ND" <?=(@$customer['state']=='ND')? 'selected="selected"' : ''?>>North Dakota</option>
			<option value="OH" <?=(@$customer['state']=='OH')? 'selected="selected"' : ''?>>Ohio</option>
			<option value="OK" <?=(@$customer['state']=='OK')? 'selected="selected"' : ''?>>Oklahoma</option>
			<option value="OR" <?=(@$customer['state']=='OR')? 'selected="selected"' : ''?>>Oregon</option>
			<option value="PA" <?=(@$customer['state']=='PA')? 'selected="selected"' : ''?>>Pennsylvania</option>
			<option value="RI" <?=(@$customer['state']=='RI')? 'selected="selected"' : ''?>>Rhode Island</option>
			<option value="SC" <?=(@$customer['state']=='SC')? 'selected="selected"' : ''?>>South Carolina</option>
			<option value="SD" <?=(@$customer['state']=='SD')? 'selected="selected"' : ''?>>South Dakota</option>
			<option value="TN" <?=(@$customer['state']=='TN')? 'selected="selected"' : ''?>>Tennessee</option>
			<option value="TX" <?=(@$customer['state']=='TX')? 'selected="selected"' : ''?>>Texas</option>
			<option value="UT" <?=(@$customer['state']=='UT')? 'selected="selected"' : ''?>>Utah</option>
			<option value="VT" <?=(@$customer['state']=='VT')? 'selected="selected"' : ''?>>Vermont</option>
			<option value="VA" <?=(@$customer['state']=='VA')? 'selected="selected"' : ''?>>Virginia</option>
			<option value="WA" <?=(@$customer['state']=='WA')? 'selected="selected"' : ''?>>Washington</option>
			<option value="WV" <?=(@$customer['state']=='WV')? 'selected="selected"' : ''?>>West Virginia</option>
			<option value="WI" <?=(@$customer['state']=='WI')? 'selected="selected"' : ''?>>Wisconsin</option>
			<option value="WY" <?=(@$customer['state']=='WY')? 'selected="selected"' : ''?>>Wyoming</option>
		</select>
	 </label>
	 <label>
	 	<div><?=_('Country')?>:</div>
		<select class="text" id="country" name="country">
			<option value="CAN" <?=(@$customer['country'] == 'CAN')? 'selected="selected"' : ''?>>Canada</option>
			<option value="USA" <?=(@$customer['country'] == 'USA')? 'selected="selected"' : ''?>>United States</option>
		</select>
	</label>
	<label>
	 	<div><?=_('Postal Code')?>:</div>
	 	<input class="text" type="text" id="zip" name="zip" value="<?=@$customer['zip']?>"maxlength = "7">
	</label>
	
	<label>
	 	<div><?=_('Email Address')?>:</div>
	 	<input class="text" type="text" id="email" name="email" value="<?=@$customer['email']?>" maxlength = "80">
	</label>
	<label>
	 	<div><?=_('Home Phone')?>:</div>
<?php
$phone = preg_replace('/[^0-9]/', '', @$customer['phone']);
?>
	  	+1
	  	(<input type="text" class="text" style="width:40px;display:inline;" id="phone_1" name="phone_1" value="<?=substr($phone, 0, 3)?>" maxlength = "3">) 
	  	<input type="text" class="text" style="width:100px;display:inline;" id="phone_2" name="phone_2" value="<?=substr($phone, 3)?>" maxlength = "7">

	</label>
	<label>
	 	<div><?=_('Cellular Phone')?>:</div>
<?php
$MobileNumber = preg_replace('/[^0-9]/', '', @$customer['MobileNumber']);
?>
	  	+1
	  	(<input type="text" class="text" style="width:40px;display:inline;" id="MobileNumber_1" name="MobileNumber_1" value="<?=substr($MobileNumber, 0, 3)?>" maxlength = "3">)
	  	<input type="text" class="text" style="width:100px;display:inline;" id="MobileNumber_2" name="MobileNumber_2" value="<?=substr($MobileNumber, 3)?>" maxlength = "7">
	</label>
	<label>
	 	<div><?=_('Work Phone')?>:</div>
<?php
$WorkTelephone = preg_replace('/[^0-9]/', '', @$customer['WorkTelephone']);
?>
	  	+1
	  	(<input type="text" class="text" style="width:40px;display:inline;" id="WorkTelephone_1" name="WorkTelephone_1" value="<?=substr($WorkTelephone, 0, 3)?>" maxlength = "3">)
	  	<input type="text" class="text" style="width:100px;display:inline;" id="WorkTelephone_2" name="WorkTelephone_2" value="<?=substr($WorkTelephone, 3)?>" maxlength = "7">
	  	<span style="margin:0 5px 0 10px;font-weight:bold;"><?=_('Ext')?>:</span><input type="text" class="text" style="width:40px;display:inline;" id="ExtNo" name="ExtNo" value="<?=@$customer['ExtNo']?>" maxlength = "5">
	</label>

<?php
if (isset($gUser->has_active_voip) && $gUser->has_active_voip) {
?>
	
	 <div colspan="2" align="left" style="padding-top:15px"><?=_('Please verify your <a href="/?p=911_address" style="color:#e54e00;">E911 address</a> to ensure emergency personnel<br />are sent to the correct address.')?></div>
	
<?php
}
?>

	 <div style="padding:30px 0 30px;">
	 	<center>
	 	<input type="submit" name="action_updatepersonal" value="<?=_('Update')?>">
	 	</center>
	 </div>
</form>
</div>
</td>

<?php
if ($show_switch_statement) {
?>
<td valign="top" style="padding-top:3px;" width="50%">
<form method="post" action="/">
<?php
	if ($customer['BillDestination'] == 'P') {
?>
	<div style="margin-bottom:20px;"><?=_('Currently you are receiving printed statements through the mail. To save <b>$2/month</b> printed statement fee and a tree, you can opt to switch to email statements. Just click on the button below!')?></div>
	<div style="margin-bottom:20px;"><?=_('Please ensure that the email address entered in the <b>Contact Information</b> section of this page is the email address where you wish to receive your statements.')?></div>
	<div style="text-align:center;"><input type="submit" id="action_emailstatement" name="action_emailstatement" value="<?=_('Switch to email statements')?>"></div>
<?php
	} else {
?>
	<div style="margin-bottom:20px;"><?=_('Currently you are receiving both email statements and printed statements. To save <b>$2/month</b> printed statement fee and a tree, you can opt to stop printed statements. Just click on the button below!')?></div>
	<div style="text-align:center;"><input type="submit" id="action_emailstatement" name="action_emailstatement" value="<?=_('Stop printed statements')?>"></div>
<?php
	}		
?>
</form>
</td>
<?php	
}
?>

</tr>
</table>

<?php
if ($gUser->csr_session || $gUser->g_platid == 0) {
?>
<div class="title"><?=_('Change Login Account')?></div>
<?=$gHtml->WriteDivider()?>

<form method="post" action="/">
<table border="0" cellspacing="0" cellpadding="0" align="center">
<tr>
<td id="ums_account_td">
<?php
	foreach ($ums_accounts as $ums_account) {
		if ($ums_account == $gUser->email) {
?>
	<input type="radio" class="radio" value="<?=$ums_account?>" name="ums_account" checked="checked"><?=$ums_account?><br />
<?php
		} else {
?>
	<input type="radio" class="radio" value="<?=$ums_account?>" name="ums_account"><?=$ums_account?><br />
<?php
		}
	}
?>
	<div style="padding:30px 0 30px;">
	 	<center>
	 		<input type="submit" id="action_changeaccount" name="action_changeaccount" value="<?=_('Change')?>" disabled="disabled">
	 	</center>
	 </div>
</td>
</tr>
</table>


</form>
<?php	
}

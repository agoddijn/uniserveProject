<form action='/' method='post'>
	<table border='0' cellspacing='4' cellpadding='0' style='text-align:left;margin:50px auto;'>
		<tr>
			<td><?=($profile['username_type'] == 'DID' || @$_SESSION['is_staging_ip'])? _('Service Phone Number') : _('Email Address');?>:</td>
		</tr>
		<tr>
			<td><input type='text' name='email' style='width:210px;' maxlength='256' value='<?=((($profile['username_type'] == 'DID' || @$_SESSION['is_staging_ip']) && isset($_SESSION['adsl_phone']))? htmlspecialchars($_SESSION['adsl_phone']) : '')?>'/></td>
		</tr>
		<tr>
			<td><?=_('Password');?>:</td>
		</tr>
		<tr>
			<td><input type='password' name='password' style='width:210px;' maxlength='32' autocomplete='off' /></td>
		</tr>
		<tr>
			<td align='center'><input type='hidden' name='auth_profile' value='<?=$profile['id']?>'>
			<input style='margin:25px 0 40px;' type='submit' name='action_login' value='<?=_('Login');?>'/></td>
		</tr>
	</table>
</form>
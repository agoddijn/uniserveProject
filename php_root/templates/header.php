<?php
// Setup the account menu items for the logged in user
$profile = array();

if (@$gUser->redirected != 1) {
	// "Profile" Menu
	if ($gUser->_logged_in()) {
		$profile['account']['title'] = _('Profile');
		$profile['account']['sub_menu'] = array();
		if ($gUser->can_account_settings) {
			$profile['account']['sub_menu']['personal'] = _('Account Settings');
		}
		if($gUser->can_company_settings){
			$profile['account']['sub_menu']['company_settings'] = _('Company Settings');
		}
		if ($gUser->can_change_password > 0) {
			$profile['account']['sub_menu']['loginPassword'] = _('Change Password');
		}
	}
}
	header("Expires: -1");
	header("Cache-Control: no-store, no-cache, must-revalidate, pre-check=0, post-check=0");
	header("X-Frame-Options: SAMEORIGIN");
	if ($gConfig['enable_languages'] == "yes") {
		header("Content-type: text/html; charset=" . $gLang->_charset());
		header("Vary: Accept-Language");
	}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<?php 
	if ($gConfig['enable_languages'] == "yes") {
?>
<html lang="<?=$gLang->_code();?>">
<?php 
	} else {
?>
<html>
<?php 
	} 
?>
	<head>
		<title>
<?php
	echo ($_COOKIE['lang'] == 'fr_CA')? 'Mon compte Uniserve' : 'Uniserve My Account';
?>
		</title>

		<link href="/css/myaccount.css?v=1" rel="stylesheet" type="text/css"/>
		<link rel="shortcut icon" href="favicon.png">
<?php
	if ($gConfig['enable_languages'] == "yes") {
?>
		<meta http-equiv="content-type" content="text/html; charset=<?=$gLang->_charset();?>" />
<?php 
	} else {
?>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
<?php
	} 
?>
		
		<meta http-equiv="imagetoolbar" content="no"/>
		<meta name="mssmarttagspreventparsing" content="true"/>
		<meta name="keywords" content="uniserve, my account, myaccount"/>
		
		<link rel="stylesheet" type="text/css" href="/js_src/jquery-ui-1.11.1/jquery-ui.min.css">
		<script type="text/javascript" src="/js_src/jquery-1.11.1.min.js"></script>
		<script type="text/javascript" src="/js_src/jquery-ui-1.11.1/jquery-ui.min.js"></script>
		<script type="text/javascript">
		/**
		 * Disable Enter key submit form
		 * For a field that uses Enter key, you can add class "enter_key_ok" (class="enter_key_ok") to it
		 */
		function disable_enter_key_submit(){
			$('input:text, input:password, input:checkbox, input:radio').not('.enter_key_ok').keypress(function(e) {
				if (e.which == 13) {
					return false;
				}
			});
		};

		/**
		 * For account menu
		 */
		$(document).ready(function() {
		
			$('#account_ul > li').hover(function(){
				$('a:first', this).addClass('hover');
				$('ul:first', this).show();
			}, function(){
				$('ul:first', this).hide();
				$('a:first', this).removeClass('hover');
			});
		});
		</script>
<?php
if (isset($do_logout)) {
	$do_logout = 0;
?>
		<script language="javascript" type="text/javascript">
			<!--
				parent.location = '/';
			//-->
		</script>
<?php
}

if ($gUser->_logged_in())
	include_once(DIR_BASE . "/js/session_timer.php");

if ( !@$_SESSION['is_staging_ip']) {
	echo $brands['head_close'];
}
?>
	</head>
	<body>
	<!--  Version: <?=ESM_VERSION;?>(<?=ESM_BUILD;?>) -->
	<style>
		label, input { display:block; }
		input.text { margin-bottom:12px; width:95%; padding: .4em; }
		fieldset { padding:0; border:0; margin-top:25px; }
    	</style>
 
<?php
if ( ! isset($hide_title_label)) {
?>


<header>
<!-- Main Header Section -->
<table width="<?=$gConfig['html']['width'];?>" align="center" cellpadding="0" cellspacing="0" border="0">
<tr>
<td class="bg-main" align="left" height="90"  valign="middle">
<a href="http://www.uniserve.com"><img src="/images/uniserve_logo.png"/></a>

</td>


<?php
	if ($gUser->_logged_in()) {
?>
<!-- Display if already Signed In -->
<td>

<!-- Account Menu -->
<ul id="account_ul">
<?php 

foreach ($profile as $key_1 => $value_1) {
	$sub_menu_keys = array_keys($value_1['sub_menu']);
?>
	<li><a href="/?p=<?=(count($value_1['sub_menu']) > 0)? reset($sub_menu_keys) : $key_1?>"><?php echo $gUser->email; if ($gUser->csr_session) {
			echo ' (CSR login) ';
		}?> &nbsp;
<?php
		if (count($value_1['sub_menu']) > 0) {
?>
			   <img src="/images/icons/dropdown_arrow_grey.gif">
<?php
		}
?>
	</a>
<?php
	if (count($value_1['sub_menu']) > 0) {
?>
		<ul>
<?php 
		foreach ($value_1['sub_menu'] as $key_2 => $value_2) {
?>
			 <li><a href="/?p=<?=$key_2?>" class="account_menu"><?=$value_2?></a></li>
<?php
		}
?>
		</ul>
<?php
	}
?>
	</li>
<?php
}

?>
</ul>
<div style="clear:both;"></div>
</td>
<td class="sign_button" align="right">
<script language="javascript" type="text/javascript">
	$(document).ready(function(){
		$( document ).tooltip();
		
		$( "#logout" ).button().on( "click", function() {
		      window.location=('/pages/login.php?action_logout_user');
		});

	});
</script>
<button id="logout">Sign Out</button>
</td>
<?php
	} else {
?>
<!-- Display if not Signed In -->
<td></td>
<td class="sign_button" align="right">
<script language="javascript" type="text/javascript">
	$(document).ready(function(){
		var dialog, form,
			emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
			email = $( "#email" ),
			password = $( "#password" ),
		     	allFields = $( [] ).add( email ).add( password );
		     	tips = $( ".validateTips" );
		function updateTips( t ) {
			tips
				.text( t )
				.addClass( "ui-state-highlight" );
			setTimeout(function() {
				tips.removeClass( "ui-state-highlight", 1500 );
			}, 500 );
		}
		function checkRegexp( o, regexp, n ) {
		      if ( !( regexp.test( o.val() ) ) ) {
		      	      o.addClass( "ui-state-error" );
		      	      updateTips( n );
		      	      return false;
		      } else {
		      	      return true;
		      }
		}
		function checkLength( o, n, min, max ) {
			if ( o.val().length < min ) {
				o.addClass( "ui-state-error" );
				updateTips("You are missing the " + n + ".");
				return false;
			} else if ( o.val().length > max ) {
				o.addClass( "ui-state-error" );
				updateTips("Your " + n + " seems to be longer than possible.");
				return false;
			}  else {
				return true;
			}
		}
		function loginUser() {
			var valid = true;
			allFields.removeClass( "ui-state-error" );
			// Let's build a login function here
			valid = valid && checkLength( email, "Email Address", 1, 80 );
			valid = valid && checkLength( password, "Password", 1, 50);
			//valid = valid && checkRegexp( email, emailRegex, "eg. user@uniserve.com" );
			//valid = valid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
			if ( valid ) {
				var data = form.serialize();
				var data_1 = data.split('&');
				document.forms['login_form'].submit();
			}
			return valid;	
		}
		dialog = $( "#dialog-form" ).dialog({
		      autoOpen: false,
		      height: 280,
		      width: 350,
		      modal: true,
		      buttons: {
			"Login": loginUser,
			Cancel: function() {
			  tips.text("All form fields are required");
			  dialog.dialog( "close" );
			}
		      },
		      close: function() {
			form[ 0 ].reset();
			tips.text("All form fields are required");
			allFields.removeClass( "ui-state-error" );
		      }
		});
		 
		form = dialog.find( "form" ).on( "submit", function( event ) {
		      event.preventDefault();
		      loginUser();
		});
		 
		$( "#login" ).button().on( "click", function() {
		      dialog.dialog( "open" );
		});
		
		$( "#login_lower" ).button().on( "click", function() {
		      dialog.dialog( "open" );
		});
		
		<?php // removed jQuery code for the new_customer button 
		?>

	});
</script>
<!-- Login Form -->
<div id="dialog-form" title="MyAccount Login" style="display:none;">
  <p class="validateTips">All form fields are required.</p>
  <form action='/pages/login.php' id="login_form" name='login_form' method='post'>
    <fieldset>
      <label>Email Address:
      <input type="text" name="email" id="email" class="text ui-widget-content ui-corner-all">
      </label>
      <label>Password:
      <input type="password" name="password" id="password" class="text ui-widget-content ui-corner-all"  autocomplete="off">
      </label>
      <input type="hidden" name="auth_profile" value="5">
      <input type="hidden" name="action_login" value="1">
      <input type="hidden" name="p" value="<?=@$vars['p'];?>">
      <!-- Allow form submission with keyboard without duplicating the dialog button -->
      <input type="submit" class="enter_key_ok" tabindex="-1" style="position:absolute; top:-1000px">
    </fieldset>
  </form>
</div>
<button id="login">Sign In</button>
<div id="dialog"></div>
<!--
<br />
<a href="/?lang=en_CA">English</a>
<a href="/?lang=fr_CA" style="margin-left:30px;">Français</a>
-->
</td>
<?php
	}
?>
</tr>
</table>
</header>
<?php
}
?>

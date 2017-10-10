<?php
//
// If there is an action, include the actions page
//

$vars = array_merge($_GET, $_POST);

if($gMain->test_p_value($vars['p']) == false) {
	header('Location: '. URL_BASE.'/?p=welcome.php');
	exit();
}


foreach($vars as $key => $value) {
		if (preg_match('/^action/', $key) == 1) {
                include_once(DIR_BASE . "/pages/login_actions.php");
                break;
        }
		if (preg_match('/^page/', $key) == 1) {
                list($bunk, $start_at) = explode("_", $key);
        }
}


// Remember redirect URL during login process
if (strpos($_SERVER['REQUEST_URI'], '/pages/') === FALSE && strpos($_SERVER['REQUEST_URI'], 'action_') === FALSE
	 && (preg_match("/\/order\//",$_SERVER['REQUEST_URI']) || preg_match("/\/\?p/",$_SERVER['REQUEST_URI']) )) {
	if (!preg_match("/\/\?p=welcome/",$_SERVER['REQUEST_URI'])) {
		$_SESSION['redirect_url'] = $_SERVER['REQUEST_URI'];
	} else {
		$_SESSION['redirect_url'] = NULL;
	}
}

//
// Include the default page header
// 
include_once(DIR_BASE . "/templates/header.php");
include_once(DIR_BASE . "/templates/menu.php");
?>

<table width="<?=$gConfig['html']['width'];?>" cellpadding="0" cellspacing="0" align="center" border="0">
<tr>
<td class="page">
<?php

/////////////////////////////////////////////////////////////////////////////////////////
// Display Message
/////////////////////////////////////////////////////////////////////////////////////////
$gMessage->display();

// Save parameters from adsl-reg.uniserve.com
if (isset($_GET['adsl_phone'])) {
	$_SESSION['adsl_phone'] = $_GET['adsl_phone'];
}

// No longer showing the login form here as it is in the header
require(DIR_BASE.'/templates/welcome.php'); 

/////////////////////////////////////////////////////////////////////////////////////////
// Footer Template
/////////////////////////////////////////////////////////////////////////////////////////
?>
</td>
</tr>
</table>
<?php
require(DIR_BASE . "/templates/footer.php");
exit();

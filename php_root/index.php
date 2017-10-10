<?php

//
// If there is an action, include the actions page
//
$vars = $_REQUEST;


foreach($vars as $key => $value) {
	if (preg_match('/^action/', $key) == 1) {
       include_once(DIR_BASE . "/pages/actions.php");
       break;
    }
}

/////////////////////////////////////////////////////////////////////////////////////////
// Header Template
////////////////////////////////////////////////////////////////////////////////////////
require(DIR_BASE . "/templates/header.php");

if(!isset($vars['p'])){
	$p = 'welcome';
} else {
	$p = $vars['p'];
}

// initialize some stuff
$file = ''; $page = ''; $module_found = 0;
@list($file, $page) = explode("_", $p, 2);

// Flat out reject everything if we are not logged in.
if (! $gUser->_logged_in() && $p != 'welcome') {
	header ( "Location:" . URL_BASE . "/?p=welcome" );
	exit ();
}

require(DIR_BASE.'/templates/menu.php');

?>

<table width="<?=$gConfig['html']['width'];?>" cellpadding="0" cellspacing="0" align="center" border="0">
<tr>
<td class="page">
<?php
/////////////////////////////////////////////////////////////////////////////////////////
// Display Message
/////////////////////////////////////////////////////////////////////////////////////////
if ($gMessage->waiting()) $gMessage->display();

/////////////////////////////////////////////////////////////////////////////////////////
// Page Display
/////////////////////////////////////////////////////////////////////////////////////////
// load module based location switch files
foreach($modules as $module) {
	if ($module == $file){
		$module_found = 1;
		require(DIR_BASE.'/modules/'.$module.'/location/switch.php');
		break;
	}
}
if (!$module_found){
	require(DIR_BASE.'/pages/main.php');
}

/////////////////////////////////////////////////////////////////////////////////////////
// Footer Template
/////////////////////////////////////////////////////////////////////////////////////////
?>
</td>
</tr>
</table>
<?php
require(DIR_BASE . "/templates/footer.php");

$gDb->Close();

?>

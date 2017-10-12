<?php
/* 
 * Include the menu items for the Monitor module
 * 
 * The array keys will be used to identify the template you associate the menu item to in this manner.
 * The key will be assigned to the 'p' parameter of the site, and the module templates will be called
 * if the 'p' value starts with the module name.  The module name must be the name of the folder the 
 * module is stored in.
 * 
 * e.g. if the key value starts with 'monitor' then the location switch file that will be called is in 
 * 			modules/monitor/location/switch.php
 * 		in that file the 'p' value will be switched based on the string found after 'monitor_'
 * 		at which point the template will be identified after the appropriate data is determined
 * 		**see modules/monitor/location/switch.php 
 */
// Only show menu if there are devices to display
if (count($gUser->devices)> 0) {
	$menu['monitor']['title'] = _('Monitoring');
	$menu['monitor']['sub_menu'] = array();
	
}
?>

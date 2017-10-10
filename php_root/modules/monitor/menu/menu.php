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
	
	// Add sub menu items as needed (max two sub_menu arrays)
	$menu['monitor']['sub_menu']['monitor_level1a']['title'] = _('Level 1A');
	$menu['monitor']['sub_menu']['monitor_level1a']['sub_menu'] = array();
	$menu['monitor']['sub_menu']['monitor_level1a']['sub_menu']['monitor_level2a'] = _('Level 2A');
	$menu['monitor']['sub_menu']['monitor_level1a']['sub_menu']['monitor_level2b'] = _('Level 2B');
	$menu['monitor']['sub_menu']['monitor_level1a']['sub_menu']['monitor_level2c'] = _('Level 2C');
	$menu['monitor']['sub_menu']['monitor_level1b'] = _('Level 1B');
	$menu['monitor']['sub_menu']['monitor_level1c'] = _('Level 1C');
	
	
}
?>

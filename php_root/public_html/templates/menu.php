<?php
/**
 * Generate My Account main menu
 */

/**
 * Find out the services to be displayed
 */
$show_service_array = array();
foreach ($gUser->services_details as $services_type => $service_array) {
	if(is_array($service_array)) {
		foreach ($service_array as $service) {
			if ($service['status_text'] != _('Canceled') && $service['status_text'] != _('Not active')) {
				$show_service_array[$services_type] = TRUE;
			}
		}
	}
}

/**
 * Set menu items
 */
$menu = array();

$menu['welcome']['title'] = _('Home');
$menu['welcome']['sub_menu'] = array();


// if the user is logged in correctly we will load the module menus they can see
if ($gUser->_logged_in()) {
	
	// load module based menu files	
	foreach($modules as $module) {
		include_once(DIR_BASE."/modules/".$module."/menu/menu.php");
	}

	/**
	 * Find current menu
	 * Change current page $p from 'welcome' to $vars['p'] if $vars['p'] exists
	 */
	$current_level_1 = 'welcome';
	$current_level_2 = '';
	$current_level_3 = '';
	
	if (isset($vars['p'])) {
		$page_tmp = isset($other_pages[$vars['p']])? $other_pages[$vars['p']] : $vars['p'];
		if (isset($menu[$page_tmp])) {
			if (count($menu[$page_tmp]['sub_menu']) > 0) {
				$ar_key = array_keys($menu[$page_tmp]['sub_menu']);
				$p = reset($ar_key);
				$current_level_2 = $p;
			} else {
				$p = $vars['p'];
			}
			$current_level_1 = $page_tmp;
		} else {
			foreach ($menu as $key => $value) {
				if (isset($value['sub_menu'][$page_tmp])) {
					$p = $vars['p'];
					$current_level_1 = $key;
					$current_level_2 = $page_tmp;
					break;
				}
				if (is_array($value['sub_menu'])) {
					foreach ($value['sub_menu'] as $key2 => $value2) {
						if (isset($value2['sub_menu'][$page_tmp])) {
							$p = $vars['p'];
							$current_level_1 = $key;
							$current_level_2 = $key2;
							$current_level_3 = $page_tmp;
							break;
						}
					}
				}
			}
		}
	}
}

/**
 * Display the menu
 */

?>
<!--[if lte IE 7]>
<style type="text/css">
#menu_ul ul li {
	display: inline;
	width: 100%;
} 
</style>
<![endif]-->
<script type="text/javascript">
/**
 * For main menu
 */
$(document).ready(function() {
	$('#menu_ul > li').hover(function(){
		$('a:first', this).addClass('hover');
		$('ul:first', this).show();
		if ($('.current_menu:first', this).length == 0) {
			$('img[src*="dropdown_arrow_white"]', this).show();
			$('img[src*="dropdown_arrow_grey"]', this).hide();
		}
	}, function(){
		$('ul:first', this).hide();
		$('a:first', this).removeClass('hover');
		if ($('.current_menu:first', this).length == 0) {
			$('img[src*="dropdown_arrow_white"]', this).hide();
			$('img[src*="dropdown_arrow_grey"]', this).show();
		}
	});
	$('.sub_sub').hover(function(){
		$('ul:first', this).show();
	}, function(){
		$('ul:first', this).hide();
	});

});
</script>

<ul id="menu_ul">
<?php 
foreach ($menu as $key_1 => $value_1) {
?>
<li><a href="/?p=<?=$key_1?>" <?=($key_1 == @$current_level_1)? 'class="current_menu_top"' :''?>><?=$value_1['title']?>
<?php
	if (isset($value_1['sub_menu']) && count($value_1['sub_menu']) > 0) {
		if ($key_1 == $current_level_1) {
?>
<img src="/images/icons/dropdown_arrow_white.gif">
<?php
		} else {
?>
<img src="/images/icons/dropdown_arrow_white.gif" style="display:none;"><img src="/images/icons/dropdown_arrow_grey.gif"><?php
		}
?></a>
<ul>
<?php 
		foreach ($value_1['sub_menu'] as $key_2 => $value_2) {
			if (is_array($value_2)) {
				if (count(@$value_2['sub_menu']) > 0) {
	?>
	<li class="sub_sub"><a href="/?p=<?=$key_2?>" <?=($key_2 == $current_level_2)? 'class="current_menu"' :''?>><?=$value_2['title']?><img src="/images/icons/dropdown_arrow_white.gif"></a>
	<ul>
	<?php
						// Second level sub menu
					foreach ($value_2['sub_menu'] as $key_3 => $value_3) {
?>
		<li><a href="/?p=<?=$key_3?>" <?=($key_3 == $current_level_3)? 'class="current_menu"' :''?>><?=$value_3?></a>
<?php
					}
?>
	</ul>
<?php
				} else { ?>
	<li><a href="/?p=<?=$key_2?>" <?=($key_2 == $current_level_2)? 'class="current_menu"' :''?>><?=$value_2['title']?></a>
<?php
				}
			} else {?>
	<li><a href="/?p=<?=$key_2?>" <?=($key_2 == $current_level_2)? 'class="current_menu"' :''?>><?=$value_2?></a>
<?php
			}
		}
?>
</ul>

<?php
	} else {
?>
</a>
<?php
	}
}
?>
</ul>

<div style="clear:both;"></div>


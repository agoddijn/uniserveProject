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
}

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
});
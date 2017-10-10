<?php
if (isset($_SESSION['display_fibernetics_message'])) {
	$gMessage->_warn->add('fibernetics', _('Your ADSL service has been moved to <a href="http://www.fibernetics.ca/">Fibernetics Corp</a>.'));
	$gMessage->display();
	unset($_SESSION['display_fibernetics_message']);
}
if(!isset($gUser->services_details['load']) || $gUser->services_details['load'] == 1) {
?>
<script type="text/javascript" language="javascript">
	$(document).ready(function() {
		$('a').bind("click.myDisable", function() { return false; });
		$('#service_message').show();
		$('#service_result').hide();
		$.get('/ajax/load_services.php',
			{ load: '<?=$gUser->services_details['load'];?>',
			  allibill: '<?=$_SESSION['brands']['allibill_domain'];?>',
			wholesaler: '<?=$gUser->wholesaler;?>'},
			function(data) {
				$('#service_result').html(data).show();
				$('a').unbind("click.myDisable");
				$('#service_message').hide();
		});
	});
</script>
<?php } ?>

<div class="title">
	<?=_("My Services")?>
</div>

<?=$gHtml->WriteDivider();?>
<?php if ($gUser->wholesaler) { ?>
          	As a wholesaler login your services will not be listed in this interface, but you will be able to make payments and adjust your contact information here.
<?php } elseif ($gUser->csr_session) {  // csr logins COULD show different details if needed
	?>
	<?=sprintf(_("Below is the list of all services associated with the <strong>%s</strong> account"), $gUser->platid); ?>
<?php } else { ?>
	<?=sprintf(_("Below is the list of all services associated with the <strong>%s</strong> account"), $gUser->email); ?>
<?php } ?>
<br/>
<br/>

<?php
if(!isset($gUser->services_details['load']) || $gUser->services_details['load'] == 1) {
?>
	<span id="service_message" style="color:#0000ff;display:none;padding:2px;"><?=_('Loading').' '.$gUser->services_details['count'].' '._('Services ...')?></span>
	<div id="service_result" style="display:none;"></div>
<?php
} else {
	// display the services
	echo "<span>&nbsp;</span>";
	include(DIR_BASE . "/templates/lists_services.php");

}
?>
<br/>

<script language="javascript" type="text/javascript">
	<!--
	
	function _session_refresh() {
		parent.location = '/pages/login.php?action_logout_session';
	}

	setTimeout("_session_refresh()", <?=$gConfig['defaults']['session_timeout'] * 1000;?>);

	//-->
</script>

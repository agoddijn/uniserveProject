<?php

class Messages {

	public $_error;
	public $_warn;
	public $_notice;

	static function &singleton() {
		
		static $gMessage;

		if (!isset($gMessage))
			$gMessage = new Messages;
		
		return $gMessage;
	}

	function __construct() {

		$this->_error = new PMessages("errorbox", "message_error.gif", _("Error"));
		$this->_warn = new PMessages("warnbox", "message_warning.gif", _("Warning"));
		$this->_notice = new PMessages("noticebox", "message_check.gif", _("Notice"));
	}

	function display($_width = NULL) {

		if ($this->_error->waiting())
			$this->_error->draw($_width);

		else if ($this->_warn->waiting())
			$this->_warn->draw($_width);

		else if ($this->_notice->waiting())
			$this->_notice->draw($_width);

		$this->clear();
	}

	function clear() {

		$this->_error->clear();
		$this->_warn->clear();
		$this->_notice->clear();
	}

	function waiting() {
		
		if ( ($this->_error->waiting()) || ($this->_warn->waiting()) || 
			($this->_notice->waiting()) )
			return true;

		return false;
	}		
};

class PMessages {

	//
	// Message
	//
	private $message_list = array();
	private $waiting = false;

	//
	//
	//
	private $_box_class;
	private $_box_image;
	private $_box_alt;

	function __construct($_class, $_image, $_alt) {

		$this->_box_class = $_class;
		$this->_box_image = $_image;
		$this->_box_alt = $_alt;
	}

	//
	// Add a "key => message" to the array
	//
	function add($key, $mess) {
		if ( (isset($key)) && (isset($mess)) )
			$this->message_list[$key] = $mess;
	
		$this->waiting = true;
	}

	//
	// Clears the array
	//
	function clear() {

		unset($this->message_list);
		$this->waiting = false;
	}

	//
	// If we have waiting messages
	//
	function waiting() {
		return $this->waiting;
	}

	//
	// if the given key is listed as a waiting message
	//
	function is_waiting($key) {
		return isset($this->message_list[$key]);
	}

	function out() {
		foreach($this->message_list as $key => $val)
			echo "$val<br/>";
	}

	function draw($_width = NULL) {

		global $gConfig;

		?>
		<table width="<?=($_width)?$_width:$gConfig['html']['width'] - 40;?>%" border="0" cellpadding="4" cellspacing="0" align="center">
			<tr>
				<td style="border:1px solid #cccccc;
				background:#fcf9ec;">
				<table width="100%" border="0" cellpadding="0" cellspacing="0" align="center">
					<tr>
						<td width="70" align="center">
							&nbsp;<img src="/images/<?=$this->_box_image;?>" 
								border="0" alt="" title="<?=$this->_box_alt;?>" width="32" height="32"/>
						</td>
						<td>
							<br/>
							<?php $this->out(); ?>
							<br/>
						</td>
					</tr>
				</table>
				</td>
			</tr>
		</table>
		<br/>
		<?php
	}
};

<?php

//
// Main Library Class.
//
// All the *real* functionality is done in this file, and simply
// included and called from the main.php file. All queries and work
// is done in these functions.
//
class PMain {

	static function &singleton() {

		static $gMain;

		if (!isset($gMain)) {
			$gMain = new PMain;
		}

		return $gMain;
	}


	function http_get ( $_url, $_userid, $_password ) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $_url);
		curl_setopt($ch, CURLOPT_POST, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch, CURLOPT_USERPWD, $_userid.":".$_password );
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt ($ch, CURLOPT_TIMEOUT, 15);
		$ret = curl_exec ($ch);
		curl_close($ch);
		return $ret;
	}

	function http_post ( $_url, $_userid, $_password, $_xml ) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $_url);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, "request=$_xml");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch, CURLOPT_USERPWD, $_userid.":".$_password );
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt ($ch, CURLOPT_TIMEOUT, 15);
		$ret = curl_exec ($ch);
		curl_close($ch);
		return $ret;
	}

	function array_to_xml ($array,$parent_elem_name = 'request'){
		$ans = "<$parent_elem_name>";
		foreach ($array as $key => $value){
			if (is_array($value)){
				$ans .= $this->array_to_xml($value,$key);
			} else {
				$ans .= "<$key>$value</$key>";
			}
		}
		$ans .= "</$parent_elem_name>";
		return $ans;
	}


	function crypt_password( $_password ) {
		$salt  = "";
		for ($i=0; $i<2; $i++) {
			$d=rand(1,30)%2;
			$salt .= $d ? chr(rand(65,90)) : chr(rand(48,57));
		}
		$crypt_password = crypt( $_password, $salt );
		return $crypt_password;
	}

	function test_p_value ($p) {
		if(!isset($p) || trim($p) == '') {
			return true;
		}

		$file = file_get_contents('../pages/main.php', FILE_USE_INCLUDE_PATH);
		$pattern = "/case ['|\"][a-z_0-9]{1,25}['|\"]/";
		preg_match_all($pattern, $file, $found);
		$found = $found[0];

		$pattern = "/\/\/[\s+]case ['|\"][a-z_0-9]{1,25}['|\"]/";
		preg_match_all($pattern, $file, $not_used);
		$not_used = $not_used[0];

		for ($i = 0; $i < sizeof($found); $i++) {
			$found[$i] = str_replace("case ", "", $found[$i]);
			$found[$i] = str_replace("'", "", $found[$i]);
			$found[$i] = str_replace("\"", "", $found[$i]);
		}

		$found = array_values($found);

		for ($i = 0; $i < sizeof($not_used); $i++) {
			$not_used[$i] = str_replace("// case ", "", $not_used[$i]);
			$not_used[$i] = str_replace("'", "", $not_used[$i]);
			$not_used[$i] = str_replace("\"", "", $not_used[$i]);
		}

		for ($i = 0; $i < sizeof($not_used); $i++) {
			for ($j = 0; $j < sizeof($found); $j++) {
				if ($found[$j] == $not_used[$i]) {
					unset($found[$j]);
				}
			}
			$found = array_values($found);
		}

		for ($i = 0; $i < sizeof($found); $i++) {
			if ($p === $found[$i]) {
				return true;
			}
		}
		return false;
	}


}

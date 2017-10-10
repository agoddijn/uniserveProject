<?php

class Base {

	private $listalt;

	static function &singleton() {

		static $gBase;

		if (!isset($gBase)) {
			$gBase = new Base;
		}

		return $gBase;
	}

	function __construct() {
		$this->listalt = 0;
	}
	
	//
	// Return sthe standard english suffix to the given integer
	//
	function NumericSuffix($_int) {
		if ($_int >= 100000)
			return "";

		if ( ($_int >= 10) && ($_int <= 19) )
			return "th";
		else {
			switch($_int % 10) {
				case 1: return "st";
				case 2: return "nd";
				case 3: return "rd";
				default:
					return "th";
			}
		}
	}

	function modten($_num) { 
		if (!is_numeric($_num)) return 0;
	    $dig = $this->toCharArray($_num); 
	    $numdig = sizeof ($dig); 
	    $j = 0; 
	    for ($i=($numdig-2); $i>=0; $i-=2){ 
	        $dbl[$j] = $dig[$i] * 2; 
	        $j++; 
	    }     
	    $dblsz = sizeof($dbl); 
	    $validate =0; 
	    for ($i=0;$i<$dblsz;$i++){ 
	        $add = $this->toCharArray($dbl[$i]); 
	        for ($j=0;$j<sizeof($add);$j++){ 
	            $validate += $add[$j]; 
	        } 
	    $add = ''; 
	    } 
	    for ($i=($numdig-1); $i>=0; $i-=2){ 
	        $validate += $dig[$i]; 
	    } 
	    if (substr($validate, -1, 1) == '0') { return 1;  }
	    else { return 0; }
	}
	
	// takes a string and returns an array of characters 
	
	function toCharArray($input){ 
	    $len = strlen($input); 
	    for ($j=0;$j<$len;$j++){ 
	        $char[$j] = substr($input, $j, 1);     
	    } 
	    return ($char); 
	}

	//
	// Returns an array of dates used on the reports pages
	//
	function DateList($_start = 0) {

		global $gConfig;

		$dates = array();

		for($i=$_start; $i<$gConfig['max_reports_months']; $i++) {
			$dates[date("m-Y", mktime(0, 0, 0, date("m") - $i, 1))] = date("Y-m", mktime(0, 0, 0, date("m") - $i, 1));
		}

		return $dates;
	}
	
	//
	// Returns an array of dates used on the reports pages
	//
	function LDCallsDateList($bill_cycle) {

		global $gConfig;
		

		$dates = array();
		//$dates[date("m-Y", mktime(0, 0, 0, date("m"), 1))] = date("Y-m", mktime(0, 0, 0, date("m"), 1));
		$dates['current'] = 'Current Month';
		if(mktime(0,0,0,date('m'),$bill_cycle,date('Y')) < time()) {
			$dates[date("m-Y")] = date("Y-m");
		}
		for($i=1; $i<$gConfig['max_reports_months']; $i++) {
			$dates[date("m-Y", mktime(0, 0, 0, date("m") - $i, 1))] = date("Y-m", mktime(0, 0, 0, date("m") - $i, 1));
		}

		return $dates;
	}
	
	//
	// Returns an array of dates used on the reports pages
	//
	function DateListDialup($_start = 0) {

		global $gConfig;

		$dates = array();

		for($i=$_start; $i<$gConfig['max_reports_months']; $i++) {
			$dates[mktime(0, 0, 0, date("m") - $i, 1)] = date("Y-m", mktime(0, 0, 0, date("m") - $i, 1));
		}

		return $dates;
	}

	//
	// Set a the current pointer in an array to the given key
	//
	function array_set_current(&$array, $key) {

		reset($array);
		while(current($array)) {
			if(key($array) == $key) {
				break;
			}
			next($array);
		}
	}

	function timer() {

		list($usec, $sec) = explode(" ", microtime());
		return ((float)$usec + (float)$sec);
	}

	function css_reset() {
		$this->listalt = 0;
	}

	function css() {
		if ($this->listalt) {
			$this->listalt = 0;
			return "alt";
		} else {
			$this->listalt = 1;
			return "";
		}
	}

	//
	// Returns a string describing a size (bytes) value (using _div as the
	// divisor so we can do disk size (1024) and k size (1000)
	//
	function SizeString($_in, $_div = 1024) {

		if ($_in >= ($_div * $_div * $_div))
			return sprintf("%d %s", $_in / ($_div * $_div * $_div), _("Gb"));

		else if ($_in >= ($_div * $_div))
			return sprintf("%d %s", $_in / ($_div * $_div), _("Mb"));

		else if ($_in >= ($_div))
			return sprintf("%d %s", $_in / ($_div), _("Kb"));

		return sprintf("%d %s", $_in, _("bytes"));
	}

	//
	// Returns the right image for the given permission/active status
	//
	function AdminPermImage($_status, $_perm) {
		if ($_status == 0) {
			if ($_perm == 1)
				return "pending.gif";
			else
				return "entered.gif";
		} else {
			if ($_perm == 1)
				return "completed.gif";
			else
				return "entered.gif";
		}

	}

	//
	// Reduces a long string to "blahabhah...bhahahah";
	//
	function VisualLimit($_string, $_limit = 100) {

		if ($_limit < 5) return "";

		$max = $_limit - 4;
		$length = strlen($_string);

		if ($length <= $_limit)
			return $_string;

		$left = substr($_string, 0, $max / 2);
		$right = substr($_string, $length - ($max / 2) - 1);

		$out = $left . "..." . $right;

		return $out;
	}

	function Valid($type, &$var, $min = null, $max = null) {

		global $gConfig;

		//
		// If it's not set, return right away
		//
		if ( (!isset($var)) || (strlen($var) == 0) ) { return false; }

		switch($type) {
		
			//
			// Check this var as a normal string
			//
			case TYPE_STRING:
				
				//
				// Strip out the junk
				//
				$this->Clean($var);

				// If there isn't anything left, fail.
				//
				if (strlen($var) == 0) {
					return false;
				}

				if ( (isset($min)) && (strlen($var) < $min) ) {
					return false;
				}
				if ( (isset($max)) && (strlen($var) > $max) ) {
					return false;
				}

			break;
		
			//
			// Check that this var is numeric
			//
			case TYPE_NUM:
				
				$this->Clean($var);

				if (!is_numeric($var)) {
					return false;
				}

				if ( (isset($min)) && ($var < $min) ) {
					return false;
				}
				if ( (isset($max)) && ($var > $max) ) {
					return false;
				}
		
			break;
			
			//
			// Check this var as a e-mail address
			//
			case TYPE_EMAIL:

				// first, validate as a string
				if (!$this->Valid(TYPE_STRING, $var, $min, $max)) { return false; }
		
				// Check that it matches
				if ( ! preg_match('/^[0-9a-zA-Z_\.-]{3,16}@[\.0-9a-zA-Z-]{5,150}$/', $var)) { return false; }	// newer attempt to improve ( UP-699 )

				// Check that this domain has mx records
				list($localpart, $domain) = explode("@", $var);
				$hosts= '';
				if (!getmxrr($domain, $hosts)) { return false; }

			break;


			case TYPE_EMAIL_LIBERAL:
				if (!preg_match("/^[^\s\"@]+@[\w-\.\-]{4,}$/", $var)){ return false; }

                list($localpart, $domain) = explode("@", $var);
                $hosts= '';
                if (!getmxrr($domain, $hosts)) { return false; }

			break;


			//
			// Check this var as a phone number
			//
			case TYPE_PHONE:
				$matches = array();
				if (!preg_match("/^[ ]*[(]{0,1}[ ]*([0-9]{3})[ ]*[)]{0,1}[-\.]{0,1}[ ]*([0-9]{3})[ ]*[-\.]{0,1}[ ]*([0-9]{4})[ ]*$/", $var, $matches))
					return false;

				$var = $matches[1] . "-" . $matches[2] . "-" . $matches[3];

				return $this->Valid(TYPE_STRING, $var, $min, $max);
			break;

			//
			// Make sure this var is in the countries list
			//
			case TYPE_COUNTRY:

				include_once(DIR_BASE . "/config/countries.php");

				if (!isset($gConfig['country_codes'][$var]))
					return false;
			break;

			//
			// Make sure this var is in the timezones list
			//
			case TYPE_TIMEZONE:
				if (!isset($gConfig['zones'][$var]))
					return false;
			break;

			//
			// Make sure this var is in the languages list
			//
			case TYPE_LANGUAGE:
				foreach($gConfig['languages'] as $_id => $_ar) {
					if ($_ar['code'] == $var)
						return true;
				}

				return false;
			break;
	
			//
			// Check a password
			//
			case TYPE_PASSWORD:

				//
				// Validate as a string
				//
				if (!$this->Valid(TYPE_STRING, $var, $min, $max)) {
					return false;
				}

			break;

			//
			// DNS Hostnames
			//
			case TYPE_HOSTNAME:
				$this->Clean($var);
				
				if (!preg_match("/^[a-zA-Z0-9-\.]{2,}$/", $var))
					return false;
			break;

			//
			// IP address
			//
			case TYPE_IP_ADDRESS:
				$this->Clean($var);

				if (!preg_match("/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/", $var))
					return false;
			break;
		
			//
			// Mac Address
			//
			case TYPE_MAC_ADDRESS:
				$this->Clean($var);

				if (!preg_match("/^[0-9a-f]{2}\:[0-9a-f]{2}\:[0-9a-f]{2}\:[0-9a-f]{2}\:[0-9a-f]{2}\:[0-9a-f]{2}$/", $var))
					return false;
			break;

			//
			// Unknown Type
			//
			default:
				return false;
		}

		return true;
	}

	function Clean(&$var) {

		//
		// Strip out the junk
		//
		$var = ltrim($var);
		$var = rtrim($var);
		$var = strip_tags($var);
		$var = preg_replace("/\"/", "", $var);

		return $var;
	}

	//
	// URL Encoding / Decoding Functions
	//
	function encode($var) {
		$var = urlencode($var);
		return $var;
	}
	function decode($var) {
		$var = urldecode($var);
		$var = $this->amp_add($var);
		return $var;
	}

	//
	// Add/Remove the &amp; style ampersand- this is used for XML compatiblitiy
	// (ie- every displayed & should be output as &amp;
	//
	function amp_add($var) {
		$var = $this->amp_remove($var);
		$var = str_replace("&", "&amp;", $var);
		return $var;
	}		
	function amp_remove($var) {
		$var = str_replace("&amp;", "&", $var);
		return $var;
	}		

	//
	// Returns a value for a checkbox
	//
	function CheckBoxValue($var) {
	
		switch($var) {
			case 1:
			case 'T':
			case 't':
			case 'Y':
			case 'y':
				return "true";
				break;
			case 0:
			case 'F':
			case 'f':
			case 'N':
			case 'n':
				return "false";
				break;
			default: 
				return "false";
		}
	}

	//
	// Return a pretty date string for the given
	// number of seconds
	//
	// ie - 1 day, 4 hours, 12 minutes
	//
	function DateString($_stamp, $_short = false) {

		if ($_stamp <= 60)
			return floor($_stamp) . " " . _("secs");

		$string = "";

		//
		// Months
		//
		if ($_short == false) {
			$months = floor($_stamp / 1036800);
			if ($months > 0) {
				$_stamp -= $months * 1036800;
				if ($months > 1)
					$string .= "$months " . _("mons") . " ";
				else
					$string .= "$months " . _("mon") . " ";
			}
		}

		//
		// Days
		//
		$days = floor($_stamp / 86400);
		if ($days > 0) {
			$_stamp -= $days * 86400;
			if ($days > 1)
				$string .= "$days " . _("days") . " ";
			else
				$string .= "$days " . _("day") . " ";
		}

		//
		// Hours/Minutes
		//
		$hours = floor($_stamp / 3600);
		if ($hours > 0) {
			$_stamp -= $hours * 3600;
		
			if ($_short == true) {
				$minutes = floor($_stamp / 60);
				if ($minutes > 0) {
					$_stamp -= $minutes * 60;
					$hours += round($minutes / 60, 1);
				}
			}

			if ($hours > 1)
				$string .= "$hours " . _("hrs") ." ";
			else
				$string .= "$hours " . _("hr") . " ";
		}

		if ( ($_short == false) || ($_stamp < 3600) ) {
			$minutes = floor($_stamp / 60);
			if ($minutes > 0) {
				$_stamp -= $minutes * 60;
				if ($minutes > 1)
					$string .= "$minutes " . _("mins") . " ";
				else
					$string .= "$minutes " . _("min") . " ";
			}
		}

		if ( ($_short == false) || ($_stamp < 60) ) {
			if ($_stamp > 0) {
				if ($_stamp > 1)
					$string .= "$_stamp " . _("secs") . " ";
				else
					$string .= "$_stamp " . _("sec") . " ";
			}
		}




		trim($string);

		return (strlen($string) > 0) ? $string : NULL;
	}

	/**
	 * Convert a number to ordinal.
	 *
	 * @param int $number
	 * @return string
	 */
	function number_to_ordinal($number) {
		$suffix = array(1 => 'st', 2 => 'nd', 3 => 'rd');
		
		if (isset($suffix[(int)substr($number, -1)])) {
			$ordinal = $number.$suffix[(int)substr($number, -1)];
		} else {
			$ordinal = $number.'th';
		}
		
		if (substr($number, -2) == '11' || substr($number, -2) == '12' || substr($number, -2) == '13') {
			$ordinal = $number.'th';
		}
		
		return $ordinal;
	}
	
	function canonicalize_mac ($mac){
		if ((preg_match("/^([0-9a-fA-F]{2}\:){5}[0-9a-fA-F]{2}$/",$mac))
				|| 	(preg_match("/^([0-9a-fA-F]{2}\-){5}[0-9a-fA-F]{2}$/",$mac))
				|| 	(preg_match("/^([0-9a-fA-F]{4}\.){2}[0-9a-fA-F]{4}$/",$mac))
				|| 	(preg_match("/^[0-9a-fA-F]{12}$/",$mac))						){
			$_working = strtolower($mac);
			$_working = preg_replace('/[^0-9a-fA-F]/','',$_working); # drop non-hexdigits
			$_working = substr($_working,0,2) . ':' .
					substr($_working,2,2) . ':' .
					substr($_working,4,2) . ':' .
					substr($_working,6,2) . ':' .
					substr($_working,8,2) . ':' .
					substr($_working,10,2);
			return $_working;
		}
		return $mac;
	} 
	

}

class Duration
{
    /**
     * All in one method
     *
     * @param   int|array  $duration  Array of time segments or a number of seconds
     * @return  string
     */
    function toString ($duration, $periods = null)
    {
        if (!is_array($duration)) {
            $duration = Duration::int2array($duration, $periods);
        }
 
        return Duration::array2string($duration);
    }
 
 
    /**
     * Return an array of date segments.
     *
     * @param        int $seconds Number of seconds to be parsed
     * @return       mixed An array containing named segments
     */
    function int2array ($seconds, $periods = null)
    {        
        // Define time periods
        if (!is_array($periods)) {
            $periods = array (
                    'years'     => 31556926,
                    'months'    => 2629743,
                    'weeks'     => 604800,
                    'days'      => 86400,
                    'hours'     => 3600,
                    'minutes'   => 60,
                    'seconds'   => 1
                    );
        }
 
        // Loop
        $seconds = (float) $seconds;
        foreach ($periods as $period => $value) {
            $count = floor($seconds / $value);
 
            if ($count == 0) {
                continue;
            }
 
            $values[$period] = $count;
            $seconds = $seconds % $value;
        }
 
        // Return
        if (empty($values)) {
            $values = null;
        }
 
        return $values;
    }
 
 
    /**
     * Return a string of time periods.
     *
     * @package      Duration
     * @param        mixed $duration An array of named segments
     * @return       string
     */
    function array2string ($duration)
    {
        if (!is_array($duration)) {
            return false;
        }
 
        foreach ($duration as $key => $value) {
            $segment_name = substr($key, 0, -1);
            $segment = $value . ' ' . _($segment_name); 
 
            // Plural
            if ($value != 1) {
                $segment .= 's';
            }
 
            $array[] = $segment;
        }
 
        $str = implode(', ', $array);
        return $str;
    }
 
}

?>

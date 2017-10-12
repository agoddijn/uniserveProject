<?

function generate_calendar($year, $month, $days = array(), $day_name_length = 3, $month_href = NULL, $first_day = 0, $pn = array()){
	$first_of_month = gmmktime(0,0,0,$month,1,$year);
	#remember that mktime will automatically correct if invalid dates are entered
	# for instance, mktime(0,0,0,12,32,1997) will be the date for Jan 1, 1998
	# this provides a built in "rounding" feature to generate_calendar()

	$day_names = array(); #generate all the day names according to the current locale
	for($n=0,$t=(3+$first_day)*86400; $n<7; $n++,$t+=86400) #January 4, 1970 was a Sunday
		$day_names[$n] = ucfirst(gmstrftime('%A',$t)); #%A means full textual day name

	list($month, $year, $month_name, $weekday) = explode(',',gmstrftime('%m,%Y,%B,%w',$first_of_month));
	$weekday = ($weekday + 7 - $first_day) % 7; #adjust for $first_day
	$title   = htmlentities(ucfirst($month_name)).'&nbsp;'.$year;  #note that some locales don't capitalize month and day names

	#Begin calendar. Uses a real <caption>. See http://diveintomark.org/archives/2002/07/03
	@list($p, $pl) = each($pn); @list($n, $nl) = each($pn); #previous and next links, if applicable
	if($p) $p = '<span class="calendar-prev">'.($pl ? '<a href="'.htmlspecialchars($pl).'">'.$p.'</a>' : $p).'</span>&nbsp;';
	if($n) $n = '&nbsp;<span class="calendar-next">'.($nl ? '<a href="'.htmlspecialchars($nl).'">'.$n.'</a>' : $n).'</span>';
	$calendar = '<table class="calendar">'."\n".
		'<tr><td align = "left" colspan = "2" class = "caption">'.$p.'</td><td colspan="3" class = "caption"><center>'.($month_href ? '<a href="'.htmlspecialchars($month_href).'">'.$title.'</a>' : $title).'</td><td align = "right" colspan = "2" class = "caption">'.$n."</td></tr>\n<tr>";

	if($day_name_length){ #if the day names should be shown ($day_name_length > 0)
		#if day_name_length is >3, the full name of the day will be printed
		foreach($day_names as $d)
			$calendar .= '<th abbr="'.htmlentities($d).'">'.htmlentities($day_name_length < 4 ? substr($d,0,2) : $d).'</th>';
		$calendar .= "</tr>\n<tr>";
	}
	
	$calendar .= '<tr><td colspan = "7"><hr noshade></td></tr>';

	if($weekday > 0) $calendar .= '<td colspan="'.$weekday.'">&nbsp;</td>'; #initial 'empty' days
	for($day=1,$days_in_month=gmdate('t',$first_of_month); $day<=$days_in_month; $day++,$weekday++){
		if($weekday == 7){
			$weekday   = 0; #start a new week
			$calendar .= "</tr>\n<tr>";
		}
		if(isset($days[$day]) and is_array($days[$day]) and !strpos($days[$day][0],'0.0.0')){
			@list($link, $classes, $content) = $days[$day];
			if(is_null($content))  $content  = $day;
			$calendar .= '<td onclick = "javascript:'.$link.'" '.($classes ? ' class="'.htmlspecialchars($classes).'" >' : '><center>').
				$content .'</td>';
		}
		else $calendar .= '<td class = "crossout"><center>'.$day.'</td>';
	}
	if($weekday != 7) $calendar .= '<td colspan="'.(7-$weekday).'">&nbsp;</td>'; #remaining "empty" days

	return $calendar."</tr>\n</table>\n";
}

// This is currently BC holidays, which is a bit dodgy.
//  As far as I know, the purpose of this is to determine when ADSL can be installed.
//	Probably Bell uses different rules, and also there is Family Day in AB/ON.
//	And Quebec is crazy, with JB Day instead of Civic, and Easter Monday instead of Good Friday.
//	So the whole architecture of this function is totally inadequate.  Oh well.
function is_holiday ($date) { 
	switch(date("m d",$date)) {
		case "01 01": // New Year's Day
		case "07 01": // Canada day
		case "11 11": // Rememberance Day
		case "12 25": // Christmas
		case "12 26": // Boxing Day		.. hmn, does Telus/Bell take BDay off?
			return 1; break;
		default:
			break;	
	}
	switch(date("Y m d",$date)){
		case "2009 04 10":	// Good Friday
		case "2010 04 02":	// Good Friday
		case "2011 04 22":	// Good Friday
		case "2012 04 06":	// Good Friday
		case "2013 03 29":	// Good Friday

		case "2009 04 13":	// Easter Monday
		case "2010 04 05":	// Easter Monday		.. does Telus/Bell take this day off?  old code had it in, so I will too.
		case "2011 04 25":	// Easter Monday		.. does Telus/Bell take this day off?  old code had it in, so I will too.
		case "2012 04 09":	// Easter Monday		.. does Telus/Bell take this day off?  old code had it in, so I will too.
		case "2013 04 01":	// Easter Monday		.. does Telus/Bell take this day off?  old code had it in, so I will too.

		case "2009 05 18":	// Victoria Day
		case "2010 05 24":	// Victoria Day
		case "2011 05 23":	// Victoria Day
		case "2012 05 21":	// Victoria Day
		case "2013 05 20":	// Victoria Day

		case "2009 08 03":	// Civic Holiday
		case "2010 08 02":	// Civic Holiday
		case "2011 08 01":	// Civic Holiday
		case "2012 08 06":	// Civic Holiday
		case "2013 08 05":	// Civic Holiday

		case "2009 09 07":	// Labour day
		case "2010 09 06":	// Labour day
		case "2011 09 05":	// Labour day
		case "2012 09 03":	// Labour day
		case "2013 09 02":	// Labour day

		case "2009 10 12":	// Thanksgiving
		case "2010 10 11":	// Thanksgiving
		case "2011 10 10":	// Thanksgiving
		case "2012 10 08":	// Thanksgiving
		case "2013 10 14":	// Thanksgiving
			
			return 1; break;
		default:
			break;	
	}
	return 0;
}


function is_90days ($date) { 
	if (mktime(0,0,0,date('m',$date),date('d',$date),date('Y',$date)) <
			mktime(0,0,0,date('m'),date('d')+90,date('Y')))
		return 1;
	else
		return 0;
}

function less_than_num_days ($date,$num=7) {
	if (mktime(0,0,0,date('m',$date),date('d',$date),date('Y',$date)) >
			mktime(0,0,0,date('m'),date('d')+$num-1,date('Y')))
		return 1;
	else
		return 0;
}

$lead_days=7;
if(isset($_POST['lead_days'])){$lead_days = intval($_POST['lead_days']);}

if ((isset($_POST["year"])) && (isset($_POST["month"]))) {
	$year = $_POST["year"];
	$month = $_POST["month"];
	if ($month == '13') { $month = 1; $year++; }
	if ($month == '0') { $month = 12; $year--; }
}
else {
	// mucked about with this for UP-412, so that when lead_days is positive (including
	//	the 7-day default), and the month/year is unspecified, it opens on the month 
	//	that has the first open day (instead of the current month, which it used to
	//	do even if there are no open days left)
	$start_ts = strtotime("+" . max(0,$lead_days) . " days");
	$year = date('Y',$start_ts);
	$month = date('m',$start_ts);
}

$days = array();

for ($i=0; $i<33; $i++) {
	$str_date = date('Y-F-d', mktime(0,0,0,$month,$i,$year));
	$utc = mktime(0,0,0,$month,$i,$year);
	//if ((date('Y') == $year) && (date('n') <= $month))
		//if (((date('j')+7) <= $i) || (date('n') < $month))
			if ((date('l', $utc) != 'Sunday') && (date('l', $utc) != 'Saturday'))
				if (!is_holiday($utc))
					if ( is_90days ($utc) )
						if ( less_than_num_days ($utc,$lead_days) )
							$days[$i] = array("selectDay('$str_date');","available");
}

$pn = array('&laquo;'=>'javascript:makeCalendar(\'year='.$year.'&month='.($month-1).'&lead_days='.$lead_days.'\')', '&raquo;'=>'javascript:makeCalendar(\'year='.$year.'&month='.($month+1).'&lead_days='.$lead_days.'\')');
echo generate_calendar($year, $month, $days, 3, '', 0, $pn);

?>

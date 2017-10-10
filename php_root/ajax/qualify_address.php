<?php
//
// Qualify Address
//

$data = $_POST;

try {
	$address = new Address(
			$data['street_num'],
			$data['street_name'],
			$data['direction'],
			$data['apt'],
			$data['city'],
			$data['state'],
			$data['zip']);
	$addressCheckable = new AdslAddressCheckable(
			$address,
			'N',
			'PGS',
			PROVIDER_TELUS,
			'1.0',
			'R');
	$avail = new ADSLQualification($addressCheckable);
	$_SESSION['availCheck'] = serialize($avail);
	if ($avail->getAvailabilityCode() == 'Y') {
		echo json_encode(array("result"=>"success", "message"=>"success", "speed"=> $avail->getMaxSpeed(), "code"=>1 ));
	} elseif ($avail->getAvailabilityCode() == 'S' ) {
		echo json_encode(array("result"=>"failed", "message"=>'Address did not directly qualify for' . $avail->getLocType() . ' ' . $avail->getSpeed() . 'Mbps ADSL' . _('service'), "speed"=> 0, "code"=>2));
	} elseif ($avail->getAvailabilityCode() == 'N' ) {  
		echo json_encode(array("result"=>"failed", "message"=>'We were unable to qualify the given address for ADSL service', "speed"=> 0, "code"=>3));
	} else {
		goto err_landing;
	}

} catch (Exception $e) {
err_landing:
echo json_encode(array("result"=>"failed", "message"=>'The qualification attempt failed: ' . $e->getMessage(), "speed"=> 0, "code"=>0, "avail_code"=>''));

}

?>


<?php
include_once(DIR_BASE . "/lib/Shopping_Cart.php");
$data = $_REQUEST;
$cart = &ShoppingCart::singleton();

// We want to update the appropriate cart item, but we need to know what service type it is in order
// to update all the fields we have received here with the correct cart item class.  We will use a combination of 
// service type and item id to know if we are updating tha
$cart->rewind();
while ($cart->valid()) {
	$it = $cart->current();
	$item = $it['item'];
	if (($item->get_id() == $data['item_id']) && ($item->get_service_type() == $data['service_type'])) {
		switch($data['service_type']) {
			case 'DS':
				// Here we go through the available fields and then update the DS item
				// Service Apt
				if ($item->get_service_apt() == '' && $item->validate_field('service_apt', @$data['service_apt'])) {
					$item->set_service_apt(@$data['service_apt']);
				}
				// Service House
				if ($item->get_service_house() == '' && $item->validate_field('service_house', @$data['service_house'])) {
					$item->set_service_house($data['service_house']);
				}
				// Service Address
				if ($item->get_service_address() == '' && $item->validate_field('service_address', @$data['service_address'])) {
					$item->set_service_address($data['service_address']);
				}
				// Service Direction
				if ($item->get_service_direction() == '' && $item->validate_field('service_direction', @$data['service_direction'])) {
					$item->set_service_direction(@$data['service_direction']);
				}
				// Service City
				if ($item->get_service_city() == '' && $item->validate_field('service_city', @$data['service_city'])) {
					$item->set_service_city($data['service_city']);
				}
				// Service Province
				if ($item->get_service_province() == '' && $item->validate_field('service_province', @$data['service_province'])) {
					$item->set_service_province($data['service_province']);
				}
				// Service Country
				if ($item->get_service_country() == '' && $item->validate_field('service_country', @$data['service_country'])) {
					$item->set_service_country($data['service_country']);
				}
				// Service Postal
				if ($item->get_service_postal() == '' && $item->validate_field('service_postal', @$data['service_postal'])) {
					$item->set_service_postal($data['service_postal']);
				}
				// Service Speed
				if ($item->get_service_speed() == '' && $item->validate_field('service_speed', @$data['service_speed'])) {
					$item->set_service_speed($data['service_speed']);
				}
				// Service Location
				if ($item->get_service_location() == '' && $item->validate_field('service_location', @$data['service_location'])) {
					$item->set_service_location($data['service_location']);
				}
				// Service Number
				if ($item->get_service_number() == '' && $item->validate_field('service_number', @$data['service_number'])) {
					$item->set_service_number(@$data['service_number']);
				}
				// Contact Name
				if ($item->get_service_contact_name() == '' && $item->validate_field('service_contact_name', @$data['service_contact_name'])) {
					$item->set_service_contact_name($data['service_contact_name']);
				}
				// Contact Phone
				if ($item->get_service_contact_phone() == '' && $item->validate_field('service_contact_phone', @$data['service_contact_phone'])) {
					$item->set_service_contact_phone($data['service_contact_phone']);
				}
				// Service Class
				if ($item->get_service_class() == '' && $item->validate_field('service_class', @$data['service_class'])) {
					$item->set_service_class($data['service_class']);
				}
				// Service Appointment
				if ($item->get_service_appointment() == '' && $item->validate_field('service_appointment', @$data['service_appointment'])) {
					$item->set_service_appointment($data['service_appointment']);
				}
				// Service Installation Date
				if ($item->get_service_install_date() == '' && $item->validate_field('service_install_date', @$data['service_install_date'])) {
					$item->set_service_install_date($data['service_install_date']);
				}
				echo $item->get_validated();
				break;
				
			case 'VO':
				// Here we go through the available fields and then update the VO item
				// 911_streetnumber
				if ($item->get_service_911_streetnumber() == '' && $item->validate_field('service_911_streetnumber', @$data['service_911_streetnumber'])) {
					$item->set_service_911_streetnumber($data['service_911_streetnumber']);
				}
				// 911_streetname
				if ($item->get_service_911_streetname() == '' && $item->validate_field('service_911_streetname', @$data['service_911_streetname'])) {
					$item->set_service_911_streetname($data['service_911_streetname']);
				}
				// 911_addressType
				if ($item->get_service_911_addressType() == '' && $item->validate_field('service_911_addressType', @$data['service_911_addressType'])) {
					$item->set_service_911_addressType($data['service_911_addressType']);
				}
				// 911_addressTypeNum
				if ($item->get_service_911_addressTypeNum() == '' && $item->validate_field('service_911_addressTypeNum', @$data['service_911_addressTypeNum'])) {
					$item->set_service_911_addressTypeNum($data['service_911_addressTypeNum']);
				}
				// 911_city
				if ($item->get_service_911_city() == '' && $item->validate_field('service_911_city', @$data['service_911_city'])) {
					$item->set_service_911_city($data['service_911_city']);
				}
				// 911_province
				if ($item->get_service_911_province() == '' && $item->validate_field('service_911_province', @$data['service_911_province'])) {
					$item->set_service_911_province($data['service_911_province']);
				}
				// 911_country
				if ($item->get_service_911_country() == '' && $item->validate_field('service_911_country', @$data['service_911_country'])) {
					$item->set_service_911_country($data['service_911_country']);
				}
				// 911_postal
				if ($item->get_service_911_postal() == '' && $item->validate_field('service_911_postal', @$data['service_911_postal'])) {
					$item->set_service_911_postal($data['service_911_postal']);
				}
				// 911_lang
				if ($item->get_service_911_lang() == '' && $item->validate_field('service_911_lang', @$data['service_911_lang'])) {
					$item->set_service_911_lang($data['service_911_lang']);
				}
				
				echo $item->get_validated();
				
				break;
				
			case 'LD':
				
				break;
				
			case 'WH':
				
				break;
				
			case 'DM':
				
				break;
				
			case 'DE':
				
				break;
				
			case 'FX':
				
				break;
				
			default:
				
				break;
			
			
		}

	}
	$cart->next();
}
$cart->save_cart();

?>


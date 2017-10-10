<?php
$data = $_REQUEST;

/**
 * $data['item'] should be the product id from the shopping cart that we wish to remove
 * $item is the CartItem object from the cart
 * Just FYI for clarification
 */
if (isset($data['item'])) {
	if ($gCart->item_exists($data['item'])) {
		$gCart->rewind();
		while ($gCart->valid()) {
			$item = $gCart->current();
			if ($item['item']->get_id() == $data['item']) {
				$gCart->remove_item($item['item']);
				$gCart->save_cart();
				return "done";
			}
			$gCart->next();
		}
	}
}
return 0;

?>


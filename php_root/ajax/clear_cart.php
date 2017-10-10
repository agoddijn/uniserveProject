<?php
// Clear Cart
// this will simply remove all of the objects from the cart 
//
global $gCart;

$gCart->rewind();
while (!$gCart->isEmpty()) {
	$it = $gCart->current();
	$item = $it['item'];
	$gCart->remove_item($item->get_id());
}

?>
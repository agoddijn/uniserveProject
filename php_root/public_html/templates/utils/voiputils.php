<?php
// This file is for formatting functions to be used in templates
//   In particular, it's for voip-formatting functions (vf_XXX)

function vf_formatDID($did){
	if (strlen($did) > 11 || strlen($did) < 10) return $did;
	return (strlen($did)==11?substr($did,0,1)." ":"") . "(" . substr($did,-10,3) . ") " . substr($did,-7,3) . "-" . substr($did,-4);
}


function vf_formatDurationHMS($seconds){
	return sprintf("%3d:%02d:%02d", (int)($seconds/(60*60)), (((int)($seconds/60))%60), $seconds%60);
}

function vf_formatDurationHM($seconds){
	return sprintf("%3d:%02d", (int)($seconds/(60*60)), (((int)($seconds/60))%60));
}



?>


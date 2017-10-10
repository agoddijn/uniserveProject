<?php
// Reset ADSL Qualification
// This will simple remove the $_SESSION values that pertain to adsl qualification
//
unset($_SESSION['adslqualified']);
unset($_SESSION['speed']);
unset($_SESSION['service_apt']);
unset($_SESSION['service_house']);
unset($_SESSION['service_address']);
unset($_SESSION['service_direction']);
unset($_SESSION['service_city']);
unset($_SESSION['service_province']);
unset($_SESSION['service_postal']);

?>
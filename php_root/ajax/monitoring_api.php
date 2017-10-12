

<?php
header("Content-Type: application/json;charset=utf-8");

global $gUser;
global $gConfig;        

//TODO is this good enough to auth? have to go through authentication more
if(isset($gUser->id)){

    $company_recid = $gUser->id;
    $type = $_GET['type'];
    $host = $gConfig['API']['host'];
    $authToken = $gConfig['API']['authtoken'];

    try {

        switch ($type) {
            case 'devices':
                $data = file_get_contents($host . "/api/company/" . $company_recid  . "/devices" . "?authtoken=" . $authToken);                
                break;          
            case 'device':
                $device_recid = $_GET['device_recid'];
                $data = file_get_contents($host . "/api/company/" . $company_recid  . "/device/" . $device_recid . "?authtoken=" . $authToken);
                break;
        }


    } catch (Exception $e) {
        http_response_code(503);
        error_log("monitoring_api.php - API Server did not respond. ");
        $data = json_encode(array('error' => 'Could not access API Server.'));
    }

    if ($data === false) {
        http_response_code(500);        
        error_log("monitoring_api.php - API Server responded with nothing Likely AUTH TOKEN ERROR");
        $data = json_encode(array('error' => 'Could not access API Server.'));      
    }
    
} else {
    $data = array('error' => 'User not logged in.');
}

http_response_code(200);        
header('Content-type: application/json');
echo $data;

?>
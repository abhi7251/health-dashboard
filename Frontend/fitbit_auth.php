<?php
$client_id = "23QD7Q";
$redirect_uri = urlencode("http://localhost/health-dashboard/frontend/fitbit_callback.php"); // match exactly

$scope = "activity heartrate sleep profile"; // add more scopes if needed

$url = "https://www.fitbit.com/oauth2/authorize" .
       "?response_type=code" .
       "&client_id=$client_id" .
       "&redirect_uri=$redirect_uri" .
       "&scope=$scope";

header("Location: $url");
exit();
?>

<?php
require 'apiInfo.php';
 
$url = "https://www.fitbit.com/oauth2/authorize" .
       "?response_type=code" .
       "&client_id=$client_id" .
       "&redirect_uri=$redirect_uri" .
       "&scope=$scope";

header("Location: $url");
exit();
?>

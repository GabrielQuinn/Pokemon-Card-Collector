<?php

function json_response($status, $data) {
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code($status);

    header("Access-Control-Allow-Origin: *");

    $jsonString = json_encode($data);
    header("Content-Length: " . strlen($jsonString));

    // echo $jsonString;
    exit;
}

// Options
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: *");
    header("Access-Control-Allow-Headers: Authorization,Accept, Content-Type, Origin, X-API-KEY"); // API KEY HERE!!!!!!
    header("Access-Control-Allow-Origin: *");
    http_response_code(204);
    exit(0);
}

// Connect DB
require_once "../includes/library.php";
$pdo = connectdb();

// Request Info
$uri = parse_url($_SERVER["REQUEST_URI"]);
define("__BASE__", "/PokemonCardCollector/api/");
$endpoint = str_replace(__BASE__, "", $uri["path"]);
$method = $_SERVER["REQUEST_METHOD"];

// Routes

if (preg_match("/awdasdwadsadwads/", $endpoint)) {
    switch ($method) {
        case "GET":
            json_response(200, "hi");
            break;
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
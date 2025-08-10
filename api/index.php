<?php

function json_response($status, $data) {
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code($status);

    header("Access-Control-Allow-Origin: *");

    $jsonString = json_encode($data);
    header("Content-Length: " . strlen($jsonString));

    echo $jsonString;
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
define("__BASE__", "/backend/api/");
$endpoint = str_replace(__BASE__, "", $uri["path"]);
$method = $_SERVER["REQUEST_METHOD"];

// Routes

if (preg_match("/user\/account/", $endpoint)) {
    switch ($method) {
        case "GET":
            // Get all account info

            $user_name = $_GET["user_name"] ?? "";

            if (empty($user_name)) {
                json_response(200, "Missing Required Data");
            }

            $query = "SELECT user_name, user_pass, user_api, user_creation_date, user_public FROM users
                WHERE user_name = ?";

            $stmt = $pdo->prepare($query);
            $stmt->execute([$user_name]);

            $results = $stmt->fetchAll();

            // TODO: when returning the password, make sure to unhash it

            if (!$results) {
                json_response(200, "No entries found");
            } else {
                json_response(200, $results);
            }

            break;
        case "POST":
            // Create a new user

            // POST variables
            $user_name = $_POST["user_name"] ?? "";
            $user_pass = $_POST["pass_word"] ?? "";

            if (empty($user_name) || empty($user_pass)) {
                json_response(200, "Missing Required Data");
            }

            // TODO: VERIFY THAT THE USERNAME DOES NOT ALREADY EXIST
            
            // Hash the password
            $hash_pass = password_hash($user_pass, PASSWORD_DEFAULT);

            // Generate API key
            $api_key = bin2hex(random_bytes(32));

            $query = "INSERT INTO users (user_name, user_pass, user_api, user_creation_date, user_public) VALUES (?, ?, ?, NOW(), 0)";

            $stmt = $pdo->prepare($query);
            $stmt->execute([$user_name, $hash_pass, $api_key]);

            json_response(204, "");
            break;
        case "PATCH":
            if (preg_match("/^user\/account\/password$/", $endpoint)) {

                // Update password

                $request_data = json_decode(file_get_contents('php://input'), true);
                $new_pass = $request_data["new_pass"] ?? "";
                $api_key = $request_data["api_key"] ?? "";

                if (empty($new_pass) || empty($api_key)) {
                    json_response(200, "Missing Required Data");
                }

                if (!verify_api_key($pdo, $api_key)) {
                    json_response(200, "Invalid API Key");
                }

                $new_hash = password_hash($new_pass, PASSWORD_DEFAULT);

                $query = "UPDATE users SET user_pass = ? WHERE user_api = ?";

                $stmt = $pdo->prepare($query);
                $stmt->execute([$new_hash, $api_key]);

                json_response(204, "");
                break;

            } else if ((preg_match("/^user\/account\/api$/", $endpoint))) {
                // Update API Key
            } else if (preg_match("/^user\/account\/visibility$/", $endpoint)) {
                // Toggle account to public/private
            } else {
                json_response(404, "Endpoint does not exist");
            }
    }
}

function verify_api_key($pdo, $api_key) {
    $query = "SELECT user_id FROM users WHERE user_api = ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$api_key]);

    return $stmt->fetchAll();
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
    hi
</body>
</html>

<?php

function json_response($status, $data) {
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code($status);

    header("Access-Control-Allow-Origin: *");

    $jsonString = json_encode($data);
    header("Content-Length: " . strlen($jsonString));

    echo $jsonString;
    exit(0);
}

// Options
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Accept, Content-Type, Origin, X-API-KEY");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
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

require __DIR__ . "/../vendor/autoload.php";

// Get Pokemon API Key from .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$pokemon_api_key = $_ENV["POKEMON_API_KEY"];

use Pokemon\Pokemon;

Pokemon::Options(['verify' => true]);
Pokemon::ApiKey($pokemon_api_key);

// Routes

if (preg_match("/^user/", $endpoint)) {
    switch ($method) {
        case "GET":

            $user_id = $_GET["user_id"] ?? "";

            validate_data([$user_id]);

            $results;

            if (preg_match("/^user\/account$/", $endpoint)) {
                // Get all account info

                $query = "SELECT user_name, user_api, user_creation_date, user_public FROM users
                    WHERE user_id = ?";

                $stmt = $pdo->prepare($query);
                $stmt->execute([$user_id]);

                $results = $stmt->fetch();

            } else if (preg_match("/^user\/discovery$/", $endpoint)) {
                // Get all public accounts

                $query = "SELECT user_name, user_creation_date FROM users WHERE user_public = 1 AND user_id <> ?";

                $stmt = $pdo->prepare($query);
                $stmt->execute([$user_id]);

                $results = $stmt->fetchAll();

            } else {
                json_response(404, "Endpoint does not exist");
            }

            if (!$results) {
                json_response(200, []);
            } else {
                json_response(200, $results);
            }

            break;
        case "POST":

            if (preg_match("/^user\/account\/create$/", $endpoint)) {
                // Create a new user

                $user_name = $_POST["user_name"] ?? "";
                $user_pass = $_POST["user_pass"] ?? "";

                validate_data([$user_name, $user_pass]);

                // Verify the username does not already exist
                $query = "SELECT user_id FROM users WHERE user_name LIKE ?";

                $stmt = $pdo->prepare($query);
                $stmt->execute([$user_name]);

                if ($stmt->rowCount()) {
                    json_response(200, "Username already exists");
                }
                
                // Hash the password
                $hash_pass = password_hash($user_pass, PASSWORD_DEFAULT);

                // Generate API key
                $api_key = bin2hex(random_bytes(32));

                $query = "INSERT INTO users (user_name, user_pass, user_api, user_creation_date, user_public) VALUES (?, ?, ?, NOW(), 0)";

                $stmt = $pdo->prepare($query);
                $stmt->execute([$user_name, $hash_pass, $api_key]);

                json_response(204, "");
                break;
            } else if (preg_match("/^user\/account\/login$/", $endpoint)) {

                // Get user name and password, find username, check if passwords match, and return user info

                $user_name = $_POST["user_name"] ?? "";
                $user_pass = $_POST["user_pass"] ?? "";

                validate_data([$user_name, $user_pass]);

                // Verify the username exists
                $query = "SELECT user_name, user_pass, user_api FROM users WHERE user_name LIKE ?";

                $stmt = $pdo->prepare($query);
                $stmt->execute([$user_name]);

                if (!$stmt->rowCount()) {
                    json_response(204, "Username does not exist");
                }

                $result = $stmt->fetch();

                if (!password_verify($user_pass, $result["user_pass"])) {
                    json_response(204, "Incorrect password");
                } else {
                    json_response(200, $result["user_api"]); // Return username & apikey
                }
            } else {
                json_response(404, "Endpoint does not exist");
            }
        case "PATCH":

            $api_key = $_SERVER["HTTP_X_API_KEY"] ?? "";

            validate_data([$api_key]);

            if (!verify_api_key($pdo, $api_key)) {
                json_response(200, "Invalid API Key");
            }

            if (preg_match("/^user\/account\/password$/", $endpoint)) {

                // Update password

                $request_data = json_decode(file_get_contents('php://input'), true);

                $new_pass = $request_data["new_pass"] ?? "";

                validate_data([$new_pass]);

                $new_hash = password_hash($new_pass, PASSWORD_DEFAULT);

                $query = "UPDATE users SET user_pass = ? WHERE user_api LIKE ?";

                $stmt = $pdo->prepare($query);
                $stmt->execute([$new_hash, $api_key]);

                json_response(204, "");

            } else if ((preg_match("/^user\/account\/api$/", $endpoint))) {

                // Update API Key

                $new_key = bin2hex(random_bytes(32));

                $query = "UPDATE users SET user_api = ? WHERE user_api LIKE ?";

                $stmt = $pdo->prepare($query);
                $stmt->execute([$new_key, $api_key]);

                $query = "SELECT user_api from users WHERE user_api LIKE ?";

                $stmt = $pdo->prepare($query);
                $stmt->execute([$new_key]);
                $result = $stmt->fetch();

                json_response(200, $result["user_api"]);

            } else if (preg_match("/^user\/account\/visibility$/", $endpoint)) {

                // Toggle account to public/private

                // The api key has already been verified so the query does not need to be prepared and executed
                $query = "SELECT user_public FROM users WHERE user_api LIKE ?";

                $stmt = $pdo->prepare($query);
                $stmt->execute([$api_key]);

                $results = $stmt->fetch();

                if ($results) {
                    $is_public = $results["user_public"];
                    $update_state = $is_public == 0;

                    $query = "UPDATE users SET user_public = ? WHERE user_api LIKE ?";

                    $stmt = $pdo->prepare($query);
                    $stmt->execute([$update_state, $api_key]);

                    json_response(204, []);
                } else {
                    json_response(200, "User data missing");
                }
            } else {
                json_response(404, "Route does not exist");
            }

            break;
        case "DELETE":

            if (preg_match("/^user\/account$/", $endpoint)) {
                
                // Delete user account

                $api_key = $_SERVER["HTTP_X_API_KEY"] ?? "";
                
                verify_api_key($pdo, $api_key);

                $query = "DELETE FROM users WHERE user_api LIKE '{$api_key}'";

                $pdo->query($query);

                json_response(204, "");
                break;
            }
        default:
            json_response(404, "Endpoint does not exist");
            break;
    }
}

else if (preg_match("/^friends$/", $endpoint)) {

    $api_key = $_SERVER["HTTP_X_API_KEY"] ?? "";
            
    if (!verify_api_key($pdo, $api_key)) {
        json_response(200, "Invalid API Key");
    }
    
    switch ($method) {
        case "GET":

            // Get user's friends

            $user_name = $_GET["user_name"] ?? "";

            validate_data([$user_name]);

            $user_id = get_id_from_name($pdo, $user_name);

            $query = "SELECT user_name, user_creation_date FROM connections INNER JOIN users ON connections.user2_id = users.user_id WHERE user1_id = {$user_id}";
            $stmt = $pdo->query($query);

            $results = $stmt->fetchAll();

            if ($results) {
                json_response(200, $results);
            } else {
                json_response(200, []);
            }

            break;
        case "POST":

            // Add friend

            $current_username = $_POST["current_username"] ?? "";
            $new_username = $_POST["new_username"] ?? "";

            validate_data([$current_username, $new_username]);

            $current_id = get_id_from_name($pdo, $current_username);
            $new_id = get_id_from_name($pdo, $new_username);

            $query = "SELECT connection_id WHERE user1_id = ? AND user2_id = ?";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$current_id. $new_id]);

            if ($stmt->rowCount()) {

                // Friend connection already exists

                json_response(200, "User has already been added");
            }

            $query = "INSERT INTO connections (user1_id, user2_id) VALUES ({$current_id}, {$new_id})";
            $pdo->query($query);

            json_response(204, []);

            break;
        case "DELETE":
            
            // Remove friend

            $current_username = $GET["current_username"] ?? "";
            $new_username = $_GET["new_username"] ?? "";

            validate_data([$current_username, $new_username]);

            $current_id = get_id_from_name($pdo, $current_username);
            $new_id = get_id_from_name($pdo, $new_username);

            $query = "DELETE FROM connections WHERE user1_id = {$current_id} AND user2_id = {$new_id})";
            $pdo->query($query);

            json_response(204, "");

            break;
        default:
            json_response(404, "Endpoint does not exist");
            break;
    }
}

else if (preg_match("/^library$/", $endpoint)) {
    switch ($method) {
        case "GET":

            // Get all cards from user gallery

            $user_name = $_GET["user_name"] ?? "";
            $card_name = $_GET["card_name"] ?? "";

            validate_data([$user_name]);

            $user_id = get_id_from_name($pdo, $user_name);

            $where_clause = "";
            $params = [$user_id];

            if (!empty($card_name)) {
                $where_clause = "AND card_name = ?";
                $params[] = $card_name;
            }
            
            $query = "SELECT card_name, card_image, card_rarity FROM cards WHERE card_owner = {$user_id}" . $where_clause;
            $stmt = $pdo->query($query);

            $results = $stmt->fetchAll();

            json_response(200, $results);

            break;
        case "POST":

            // Add card to user's library

            $user_name = $_POST["user_name"] ?? "";
            $card_image = $_POST["card_image"];
            $card_rarity = $_POST["card_rarity"];
            $card_name = $_POST["card_name"] ?? "";

            validate_data([$user_name, $card_image, $card_rarity, $card_name]);

            $user_id = get_id_from_name($pdo, $user_name);

            $query = "INSERT INTO cards (card_owner, card_image, card_rarity, card_name) VALUES (?, ?, ?, ?)";

            $stmt = $pdo->prepare($query);
            $stmt->execute([$user_id, $card_image, $card_rarity, $card_name]);

            json_response(204, "");
            break;
        case "DELETE":

            // Remove card from user's library

            $user_name = $_GET["user_name"] ?? "";
            $card_name = $_GET["card_name"] ?? "";

            validate_data([$user_name, $card_name]);

            $user_id = get_id_from_name($pdo, $user_name);

            $query = "DELETE FROM cards WHERE card_owner = ? AND card_name LIKE ?";

            $stmt = $pdo->prepare($query);
            $stmt->execute([$user_id, $card_name]);

            json_response(204, "");
            break;
    }
}

else if (preg_match("/^cards\/?[0-9]*?$/", $endpoint)) {

    if ($method == "GET") {

        $id = basename($endpoint) ?? "";
        
        $cards = Pokemon::Card()->where(["number" => "1"])->all();

        $cardsArray = array_map(function($card) {
            $card_array = $card->toArray();
            return [
                "name" => $card_array["name"],
                "image" => $card_array["images"]["small"],
                "rarity" => $card_array["rarity"]
            ];
        }, $cards);

        if ($id > 0 && $id < 155) {
            json_response(200, $cardsArray[$id]);
        }

        json_response(200, $cardsArray);
    } else {
        json_response(404, "Endpoint does not exist");
    }
}

function validate_data($data_array) {
    foreach ($data_array as $data) {
        if (empty($data)) json_response(200, "Missing Required Data");
    }
}

function get_id_from_name($pdo, $user_name) {
    $query = "SELECT user_id FROM users WHERE user_name LIKE ?";

    $stmt = $pdo->prepare($query);
    $stmt->execute([$user_name]);

    if (!$stmt->rowCount()) json_response(200, "User does not exist");

    return $stmt->fetch()["user_id"];
}

function verify_api_key($pdo, $api_key) {
    $query = "SELECT user_id FROM users WHERE user_api LIKE ?";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$api_key]);

    return $stmt->rowCount();
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
    <h1>Invalid API Request!</h1>
</body>
</html>

<?php
header("Content-Type: application/json");

require "vendor/autoload.php"; // If using JWT via Firebase\JWT\JWT
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$SECRET_KEY = "NoTimeToBeHackedPlease74540285";

// Get raw POST data
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input["hash"]["email"])) {
    http_response_code(400);
    echo json_encode(["error" => "Email is required"]);
    exit;
}

$email = $input["hash"]["email"];
//$dateRecord = ["month" => date("m"), "year" => date("Y")];

// Generate JWT
$payload = ["hash" => $input["hash"]];
$jwt = JWT::encode($payload, $SECRET_KEY, "HS256");

// Check if the cookie exists
if (isset($_COOKIE['record'])) {
    try {
        $decoded = JWT::decode($_COOKIE['record'], new Key($SECRET_KEY, 'HS256'));
        $decodedArray = json_decode(json_encode($decoded), true); // Convert object to array


        if ($decodedArray['hash']['email'] !== $email) {
            http_response_code(401);
            echo json_encode(["error" => "Mismatch between two emails"]);
            exit;
        }
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid token"]);
        exit;
    }
}

// Set HTTP-only cookie for 30 days
setcookie("record", $jwt, time() + (45 * 24 * 60 * 60), "/", "", true, false);

echo json_encode(["message" => "Token generated successfully"]);
?>
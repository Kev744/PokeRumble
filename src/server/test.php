<?php
require 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

define('SECRET_KEY', 'your_secret_key_here'); // Replace with your actual secret key
define('DATA_FILE', 'dataHistory.json');
define('POKEMON_FILE', 'pokemon.json');

// Read JSON file
function readMyFile($path) {
    return file_exists($path) ? file_get_contents($path) : '[]';
}

// Write JSON file
function writeMyFile($path, $data) {
    file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT));
}

// Generate N Pokémon for the mission
function generateNPokemon($n) {
    $pokemonData = json_decode(file_get_contents(POKEMON_FILE), true);
    $result = [];
    for ($i = 1; $i <= $n; $i++) {
        $filtered = array_filter($pokemonData, fn($p) => $p['gen'] === $i);
        if (!empty($filtered)) {
            $randomPokemon = array_values($filtered)[array_rand($filtered)];
            $result[] = $randomPokemon['id'];
        }
    }
    return $result;
}

// Schedule daily mission (For CRON Job)
function scheduleMission() {
    $data = json_decode(readMyFile(DATA_FILE), true);
    $newMission = generateNPokemon(9);
    $data[] = $newMission;
    writeMyFile(DATA_FILE, $data);
}

// Get today's mission
function getMissionDay() {
    $data = json_decode(readMyFile(DATA_FILE), true);
    $day = count($data) - 1;

    if (!isset($data[$day])) {
        $data[$day] = generateNPokemon(9);
        writeMyFile(DATA_FILE, $data);
    }

    echo json_encode(['message' => $data[$day], 'day' => $day]);
}

// Get mission by day
function getMissionByDay($dayIndex) {
    $data = json_decode(readMyFile(DATA_FILE), true);

    if ($dayIndex >= count($data)) {
        http_response_code(404);
        echo json_encode(['message' => 'Id limit mission day exceeded']);
        return;
    }

    echo json_encode(['message' => $data[$dayIndex]]);
}

// Generate JWT token
function generateToken() {
    $inputData = json_decode(file_get_contents("php://input"), true);
    if (!isset($inputData['hash'])) {
        http_response_code(400);
        echo json_encode(["message" => "Hash value is required."]);
        return;
    }

    $token = $_COOKIE['record'] ?? null;
    $dateRecord = ['month' => date('m'), 'year' => date('Y')];

    if ($token) {
        try {
            $decoded = JWT::decode($token, new Key(SECRET_KEY, 'HS256'));
            if ($decoded->hash->email !== $inputData['hash']['email']) {
                http_response_code(401);
                echo json_encode(["message" => "Not authorized: Only one email is allowed."]);
                return;
            }
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(["message" => "Not authorized: Invalid or expired token."]);
            return;
        }
    }

    $newToken = JWT::encode(['hash' => $inputData['hash'], 'dateRecord' => $dateRecord], SECRET_KEY, 'HS256');

    setcookie("record", $newToken, [
        'httponly' => true,
        'secure' => true,
        'samesite' => 'Strict'
    ]);

    echo json_encode(["message" => "Token generated and cookie set successfully."]);
}

// Route handling
$requestUri = explode('?', $_SERVER['REQUEST_URI'])[0];

if ($requestUri === "/missionDay") {
    getMissionDay();
    exit;
}

if (preg_match('/\/missionDay\/(\d+)/', $requestUri, $matches)) {
    getMissionByDay((int)$matches[1]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $requestUri === "/token") {
    generateToken();
    exit;
}

if (isset($_GET['schedule'])) {
    scheduleMission();
    echo json_encode(['message' => 'Mission scheduled']);
    exit;
}

// Default response for unknown routes
http_response_code(404);
echo json_encode(["message" => "Endpoint not found"]);

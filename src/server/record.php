<?php
header("Content-Type: application/json");

require "vendor/autoload.php"; // If using JWT via Firebase\JWT\JWT
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$SECRET_KEY = "NoTimeToBeHackedPlease74540285";
$path = __DIR__ . "/record.json";


/**
function getTotalPokemonByLang($langId, $listPokemon): int
{
    $langIdParsed = (int)$langId;
    $langName = ($langIdParsed === 0) ? "french_name" : (($langIdParsed === 1) ? "english_name" : "german_name");

    return count(array_filter($listPokemon, function ($x) use ($langName) {
        return array_key_exists($langName, $x);
    }));
}
*/
/**
 * Read JSON file safely
 */
function readMyFile($path) {
    return file_exists($path) ? json_decode(file_get_contents($path), true) : [];
}

/**
 * Write JSON file safely
 */
function writeMyFile($path, $data): void
{
    file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function determineTimer($old_data, $new_data) {
    $new_nbPok = $new_data['nbPok'];
    $old_nbPok = $old_data['nbPok'];

    if ($old_nbPok === $new_nbPok) {
        return min($old_data['timer'], $new_data['timer']);
    }

    return ($old_nbPok < $new_nbPok) ? $new_data['timer'] : $old_data['timer'];
}

$method = $_SERVER['REQUEST_METHOD'];
$data_record = readMyFile($path);




try {

    if($method === "GET") {
        echo json_encode(['message' => $data_record], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit(1);
    }

    if (!isset($_COOKIE['record'])) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized: No token provided"]);
        exit;
    }

    $decoded = JWT::decode($_COOKIE['record'], new Key($SECRET_KEY, 'HS256'));
    $decodedArray = json_decode(json_encode($decoded), true); // Convert object to array

    // 🔥 Fixed: Correct date comparison logic
    /**
    if ($decodedArray['dateRecord']['month'] !== date('m') || $decodedArray['dateRecord']['year'] !== date('Y')) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized: Mismatch between dates"]);
        exit;
    }
    */
    switch ($method) {
        case 'PATCH':

            $patchData = json_decode(file_get_contents("php://input"), true);

            if (!isset($patchData['nickname'])) {
                http_response_code(400);
                echo json_encode(["error" => "Missing required fields"]);
                exit;
            }

            $nb_row = false;
            foreach ($data_record as $index => $object) {
                if ($object['email'] === $decodedArray['hash']['email']) {
                    $nb_row = $index;
                    break;
                }
            }

            if ($nb_row === false) {
                http_response_code(404);
                echo json_encode(["error" => "User not found"]);
                exit;
            }

            $old_data = $data_record[$nb_row];
            $new_data = $decodedArray['hash'];

            $updated_data = [
                "nickname" => $patchData['nickname'],
                "email" => $new_data['email'],
                "lang" => $new_data['langId'],
                "nbPok" => max(
                    $old_data['nbPok'],
                    $new_data['nbPok']
                ),
                "timer" => determineTimer($old_data, $new_data),
                "date" => date('Y-m-d H:i:s'),
            ];

            $data_record[$nb_row] = $updated_data;
            writeMyFile($path, $data_record);

            echo json_encode(["message" => "User record updated"]);
            break;

        case 'POST':

            $postData = json_decode(file_get_contents("php://input"), true);

            if (!isset($postData['nickname'], $postData['email'])) {
                http_response_code(400);
                echo json_encode(["error" => "Missing required fields"]);
                exit;
            }

            $new_data = [
                "nickname" => $postData['nickname'],
                "email" => $decodedArray['hash']['email'],
                "lang" => $decodedArray['hash']['langId'],
                "nbPok" => $decodedArray['hash']['nbPok'],
                "timer" => $decodedArray['hash']['timer'],
                "date" => date('Y-m-d H:i:s')
            ];

            $data_record[] = $new_data;
            writeMyFile($path, $data_record);

            echo json_encode(["message" => "User record added"]);
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Method Not Allowed"]);
            break;
    }

} catch (LogicException $e) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid JWT format"]);
} catch (UnexpectedValueException $e) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid token signature"]);
}

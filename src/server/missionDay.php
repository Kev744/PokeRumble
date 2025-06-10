<?php
header("Content-Type: application/json");

$path = __DIR__ . "/dataHistory.json";

/**
 * Reads JSON file safely.
 */
function readMyFile($path) {
    return file_exists($path) ? json_decode(file_get_contents($path), true) : [];
}

$dataHistory = readMyFile($path);

// Ensure $dataHistory is an array
if (!is_array($dataHistory)) {
    $dataHistory = [];
}

if (isset($day)) {
    $day = intval($day);

    if ($day < 0 || $day >= count($dataHistory)) {
        echo json_encode(["error" => "Invalid day ID"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode(["message" => $dataHistory[$day]], JSON_UNESCAPED_UNICODE);
    exit;
}

// Default response: return the last entry
$lastEntry = end($dataHistory);
echo json_encode([
    "message" => $lastEntry ?: "No data available",
    "day" => count($dataHistory) - 1
], JSON_UNESCAPED_UNICODE);
?>
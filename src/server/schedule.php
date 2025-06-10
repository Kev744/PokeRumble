<?php

header("Content-Type: application/json");

$path = __DIR__ . "/dataHistory.json";

function readMyFile($path) {
    return file_exists($path) ? json_decode(file_get_contents($path), true) : [];
}

function generateNPokemon($n): array
{
    $pokemonData = json_decode(file_get_contents(__DIR__ . "/pokemon.json"), true);
    $selectedPokemons = [];

    for ($i = 1; $i <= $n; $i++) {
        $genPoks = array_values(array_filter($pokemonData, fn($p) => isset($p["gen"]) && $p["gen"] === $i));

        if (!empty($genPoks)) {
            $selectedPokemons[] = $genPoks[array_rand($genPoks)]["id"];
        }
    }
    return $selectedPokemons;
}

$dataHistory = readMyFile($path);

$pokemonDay = generateNPokemon(9);
$dataHistory[] = $pokemonDay;

file_put_contents($path, json_encode($dataHistory, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);

echo json_encode(["message" => "New scheduled mission created", "day" => count($dataHistory) - 1], JSON_UNESCAPED_UNICODE);

?>

<?php

function readMyFile($file) {
    return json_decode(file_get_contents($file), true) ?? [] ;
}

function writeMyFile($path, $data): void
{
    file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}


$data = readMyFile(__DIR__. "/countClicks.json");

$date = date("Y-m-d");

if(!(empty($_SERVER['HTTP_USER_AGENT']) and preg_match('~(bot|crawl)~i', $_SERVER['HTTP_USER_AGENT']))) {


    if (array_key_exists($date, $data)) {
        $data[$date] += 1;
    } else {
        $data[$date] = 1;
    }

    writeMyFile(__DIR__."/countClicks.json", $data);

}

echo json_encode($data, JSON_PRETTY_PRINT);



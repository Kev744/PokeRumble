<?php

require "./server/vendor/autoload.php";

use Translations\TranslationData;
use Translations\TranslationLang;
use Translations\ArrayTranslationData;
use Bramus\Router\Router;

$datas = new ArrayTranslationData([
    // --- App ---
    new TranslationData('appDesc', [
        new TranslationLang("en", "Test your Pokémon knowledge with our fun and fan-made Pokémon image quiz! Guess the Pokémon from pictures, compete in Record mode, and win exclusive rewards. Available in English, French, and German. Play now and prove you're a true Pokémon Master!"),
        new TranslationLang("fr", "Testez vos connaissances Pokémon avec notre quiz communautaire basé sur les images ! Devinez le Pokémon à partir de son apparence, défiez les autres en mode Record, et remportez des récompenses exclusives. Disponible en français, anglais et allemand. Jouez dès maintenant et montrez que vous êtes un vrai dresseur expert !"),
        new TranslationLang("de", "Teste dein Pokémon-Wissen mit unserem unterhaltsamen Fan-Quiz! Errate das Pokémon anhand seines Bildes, tritt im Rekordmodus gegen andere an und gewinne exklusive Belohnungen. Verfügbar auf Deutsch, Englisch und Französisch. Jetzt spielen und beweisen, dass du ein wahrer Pokémon-Meister bist!")
    ]),

    new TranslationData('appTitle', [
        new TranslationLang("en", "Pokémon Image Quiz - Guess the Pokémon!"),
        new TranslationLang("fr", "Quiz Pokémon en Image - Devinez le Pokémon !"),
        new TranslationLang("de", "Pokémon Bilder-Quiz – Errate das Pokémon!")
    ]),
    // --- Stats ---
    new TranslationData('statsDesc', [
        new TranslationLang("en", "A Pokémon quiz website where you guess Pokémon names from images, with additional features inspired by the Pokémon world."),
        new TranslationLang("fr", "Un site de quiz sur les Pokémon où vous devriez deviner le nom du Pokémon à partir d'une image, avec en plus d'autres mini-jeux."),
        new TranslationLang("de", "Eine Pokémon-Quiz-Website, auf der du Pokémon-Namen anhand von Bildern errätst, mit zusätzlichen Funktionen aus der Welt der Pokémon."),
    ]),
    new TranslationData('statsTitle', [
        new TranslationLang("en", "I found {pokemonNbUser} Pokémon out of 1025! Think you can beat me ?"),
        new TranslationLang("fr", "J'ai trouvé {pokemonNbUser} sur 1025 Pokémon possible! Pourras-tu me battre ?"),
        new TranslationLang("de", "Ich habe {pokemonNbUser} von 1025 Pokémon gefunden! Denkst du, du kannst mich schlagen?")
    ]),
    // --- Pokédex ---
    new TranslationData('pokedexDesc', [
        new TranslationLang("en", "All the Pokémon you’ve found are listed here with names and images."),
        new TranslationLang("fr", "Tous les Pokémon que vous avez trouvés sont affichés ici avec leur nom et leur image."),
        new TranslationLang("de", "Alle deine gefundenen Pokémon werden hier mit Namen und Bildern angezeigt.")
    ]),
    new TranslationData('pokedexTitle', [
        new TranslationLang("en", "My Pokédex"),
        new TranslationLang("fr", "Mon Pokédex"),
        new TranslationLang("de", "Mein Pokédex")
    ]),

    // --- Progression ---
    new TranslationData('progressionDesc', [
        new TranslationLang("en", "Track your Pokédex progress sorted by official Pokémon generations."),
        new TranslationLang("fr", "Suivez votre progression Pokédex classée par génération officielle."),
        new TranslationLang("de", "Verfolge deinen Pokédex-Fortschritt nach offizieller Pokémon-Generation sortiert.")
    ]),
    new TranslationData('progressionTitle', [
        new TranslationLang("en", "Progress - My Pokédex by Generation"),
        new TranslationLang("fr", "Progression - Mon Pokédex par génération"),
        new TranslationLang("de", "Fortschritt – Mein nach Generationen anzeigen")
    ]),

    // --- Leaderboard ---
    new TranslationData('leaderboardDesc', [
        new TranslationLang("en", "Top 15 leaderboard for Record Mode: see your ranking, time, and Pokémon discovered."),
        new TranslationLang("fr", "Top 15 du classement pour le mode Record : consultez votre position, votre temps et vos Pokémon découverts."),
        new TranslationLang("de", "Top 15 Rangliste im Rekordmodus – sieh deine Platzierung, Zeit und entdeckte Pokémon.")
    ]),
    new TranslationData('leaderboardTitle', [
        new TranslationLang("en", "Leaderboard - Record Mode Rankings"),
        new TranslationLang("fr", "Classement - Top du mode Record"),
        new TranslationLang("de", "Rangliste – Rekordmodus Bestenliste")
    ]),

    // --- Daily Mission ---
    new TranslationData('dailyMissionDesc', [
        new TranslationLang("en", "Guess 1 Pokémon from each of nine generation daily. Reset around 00:10 (GMT)."),
        new TranslationLang("fr", "Devinez chaque jour un Pokémon de chacune des neuf générations. Réinitialisé vers 00h10 (GMT)."),
        new TranslationLang("de", "Errate jeden Tag ein Pokémon aus jeder der neun Generationen. Wird gegen 00:10 Uhr (GMT) zurückgesetzt.")
    ]),
    new TranslationData('dailyMissionTitle', [
        new TranslationLang("en", "Daily Mission"),
        new TranslationLang("fr", "Mission du jour"),
        new TranslationLang("de", "Tägliche Mission")
    ]),

    // --- About (including tips) ---
    new TranslationData('aboutDesc', [
        new TranslationLang("en", "About the creator, the idea behind the Pokémon quiz, contact details (Twitter & Mail), privacy policy."),
        new TranslationLang("fr", "À propos du créateur, de l'idée du quiz Pokémon, des moyens de contact (Twitter & Mail), de la politique de confidentialité."),
        new TranslationLang("de", "Über den Ersteller, die Idee hinter dem Pokémon-Quiz, Kontaktmöglichkeiten (Twitter & Mail), Datenschutzrichtlinien.")
    ]),
    new TranslationData('aboutTitle', [
        new TranslationLang("en", "About, Contact & Data Policy"),
        new TranslationLang("fr", "À propos, Contact & Politique de données"),
        new TranslationLang("de", "Über, Kontakt & Strategien")
    ])
]);


function htmlsource($lang, $title, $description, $slug): string
{
    return '<html lang="' . $lang . '">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <meta name="theme-color" content="#000000">
            <meta name="title" content="' . $title . '">
            <meta name="description" content= "' . $description . '">
            <link rel="favicon" href="/favicon.ico">
    <link rel="manifest" href="/icons/icons.json">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-WJEETMZT12"></script>
    <script>function gtag(){dataLayer.push(arguments)}
        window.dataLayer=window.dataLayer||[]
        gtag("js",new Date)
        gtag("config","G-WJEETMZT12")</script>
    <title> '. $title .' </title>
    <meta name="twitter:card" content="summary">
    <meta property="og:url" content="https://www.pokerumble.com/' . $slug . '">
    <meta property="og:type" content="website">
    <meta property="og:image" content="https://www.pokerumble.com/static/media/FbLogo.png">
    <meta property="og:image:width" content="756">
    <meta property="og:image:height" content="756">
    <meta property="og:title" content= "' . $title . '">
    <meta property="og:description" content= "' . $description . '">
    <script defer="defer" src="/static/js/main.031f95a9.js"></script>
    <link href="/static/css/main.fa37954e.css" rel="stylesheet">
</head>
<body>
<noscript>You need to enable JavaScript to run this app.</noscript>
<div id="root"></div>
</body>
</html>';
}



// Create a Router
$router = new Router();

$router->get('/', function () {
    $lang =
        $_COOKIE['langName'] ??
        locale_lookup(
        ['en','fr','de'],
        locale_get_primary_language(locale_accept_from_http($_SERVER['HTTP_ACCEPT_LANGUAGE'])),
        true,
        'en');
    header('Location: /'.$lang);
});


$router->mount('/([a-z]{2})', function() use ($router) {

    $router->get('/', function($lang) {
        global $datas;
        $title = $datas->getByKey($lang, "appTitle");
        $description = $datas->getByKey($lang, "appDesc");
        echo htmlsource($lang, $title, $description, $lang);
    });

    $router->get('/(\d+)', function ($lang, $stats) {
        global $datas;
        $title = str_replace('{pokemonNbUser}', $stats, $datas->getByKey($lang, 'statsTitle'));
        $description = $datas->getByKey($lang, 'statsDesc');
        echo htmlsource($lang, $title, $description, $lang.'/'.$stats);
    });

    $router->get('/pokedex', function($lang) {
        global $datas;
        $title = $datas->getByKey($lang, "pokedexTitle");
        $description = $datas->getByKey($lang, "pokedexDesc");
        echo htmlsource($lang, $title, $description, $lang.'/pokedex');
    });

    $router->get('/pokedex-by-generation', function ($lang)  {
        global $datas;
        $title = $datas->getByKey($lang, "progressionTitle");
        $description = $datas->getByKey($lang, "progressionDesc");
        echo htmlsource($lang, $title, $description, $lang.'/pokedex-by-generation');
    });

    $router->get('/leaderboard', function ($lang) {
        global $datas;
        $title = $datas->getByKey($lang, "leaderboardTitle");
        $description = $datas->getByKey($lang, "leaderboardDesc");
        echo htmlsource($lang, $title, $description, $lang.'/leaderboard');
    });

    $router->get('/daily-mission(/\d+)?', function ($lang) {
        global $datas;
        $title = $datas->getByKey($lang, "dailyMissionTitle");
        $description = $datas->getByKey($lang, "dailyMissionDesc");
        echo htmlsource($lang, $title, $description, $lang.'/daily-mission');
    });

    $router->get('/about', function ($lang) {
        global $datas;
        $title = $datas->getByKey($lang, "aboutTitle");
        $description = $datas->getByKey($lang, "aboutDesc");
        echo htmlsource($lang, $title, $description, $lang.'/about');
    });

});

$router->mount('/server', function() use ($router) {
    $router->get('/daily-mission(/\d+)?', function ($id) {
        $day = $id;
        include './server/missionDay.php';
    });

    $router->match('GET|POST|PATCH', '/record', function () {
        include './server/record.php';
    });

    $router->post('/token', function () {
        include "./server/token.php";
    });

    $router->get('/countClicks', function () {
        include './server/countClicks.php';
    });
});

$router->get('.*', function () {
    header('Location: /');
});

$router->run();
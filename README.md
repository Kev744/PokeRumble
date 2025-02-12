# PokeRumble
Web page designed for all users that love Pokemon, you can find here your happiness

Web Architecture 

--- server
  |
  |------ schedule.php (CronTab to add nine Pokemon for dataHistory.json every day at 2 hours)
  |------ missionDay.php (Retrieving Pokemon of dataHistory.json for each missionDay)
  |------ token.php (Generate token composed of {nbPokemon, langId, timer, email} with JWT.io to after decoding it into record.php)
  |------ record.php (contains GET, POST & PATCH as HTTP_REQUEST Method to amend or getting record.json, PATCH is for an user that already has an email)
  |------ record.json (Record data from 'Leaderbord' page)
  ------- dataHistory.json (All id Pokemon from mission day)


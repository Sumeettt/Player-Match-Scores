const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

const app = express();

app.use(express.json());

let db = null;

const dbPath = path.join(__dirname, "cricketMatchDetails.db");

const initiateConnectionBetweenDataAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};

initiateConnectionBetweenDataAndServer();

//API 1 GET
app.get("/players/", async (request, response) => {
  const getQuery = `
        SELECT 
        player_id AS playerId,
        player_name AS playerName
        FROM player_details
    `;
  const playersList = await db.all(getQuery);
  response.send(playersList);
});

//API 2 GET
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getQuery = `
        SELECT 
        player_id AS playerId,
        player_name AS playerName 
        FROM
        player_details 
        WHERE 
            player_id = ${playerId};
    `;

  const playerDetails = await db.get(getQuery);
  response.send(playerDetails);
});

//API 3 PUT
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const requestBody = request.body;
  const { playerName } = requestBody;
  const putQuery = `
    UPDATE 
        player_details 
    SET 
        player_name = '${playerName}'
    WHERE 
    player_id = ${playerId};
  `;
  await db.run(putQuery);
  response.send("Player Details Updated");
});

//API 4 GET
app.get("/matches/:matchId/", async (request, response) => {
  const { matchId } = request.params;
  const getQuery = `
        SELECT 
        match_id AS matchId,
        match,
        year
        FROM
        match_details 
        WHERE 
            match_id = ${matchId};
    `;

  const matchDetails = await db.get(getQuery);
  response.send(matchDetails);
});

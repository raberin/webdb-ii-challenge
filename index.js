const express = require("express");
const knex = require("knex");
const knexConfig = require("./knexfile.js");

const db = knex(knexConfig.development);

const helmet = require("helmet");

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
//SELECT * from roles
server.get("/api/zoos", (req, res) => {
  db("zoos")
    .then(animals => {
      res.status(200).json(animals);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

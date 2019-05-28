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

server.get("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .then(animal => {
      if (animal) {
        res.status(200).json(animal);
      } else {
        res.status(404).json({ message: "animal not found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

server.post("/api/zoos/", (req, res) => {
  db("zoos")
    .insert(req.body, "id")
    .then(ids => {
      db("zoos")
        .where({ id: ids[0] })
        .first()
        .then(animal => {
          res.status(200).json(animal);
        });
    })
    .catch(err => {
      res.status(500).json({ message: "Post unsuccesful" });
    });
});

server.put("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .update(req.body)
    //This put statement return a number
    //If number is > 0 its succesful
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: `${count} records updated` });
      } else {
        res.status(404).json({ message: "animal does not exist" });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "There was an error updating the animal" });
    });
  // update roles
  // res.send("Write code to modify a role");
});

server.delete("/api/zoos/:id", (req, res) => {
  db("zoos")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: `${count} records updated` });
      } else {
        res.status(404).json({ message: "animal does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "There was an error deleting animal" });
    });
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

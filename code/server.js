const express = require('express');
const app = express();
const mongoose = require('mongoose');

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(express.json())

const Game = require('./models/game');

mongoose.connect('mongodb://localhost:27017/boardgames', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Succesfully connected to mongo database");
    })
    .catch(e => {
        console.log("Failed to connect to mongo database. Cause: " + e)
    })

const { Parser } = require('json2csv');
const { fileURLToPath } = require('url');
const fields = [
    "title",
    "description",
    "year",
    "players.min",
    "players.max",
    "duration",
    "age",
    "complexity",
    "designers.0",
    "designers.1",
    "designers.2",
    "categories.0",
    "categories.1",
    "categories.2",
    "categories.3",
    "expansions.0.title",
    "expansions.0.year",
    "expansions.0.rating",
    "expansions.0.duration",
    "expansions.0.designers.0",
    "expansions.0.designers.1",
    "expansions.0.complexity",
    "expansions.1.title",
    "expansions.1.year",
    "expansions.1.rating",
    "expansions.1.duration",
    "expansions.1.designers.0",
    "expansions.1.designers.1",
    "expansions.1.designers.2",
    "expansions.1.complexity",
    "expansions.2.title",
    "expansions.2.year",
    "expansions.2.rating",
    "expansions.2.duration",
    "expansions.2.designers.0",
    "expansions.2.designers.1",
    "expansions.2.designers.2",
    "expansions.2.complexity",
    "expansions.3.title",
    "expansions.3.rating",
    "expansions.3.duration",
    "expansions.3.designers.0",
    "expansions.3.designers.1",
    "expansions.3.complexity",
    "expansions.4.title",
    "expansions.4.year",
    "expansions.4.duration",
    "expansions.4.designers.0",
    "expansions.4.complexity"
];

const opts = { fields };

app.get('/', async (req, res) => {
    const game = req.query;
    const games = await Game.find({ game })

    res.send({games});
});

function openFile(file) {
    const open = require('open');
    open(file);
}

function saveAsJson(data) {
    let fs = require('fs')
    fs.writeFile('data.json', data, function(err, result) {
        if (err) console.log("Failed to download, cause: " + err)
    }) 
    openFile('data.json')
}

app.post('/json', async (req, res) => {
    saveAsJson(JSON.stringify(req.body))
    res.send("Success")
})

function saveAsCsv(data) {
    let fs = require('fs')

    try {
        const parser = new Parser(opts);
        const csv = parser.parse(data);

        fs.writeFile('data.csv', csv, function(err, result) {
            if (err) console.log("Failed to download, cause: " + err)
        }) 

        openFile('data.csv')
      } catch (err) {
        console.error(err);
      }
}

app.post('/csv', async (req, res) => {
    saveAsCsv(req.body)
    res.send("Success")
})

app.listen(3000, () => {
    console.log("Server listening on port 3000")
});

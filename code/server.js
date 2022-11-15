const express = require('express');
const app = express();
const path = require('path');
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
const { request } = require('http');

mongoose.connect('mongodb://localhost:27017/boardgames', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Succesfully connected to mongo database");
    })
    .catch(e => {
        console.log("Failed to connect to mongo database. Cause: " + e)
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/games', async (req, res) => {
    const game = req.query;
    const games = await Game.find({ game })
    res.render('games/index', { games })
})

app.get('/boardgames', function (req, res) {
    request('')
})

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
    res.send("Okay")
})

function saveAsCsv(data) {
    let fs = require('fs')

    let csvArray = [Object.keys(data[0])].concat(data)

    let csvData = csvArray.map(it => {
        Object.values(it).toString()
    }).join('\n')

    console.log(csvData)

    // fs.writeFile('data.csv', data, function(err, result) {
    //     if (err) console.log("Failed to download, cause: " + err)
    // }) 
    // openFile('data.csv')
}

app.post('/csv', async (req, res) => {
    saveAsCsv(req.body)
    res.send("Okay")
})

app.listen(3000, () => {
    console.log("Server listening on port 3000")
});

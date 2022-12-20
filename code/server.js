const express = require('express');
const app = express();
const mongoose = require('mongoose');
const openapi = require('@wesleytodd/openapi')

const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

const oapi = openapi({
    openapi: '3.0.0',
    info: {
        title: 'Boardgames sample app',
        description: 'Sample server for a boardgames app.',
        license: {
            name: "MIT",
            url: "https://github.com/laura-abramovic/board-games/blob/main/LICENSE"
        },
        version: '1.0.0'
    }
})

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(oapi)
app.use('/docs', oapi.swaggerui)

const Game = require('./models/game');

mongoose.connect('mongodb://localhost:27017/boardgames', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Succesfully connected to mongo database");
    })
    .catch(e => {
        console.log("Failed to connect to mongo database. Cause: " + e)
    })

const {
    Parser
} = require('json2csv');
const {
    fileURLToPath
} = require('url');
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

const opts = {
    fields
};

app.get('/', async (req, res) => {
    const game = req.query;
    const games = await Game.find({
        game
    })

    res.send({
        games
    });
});

function openFile(file) {
    const open = require('open');
    open(file);
}

function saveAsJson(data) {
    let fs = require('fs')
    fs.writeFile('data.json', data, function (err, result) {
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

        fs.writeFile('data.csv', csv, function (err, result) {
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

// ============================ Open API ============================

const gameSchema = {
    type: "object",
    properties: {
        _id: { type: "string" },
        title: { type: "string" },
        description: { type: "string" },
        year: { type: "number" },
        rating: { type: "number" },
        players: {
            type: "object",
            properties: {
                min: { type: "number" },
                max: { type: "number" }
            }
        },
        duration: { type: "number" },
        age: { type: "number" },
        complexity: { type: "number" },
        designers: {
            type: "array",
            items: { type: "string" }
        },
        categories: {
            type: "array",
            items: { type: "string" }
        },
        expansions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    year: { type: "number" },
                    rating: { type: "number" },
                    duration: { type: "number" },
                    complexity: { type: "number"  },
                    designers: {
                        type: "array",
                        items: { type: "string" }
                    },
                }
            }
        }
    }
}

// ================== Get all games ==================
app.get('/games', oapi.path({
    summary: "Get all games",
    description: "Endpoint that returns list of all games",
    responses: {
        200: {
            description: "Successful",
            content: {
                'application/json': {
                    schema: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: { gameSchema }
                        }
                    }
                }
            }
        }
    }
}), async (req, res) => {
    const game = req.query;
    const games = await Game.find({
        game
    })
    res.status(200).send({
        games
    });
})

// ================== Get game by id ==================
app.get('/games/:gameId', oapi.path({
    summary: "Get a game by ID",
    description: "Endpoint that retuns game with the id of gameId parameter",
    responses: {
        200: {
            description: "Successful",
            content: {
                'application/json': {
                    schema: {
                        type: "object",
                        properties: { gameSchema }
                    }
                }
            }
        },
        404: {
            description: "Client error",
            content: {
                'application/json': {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }
    }
}), async (req, res) => {
    const reqGame = req.query
    const games = await Game.find({
        reqGame
    })

    let game = null

    games.forEach(g => {
        if (g._id.valueOf() == req.params.gameId) {
            game = g
        }
    })

    if (game == null) {
        res.status(404).send({
            "message": "Game with id " + req.params.gameId + " does not exist"
        })
    } else {
        res.status(200).send({
            game
        })
    }
})

// ================== Get categories ==================
app.get('/categories', oapi.path({
    summary: "Get all categories",
    description: "Endpoint that returns list of all game categories.",
    responses: {
        200: {
            description: "Successful",
            content: {
                'application/json': {
                    schema: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                }
            }
        }
    }
}), async (req, res) => {
    const reqGame = req.query
    const games = await Game.find({
        reqGame
    })

    let cat = new Set
    games.forEach(g => {
        g.categories.forEach(c => {
            cat.add(c)
        })
    })

    let categories = Array.from(cat).sort()
    res.send({
        categories
    })
})

// ================== Get designers ==================
app.get('/designers', oapi.path({
    summary: "Get all designers",
    description: "Endpoint that returns list of all designers.",
    responses: {
        200: {
            description: "Successful",
            content: {
                'application/json': {
                    schema: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                }
            }
        }
    }
}), async (req, res) => {
    const reqGame = req.query
    const games = await Game.find({
        reqGame
    })

    let des = new Set
    games.forEach(g => {
        g.designers.forEach(d => {
            des.add(d)
        })
    })

    let designers = Array.from(des).sort()
    res.send({
        designers
    })
})

// ================== Get expansion by id ==================
app.get('/games/expansions/:expansionId', oapi.path({
    summary: "Get an expansion by ID",
    description: "Endpoint that retuns expansion with the id of expansionId parameter",
    responses: {
        200: {
            description: "Successful",
            content: {
                'application/json': {
                    schema: { 
                        type: "object",
                         properties: {
                            title: { type: "string" },
                            year: { type: "number" },
                            rating: { type: "number" },
                            duration: { type: "number" },
                            complexity: { type: "number"  },
                            designers: {
                                type: "array",
                                items: { type: "string" }
                            },
                        }
                     }
                }
            }
        },
        404: {
            description: "Client error",
            content: {
                'application/json': {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }
    }
}), async (req, res) => {
    const reqGame = req.query
    const games = await Game.find({
        reqGame
    })

    let expansion = null

    games.forEach(g => {
        g.expansions.forEach(e => {
            if (e._id.valueOf() == req.params.expansionId) {
                expansion = e
            }
        })
    })

    if (expansion == null) {
        res.status(404).send({
            "message": "Expansion with id " + req.params.expansionId + " does not exist"
        })
    } else {
        res.status(200).send({
            expansion
        })
    }
})

// ================== Add game ==================
app.post('/games', oapi.path({
    summary: "Add game to list of games",
    description: "Endpoint that adds game to games",
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: "object",
                    properties: { gameSchema }
                }
            }
        }
    },
    responses: {
        200: {
            description: "Successful",
            content: {
                'application/json': {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        },
        400: {
            description: "Client error",
            content: {
                'application/json': {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }
    }
}), async (req, res) => {
    let body = req.body

    let title = body.title
    let year = body.year
    let rating = body.rating
    let players = body.players

    if (title == undefined) {
        res.status(400).send({
            "message": "Adding game failed. Cause: missing game parameter title."
        })
    } else if (year == undefined) {
        res.status(400).send({
            "message": "Adding game failed. Cause: missing game parameter year."
        })
    } else if (rating == undefined) {
        res.status(400).send({
            "message": "Adding game failed. Cause: missing game parameter rating."
        })
    } else if (players == undefined) {
        res.status(400).send({
            "message": "Adding game failed. Cause: missing game parameter players."
        })
    } else {
        let game = new Game(req.body)
        await game.save()
        res.status(200).send({
            "message": "Game added"
        })
    }
})

// ================== Update game ==================
app.put('/games/:gameId', oapi.path({
    summary: "Update game",
    description: "Endpoint to update game.",
    requestBody: {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: "object",
                    properties: { gameSchema }
                }
            }
        }
    },
    responses: {
        200: {
            description: "Successful",
            content: {
                'application/json': {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        },
        400: {
            description: "Client error",
            content: {
                'application/json': {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }
    }
}), async (req, res) => {
    let body = req.body

    let title = body.title
    let year = body.year
    let rating = body.rating
    let players = body.players

    if (title == undefined) {
        res.status(400).send({
            "message": "Update failed. Cause: missing game parameter title."
        })
    } else if (year == undefined) {
        res.status(400).send({
            "message": "Update failed. Cause: missing game parameter year."
        })
    } else if (rating == undefined) {
        res.status(400).send({
            "message": "Update failed. Cause: missing game parameter rating."
        })
    } else if (players == undefined) {
        res.status(400).send({
            "message": "Update failed. Cause: missing game parameter players."
        })
    } else {
        await Game.findByIdAndUpdate(req.params.gameId, req.body)
        res.status(200).send({
            "message": "Game updated"
        })
    }
})

// ================== Delete game ==================
app.delete('/games/:gameId', oapi.path({
    summary: "Delete game",
    description: "Endpoint to delete game from list of games.",
    responses: {
        200: {
            description: "Successful",
            content: {
                'application/json': {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        },
        400: {
            description: "Client error",
            content: {
                'application/json': {
                    schema: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string"
                            }
                        }
                    }
                }
            }
        }
    }
}), async (req, res) => {
    const reqGame = req.query
    const games = await Game.find({
        reqGame
    })

    let game = null

    games.forEach(g => {
        if (g._id.valueOf() == req.params.gameId) {
            game = g
        }
    })

    if (game == null) {
        res.status(400).send({
            "message": "Game with id " + req.params.gameId + "does not exist."
        })
    } else {
        await Game.findByIdAndDelete(req.params.gameId)
        res.status(200).send({
            "message": "Game deleted"
        })
    }
})

app.listen(3000, () => {
    console.log("Server listening on port 3000")
});

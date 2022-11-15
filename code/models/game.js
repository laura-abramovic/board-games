const mongoose = require('mongoose');

const playersSchema = new mongoose.Schema({
    min: Number,
    max: Number
});

const expansionSchema = new mongoose.Schema({
    title: String,
    year: Number,
    rating: Number,
    duration: Number,
    designers: [String],
    complexity: Number
})

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    year: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    players: playersSchema,
    duration: Number,
    age: Number,
    complexity: Number, 
    designers: [String],
    categories: [String],
    expansions: [expansionSchema]
});

const Game = mongoose.model('Game', gameSchema)
module.exports = Game;
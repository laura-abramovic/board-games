# board-games

***

A board games dataset.

### About

***

**Author:** Laura Abramović<br>
**Version:** 1.0<br>
**Language**: English<br>

### Content

***

`games.csv` - CSV distribution of games dataset<br>
`games.json` - JSON distribution of games dataset<br>
`export.sh` - a script for exporting dataset to `json` and `csv` format<br>
`dump` - directory which contains a database dump

### Dataset description

***

A dataset contains info about multiple board games. Every game attribute is described in a table below. Attributes which are type of object or array of objects are described in their own tables. Each attribute represents a key in `json` dataset file.<br>

#### Game

| Field | Description | Datatype |
| ----------- | ----------- | ----------- |
| title | Title of the board game | string
| description | A short description of the game | string
| year | The year in which a game was made | numeric
| rating | Average rating of a game on a scale from 1 to 10 | numeric
| players | Number of players required to play the game | players object
| duration | Average playing time in minutes | numeric
| age | Minimum age required to play the game | numeric
| complexity | Average rating of a game complexity on a scale from 1 to 5 | numeric
| designers | A list of people who designed the game | array of strings
| categories | A list of categories/genres of the game | array of strings
| expansions | A list of expansions for the game | array of expansion objects

#### Players

| Field | Description | Datatype |
| ----------- | ----------- | ----------- |
| min | Minimum number of players required to play the game | numeric
| max | Maximum number of players required to play the game | numeric

#### Expansion

| Field | Description | Datatype |
| ----------- | ----------- | ----------- |
| title | Title of the expansion | string
| year | A year in which expansion was made | numeric
| rating | Average rating of the expansion on a scale from 1 to 10 | numeric
| duration | Average playing time of a game with the expansion in minutes | numeric
| designers | A list of people who designed the expansion | array of strings
| complexity | Average rating of a game complexity with the expansion on a scale from 1 to 10 | numeric

### License

***

This repository and all of its content is free to use within the 
[MIT](https://github.com/laura-abramovic/board-games/blob/main/LICENSE)
license.
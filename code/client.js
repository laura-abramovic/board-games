const datatable = document.getElementById('games_table_body')

const searchField = document.getElementById('search_field')
const searchButton = document.getElementById('search_button')
const clearSearchButton = document.getElementById('clear_seach')
const fieldSelector = document.getElementById('field_select')

const jsonExportButton = document.getElementById('btn_json')
const csvExportButton = document.getElementById('btn_csv')

let filteredValues = []

fetch('http://localhost:3000/')
    .then((res) => {
        res.json().then((body) => {
            renderPage(body)
        })
    })
    .catch((e) => {
        console.log("Failed to load. Cause: " + e)
    })

function exportData(data, format) {
    fetch('http://localhost:3000/' + format, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        console.log("Succefully exported data as " + format.toUpperCase())
    }).catch(e => {
        console.log("Failed to export as " + format.toUpperCase() + ". Cause: " + e)
    })
}

function renderPage(body) {
    let games = body.games
    filteredValues = games

    renderTable(games)

    searchButton.addEventListener('click', () => {
        onSearchClick(games)
    })

    clearSearchButton.addEventListener('click', () => {
        searchField.value = ''
        filteredValues = games
        renderTable(games)
    })

    jsonExportButton.addEventListener('click', () => {
        exportData(filteredValues, 'json')
    })

    csvExportButton.addEventListener('click', () => {
        exportData(filteredValues, 'csv')
    })
}

function renderTable(games) {
    var t = "";

    for (let i = 0; i < games.length; i++) {
        let game = games[i]

        var tr = "<tr>";
        tr += tableData(game.title)
        tr += tableData(game.description);
        tr += tableData(game.year);
        tr += tableData(game.rating);
        tr += tableData(game.players.min + " - " + game.players.max);
        tr += tableData(game.duration + " min");
        tr += tableData(game.age + "+");
        tr += tableData(game.complexity + "/5");
        tr += tableData(game.designers);
        tr += tableData(game.categories);
        tr += tableData(game.expansions.map(e => e.title));
        tr += "</tr>";
        t += tr;
    }

    datatable.innerHTML += t
}

function tableData(data) {
    return "<td>" + data + "</td>"
}

function onSearchClick(games) {
    let query = searchField.value
    let selector = fieldSelector.options[fieldSelector.selectedIndex].text

    let filtered = games.filter(game => {
        let value = getSelectedValues(game, selector)
        return value.toString().toLowerCase().includes(query.toLowerCase())
    })

    datatable.innerHTML = ""
    filteredValues = filtered
    renderTable(filtered)
}

function getSelectedValues(game, selector) {
    let value = ""

    switch (selector) {
        case "All fields (wildcard)":
            value = game.title + game.description + game.year + game.rating + game.players + game.duration + game.age + game.complexity + game.designers + game.categories + game.expansions
            break;
        case "Title":
            value = game.title
            break;
        case "Description":
            value = game.description
            break;
        case "Year":
            value = game.year
            break;
        case "Rating":
            value = game.rating
            break;
        case "Players":
            value = game.players.min + " - " + game.players.max
            break;
        case "Playing time":
            value = game.duration
            break;
        case "Age":
            value = game.age + "+"
            break;
        case "Complexity":
            value = game.complexity + "/5"
            break;
        case "Designers":
            value = game.designers
            break;
        case "Categories":
            value = game.categories
            break;
        case "Expansions":
            value = game.expansions.map(e => e.title)
            break;
    }

    return value
}
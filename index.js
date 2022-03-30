//Global Variables
const BASE_URL = "https://ghibliapi.herokuapp.com/films"
const LOCAL_URL = "http://localhost:3000"
const sidebar = document.querySelector("#list-panel")
const display = document.querySelector("#show-panel")
const wButton = document.querySelector("#watchlist")
const fButton = document.querySelector("#favslist")

//Startup routine
document.addEventListener("DOMContentLoaded", () => {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(data => data.forEach(film => getFilms(film))
        )
        .catch(error => {
            alert("Failed to load list of films, check your internet connection and refresh to try again.");
            console.log(`Failed to fetch data from ${BASE_URL}.`)
        })
})

//Event Listeners
sidebar.addEventListener("click", displayFilm)
wButton.addEventListener("click", displayList)
fButton.addEventListener("click", displayList)
//Delete functionality
document.addEventListener("click", (e) => {
    if (e.target.className === "delete") {
        fetch(LOCAL_URL + `${e.target.id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(res => {
                e.target.parentElement.remove()
            })
    }
})

//Callback functions
//DOMContentLoaded callback
function getFilms(film) {
    const pElement = document.createElement("p")
    pElement.innerHTML =
        `<a href="#" class="film" id="${film.id}">${film.title}</a><hr>`
    sidebar.append(pElement)
}

//callback for sidebar event listener
function displayFilm(e) {
    if (e.target.className === "film") {
    display.innerHTML = ""
    fetch(BASE_URL + `/${e.target.id}`)
        .then(res => res.json())
        .then(data => {
            let image = data.movie_banner
            let title = data.title
            let year = data.release_date
            let desc = data.description
            let eyeD = data.id
            display.innerHTML =
                `<img class="resize" src="${image}">
        <h1>${title} <span class="year">${year}</span></h1>
        <p class="width">${desc}</p>
        <button class="watch">Add to Watchlist</button>
        <button class="favorite">Add to Favorites</button>`

            const addWatch = display.querySelector(`.watch`)
            const addFav = display.querySelector(`.favorite`)
            const postConfig = {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",

                },

                body: JSON.stringify({
                    "movie_banner": image,
                    "title": title,
                    "release_date": year,
                    "description": desc,
                    "id": eyeD
                })
            }
            addWatch.addEventListener('click', (e) => {
                fetch(LOCAL_URL + '/watchlist', postConfig)
                .then(res => res.json())
                .catch(error => alert(`${title} is already on your watchlist!`))
                e.target.disabled = true
            })
            addFav.addEventListener('click', (e) => {
                fetch(LOCAL_URL + '/favorites', postConfig)
                .then(res => res.json())
                .catch(error => alert(`${title} is already in your favorites!`))
                e.target.disabled = true
            })
        })
        .catch(error => alert("Could not complete your request. Check your connection and try again."))
    }
}

//callback function for list buttons
function displayList(e) {
    display.innerHTML = ""
    let endpoint;
    let header;

    if (e.target.id === "watchlist") {
        endpoint = "/watchlist"
        header = "My Watchlist"
    }
    else if (e.target.id === "favslist") {
        endpoint = "/favorites"
        header = "My Favorites"
    }
    display.innerHTML = `<h2>${header}</h2>`
    fetch(LOCAL_URL + endpoint)
        .then(res => res.json())
        .then(data => data.forEach(film => {
            display.innerHTML += `<div class="card"><img class="thumbnail" src="${film.movie_banner}"><br>
        <h3>${film.title}</h3><button class="delete" id="${endpoint + "/" + film.id}">Remove from List</button><br><br></div>`
        }))
}


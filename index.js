//Global Variables
const BASE_URL = "https://ghibliapi.herokuapp.com/films"
const LOCAL_URL = "http://localhost:3000"
const sidebar = document.querySelector("#list")
const display = document.querySelector("#show-panel")
const wButton = document.querySelector("#watchlist")
const fButton = document.querySelector("#favslist")

//Startup routine
document.addEventListener("DOMContentLoaded", () => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => data.forEach(film => getFilms(film))
)})

//Event Listeners
sidebar.addEventListener("click", displayFilm)
wButton.addEventListener("click", displayList)
fButton.addEventListener("click", displayList)

//Callback functions
function getFilms(film) {
    const liElement = document.createElement("li")
    liElement.innerHTML =
    `<a id="${film.id}">${film.title}</a><hr>`
    sidebar.append(liElement)
}

function displayFilm(e) {
    display.innerHTML = ""
    fetch(BASE_URL + `/${e.target.id}`)
    .then(res => res.json())
    .then(data => {
        let image = data.movie_banner
        let title = data.title
        let year = data.release_date
        let desc = data.description
        display.innerHTML = 
        `<img class="resize" src="${image}">
        <h1>${title} <span class="year">${year}</span></h1>
        <p class="width">${desc}</p>
        <button class="${data.id}-watch">Add to Watchlist</button>
        <button class="${data.id}-favorite">Add to Favorites</button>`
        //the event listeners are sticking around, a new one is created every time a new film is clicked
        display.addEventListener('click', (e) => {
            let endpoint;
                if (e.target.className === `${data.id}-watch`) {
                    endpoint = "/watchlist"
                }
                else if (e.target.className === `${data.id}-favorite`) {
                    endpoint = "/favorites"
                }//Making a post to favorites and then making a different post to watchlist results in two posts to watchlist
                console.log(e.target)
                    fetch(LOCAL_URL + endpoint, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json"
                          },
                      
                          body: JSON.stringify({
                            "movie_banner": image,
                            "title": title,
                            "release_date": year,
                            "description": desc
                          })
                        
                    })
                    e.target.disabled = true
                 }, {once: true}
        )
    })

}

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
        <h3>${film.title}</h3><button class="delete" id="${film.id}">Remove from List</button><br><br></div>`
    }))
    //endpoint is not being changed here, both end points are being accessed
    display.addEventListener("click", (e) => {
        if (e.target.className === "delete") {
            fetch(LOCAL_URL + endpoint + `/${e.target.id}`, {
                method: "DELETE"
            })
                .then(res => res.json())
                .then(res => {
                    e.target.parentElement.remove()
                    console.log(endpoint)
                })
        }
        
    })

}
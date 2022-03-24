//Global Variables
const BASE_URL = "https://ghibliapi.herokuapp.com/films"
const LOCAL_URL = "http://localhost:3000"
const sidebar = document.querySelector("#list")
const display = document.querySelector("#show-panel")

//Startup routine
document.addEventListener("DOMContentLoaded", () => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => data.forEach(film => getFilms(film))
)})

//Event Listeners
sidebar.addEventListener("click", displayFilm)

//Callback functions
function getFilms(film) {
    const liElement = document.createElement("li")
    liElement.innerHTML =
    `<a id="${film.id}">${film.title}</a>`
    sidebar.append(liElement)
}

function displayFilm(e) {
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
        <button class="watch">Add to Watchlist</button>
        <button class="favorite">Add to Favorites</button>`

        display.addEventListener('click', (e) => {
            let endpoint;
                if (e.target.className === "watch") {
                    endpoint = "/watchlist"
                }
                else if (e.target.className === "favorite") {
                    endpoint = "/favorites"
                }//Making a post to favorites and then making a different post to watchlist results in two posts to watchlist
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
                }
        )
    })

}
//Global Variables
const BASE_URL = "https://ghibliapi.herokuapp.com/films"
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
        display.innerHTML = `<img class="resize" src="${data.movie_banner}">`
    })
}
//Global Variables
const BASE_URL = "https://ghibliapi.herokuapp.com/films"
const sidebar = document.querySelector("#list")

//Startup routine
document.addEventListener("DOMContentLoaded", () => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => data.forEach(film => getFilms(film))
)})

//Callback functions
function getFilms(film) {
    const liElement = document.createElement("li")
    liElement.innerHTML =
    `<a id="${film.id}">${film.title}</a>`
    sidebar.append(liElement)
}
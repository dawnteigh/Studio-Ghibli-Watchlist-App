const BASE_URL = "https://ghibliapi.herokuapp.com/films";
const LOCAL_URL = "http://localhost:3000";
const sidebar = document.querySelector("#list-panel");
const display = document.querySelector("#show-panel");
const wButton = document.querySelector("#watchlist");
const fButton = document.querySelector("#favslist");
const title = document.querySelector("#title");

document.addEventListener("DOMContentLoaded", () => {
  fetch(BASE_URL)
    .then((res) => res.json())
    .then((data) => data.forEach((film) => renderFilmLink(film)))
    .catch((error) => {
      alert(
        "Failed to load list of films, check your internet connection and refresh to try again."
      );
    });
  displayHome();
});

document.addEventListener("click", displayFilm);
wButton.addEventListener("click", displayList);
fButton.addEventListener("click", displayList);
title.addEventListener("click", displayHome);

document.addEventListener("click", (e) => {
  if (e.target.className === "delete") {
    fetch(LOCAL_URL + `${e.target.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) => {
        e.target.parentElement.remove();
      })
      .then((res) => {
        if (document.querySelector(".card") === null) {
          display.innerHTML += `<p class="empty">You haven't added anything to this list yet; select a film and get started!</p>`;
        }
      })
      .catch(error => alert("Could not fulfill your request. Make sure you are running JSON server and watching db.json."));
  }
});

function displayHome(e) {
  display.innerHTML = `<img class="resize"
    src="https://helios-i.mashable.com/imagery/articles/04zZIf7qP6mXjTJwwEY1zgi/images-3.fit_lim.size_2000x.v1643737370.jpg" alt="Welcome to Ghibli Watch!"><br>
<center>
    <h1>Welcome to Ghibli Watch!</h1>
    <h2 id="welcome">
        Your companion app for tracking and discovering beautifully animated feature films from Studio
        Ghibli Inc. is primed and ready for use!<br>
        Choose a title on the left to get started.
    </h2>
</center>`;
}

function renderFilmLink(film) {
  const pElement = document.createElement("p");
  pElement.innerHTML = `<a href="#" class="film" id="${film.id}">${film.title}</a><hr>`;
  sidebar.append(pElement);
}

function displayFilm(e) {
  if (e.target.className === "film" || e.target.className === "thumbnail") {
    display.innerHTML = "";
    fetch(BASE_URL + `/${e.target.id}`)
      .then((res) => res.json())
      .then((data) => {
        let image = data.movie_banner;
        let title = data.title;
        let year = data.release_date;
        let desc = data.description;
        let eyeD = data.id;
        let poster = data.image;
        display.innerHTML = `<img class="resize" alt="${title}" src="${image}">
        <h1>${title} <span class="year">${year}</span></h1>
        <p class="width">${desc}</p>
        <button class="watch">Add to Watchlist</button>
        <button class="favorite">Add to Favorites</button>`;

        const addWatch = display.querySelector(`.watch`);
        const addFav = display.querySelector(`.favorite`);
        const postConfig = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            movie_banner: image,
            title: title,
            release_date: year,
            description: desc,
            id: eyeD,
            movie_poster: poster,
          }),
        };
        addWatch.addEventListener("click", (e) => {
          fetch(LOCAL_URL + "/watchlist", postConfig)
            .then((res) => res.json())
            .catch((error) => alert(`${title} is already on your watchlist!`));
          e.target.disabled = true;
        });
        addFav.addEventListener("click", (e) => {
          fetch(LOCAL_URL + "/favorites", postConfig)
            .then((res) => res.json())
            .catch((error) => alert(`${title} is already in your favorites!`));
          e.target.disabled = true;
        });
      })
      .catch((error) =>
        alert(
          "Could not complete your request. Check your connection and try again."
        )
      );
  }
}

function displayList(e) {
  display.innerHTML = "";
  let endpoint;
  let header;

  if (e.target.id === "watchlist") {
    endpoint = "/watchlist";
    header = "My Watchlist";
  } else if (e.target.id === "favslist") {
    endpoint = "/favorites";
    header = "My Favorites";
  }

  display.innerHTML = `<h2>${header}</h2>
                        <div class="listgrid"></div>`;

  const list = display.querySelector(".listgrid");

  fetch(LOCAL_URL + endpoint)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        display.innerHTML += `<p class="empty">You haven't added anything to this list yet; select a film and get started!</p>`;
      } else {
        data.forEach((film) => {
          list.innerHTML += `<div class="card"><img id="${film.id}" alt=${
            film.title
          } class="thumbnail" src="${film.movie_poster}"><br>
        <h3>${film.title}</h3><button class="delete" id="${
            endpoint + "/" + film.id
          }">Remove from List</button><br><br></div>`;
        });
      }
    })
    .catch(error => alert("Could not fulfill your request. Make sure you are running JSON server and watching db.json."));
}

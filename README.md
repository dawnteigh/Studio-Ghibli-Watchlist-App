# Ghibli Watch

Ghibli Watch is an application that can assist Studio Ghibli fans in tracking both their favorite films and ones they have yet to watch.

## Requirements

You will need to install [JSON Server](https://www.npmjs.com/package/json-server) to use Ghibli Watch to the fullest.

```console
$ npm install -g json-server
```

You will also need to be connected to the Internet.

## How to Use

Using your console, navigate to the directory this file is in and input this:

```console
$ json-server --watch db.json
```

This will need to be done every time you run the app.

Next, open up the index.html file in your browser.
When the application loads, a list of Studio Ghibli animated films will be clickable on the left-hand side of the screen.
Clicking on one will bring up a short description of the film, and from there you will be able to add it to your favorites or watchlist.

You can then view your lists by using the buttons in the sidebar. The list view also allows you to remove films, so keeping your watchlist up to date is a breeze.

## Acknowledgements

This app makes use of the [Studio Ghibli API](https://www.npmjs.com/package/json-server).
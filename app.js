require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist, { limit: 50 })
    .then((data) => {
      const artist = data.body.artists.items;
      res.render("artist-search-results", { artist });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res) => {
  const { id } = req.params;
  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      const album = data.body.items;
      res.render("albums", { album });
    })
    .catch((err) =>
      console.log("The error while searcing albums occured: ", err)
    );
});

app.get("/tracks/:id", (req, res) => {
  const { id } = req.params;
  spotifyApi
    .getAlbumTracks(id)
    .then((data) => {
      const track = data.body.items;
      res.render("tracks", { track });
    })
    .catch((err) =>
      console.log("The error while checking the album tracks occured: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

const express = require("express");
const fetch = require("node-fetch");
const secret = require("./secret.json");
var MongoClient = require("mongodb").MongoClient;

const PORT = process.env.PORT || 3001;

const app = express();

let bearerToken, expiresDate;

const API_BASE = "https://api.spotify.com/v1";

const AUTH_BASE = "https://accounts.spotify.com/api/token";
const CLIENT_ID = "fd89d09a42cf4a9fb0a69ec19e3432ae";
const SECRET_ID = secret.key;
const ENCODED_ID = Buffer.from(CLIENT_ID + ":" + SECRET_ID).toString("base64");

function setNewExpires(expires) {
  const currentDateObj = new Date();
  const numberOfMlSeconds = currentDateObj.getTime();
  const addMlSeconds = expires * 1000;
  const newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
  expiresDate = newDateObj;
}

function tokenIsExpired() {
  if (!expiresDate || new Date().getTime() > expiresDate.getTime()) {
    return true;
  }
}

async function requestBearerToken() {
  const response = await fetch(AUTH_BASE, {
    method: "POST",
    mode: "cors",
    headers: {
      Authorization: "Basic " + ENCODED_ID,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  return response.json();
}

async function getBearerToken() {
  if (bearerToken === null || tokenIsExpired()) {
    const json = await requestBearerToken();
    const token = json["access_token"];
    const expires = json["expires_in"];
    bearerToken = token;
    setNewExpires(expires);
    return token;
  } else {
    return bearerToken;
  }
}

// app.get("/api/search/:search", (req, res) => {
//   res.json({ message: "Hello from the API" });
// });

app.get("/api/bands/:search", async (req, res) => {
  const token = await getBearerToken();
  const searchUrl =
    API_BASE + `/search?q=${req.params.search}&type=artist&limit=10`;
  const bandInfoRequest = await fetch(searchUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const bandInfo = await bandInfoRequest.json();
  if (bandInfo.artists && bandInfo.artists.items) {
    res.json({ bands: bandInfo.artists.items });
  } else {
    res.json({ bands: [] });
  }
});

const cacheAlbum = async (album, db) => {
  // console.log(album);

  const artist = album.artists[0].name;
  const name = album.name;
  const id = album.id;
  const href = album.href;
  const release = album.release_date;
  let imghref;
  for (const img of album.images) {
    if (img.height === 300) imghref = img.url;
  }
  // TODO: get image file
  const albumObj = {
    artist: artist,
    name: name,
    id: id,
    href: href,
    release: release,
    img: imghref,
  };

  return albumObj;
};

const cacheAlbums = async (band, db) => {
  let albumRes;
  let albumInfo = [];
  const token = await getBearerToken();
  let searchUrl = API_BASE + `/artists/${band}/albums?include_groups=album`;
  do {
    const albumInfoRequest = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    albumRes = await albumInfoRequest.json();
    // console.log(albumRes);
    for (const item of albumRes.items) {
      const info = await cacheAlbum(item, db);
      albumInfo.push(info);
    }
    searchUrl = albumRes.next;
  } while (searchUrl);

  return albumInfo;
};

app.get("/api/albums/:band", async (req, res) => {
  MongoClient.connect(
    "mongodb://localhost:27017/setlistr",
    async function (err, client) {
      if (err) throw err;

      var db = client.db("setListr");

      const cachedResults = await db
        .collection("albums")
        .find({ band: req.params.band })
        .toArray(async function (err, result) {
          if (err) throw err;
          console.log(result);
          return result;
        });

      if (cachedResults && cachedResults.length !== 0)
        res.json({ albums: cachedResults });

      const liveResults = await cacheAlbums(req.params.band, db);

      res.json({ albums: liveResults });

      // TODO: write to db

      // res.json({ albums: albumInfo });
    }
  );
});

// app.get("/api/tracks/", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

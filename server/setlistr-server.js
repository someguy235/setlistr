const express = require("express");
const fetch = require("node-fetch");
const _ = require("underscore");
const secret = require("./secret.json");
const MongoClient = require("mongodb").MongoClient;

const PORT = process.env.PORT || 3001;

const app = express();

let bearerToken, expiresDate;

const API_BASE = "https://api.spotify.com/v1";
const AUTH_BASE = "https://accounts.spotify.com/api/token";
const CLIENT_ID = "fd89d09a42cf4a9fb0a69ec19e3432ae";
const SECRET_ID = secret.key;
const ENCODED_ID = Buffer.from(CLIENT_ID + ":" + SECRET_ID).toString("base64");
const DB_CONN = "mongodb://localhost:27017/setlistr";

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

const getTracks = async (albumId) => {
  const token = await getBearerToken();
  const searchUrl = `${API_BASE}/albums/${albumId}`;
  const albumInfo = await fetch(searchUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  }).catch((err) => {
    console.log(err);
  });

  const albumJson = await albumInfo.json(); //.tracks; //.items;
  const albumTracks = albumJson.tracks.items;

  const trackNames = albumTracks.map((track) => {
    let rTrack = track.name.split(" - ")[0];
    rTrack = rTrack.toLowerCase();

    // remove trailing 'Pt. 1' 'Pt. 2' variations
    const ptRegex = /,?\s?pt\.?\s?[123]$/i;
    rTrack = rTrack.replace(ptRegex, "");

    // remove trailing info in parentheses
    const trailingParensRegex = /\s*\([\s\w]*\)$/i;
    rTrack = rTrack.replace(trailingParensRegex, "");

    // remove dashes
    rTrack = rTrack.replace("-", " ");

    return rTrack;
  });

  return _.uniq(trackNames);
};

const getImage = async (url) => {
  const r = await fetch(url);
  const buf = await r.buffer();
  const st = "data:image/png;base64," + buf.toString("base64");
  return st;
};

const getAlbumInfo = async (album) => {
  console.log(album.name);

  const artist = album.artists[0].name;
  const name = album.name;
  const id = album.id;
  const release = album.release_date;
  let imgurl;
  for (const img of album.images) {
    if (img.height === 300) imgurl = img.url;
  }

  const img = await getImage(imgurl);
  const tracks = await getTracks(id);

  const albumObj = {
    artist: artist,
    name: name,
    id: id,
    release: release,
    img: img,
    tracks: tracks,
  };

  return albumObj;
};

const getAlbumsInfo = async (bandId, collection, result) => {
  const cachedAlbumNames = result.map((album) => {
    return album.name;
  });
  console.log(cachedAlbumNames);
  const allAlbumInfo = [...result];
  const newAlbumInfo = [];

  let albumRes;
  const token = await getBearerToken();
  let searchUrl = `${API_BASE}/artists/${bandId}/albums?include_groups=album`;
  do {
    const albumInfoRequest = await fetch(searchUrl, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    albumRes = await albumInfoRequest.json();
    for (const item of albumRes.items) {
      if (!cachedAlbumNames.includes(item.name)) {
        const info = await getAlbumInfo(item);
        info["bandId"] = bandId;
        newAlbumInfo.push(info);
        allAlbumInfo.push(info);
        cachedAlbumNames.push(item.name);
      }
    }
    searchUrl = albumRes.next;
  } while (searchUrl);

  if (newAlbumInfo.length > 0) {
    collection.insertMany(newAlbumInfo);
  }

  return allAlbumInfo;
};

app.get("/setlistr/api/bands/:search", async (req, res) => {
  const token = await getBearerToken();
  const searchUrl = `${API_BASE}/search?q=${req.params.search}&type=artist&limit=10`;
  const bandInfoRequest = await fetch(searchUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const bandInfo = await bandInfoRequest.json();
  if (bandInfo?.artists?.items) {
    res.json({ bands: bandInfo.artists.items });
  } else {
    res.json({ bands: [] });
  }
});

app.get("/setlistr/api/albums/:band", async (req, res) => {
  MongoClient.connect(DB_CONN, async function (err, client) {
    if (err) throw err;

    const db = client.db("setListr");
    const collection = db.collection("albums");
    await collection
      .find({ bandId: req.params.band })
      .toArray(async function (err, result) {
        if (err) throw err;
        const liveResults = await getAlbumsInfo(
          req.params.band,
          collection,
          result
        );
        res.json({ albums: liveResults });
      });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

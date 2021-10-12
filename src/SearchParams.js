import { useState, useEffect } from "react";
import secret from "./secret.json";
import BandDataList from "./BandDataList.js";

const SearchParams = () => {
  const [bearerToken, setBearerToken] = useState(null);
  const [expiresDate, setExpiresDate] = useState(null);
  const [bandInput, setBandInput] = useState("");
  const [bands, setBands] = useState([]);
  const [bandName, setBandName] = useState("");
  const [bandId, setBandId] = useState("");

  const CLIENT_ID = "fd89d09a42cf4a9fb0a69ec19e3432ae";
  const SECRET_ID = secret.key;
  const ENCODED_ID = Buffer.from(CLIENT_ID + ":" + SECRET_ID).toString(
    "base64"
  );

  // const AUTH_BASE = "https://accounts.spotify.com/api/token";
  const API_BASE = "https://api.spotify.com/v1";

  function setNewExpires(expires) {
    const currentDateObj = new Date();
    const numberOfMlSeconds = currentDateObj.getTime();
    const addMlSeconds = expires * 1000;
    const newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
    setExpiresDate(newDateObj);
  }

  function tokenIsExpired() {
    if (expiresDate === null || new Date().getTime() > expiresDate.getTime()) {
      return true;
    }
  }

  // TODO: this will need to be server-side, and return the bearer token
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
      setBearerToken(token);
      setNewExpires(expires);
      return token;
    } else {
      return bearerToken;
    }
  }

  //TODO: add year constraints option

  async function getBandInfo() {
    const bandInfoRequest = await fetch(`/api/bands/${bandInput}`, {
      method: "GET",
    });
    const bandInfo = await bandInfoRequest.json();
    console.log(bandInfo);

    // const token = await getBearerToken();
    // const searchUrl = API_BASE + `/search?q=${bandInput}&type=artist&limit=10`;
    // const bandInfoRequest = await fetch(searchUrl, {
    //   method: "GET",
    //   headers: {
    //     Authorization: "Bearer " + token,
    //   },
    // });
    // const bandInfo = await bandInfoRequest.json();
    // if (bandInfo.artists && bandInfo.artists.items) {
    //   setBands(bandInfo.artists.items);
    // } else {
    //   setBands([]);
    // }
  }

  // useEffect(() => {
  //   console.log("useEffect: " + bandId);
  //   if (!bandId) return null;
  //   getAlbumInfo();
  // }, [bandId]);

  // async function getAlbumInfo() {
  //   console.log("getAlbumInfo");
  //   const token = await getBearerToken();
  //   const searchUrl = API_BASE + `/artists/${bandId}/albums`;
  //   const albumInfoRequest = await fetch(searchUrl, {
  //     method: "GET",
  //     headers: {
  //       Authorization: "Bearer " + token,
  //     },
  //   });
  //   const albumInfo = await albumInfoRequest.json();
  //   console.log(albumInfo);
  //   // if(albumdInfo)
  // }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getBandInfo();
        }}
      >
        <label htmlFor="band-input">
          Band Name:
          <input
            id="band-input"
            list="band-list"
            value={bandInput}
            onChange={(e) => setBandInput(e.target.value)}
            // type="text"
          ></input>
          <BandDataList
            bands={bands}
            setBandName={setBandName}
            setBandId={setBandId}
          />
        </label>
      </form>
      {bandName} : {bandId}
    </div>
  );
};

export default SearchParams;

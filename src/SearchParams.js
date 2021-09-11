import { useState } from "react";

const SearchParams = () => {
  const [bandName, setBandName] = useState("");
  const [spotifyToken, setSpotifyToken] = useState("");

  const CLIENT_ID = "fd89d09a42cf4a9fb0a69ec19e3432ae";
  const SECRET_ID = "";
  const ENCODED_ID = Buffer.from(CLIENT_ID + ":" + SECRET_ID).toString(
    "base64"
  );

  const AUTH_BASE = "https://accounts.spotify.com/api/token";

  // TODO: this will need to be server-side, and return the bearer token
  async function getSpotifyToken() {
    console.log(ENCODED_ID);
    const response = await fetch(AUTH_BASE, {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: "Basic " + ENCODED_ID,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    // console.log(response.json());
    // setSpotifyToken(response.json()["access_token"]);
    return response.json();
  }

  function getBandInfo() {
    console.log(bandName);
    if (spotifyToken === "") {
      getSpotifyToken().then((data) => {
        console.log("spotify token set");
        console.log(data);
        setSpotifyToken(data["access_token"]);
      });
    }
    console.log(spotifyToken);
  }

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
            value={bandName}
            onChange={(e) => setBandName(e.target.value)}
            type="text"
          ></input>
        </label>
      </form>
    </div>
  );
};

export default SearchParams;

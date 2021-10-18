import { useState, useEffect } from "react";
// import secret from "./secret.json";
import BandDataList from "./BandDataList.js";

const SearchParams = () => {
  const [bandInput, setBandInput] = useState("");
  const [bands, setBands] = useState([]);
  const [bandName, setBandName] = useState("");
  const [bandId, setBandId] = useState("");
  const [albums, setAlbums] = useState({});

  // TODO: add year constraints option
  // TODO: show just live albums, option
  // TODO: reset button
  async function getBands() {
    const bandInfoRequest = await fetch(`/api/bands/${bandInput}`, {
      method: "GET",
    });
    const res = await bandInfoRequest.json();
    setBands(res.bands);
  }

  useEffect(() => {
    console.log("useEffect: " + bandId);
    if (!bandId) return null;
    getAlbumInfo();
  }, [bandId]);

  async function getAlbumInfo() {
    console.log("getAlbumInfo");
    const albumInfoRequest = await fetch(`/api/albums/${bandId}`, {
      method: "GET",
    });
    const res = await albumInfoRequest.json();
    console.log(res.albums);
    setAlbums(res.albums);
    // setTracks(res.tracks);
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getBands();
        }}
      >
        <label htmlFor="band-input">
          Search for a band to get started
          <br />
          <input
            id="band-input"
            list="band-list"
            value={bandInput}
            onChange={(e) => setBandInput(e.target.value)}
            // type="text"
          ></input>
        </label>
      </form>
      <BandDataList
        bands={bands}
        setBandName={setBandName}
        setBandId={setBandId}
      />
      {bandName} : {bandId}
    </div>
  );
};

export default SearchParams;

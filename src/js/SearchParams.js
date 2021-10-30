import { useState, useEffect } from "react";
import BandDataList from "./BandDataList.js";
import TrackList from "./TrackList.js";

const SearchParams = () => {
  const [bandInput, setBandInput] = useState("");
  const [bands, setBands] = useState([]);
  const [bandName, setBandName] = useState("");
  const [bandId, setBandId] = useState("");
  const [albums, setAlbums] = useState([]);

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
    // console.log("getAlbumInfo");
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
      <div id="band-form-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getBands();
          }}
        >
          <label htmlFor="band-input">
            Find the best setlist for you
            <br />
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
      </div>
      <BandDataList
        bands={bands}
        setBands={setBands}
        setBandName={setBandName}
        setBandId={setBandId}
      />
      {/* <AlbumList /> */}
      <TrackList albums={albums} />
      {/* {bandName} : {bandId} */}
    </div>
  );
};

export default SearchParams;

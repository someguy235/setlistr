import { useState, useEffect } from "react";
import BandDataList from "./BandDataList.js";
import TrackList from "./TrackList.js";
import AlbumList from "./AlbumList.js";

const SearchParams = () => {
  const [bandInput, setBandInput] = useState("");
  const [bands, setBands] = useState([]);
  // const [bandName, setBandName] = useState("");
  const [bandId, setBandId] = useState("");
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);

  // TODO: add year constraints option
  // TODO: show just live albums, option
  // TODO: reset button
  // TODO: animate transitions

  async function getBands() {
    const bandInfoRequest = await fetch(`/api/bands/${bandInput}`, {
      method: "GET",
    });
    const res = await bandInfoRequest.json();
    setBands(res.bands);
  }

  useEffect(() => {
    if (!bandId) return null;
    getAlbumInfo();
  }, [bandId]);

  async function getAlbumInfo() {
    const albumInfoRequest = await fetch(`/api/albums/${bandId}`, {
      method: "GET",
    });
    const res = await albumInfoRequest.json();
    // console.log(res.albums);
    setAlbums(res.albums);
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
            <input
              id="band-input"
              list="band-list"
              value={bandInput}
              onChange={(e) => setBandInput(e.target.value)}
              placeholder="name a band"
            ></input>
          </label>
        </form>
      </div>
      <BandDataList
        bands={bands}
        setBands={setBands}
        // setBandName={setBandName}
        setBandId={setBandId}
      />
      <div id="column-container">
        <TrackList
          bands={bands}
          albums={albums}
          tracks={tracks}
          setTracks={setTracks}
        />
        <AlbumList bands={bands} albums={albums} tracks={tracks} />
      </div>
    </div>
  );
};

export default SearchParams;

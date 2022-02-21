import { useState, useEffect } from "react";
import BandDataList from "./BandDataList.js";
import TrackList from "./TrackList.js";
import AlbumList from "./AlbumList.js";
import LoadingSpinner from "./LoadingSpinner.js";

const SearchParams = () => {
  const [bandInput, setBandInput] = useState("");
  const [bands, setBands] = useState([]);
  const [bandId, setBandId] = useState("");
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [albumsLoading, setAlbumsLoading] = useState(false);

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
    setAlbumsLoading(true);
    setAlbums([]);
    const albumInfoRequest = await fetch(`/api/albums/${bandId}`, {
      method: "GET",
    });
    const res = await albumInfoRequest.json();
    setAlbums(res.albums);
    setAlbumsLoading(false);
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
      <BandDataList bands={bands} setBands={setBands} setBandId={setBandId} />
      <LoadingSpinner msg={"contacting Spotify..."} loading={albumsLoading} />
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

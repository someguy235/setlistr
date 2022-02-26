import { useState, useEffect, useCallback } from "react";
import BandList from "./BandList.js";
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

  const getAlbumInfo = useCallback(async () => {
    setAlbumsLoading(true);
    setAlbums([]);
    const albumInfoRequest = await fetch(`/api/albums/${bandId}`, {
      method: "GET",
    });
    const res = await albumInfoRequest.json();
    setAlbums(res.albums);
    setAlbumsLoading(false);
  }, [bandId]);

  useEffect(() => {
    if (!bandId) return null;
    getAlbumInfo();
  }, [bandId, getAlbumInfo]);

  return (
    <section>
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
      <BandList bands={bands} setBands={setBands} setBandId={setBandId} />
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
    </section>
  );
};

export default SearchParams;

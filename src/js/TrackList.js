import { useEffect, useState } from "react";

const TrackEntry = (props) => {
  const { track, toggleTrack } = props;
  return (
    <div>
      <div
        role="button"
        tabIndex="0"
        onKeyPress={() => {}}
        onClick={() => toggleTrack(track.name)}
        className={track.selected ? "selected" : ""}
      >
        {`${track.name} [${track.count}]`}
      </div>
    </div>
  );
};

const TrackList = (props) => {
  const { bands, albums, tracks, setTracks } = props;
  const [sort, setSort] = useState("alpha");

  //TODO: 'clear selection' button

  useEffect(() => {
    getTrackInfo(albums, setTracks);
  }, [albums]);

  if (bands.length > 1) return null;

  const getTrackInfo = (albums, setTracks) => {
    const tracks = [];

    for (const album of albums) {
      for (const track of album.tracks) {
        const targetName = track;
        const trackObj = tracks.find((t) => t.name === targetName);
        if (trackObj) {
          trackObj.count += 1;
        } else {
          tracks.push({
            name: targetName,
            count: 1,
            selected: false,
          });
        }
      }
    }
    setTracks(tracks);
  };

  const getSortFn = (type) => {
    let sortFn;
    switch (type) {
      case "alpha":
        sortFn = (a, b) => {
          return a.name < b.name ? -1 : 1;
        };
        break;
      case "alpha-rev":
        sortFn = (a, b) => {
          return a.name > b.name ? -1 : 1;
        };
        break;
      case "count":
        sortFn = (a, b) => {
          return a.count < b.count ? -1 : 1;
        };
        break;
      case "count-rev":
        sortFn = (a, b) => {
          return a.count > b.count ? -1 : 1;
        };
        break;
    }
    return sortFn;
  };

  const updateSort = (type) => {
    let t;
    switch (type) {
      case "alpha":
        t = sort === "alpha" ? "alpha-rev" : "alpha";
        break;
      case "count":
        t = sort === "count" ? "count-rev" : "count";
        break;
    }
    setSort(t);
  };

  const toggleTrack = (trackName) => {
    let foundIdx = tracks.findIndex((track) => track.name === trackName);
    tracks[foundIdx].selected = !tracks[foundIdx].selected;
    setTracks([...tracks]);
  };

  if (albums.length === 0) return null;

  return (
    <div id="track-list-column">
      <div className="sort-buttons">
        <button onClick={() => updateSort("alpha")}>
          Alpha{" "}
          {sort === "alpha" ? (
            <span>&uarr;</span>
          ) : sort === "alpha-rev" ? (
            <span>&darr;</span>
          ) : (
            " "
          )}
        </button>
        <button onClick={() => updateSort("count")}>
          Count{" "}
          {sort === "count" ? (
            <span>&uarr;</span>
          ) : sort === "count-rev" ? (
            <span>&darr;</span>
          ) : (
            " "
          )}
        </button>
      </div>
      <div id="track-list-container">
        {tracks.sort(getSortFn(sort)).map((track) => {
          return (
            <TrackEntry
              key={track.name}
              track={track}
              toggleTrack={toggleTrack}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TrackList;

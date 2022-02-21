import { forwardRef, useEffect, useState } from "react";
import FlipMove from "react-flip-move";

const FunctionalTrackEntry = forwardRef((props, ref) => (
  <div className="track-name-container" ref={ref}>
    <TrackEntry props={props} />
  </div>
));
FunctionalTrackEntry.displayName = "FunctionalTrackEntry";

const TrackEntry = ({ props }) => {
  const { track, toggleTrack } = props;
  return (
    <div>
      <button
        className={"track-button" + (track.selected ? " selected" : "")}
        onClick={() => toggleTrack(track.name)}
      >
        {`${track.name} [${track.count}]`}
      </button>
    </div>
  );
};

const TrackList = (props) => {
  const { bands, albums, tracks, setTracks } = props;
  const [sort, setSort] = useState("alpha");

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

  const resetTracks = () => {
    const resetTracks = tracks.map((track) => {
      return { ...track, selected: false };
    });
    setTracks(resetTracks);
  };

  const toggleTrack = (trackName) => {
    let foundIdx = tracks.findIndex((track) => track.name === trackName);
    tracks[foundIdx].selected = !tracks[foundIdx].selected;
    setTracks([...tracks]);
  };

  if (albums.length === 0) return null;

  const alphaButtonText =
    "Alpha " +
    (sort === "alpha"
      ? String.fromCharCode(8593)
      : sort === "alpha-rev"
      ? String.fromCharCode(8595)
      : "");

  const countButtonText =
    "Count " +
    (sort === "count"
      ? String.fromCharCode(8593)
      : sort === "counts-rev"
      ? String.fromCharCode(8595)
      : "");

  return (
    <div id="track-list-column">
      <div className="sort-buttons">
        <button onClick={() => updateSort("alpha")}>{alphaButtonText}</button>
        <button onClick={() => updateSort("count")}>{countButtonText}</button>
        <button onClick={() => resetTracks()}>Reset</button>
      </div>
      <div id="track-list-container">
        <FlipMove duration={500} staggerDurationBy={10} typeName="div">
          {tracks.sort(getSortFn(sort)).map((track) => {
            return (
              <FunctionalTrackEntry
                key={track.name}
                track={track}
                toggleTrack={toggleTrack}
              />
            );
          })}
        </FlipMove>
      </div>
    </div>
  );
};

export default TrackList;

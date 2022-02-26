import { forwardRef, useCallback, useEffect, useState } from "react";
import FlipMove from "react-flip-move";

const FunctionalTrackItem = forwardRef((props, ref) => (
  <li className="track-name-container" ref={ref}>
    <TrackItem props={props} />
  </li>
));
FunctionalTrackItem.displayName = "FunctionalTrackItem";

const TrackItem = ({ props }) => {
  const { track, toggleTrack } = props;
  return (
    <button
      className={"track-button" + (track.selected ? " selected" : "")}
      onClick={() => toggleTrack(track.name)}
    >
      {`${track.name} [${track.count}]`}
    </button>
  );
};

const TrackList = (props) => {
  const { bands, albums, tracks, setTracks } = props;
  const [sort, setSort] = useState("alpha");

  const getTrackInfo = useCallback((albums, setTracks) => {
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
  }, []);

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

  const alphaButtonText =
    "Alpha " +
    (sort === "alpha"
      ? String.fromCharCode(8593) // up arrow
      : sort === "alpha-rev"
      ? String.fromCharCode(8595) // down arrow
      : "");

  const countButtonText =
    "Count " +
    (sort === "count"
      ? String.fromCharCode(8593) // up arrow
      : sort === "counts-rev"
      ? String.fromCharCode(8595) // down arrow
      : "");

  useEffect(() => {
    getTrackInfo(albums, setTracks);
  }, [albums, getTrackInfo, setTracks]);

  if (albums.length === 0) return null;
  if (bands.length > 1) return null;

  return (
    <section id="track-list-column">
      <menu className="sort-buttons">
        <li>
          <button
            title="sort tracks alphabetically"
            onClick={() => updateSort("alpha")}
          >
            {alphaButtonText}
          </button>
        </li>
        <li>
          <button
            title="sort tracks by frequency"
            onClick={() => updateSort("count")}
          >
            {countButtonText}
          </button>
        </li>
        <li>
          <button title="reset selected tracks" onClick={() => resetTracks()}>
            Reset
          </button>
        </li>
      </menu>
      <div id="track-list-container">
        <FlipMove duration={500} staggerDurationBy={10} typeName="ul">
          {tracks.sort(getSortFn(sort)).map((track) => {
            return (
              <FunctionalTrackItem
                key={track.name}
                track={track}
                toggleTrack={toggleTrack}
              />
            );
          })}
        </FlipMove>
      </div>
    </section>
  );
};

export default TrackList;

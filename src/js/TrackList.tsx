import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  FunctionComponent,
} from "react";
import { Album, Band, Track } from "./types";
// import FlipMove from "react-flip-move";

// type Track = {};

// const FunctionalTrackItem = forwardRef((props, ref) => (
//   <li className="track-name-container" ref={ref}>
//     <TrackItem props={props} />
//   </li>
// ));

type TrackItemProps = {
  track: Track;
  toggleTrack: Function;
};

const FunctionalTrackItem = forwardRef<HTMLButtonElement, TrackItemProps>(
  (props, ref) => (
    <li className="track-name-container">
      <button
        className={"track-button" + (props.track.selected ? " selected" : "")}
        onClick={() => props.toggleTrack(props.track.name)}
      >
        {`${props.track.name} [${props.track.count}]`}
      </button>
    </li>
  )
);
FunctionalTrackItem.displayName = "FunctionalTrackItem";

// const TrackItem: FunctionComponent = ({ props }) => {
//   const { track: Track, toggleTrack } = props;
//   return (
//     <button
//       className={"track-button" + (track.selected ? " selected" : "")}
//       onClick={() => toggleTrack(track.name)}
//     >
//       {`${track.name} [${track.count}]`}
//     </button>
//   );
// };

type TrackListProps = {
  bands: Band[];
  albums: Album[];
  tracks: Track[];
  setTracks: Function;
};
const TrackList = (props: TrackListProps) => {
  const { bands, albums, tracks, setTracks } = props;
  const [sort, setSort] = useState("alpha");

  const getTrackInfo = useCallback((albums, setTracks) => {
    const tracks: Track[] = [];

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

  const getSortFn = (type: string) => {
    let sortFn;
    switch (type) {
      case "alpha":
        sortFn = (a: Track, b: Track) => {
          return a.name < b.name ? -1 : 1;
        };
        break;
      case "alpha-rev":
        sortFn = (a: Track, b: Track) => {
          return a.name > b.name ? -1 : 1;
        };
        break;
      case "count":
        sortFn = (a: Track, b: Track) => {
          return a.count < b.count ? -1 : 1;
        };
        break;
      case "count-rev":
        sortFn = (a: Track, b: Track) => {
          return a.count > b.count ? -1 : 1;
        };
        break;
    }
    return sortFn;
  };

  const updateSort = (type: string) => {
    let t: string = "";
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

  const toggleTrack = (trackName: string) => {
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
      : sort === "count-rev"
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
        {/* <FlipMove duration={500} staggerDurationBy={10} typeName="ul"> */}
        <ul>
          {tracks.sort(getSortFn(sort)).map((track) => {
            return (
              <FunctionalTrackItem
                key={track.name}
                track={track}
                toggleTrack={toggleTrack}
              />
            );
          })}
        </ul>
        {/* </FlipMove> */}
      </div>
    </section>
  );
};

export default TrackList;

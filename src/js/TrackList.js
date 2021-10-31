import { useEffect, useState } from "react";

const getTrackInfo = (albums, setTracks) => {
  const tracks = [];

  for (const album of albums) {
    for (const track of album.tracks) {
      // TODO: a lot of data cleaning
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
      //   if (!Object.keys(tracks).includes(track)) {
      // tracks[track] = {
      //   count: 0,
      //   selected: false,
      // };
      //   }
      //   tracks[track].count += 1;
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

const TrackList = (props) => {
  const { albums } = props;
  const [tracks, setTracks] = useState([]);
  const [sort, setSort] = useState("alpha");
  //   const [trackFilter, setTrackFilter] = useState("");

  useEffect(() => {
    getTrackInfo(albums, setTracks);
  }, [albums]);

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

  if (albums.length === 0) return null;

  console.log(tracks);
  tracks.sort(getSortFn(sort));
  return (
    <div id="track-list-column">
      <div id="sort-buttons">
        Sort:
        <button onClick={() => updateSort("alpha")}>Alpha</button>
        <button onClick={() => updateSort("count")}>Count</button>
      </div>
      <div id="track-list-container">
        {tracks.sort(getSortFn(sort)).map((track) => {
          return (
            <div key={track.name}>
              <div
                role="button"
                tabIndex="0"
                onKeyPress={() => {}}
                onClick={() => toggleTrack()}
              >
                {/* <input name={track.name} type="checkbox" /> */}
                <label
                  htmlFor={track.name}
                >{`${track.name} [${track.count}]`}</label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackList;

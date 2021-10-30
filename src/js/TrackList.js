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
  if (type === "alpha") {
    return (a, b) => {
      return a.name < b.name ? -1 : 1;
    };
  } else if (type === "count") {
    return (a, b) => {
      return a.count < b.count ? -1 : 1;
    };
  }
};

const TrackList = (props) => {
  const { albums } = props;
  const [tracks, setTracks] = useState([]);
  const [sort, setSort] = useState("alpha");
  //   const [trackFilter, setTrackFilter] = useState("");

  useEffect(() => {
    getTrackInfo(albums, setTracks);
  }, [albums]);

  if (albums.length === 0) return null;

  console.log(tracks);
  tracks.sort(getSortFn(sort));
  return (
    <div>
      <div>
        Sort:
        <button onClick={() => setSort("alpha")}>Alpha</button>
        <button onClick={() => setSort("count")}>Count</button>
      </div>
      {tracks.sort(getSortFn(sort)).map((track) => {
        return (
          <div key={track.name}>
            <input name={track.name} type="checkbox" />
            <label
              htmlFor={track.name}
            >{`${track.name} [${track.count}]`}</label>
          </div>
        );
      })}
    </div>
  );
};

export default TrackList;

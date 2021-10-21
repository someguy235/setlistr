import { useEffect, useState } from "react";

const getTrackInfo = (albums, setTracks) => {
  const tracks = {};
  for (const album of albums) {
    console.log(album);
    for (const track of album.tracks) {
      console.log(track);
      if (!Object.keys(tracks).contains(track)) {
        tracks[track] = {
          count: 0,
          selected: false,
        };
      }
      tracks[track].count += 1;
    }
  }
  setTracks(tracks);
};

const TrackList = (props) => {
  const { albums } = props;
  const [tracks, setTracks] = useState({});
  //   const [trackFilter, setTrackFilter] = useState("");

  useEffect(() => {
    getTrackInfo(albums, setTracks);
  }, [albums]);

  if (albums.length === 0) return null;

  return tracks.map((track) => {
    <div>{`${track.name} [${track.count}]`}</div>;
  });
};

export default TrackList;

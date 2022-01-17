import { useState } from "react";

const calculateAlbumScores = (albums, tracks) => {
  let scores = {};
  tracks.forEach((track) => {
    if (track.selected) {
      albums.forEach((album) => {
        if (album.tracks.includes(track.name)) {
          console.log("found");
          scores[album.id] = scores[album.id] || 0;
          scores[album.id]++;
        }
      });
    }
  });

  albums.forEach((album) => {
    album.score = scores[album.id] || 0;
  });

  // TODO: should return a new object
  //   return scores;
};

const AlbumEntry = (props) => {
  const { album, selectedTracks, showTracks } = props;
  const tracks = showTracks
    ? album.tracks.map((track, i) => {
        return (
          <div
            className={selectedTracks.includes(track) ? "track-selected" : ""}
            key={i}
          >
            {i + 1 + ". " + track}
          </div>
        );
      })
    : null;
  return (
    <div className="album-entry">
      <div>
        <img alt="album cover art" src={album.img} />
      </div>
      <div className="track-title">{album.name}</div>
      <div className={"track-score"}>
        {album.score}/{album.tracks.length}
      </div>
      <div>{tracks}</div>
    </div>
  );
};

const sortFn = (a, b) => {
  return a.score < b.score ? 1 : -1;
};

const getSelectedTracks = (tracks) => {
  return tracks.map((track) => {
    return track.selected ? track.name : null;
  });
};

const AlbumList = (props) => {
  const { bands, albums, tracks } = props;
  const [showTracks, setShowTracks] = useState(false);

  if (albums.length === 0 || bands.length > 1) return null;

  calculateAlbumScores(albums, tracks);
  const selectedTracks = getSelectedTracks(tracks);

  return (
    <div id="album-list-column">
      <div className="sort-buttons">
        <button
          onClick={() => {
            setShowTracks(!showTracks);
          }}
        >
          Show Tracks
        </button>
      </div>
      <div className="albums-container">
        {albums.sort(sortFn).map((album) => {
          return (
            <AlbumEntry
              key={album.id}
              album={album}
              selectedTracks={selectedTracks}
              showTracks={showTracks}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AlbumList;

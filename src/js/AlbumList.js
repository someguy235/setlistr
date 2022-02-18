import { forwardRef, useState } from "react";
import FlipMove from "react-flip-move";

const calculateAlbumScores = (albums, tracks) => {
  const scores = {};
  const scoredAlbums = [];

  tracks.forEach((track) => {
    if (track.selected) {
      albums.forEach((album) => {
        if (album.tracks.includes(track.name)) {
          scores[album.id] = scores[album.id] || 0;
          scores[album.id]++;
        }
      });
    }
  });

  albums.forEach((album) => {
    scoredAlbums.push({ ...album, score: scores[album.id] || 0 });
  });

  return scoredAlbums.sort((a, b) => {
    return a.score < b.score ? 1 : -1;
  });
};

const FunctionalAlbumEntry = forwardRef((props, ref) => (
  <div className="album-entry-container" ref={ref}>
    <AlbumEntry props={props} />
  </div>
));
FunctionalAlbumEntry.displayName = "FunctionalAlbumEntry";

const AlbumEntry = ({ props }) => {
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

const getSelectedTracks = (tracks) => {
  return tracks.map((track) => {
    return track.selected ? track.name : null;
  });
};

const AlbumList = (props) => {
  const { bands, albums, tracks } = props;
  const [showTracks, setShowTracks] = useState(false);

  if (albums.length === 0 || bands.length > 1) return null;

  const displayAlbums = calculateAlbumScores(albums, tracks);
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
      <div id="albums-container">
        <FlipMove duration={500} staggerDurationBy={30} typeName="div">
          {displayAlbums.map((album) => {
            return (
              <FunctionalAlbumEntry
                key={album.id}
                album={album}
                selectedTracks={selectedTracks}
                showTracks={showTracks}
              />
            );
          })}
        </FlipMove>
      </div>
    </div>
  );
};

export default AlbumList;

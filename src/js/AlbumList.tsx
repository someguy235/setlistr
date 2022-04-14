import { forwardRef, useState } from "react";
import { Band, Track, Album } from "./types";
// import FlipMove from "react-flip-move";

const calculateAlbumScores = (albums: Album[], tracks: Track[]) => {
  const scores: { [key: string]: number } = {};
  const scoredAlbums: Album[] = [];

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

// const FunctionalAlbumItem = forwardRef((props, ref) => (
//   <li className="album-entry-container" ref={ref}>
//     <AlbumItem props={props} />
//   </li>
// ));
// FunctionalAlbumItem.displayName = "FunctionalAlbumItem";

type AlbumItemProps = {
  album: Album;
  selectedTracks: string[];
  showTracks: boolean;
};
const AlbumItem = (props: AlbumItemProps) => {
  const { album, selectedTracks, showTracks } = props;
  const tracks = showTracks
    ? album.tracks.map((track, i) => {
        return (
          <li
            className={selectedTracks.includes(track) ? "track-selected" : ""}
            key={i}
          >
            {track}
          </li>
        );
      })
    : null;

  return (
    <li className="album-entry-container">
      <div className="album-entry">
        <div>
          <a
            href={"https://open.spotify.com/album/" + album.id}
            target="_blank"
            rel="noreferrer"
          >
            <img alt="album cover art" src={album.img} />
          </a>
        </div>
        <div className="track-title">{album.name}</div>
        <div className={"track-score"}>
          {album.score}/{album.tracks.length}
        </div>
        <ol>{tracks}</ol>
      </div>
    </li>
  );
};

const getSelectedTracks = (tracks: Track[]) => {
  return tracks
    .filter((track) => {
      return track.selected && track.name;
    })
    .map((track) => {
      return track.name;
    });
};

type AlbumListProps = {
  bands: Band[];
  albums: Album[];
  tracks: Track[];
};
const AlbumList = (props: AlbumListProps) => {
  const { bands, albums, tracks } = props;
  const [showTracks, setShowTracks] = useState(false);

  if (albums.length === 0 || bands.length > 1) return null;

  const displayAlbums = calculateAlbumScores(albums, tracks);
  const selectedTracks = getSelectedTracks(tracks);

  return (
    <section id="album-list-column">
      <menu className="sort-buttons">
        <li>
          <button
            onClick={() => {
              setShowTracks(!showTracks);
            }}
          >
            {showTracks ? "Hide Tracks" : "Show Tracks"}
          </button>
        </li>
      </menu>
      <div id="albums-container">
        {/* <FlipMove duration={500} staggerDurationBy={30} typeName="ol"> */}
        <ol>
          {displayAlbums.map((album) => {
            return (
              <AlbumItem
                key={album.id}
                album={album}
                selectedTracks={selectedTracks}
                showTracks={showTracks}
              />
            );
          })}
        </ol>
        {/* </FlipMove> */}
      </div>
    </section>
  );
};

export default AlbumList;

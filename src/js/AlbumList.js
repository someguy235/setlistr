const AlbumEntry = (props) => {
  const { album } = props;
  return (
    <div className="album-entry">
      <img alt="album cover art" src={album.img} />
      {album.name}
    </div>
  );
};

const AlbumList = (props) => {
  const { albums, tracks } = props;
  console.log(albums);
  return (
    <div>
      {albums.map((album) => {
        return <AlbumEntry key={album.id} album={album} />;
      })}
    </div>
  );
};

export default AlbumList;

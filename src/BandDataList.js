const BandDataList = ({ bands }) => {
  //   console.log(bands);
  if (bands.length === 0) return null;
  return (
    <datalist id="band-list">
      {bands.map((band) => (
        <option value={band.id} key={band.id}>
          {band.name}
        </option>
      ))}
    </datalist>
  );
};

export default BandDataList;

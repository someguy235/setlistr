const BandDataList = (props) => {
  const { bands, setBands, setBandId, setBandName } = props;
  if (bands.length === 0) return null;

  const handleChange = (e) => {
    console.log("handleChange");
    console.log(e.target.dataset.bandname);
    setBandId(e.target.dataset.bandid);
    setBandName(e.target.dataset.bandName);
    setBands([]);
  };

  return (
    <div id="band-options">
      {bands.map((band) => (
        <div
          className="band-option"
          key={band.id}
          data-bandname={band.name}
          data-bandid={band.id}
          onClick={(e) => {
            handleChange(e);
          }}
          onKeyPress={(e) => {
            handleChange(e);
          }}
          role="button"
          tabIndex="0"
        >
          {band.name}
        </div>
      ))}
    </div>
  );
};

export default BandDataList;

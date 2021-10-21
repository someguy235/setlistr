const BandDataList = (props) => {
  const { bands, setBands, setBandId, setBandName } = props;
  if (bands.length === 0) return null;

  const handleChange = (e) => {
    console.log("handleChange");
    // console.log(e.target);
    // console.log(e.target.dataset);
    // console.log(e.target.dataset.bandname);
    console.log(e.target.dataset.bandid);
    setBandId(e.target.dataset.bandid);
    setBandName(e.target.dataset.bandname);
    setBands([]);
  };

  return (
    <div id="band-options">
      <div>
        {bands.map((band) => (
          <div className="band-option" key={band.id}>
            <span
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
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BandDataList;

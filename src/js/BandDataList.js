const BandDataList = (props) => {
  const { bands, setBands, setBandId, setBandName } = props;

  const handleChange = (e) => {
    const bandname = e.target.dataset.bandname;
    const bandid = e.target.dataset.bandid;

    setBandId(bandid);
    setBandName(bandname);
    setBands([{ name: bandname, id: bandid }]);
  };

  if (bands.length === 0) return null;

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

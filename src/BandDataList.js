const BandDataList = (props) => {
  const { bands, setBandId, setBandName } = props;
  if (bands.length === 0) return null;

  return (
    <div>
      <select
        onBlur={(e) => {
          setBandId(e.target.value);
          setBandName(e.target.options[e.target.selectedIndex].dataset.band);
        }}
        onChange={(e) => {
          setBandId(e.target.value);
          setBandName(e.target.options[e.target.selectedIndex].dataset.band);
        }}
      >
        {bands.map((band) => (
          <option
            value={band.id}
            name={band.name}
            key={band.id}
            data-band={band.name}
          >
            {band.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BandDataList;

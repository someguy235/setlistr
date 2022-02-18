import { forwardRef } from "react";
import FlipMove from "react-flip-move";

const FunctionalBandItem = forwardRef((props, ref) => (
  <div className="band-option" key={props.band.id} ref={ref}>
    <BandItem props={props} />
  </div>
));
FunctionalBandItem.displayName = "FunctionalBandItem";

const BandItem = ({ props }) => {
  const { band, handleChange } = props;
  return (
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
  );
};

const BandDataList = (props) => {
  const { bands, setBands, setBandId } = props;

  const handleChange = (e) => {
    const bandname = e.target.dataset.bandname;
    const bandid = e.target.dataset.bandid;

    setBandId(bandid);
    setBands([{ name: bandname, id: bandid }]);
  };

  if (bands.length === 0) return null;

  return (
    <div id="band-options">
      <FlipMove duration={500} staggerDurationBy={10} typeName="div">
        {bands.map((band) => {
          return (
            <FunctionalBandItem
              band={band}
              handleChange={handleChange}
              key={band.id}
            />
          );
        })}
      </FlipMove>
    </div>
  );
};

export default BandDataList;

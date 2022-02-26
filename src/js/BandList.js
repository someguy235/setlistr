import { forwardRef } from "react";
import FlipMove from "react-flip-move";

const FunctionalBandItem = forwardRef((props, ref) => (
  <li className="band-option" key={props.band.id} ref={ref}>
    <BandItem props={props} />
  </li>
));
FunctionalBandItem.displayName = "FunctionalBandItem";

const BandItem = ({ props }) => {
  const { band, handleChange } = props;
  return (
    <button
      data-bandname={band.name}
      data-bandid={band.id}
      onClick={(e) => handleChange(e)}
    >
      {band.name}
    </button>
  );
};

const BandList = (props) => {
  const { bands, setBands, setBandId } = props;

  const handleChange = (e) => {
    const bandname = e.target.dataset.bandname;
    const bandid = e.target.dataset.bandid;

    setBandId(bandid);
    setBands([{ name: bandname, id: bandid }]);
  };

  if (bands.length === 0) return null;

  return (
    <section id="band-options">
      <FlipMove duration={500} staggerDurationBy={10} typeName="ul">
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
    </section>
  );
};

export default BandList;

import { forwardRef } from "react";
// import * as FlipMove from "react-flip-move";
import { Band } from "./types";

type BandItemProps = {
  band: Band;
  handleChange: Function;
};

// const FunctionalBandItem = forwardRef((props: BandItemProps, ref) => (
//   <li className="band-option" key={props.band.id} ref={ref}>
//     <BandItem props={props} />
//   </li>
// ));
const FunctionalBandItem = forwardRef<HTMLButtonElement, BandItemProps>(
  (props, ref) => (
    <li className="band-option">
      <button
        data-bandname={props.band.name}
        data-bandid={props.band.id}
        onClick={(e) => props.handleChange(e)}
        ref={ref}
      >
        {props.band.name}
      </button>
    </li>
  )
);

FunctionalBandItem.displayName = "FunctionalBandItem";

// const BandItem = (props: BandItemProps) => {
//   const { band, handleChange } = props;
//   return (
//     <button
//       data-bandname={band.name}
//       data-bandid={band.id}
//       onClick={(e) => handleChange(e)}
//     >
//       {band.name}
//     </button>
//   );
// };

type BandListProps = {
  bands: Array<Band>;
  setBands: Function;
  setBandId: Function;
};

const BandList = (props: BandListProps) => {
  const { bands, setBands, setBandId } = props;

  const handleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!(e.target instanceof HTMLButtonElement)) {
      return;
    }
    const bandname = e.target.dataset.bandname;
    const bandid = e.target.dataset.bandid;

    setBandId(bandid);
    setBands([{ name: bandname, id: bandid }]);
  };

  if (bands.length === 0) return null;

  return (
    <section id="band-options">
      {/* <FlipMove duration={500} staggerDurationBy={10} typeName="ul"> */}
      <ul>
        {bands.map((band) => {
          return (
            <FunctionalBandItem
              band={band}
              handleChange={handleChange}
              key={band.id}
            />
          );
        })}
      </ul>
      {/* </FlipMove> */}
    </section>
  );
};

export default BandList;

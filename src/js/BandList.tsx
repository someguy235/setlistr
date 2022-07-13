import { Flipper, Flipped } from "react-flip-toolkit";
import { Band } from "./types";

type BandItemProps = {
  band: Band;
  handleChange: Function;
};

const BandItem = (props: BandItemProps) => {
  const { band, handleChange } = props;

  return (
    <Flipped flipId={band.name}>
      <button
        data-bandname={band.name}
        data-bandid={band.id}
        onClick={(e) => handleChange(e)}
      >
        {band.name}
      </button>
    </Flipped>
  );
};

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
      <Flipper flipKey={bands}>
        <ul>
          {bands.map((band) => (
            <li className="band-option" key={band.id}>
              <BandItem band={band} handleChange={handleChange} />
            </li>
          ))}
        </ul>
      </Flipper>
    </section>
  );
};

export default BandList;

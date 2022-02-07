import { useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group"; // ES6

const BandDataList = (props) => {
  const { bands, setBands, setBandId } = props;
  // const { setBandId } = props;
  // const [bands, setBands] = useState([
  // { name: "1", id: 1 },
  // { name: "2", id: 2 },
  // { name: "3", id: 3 },
  // { name: "4", id: 4 },
  // ]);

  // const [bandName, setBandName] = useState("");

  const handleChange = (e) => {
    const bandname = e.target.dataset.bandname;
    const bandid = e.target.dataset.bandid;

    setBandId(bandid);
    // setBandName(bandname);
    setBands([{ name: bandname, id: bandid }]);
  };

  if (bands.length === 0) return null;

  return (
    <div id="band-options" style={{ height: bands.length * 20 }}>
      {/* <div> */}
      <TransitionGroup
        transitionName="band-option"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {bands.map((band) => (
          <CSSTransition key={band.id} classNames="band-option" timeout={500}>
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
          </CSSTransition>
        ))}
      </TransitionGroup>
      {/* </div> */}
    </div>
  );
};

export default BandDataList;

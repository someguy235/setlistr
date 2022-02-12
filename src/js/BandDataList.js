import { useEffect, useRef } from "react";
import * as d3 from "d3";

const BandDataList = (props) => {
  const { bands, setBands, setBandId } = props;
  const svgRef = useRef(null);

  // const [bandName, setBandName] = useState("");

  useEffect(() => {
    // console.log("useEffect");
    // console.log(bands);

    if (bands.length === 0) return;

    const svgEl = d3.select(svgRef.current);

    // TODO: handle the case where the original search only has one result
    if (bands.length === 1) {
      svgEl
        .selectAll(".band-option")
        .transition()
        .style("top", 0 + "px")
        .filter((d) => {
          return d.name !== bands[0].name;
        })
        .remove();
      return;
    }

    svgEl.selectAll("*").remove(); // Clear svg content before adding new elements
    svgEl
      .selectAll("div")
      .data(bands)
      .enter()
      .append("div")
      .attr("class", "band-option")
      .style("top", (d, i) => 70 * i + "px")
      .on("click", (e) => handleChange(e))
      .append("span")
      .attr("data-bandname", (d) => d.name)
      .attr("data-bandid", (d) => d.id)
      .text((d) => d.name);
  }, [bands]);

  const handleChange = (e) => {
    // console.log(e);
    const bandname = e.target.dataset.bandname;
    const bandid = e.target.dataset.bandid;

    setBandId(bandid);
    // setBandName(bandname);
    setBands([{ name: bandname, id: bandid }]);
  };

  if (bands.length === 0) return null;

  return (
    <div id="band-options-container">
      <div id="band-options" ref={svgRef} />
    </div>
    // <div id="band-options" style={{ height: bands.length * 20 }}>
    //   <TransitionGroup
    //     transitionName="band-option"
    //     transitionEnterTimeout={500}
    //     transitionLeaveTimeout={300}
    //   >
    //     {bands.map((band) => (
    //       <CSSTransition key={band.id} classNames="band-option" timeout={500}>
    //         <div className="band-option" key={band.id}>
    //           <span
    //             data-bandname={band.name}
    //             data-bandid={band.id}
    //             onClick={(e) => {
    //               handleChange(e);
    //             }}
    //             onKeyPress={(e) => {
    //               handleChange(e);
    //             }}
    //             role="button"
    //             tabIndex="0"
    //           >
    //             {band.name}
    //           </span>
    //         </div>
    //       </CSSTransition>
    //     ))}
    //   </TransitionGroup>
    // </div>
  );
};

export default BandDataList;

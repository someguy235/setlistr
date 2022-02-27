import { StrictMode } from "react";
import { render } from "react-dom";
import SearchParams from "./SearchParams";

const App = () => {
  return (
    <main>
      <h1>
        <span>Set</span>
        <span>Listr</span>
      </h1>
      <SearchParams />
    </main>
  );
};

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);

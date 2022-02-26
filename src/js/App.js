import { StrictMode } from "react";
import { render } from "react-dom";
import SearchParams from "./SearchParams";

// TODO: catch errors. phish?
// TODO: check for too many requests error?
// TODO: check album list vs mongo cache, in case some missing

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

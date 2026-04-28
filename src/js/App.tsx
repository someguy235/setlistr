import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

// app.get("/api/search/:search", (req, res) => {
//   res.json({ message: "Hello from the API" });
// });

app.get("/api/bands/:search", (req, res) => {
  res.json({ message: `bands api endpoint: ${req.params.search}` });
});

app.get("/api/albums/:band", (req, res) => {
  res.json({ message: "albums api endpoint" });
});

// app.get("/api/tracks/", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

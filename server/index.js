// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const api_path = "/api/v1/"

app.get(api_path, (req, res) => {
    res.json({ message: "Hello from server!" });
  });  

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
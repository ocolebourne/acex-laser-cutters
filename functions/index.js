const functions = require("firebase-functions");
const express = require("express");
require("dotenv").config();
const dbUtils = require("./utils/dbUtils");

const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from api!" });
});

app.get("/api/occupancy", async (req, res) => {
  const dbres = await dbUtils.findDoc("acex_info", { occupancy : { $exists: true } })
  res.json({ occupancy: parseInt(dbres[0].occupancy) });
});



exports.api = functions.https.onRequest(app);

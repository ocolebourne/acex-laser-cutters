const functions = require('firebase-functions');
const express = require('express')

const app = express()

app.get('*', (req, res) => {
  res.json({ message: "Hello from api!" });
  })

exports.api = functions.https.onRequest(app)

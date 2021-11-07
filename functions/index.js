const functions = require("firebase-functions");
const express = require("express");
require("dotenv").config();
const dbUtils = require("./utils/dbUtils");

const app = express();

app.get("/api", (req, res) => {
  res.json({ message: "Hello from api!" });
});

app.get("/api/occupancy", async (req, res) => {
  const dbres = await dbUtils.findDoc("current_users", {});
  res.json({ occupancy: parseInt(dbres.length) });
});

app.post("/api/tapin", async (req, res) => {
  //Endpoint for the card scanner, checking if a user has access.
  if (req.body.auth !== process.env.ESP_AUTH) {
    //auth code provided doesn't match
    console.log("Auth incorrect");
    res.status(401).send("Bad auth");
  } else {
    const params = ["card_id", "device_id", "scanner_name"];
    if (!checkParams(res, params, req.body)) { 
      //check expected parameters are recieved (preventing errors)
      return;
    } else {
      const card_id = req.body.card_id;
      const device_id = req.body.device_id;
      const scanner_name = req.body.scanner_name;
      const user = await dbUtils.findDoc("users", { //look for user by card_id
        card_id: parseInt(card_id),
      });
      const scanner = await dbUtils.findDoc("equipment", {
        name: scanner_name,
      });
      if (scanner.length <= 0) {
        res.status(404).send("Scanner not found");
        return;
      } else {
        const equip_name = scanner[0].devices[device_id];
        const equip = await dbUtils.findDoc("equipment", { name: equip_name });
        if (user.length <= 0) {
          //user not found in db
          console.log("User not found");
          res.status(404).send("User not found - access denied");
          return;
        } else if (equip[0].status == 1) {
          //equipment already turned on
          console.log("Equipment already on");
          res.status(404).send("Equipment already on");
          return;
        } else {
          console.log("User found, turning on Laser cutter");
          res.json({
            admit: true,
            plug_id: equip[0].plug_id,
            short_code: user[0].short_code,
            equip_name: equip[0].name,
          });
          await dbUtils.updateDoc(
            "equipment",
            { name: equip[0].name },
            { status: 1 }
          );
          const curr_user = user[0];
          delete curr_user._id;
          const dt_on = new Date().toISOString();
          curr_user.equip_name = equip_name;
          curr_user.dt_on = dt_on;
          const user_log = {
            short_code: curr_user.short_code,
            equip_name: equip[0].name,
            equip_id: equip[0]._id,
            dt_on: dt_on,
            dt_off: null,
          };
          await dbUtils.addDoc("usage_log", user_log);
          await dbUtils.addDoc("current_users", curr_user);
          return;
        }
      }
    }
  }
});

app.post("/api/turnoff", async (req, res) => {
  if (req.body.auth !== process.env.ESP_AUTH) {
    //auth code provided doesn't match
    console.log("Auth incorrect");
    res.status(401).send("Bad auth");
  } else {
    const params = ["device_id", "scanner_name"];
    if (!checkParams(res, params, req.body)) {
      return;
    } else {
      const device_id = req.body.device_id;
      const scanner_name = req.body.scanner_name;
      const scanner = await dbUtils.findDoc("equipment", {
        name: scanner_name,
      });
      if (scanner.length <= 0) {
        res.status(404).send("Scanner not found");
        return;
      } else {
        const equip_name = scanner[0].devices[device_id];
        const equip = await dbUtils.findDoc("equipment", { name: equip_name });
        await dbUtils.updateDoc(
          "equipment",
          { name: equip[0].name },
          { status: 0 }
        );
        const curr_user = await dbUtils.findDoc("current_users", {
          equip_name: equip_name,
        });
        if (curr_user.length <= 0) {
          //user not found in db
          console.log("User not found in current users");
          res.status(404).send("User not found in current users");
          return;
        } else {
          await dbUtils.deleteDoc("current_users", {
            equip_name: equip[0].name,
          });
          const dt_off = new Date().toISOString();
          await dbUtils.updateDoc(
            "usage_log",
            { equip_id: equip[0]._id, dt_on: curr_user[0].dt_on },
            { dt_off: dt_off }
          );
          console.log(`Turning off ${equip_name} - ${equip[0].nickname}`);
          res.send("Success");
          return;
        }
      }
    }
  }
});

// app.post("/api/turnoff", async (req, res) => { //post boiler plate
//   if (req.body.auth !== process.env.ESP_AUTH) {
//     //auth code provided doesn't match
//     console.log("Auth incorrect");
//     res.status(401).send("Bad auth");
//   } else {
//     const params = ["device_id", "scanner_name"];
//     if (!checkParams(res, params, req.body)) {
//       return;
//     } else {

//     }
//   }
// });

app.post("/api/gasreport", async (req, res) => {
  if (req.body.auth !== process.env.ESP_AUTH) {
    //auth code provided doesn't match
    console.log("Auth incorrect");
    res.status(401).send("Bad auth");
  } else {
    const params = ["values", "scanner_name"];
    if (!checkParams(res, params, req.body)) {
      return;
    } else {
      const values = JSON.parse(req.body.values);
      await dbUtils.addManyDocs("usage_log", values);
      res.send("Success");
    }
  }
});

function checkParams(res, params, body) {
  if (params.every((item) => body.hasOwnProperty(item))) {
    return true;
  } else {
    console.log("Incorrect params");
    res.status(400).send("Incorrect params");
    return false;
  }
}

exports.api = functions.https.onRequest(app);

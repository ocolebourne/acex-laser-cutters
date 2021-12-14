const functions = require("firebase-functions");
const express = require("express");
require("dotenv").config();
const dbUtils = require("./utils/dbUtils");
const middle = require("./utils/jwtMid");
const bcrypt = require("bcryptjs");
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");

const app = express();

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bo

app.get("/api", (req, res) => {
  res.json({ message: "Hello from api!" });
});

app.get("/api/occupancy", async (req, res) => {
  const dbres = await dbUtils.findDoc("current_users", {});
  res.json({ occupancy: parseInt(dbres.length) });
});

app.post("/api/tapinnoauth", async (req, res) => {
  //Endpoint for the card scanner, checking if a user has access.
  if (req.body.auth !== process.env.ESP_AUTH) {
    //auth code provided doesn't match
    console.log("Auth incorrect");
    res.status(403).send("Bad auth");
  } else {
    const params = ["card_id", "device_id", "scanner_name"];
    if (!checkParams(res, params, req.body)) {
      //check expected parameters are recieved (preventing errors)
      return;
    } else {
      const card_id = req.body.card_id;
      const device_id = req.body.device_id;
      const scanner_name = req.body.scanner_name;
      const user = await dbUtils.findDoc("users", {
        //look for user by card_id
        card_id: card_id,
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
        if (equip[0].status == 1) {
          //equipment already turned on
          console.log("Equipment already on");
          res.status(406).send("Equipment already on");
          return;
        } else {
          res.json({
            admit: true,
            plug_id: equip[0].plug_id,
            equip_name: equip[0].name,
          });
          console.log("Turning on Laser cutter" + equip[0].name);
          await dbUtils.updateDoc(
            "equipment",
            { name: equip[0].name },
            { status: 1 }
          );
          var curr_user = {};
          if (user.length > 0) {
            //user found in db
            console.log("User in db");
            curr_user = user[0];
            delete curr_user._id;
          } else {
            console.log("User not registered in db");
            curr_user = { card_id: card_id };
            curr_user.short_code = "User not in db";
          }
          const dt_on = new Date().toISOString();
          curr_user.equip_name = equip_name;
          curr_user.dt_on = dt_on;
          const user_log = {
            short_code: curr_user.short_code,
            card_id: card_id,
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

app.post("/api/tapin", async (req, res) => {
  //Endpoint for the card scanner, checking if a user has access.
  if (req.body.auth !== process.env.ESP_AUTH) {
    //auth code provided doesn't match
    console.log("Auth incorrect");
    res.status(403).send("Bad auth");
  } else {
    const params = ["card_id", "device_id", "scanner_name"];
    if (!checkParams(res, params, req.body)) {
      //check expected parameters are recieved (preventing errors)
      return;
    } else {
      const card_id = req.body.card_id;
      const device_id = req.body.device_id;
      const scanner_name = req.body.scanner_name;
      const user = await dbUtils.findDoc("users", {
        //look for user by card_id
        card_id: card_id,
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
          res.status(401).send("User not found - access denied");
          return;
        } else if (equip[0].status == 1) {
          //equipment already turned on
          console.log("Equipment already on");
          res.status(406).send("Equipment already on");
          return;
        } else {
          console.log("User found, turning on " + equip[0].name);
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
            card_id: card_id,
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
    res.status(403).send("Bad auth");
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
          console.log(
            `Turning off ${equip_name} anyway - ${equip[0].nickname}`
          );
          res.send("User not found in current users"); //res code 200 turn off anyway
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

app.post("/api/devicestatus", async (req, res) => {
  const params = ["scanner_name"];
  if (!checkParams(res, params, req.body)) {
    return;
  } else {
    const scanner = await dbUtils.findDoc("equipment", {
      name: req.body.scanner_name,
    });
    if (scanner.length <= 0) {
      res.status(404).send("Scanner not found");
      return;
    } else {
      const devices = await dbUtils.findDoc("equipment", {
        status: { $exists: true },
      });
      var devices_trans = {};
      await devices.forEach((device) => {
        devices_trans[device.name] = {
          nickname: device.nickname,
          status: device.status,
        };
      });
      var resArray = [];
      const scanner_devices = scanner[0].devices;
      await scanner_devices.forEach((device_name, index) => {
        resArray.push({
          index: index,
          name: device_name,
          nickname: devices_trans[device_name].nickname,
          status: devices_trans[device_name].status,
        });
      });
      res.json(resArray);
    }
  }
});

app.get("/api/getdevicestatuses", async (req, res) => {
  //for main public dashboard
  const devices = await dbUtils.findDoc("equipment", {
    status: { $exists: true },
  });
  var resArray = [];
  await devices.forEach((device, index) => {
    resArray.push({
      index: index,
      name: device.name,
      nickname: device.nickname,
      status: device.status,
    });
  });
  res.json(resArray);
});

app.get("/api/getchart1data", async (req, res) => {
  //for main public dashboard
  const usage = await dbUtils.findDoc("usage_log", {});
  const gas_reports = await dbUtils.findDoc("gas_readings", {});
  const scanner_equip = await dbUtils.findDoc("equipment", {
    name: "scanner1",
  });

  const scanner = scanner_equip[0];

  var gasData = [];
  var cutter0Data = [];
  var cutter1Data = [];

  var dt_on; //temp variables
  var dt_off;
  var dt_on_plus1;
  var dt_off_plus1;

  var tempData;

  await usage.forEach((log) => {
    dt_on = new Date(log.dt_on);
    dt_off = new Date(log.dt_on);
    dt_on_plus1 = new Date(dt_on.getTime() + 1000);
    dt_off_plus1 = new Date(dt_off.getTime() + 1000);
    tempData = [
      {
        dt: dt_on.getTime(),
        status: 0,
      },
      {
        dt: dt_on_plus1.getTime(),
        status: 1,
      },
      {
        dt: dt_off.getTime(),
        status: 1,
      },
      {
        dt: dt_off_plus1.getTime(),
        status: 0,
      },
    ];
    if (log.equip_name == scanner.devices[0]) {
      cutter0Data.push(...tempData);
    } else if (log.equip_name == scanner.devices[1]) {
      cutter1Data.push(...tempData);
    }
  });
  
  var gas_dt; //temp variable
  await gas_reports.forEach((report) => {
    gas_dt = new Date(report.dt);
    gasData.push({dt: gas_dt.getTime(), value: report.value});
  });

  var resArray = [];
  resArray = {
    gas: gasData,
    cutter0: cutter0Data,
    cutter1: cutter1Data,
  };

  res.json(resArray);
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
    console.log(req.body.auth);
    res.status(403).send("Bad auth");
  } else {
    const params = ["values", "sensor_id"];
    if (!checkParams(res, params, req.body)) {
      return;
    } else {
      const values = req.body.values;
      await dbUtils.addManyDocs("gas_readings", values);
      res.send("Success");
    }
  }
});

app.post("/api/changepass", async (req, res) => {
  const params = ["new_password", "old_password"];
  if (!checkParams(res, params, req.body)) {
    return;
  } else {
    var acex_info = await dbUtils.findDoc("acex_info", {});
    db_pass = acex_info[0].admin_password;
    if (
      bcrypt.compareSync(req.body.old_password, db_pass) ||
      req.body.old_password == process.env.PASS_RESET
    ) {
      const new_pass = bcrypt.hashSync(req.body.new_password, 10);
      await dbUtils.updateDoc(
        "acex_info",
        { admin_password: db_pass },
        { admin_password: new_pass }
      );
      res.send("Success");
    } else {
      console.log("Incorrect old password");
      res.status(401).send("Incorrect old password");
    }
  }
});

app.post("/api/login", async (req, res) => {
  const params = ["password"];
  if (!checkParams(res, params, req.body)) {
    return;
  } else {
    var acex_info = await dbUtils.findDoc("acex_info", {});
    db_pass = acex_info[0].admin_password;
    if (bcrypt.compareSync(req.body.password, db_pass)) {
      const token = jsonwebtoken.sign(
        { user: "acex" },
        process.env.JWT_SECRET,
        {
          expiresIn: "1800s",
        }
      );
      res.json({ token });
    } else {
      console.log("password incorrect");
      res.status(401).send("Incorrect password");
    }
  }
});

app.post("/api/adduser", middle.authenticateToken, async (req, res) => {
  const params = ["short_code", "card_id"];
  if (!checkParams(res, params, req.body)) {
    return;
  } else {
    console.log(req.body);
    await dbUtils.addDoc("users", {
      short_code: req.body.short_code,
      card_id: req.body.card_id,
      dt_added: new Date().toISOString(),
    });
    res.send("Success");
  }
});

app.post("/api/deluser", middle.authenticateToken, async (req, res) => {
  var delQuery = {};
  if (req.body.short_code) {
    delQuery = { short_code: req.body.short_code };
  } else if (req.body.card_id) {
    delQuery = { card_id: req.body.card_id };
  } else {
    const params = ["error"];
    checkParams(res, params);
  }
  console.log(req.body);
  const user = await dbUtils.findDoc("users", delQuery);
  if (user.length > 0) {
    await dbUtils.deleteDoc("users", delQuery);
    res.send("Success");
  } else {
    res.status(404).send("User not found");
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

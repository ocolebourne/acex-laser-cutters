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
  //Endpoint for getting current occupancy based on current_users (unused)
  const dbres = await dbUtils.findDoc("current_users", {});
  res.json({ occupancy: parseInt(dbres.length) });
});

//Power controller endpoints
app.post("/api/tapinnoauth", async (req, res) => {
  //Endpoint for the card scanner, temporary - allow any user but still log their usage
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
  //Endpoint for the card scanner, checking if a user has access then returning 200 if they do
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
  //Endpoint for the card scanner, turning off a piece of equipment
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
  //Endpoint for the card scanner resync function
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

//User frontend endpoints
app.get("/api/getdevicestatuses", async (req, res) => {
  //get device statuses for dashboard 
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
  //get data for chart 1 - usage vs gas on longer time frame
  const startDate = new Date(req.query.start);
  const endDate = new Date(req.query.end);
  const usage = await dbUtils.findDoc("usage_log", {
    dt_on: { $gte: startDate.toISOString(), $lt: endDate.toISOString() },
  });
  const gas_reports = await dbUtils.findDoc("gas_readings", {
    dt: { $gte: startDate.toISOString(), $lt: endDate.toISOString() },
  });
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
    dt_off = new Date(log.dt_off);
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
  const resolution = 6;
  var counter = 5;
  await gas_reports.forEach((report) => {
    if (counter == resolution) {
      gas_dt = new Date(report.dt);
      gasData.push({ dt: gas_dt.getTime(), value: report.value });
      counter = 0;
    } else {
      counter += 1;
    }
  });

  var resArray = [];
  resArray = {
    gas: gasData,
    cutter0: cutter0Data,
    cutter1: cutter1Data,
  };

  res.json(resArray);
});

app.get("/api/getchart2data", async (req, res) => {
  //get data for chart 2 - usage vs gas on daily timeframe
  const date = new Date(req.query.date);

  const startDate = new Date(date.setHours(8));
  const endDate = new Date(date.setHours(18));

  const usage = await dbUtils.findDoc("usage_log", {
    dt_on: { $gte: startDate.toISOString(), $lt: endDate.toISOString() },
  });
  const gas_reports = await dbUtils.findDoc("gas_readings", {
    dt: { $gte: startDate.toISOString(), $lt: endDate.toISOString() },
  });
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
  var on_value;

  var tempData;

  await usage.forEach((log) => {
    if (log.equip_name == scanner.devices[0]) {
      on_value = 1;
    } else {
      on_value = 0.99;
    }
    dt_on = new Date(log.dt_on);
    dt_on_plus1 = new Date(dt_on.getTime() + 1000);
    tempData = [
      {
        dt: dt_on.getTime(),
        status: 0,
      },
      {
        dt: dt_on_plus1.getTime(),
        status: on_value,
      },
    ];
    if (log.dt_off) {
      dt_off = new Date(log.dt_off);
      dt_off_plus1 = new Date(dt_off.getTime() + 1000);
      tempData.push(
        {
          dt: dt_off.getTime(),
          status: on_value,
        },
        {
          dt: dt_off_plus1.getTime(),
          status: 0,
        }
      );
    } else {
      //dt_off is null so cutter still in use
    }
    if (log.equip_name == scanner.devices[0]) {
      cutter0Data.push(...tempData);
    } else if (log.equip_name == scanner.devices[1]) {
      cutter1Data.push(...tempData);
    }
  });

  var gas_dt; //temp variable
  const resolution = 6;
  var counter = 6;
  await gas_reports.forEach((report) => {
    if (counter == resolution) {
      gas_dt = new Date(report.dt);
      gasData.push({ dt: gas_dt.getTime(), value: report.value });
      counter = 0;
    } else {
      counter += 1;
    }
  });

  var resArray = [];
  resArray = {
    gas: gasData,
    cutter0: cutter0Data,
    cutter1: cutter1Data,
  };

  res.json(resArray);
});

app.get("/api/getworkshopstats", async (req, res) => {
  //Get live analytics for user dashboard
  const datetime = new Date();
  const oneHourAgo = new Date(datetime.getTime() - 1000 * 60 * 60);
  const startOfDay = new Date(datetime.setHours(8, 0, 0, 0));

  const gas_reports = await dbUtils.findDoc("gas_readings", {
    dt: { $gte: startOfDay.toISOString() },
  });
  const gas_reports_hour = await dbUtils.findDoc("gas_readings", {
    dt: { $gte: oneHourAgo.toISOString() },
  });
  const usage = await dbUtils.findDoc("usage_log", {
    dt_on: { $gte: startOfDay.toISOString() },
  });

  const usersToday = usage.length; //number of usage logs since workshop opening OR 0 if before start of day

  var time_used = 0;
  var timeUsedToday = 0;
  usage.forEach((use) => {
    //for each usage log add the time in-use to total for the day. If before workshop opens / no usage stays 0
    if (use.dt_off) {
      time_used =
        new Date(use.dt_off).getTime() - new Date(use.dt_on).getTime();
    } else {
      time_used = new Date().getTime() - new Date(use.dt_on).getTime();
    }
    timeUsedToday += time_used;
  });

  var gas_total = 0;
  var counter = 0;

  gas_reports_hour.forEach((report) => {
    //sum all gas readings from last hour
    gas_total = gas_total + report.value;
    counter += 1;
  });
  const lastHourAverage = (gas_total / counter).toFixed(2); //find las hours gas reading average
  const [lastGasReading] = gas_reports_hour.slice(-1); //extract final reading, i.e. last reading
  const lastGasReadingValue = lastGasReading.value;
  const lastGasReadingDt = lastGasReading.dt;

  var total = 0;
  if (gas_reports.length > 60) {
    gas_reports.slice(0, 60).forEach((report) => {
      //sum the first 60 gas readings, i.e. the first 30minutes of the day from 8:00AM
      total += report.value;
    });
  }
  morningThreshold = ((total / 60) * 1.1).toFixed(2); //average from half an hour before lab was open, plus 10% buffer

  var isAboveMorning;
  if (lastGasReadingValue > morningThreshold) { //is the current gas value above this mornings threshold?
    isAboveMorning = 1;
  } else {
    isAboveMorning = 0;
  }

  const dangerThreshold = 300;
  var isDangerous;
  if (lastGasReadingValue > dangerThreshold) { //is the current gas value outside of the normal use maximum threshold?
    isDangerous = 1;
  } else {
    isDangerous = 0;
  }

  var resArray = [];
  resArray = {
    lastHourAverage: lastHourAverage,
    lastGasReadingValue: lastGasReadingValue,
    lastGasReadingDt: lastGasReadingDt,
    usersToday: usersToday,
    timeUsed: timeUsedToday,
    morningThreshold: morningThreshold,
    isDangerous: isDangerous,
    isAboveMorning: isAboveMorning,
  };

  res.json(resArray);
});

//Gas module endpoints
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

//Admin dashboard endpoints
app.post("/api/changepass", async (req, res) => {
  //endpoint to change admin password
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
  //endpoint to compare password with one in database and allow / deny admin access - return JWT
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
  //endpoint to add user to database
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
  //endpoint to remove user from database
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

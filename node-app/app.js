const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
var mqtt = require("mqtt");
const http = require("http");
const socketIo = require("socket.io");

const mongoOpts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect("mongodb://localhost:27017/iot", mongoOpts, (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to Database");
  }
});

const app = express();
const server = http.Server(app);
const io = socketIo(server);

const users = require("./routes/route");

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.use("/users", users);

app.get("*", (req, res) => {
  res.sendFile(__dirname + "\\public\\index.html");
});

const Appliance = require("./models/appliances");
const Device = require("./models/device");

// Add your MQTT broker link below
var mqttClient = mqtt.connect("<mqtt-broker-link>", {
  clientId: "Server",
});

const myClientList = {};

// Socket Connection
io.on("connection", (socket) => {
  myClientList[socket.id] = socket;

  Device.getDevice((err, device) => {
    myClientList[socket.id].emit("device-connected", device.connected);
  });

  socket.on("new-message", (message) => {
    mqttClient.publish("appliance", message);
  });

  socket.on("disconnect", (socket) => {
    delete myClientList[socket.id];
  });
});

// MQTT Connection
mqttClient.on("connect", () => {
  mqttClient.subscribe("/device", (msg) => {});
  mqttClient.subscribe("/connected", (msg) => {});
  mqttClient.subscribe("/device-connected", (msg) => {});
});

let connectionStatus = false;

setInterval(() => {
  connectionStatus = true;
  mqttClient.publish("checking-connection", "");
  setTimeout(() => {
    if (!connectionStatus) {
      Device.changeState(true, (device) => {});
      io.emit("device-connected", true);
    } else {
      Device.changeState(false, (device) => {});
      io.emit("device-connected", false);
    }
  }, 1000);
}, 1000);

function createNewDevice() {
  let device = new Device({ name: "NodeMCU", connected: false });
  Device.createDevice(device, (device) => {});
}

// createNewDevice(); -- Uncomment to create the NodeMCU Device

function convertToNumericWord(num) {
  if (num === 0) return "One";
  if (num === 1) return "Two";
  if (num === 2) return "Three";
}

mqttClient.on("message", function (topic, message) {
  if (message.toString() === "Connected.") {
    Device.changeState(true, (device) => {});
    Appliance.getAllApps({}, (err, apps) => {
      if (err) throw err;
      for (let i = 0; i < apps.length; i++) {
        const app = apps[i];
        let onOff = app.appOn ? 'On"' : 'Off"';
        mqttClient.publish("appliance", '"' + convertToNumericWord(i) + onOff);
      }
    });
  }

  if (topic === "/device") {
    io.emit("from-device", message.toString());
  }

  if (topic === "/device-connected") {
    connectionStatus = false;
  }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Server Started on port: " + port);
});

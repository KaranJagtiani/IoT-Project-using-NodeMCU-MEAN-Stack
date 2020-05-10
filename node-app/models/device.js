const mongoose = require("mongoose");

const appSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  connected: {
    type: Boolean,
    required: true,
  },
});

const Device = (module.exports = mongoose.model("Device", appSchema));

module.exports.createDevice = function (newDevice, callback) {
  newDevice.save(callback);
};

module.exports.getDevice = function (callback) {
  Device.findOne({}, callback);
};

module.exports.changeState = function (connected, callback) {
  Device.updateOne({}, { $set: { connected: connected } }, callback);
};

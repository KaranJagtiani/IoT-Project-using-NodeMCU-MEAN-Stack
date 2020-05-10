const mongoose = require("mongoose");

const appSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  appOn: {
    type: Boolean,
    required: false,
  },
  appOff: {
    type: Boolean,
    required: false,
  },
  timeStarted: {
    type: Date,
    required: false,
  },
  timeEnded: {
    type: Date,
    required: false,
  },
});

const Appliance = (module.exports = mongoose.model("Appliance", appSchema));

module.exports.getAppById = function (id, callback) {
  Appliance.findById({ _id: id }, callback);
};

module.exports.addApp = function (newUser, callback) {
  newUser.save(callback);
};

module.exports.getAppByName = function (name, callBack) {
  const query = { name: name };
  Appliance.findOne(query, callBack);
};

module.exports.getAllApps = function (query, callback) {
  Appliance.find(query, callback);
};

module.exports.deleteApp = function (name, callback) {
  Appliance.deleteOne({ name: name }, callback);
};

module.exports.appOn = function (name, callback) {
  Appliance.updateOne(
    { name: name },
    { $set: { timeStarted: new Date(), appOn: true, appOff: false } },
    callback
  );
};

module.exports.appOff = function (name, callback) {
  Appliance.updateOne(
    { name: name },
    { $set: { timeEnded: new Date(), appOff: true, appOn: false } },
    callback
  );
};

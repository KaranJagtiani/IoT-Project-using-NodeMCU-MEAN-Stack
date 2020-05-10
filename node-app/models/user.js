const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: false,
  },
});

const User = (module.exports = mongoose.model("User", userSchema));

module.exports.getUserById = function (id, callback) {
  User.findById({ _id: id }, callback);
};

module.exports.emailValidated = function (id, callback) {
  User.updateOne({ _id: id }, { $set: { authenticated: true } }, callback);
};

module.exports.getUserByUsername = function (username, callBack) {
  const query = { username: username };
  User.findOne(query, callBack);
};

module.exports.addUser = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
  if (!candidatePassword) {
    return false;
  }
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};

module.exports.updatePassword = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(newUser.newPassword, salt, (err, hash) => {
      if (err) throw err;
      newUser.newPassword = hash;
      User.updateOne(
        { username: newUser.username },
        { $set: { password: newUser.newPassword } },
        callback
      );
    });
  });
};

module.exports.getUserByEmail = function (email, callback) {
  User.findOne({ email: email }, callback);
};

module.exports.getAllUsers = function (query, callback) {
  User.find(query, { password: 0 }, callback);
};

module.exports.deleteAccount = function (username, callback) {
  User.deleteOne({ username: username }, callback);
};

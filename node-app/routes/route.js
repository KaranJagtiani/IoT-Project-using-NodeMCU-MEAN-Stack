const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const User = require("../models/user");
const Appliance = require("../models/appliances");

// router.post("/create-appliance", (req, res, next) => {
//   let newApp = new Appliance({
//     name: req.body.name,
//   });

//   Appliance.addApp(newApp, (err) => {
//     if (err) throw err;
//     res.json({ success: true, msg: "Appliance Turned Off." });
//   });
// });

router.post("/appliance-on", (req, res, next) => {
  let newApp = {
    name: req.body.name,
  };
  Appliance.getAppByName(newApp.name, (err, app) => {
    if (err) throw err;
    if (!app) {
      return res.json({ success: false, msg: "No Such Appliance Exists." });
    }
    Appliance.appOn(newApp.name, (err) => {
      if (err) throw err;
      res.json({ success: true, msg: "Appliance Turned Off." });
    });
  });
});

router.post("/appliance-off", (req, res, next) => {
  let newApp = {
    name: req.body.name,
  };
  Appliance.getAppByName(newApp.name, (err, app) => {
    if (err) throw err;
    if (!app) {
      return res.json({ success: false, msg: "No Such Appliance Exists." });
    }
    Appliance.appOff(newApp.name, (err) => {
      if (err) throw err;
      res.json({ success: true, msg: "Appliance Turned Off." });
    });
  });
});

router.get("/app-info", (req, res, next) => {
  Appliance.getAllApps({}, (err, app) => {
    if (err) throw err;
    res.json({
      success: true,
      user: app,
    });
  });
});

router.post("/register", (req, res, next) => {
  let newUser = new User({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
  });

  User.getUserByUsername(newUser.username, (err, user) => {
    if (err) throw err;
    if (user) {
      return res.json({
        success: false,
        usernameTaken: true,
        msg: "Account With This Username Already Exists.",
      });
    }
    User.addUser(newUser, (err) => {
      if (err) throw err;
      return res.json({ success: true, msg: "Registration Was Successful." });
    });
  });
});

router.post("/authenticate", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.json({ success: false, msg: "Fill in all the fields." });
  }
  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "Invalid Username." });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({ data: user }, config.secret, {
          expiresIn: "1d",
        });
        res.json({
          success: true,
          token: "JWT " + token,
          user: {
            id: user._id,
            username: user.username,
            name: user.studentName,
          },
        });
      } else {
        return res.json({ success: false, msg: "Invalid Password." });
      }
    });
  });
});

router.get(
  "/profile",
  passport.authenticate("user", { session: false }),
  (req, res, next) => {
    res.json({ success: true, user: req.user });
  }
);

router.post("/check_current_password", (req, res, next) => {
  const newUser = {
    username: req.body.username,
    password: req.body.password,
  };
  User.getUserByUsername(newUser.username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "Invalid Username." });
    }
    User.comparePassword(newUser.password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        return res.json({ success: false, msg: "Invalid Password." });
      }
      res.json({ success: true, msg: "Enter Your New Password" });
    });
  });
});

router.post("/update_password", (req, res, next) => {
  const newUser = {
    username: req.body.username,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
    newConfirmPassword: req.body.newConfirmPassword,
  };
  if (newUser.newPassword != newUser.newConfirmPassword) {
    return res.json({ success: false, msg: "Both Fields Do Not Match." });
  }
  if (newUser.currentPassword == newUser.newPassword) {
    return res.json({
      success: false,
      msg: "Current Password Matches With The New Password.",
    });
  }
  if (!/[A-Z]/.test(newUser.newPassword)) {
    return res.json({
      success: false,
      msg: "Password Must Contain a Uppercase Letter.",
    });
  }
  if (!/[0-9]/.test(newUser.newPassword)) {
    return res.json({ success: false, msg: "Password Must Contain a Number." });
  }
  if (!/\*?[#?!@$%^&*-]/.test(newUser.newPassword)) {
    return res.json({
      success: false,
      msg: "Password Must Contain a Special Character.",
    });
  }
  if (newUser.newPassword.length < 8) {
    return res.json({
      success: false,
      msg: "Password Must Be Atleast 8 Characters Long.",
    });
  }
  User.getUserByUsername(newUser.username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "User Not Found." });
    }
    User.comparePassword(
      newUser.currentPassword,
      user.password,
      (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) {
          return res.json({ success: false, msg: "Incorrect Password." });
        }
        User.updatePassword(newUser, (err) => {
          if (err) throw err;
          return res.json({ success: true, msg: "Password Updated." });
        });
      }
    );
  });
});

module.exports = router;

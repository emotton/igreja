const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const passport = require("passport");

var _ = require("underscore");

router.get("/", (req, res) => {
  res.render("dashboard/login/index");
});

router.post("/", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard/home",
    failureRedirect: "/dashboard/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;

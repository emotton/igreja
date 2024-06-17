const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("dashboard/home/index");
});

module.exports = router;

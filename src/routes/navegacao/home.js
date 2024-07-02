const express = require("express");
const router = express.Router();
const axios = require("axios");

const prefixUrl = "http://localhost:3000/";
const apiLoginUrl = "dashboard/api/login";

router.get("/", async (req, res) => {
  axios
    .post(prefixUrl + apiLoginUrl, {
      login: process.env.USER_API,
      senha: process.env.PASS_API,
    })
    .then((retorno) => {
      req.session.token = retorno.data.access_token;
    })
    .catch((error) => {
      let msg = [];
      if (error.response.data.errors != undefined) {
        error.response.data.errors.forEach((erro) => {
          msg.push(erro.msg);
        });
      }
      if (error.response.data.message) {
        msg = [error.response.data.message];
      }
      req.flash("error", msg);
    })
    .finally(() => {
      res.render("dashboard/home/index");
    });
});

module.exports = router;

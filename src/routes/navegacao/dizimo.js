const express = require("express");
const router = express.Router();

const axios = require("axios");

const prefixUrl = "http://localhost:3000/";
const apiDizimoUrl = "dashboard/api/dizimo";
const baseUrl = "dashboard/dizimo";

const { logged } = require("../../helpers/logged");

router.get("/list", logged, async (req, res) => {
  var data = new Date();
  var mes = String(data.getMonth() + 1).padStart(2, "0");
  var ano = data.getFullYear();
  var periodo = ano + mes;
  const lista = await axios.get(prefixUrl + apiDizimoUrl + "/" + periodo);
  res.render(baseUrl + "/index", {
    familias: lista.data,
  });
});

module.exports = router;

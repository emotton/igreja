const express = require("express");
const router = express.Router();

const axios = require("axios");

const prefixUrl = "http://localhost:3000/";
// const apiDizimoUrl = "dashboard/api/dizimo";
const apiFamiliaUrl = "dashboard/api/familia";
const baseUrl = "dashboard/dizimo";

const { logged } = require("../../helpers/logged");

router.get("/list", logged, async (req, res) => {
  const lista = await axios.get(prefixUrl + apiFamiliaUrl);
  res.render(baseUrl + "/index", {
    familias: lista.data,
  });
});

module.exports = router;

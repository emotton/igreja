const express = require("express");
const router = express.Router();

const axios = require("axios");

const prefixUrl = "http://localhost:3000/";
const apiUrl = "dashboard/api/usuario";
const baseUrl = "dashboard/usuario";

const { logged } = require("../helpers/logged");

router.get("/reset", logged, (req, res) => {
  req.session.searchIdUsuario = undefined;
  res.redirect("/" + baseUrl + "/list");
});

router.get("/:id", logged, async (req, res) => {
  let search = req.session.searchIdUsuario;

  const usu = await axios.get(prefixUrl + apiUrl + "/" + req.params.id);
  const lista = await axios.get(prefixUrl + apiUrl);
  res.render(baseUrl + "/consultar", {
    usuarios: lista.data,
    usuario: usu.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/", logged, async (req, res) => {
  let search = req.query.search
    ? req.query.search
    : req.session.searchIdUsuario;

  req.session.searchIdUsuario = search;

  const usu = await axios.get(prefixUrl + apiUrl);
  res.render(baseUrl + "/index", {
    usuarios: usu.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/edit/:id", logged, (req, res) => {
  let search = req.session.searchIdUsuario;

  axios.get(prefixUrl + apiUrl + "/" + req.params.id).then((usu) => {
    axios.get(prefixUrl + apiUrl).then((lista) => {
      res.render(baseUrl + "/alterar", {
        usuarios: lista.data,
        usuario: usu.data,
        search: search,
        anchor: "cadastro",
      });
    });
  });
});

module.exports = router;

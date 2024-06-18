const express = require("express");
const router = express.Router();

const axios = require("axios");

const prefixUrl = "http://localhost:3000/";
const apiUrl = "dashboard/api/usuario";
const baseUrl = "dashboard/usuario";

const { logged } = require("../../helpers/logged");

router.get("/reset", logged, (req, res) => {
  req.session.searchIdUsuario = undefined;
  res.redirect("/" + baseUrl + "/list");
});

router.get("/view/:id", logged, async (req, res) => {
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

router.get("/list", logged, async (req, res) => {
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

router.get("/edit/:id", logged, async (req, res) => {
  let search = req.session.searchIdUsuario;

  const usu = await axios.get(prefixUrl + apiUrl + "/" + req.params.id);
  const lista = await axios.get(prefixUrl + apiUrl);
  res.render(baseUrl + "/alterar", {
    usuarios: lista.data,
    usuario: usu.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/delete/:id", logged, async (req, res) => {
  let search = req.session.searchIdUsuario;

  const usu = await axios.get(prefixUrl + apiUrl + "/" + req.params.id);
  const lista = await axios.get(prefixUrl + apiUrl);
  res.render(baseUrl + "/excluir", {
    usuarios: lista.data,
    usuario: usu.data,
    search: search,
    anchor: "cadastro",
  });
});

router.post("/save", logged, async (req, res) => {
  await axios.post(prefixUrl + apiUrl, req.body);
  res.redirect("/" + baseUrl + "/list");
});

router.post("/update", logged, async (req, res) => {
  await axios.patch(prefixUrl + apiUrl, req.body);
  res.redirect("/" + baseUrl + "/list");
});

router.post("/delete", logged, async (req, res) => {
  await axios.delete(prefixUrl + apiUrl + "/" + req.body.id_usuario);
  res.redirect("/" + baseUrl + "/list");
});

module.exports = router;

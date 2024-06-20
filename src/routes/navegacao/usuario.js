const express = require("express");
const router = express.Router();

const axios = require("axios");

const prefixUrl = "http://localhost:3000/";
const apiUsuarioUrl = "dashboard/api/usuario";
const baseUrl = "dashboard/usuario";

const { logged } = require("../../helpers/logged");

router.get("/reset", logged, (req, res) => {
  req.session.searchIdUsuario = undefined;
  res.redirect("/" + baseUrl + "/list");
});

router.get("/view/:id", logged, async (req, res) => {
  let search = req.session.searchIdUsuario;

  const usuario = await axios.get(
    prefixUrl + apiUsuarioUrl + "/" + req.params.id
  );
  const lista = await axios.get(prefixUrl + apiUsuarioUrl);
  res.render(baseUrl + "/consultar", {
    usuarios: lista.data,
    usuario: usuario.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/list", logged, async (req, res) => {
  let search = req.query.search
    ? req.query.search
    : req.session.searchIdUsuario;

  req.session.searchIdUsuario = search;

  const lista = await axios.get(prefixUrl + apiUsuarioUrl);
  res.render(baseUrl + "/index", {
    usuarios: lista.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/edit/:id", logged, async (req, res) => {
  let search = req.session.searchIdUsuario;

  const usuario = await axios.get(
    prefixUrl + apiUsuarioUrl + "/" + req.params.id
  );
  const lista = await axios.get(prefixUrl + apiUsuarioUrl);
  res.render(baseUrl + "/alterar", {
    usuarios: lista.data,
    usuario: usuario.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/delete/:id", logged, async (req, res) => {
  let search = req.session.searchIdUsuario;

  const usuario = await axios.get(
    prefixUrl + apiUsuarioUrl + "/" + req.params.id
  );
  const lista = await axios.get(prefixUrl + apiUsuarioUrl);
  res.render(baseUrl + "/excluir", {
    usuarios: lista.data,
    usuario: usuario.data,
    search: search,
    anchor: "cadastro",
  });
});

router.post("/save", logged, (req, res) => {
  axios
    .post(prefixUrl + apiUsuarioUrl, req.body)
    .catch((error) => {
      req.flash("error", error.response.data.message);
    })
    .finally(() => {
      res.redirect("/" + baseUrl + "/list");
    });
});

router.post("/update", logged, (req, res) => {
  axios
    .patch(prefixUrl + apiUsuarioUrl, req.body)
    .catch((error) => {
      req.flash("error", error.response.data.message);
    })
    .finally(() => {
      res.redirect("/" + baseUrl + "/list");
    });
});

router.post("/delete", logged, async (req, res) => {
  await axios.delete(prefixUrl + apiUsuarioUrl + "/" + req.body.id_usuario);
  res.redirect("/" + baseUrl + "/list");
});

module.exports = router;

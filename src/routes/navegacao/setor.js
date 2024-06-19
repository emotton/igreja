const express = require("express");
const router = express.Router();

const axios = require("axios");

const prefixUrl = "http://localhost:3000/";
const apiUrl = "dashboard/api/setor";
const baseUrl = "dashboard/setor";

const { logged } = require("../../helpers/logged");

router.get("/reset", logged, (req, res) => {
  req.session.searchIdSetor = undefined;
  res.redirect("/" + baseUrl + "/list");
});

router.get("/view/:id", logged, async (req, res) => {
  let search = req.session.searchIdSetor;

  const setor = await axios.get(prefixUrl + apiUrl + "/" + req.params.id);
  const lista = await axios.get(prefixUrl + apiUrl);
  res.render(baseUrl + "/consultar", {
    setores: lista.data,
    setor: setor.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/list", logged, async (req, res) => {
  let search = req.query.search ? req.query.search : req.session.searchIdSetor;

  req.session.searchIdSetor = search;

  const setor = await axios.get(prefixUrl + apiUrl);
  res.render(baseUrl + "/index", {
    setores: setor.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/edit/:id", logged, async (req, res) => {
  let search = req.session.searchIdSetor;

  const setor = await axios.get(prefixUrl + apiUrl + "/" + req.params.id);
  const lista = await axios.get(prefixUrl + apiUrl);
  res.render(baseUrl + "/alterar", {
    setores: lista.data,
    setor: setor.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/delete/:id", logged, async (req, res) => {
  let search = req.session.searchIdSetor;

  const setor = await axios.get(prefixUrl + apiUrl + "/" + req.params.id);
  const lista = await axios.get(prefixUrl + apiUrl);
  res.render(baseUrl + "/excluir", {
    setores: lista.data,
    setor: setor.data,
    search: search,
    anchor: "cadastro",
  });
});

router.post("/save", logged, (req, res) => {
  axios
    .post(prefixUrl + apiUrl, req.body)
    .catch((error) => {
      req.flash("error", error.response.data.message);
    })
    .finally(() => {
      res.redirect("/" + baseUrl + "/list");
    });
});

router.post("/update", logged, (req, res) => {
  axios
    .patch(prefixUrl + apiUrl, req.body)
    .catch((error) => {
      req.flash("error", error.response.data.message);
    })
    .finally(() => {
      res.redirect("/" + baseUrl + "/list");
    });
});

router.post("/delete", logged, async (req, res) => {
  await axios.delete(prefixUrl + apiUrl + "/" + req.body.id_setor);
  res.redirect("/" + baseUrl + "/list");
});

module.exports = router;

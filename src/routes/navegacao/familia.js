const express = require("express");
const router = express.Router();

const axios = require("axios");

const prefixUrl = "http://localhost:3000/";
const apiFamiliaUrl = "dashboard/api/familia";
const apiSetorUrl = "dashboard/api/setor";
const baseUrl = "dashboard/familia";

const { logged } = require("../../helpers/logged");

router.get("/reset", logged, (req, res) => {
  req.session.searchIdFamilia = undefined;
  res.redirect("/" + baseUrl + "/list");
});

router.get("/view/:id", logged, async (req, res) => {
  let search = req.session.searchIdFamilia;

  const familia = await axios.get(
    prefixUrl + apiFamiliaUrl + "/" + req.params.id
  );
  const lista = await axios.get(prefixUrl + apiFamiliaUrl);
  const setores = await axios.get(prefixUrl + apiSetorUrl);
  setores.data.forEach((setor) => {
    if (setor.id_setor == familia.data.id_setor) {
      setor.CHECKED = true;
    }
  });
  res.render(baseUrl + "/consultar", {
    familias: lista.data,
    familia: familia.data,
    setores: setores.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/list", logged, async (req, res) => {
  let search = req.query.search
    ? req.query.search
    : req.session.searchIdFamilia;

  req.session.searchIdFamilia = search;

  const lista = await axios.get(prefixUrl + apiFamiliaUrl);
  const setores = await axios.get(prefixUrl + apiSetorUrl);
  res.render(baseUrl + "/index", {
    familias: lista.data,
    setores: setores.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/edit/:id", logged, async (req, res) => {
  let search = req.session.searchIdFamilia;

  const familia = await axios.get(
    prefixUrl + apiFamiliaUrl + "/" + req.params.id
  );
  const lista = await axios.get(prefixUrl + apiFamiliaUrl);
  const setores = await axios.get(prefixUrl + apiSetorUrl);
  setores.data.forEach((setor) => {
    if (setor.id_setor == familia.data.id_setor) {
      setor.CHECKED = true;
    }
  });
  res.render(baseUrl + "/alterar", {
    familias: lista.data,
    familia: familia.data,
    setores: setores.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/delete/:id", logged, async (req, res) => {
  let search = req.session.searchIdFamilia;

  const familia = await axios.get(
    prefixUrl + apiFamiliaUrl + "/" + req.params.id
  );
  const lista = await axios.get(prefixUrl + apiFamiliaUrl);
  const setores = await axios.get(prefixUrl + apiSetorUrl);
  setores.data.forEach((setor) => {
    if (setor.id_setor == familia.data.id_setor) {
      setor.CHECKED = true;
    }
  });
  res.render(baseUrl + "/excluir", {
    familias: lista.data,
    familia: familia.data,
    setores: setores.data,
    search: search,
    anchor: "cadastro",
  });
});

router.post("/save", logged, (req, res) => {
  axios
    .post(prefixUrl + apiFamiliaUrl, req.body)
    .catch((error) => {
      req.flash("error", error.response.data.message);
    })
    .finally(() => {
      res.redirect("/" + baseUrl + "/list");
    });
});

router.post("/update", logged, (req, res) => {
  axios
    .patch(prefixUrl + apiFamiliaUrl, req.body)
    .catch((error) => {
      req.flash("error", error.response.data.message);
    })
    .finally(() => {
      res.redirect("/" + baseUrl + "/list");
    });
});

router.post("/delete", logged, async (req, res) => {
  await axios.delete(prefixUrl + apiFamiliaUrl + "/" + req.body.id_familia);
  res.redirect("/" + baseUrl + "/list");
});

module.exports = router;

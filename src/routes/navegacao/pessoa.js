const express = require("express");
const router = express.Router();

const axios = require("axios");

const prefixUrl = "http://localhost:3000/";
const apiPessoaUrl = "dashboard/api/pessoa";
const apiFamiliaUrl = "dashboard/api/familia";
const baseUrl = "dashboard/pessoa";

const { logged } = require("../../helpers/logged");

router.get("/reset", logged, (req, res) => {
  req.session.searchIdPessoa = undefined;
  res.redirect("/" + baseUrl + "/list");
});

router.get("/view/:id", logged, async (req, res) => {
  let search = req.session.searchIdPessoa;

  const pessoa = await axios.get(
    prefixUrl + apiPessoaUrl + "/" + req.params.id
  );
  const familia = await axios.get(
    prefixUrl + apiFamiliaUrl + "/" + pessoa.data.id_familia
  );
  const lista = await axios.get(
    prefixUrl + apiPessoaUrl + "/familia/" + pessoa.data.id_familia
  );
  res.render(baseUrl + "/consultar", {
    familia: familia.data,
    pessoas: lista.data,
    pessoa: pessoa.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/familia/:id", logged, async (req, res) => {
  let search = req.query.search ? req.query.search : req.session.searchIdPessoa;

  req.session.searchIdPessoa = search;

  const familia = await axios.get(
    prefixUrl + apiFamiliaUrl + "/" + req.params.id
  );
  const lista = await axios.get(
    prefixUrl + apiPessoaUrl + "/familia/" + req.params.id
  );
  res.render(baseUrl + "/index", {
    idFamilia: req.params.id,
    familia: familia.data,
    pessoas: lista.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/edit/:id", logged, async (req, res) => {
  let search = req.session.searchIdPessoa;

  const pessoa = await axios.get(
    prefixUrl + apiPessoaUrl + "/" + req.params.id
  );
  const familia = await axios.get(
    prefixUrl + apiFamiliaUrl + "/" + pessoa.data.id_familia
  );
  const lista = await axios.get(
    prefixUrl + apiPessoaUrl + "/familia/" + pessoa.data.id_familia
  );
  res.render(baseUrl + "/alterar", {
    familia: familia.data,
    pessoas: lista.data,
    pessoa: pessoa.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/delete/:id", logged, async (req, res) => {
  let search = req.session.searchIdPessoa;

  const pessoa = await axios.get(
    prefixUrl + apiPessoaUrl + "/" + req.params.id
  );
  const familia = await axios.get(
    prefixUrl + apiFamiliaUrl + "/" + pessoa.data.id_familia
  );
  const lista = await axios.get(
    prefixUrl + apiPessoaUrl + "/familia/" + pessoa.data.id_familia
  );
  res.render(baseUrl + "/excluir", {
    familia: familia.data,
    pessoas: lista.data,
    pessoa: pessoa.data,
    search: search,
    anchor: "cadastro",
  });
});

router.post("/save", logged, (req, res) => {
  axios
    .post(prefixUrl + apiPessoaUrl, req.body)
    .catch((error) => {
      req.flash("error", error.response.data.message);
    })
    .finally(() => {
      res.redirect("/" + baseUrl + "/familia/" + req.body.id_familia);
    });
});

router.post("/update", logged, (req, res) => {
  axios
    .patch(prefixUrl + apiPessoaUrl, req.body)
    .catch((error) => {
      req.flash("error", error.response.data.message);
    })
    .finally(() => {
      res.redirect("/" + baseUrl + "/familia/" + req.body.id_familia);
    });
});

router.post("/delete", logged, async (req, res) => {
  await axios.delete(prefixUrl + apiPessoaUrl + "/" + req.body.id_pessoa);
  res.redirect("/" + baseUrl + "/familia/" + req.body.id_familia);
});

module.exports = router;

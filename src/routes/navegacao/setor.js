const express = require("express");
const router = express.Router();

const axios = require("axios");

const prefixUrl = "http://localhost:3000/";
const apiSetorUrl = "dashboard/api/setor";
const baseUrl = "dashboard/setor";

const { logged } = require("../../helpers/logged");

router.get("/reset", logged, (req, res) => {
  req.session.searchIdSetor = undefined;
  res.redirect("/" + baseUrl + "/list");
});

router.get("/view/:id", logged, async (req, res) => {
  let search = req.session.searchIdSetor;

  const setor = await axios.get(prefixUrl + apiSetorUrl + "/" + req.params.id);
  const lista = await axios.get(prefixUrl + apiSetorUrl);
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

  let lista = null;
  if (search != undefined) {
    lista = await axios.get(prefixUrl + apiSetorUrl + "/search/" + search);
  } else {
    lista = await axios.get(prefixUrl + apiSetorUrl);
  }

  res.render(baseUrl + "/index", {
    setores: lista.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/edit/:id", logged, async (req, res) => {
  const setor = await axios.get(prefixUrl + apiSetorUrl + "/" + req.params.id);
  const lista = await axios.get(prefixUrl + apiSetorUrl);
  res.render(baseUrl + "/alterar", {
    setores: lista.data,
    setor: setor.data,
    anchor: "cadastro",
  });
});

router.get("/delete/:id", logged, async (req, res) => {
  const setor = await axios.get(prefixUrl + apiSetorUrl + "/" + req.params.id);
  const lista = await axios.get(prefixUrl + apiSetorUrl);
  res.render(baseUrl + "/excluir", {
    setores: lista.data,
    setor: setor.data,
    anchor: "cadastro",
  });
});

router.post("/save", logged, (req, res) => {
  axios
    .post(prefixUrl + apiSetorUrl, req.body)
    .then(() => {
      req.flash("success_msg", "Inclusão com sucesso !");
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
      res.redirect("/" + baseUrl + "/list");
    });
});

router.post("/update", logged, (req, res) => {
  axios
    .patch(prefixUrl + apiSetorUrl, req.body)
    .then(() => {
      req.flash("success_msg", "Alteração com sucesso !");
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
      res.redirect("/" + baseUrl + "/list");
    });
});

router.post("/delete", logged, async (req, res) => {
  await axios
    .delete(prefixUrl + apiSetorUrl + "/" + req.body.id_setor)
    .then(() => {
      req.flash("success_msg", "Exclusão com sucesso !");
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
      res.redirect("/" + baseUrl + "/list");
    });
});

module.exports = router;

const express = require("express");
const router = express.Router();

const axios = require("axios");

const prefixUrl = "http://localhost:3000/";
const apiFamiliaUrl = "dashboard/api/familia";
const apiSetorUrl = "dashboard/api/setor";
const baseUrl = "dashboard/familia";

const { logged } = require("../../helpers/logged");

router.get("/reset", logged, (req, res) => {
  req.session.searchNomeFamilia = undefined;
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
    : req.session.searchNomeFamilia;

  req.session.searchNomeFamilia = search;

  let lista = null;
  if (search != undefined) {
    lista = await axios.get(prefixUrl + apiFamiliaUrl + "/search/" + search);
  } else {
    lista = await axios.get(prefixUrl + apiFamiliaUrl);
  }

  const setores = await axios.get(prefixUrl + apiSetorUrl);
  res.render(baseUrl + "/index", {
    familias: lista.data,
    setores: setores.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/edit/:id", logged, async (req, res) => {
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
    anchor: "cadastro",
  });
});

router.get("/delete/:id", logged, async (req, res) => {
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
    anchor: "cadastro",
  });
});

router.post("/save", logged, (req, res) => {
  axios
    .post(prefixUrl + apiFamiliaUrl, req.body)
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
    .patch(prefixUrl + apiFamiliaUrl, req.body)
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
    .delete(prefixUrl + apiFamiliaUrl + "/" + req.body.id_familia)
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

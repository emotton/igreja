const express = require("express");
const router = express.Router();

const axios = require("axios");

const prefixUrl = "http://localhost:3000/";
const apiUsuarioUrl = "dashboard/api/usuario";
const baseUrl = "dashboard/usuario";

const { logged } = require("../../helpers/logged");

router.get("/reset", logged, (req, res) => {
  req.session.searchNomeUsuario = undefined;
  res.redirect("/" + baseUrl + "/list");
});

router.get("/view/:id", logged, async (req, res) => {
  const usuario = await axios.get(
    prefixUrl + apiUsuarioUrl + "/" + req.params.id,
    {
      headers: {
        authorization: req.session.token,
      },
    }
  );
  const lista = await axios.get(prefixUrl + apiUsuarioUrl, {
    headers: {
      authorization: req.session.token,
    },
  });
  res.render(baseUrl + "/consultar", {
    usuarios: lista.data,
    usuario: usuario.data,
    anchor: "cadastro",
  });
});

router.get("/list", logged, async (req, res) => {
  let search = req.query.search
    ? req.query.search
    : req.session.searchNomeUsuario;
  req.session.searchNomeUsuario = search;

  let lista = null;
  if (search != undefined) {
    lista = await axios.get(prefixUrl + apiUsuarioUrl + "/search/" + search, {
      headers: {
        authorization: req.session.token,
      },
    });
  } else {
    lista = await axios.get(prefixUrl + apiUsuarioUrl, {
      headers: {
        authorization: req.session.token,
      },
    });
  }

  res.render(baseUrl + "/index", {
    usuarios: lista.data,
    search: search,
    anchor: "cadastro",
  });
});

router.get("/edit/:id", logged, async (req, res) => {
  const usuario = await axios.get(
    prefixUrl + apiUsuarioUrl + "/" + req.params.id,
    {
      headers: {
        authorization: req.session.token,
      },
    }
  );
  const lista = await axios.get(prefixUrl + apiUsuarioUrl, {
    headers: {
      authorization: req.session.token,
    },
  });
  res.render(baseUrl + "/alterar", {
    usuarios: lista.data,
    usuario: usuario.data,
    anchor: "cadastro",
  });
});

router.get("/delete/:id", logged, async (req, res) => {
  const usuario = await axios.get(
    prefixUrl + apiUsuarioUrl + "/" + req.params.id,
    {
      headers: {
        authorization: req.session.token,
      },
    }
  );
  const lista = await axios.get(prefixUrl + apiUsuarioUrl, {
    headers: {
      authorization: req.session.token,
    },
  });
  res.render(baseUrl + "/excluir", {
    usuarios: lista.data,
    usuario: usuario.data,
    anchor: "cadastro",
  });
});

router.post("/save", logged, (req, res) => {
  axios
    .post(prefixUrl + apiUsuarioUrl, req.body, {
      headers: {
        authorization: req.session.token,
      },
    })
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
    .patch(prefixUrl + apiUsuarioUrl, req.body, {
      headers: {
        authorization: req.session.token,
      },
    })
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
    .delete(prefixUrl + apiUsuarioUrl + "/" + req.body.id_usuario, {
      headers: {
        authorization: req.session.token,
      },
    })
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

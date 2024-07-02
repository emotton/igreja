const express = require("express");
const router = express.Router();

const axios = require("axios");

const prefixUrl = "http://localhost:3000/";
const apiDizimoUrl = "dashboard/api/dizimo";
const baseUrl = "dashboard/dizimo";
const { logged } = require("../../helpers/logged");

router.get("/list", logged, async (req, res) => {
  var data = new Date();
  var mes = String(data.getMonth() + 1).padStart(2, "0");
  var ano = data.getFullYear();
  var periodo = ano + mes;
  const valor = await axios.get(
    prefixUrl + apiDizimoUrl + "/" + periodo + "/valor",
    {
      headers: {
        authorization: req.session.token,
      },
    }
  );
  const lista = await axios.get(prefixUrl + apiDizimoUrl + "/" + periodo, {
    headers: {
      authorization: req.session.token,
    },
  });
  res.render(baseUrl + "/index", {
    familias: lista.data,
    valor: valor.data.valor,
  });
});

router.post("/save", logged, async (req, res) => {
  var data = new Date();
  var mes = String(data.getMonth() + 1).padStart(2, "0");
  var ano = data.getFullYear();
  var periodo = ano + mes;

  if (req.body.valor) {
    const valor = await axios.get(
      prefixUrl + apiDizimoUrl + "/" + periodo + "/valor",
      {
        headers: {
          authorization: req.session.token,
        },
      }
    );
    if (valor.data == "") {
      await axios.post(
        prefixUrl + apiDizimoUrl + "/valor",
        {
          mes: periodo,
          valor: req.body.valor,
        },
        {
          headers: {
            authorization: req.session.token,
          },
        }
      );
    } else {
      await axios.patch(
        prefixUrl + apiDizimoUrl + "/valor",
        {
          mes: periodo,
          valor: req.body.valor,
        },
        {
          headers: {
            authorization: req.session.token,
          },
        }
      );
    }
    req.flash("success_msg", "Gravação com sucesso !");
    res.redirect("/" + baseUrl + "/list");
  } else {
    var novo = [];
    if (Array.isArray(req.body.id_familia)) {
      // Transformar em numeros
      novo = req.body.id_familia.map(function (e) {
        return Number(e);
      });
    } else {
      if (typeof req.body.id_familia != "undefined") {
        novo = [Number(req.body.id_familia)];
      }
    }
    await axios
      .patch(
        prefixUrl + apiDizimoUrl,
        {
          mes: periodo,
          id_familia: novo,
        },
        {
          headers: {
            authorization: req.session.token,
          },
        }
      )
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
        req.flash("success_msg", "Gravação com sucesso !");
        res.redirect("/" + baseUrl + "/list");
      });
  }
});

module.exports = router;

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
    prefixUrl + apiDizimoUrl + "/" + periodo + "/valor"
  );
  const lista = await axios.get(prefixUrl + apiDizimoUrl + "/" + periodo);
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
      prefixUrl + apiDizimoUrl + "/" + periodo + "/valor"
    );
    if (valor.data == "") {
      await axios.post(prefixUrl + apiDizimoUrl + "/valor", {
        mes: periodo,
        valor: req.body.valor,
      });
    } else {
      await axios.patch(prefixUrl + apiDizimoUrl + "/valor", {
        mes: periodo,
        valor: req.body.valor,
      });
    }
    req.flash("success_msg", "Gravação com sucesso !");
    res.redirect("/" + baseUrl + "/list");
  } else {
    // Transformar em numeros
    var novo = req.body.id_familia;
    novo = novo.map(function (e) {
      return Number(e);
    });
    await axios
      .patch(prefixUrl + apiDizimoUrl, {
        mes: periodo,
        id_familia: novo,
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
        req.flash("success_msg", "Gravação com sucesso !");
        res.redirect("/" + baseUrl + "/list");
      });
  }
});

module.exports = router;

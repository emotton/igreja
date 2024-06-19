const express = require("express");
const router = express.Router();

const passport = require("passport");

var _ = require("underscore");

const { logged } = require("../../helpers/logged");

// Services
const preferenciasSelect = require("../services/preferencias/preferenciasSelect");
const preferenciasExists = require("../services/preferencias/preferenciasExists");
const preferenciasInsert = require("../services/preferencias/preferenciasInsert");
const preferenciasUpdate = require("../services/preferencias/preferenciasUpdate");
const carteiras = require("../services/bilhetagem/carteiras");
const produtos = require("../services/bilhetagem/produtos");
const linhas = require("../services/bilhetagem/linhas");

router.get("/", logged, (req, res) => {
  preferenciasExists.get(req.user.id).then((data) => {
    let qtde = data[0].QTDE;

    if (qtde > 0) {
      preferenciasSelect.get(req.user.id).then((prefsReg) => {
        let prefs = JSON.parse(prefsReg[0].VC_PREFERENCIAS);

        if (!prefs) {
          prefs = {};
          prefs.produtos = [];
          prefs.carteiras = [];
          prefs.linhas = [];
        }

        produtos.get().then((produtos) => {
          produtos.forEach((element) => {
            if (_.contains(prefs.produtos, element.ID.toString())) {
              element.CHECKED = true;
            }
          });
          carteiras.get().then((carteiras) => {
            carteiras.forEach((element) => {
              if (_.contains(prefs.carteiras, element.ID.toString())) {
                element.CHECKED = true;
              }
            });
            linhas.get().then((linhas) => {
              linhas.forEach((element) => {
                if (_.contains(prefs.linhas, element.ID.toString())) {
                  element.CHECKED = true;
                }
              });
              res.render("dashboard/preferencias/index", {
                produtos: produtos,
                carteiras: carteiras,
                linhas: linhas,
              });
            });
          });
        });
      });
    } else {
      prefs = {};
      prefs.produtos = [];
      prefs.carteiras = [];
      prefs.linhas = [];

      produtos.get().then((produtos) => {
        produtos.forEach((element) => {
          if (_.contains(prefs.produtos, element.ID.toString())) {
            element.CHECKED = true;
          }
        });
        carteiras.get().then((carteiras) => {
          carteiras.forEach((element) => {
            if (_.contains(prefs.carteiras, element.ID.toString())) {
              element.CHECKED = true;
            }
          });
          linhas.get().then((linhas) => {
            linhas.forEach((element) => {
              if (_.contains(prefs.linhas, element.ID.toString())) {
                element.CHECKED = true;
              }
            });
            res.render("dashboard/preferencias/index", {
              produtos: produtos,
              carteiras: carteiras,
              linhas: linhas,
            });
          });
        });
      });
    }
  });
});

router.post("/", logged, (req, res) => {
  let prefsObj = {
    produtos:
      req.body["pref-produto"] instanceof Array
        ? req.body["pref-produto"]
        : [req.body["pref-produto"]],
    carteiras:
      req.body["pref-carteira"] instanceof Array
        ? req.body["pref-carteira"]
        : [req.body["pref-carteira"]],
    linhas:
      req.body["pref-linha"] instanceof Array
        ? req.body["pref-linha"]
        : [req.body["pref-linha"]],
  };

  let prefsData = JSON.stringify(prefsObj);

  preferenciasExists.get(req.user.id).then((data) => {
    var prefs = {
      idUsuario: req.user.id,
      prefs: prefsData,
    };

    let qtde = data[0].QTDE;

    if (qtde == 0) {
      preferenciasInsert.insert(prefs).then(() => {
        res.redirect("/dashboard/preferencias");
      });
    } else {
      preferenciasUpdate.update(prefs).then(() => {
        res.redirect("/dashboard/preferencias");
      });
    }
  });
});

module.exports = router;

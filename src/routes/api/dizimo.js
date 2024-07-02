const express = require("express");
const router = express.Router();
const { param, body, validationResult } = require("express-validator");
const _ = require("underscore");

const { tokenJWT } = require("../../helpers/authAPI");

const dizimoService = require("../../services/dizimoService");

router.get(
  "/:mes",
  param("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.selectDizimoPagamentoByMes(
      req.params.mes
    );
    res.json(results);
  }
);

router.get(
  "/:mes/valor",
  param("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.selectDizimoByMes(req.params.mes);
    res.json(results[0]);
  }
);

router.post(
  "/",
  body("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  body("id_familia")
    .isInt({ min: 1 })
    .withMessage("Id da familia deve ser informado"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.insertDizimoPagamento(
      req.body.mes,
      req.body.id_familia
    );
    res.sendStatus(201);
  }
);

router.post(
  "/valor",
  body("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  body("valor").isFloat().withMessage("Valor deve ser informado"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.insertDizimo(
      req.body.mes,
      req.body.valor
    );
    res.sendStatus(201);
  }
);

router.delete(
  "/",
  body("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  body("id_familia")
    .isInt({ min: 1 })
    .withMessage("Id da familia deve ser informado"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.deleteDizimoPagamento(
      req.body.mes,
      req.body.id_familia
    );
    res.sendStatus(204);
  }
);

router.patch(
  "/",
  body("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const novo = req.body.id_familia;
    const base = await dizimoService.selectIdsDizimoPagamentoByMes(
      req.body.mes
    );
    const anterior = base.map(function (e) {
      return e.id_familia;
    });
    const remover = _.difference(anterior, novo);
    const incluir = _.difference(novo, anterior);

    remover.forEach((id) => {
      dizimoService.deleteDizimoPagamento(req.body.mes, id);
    });

    incluir.forEach((id) => {
      dizimoService.insertDizimoPagamento(req.body.mes, id);
    });

    res.sendStatus(200);
  }
);

router.patch(
  "/valor",
  body("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  body("valor").isFloat().withMessage("Valor deve ser informado"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.updateDizimo(
      req.body.mes,
      req.body.valor
    );
    res.sendStatus(200);
  }
);

module.exports = router;

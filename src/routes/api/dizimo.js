const express = require("express");
const router = express.Router();
const { param, body, validationResult } = require("express-validator");

const dizimoService = require("../../services/dizimoService");

router.get(
  "/:mes",
  param("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.selectDizimoByMes(req.params.mes);
    res.json(results);
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.insertDizimo(
      req.body.mes,
      req.body.id_familia
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.deleteDizimo(
      req.body.mes,
      req.body.id_familia
    );
    res.sendStatus(204);
  }
);

module.exports = router;

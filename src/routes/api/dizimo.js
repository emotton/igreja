const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const dizimoService = require("../../services/dizimoService");

router.post(
  "/",
  body("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.selectDizimoByMes(req.body.mes);
    res.json(results);
  }
);

module.exports = router;

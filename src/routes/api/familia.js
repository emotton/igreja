const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const familiaService = require("../../services/familiaService");

router.get("/", async (req, res) => {
  const results = await familiaService.selectFamilias();
  res.json(results);
});

router.get("/:id", async (req, res) => {
  const results = await familiaService.selectFamiliaById(req.params.id);
  res.json(results[0]);
});

router.get("/search/:search", async (req, res) => {
  const results = await familiaService.selectFamiliaByLikeNome(
    req.params.search
  );
  res.json(results);
});

router.post(
  "/",
  body("id_setor")
    .isInt({ min: 1 })
    .withMessage("Id Setor deve ser informado e numérico"),
  body("nome")
    .isLength({ min: 3, max: 40 })
    .withMessage("Nome entre 3 e 40 caracteres"),
  body("endereco")
    .isLength({ max: 40 })
    .withMessage("Endereço máximo de 40 caracteres"),
  body("numero")
    .isLength({ max: 10 })
    .withMessage("Número máximo de 10 caracteres"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await familiaService.insertFamilia(req.body);
    res.sendStatus(201);
  }
);

router.patch(
  "/",
  body("id_familia")
    .isInt({ min: 1 })
    .withMessage("Id Familia deve ser informado e numérico"),
  body("id_setor")
    .isInt({ min: 1 })
    .withMessage("Id Setor deve ser informado e numérico"),
  body("nome")
    .isLength({ min: 3, max: 40 })
    .withMessage("Nome entre 3 e 40 caracteres"),
  body("endereco")
    .isLength({ max: 40 })
    .withMessage("Endereço máximo de 40 caracteres"),
  body("numero")
    .isLength({ max: 10 })
    .withMessage("Número máximo de 10 caracteres"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await familiaService.updateFamilia(req.body);
    res.sendStatus(200);
  }
);

router.delete("/:id", async (req, res) => {
  const results = await familiaService.deleteFamilia(req.params.id);
  res.sendStatus(204);
});

module.exports = router;

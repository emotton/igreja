const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const pessoaService = require("../../services/pessoaService");

router.get("/", async (req, res) => {
  const results = await pessoaService.selectPessoas();
  res.json(results);
});

router.get("/:id", async (req, res) => {
  const results = await pessoaService.selectPessoaById(req.params.id);
  res.json(results[0]);
});

router.get("/familia/:id", async (req, res) => {
  const results = await pessoaService.selectPessoasByIdFamilia(req.params.id);
  res.json(results);
});

router.post(
  "/",
  body("id_familia")
    .isInt({ min: 1 })
    .withMessage("Id Familia deve ser informado e numérico"),
  body("nome")
    .isLength({ min: 3, max: 40 })
    .withMessage("Nome entre 3 e 40 caracteres"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await pessoaService.insertPessoa(req.body);
    res.sendStatus(201);
  }
);

router.patch(
  "/",
  body("id_familia")
    .isInt({ min: 1 })
    .withMessage("Id Familia deve ser informado e numérico"),
  body("nome")
    .isLength({ min: 3, max: 40 })
    .withMessage("Nome entre 3 e 40 caracteres"),
  body("id_pessoa")
    .isInt({ min: 1 })
    .withMessage("Id Pessoa deve ser informado e numérico"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await pessoaService.updatePessoa(req.body);
    res.sendStatus(200);
  }
);

router.delete("/:id", async (req, res) => {
  const results = await pessoaService.deletePessoa(req.params.id);
  res.sendStatus(204);
});

module.exports = router;

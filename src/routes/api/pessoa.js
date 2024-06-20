const express = require("express");
const router = express.Router();

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

router.post("/", async (req, res) => {
  const results = await pessoaService.insertPessoa(req.body);
  res.sendStatus(201);
});

router.patch("/", async (req, res) => {
  const results = await pessoaService.updatePessoa(req.body);
  res.sendStatus(200);
});

router.delete("/:id", async (req, res) => {
  const results = await pessoaService.deletePessoa(req.params.id);
  res.sendStatus(204);
});

module.exports = router;

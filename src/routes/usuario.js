const express = require("express");
const router = express.Router();

const usuarioService = require("../services/usuarioService");

const { logged } = require("../helpers/logged");

router.get("/", logged, async (req, res) => {
  const results = await usuarioService.selectUsuarios();
  res.json(results);
});

router.get("/:id", logged, async (req, res) => {
  const results = await usuarioService.selectUsuarioById(req.params.id);
  res.json(results);
});

router.post("/", logged, async (req, res) => {
  const results = await usuarioService.insertUsuario(req.body);
  res.sendStatus(201);
});

router.patch("/:id", logged, async (req, res) => {
  const results = await usuarioService.updateUsuario(req.params.id, req.body);
  res.sendStatus(200);
});

router.delete("/:id", logged, async (req, res) => {
  const results = await usuarioService.deleteUsuario(req.params.id);
  res.sendStatus(204);
});

module.exports = router;

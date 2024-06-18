const express = require("express");
const router = express.Router();

const usuarioService = require("../../services/usuarioService");

const { logged } = require("../../helpers/logged");

router.get("/", async (req, res) => {
  const results = await usuarioService.selectUsuarios();
  res.json(results);
});

router.get("/:id", async (req, res) => {
  const results = await usuarioService.selectUsuarioById(req.params.id);
  res.json(results[0]);
});

router.post("/", async (req, res) => {
  const usuario = await usuarioService.selectUsuarioByLogin(req.body.login);
  if (usuario.length == 0) {
    const results = await usuarioService.insertUsuario(req.body);
    res.sendStatus(201);
  } else {
    res.status(400).send({
      message: "login já existe",
    });
  }
});

router.patch("/", async (req, res) => {
  const id_atual = req.body.id_usuario;
  const usuario = await usuarioService.selectUsuarioByLogin(req.body.login);
  console.log(usuario);
  if (usuario.length == 0 || usuario[0].id_usuario == id_atual) {
    await usuarioService.updateUsuario(req.body);
    res.sendStatus(200);
  } else {
    res.status(400).send({
      message: "login já existe",
    });
  }
});

router.delete("/:id", async (req, res) => {
  const results = await usuarioService.deleteUsuario(req.params.id);
  res.sendStatus(204);
});

module.exports = router;

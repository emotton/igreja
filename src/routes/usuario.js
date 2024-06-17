const express = require("express");
const router = express.Router();

const usuarioService = require("../services/usuarioService");

router.get("/", async (req, res) => {
  const results = await usuarioService.selectUsuarios();
  res.json(results);
});

module.exports = router;

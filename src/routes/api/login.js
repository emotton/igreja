const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const usuarioService = require("../../services/usuarioService");

router.get("/", async (req, res) => {
  const usuario = await usuarioService.selectUsuarioByLogin(req.body.login);
  if (
    crypto.createHash("md5").update(req.body.senha).digest("hex") ==
    usuario[0].senha
  ) {
    // Gerar Token e retornar
    const id = usuario[0].id_usuario;
    const login = usuario[0].login;
    const access_token = jwt.sign(
      { id, user: login, type: "access" },
      process.env.SECRET_TOKEN,
      {
        expiresIn: 300, // expires in 5min
      }
    );
    const refresh_token = jwt.sign(
      { id, user: login, type: "refresh" },
      process.env.SECRET_TOKEN,
      {
        expiresIn: 3000, // expires in 50min
      }
    );
    res.json({ success: true, access_token, refresh_token });
  } else {
    res.status(403).json({ errors: ["Usuário/Senha incorretos"] });
  }
});

module.exports = router;

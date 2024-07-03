const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const usuarioService = require("../../services/usuarioService");

/**
 * @openapi
 * definitions:
 *   Login:
 *        type: object
 *        required:
 *          - login
 *          - senha
 *        properties:
 *          login:
 *            type: string
 *            default: emotton
 *          senha:
 *            type: string
 *            default: 1234
 *   LoginResponse:
 *         type: object
 *         properties:
 *            success:
 *               type: string
 *            access_token:
 *               type: string
 *            refresh_token:
 *               type: string
 */

/**
 * @openapi
 * /dashboard/api/login:
 *   post:
 *     tags:
 *        - Login
 *     description: login
 *     produces:
 *        - application/json
 *     parameters:
 *       - name: login
 *         description: login do usuário
 *         in: body
 *         required: true
 *         schema:
 *            $ref: '#/definitions/Login'
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *            $ref: '#/definitions/LoginResponse'
 *       403:
 *         description: Usuário/Senha incorretos
 */
router.post("/", async (req, res) => {
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
        expiresIn: 60 * 60 * 24, // 24 horas
      }
    );
    const refresh_token = jwt.sign(
      { id, user: login, type: "refresh" },
      process.env.SECRET_TOKEN,
      {
        expiresIn: 60 * 60 * 24 * 3, // 3 dias
      }
    );
    res.json({ success: true, access_token, refresh_token });
  } else {
    res.status(403).json({ errors: ["Usuário/Senha incorretos"] });
  }
});

router.get("/refresh", async (req, res) => {
  const token = req.headers["authorization"];
  jwt.verify(token, process.env.SECRET_TOKEN, function (err, decoded) {
    if (err) {
      return res
        .status(500)
        .json({ auth: false, message: "Failed to authenticate token." });
    }
    if (decoded.type === "refresh") {
      // Gerar Token e retornar
      const id = decoded.id;
      const login = decoded.user;
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
      return res.status(500).json({
        auth: false,
        message: "Failed to authenticate token. [Access]",
      });
    }
  });
});

module.exports = router;

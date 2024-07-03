const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { tokenJWT } = require("../../helpers/authAPI");

const usuarioService = require("../../services/usuarioService");

const { logged } = require("../../helpers/logged");

/**
 * @openapi
 * definitions:
 *   Usuário:
 *        type: object
 *        required:
 *          - nome
 *          - login
 *          - senha
 *        properties:
 *          nome:
 *            type: string
 *            default: Jose Carlos Pereira
 *          login:
 *            type: string
 *            default: jcarlos
 *          senha:
 *            type: string
 *            default: 123456
 *   Usuários:
 *        type: object
 *        properties:
 *          id_usuario:
 *            type: integer
 *          nome:
 *            type: string
 *          login:
 *            type: string
 *          senha:
 *            type: string
 */

/**
 * @openapi
 * /dashboard/api/usuario:
 *   get:
 *      tags:
 *        - Usuário
 *      description: Retorna todos os usuários
 *      responses:
 *         200:
 *            description: Success
 *            schema:
 *               type: array
 *               items:
 *                   $ref: '#/definitions/Usuários'
 *         401:
 *            description: No token provided.
 */
router.get("/", tokenJWT, async (req, res) => {
  const results = await usuarioService.selectUsuarios();
  res.json(results);
});

/**
 * @openapi
 * /dashboard/api/usuario/{id}:
 *   get:
 *      tags:
 *        - Usuário
 *      description: Retorna um usuário pelo id
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            type: integer
 *      responses:
 *         200:
 *            description: Success
 *            schema:
 *               type: object
 *               $ref: '#/definitions/Setores'
 *         401:
 *            description: No token provided.
 */
router.get("/:id", tokenJWT, async (req, res) => {
  const results = await usuarioService.selectUsuarioById(req.params.id);
  res.json(results[0]);
});

router.get("/search/:search", tokenJWT, async (req, res) => {
  const results = await usuarioService.selectUsuarioByLikeNome(
    req.params.search
  );
  res.json(results);
});

router.post(
  "/",
  body("login")
    .isLength({ min: 3, max: 30 })
    .withMessage("Login entre 3 e 30 caracteres"),
  body("nome")
    .isLength({ min: 3, max: 30 })
    .withMessage("Nome entre 3 e 30 caracteres"),
  body("senha")
    .isLength({ min: 4, max: 30 })
    .withMessage("Senha entre 4 e 30 caracteres"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const usuario = await usuarioService.selectUsuarioByLogin(req.body.login);
    if (usuario.length == 0) {
      const results = await usuarioService.insertUsuario(req.body);
      res.sendStatus(201);
    } else {
      res.status(400).send({
        message: "login já existe",
      });
    }
  }
);

router.patch(
  "/",
  body("login")
    .isLength({ min: 3, max: 30 })
    .withMessage("Login entre 3 e 30 caracteres"),
  body("nome")
    .isLength({ min: 3, max: 30 })
    .withMessage("Nome entre 3 e 30 caracteres"),
  body("senha")
    .isLength({ min: 4, max: 30 })
    .withMessage("Senha entre 4 e 30 caracteres"),
  body("id_usuario")
    .isInt({ min: 1 })
    .withMessage("Id usuario deve ser informado e numérico"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id_atual = req.body.id_usuario;
    const usuario = await usuarioService.selectUsuarioByLogin(req.body.login);
    if (usuario.length == 0 || usuario[0].id_usuario == id_atual) {
      await usuarioService.updateUsuario(req.body);
      res.sendStatus(200);
    } else {
      res.status(400).send({
        message: "login já existe",
      });
    }
  }
);

router.delete("/:id", tokenJWT, async (req, res) => {
  const results = await usuarioService.deleteUsuario(req.params.id);
  res.sendStatus(204);
});

module.exports = router;

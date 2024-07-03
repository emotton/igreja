const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const { tokenJWT } = require("../../helpers/authAPI");
const pessoaService = require("../../services/pessoaService");

/**
 * @openapi
 * definitions:
 *   Pessoa:
 *        type: object
 *        required:
 *          - id_familia
 *          - nome
 *        properties:
 *          id_familia:
 *            type: integer
 *            default: 1
 *          nome:
 *            type: string
 *            default: Jose Carlos Pereira
 *   Pessoas:
 *        type: object
 *        properties:
 *          id_pessoa:
 *            type: integer
 *          nome:
 *            type: string
 */

/**
 * @openapi
 * /dashboard/api/pessoa:
 *   get:
 *      tags:
 *        - Pessoa
 *      description: Retorna todas as pessoas
 *      security:
 *        - APIKeyHeader: []
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: array
 *            items:
 *               $ref: '#/definitions/Pessoas'
 *        401:
 *          description: No token provided.
 */
router.get("/", tokenJWT, async (req, res) => {
  const results = await pessoaService.selectPessoas();
  res.json(results);
});

/**
 * @openapi
 * /dashboard/api/pessoa/{id}:
 *   get:
 *      tags:
 *        - Pessoa
 *      description: Retorna uma pessoa pelo id
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            type: integer
 *      security:
 *        - APIKeyHeader: []
 *      responses:
 *         200:
 *            description: Success
 *            schema:
 *               type: object
 *               $ref: '#/definitions/Pessoas'
 *         401:
 *            description: No token provided.
 */
router.get("/:id", tokenJWT, async (req, res) => {
  const results = await pessoaService.selectPessoaById(req.params.id);
  res.json(results[0]);
});

/**
 * @openapi
 * /dashboard/api/pessoa/familia/{id_familia}:
 *   get:
 *      tags:
 *        - Pessoa
 *      description: Retorna pessoas pelo id_familia
 *      parameters:
 *          - in: path
 *            name: id_familia
 *            required: true
 *            type: integer
 *      security:
 *        - APIKeyHeader: []
 *      responses:
 *         200:
 *            description: Success
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/definitions/Pessoas'
 *         401:
 *            description: No token provided.
 */
router.get("/familia/:id", tokenJWT, async (req, res) => {
  const results = await pessoaService.selectPessoasByIdFamilia(req.params.id);
  res.json(results);
});

/**
 * @openapi
 * /dashboard/api/pessoa:
 *   post:
 *      tags:
 *        - Pessoa
 *      description: Incluir uma pessoa
 *      produces:
 *        - application/json
 *      parameters:
 *       - name: pessoa
 *         description: pessoa
 *         in: body
 *         required: true
 *         schema:
 *            $ref: '#/definitions/Pessoa'
 *      security:
 *        - APIKeyHeader: []
 *      responses:
 *         200:
 *            description: Success
 *         401:
 *            description: No token provided.
 */
router.post(
  "/",
  body("id_familia")
    .isInt({ min: 1 })
    .withMessage("Id Familia deve ser informado e numérico"),
  body("nome")
    .isLength({ min: 3, max: 40 })
    .withMessage("Nome entre 3 e 40 caracteres"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await pessoaService.insertPessoa(req.body);
    res.sendStatus(201);
  }
);

/**
 * @openapi
 * /dashboard/api/pessoa:
 *   patch:
 *      tags:
 *        - Pessoa
 *      description: Alterar uma pessoa
 *      produces:
 *        - application/json
 *      parameters:
 *       - name: pessoa
 *         description: pessoa
 *         in: body
 *         required: true
 *         schema:
 *            $ref: '#/definitions/Pessoas'
 *      security:
 *        - APIKeyHeader: []
 *      responses:
 *         200:
 *            description: Success
 *         401:
 *            description: No token provided.
 */
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
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await pessoaService.updatePessoa(req.body);
    res.sendStatus(200);
  }
);

/**
 * @openapi
 * /dashboard/api/pessoa/{id}:
 *   delete:
 *      tags:
 *        - Pessoa
 *      description: Exclui uma pessoa pelo id
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            type: integer
 *      security:
 *        - APIKeyHeader: []
 *      responses:
 *         200:
 *            description: Success
 *         401:
 *            description: No token provided.
 */
router.delete("/:id", tokenJWT, async (req, res) => {
  const results = await pessoaService.deletePessoa(req.params.id);
  res.sendStatus(204);
});

module.exports = router;

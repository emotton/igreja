const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const { tokenJWT } = require("../../helpers/authAPI");
const familiaService = require("../../services/familiaService");

/**
 * @openapi
 * definitions:
 *   Familia:
 *        type: object
 *        required:
 *          - id_setor
 *          - nome
 *          - endereco
 *          - numero
 *        properties:
 *          id_setor:
 *            type: integer
 *            default: 1
 *          nome:
 *            type: string
 *            default: Jose Carlos Pereira
 *          endereco:
 *            type: string
 *            default: Rua José Pereira da Silva
 *          numero:
 *            type: string
 *            default: 123
 *   Familias:
 *        type: object
 *        properties:
 *          id_familia:
 *            type: integer
 *            default: 1
 *          id_setor:
 *            type: integer
 *            default: 1
 *          nome:
 *            type: string
 *            default: Família Costa
 *          endereco:
 *            type: string
 *            default: Rua Pereira da Silva
 *          numero:
 *            type: string
 *            default: 1234
 */

/**
 * @openapi
 * /dashboard/api/familia:
 *   get:
 *      tags:
 *        - Família
 *      description: Retorna todas as famílias
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/definitions/Familias'
 *        401:
 *          description: No token provided.
 */
router.get("/", tokenJWT, async (req, res) => {
  const results = await familiaService.selectFamilias();
  res.json(results);
});

/**
 * @openapi
 * /dashboard/api/familia/{id}:
 *   get:
 *      tags:
 *        - Família
 *      description: Retorna uma família pelo id
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            type: integer
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: object
 *            $ref: '#/definitions/Familias'
 *        401:
 *          description: No token provided.
 */
router.get("/:id", tokenJWT, async (req, res) => {
  const results = await familiaService.selectFamiliaById(req.params.id);
  res.json(results[0]);
});

/**
 * @openapi
 * /dashboard/api/familia/search/{search}:
 *   get:
 *      tags:
 *        - Família
 *      description: Retorna uma família pelo search procurado no nome
 *      parameters:
 *          - in: path
 *            name: search
 *            required: true
 *            type: string
 *      responses:
 *         200:
 *            description: Success
 *            schema:
 *               type: array
 *               items:
 *                   $ref: '#/definitions/Familias'
 *         401:
 *            description: No token provided.
 */
router.get("/search/:search", tokenJWT, async (req, res) => {
  const results = await familiaService.selectFamiliaByLikeNome(
    req.params.search
  );
  res.json(results);
});

/**
 * @openapi
 * /dashboard/api/familia:
 *   post:
 *      tags:
 *        - Família
 *      description: Incluir uma família
 *      produces:
 *        - application/json
 *      parameters:
 *       - name: família
 *         description: família
 *         in: body
 *         required: true
 *         schema:
 *            $ref: '#/definitions/Familia'
 *      responses:
 *         200:
 *            description: Success
 *         401:
 *            description: No token provided.
 */
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
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await familiaService.insertFamilia(req.body);
    res.sendStatus(201);
  }
);

/**
 * @openapi
 * /dashboard/api/familia:
 *   patch:
 *      tags:
 *        - Família
 *      description: Alterar uma família
 *      produces:
 *        - application/json
 *      parameters:
 *       - name: família
 *         description: família
 *         in: body
 *         required: true
 *         schema:
 *            $ref: '#/definitions/Familias'
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
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await familiaService.updateFamilia(req.body);
    res.sendStatus(200);
  }
);

/**
 * @openapi
 * /dashboard/api/familia/{id}:
 *   delete:
 *      tags:
 *        - Família
 *      description: Exclui uma família pelo id
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            type: integer
 *      responses:
 *         200:
 *            description: Success
 *         401:
 *            description: No token provided.
 */
router.delete("/:id", tokenJWT, async (req, res) => {
  const results = await familiaService.deleteFamilia(req.params.id);
  res.sendStatus(204);
});

module.exports = router;

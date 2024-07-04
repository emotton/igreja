const express = require("express");
const router = express.Router();
const { param, body, validationResult } = require("express-validator");
const _ = require("underscore");

const { tokenJWT } = require("../../helpers/authAPI");

const dizimoService = require("../../services/dizimoService");

/**
 * @openapi
 * definitions:
 *   Dizimo_Lista:
 *        type: object
 *        properties:
 *          id_familia:
 *            type: integer
 *            default: 1
 *          nome:
 *            type: string
 *            default: Maria do Carmo Pereira
 *          status:
 *            type: string
 *            default: Pago
 *   Dizimo_Valor:
 *        type: object
 *        properties:
 *          mes:
 *            type: string
 *            default: 202407
 *          valor:
 *            type: float
 *            default: 12000.00
 *   Dizimo_Id_Familia:
 *        type: object
 *        properties:
 *          mes:
 *            type: string
 *            default: 202407
 *          id_familia:
 *            type: integer
 *            default: 1
 *   Dizimo_Ids_Familia:
 *        type: object
 *        properties:
 *          mes:
 *            type: string
 *            default: 202407
 *          id_familia:
 *            type: string
 *            default: [1,2,3]
 */

/**
 * @openapi
 * /dashboard/api/dizimo/{mes}:
 *   get:
 *      tags:
 *        - Dizimo
 *      description: Retorna uma lista com todos as famílias, setando quem pagou
 *      security:
 *        - APIKeyHeader: []
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: array
 *            items:
 *               $ref: '#/definitions/Dizimo_Lista'
 *        401:
 *          description: No token provided.
 */
router.get(
  "/:mes",
  param("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.selectDizimoPagamentoByMes(
      req.params.mes
    );
    res.json(results);
  }
);

/**
 * @openapi
 * /dashboard/api/dizimo/{mes}/valor:
 *   get:
 *      tags:
 *        - Dizimo
 *      description: Retorna o valor total de dizimo no mês
 *      parameters:
 *          - in: path
 *            name: mes
 *            required: true
 *            type: string
 *            default: 202407
 *      security:
 *        - APIKeyHeader: []
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: object
 *            $ref: '#/definitions/Dizimo_Valor'
 *        401:
 *          description: No token provided.
 */
router.get(
  "/:mes/valor",
  param("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.selectDizimoByMes(req.params.mes);
    res.json(results[0]);
  }
);

/**
 * @openapi
 * /dashboard/api/dizimo:
 *   post:
 *      tags:
 *          - Dizimo
 *      description: Incluir a indicação de que a família pagou
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: Dizimo_Id_Familia
 *          description: Id_Familia
 *          in: body
 *          schema:
 *            $ref: '#/definitions/Dizimo_Id_Familia'
 *      security:
 *        - APIKeyHeader: []
 *      responses:
 *        201:
 *          description: Success
 *        401:
 *          description: No token provided.
 */
router.post(
  "/",
  body("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  body("id_familia")
    .isInt({ min: 1 })
    .withMessage("Id da familia deve ser informado"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.insertDizimoPagamento(
      req.body.mes,
      req.body.id_familia
    );
    res.sendStatus(201);
  }
);

/**
 * @openapi
 * /dashboard/api/dizimo/valor:
 *   post:
 *      tags:
 *          - Dizimo
 *      description: Incluir valor total do Mês
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: Dizimo_Valor
 *          description: Dizimo Valor
 *          in: body
 *          schema:
 *            $ref: '#/definitions/Dizimo_Valor'
 *      security:
 *        - APIKeyHeader: []
 *      responses:
 *        201:
 *          description: Success
 *        401:
 *          description: No token provided.
 */
router.post(
  "/valor",
  body("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  body("valor").isFloat().withMessage("Valor deve ser informado"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.insertDizimo(
      req.body.mes,
      req.body.valor
    );
    res.sendStatus(201);
  }
);

/**
 * @openapi
 * /dashboard/api/dizimo:
 *   delete:
 *      tags:
 *          - Dizimo
 *
 *      description: Excluir a indicação de que a família pagou
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: Dizimo_Id_Familia
 *          description: Id_Familia
 *          in: body
 *          schema:
 *            $ref: '#/definitions/Dizimo_Id_Familia'
 *      security:
 *        - APIKeyHeader: []
 *      responses:
 *        204:
 *          description: Success
 *        401:
 *          description: No token provided.
 */
router.delete(
  "/",
  body("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  body("id_familia")
    .isInt({ min: 1 })
    .withMessage("Id da familia deve ser informado"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.deleteDizimoPagamento(
      req.body.mes,
      req.body.id_familia
    );
    res.sendStatus(204);
  }
);

/**
 * @openapi
 * /dashboard/api/dizimo:
 *   patch:
 *      tags:
 *          - Dizimo
 *      description: Atualizar famílias que efetuaram pagamento no mês
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: Dizimo_Ids_Familias
 *          description: Dizimo Ids Familias
 *          in: body
 *          schema:
 *            $ref: '#/definitions/Dizimo_Ids_Familia'
 *      security:
 *        - APIKeyHeader: []
 *      responses:
 *        200:
 *          description: Success
 *        401:
 *          description: No token provided.
 */
router.patch(
  "/",
  body("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const novo = req.body.id_familia;
    const base = await dizimoService.selectIdsDizimoPagamentoByMes(
      req.body.mes
    );
    const anterior = base.map(function (e) {
      return e.id_familia;
    });
    const remover = _.difference(anterior, novo);
    const incluir = _.difference(novo, anterior);

    remover.forEach((id) => {
      dizimoService.deleteDizimoPagamento(req.body.mes, id);
    });

    incluir.forEach((id) => {
      dizimoService.insertDizimoPagamento(req.body.mes, id);
    });

    res.sendStatus(200);
  }
);

/**
 * @openapi
 * /dashboard/api/dizimo/valor:
 *   patch:
 *      tags:
 *          - Dizimo
 *      description: Alterar valor total do Mês
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: Dizimo_Valor
 *          description: Dizimo Valor
 *          in: body
 *          schema:
 *            $ref: '#/definitions/Dizimo_Valor'
 *      security:
 *        - APIKeyHeader: []
 *      responses:
 *        200:
 *          description: Success
 *        401:
 *          description: No token provided.
 */
router.patch(
  "/valor",
  body("mes")
    .isLength({ min: 6, max: 6 })
    .withMessage("Ano e mês deve ser informado AAAAMM"),
  body("valor").isFloat().withMessage("Valor deve ser informado"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await dizimoService.updateDizimo(
      req.body.mes,
      req.body.valor
    );
    res.sendStatus(200);
  }
);

module.exports = router;

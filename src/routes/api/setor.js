const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const { tokenJWT } = require("../../helpers/authAPI");
const setorService = require("../../services/setorService");

/**
 * @openapi
 * definitions:
 *   Setor:
 *        type: object
 *        required:
 *          - nome
 *        properties:
 *          nome:
 *            type: string
 *            default: setor 1
 *   Setores:
 *        type: object
 *        properties:
 *          id_setor:
 *            type: integer
 *          nome:
 *            type: string
 */

/**
 * @openapi
 * /dashboard/api/setor:
 *   get:
 *      tags:
 *        - Setor
 *   description: Get todos os setores
 *   responses:
 *       200:
 *         description: Success
 *         schema:
 *           type: array
 *           items:
 *              $ref: '#/definitions/Setores'
 */
router.get("/", tokenJWT, async (req, res) => {
  const results = await setorService.selectSetores();
  res.json(results);
});

router.get("/:id", tokenJWT, async (req, res) => {
  const results = await setorService.selectSetorById(req.params.id);
  res.json(results[0]);
});

router.get("/search/:search", tokenJWT, async (req, res) => {
  const results = await setorService.selectSetorByLikeNome(req.params.search);
  res.json(results);
});

router.post(
  "/",
  body("nome")
    .isLength({ min: 5, max: 30 })
    .withMessage("Nome entre 5 e 30 caracteres"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await setorService.insertSetor(req.body);
    res.sendStatus(201);
  }
);

router.patch(
  "/",
  body("nome")
    .isLength({ min: 5, max: 30 })
    .withMessage("Nome entre 5 e 30 caracteres"),
  body("id_setor")
    .isInt({ min: 1 })
    .withMessage("Id setor deve ser informado e numérico"),
  tokenJWT,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await setorService.updateSetor(req.body);
    res.sendStatus(200);
  }
);

router.delete("/:id", tokenJWT, async (req, res) => {
  const results = await setorService.deleteSetor(req.params.id);
  res.sendStatus(204);
});

module.exports = router;

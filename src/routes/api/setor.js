const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const setorService = require("../../services/setorService");

router.get("/", async (req, res) => {
  const results = await setorService.selectSetores();
  res.json(results);
});

router.get("/:id", async (req, res) => {
  const results = await setorService.selectSetorById(req.params.id);
  res.json(results[0]);
});

router.post(
  "/",
  body("nome")
    .isLength({ min: 5, max: 30 })
    .withMessage("Nome entre 5 e 30 caracteres"),
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const results = await setorService.updateSetor(req.body);
    res.sendStatus(200);
  }
);

router.delete("/:id", async (req, res) => {
  const results = await setorService.deleteSetor(req.params.id);
  res.sendStatus(204);
});

module.exports = router;

const express = require("express");
const router = express.Router();

const familiaService = require("../services/familiaService");

router.get("/", async (req, res) => {
  const results = await familiaService.selectFamilias();
  res.json(results);
});

router.get("/:id", async (req, res) => {
  const results = await familiaService.selectFamiliaById(req.params.id);
  res.json(results);
});

router.post("/", async (req, res) => {
  const results = await familiaService.insertFamilia(req.body);
  res.sendStatus(201);
});

router.patch("/:id", async (req, res) => {
  const results = await familiaService.updateFamilia(req.params.id, req.body);
  res.sendStatus(200);
});

router.delete("/:id", async (req, res) => {
  const results = await familiaService.deleteFamilia(req.params.id);
  res.sendStatus(204);
});

module.exports = router;

const express = require("express");
const router = express.Router();

const setorService = require("../../services/setorService");

router.get("/", async (req, res) => {
  const results = await setorService.selectSetores();
  res.json(results);
});

router.get("/:id", async (req, res) => {
  const results = await setorService.selectSetorById(req.params.id);
  res.json(results[0]);
});

router.post("/", async (req, res) => {
  const results = await setorService.insertSetor(req.body);
  res.sendStatus(201);
});

router.patch("/", async (req, res) => {
  const results = await setorService.updateSetor(req.body);
  res.sendStatus(200);
});

router.delete("/:id", async (req, res) => {
  const results = await setorService.deleteSetor(req.params.id);
  res.sendStatus(204);
});

module.exports = router;

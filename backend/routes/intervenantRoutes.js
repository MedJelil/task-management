const express = require("express");
const router = express.Router();
const intervenantController = require("../controllers/intervenantController");

// Define CRUD operations for Intervenant
router.post("/", intervenantController.createIntervenant);
router.get("/", intervenantController.getIntervenants);
router.get("/:id", intervenantController.getIntervenantById);
router.put("/:id", intervenantController.updateIntervenant);
router.delete("/:id", intervenantController.deleteIntervenant);

module.exports = router;

const express = require("express");
const router = express.Router();
const intervenantController = require("../controllers/intervenantController");

router.post("/", intervenantController.createIntervenant);
router.get("/", intervenantController.getAllIntervenants);
router.get("/:id", intervenantController.getIntervenantById);
router.put("/:id", intervenantController.updateIntervenant);
router.delete("/:id", intervenantController.deleteIntervenant);

module.exports = router;

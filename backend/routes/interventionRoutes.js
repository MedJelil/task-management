const express = require("express");
const router = express.Router();
const interventionController = require("../controllers/interventionController");

router.post("/", interventionController.createIntervention);
router.get("/", interventionController.getAllInterventions);
router.get("/statistics", interventionController.getStatistics);
router.get("/:id", interventionController.getInterventionById);
router.put("/:id", interventionController.updateIntervention);
router.delete("/:id", interventionController.deleteIntervention);
module.exports = router;

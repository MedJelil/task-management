const express = require("express");
const router = express.Router();
const intervenantController = require("../controllers/intervenantController");

router.post("/intervenants", intervenantController.createIntervenant);
router.get("/intervenants", intervenantController.getAllIntervenants);
router.get("/intervenants/:id", intervenantController.getIntervenantById);
router.put("/intervenants/:id", intervenantController.updateIntervenant);
router.delete("/intervenants/:id", intervenantController.deleteIntervenant);

module.exports = router;

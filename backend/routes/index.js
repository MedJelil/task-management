const express = require("express");
const intervenantRoutes = require("./intervenantRoutes");
const clientRoutes = require("./clientRoutes");
const interventionRoutes = require("./interventionRoutes");
const adminRouter = require("./adminRouter");

const router = express.Router();
// Mount the routers with base paths
router.use("/intervenants", intervenantRoutes);
router.use("/clients", clientRoutes);
router.use("/interventions", interventionRoutes);
router.use("/admins", adminRouter);

module.exports = router;

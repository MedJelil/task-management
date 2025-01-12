const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./utils/db");
// const authRoutes = require("./routes/authRoutes");
// const clientRoutes = require("./routes/clientRoutes");
// const intervenantRoutes = require("./routes/intervenantRoutes");
// const interventionRoutes = require("./routes/interventionRoutes");
const routes = require("./routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", routes);

// db.sequelize.sync().then(() => {
//   app.listen(3000, () => console.log("Server running on port 3000"));
// });

// Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/clients", clientRoutes);
// app.use("/api/intervenants", intervenantRoutes);
// app.use("/api/interventions", interventionRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

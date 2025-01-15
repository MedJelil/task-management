const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", routes);

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, "../frontend/pages"))); // Path to the frontend folder

// Your API routes
app.use("/api", routes);

// Default route to serve the frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html")); // Adjust path if necessary
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

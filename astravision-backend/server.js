require("dotenv").config();
require("./db");

const metricsRoutes = require("./routes/metrics");
const configRoutes = require("./routes/config");
const express = require("express");
const cors = require("cors");

const robotRoutes = require("./routes/robot");
const alertRoutes = require("./routes/alerts");
const recordingRoutes = require("./routes/recordings");
const logRoutes = require("./routes/logs");
const usersRoute = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/robot", robotRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/recordings", recordingRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/config", configRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/users", usersRoute);

app.get("/", (req, res) => {
  res.send("AstraVision Backend Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
require("dotenv").config();
const pool = require("./db");
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const metricsRoutes = require("./routes/metrics");
const configRoutes = require("./routes/config");
const robotRoutes = require("./routes/robot");
const alertRoutes = require("./routes/alerts");
const recordingRoutes = require("./routes/recordings");
const logRoutes = require("./routes/logs");
const usersRoute = require("./routes/users");
const contactRoutes = require('./routes/contact');


const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://astra-vision.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

app.use("/api/robot", robotRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/recordings", recordingRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/config", configRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/users", usersRoute);
app.use('/api/contact', contactRoutes);


app.get("/", (req, res) => {
  res.send("AstraVision Backend Running");
});

const PORT = process.env.PORT || 3000;
let previousPrediction = "Non-human";

async function initializeAlerts() {
  try {
    await pool.query("DELETE FROM alerts");
    console.log("Previous alerts cleared.");

    const defaultAlerts = [
      { message: "System monitoring active", severity: "SUCCESS" },
      { message: "Network online", severity: "SUCCESS" },
      { message: "Obstacle detected near patrol path", severity: "WARNING" },
      { message: "Live camera stream connected", severity: "SUCCESS" },
      { message: "Rear ultrasonic alert triggered", severity: "WARNING" }
    ];

    for (const alert of defaultAlerts) {
      await pool.query(
        "INSERT INTO alerts (message, severity, created_at) VALUES ($1, $2, NOW())",
        [alert.message, alert.severity]
      );
    }

    console.log("Default alerts initialized.");
  } catch (err) {
    console.error("Alert initialization error:", err.message);
  }
}

async function autoDetectLoop() {
  while (true) {
    try {
      const res = await axios.get(
        `http://127.0.0.1:${PORT}/api/robot/detect-live`
      );

      const data = res.data;
      console.log("Auto Detection:", data);

      // Alert only when human newly appears
      if (
        previousPrediction === "Non-human" &&
        data.prediction === "Human"
      ) {
        await pool.query(
          "INSERT INTO alerts (type, message, severity, created_at) VALUES ($1, $2, $3, NOW())",
          ["Intrusion", "Human detected by ESP32-CAM", "CRITICAL"]
        );

        console.log("CRITICAL ALERT INSERTED: Human Presence Detected");
      }

      previousPrediction = data.prediction;
    } catch (error) {
      console.error("Auto detection failed:", error.message);
    }

    // Wait 2 sec before next frame
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  await initializeAlerts();

  // Start autonomous human detection
  autoDetectLoop();
});
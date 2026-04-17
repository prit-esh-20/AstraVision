const express = require("express");
const router = express.Router();
const pool = require("../db");
const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const ML_API_URL = "https://astravision.onrender.com/predict";
/* GET robot status */

router.get("/status", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT *, battery_level AS battery FROM robot_status ORDER BY updated_at DESC LIMIT 1"
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch robot status" });
  }
});

/* UPDATE robot status */

router.post("/status", async (req, res) => {
  try {
    const { battery_level, location, mode, status } = req.body;
    const final_battery = battery_level || 29;

    const result = await pool.query(
      "INSERT INTO robot_status (battery_level, location, mode, status) VALUES ($1,$2,$3,$4) RETURNING *, battery_level AS battery",
      [final_battery, location, mode, status]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update robot status" });
  }
});


router.get("/detect-live", async (req, res) => {
  try {
    let espResponse;
    try {
      espResponse = await axios.get("http://10.77.189.134/capture", {
        responseType: "arraybuffer",
        timeout: 5000,
      });
    } catch (e) {
      console.log("Capture from port 80 failed, trying port 81...");
      espResponse = await axios.get("http://10.77.189.134:81/capture", {
        responseType: "arraybuffer",
        timeout: 5000,
      });
    }

    if (!espResponse || !espResponse.data) {
      throw new Error("No data received from ESP32-CAM");
    }

    const imageBuffer = Buffer.from(espResponse.data);

    const formData = new FormData();
    formData.append("file", imageBuffer, "live.jpg");

    const mlResponse = await axios.post(ML_API_URL, formData, {
      headers: formData.getHeaders(),
      timeout: 30000, // 30s timeout
    });

    const result = mlResponse.data;

    res.json(result);
  } catch (error) {
    console.error("DETECTION SYSTEM ERROR:", error.message);
    
    // Return a 200 with specific error details to prevent the dashboard loop from crashing,
    // but still inform that detection was not possible.
    res.status(200).json({ 
      prediction: "Offline", 
      probability: 0,
      error: error.message,
      suggestion: "Check if ESP32-CAM IP (10.77.189.134) is reachable and ML API is online."
    });
  }
});

module.exports = router;

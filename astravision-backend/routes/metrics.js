const express = require("express");
const router = express.Router();
const pool = require("../db");

/* Robot sends system metrics */

router.post("/", async (req, res) => {
  try {
    const { uptime, cpu_load, battery_voltage, wifi_signal } = req.body;

    // Remove previous metrics so only latest row remains
    await pool.query("DELETE FROM robot_metrics");

    const result = await pool.query(
      "INSERT INTO robot_metrics (uptime, cpu_load, battery_voltage, wifi_signal) VALUES ($1,$2,$3,$4) RETURNING *",
      [uptime, cpu_load, battery_voltage, wifi_signal]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting metrics:", error);
    res.status(500).json({ error: "Failed to store metrics" });
  }
});

/* Dashboard fetch latest metrics */

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM robot_metrics ORDER BY created_at DESC LIMIT 1"
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

module.exports = router;
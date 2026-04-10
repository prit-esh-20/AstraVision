const express = require("express");
const router = express.Router();
const pool = require("../db");

/* GET all alerts */

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alerts ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

/* CREATE new alert */

router.post("/", async (req, res) => {
  try {
    const { type, message, severity } = req.body;
    
    const alertSeverity = severity || "WARNING";

    const result = await pool.query(
      "INSERT INTO alerts(type, message, severity) VALUES($1,$2,$3) RETURNING *",
      [type, message, alertSeverity]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create alert" });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const pool = require("../db");

/* GET robot status */

router.get("/status", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM robot_status ORDER BY updated_at DESC LIMIT 1"
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

    const result = await pool.query(
      "INSERT INTO robot_status (battery_level, location, mode, status) VALUES ($1,$2,$3,$4) RETURNING *",
      [battery_level, location, mode, status]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update robot status" });
  }
});

module.exports = router;
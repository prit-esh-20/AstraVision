const express = require("express");
const router = express.Router();
const pool = require("../db");

/* GET all logs */

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM logs ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

/* CREATE new log */

router.post("/", async (req, res) => {
  try {
    const { event, description, user_id } = req.body;

    const result = await pool.query(
      "INSERT INTO logs(event, description, user_id) VALUES($1,$2,$3) RETURNING *",
      [event, description, user_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create log" });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {

    const { category } = req.query;

    let query = "SELECT * FROM recordings ORDER BY recorded_at DESC";
    let values = [];

    if (category && category !== "all") {
      query =
        "SELECT * FROM recordings WHERE category=$1 ORDER BY recorded_at DESC";
      values = [category];
    }

    const result = await pool.query(query, values);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recordings" });
  }
});

module.exports = router;
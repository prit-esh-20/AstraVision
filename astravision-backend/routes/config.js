const express = require("express");
const router = express.Router();
const pool = require("../db");

/* GET current config */

router.get("/", async (req, res) => {

  const result = await pool.query(
    "SELECT * FROM robot_config ORDER BY id DESC LIMIT 1"
  );

  res.json(result.rows[0]);

});

/* UPDATE ultrasonic distance */

router.post("/ultrasonic", async (req, res) => {

  const { distance } = req.body;

  const result = await pool.query(
    "UPDATE robot_config SET ultrasonic_distance=$1, updated_at=NOW() WHERE id=1 RETURNING *",
    [distance]
  );

  res.json(result.rows[0]);

});

module.exports = router;
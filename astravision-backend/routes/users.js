const express = require("express");
const router = express.Router();
const pool = require("../db");


/* GET all users */

router.get("/", async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM users ORDER BY created_at DESC"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


/* CREATE new user */

router.post("/", async (req, res) => {

  const { name, email, password, role, status } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password, role, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, hashedPassword, role, status]
    );

    res.json({ message: "User created successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
});


/* DELETE user */

router.delete("/:id", async (req, res) => {

  const { id } = req.params;

  try {

    await pool.query(
      "DELETE FROM users WHERE id=$1",
      [id]
    );

    res.json({ message: "User deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* GET user role by email */

router.get("/role/:email", async (req, res) => {
  try {

    const { email } = req.params;

    const result = await pool.query(
      "SELECT role FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch role" });
  }
});

module.exports = router;
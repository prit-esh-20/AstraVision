// routes/contact.js

const express = require('express');
const router = express.Router();
const pool = require('../db'); // your existing PostgreSQL connection file

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Insert into contacts table
    const query = `
      INSERT INTO contacts (name, email, subject, message, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;

    const values = [name, email, subject, message];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Contact form error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while sending message'
    });
  }
});

module.exports = router;


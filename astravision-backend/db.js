const { Pool, types } = require("pg");

// Force timestamp without timezone (type OID 1114) to be parsed as UTC
types.setTypeParser(1114, str => new Date(str + "Z"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => {
    console.log("Connected to Supabase PostgreSQL");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

module.exports = pool;
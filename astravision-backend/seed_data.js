require('dotenv').config();
const pool = require('./db');

async function seed() {
  try {
    console.log("Starting data update...");

    // 1. Update Robot Status to 75% Battery
    await pool.query(
      "INSERT INTO robot_status (battery_level, location, mode, status) VALUES ($1, $2, $3, $4)",
      [75, "Main Hall", "Patrolling", "active"]
    );
    console.log("✅ Battery level updated to 75%");

    // 2. Add some fresh Alerts
    const alerts = [
      ['Motion', 'Unusual vibration detected in Sector 4', 'WARNING'],
      ['Security', 'Face ID authentication successful: Admin', 'SUCCESS'],
      ['System', 'Network latency optimized - 42ms', 'SUCCESS'],
      ['Security', 'Intruder detected in restricted area', 'CRITICAL']
    ];

    for (const [type, message, severity] of alerts) {
      await pool.query(
        "INSERT INTO alerts (type, message, severity) VALUES ($1, $2, $3)",
        [type, message, severity]
      );
    }
    console.log("✅ Added 4 new alerts");

    // 3. Add some System Logs
    const logs = [
      ['System Startup', 'Robot initialization sequence completed', null],
      ['Mode Change', 'Switched to Patrolling Mode', null],
      ['Camera Feed', 'External stream connection established', null]
    ];

    for (const [event, description, user_id] of logs) {
      await pool.query(
        "INSERT INTO logs (event, description, user_id) VALUES ($1, $2, $3)",
        [event, description, user_id]
      );
    }
    console.log("✅ Added 3 new logs");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
}

seed();

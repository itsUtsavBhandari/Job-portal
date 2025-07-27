const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
    database: "Connected",
  })
})

router.get("/db-test", async (req, res) => {
  try {
    const db = require("../config/database")
    const result = await db.query("SELECT 1 as test")
    res.json({
      message: "Database connection successful!",
      result: result,
    })
  } catch (error) {
    res.status(500).json({
      message: "Database connection failed!",
      error: error.message,
    })
  }
})

module.exports = router

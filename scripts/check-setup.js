const mysql = require("mysql2")
require("dotenv").config()

async function checkSetup() {
  console.log("🔍 Checking Elevate Workforce Portal Setup...")
  console.log("=".repeat(50))

  // Check environment variables
  console.log("📋 Environment Variables:")
  console.log(`DB_HOST: ${process.env.DB_HOST || "NOT SET"}`)
  console.log(`DB_USER: ${process.env.DB_USER || "NOT SET"}`)
  console.log(`DB_NAME: ${process.env.DB_NAME || "NOT SET"}`)
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? "SET" : "NOT SET"}`)
  console.log("")

  // Test database connection
  console.log("🔌 Testing Database Connection...")
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "job_portal",
    })

    await new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    console.log("✅ Database connection successful!")

    // Check if tables exist
    const [tables] = await connection.promise().query("SHOW TABLES")
    console.log(`📊 Found ${tables.length} tables:`)
    tables.forEach((table) => {
      console.log(`   - ${Object.values(table)[0]}`)
    })

    // Check users table
    try {
      const [users] = await connection.promise().query("SELECT COUNT(*) as count FROM users")
      console.log(`👥 Users in database: ${users[0].count}`)
    } catch (err) {
      console.log("❌ Users table not found or empty")
    }

    // Check jobs table
    try {
      const [jobs] = await connection.promise().query("SELECT COUNT(*) as count FROM jobs")
      console.log(`💼 Jobs in database: ${jobs[0].count}`)
    } catch (err) {
      console.log("❌ Jobs table not found or empty")
    }

    connection.end()
  } catch (error) {
    console.log("❌ Database connection failed:")
    console.log(`   Error: ${error.message}`)
    console.log("\n💡 Solutions:")
    console.log("   1. Make sure MySQL is running")
    console.log("   2. Check your .env file credentials")
    console.log("   3. Create the database: CREATE DATABASE job_portal;")
    console.log("   4. Run the schema.sql file")
  }

  console.log("\n🚀 Next Steps:")
  console.log("   1. Run: npm install")
  console.log("   2. Run: npm run dev")
  console.log("   3. Visit: http://localhost:3000")
  console.log("   4. Test API: http://localhost:3000/test")
}

checkSetup()

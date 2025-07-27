const mysql = require("mysql2/promise")
require("dotenv").config()

async function checkData() {
  let connection

  try {
    console.log("🔍 Checking database data...")

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "job_portal",
    })

    // Check users
    const [users] = await connection.execute("SELECT id, name, email, role FROM users LIMIT 5")
    console.log("\n👥 Sample Users:")
    users.forEach((user) => {
      console.log(`   ${user.id}: ${user.name} (${user.email}) - ${user.role}`)
    })

    // Check jobs
    const [jobs] = await connection.execute(`
      SELECT j.id, j.title, j.location, j.job_type, j.status, u.company_name 
      FROM jobs j 
      JOIN users u ON j.company_id = u.id 
      LIMIT 5
    `)
    console.log("\n💼 Sample Jobs:")
    jobs.forEach((job) => {
      console.log(`   ${job.id}: ${job.title} at ${job.company_name} (${job.location}) - ${job.status}`)
    })

    // Check counts
    const [userCount] = await connection.execute("SELECT COUNT(*) as count FROM users")
    const [jobCount] = await connection.execute("SELECT COUNT(*) as count FROM jobs")
    const [activeJobCount] = await connection.execute("SELECT COUNT(*) as count FROM jobs WHERE status = 'active'")

    console.log("\n📊 Summary:")
    console.log(`   Total users: ${userCount[0].count}`)
    console.log(`   Total jobs: ${jobCount[0].count}`)
    console.log(`   Active jobs: ${activeJobCount[0].count}`)

    if (jobCount[0].count === 0) {
      console.log("\n⚠️  No jobs found! Run the seed script:")
      console.log("   npm run seed")
    }
  } catch (error) {
    console.error("❌ Error checking data:", error.message)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

checkData()

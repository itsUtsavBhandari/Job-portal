const mysql = require("mysql2")

class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "job_portal",
      charset: "utf8mb4",
    })

    this.connection.connect((err) => {
      if (err) {
        console.error("❌ Database connection failed:", err.message)
        console.log("Please check your database credentials and make sure MySQL is running")
        process.exit(1)
      }
      console.log("✅ Connected to MySQL database")
    })
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, params, (err, results) => {
        if (err) {
          console.error("Query error:", err.message)
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  }

  close() {
    this.connection.end()
  }
}

module.exports = new Database()

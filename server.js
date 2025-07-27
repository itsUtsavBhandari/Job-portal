const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const AuthMiddleware = require("./middleware/auth")
const authRoutes = require("./routes/authRoutes")
const jobRoutes = require("./routes/jobRoutes")
const companyRoutes = require("./routes/companyRoutes")
const applicationRoutes = require("./routes/applicationRoutes")

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

// View engine setup (without layouts for now)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Global authentication middleware
app.use(AuthMiddleware.authenticate)

// Routes
app.use("/auth", authRoutes)
app.use("/jobs", jobRoutes)
app.use("/company", companyRoutes)
app.use("/applications", applicationRoutes)

// Home route
app.get("/", (req, res) => {
  res.redirect("/jobs")
})

// Test route
app.get("/test", (req, res) => {
  res.json({
    message: "Server is working!",
    user: req.user ? req.user.name : "Not logged in",
    timestamp: new Date().toISOString(),
  })
})

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err.message)
  res.status(500).send(`
    <h1>Error</h1>
    <p>${err.message}</p>
    <a href="/jobs">Go back to jobs</a>
  `)
})

// 404 handler
app.use((req, res) => {
  res.status(404).send(`
    <h1>Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <a href="/jobs">Go to jobs</a>
  `)
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📱 Browse Jobs: http://localhost:${PORT}/jobs`)
  console.log(`🔑 Login: http://localhost:${PORT}/auth/login`)
  console.log(`📝 Register: http://localhost:${PORT}/auth/register`)
})

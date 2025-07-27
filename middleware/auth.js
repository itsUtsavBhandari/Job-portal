const jwt = require("jsonwebtoken")
const User = require("../models/User")

class AuthMiddleware {
  static async authenticate(req, res, next) {
    try {
      const token = req.cookies.token

      if (!token) {
        req.user = null
        return next()
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId)

      if (!user) {
        res.clearCookie("token")
        req.user = null
        return next()
      }

      req.user = user
      next()
    } catch (error) {
      res.clearCookie("token")
      req.user = null
      next()
    }
  }

  static requireAuth(req, res, next) {
    if (!req.user) {
      return res.redirect("/auth/login?message=Please login to continue")
    }
    next()
  }

  static requireCompany(req, res, next) {
    if (!req.user || req.user.role !== "company") {
      return res.status(403).send(`
        <h1>Access Denied</h1>
        <p>You need to be a company user to access this page.</p>
        <a href="/auth/login">Login</a> | <a href="/jobs">Browse Jobs</a>
      `)
    }
    next()
  }

  static requireJobSeeker(req, res, next) {
    if (!req.user || req.user.role !== "job_seeker") {
      return res.status(403).send(`
        <h1>Access Denied</h1>
        <p>You need to be a job seeker to access this page.</p>
        <a href="/auth/login">Login</a> | <a href="/jobs">Browse Jobs</a>
      `)
    }
    next()
  }

  static redirectIfAuthenticated(req, res, next) {
    if (req.user) {
      return res.redirect("/jobs")
    }
    next()
  }
}

module.exports = AuthMiddleware

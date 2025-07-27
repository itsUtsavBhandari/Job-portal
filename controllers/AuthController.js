const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const User = require("../models/User")

class AuthController {
  static showRegister(req, res) {
    res.render("auth/register", {
      title: "Register",
      user: req.user,
      errors: [],
      formData: {},
    })
  }

  static async register(req, res) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.render("auth/register", {
          title: "Register",
          user: req.user,
          errors: errors.array(),
          formData: req.body,
        })
      }

      const existingUser = await User.findByEmail(req.body.email)

      if (existingUser) {
        return res.render("auth/register", {
          title: "Register",
          user: req.user,
          errors: [{ msg: "Email already exists" }],
          formData: req.body,
        })
      }

      await User.create(req.body)
      res.redirect("/auth/login?message=Registration successful! Please login.")
    } catch (error) {
      console.error("Registration error:", error)
      res.render("auth/register", {
        title: "Register",
        user: req.user,
        errors: [{ msg: "Registration failed. Please try again." }],
        formData: req.body,
      })
    }
  }

  static showLogin(req, res) {
    res.render("auth/login", {
      title: "Login",
      user: req.user,
      errors: [],
      message: req.query.message || null,
    })
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.render("auth/login", {
          title: "Login",
          user: req.user,
          errors: errors.array(),
          message: null,
        })
      }

      const { email, password } = req.body
      const user = await User.findByEmail(email)

      if (!user || !(await user.validatePassword(password))) {
        return res.render("auth/login", {
          title: "Login",
          user: req.user,
          errors: [{ msg: "Invalid email or password" }],
          message: null,
        })
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      })

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      if (user.role === "company") {
        res.redirect("/company/dashboard")
      } else {
        res.redirect("/jobs")
      }
    } catch (error) {
      console.error("Login error:", error)
      res.render("auth/login", {
        title: "Login",
        user: req.user,
        errors: [{ msg: "Login failed. Please try again." }],
        message: null,
      })
    }
  }

  static logout(req, res) {
    res.clearCookie("token")
    res.redirect("/jobs?message=Logged out successfully")
  }
}

module.exports = AuthController

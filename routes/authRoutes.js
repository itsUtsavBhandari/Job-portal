const express = require("express")
const { body } = require("express-validator")
const AuthController = require("../controllers/AuthController")
const AuthMiddleware = require("../middleware/auth")

const router = express.Router()

// Registration routes
router.get("/register", AuthMiddleware.redirectIfAuthenticated, AuthController.showRegister)
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["job_seeker", "company"]).withMessage("Valid role is required"),
    body("company_name").custom((value, { req }) => {
      if (req.body.role === "company" && !value) {
        throw new Error("Company name is required for company accounts")
      }
      return true
    }),
  ],
  AuthController.register,
)

// Login routes
router.get("/login", AuthMiddleware.redirectIfAuthenticated, AuthController.showLogin)
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  AuthController.login,
)

// Logout route
router.post("/logout", AuthController.logout)
router.get("/logout", AuthController.logout)

module.exports = router

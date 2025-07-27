const express = require("express")
const { body } = require("express-validator")
const CompanyController = require("../controllers/CompanyController")
const AuthMiddleware = require("../middleware/auth")

const router = express.Router()

// Apply middleware
router.use(AuthMiddleware.requireAuth)
router.use(AuthMiddleware.requireCompany)

// Company dashboard
router.get("/dashboard", CompanyController.dashboard)

// Job management routes
router.get("/jobs/create", CompanyController.showCreateJob)
router.post(
  "/jobs/create",
  [
    body("title").notEmpty().withMessage("Job title is required"),
    body("description").notEmpty().withMessage("Job description is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("job_type")
      .isIn(["full_time", "part_time", "contract", "internship"])
      .withMessage("Valid job type is required"),
  ],
  CompanyController.createJob,
)

router.get("/jobs/:id/edit", CompanyController.showEditJob)
router.post(
  "/jobs/:id/edit",
  [
    body("title").notEmpty().withMessage("Job title is required"),
    body("description").notEmpty().withMessage("Job description is required"),
    body("location").notEmpty().withMessage("Location is required"),
    body("job_type")
      .isIn(["full_time", "part_time", "contract", "internship"])
      .withMessage("Valid job type is required"),
  ],
  CompanyController.updateJob,
)

router.delete("/jobs/:id", CompanyController.deleteJob)

module.exports = router

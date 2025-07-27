const express = require("express")
const { body } = require("express-validator")
const ApplicationController = require("../controllers/ApplicationController")
const AuthMiddleware = require("../middleware/auth")

const router = express.Router()

// Apply authentication middleware
router.use(AuthMiddleware.requireAuth)

// Job seeker routes
router.post(
  "/apply/:jobId",
  AuthMiddleware.requireJobSeeker,
  ApplicationController.uploadResume,
  [body("cover_letter").notEmpty().withMessage("Cover letter is required")],
  ApplicationController.apply,
)

router.get("/my-applications", AuthMiddleware.requireJobSeeker, ApplicationController.myApplications)

// Company routes
router.put("/:id/status", AuthMiddleware.requireCompany, ApplicationController.updateStatus)

module.exports = router

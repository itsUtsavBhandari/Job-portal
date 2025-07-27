const express = require("express")
const JobController = require("../controllers/JobController")

const router = express.Router()

// Job listing routes
router.get("/", JobController.index)
router.get("/:id", JobController.show)

module.exports = router

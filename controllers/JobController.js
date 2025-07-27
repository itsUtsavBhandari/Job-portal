const Job = require("../models/Job")
const Application = require("../models/Application")

class JobController {
  static async index(req, res) {
    try {
      const page = Number.parseInt(req.query.page) || 1
      const limit = 10
      const search = req.query.search || ""

      let jobs, totalJobs

      if (search) {
        jobs = await Job.search(search, page, limit)
        totalJobs = await Job.countAll()
      } else {
        jobs = await Job.findAll(page, limit)
        totalJobs = await Job.countAll()
      }

      const totalPages = Math.ceil(totalJobs / limit)

      res.render("jobs/index", {
        title: "Job Listings",
        user: req.user,
        jobs: jobs || [],
        currentPage: page,
        totalPages,
        search,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page + 1,
        prevPage: page - 1,
        message: req.query.message || null,
      })
    } catch (error) {
      console.error("Error loading jobs:", error)
      res.render("jobs/index", {
        title: "Job Listings",
        user: req.user,
        jobs: [],
        currentPage: 1,
        totalPages: 1,
        search: "",
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: 2,
        prevPage: 0,
        message: "Error loading jobs. Please try again.",
      })
    }
  }

  static async show(req, res) {
    try {
      const job = await Job.findById(req.params.id)

      if (!job) {
        return res.status(404).render("error", {
          title: "Job Not Found",
          message: "The job you are looking for does not exist.",
          user: req.user,
        })
      }

      let hasApplied = false
      if (req.user && req.user.role === "job_seeker") {
        const application = await Application.findByJobAndApplicant(job.id, req.user.id)
        hasApplied = !!application
      }

      res.render("jobs/show", {
        title: job.title,
        user: req.user,
        job,
        hasApplied,
      })
    } catch (error) {
      console.error("Error loading job:", error)
      res.status(500).render("error", {
        title: "Error",
        message: "Failed to load job details",
        user: req.user,
      })
    }
  }
}

module.exports = JobController

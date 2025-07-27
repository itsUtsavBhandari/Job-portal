const Job = require("../models/Job")
const Application = require("../models/Application")
const { validationResult } = require("express-validator")

class CompanyController {
  static async dashboard(req, res) {
    try {
      const jobs = await Job.findByCompanyId(req.user.id)
      const applications = await Application.findByCompanyId(req.user.id)

      res.render("company/dashboard", {
        title: "Company Dashboard",
        user: req.user,
        jobs,
        applications,
        stats: {
          totalJobs: jobs.length,
          activeJobs: jobs.filter((job) => job.status === "active").length,
          totalApplications: applications.length,
          pendingApplications: applications.filter((app) => app.status === "pending").length,
        },
        message: req.query.message || null,
      })
    } catch (error) {
      console.error("Dashboard error:", error)
      res.render("company/dashboard", {
        title: "Company Dashboard",
        user: req.user,
        jobs: [],
        applications: [],
        stats: { totalJobs: 0, activeJobs: 0, totalApplications: 0, pendingApplications: 0 },
        message: "Error loading dashboard",
      })
    }
  }

  static showCreateJob(req, res) {
    res.render("company/create-job", {
      title: "Post New Job",
      user: req.user,
      errors: [],
      formData: {},
    })
  }

  static async createJob(req, res) {
    try {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.render("company/create-job", {
          title: "Post New Job",
          user: req.user,
          errors: errors.array(),
          formData: req.body,
        })
      }

      const jobData = {
        ...req.body,
        company_id: req.user.id,
      }

      await Job.create(jobData)
      res.redirect("/company/dashboard?message=Job posted successfully!")
    } catch (error) {
      console.error("Create job error:", error)
      res.render("company/create-job", {
        title: "Post New Job",
        user: req.user,
        errors: [{ msg: "Failed to create job. Please try again." }],
        formData: req.body,
      })
    }
  }

  static async showEditJob(req, res) {
    try {
      const job = await Job.findById(req.params.id)

      if (!job || job.company_id !== req.user.id) {
        return res.status(404).render("error", {
          title: "Job Not Found",
          message: "Job not found or you do not have permission to edit it.",
          user: req.user,
        })
      }

      res.render("company/edit-job", {
        title: "Edit Job",
        user: req.user,
        job,
        errors: [],
        formData: job,
      })
    } catch (error) {
      console.error("Edit job error:", error)
      res.render("error", {
        title: "Error",
        message: "Failed to load job for editing",
        user: req.user,
      })
    }
  }

  static async updateJob(req, res) {
    try {
      const job = await Job.findById(req.params.id)

      if (!job || job.company_id !== req.user.id) {
        return res.status(404).render("error", {
          title: "Job Not Found",
          message: "Job not found or you do not have permission to edit it.",
          user: req.user,
        })
      }

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.render("company/edit-job", {
          title: "Edit Job",
          user: req.user,
          job,
          errors: errors.array(),
          formData: req.body,
        })
      }

      await Job.update(req.params.id, req.body)
      res.redirect("/company/dashboard?message=Job updated successfully!")
    } catch (error) {
      console.error("Update job error:", error)
      res.redirect("/company/dashboard?message=Failed to update job")
    }
  }

  static async deleteJob(req, res) {
    try {
      const job = await Job.findById(req.params.id)

      if (!job || job.company_id !== req.user.id) {
        return res.status(404).json({ success: false, message: "Job not found" })
      }

      await Job.delete(req.params.id)
      res.json({ success: true, message: "Job deleted successfully" })
    } catch (error) {
      console.error("Delete job error:", error)
      res.status(500).json({ success: false, message: "Failed to delete job" })
    }
  }
}

module.exports = CompanyController

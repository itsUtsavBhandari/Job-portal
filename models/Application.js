const db = require("../config/database")

class Application {
  constructor(data) {
    this.id = data.id
    this.job_id = data.job_id
    this.applicant_id = data.applicant_id
    this.cover_letter = data.cover_letter
    this.resume_path = data.resume_path
    this.status = data.status
    this.applied_at = data.applied_at
    this.job_title = data.job_title
    this.applicant_name = data.applicant_name
    this.applicant_email = data.applicant_email
    this.company_name = data.company_name
  }

  static async create(applicationData) {
    try {
      const sql = `
        INSERT INTO applications (job_id, applicant_id, cover_letter, resume_path)
        VALUES (?, ?, ?, ?)
      `

      const params = [
        applicationData.job_id,
        applicationData.applicant_id,
        applicationData.cover_letter,
        applicationData.resume_path || null,
      ]

      const result = await db.query(sql, params)
      return result.insertId
    } catch (error) {
      throw error
    }
  }

  static async findByJobAndApplicant(jobId, applicantId) {
    try {
      const sql = "SELECT * FROM applications WHERE job_id = ? AND applicant_id = ?"
      const results = await db.query(sql, [jobId, applicantId])

      if (results.length === 0) {
        return null
      }

      return new Application(results[0])
    } catch (error) {
      return null
    }
  }

  static async findByCompanyId(companyId) {
    try {
      const sql = `
        SELECT a.*, j.title as job_title, u.name as applicant_name, u.email as applicant_email
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN users u ON a.applicant_id = u.id
        WHERE j.company_id = ?
        ORDER BY a.applied_at DESC
      `

      const results = await db.query(sql, [companyId])
      return results.map((app) => new Application(app))
    } catch (error) {
      return []
    }
  }

  static async findByApplicantId(applicantId) {
    try {
      const sql = `
        SELECT a.*, j.title as job_title, c.company_name
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN users c ON j.company_id = c.id
        WHERE a.applicant_id = ?
        ORDER BY a.applied_at DESC
      `

      const results = await db.query(sql, [applicantId])
      return results.map((app) => new Application(app))
    } catch (error) {
      return []
    }
  }

  static async updateStatus(id, status) {
    try {
      const sql = "UPDATE applications SET status = ? WHERE id = ?"
      await db.query(sql, [status, id])
    } catch (error) {
      throw error
    }
  }
}

module.exports = Application

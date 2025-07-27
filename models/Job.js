const db = require("../config/database")

class Job {
  constructor(data) {
    this.id = data.id
    this.title = data.title
    this.description = data.description
    this.requirements = data.requirements
    this.salary_range = data.salary_range
    this.location = data.location
    this.job_type = data.job_type
    this.company_id = data.company_id
    this.status = data.status
    this.created_at = data.created_at
    this.updated_at = data.updated_at
    this.company_name = data.company_name
  }

  static async create(jobData) {
    try {
      const sql = `
        INSERT INTO jobs (title, description, requirements, salary_range, location, job_type, company_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
      `

      const params = [
        jobData.title,
        jobData.description,
        jobData.requirements || "",
        jobData.salary_range || "",
        jobData.location,
        jobData.job_type,
        jobData.company_id,
      ]

      const result = await db.query(sql, params)
      return result.insertId
    } catch (error) {
      throw error
    }
  }

  static async findAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit

      const sql = `
        SELECT j.*, u.company_name 
        FROM jobs j 
        JOIN users u ON j.company_id = u.id 
        WHERE j.status = 'active'
        ORDER BY j.created_at DESC 
        LIMIT ? OFFSET ?
      `

      const results = await db.query(sql, [limit, offset])
      return results.map((job) => new Job(job))
    } catch (error) {
      console.error("Error finding jobs:", error)
      return []
    }
  }

  static async countAll() {
    try {
      const sql = 'SELECT COUNT(*) as total FROM jobs WHERE status = "active"'
      const results = await db.query(sql)
      return results[0].total
    } catch (error) {
      return 0
    }
  }

  static async findById(id) {
    try {
      const sql = `
        SELECT j.*, u.company_name 
        FROM jobs j 
        JOIN users u ON j.company_id = u.id 
        WHERE j.id = ?
      `

      const results = await db.query(sql, [id])

      if (results.length === 0) {
        return null
      }

      return new Job(results[0])
    } catch (error) {
      throw error
    }
  }

  static async findByCompanyId(companyId) {
    try {
      const sql = `
        SELECT j.*, u.company_name 
        FROM jobs j 
        JOIN users u ON j.company_id = u.id 
        WHERE j.company_id = ?
        ORDER BY j.created_at DESC
      `

      const results = await db.query(sql, [companyId])
      return results.map((job) => new Job(job))
    } catch (error) {
      return []
    }
  }

  static async update(id, jobData) {
    try {
      const sql = `
        UPDATE jobs 
        SET title = ?, description = ?, requirements = ?, salary_range = ?, 
            location = ?, job_type = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `

      const params = [
        jobData.title,
        jobData.description,
        jobData.requirements || "",
        jobData.salary_range || "",
        jobData.location,
        jobData.job_type,
        id,
      ]

      await db.query(sql, params)
    } catch (error) {
      throw error
    }
  }

  static async delete(id) {
    try {
      const sql = "DELETE FROM jobs WHERE id = ?"
      await db.query(sql, [id])
    } catch (error) {
      throw error
    }
  }

  static async search(query, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit

      const sql = `
        SELECT j.*, u.company_name 
        FROM jobs j 
        JOIN users u ON j.company_id = u.id 
        WHERE j.status = 'active' AND (
          j.title LIKE ? OR 
          j.description LIKE ? OR 
          j.location LIKE ? OR 
          u.company_name LIKE ?
        )
        ORDER BY j.created_at DESC 
        LIMIT ? OFFSET ?
      `

      const searchTerm = `%${query}%`
      const params = [searchTerm, searchTerm, searchTerm, searchTerm, limit, offset]

      const results = await db.query(sql, params)
      return results.map((job) => new Job(job))
    } catch (error) {
      return []
    }
  }
}

module.exports = Job

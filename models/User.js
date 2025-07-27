const bcrypt = require("bcryptjs")
const db = require("../config/database")

class User {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.password = data.password
    this.role = data.role
    this.phone = data.phone
    this.address = data.address
    this.company_name = data.company_name
    this.company_description = data.company_description
    this.created_at = data.created_at
    this.updated_at = data.updated_at
  }

  static async create(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      const sql = `
        INSERT INTO users (name, email, password, role, phone, address, company_name, company_description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `

      const params = [
        userData.name,
        userData.email,
        hashedPassword,
        userData.role,
        userData.phone || null,
        userData.address || null,
        userData.company_name || null,
        userData.company_description || null,
      ]

      const result = await db.query(sql, params)
      return result.insertId
    } catch (error) {
      throw error
    }
  }

  static async findByEmail(email) {
    try {
      const sql = "SELECT * FROM users WHERE email = ?"
      const results = await db.query(sql, [email])

      if (results.length === 0) {
        return null
      }

      return new User(results[0])
    } catch (error) {
      throw error
    }
  }

  static async findById(id) {
    try {
      const sql = "SELECT * FROM users WHERE id = ?"
      const results = await db.query(sql, [id])

      if (results.length === 0) {
        return null
      }

      return new User(results[0])
    } catch (error) {
      throw error
    }
  }

  async validatePassword(password) {
    try {
      return await bcrypt.compare(password, this.password)
    } catch (error) {
      return false
    }
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this
    return userWithoutPassword
  }
}

module.exports = User

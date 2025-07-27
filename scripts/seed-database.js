const mysql = require("mysql2/promise")
const bcrypt = require("bcryptjs")
require("dotenv").config()

async function seedDatabase() {
  let connection

  try {
    console.log("🌱 Starting database seeding...")

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "job_portal",
    })

    console.log("✅ Connected to database")

    // Clear existing data (optional - remove if you want to keep existing data)
    console.log("🧹 Clearing existing data...")
    await connection.execute("DELETE FROM applications")
    await connection.execute("DELETE FROM jobs")
    await connection.execute("DELETE FROM users")

    // Reset auto increment
    await connection.execute("ALTER TABLE applications AUTO_INCREMENT = 1")
    await connection.execute("ALTER TABLE jobs AUTO_INCREMENT = 1")
    await connection.execute("ALTER TABLE users AUTO_INCREMENT = 1")

    // Hash password
    const hashedPassword = await bcrypt.hash("password123", 10)
    console.log("🔐 Password hashed successfully")

    // Insert sample companies
    console.log("🏢 Inserting sample companies...")
    const companyInsertResult = await connection.execute(
      `INSERT INTO users (name, email, password, role, company_name, company_description) VALUES
      ('Tech Solutions Nepal', 'hr@techsolutions.np', ?, 'company', 'Tech Solutions Nepal', 'Leading technology company providing innovative software solutions in Nepal'),
      ('Digital Marketing Hub', 'contact@digitalmarketing.np', ?, 'company', 'Digital Marketing Hub', 'Full-service digital marketing agency helping businesses grow online'),
      ('FinTech Innovations', 'careers@fintech.np', ?, 'company', 'FinTech Innovations', 'Revolutionary financial technology company transforming banking in Nepal'),
      ('Nepal Software Company', 'jobs@nepalsoftware.com', ?, 'company', 'Nepal Software Company', 'Premier software development company in Nepal'),
      ('Himalayan Tech', 'hr@himalayantech.np', ?, 'company', 'Himalayan Tech', 'Innovative technology solutions for modern businesses')`,
      [hashedPassword, hashedPassword, hashedPassword, hashedPassword, hashedPassword],
    )

    console.log(`✅ Inserted ${companyInsertResult[0].affectedRows} companies`)

    // Insert sample job seekers
    console.log("👥 Inserting sample job seekers...")
    const jobSeekerResult = await connection.execute(
      `INSERT INTO users (name, email, password, role, phone, address) VALUES
      ('Rajesh Sharma', 'rajesh@example.com', ?, 'job_seeker', '+977-9841234567', 'Kathmandu, Nepal'),
      ('Sita Poudel', 'sita@example.com', ?, 'job_seeker', '+977-9851234567', 'Pokhara, Nepal'),
      ('Amit Thapa', 'amit@example.com', ?, 'job_seeker', '+977-9861234567', 'Lalitpur, Nepal'),
      ('Priya Gurung', 'priya@example.com', ?, 'job_seeker', '+977-9871234567', 'Bhaktapur, Nepal'),
      ('Suresh Rai', 'suresh@example.com', ?, 'job_seeker', '+977-9881234567', 'Chitwan, Nepal')`,
      [hashedPassword, hashedPassword, hashedPassword, hashedPassword, hashedPassword],
    )

    console.log(`✅ Inserted ${jobSeekerResult[0].affectedRows} job seekers`)

    // Get company IDs
    const [companies] = await connection.execute('SELECT id, company_name FROM users WHERE role = "company"')
    console.log(`📋 Found ${companies.length} companies for job creation`)

    // Insert sample jobs
    console.log("💼 Inserting sample jobs...")
    const jobs = [
      {
        title: "Senior Full Stack Developer",
        description:
          "We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies like React, Node.js, and MongoDB. The ideal candidate should have strong problem-solving skills and experience with agile development methodologies.",
        requirements:
          "Bachelor's degree in Computer Science or related field, 3+ years of experience with React, Node.js, and databases, Strong problem-solving skills, Experience with Git and agile methodologies",
        salary_range: "NPR 80,000 - 120,000",
        location: "Kathmandu",
        job_type: "full_time",
        company_id: companies[0].id,
      },
      {
        title: "Digital Marketing Specialist",
        description:
          "Join our marketing team to create and execute digital marketing campaigns. You will work on SEO, social media marketing, content creation, and email marketing campaigns. This role requires creativity and analytical skills to drive business growth through digital channels.",
        requirements:
          "Bachelor's degree in Marketing or related field, 2+ years of digital marketing experience, Knowledge of Google Analytics, Facebook Ads, and social media platforms, Strong analytical and communication skills",
        salary_range: "NPR 50,000 - 75,000",
        location: "Kathmandu",
        job_type: "full_time",
        company_id: companies[1].id,
      },
      {
        title: "Frontend Developer",
        description:
          "We need a creative Frontend Developer to build beautiful and responsive user interfaces. You will work closely with our design team to implement modern web applications using React, Vue.js, and modern CSS frameworks.",
        requirements:
          "Strong knowledge of HTML, CSS, JavaScript, Experience with React or Vue.js, Understanding of responsive design principles, Knowledge of CSS preprocessors like SASS/LESS",
        salary_range: "NPR 60,000 - 90,000",
        location: "Pokhara",
        job_type: "full_time",
        company_id: companies[0].id,
      },
      {
        title: "Content Writer",
        description:
          "Looking for a talented Content Writer to create engaging content for our clients. You will write blog posts, social media content, marketing materials, and website copy. The role requires excellent writing skills and creativity.",
        requirements:
          "Excellent English writing skills, Bachelor's degree in English, Journalism, or related field, Portfolio of published work, Understanding of SEO principles",
        salary_range: "NPR 35,000 - 50,000",
        location: "Remote",
        job_type: "part_time",
        company_id: companies[1].id,
      },
      {
        title: "Mobile App Developer",
        description:
          "Join our mobile development team to create innovative mobile applications. You will work on both iOS and Android platforms using React Native or Flutter. Experience with native development is a plus.",
        requirements:
          "Experience with mobile app development, Knowledge of React Native or Flutter, Understanding of mobile UI/UX principles, Experience with app store deployment",
        salary_range: "NPR 70,000 - 100,000",
        location: "Lalitpur",
        job_type: "full_time",
        company_id: companies[2].id,
      },
      {
        title: "Data Analyst Intern",
        description:
          "Great opportunity for students or recent graduates to gain experience in data analysis. You will work with real datasets, create reports, and learn industry-standard tools like Python, R, and SQL.",
        requirements:
          "Currently pursuing or recently completed degree in Statistics, Mathematics, or Computer Science, Basic knowledge of Excel and SQL, Interest in data analysis and visualization",
        salary_range: "NPR 20,000 - 30,000",
        location: "Kathmandu",
        job_type: "internship",
        company_id: companies[2].id,
      },
      {
        title: "UI/UX Designer",
        description:
          "We are seeking a creative UI/UX Designer to design intuitive and engaging user interfaces. You will work on web and mobile applications, conduct user research, and create wireframes and prototypes.",
        requirements:
          "Bachelor's degree in Design or related field, Proficiency in Figma, Adobe XD, or Sketch, Understanding of user-centered design principles, Portfolio showcasing design work",
        salary_range: "NPR 55,000 - 85,000",
        location: "Kathmandu",
        job_type: "full_time",
        company_id: companies[3].id,
      },
      {
        title: "Backend Developer",
        description:
          "Looking for a skilled Backend Developer to build robust server-side applications. You will work with databases, APIs, and server infrastructure using technologies like Node.js, Python, or Java.",
        requirements:
          "Strong knowledge of server-side programming, Experience with databases (MySQL, MongoDB), Knowledge of RESTful APIs, Understanding of cloud services (AWS, Azure)",
        salary_range: "NPR 65,000 - 95,000",
        location: "Lalitpur",
        job_type: "full_time",
        company_id: companies[3].id,
      },
      {
        title: "Project Manager",
        description:
          "We need an experienced Project Manager to lead our development teams and ensure successful project delivery. You will coordinate with clients, manage timelines, and ensure quality deliverables.",
        requirements:
          "Bachelor's degree in Management or related field, 3+ years of project management experience, Knowledge of Agile/Scrum methodologies, Strong communication and leadership skills",
        salary_range: "NPR 75,000 - 110,000",
        location: "Kathmandu",
        job_type: "full_time",
        company_id: companies[4].id,
      },
      {
        title: "Quality Assurance Engineer",
        description:
          "Join our QA team to ensure the quality of our software products. You will design test cases, perform manual and automated testing, and work closely with development teams.",
        requirements:
          "Experience in software testing, Knowledge of testing methodologies, Familiarity with automation tools (Selenium, Cypress), Attention to detail and analytical skills",
        salary_range: "NPR 45,000 - 70,000",
        location: "Pokhara",
        job_type: "full_time",
        company_id: companies[4].id,
      },
      {
        title: "DevOps Engineer",
        description:
          "We are looking for a DevOps Engineer to manage our infrastructure and deployment processes. You will work with cloud platforms, CI/CD pipelines, and containerization technologies.",
        requirements:
          "Experience with cloud platforms (AWS, Azure, GCP), Knowledge of Docker and Kubernetes, Understanding of CI/CD pipelines, Scripting skills (Bash, Python)",
        salary_range: "NPR 85,000 - 125,000",
        location: "Kathmandu",
        job_type: "full_time",
        company_id: companies[0].id,
      },
      {
        title: "Sales Executive",
        description:
          "Join our sales team to drive business growth by acquiring new clients and maintaining relationships with existing customers. You will present our services and negotiate contracts.",
        requirements:
          "Bachelor's degree in Business or related field, 2+ years of sales experience, Excellent communication and negotiation skills, Target-oriented mindset",
        salary_range: "NPR 40,000 - 65,000",
        location: "Kathmandu",
        job_type: "full_time",
        company_id: companies[1].id,
      },
    ]

    let jobsInserted = 0
    for (const job of jobs) {
      try {
        await connection.execute(
          `INSERT INTO jobs (title, description, requirements, salary_range, location, job_type, company_id, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
          [job.title, job.description, job.requirements, job.salary_range, job.location, job.job_type, job.company_id],
        )
        jobsInserted++
        console.log(`   ✅ Created job: ${job.title}`)
      } catch (error) {
        console.error(`   ❌ Failed to create job: ${job.title}`, error.message)
      }
    }

    console.log(`✅ Successfully inserted ${jobsInserted} jobs`)

    // Verify the data
    console.log("\n📊 Verification:")
    const [userCount] = await connection.execute("SELECT COUNT(*) as count FROM users")
    const [jobCount] = await connection.execute("SELECT COUNT(*) as count FROM jobs")
    const [companyCount] = await connection.execute("SELECT COUNT(*) as count FROM users WHERE role = 'company'")
    const [jobSeekerCount] = await connection.execute("SELECT COUNT(*) as count FROM users WHERE role = 'job_seeker'")

    console.log(`   👥 Total users: ${userCount[0].count}`)
    console.log(`   🏢 Companies: ${companyCount[0].count}`)
    console.log(`   👤 Job seekers: ${jobSeekerCount[0].count}`)
    console.log(`   💼 Jobs: ${jobCount[0].count}`)

    console.log("\n🎉 Database seeded successfully!")
    console.log("\n🔑 Sample login credentials:")
    console.log("   Company: hr@techsolutions.np / password123")
    console.log("   Job Seeker: rajesh@example.com / password123")
    console.log("\n🚀 You can now start the server with: npm run dev")
  } catch (error) {
    console.error("❌ Error seeding database:", error.message)
    console.error("Full error:", error)
  } finally {
    if (connection) {
      await connection.end()
      console.log("🔌 Database connection closed")
    }
  }
}

// Run the seeding
seedDatabase()

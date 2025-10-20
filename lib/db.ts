import { Pool } from 'pg'

// Create a direct PostgreSQL connection pool to avoid Prisma prepared statement conflicts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Configure for serverless environments
  max: 1, // Limit connections for serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export const db = {
  async query(text: string, params?: any[]) {
    const client = await pool.connect()
    try {
      const result = await client.query(text, params)
      return result
    } finally {
      client.release()
    }
  },
  
  async close() {
    await pool.end()
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await db.close()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await db.close()
  process.exit(0)
})

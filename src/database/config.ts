import dotenv from 'dotenv'
import pg from 'pg'

const { Pool } = pg
dotenv.config()

// Configure the PostgreSQL connection pool
const db = new Pool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME_DEV,
})

export default db

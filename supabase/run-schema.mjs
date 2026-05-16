import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Try Supabase session pooler (port 5432 via pooler hostname)
const client = new pg.Client({
  connectionString: 'postgresql://postgres.jbmjpqfdquykbwekzyds:VijayTVK2026@aws-0-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
})

await client.connect()
console.log('Connected.')

const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf8')
await client.query(sql)
console.log('Schema applied successfully.')

await client.end()

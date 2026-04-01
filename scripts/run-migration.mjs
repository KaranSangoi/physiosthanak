import postgres from 'postgres';
import { readFileSync } from 'fs';

const sql = postgres({
  host: 'aws-1-ap-south-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  username: 'postgres.rowxllfuqizhxdqaodbe',
  password: 'j8GQHBia7AW0QOVZ',
  ssl: 'require',
});

async function run() {
  try {
    console.log('Connecting to Supabase...');

    // Test connection
    const test = await sql`SELECT 1 as connected`;
    console.log('Connected!\n');

    // Read migration file
    const migration = readFileSync('supabase/migrations/001_pilates_tables.sql', 'utf-8');

    // Split into individual statements (handle $$ function bodies)
    const statements = [];
    let current = '';
    let inFunction = false;

    for (const line of migration.split('\n')) {
      const trimmed = line.trim();

      // Skip pure comment lines
      if (trimmed.startsWith('--') && !inFunction) {
        continue;
      }

      if (trimmed.includes('$$')) {
        inFunction = !inFunction;
      }

      current += line + '\n';

      if (trimmed.endsWith(';') && !inFunction) {
        const stmt = current.trim();
        if (stmt && stmt !== ';') {
          statements.push(stmt);
        }
        current = '';
      }
    }

    console.log(`Found ${statements.length} SQL statements\n`);

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      const preview = stmt.replace(/\n/g, ' ').substring(0, 70);
      console.log(`[${i + 1}/${statements.length}] ${preview}...`);

      try {
        await sql.unsafe(stmt);
        console.log('  ✓ OK');
      } catch (err) {
        console.log(`  ✗ Error: ${err.message}`);
      }
    }

    console.log('\n--- Verifying tables ---');
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name LIKE 'pilates_%'
      ORDER BY table_name
    `;
    console.log('Tables created:', tables.map(t => t.table_name));

    const batches = await sql`SELECT id, name, type, days, time FROM pilates_batches ORDER BY type, days, time`;
    console.log(`\nBatches seeded: ${batches.length}`);
    batches.forEach(b => console.log(`  ${b.type.padEnd(8)} | ${b.days.padEnd(10)} | ${b.time}`));

  } catch (err) {
    console.error('Fatal error:', err.message);
  } finally {
    await sql.end();
  }
}

run();

const pool = require("./db");

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      job_url TEXT UNIQUE NOT NULL,
      platform TEXT,
      status TEXT,
      email_used TEXT,
      cv_path TEXT,
      applied_at TIMESTAMPTZ DEFAULT NOW(),
      error_message TEXT,
      raw_output TEXT
    );
  `);

  console.log("job_applications table ready");
  process.exit(0);
}

init().catch(err => {
  console.error(err);
  process.exit(1);
});

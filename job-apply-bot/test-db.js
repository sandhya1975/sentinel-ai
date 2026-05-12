const pool = require("./db");

async function test() {
  const result = await pool.query("SELECT NOW()");
  console.log(result.rows[0]);
  process.exit(0);
}

test().catch(err => {
  console.error(err);
  process.exit(1);
});

const fs = require("fs");
const { spawnSync } = require("child_process");
const pool = require("./db");

const CV = "/Users/babukunadian/Desktop/Sandhya_CV_DEFINITIVE.pdf";
const EMAIL = "kunadianb@gmail.com";
const MAX_PER_DAY = 10;

function platform(url) {
  const h = new URL(url).hostname;
  if (h.includes("totaljobs")) return "totaljobs";
  if (h.includes("reed")) return "reed";
  if (h.includes("cwjobs")) return "cwjobs";
  return "other";
}

async function alreadyApplied(url) {
  const r = await pool.query("SELECT 1 FROM job_applications WHERE job_url=$1", [url]);
  return r.rowCount > 0;
}

async function appliedToday() {
  const r = await pool.query("SELECT COUNT(*) FROM job_applications WHERE applied_at::date = CURRENT_DATE AND status='submitted_or_next_step'");
  return Number(r.rows[0].count);
}

async function logJob(url, status, output) {
  await pool.query(
    `INSERT INTO job_applications (job_url, platform, status, email_used, cv_path, raw_output)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (job_url) DO NOTHING`,
    [url, platform(url), status, EMAIL, CV, output]
  );
}

(async () => {
  const jobs = [...new Set(fs.readFileSync("jobs.txt", "utf8").split("\n").filter(Boolean))];
  let count = await appliedToday();

  for (const job of jobs) {
    if (count >= MAX_PER_DAY) break;
    if (await alreadyApplied(job)) {
      console.log("SKIP duplicate:", job);
      continue;
    }

    console.log("Applying:", job);
    const result = spawnSync("node", ["apply.js", job, CV], { encoding: "utf8" });
    const output = result.stdout + result.stderr;
    console.log(output);

    const status = output.includes("success: true") ? "submitted_or_next_step" : "failed_or_needs_manual";
    await logJob(job, status, output);
    if (status === "submitted_or_next_step") count++;
  }

  await pool.end();
})();

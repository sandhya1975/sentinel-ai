const express = require("express");
const { spawnSync } = require("child_process");

const app = express();
app.use(express.json());

const CV = "/Users/babukunadian/Desktop/Sandhya_CV_DEFINITIVE.pdf";

app.post("/apply", (req, res) => {
  const { job_url } = req.body;
  if (!job_url) return res.status(400).json({ success: false, status: "failed", error: "job_url required" });

  const result = spawnSync("node", ["apply.js", job_url, CV], { encoding: "utf8" });
  const output = result.stdout + result.stderr;

  if (/captcha/i.test(output)) return res.json({ success: false, status: "captcha" });
  if (/login|sign in/i.test(output)) return res.json({ success: false, status: "login_required" });
  if (output.includes("success: true")) return res.json({ success: true, status: "applied" });

  return res.json({ success: false, status: "failed", error: output });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Playwright apply API running on port ${process.env.PORT || 3000}`);
});

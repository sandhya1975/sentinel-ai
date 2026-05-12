const { chromium } = require("playwright");
const fs = require("fs");

const searchUrl = process.argv[2];

if (!searchUrl) {
  console.log("Usage: node scan-totaljobs.js <totaljobs-search-url>");
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);

  const links = await page.$$eval("a[href]", anchors =>
    [...new Set(
      anchors
        .map(a => a.href)
        .filter(h => h.includes("/job/"))
    )]
  );

  fs.writeFileSync("jobs.txt", links.join("\n"));
  console.log(`Saved ${links.length} jobs to jobs.txt`);

  await browser.close();
})();

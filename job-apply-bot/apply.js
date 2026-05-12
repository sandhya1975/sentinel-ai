
// npm i playwright
// node apply.js "JOB_URL" "/full/path/to/CV.pdf"

const { chromium } = require("playwright");

const jobUrl = process.argv[2];
const cvPath = process.argv[3];

const applicant = {
  fullName: "Sandhya Yatham",
  email: "kunadianb@gmail.com",
  phone: "+44 7530 274836",
};

if (!jobUrl || !cvPath) {
  console.log({ success: false, error: "Usage: node apply.js <jobUrl> <cvPath>" });
  process.exit(1);
}

async function fillIfExists(page, selectors, value) {
  for (const selector of selectors) {
    const field = page.locator(selector).first();
    if (await field.count()) {
      try {
        await field.fill(value, { timeout: 3000 });
        return true;
      } catch {}
    }
  }
  return false;
}

async function clickIfExists(page, selectors) {
  for (const selector of selectors) {
    const button = page.locator(selector).first();
    if (await button.count()) {
      try {
        await button.click({ timeout: 5000 });
        return true;
      } catch {}
    }
  }
  return false;
}


async function acceptCookies(page) {
  const btn = page.getByRole('button', { name: /Accept All/i });
  if (await btn.count()) {
    await btn.first().click().catch(() => {});
    await page.waitForTimeout(1000);
  }
}

async function run() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(jobUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
    await acceptCookies(page);

    await clickIfExists(page, [
      "text=Easy Apply",
      "text=Apply now",
      "text=Apply",
      "button:has-text('Apply')",
      "a:has-text('Apply')",
    ]);

    await page.waitForTimeout(3000);

    await fillIfExists(page, [
      "input[name*='name' i]",
      "input[id*='name' i]",
      "input[placeholder*='name' i]",
    ], applicant.fullName);

    await fillIfExists(page, [
      "input[type='email']",
      "input[name*='email' i]",
      "input[id*='email' i]",
    ], applicant.email);

    await fillIfExists(page, [
      "input[type='tel']",
      "input[name*='phone' i]",
      "input[id*='phone' i]",
      "input[placeholder*='phone' i]",
      "input[placeholder*='mobile' i]",
    ], applicant.phone);

    const upload = page.locator("input[type='file']").first();
    if (await upload.count()) {
      await upload.setInputFiles(cvPath);
    }

    await page.waitForTimeout(2000);

    const submitted = await clickIfExists(page, [
      "button:has-text('Submit')",
      "button:has-text('Send application')",
      "button:has-text('Apply')",
      "button:has-text('Continue')",
      "input[type='submit']",
    ]);

    await page.waitForTimeout(3000);

    console.log({
      success: submitted,
      site: new URL(jobUrl).hostname,
      message: submitted ? "Application submitted or next step clicked" : "Submit button not found",
    });

  } catch (error) {
    console.log({ success: false, error: error.message });
  } finally {
    await browser.close();
  }
}

run();

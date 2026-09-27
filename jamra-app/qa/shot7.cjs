const { chromium, devices } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices["iPhone 13"], hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(URL);
  await page.waitForTimeout(3600);
  await page.click(".hamburger");
  await page.waitForTimeout(900);
  await page.screenshot({ path: "qa/shots/F-m-menuopen.png" });
  await browser.close();
  console.log("re-shot F-m-menuopen");
})();

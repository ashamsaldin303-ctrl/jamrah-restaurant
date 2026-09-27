const { chromium } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL + "#/menu");
  await page.waitForTimeout(3300);
  await page.evaluate(() => window.scrollTo({ top: 500 }));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "qa/shots/j-d-menu.png" });
  await browser.close();
  console.log("shot: j-d-menu");
})();

const { chromium, devices } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
(async () => {
  const browser = await chromium.launch();
  async function cap(name, { mobile = true, hash = "", scroll = 0, wait = 1500 } = {}) {
    const ctx = await browser.newContext(mobile ? { ...devices["iPhone 13"], hasTouch: true } : { viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(URL + hash);
    await page.waitForTimeout(3300);
    if (scroll) await page.evaluate(y => window.scrollTo({ top: y }), scroll);
    await page.waitForTimeout(wait);
    await page.screenshot({ path: "qa/shots/" + name + ".png" });
    await ctx.close();
    console.log("shot:", name);
  }
  await cap("m-home");
  await cap("m-home-mid", { scroll: 1700 });
  await cap("m-reserve", { hash: "#/reserve", scroll: 900 });
  await cap("d-home", { mobile: false });
  await browser.close();
})();

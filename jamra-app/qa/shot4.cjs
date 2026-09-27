const { chromium, devices } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
(async () => {
  const browser = await chromium.launch();
  async function cap(name, { hash = "", scroll = 0, wait = 1400 } = {}) {
    const ctx = await browser.newContext({ ...devices["iPhone 13"], hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(URL + hash);
    await page.waitForTimeout(3300);
    if (scroll) await page.evaluate(y => window.scrollTo({ top: y }), scroll);
    await page.waitForTimeout(wait);
    await page.screenshot({ path: "qa/shots/" + name + ".png" });
    await ctx.close();
    console.log("shot:", name);
  }
  await cap("e-m-menu-top", { hash: "#/menu" });
  await cap("c-m-home-dishes", { scroll: 3600 });
  await browser.close();
})();

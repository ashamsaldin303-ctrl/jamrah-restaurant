const { chromium, devices } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
(async () => {
  const browser = await chromium.launch();
  const errs = [];
  async function cap(name, { mobile = false, hash = "", scroll = 0, wait = 1400 } = {}) {
    const ctx = await browser.newContext(mobile ? { ...devices["iPhone 13"], hasTouch: true } : { viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on("pageerror", e => errs.push(name + " PAGEERROR: " + e.message.split("\n")[0]));
    await page.goto(URL + hash);
    await page.waitForTimeout(3300);
    if (scroll) { await page.evaluate(y => window.scrollTo({ top: y }), scroll); }
    await page.waitForTimeout(wait);
    await page.screenshot({ path: "qa/shots/" + name + ".png" });
    await ctx.close();
    console.log("shot:", name);
  }
  await cap("d-home", {});
  await cap("m-home", { mobile: true });
  await cap("m-home-mid", { mobile: true, scroll: 1500 });
  await cap("m-menu", { mobile: true, hash: "#/menu", scroll: 600 });
  await cap("m-reserve", { mobile: true, hash: "#/reserve", scroll: 800 });
  await cap("m-gallery", { mobile: true, hash: "#/gallery", scroll: 500 });
  await cap("m-about", { mobile: true, hash: "#/about", scroll: 700 });
  await browser.close();
  console.log(errs.length ? errs.join("\n") : "NO PAGE ERRORS");
})();

const { chromium, devices } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
(async () => {
  const browser = await chromium.launch();
  async function cap(name, { mobile = true, hash = "", scroll = 0, wait = 1300, action } = {}) {
    const ctx = await browser.newContext(mobile ? { ...devices["iPhone 13"], hasTouch: true } : { viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on("pageerror", e => console.log("PAGEERROR", name, e.message.split("\n")[0]));
    await page.goto(URL + hash);
    await page.waitForTimeout(3300);
    if (action) { await action(page); await page.waitForTimeout(700); }
    if (scroll) await page.evaluate(y => window.scrollTo({ top: y }), scroll);
    await page.waitForTimeout(wait);
    await page.screenshot({ path: "qa/shots/" + name + ".png" });
    await ctx.close();
    console.log("shot:", name);
  }
  const M = true, D = false;
  await cap("a-m-home-foot", { mobile: M, scroll: 999999 });
  await cap("b-m-home-ritual", { mobile: M, scroll: 2600 });
  await cap("c-m-home-dishes", { mobile: M, scroll: 3600 });
  await cap("d-m-menu-open", { mobile: M, action: p => p.click(".hamburger") });
  await cap("e-m-menu-top", { mobile: M, hash: "#/menu" });
  await cap("f-m-menu-mid", { mobile: M, hash: "#/menu", scroll: 1200 });
  await cap("g-m-lightbox", { mobile: M, hash: "#/gallery", scroll: 700, action: p => p.click(".g-item") });
  await cap("h-m-about-tl", { mobile: M, hash: "#/about", scroll: 1500 });
  await cap("i-m-404", { mobile: M, hash: "#/xxx" });
  await cap("j-d-menu", { mobile: D, hash: "#/menu", scroll: 500 });
  await cap("k-d-about", { mobile: D, hash: "#/about", scroll: 900 });
  await cap("l-d-gallery", { mobile: D, hash: "#/gallery", scroll: 400 });
  await cap("n-d-reserve", { mobile: D, hash: "#/reserve", scroll: 500 });
  await cap("o-d-foot", { mobile: D, scroll: 999999 });
  await browser.close();
  console.log("done");
})();

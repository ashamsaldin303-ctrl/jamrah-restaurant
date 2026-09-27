const { chromium, devices } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
(async () => {
  const browser = await chromium.launch();
  const cases = [
    ["control", ""],
    ["no-pre", "#preloader{display:none!important}"],
    ["no-header", ".site-header{display:none!important}"],
    ["no-hero", ".hero{display:none!important}"],
    ["no-noise", ".noise{display:none!important}"],
    ["no-curtain-route", ".route-curtain{display:none!important}"],
    ["no-marquee", ".marquee{display:none!important}"],
  ];
  for (const [name, css] of cases) {
    const ctx = await browser.newContext({ ...devices["iPhone 13"], hasTouch: true });
    const page = await ctx.newPage();
    if (css) await page.addInitScript(c => {
      const s = document.createElement("style"); s.textContent = c;
      document.addEventListener("DOMContentLoaded", () => document.head.appendChild(s));
    }, css);
    await page.goto(URL);
    await page.waitForTimeout(600);
    const early = await page.evaluate(() => [innerWidth, document.documentElement.scrollWidth]);
    await page.waitForTimeout(3200);
    const late = await page.evaluate(() => [innerWidth, document.documentElement.scrollWidth]);
    console.log(name.padEnd(16), "early:", early.join("/"), " late:", late.join("/"));
    await ctx.close();
  }
  await browser.close();
})();

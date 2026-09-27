const { chromium, devices } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
(async () => {
  const browser = await chromium.launch();
  const matrix = [
    ["device-iPhone13", { ...devices["iPhone 13"] }],
    ["isMobile+touch", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }],
    ["isMobile-only", { viewport: { width: 390, height: 844 }, isMobile: true }],
    ["touch-only", { viewport: { width: 390, height: 844 }, hasTouch: true }],
    ["plain-390", { viewport: { width: 390, height: 844 } }],
  ];
  for (const [name, opts] of matrix) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    await page.goto(URL);
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => ({
      iw: innerWidth, vv: visualViewport?.scale, sw: document.documentElement.scrollWidth,
      meta: document.querySelector("meta[name=viewport]")?.content,
    }));
    console.log(name.padEnd(16), JSON.stringify(r));
    await ctx.close();
  }
  await browser.close();
})();

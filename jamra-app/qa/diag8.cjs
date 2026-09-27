const { chromium, devices } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices["iPhone 13"], hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(URL + "#/menu");
  await page.waitForTimeout(3400);
  const r = await page.evaluate(() => {
    const jc = document.querySelector(".jump-chips");
    const cs = jc ? getComputedStyle(jc) : null;
    const hero = document.querySelector(".page-hero");
    const tools = document.querySelector(".menu-tools");
    return {
      exists: !!jc, display: cs?.display, rect: jc ? JSON.stringify(jc.getBoundingClientRect()) : null,
      buttons: jc?.children.length,
      heroH: hero?.getBoundingClientRect().height,
      toolsTop: tools?.getBoundingClientRect().top,
      iw: innerWidth,
    };
  });
  console.log(JSON.stringify(r));
  await browser.close();
})();

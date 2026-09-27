const { chromium, devices } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices["iPhone 13"], hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(URL);
  await page.waitForTimeout(3600);
  const r = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("button, a, [role=button]").forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && (rect.width < 32 || rect.height < 32) && el.offsetParent) {
        const cs = getComputedStyle(el);
        out.push({ tag: el.tagName, cls: el.className.toString().slice(0, 24), href: el.getAttribute("href"), txt: el.textContent.trim().slice(0, 18), vis: cs.visibility, disp: cs.display, w: Math.round(rect.width), h: Math.round(rect.height) });
      }
    });
    return out;
  });
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})();

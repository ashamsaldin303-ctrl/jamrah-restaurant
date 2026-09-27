const { chromium, devices } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices["iPhone 13"], hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(URL);
  await page.waitForTimeout(3300);
  const res = await page.evaluate(() => {
    const out = { base: document.documentElement.scrollWidth, hits: [] };
    const els = [...document.querySelectorAll("#root > *, body > *")];
    for (const el of els) {
      if (!el.tagName || el.style.display === "none") continue;
      const prev = el.style.display;
      el.style.display = "none";
      const sw = document.documentElement.scrollWidth;
      if (sw < out.base) out.hits.push(`${el.tagName}#${el.id}.${(el.className||"").toString().split(" ")[0]} -> ${sw}`);
      el.style.display = prev;
    }
    // deeper: within hero & header
    for (const sel of [".hero-visual", ".hero-copy", ".hero-stats", ".hero-cta", ".header-actions", ".logo", ".marquee", ".story-visual", ".footer-mega", "#embers", ".rot-badge", ".chip-rating"]) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const prev = el.style.display;
      el.style.display = "none";
      const sw = document.documentElement.scrollWidth;
      if (sw < out.base) out.hits.push(`${sel} -> ${sw}`);
      el.style.display = prev;
    }
    return out;
  });
  console.log(JSON.stringify(res, null, 1));
  await browser.close();
})();

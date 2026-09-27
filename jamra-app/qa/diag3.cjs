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
    const vw = 390;
    const clipped = el => {
      let p = el.parentElement;
      while (p) {
        const o = getComputedStyle(p);
        if (o.overflowX !== "visible" || o.overflowY !== "visible") return true;
        p = p.parentElement;
      }
      return false;
    };
    const bad = [];
    document.querySelectorAll("#root *").forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.position === "fixed") return;
      const r = el.getBoundingClientRect();
      if (r.right > vw + 2 || r.left < -2) {
        if (!clipped(el)) bad.push(`${el.tagName}.${(el.className.baseVal ?? el.className ?? "").toString().split(" ").slice(0,2).join(".")} l=${Math.round(r.left)} r=${Math.round(r.right)} w=${Math.round(r.width)}`);
      }
    });
    return { sw: document.documentElement.scrollWidth, bad: bad.slice(0, 30) };
  });
  console.log("scrollWidth", res.sw);
  res.bad.forEach(b => console.log(" ", b));
  await browser.close();
})();

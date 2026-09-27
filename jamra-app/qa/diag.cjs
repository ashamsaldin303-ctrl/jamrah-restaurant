const { chromium, devices } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
(async () => {
  const browser = await chromium.launch();
  for (const [label, ctxOpts] of [["mobile", { ...devices["iPhone 13"], hasTouch: true }], ["desktop", { viewport: { width: 1440, height: 900 } }]]) {
    const ctx = await browser.newContext(ctxOpts);
    const page = await ctx.newPage();
    await page.goto(URL);
    await page.waitForTimeout(3300);
    const info = await page.evaluate(() => {
      const vw = window.innerWidth;
      const bad = [];
      document.querySelectorAll("*").forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width > vw + 2 || r.right > vw + 2 || r.left < -2) {
          const cs = getComputedStyle(el);
          if (cs.position === "fixed") return;
          bad.push(`${el.tagName}.${(el.className.baseVal ?? el.className ?? "").toString().split(" ").slice(0,3).join(".")} w=${Math.round(r.width)} l=${Math.round(r.left)} r=${Math.round(r.right)} pos=${cs.position} ovf=${cs.overflowX}`);
        }
      });
      return { vw, sw: document.documentElement.scrollWidth, bw: document.body.clientWidth, bad: bad.slice(0, 25) };
    });
    console.log("==", label, "viewport:", info.vw, "scrollWidth:", info.sw, "bodyWidth:", info.bw);
    info.bad.forEach(b => console.log("  ", b));
    await ctx.close();
  }
  await browser.close();
})();

const { chromium, devices } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices["iPhone 13"], hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(URL + "#/reserve");
  await page.waitForTimeout(3500);
  const r = await page.evaluate(() => {
    const out = [];
    const probe = root => {
      [...root.children].forEach(el => {
        const prev = el.style.display;
        el.style.display = "none";
        const w = document.querySelector(".form-card").getBoundingClientRect().width;
        if (w < 500) out.push("CULPRIT-CHILD: " + el.tagName + "." + (el.className || "").toString().split(" ")[0] + " -> form width " + Math.round(w));
        el.style.display = prev;
      });
    };
    probe(document.querySelector("#reserveForm"));
    // deeper in each form block
    document.querySelectorAll("#reserveForm > *").forEach(blk => {
      [...blk.children].forEach(el => {
        const prev = el.style.display;
        el.style.display = "none";
        const w = document.querySelector(".form-card").getBoundingClientRect().width;
        if (w < 500) out.push("  deep: " + blk.className.split(" ")[0] + " > " + el.tagName + "." + (el.className || "").toString().split(" ")[0] + " -> " + Math.round(w));
        el.style.display = prev;
      });
    });
    return out;
  });
  console.log(r.join("\n") || "no single-child culprit");
  await browser.close();
})();

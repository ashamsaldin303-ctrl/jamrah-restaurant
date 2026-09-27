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
    const li = document.querySelector(".summary-card li");
    const card = document.querySelector(".summary-card");
    const form = document.querySelector(".form-card");
    return {
      scrollX: scrollX, sw: document.documentElement.scrollWidth, iw: innerWidth,
      liText: li ? li.textContent : null,
      liDisplay: li ? getComputedStyle(li).display : null,
      bText: li ? li.querySelector("b")?.textContent : null,
      cardRect: card ? JSON.stringify(card.getBoundingClientRect()) : null,
      formRect: form ? JSON.stringify(form.getBoundingClientRect()) : null,
    };
  });
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})();

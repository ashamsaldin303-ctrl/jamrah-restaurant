const { chromium, devices } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
const ROUTES = ["#/", "#/about", "#/menu", "#/gallery", "#/reserve", "#/zzz"];
(async () => {
  const browser = await chromium.launch();
  const report = [];
  // 1) console/page errors + meta per route (desktop)
  for (const r of ROUTES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errs = [], warns = [];
    page.on("pageerror", e => errs.push("PAGEERROR " + e.message.split("\n")[0]));
    page.on("console", m => { if (m.type() === "error") errs.push("CONSOLE " + m.text().slice(0, 120)); if (m.type() === "warning") warns.push(m.text().slice(0, 100)); });
    await page.goto(URL + r);
    await page.waitForTimeout(3600);
    const meta = await page.evaluate(() => ({
      title: document.title,
      desc: (document.querySelector('meta[name="description"]')?.content || "").slice(0, 40),
      h1: document.querySelectorAll("h1").length,
      noAlt: [...document.images].filter(i => !i.alt).length,
      noNameBtns: [...document.querySelectorAll("button")].filter(b => !(b.textContent.trim() || b.getAttribute("aria-label"))).length,
      jsonld: !!document.querySelector('script[type="application/ld+json"]'),
      og: !!document.querySelector('meta[property="og:title"]'),
    }));
    report.push([r, meta, errs, warns.slice(0, 3)]);
    await ctx.close();
  }
  // 2) mobile: tap targets + keyboard + lightbox escape + back nav
  const ctx = await browser.newContext({ ...devices["iPhone 13"], hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(URL + "#/");
  await page.waitForTimeout(3600);
  const small = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll("button, a, [role=button]").forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.width < 32 || r.height < 32) && el.offsetParent) bad.push(el.className.toString().split(" ")[0] + ":" + Math.round(r.width) + "x" + Math.round(r.height));
    });
    return bad.slice(0, 12);
  });
  // lightbox escape
  await page.goto(URL + "#/gallery");
  await page.waitForTimeout(3400);
  await page.evaluate(() => window.scrollTo({ top: 700 }));
  await page.waitForTimeout(600);
  await page.click(".g-item");
  await page.waitForTimeout(600);
  const lbOpen = await page.evaluate(() => !!document.querySelector(".lightbox.open"));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  const lbClosed = await page.evaluate(() => !document.querySelector(".lightbox.open"));
  // back navigation
  await page.goto(URL + "#/menu");
  await page.waitForTimeout(1500);
  await page.goBack();
  await page.waitForTimeout(1200);
  const backHash = await page.evaluate(() => location.hash);
  console.log("== ROUTE META/ERRORS ==");
  for (const [r, m, errs, warns] of report) {
    console.log(r.padEnd(10), "h1:" + m.h1, "noAlt:" + m.noAlt, "noNameBtn:" + m.noNameBtns, "jsonld:" + m.jsonld, "og:" + m.og, "|", m.title.slice(0, 30));
    errs.forEach(e => console.log("   ERR:", e));
    warns.forEach(w => console.log("   warn:", w));
  }
  console.log("== MOBILE ==");
  console.log("small tap targets:", small.length ? small : "none");
  console.log("lightbox open->escape closes:", lbOpen, "->", lbClosed);
  console.log("back nav hash:", backHash);
  await browser.close();
})();

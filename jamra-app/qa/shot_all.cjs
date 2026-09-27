const { chromium, devices } = require("playwright");
const path = require("path");
const URL = "file://" + path.resolve("dist/index.html");
(async () => {
  const browser = await chromium.launch();
  const jobs = [];
  async function cap(name, { mobile = false, hash = "", scroll = 0, wait = 1300, act } = {}) {
    const ctx = await browser.newContext(mobile ? { ...devices["iPhone 13"], hasTouch: true } : { viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    page.on("pageerror", e => jobs.push("PAGEERROR " + name + ": " + e.message.split("\n")[0]));
    await page.goto(URL + hash);
    await page.waitForTimeout(3400);
    if (act) { await act(page); await page.waitForTimeout(800); }
    if (scroll) { await page.evaluate(y => window.scrollTo({ top: y }), scroll); }
    await page.waitForTimeout(wait);
    await page.screenshot({ path: "qa/shots/" + name + ".png" });
    await ctx.close();
    console.log("✓", name);
  }
  // ── DESKTOP ──
  await cap("F-d-home-1", {});
  await cap("F-d-home-2", { scroll: 900 });
  await cap("F-d-home-3", { scroll: 2000 });
  await cap("F-d-home-4", { scroll: 3200 });
  await cap("F-d-home-5", { scroll: 4600 });
  await cap("F-d-home-6", { scroll: 999999 });
  await cap("F-d-about-1", { hash: "#/about" });
  await cap("F-d-about-2", { hash: "#/about", scroll: 1000 });
  await cap("F-d-about-3", { hash: "#/about", scroll: 2100 });
  await cap("F-d-about-4", { hash: "#/about", scroll: 3200 });
  await cap("F-d-menu-1", { hash: "#/menu" });
  await cap("F-d-menu-2", { hash: "#/menu", scroll: 900 });
  await cap("F-d-menu-tab", { hash: "#/", scroll: 0, act: async p => {
    await p.evaluate(() => document.getElementById("home-menu").scrollIntoView());
    await p.waitForTimeout(900);
    await p.click('.menu-tabs button:has-text("الحلويات")');
  } });
  await cap("F-d-menu-search", { hash: "#/menu", scroll: 400, act: p => p.fill(".search-box input", "كنافة") });
  await cap("F-d-gallery-1", { hash: "#/gallery" });
  await cap("F-d-gallery-2", { hash: "#/gallery", scroll: 800 });
  await cap("F-d-lightbox", { hash: "#/gallery", scroll: 800, act: p => p.click(".g-item") });
  await cap("F-d-reserve-1", { hash: "#/reserve" });
  await cap("F-d-reserve-2", { hash: "#/reserve", scroll: 800 });
  await cap("F-d-404", { hash: "#/nope" });
  // ── MOBILE ──
  await cap("F-m-home-1", { mobile: true });
  await cap("F-m-home-2", { mobile: true, scroll: 700 });
  await cap("F-m-home-3", { mobile: true, scroll: 1500 });
  await cap("F-m-home-4", { mobile: true, scroll: 2500 });
  await cap("F-m-home-5", { mobile: true, scroll: 3600 });
  await cap("F-m-home-6", { mobile: true, scroll: 5200 });
  await cap("F-m-home-7", { mobile: true, scroll: 999999 });
  await cap("F-m-about-1", { mobile: true, hash: "#/about" });
  await cap("F-m-about-2", { mobile: true, hash: "#/about", scroll: 1200 });
  await cap("F-m-about-3", { mobile: true, hash: "#/about", scroll: 2600 });
  await cap("F-m-menu-1", { mobile: true, hash: "#/menu" });
  await cap("F-m-menu-2", { mobile: true, hash: "#/menu", scroll: 1100 });
  await cap("F-m-gallery-1", { mobile: true, hash: "#/gallery" });
  await cap("F-m-gallery-2", { mobile: true, hash: "#/gallery", scroll: 900 });
  await cap("F-m-lightbox", { mobile: true, hash: "#/gallery", scroll: 900, act: p => p.click(".g-item") });
  await cap("F-m-reserve-1", { mobile: true, hash: "#/reserve" });
  await cap("F-m-reserve-2", { mobile: true, hash: "#/reserve", scroll: 1000 });
  await cap("F-m-reserve-ok", { mobile: true, hash: "#/reserve", scroll: 1400, act: async p => {
    await p.fill("#fName", "محمد العتيبي"); await p.fill("#fPhone", "0555555555");
    await p.click("#reserveSubmit"); await p.waitForTimeout(2400);
  }});
  await cap("F-m-menuopen", { mobile: true, act: p => p.click(".hamburger") });
  await cap("F-m-404", { mobile: true, hash: "#/nope" });
  await browser.close();
  console.log(jobs.length ? jobs.join("\n") : "NO PAGE ERRORS ANYWHERE");
})();

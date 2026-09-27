const { JSDOM, VirtualConsole } = require("jsdom");
const fs = require("fs");
const html = fs.readFileSync("dist/index.html", "utf8");

const vc = new VirtualConsole();
const errors = [];
vc.on("jsdomError", e => { if (!/scrollTo|Not implemented|Could not parse CSS/.test(e.message)) errors.push("jsdomError: " + e.message.split("\n")[0]); });
vc.on("error", (...a) => errors.push("console.error: " + a[0]));

const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true, url: "http://localhost/", virtualConsole: vc });
const w = dom.window;

// stubs
w.IntersectionObserver = class { constructor(cb){ this.cb = cb; } observe(el){ this.cb([{ isIntersecting: true, target: el }], this); } unobserve(){} disconnect(){} };
w.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} };
w.HTMLCanvasElement.prototype.getContext = function(){ return { setTransform(){}, clearRect(){}, drawImage(){}, fillRect(){}, createRadialGradient(){ return { addColorStop(){} }; }, set globalAlpha(v){}, get globalAlpha(){return 1;}, set globalCompositeOperation(v){}, get globalCompositeOperation(){return "source-over";}, set fillStyle(v){} }; };
w.scrollTo = () => {};
w.matchMedia = w.matchMedia || (q => ({ matches: false, media: q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} }));

// run the bundled module script
const m = html.match(/<script type="module"[^>]*>([\s\S]*?)<\/script>/);
if (!m) { console.log("FAIL no module script"); process.exit(1); }
try { w.eval(m[1]); } catch (e) { errors.push("EVAL THROW: " + e.message); }

const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  w.dispatchEvent(new w.Event("load"));
  await sleep(3200); // preloader chain
  const d = w.document;
  const checks = [];
  const has = (sel) => !!d.querySelector(sel);
  checks.push(["root rendered", (d.getElementById("root")?.children.length || 0) > 0]);
  checks.push(["preloader done", !has("#preloader") || has("#preloader.done") || has("#preloader.leaving")]);
  checks.push(["navbar", has(".site-header .logo-text")]);
  checks.push(["hero title", (d.querySelector(".hero-title")?.textContent || "").includes("جَمرة")]);
  checks.push(["marquee", d.querySelectorAll(".mq-item").length >= 12]);
  checks.push(["ritual cards", d.querySelectorAll(".ritual-card").length === 4]);
  checks.push(["dish cards", d.querySelectorAll(".dish-card").length === 5]);
  checks.push(["testimonials", d.querySelectorAll(".t-slide").length === 4]);
  checks.push(["footer mega", has(".footer-mega .fm-ar")]);
  // navigate to menu
  w.location.hash = "#/menu";
  await sleep(900);
  checks.push(["menu page sections", d.querySelectorAll(".menu-section").length >= 5]);
  checks.push(["menu search box", has(".search-box input")]);
  // gallery
  w.location.hash = "#/gallery";
  await sleep(900);
  checks.push(["gallery items", d.querySelectorAll(".g-item").length === 8]);
  // open lightbox
  d.querySelector(".g-item")?.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await sleep(500);
  checks.push(["lightbox open", has(".lightbox.open")]);
  d.querySelector(".lb-close")?.dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  // reserve
  w.location.hash = "#/reserve";
  await sleep(900);
  checks.push(["day chips", d.querySelectorAll(".day-chip").length === 7]);
  checks.push(["summary card", has(".summary-card")]);
  // 404
  w.location.hash = "#/nope";
  await sleep(900);
  checks.push(["404 page", (d.querySelector(".nf-code")?.textContent || "") === "٤٠"]);
  let fail = 0;
  for (const [n, ok] of checks) { console.log((ok ? "PASS" : "FAIL") + "  " + n); if (!ok) fail++; }
  if (errors.length) { console.log("\nERRORS:"); errors.slice(0, 6).forEach(e => console.log(" -", e)); }
  console.log(fail || errors.length ? "\nSMOKE FAILED" : "\nSMOKE OK — all pages render, no uncaught errors ✓");
  process.exit(fail || errors.length ? 1 : 0);
})();

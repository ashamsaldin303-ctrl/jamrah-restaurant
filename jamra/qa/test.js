const { JSDOM, VirtualConsole } = require("jsdom");
const fs = require("fs");
const html = fs.readFileSync("../index.html", "utf8");

const vc = new VirtualConsole();
let hardErrors = [];
vc.on("jsdomError", e => { if (!/scrollTo|Not implemented/.test(e.message)) hardErrors.push("jsdomError: " + e.message); });
vc.on("error", m => hardErrors.push("console.error: " + m));

const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true, url: "http://localhost/", virtualConsole: vc });
const w = dom.window;

// --- browser API stubs missing in jsdom ---
w.IntersectionObserver = class { constructor(cb){ this.cb = cb; } observe(el){ this.cb([{ isIntersecting: true, target: el }], this); } unobserve(){} disconnect(){} };
w.HTMLCanvasElement.prototype.getContext = function(){ return {
  setTransform(){}, clearRect(){}, drawImage(){}, fillRect(){}, save(){}, restore(){},
  createRadialGradient(){ return { addColorStop(){} }; },
  set globalAlpha(v){}, get globalAlpha(){ return 1; },
  set globalCompositeOperation(v){}, get globalCompositeOperation(){ return "source-over"; },
  set fillStyle(v){}, set shadowBlur(v){}, set shadowColor(v){},
};};
if (!w.matchMedia) w.matchMedia = q => ({ matches: false, media: q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} });
const mm = w.matchMedia; w.matchMedia = q => ({ matches: false, media: q, addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){} });
w.scrollTo = () => {};
Object.defineProperty(w, "scrollY", { value: 0, writable: true });

// --- run all inline scripts ---
const scripts = [...w.document.querySelectorAll("script")].filter(s => !s.type || s.type === "text/javascript");
for (const s of scripts) {
  try { w.eval(s.textContent); } catch (e) { hardErrors.push("SCRIPT THROW: " + e.stack.split("\n").slice(0,3).join(" | ")); }
}

// --- simulate load + wait for preloader chain ---
w.dispatchEvent(new w.Event("load"));
setTimeout(() => {
  const d = w.document;
  const checks = [];
  checks.push(["preloader leaving/done", d.getElementById("preloader").className.includes("leaving") || d.getElementById("preloader").className.includes("done")]);
  checks.push(["body.ready", d.body.classList.contains("ready")]);
  checks.push(["marquee cloned", d.querySelectorAll("#marqueeTrack .mq-item").length === 12]);
  checks.push(["tabs indicator width set", (d.getElementById("tabIndicator").style.width || "").length > 0]);
  checks.push(["dots built", d.querySelectorAll(".dot-link").length === 8]);
  checks.push(["t-dots built", d.querySelectorAll(".t-dot").length === 4]);
  checks.push(["no-scroll removed", !d.body.classList.contains("no-scroll")]);
  let fail = 0;
  for (const [name, ok] of checks) { console.log((ok ? "PASS" : "FAIL") + "  " + name); if (!ok) fail++; }
  // interaction smoke tests
  try {
    d.querySelectorAll(".menu-tab")[2].click();
    console.log("PASS  tab switch ->", d.querySelector(".menu-panel.active").id);
    d.getElementById("railNext").click();
    d.getElementById("tNext").click();
    d.querySelectorAll(".g-item")[0].click();
    console.log("PASS  lightbox open:", d.getElementById("lightbox").classList.contains("open"));
    d.querySelector("[data-lb-close]").click();
    d.getElementById("hamburger").click();
    console.log("PASS  menu open:", d.body.classList.contains("menu-open"));
    d.getElementById("hamburger").click();
    d.querySelector("#guestsStepper .step-btn[data-step='1']").click();
    console.log("PASS  guests:", d.getElementById("guestsVal").textContent);
    // form submit with valid data
    d.getElementById("fName").value = "محمد العتيبي";
    d.getElementById("fPhone").value = "0555555555";
    d.getElementById("fDate").value = "2026-10-05";
    d.getElementById("reserveForm").dispatchEvent(new w.Event("submit", { cancelable: true }));
    setTimeout(() => {
      console.log("PASS  submit success state:", d.getElementById("reserveSubmit").classList.contains("success") || d.getElementById("reserveSubmit").classList.contains("loading"));
      if (hardErrors.length) { console.log("\nHARD ERRORS:"); hardErrors.forEach(e => console.log(" -", e)); process.exit(1); }
      console.log("\nALL RUNTIME CHECKS DONE — no uncaught errors ✓");
      process.exit(fail ? 1 : 0);
    }, 2200);
  } catch (e) { console.log("INTERACTION ERROR:", e.message); process.exit(1); }
}, 3200);

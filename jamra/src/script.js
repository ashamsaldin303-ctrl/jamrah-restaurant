/* ═══════════════════════════════════════════
   جَمرة — Jamrah | main script
   ═══════════════════════════════════════════ */
(() => {
"use strict";
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = matchMedia("(pointer: coarse)").matches;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const T0 = performance.now();

/* ───────── Preloader ───────── */
const pre = $("#preloader");
const preBar = $(".pre-bar span", pre);
const preCount = $(".pre-count b", pre);
const preDone = new Promise(res => {
  let finished = false;
  const finish = () => { if (!finished) { finished = true; res(); } };
  window.addEventListener("load", finish, { once: true });
  setTimeout(finish, 4200);                       // safety cap
  setTimeout(finish, reduced ? 500 : 2100);       // minimum drama
});
let preP = 0;
(function preTick() {
  const t = Math.min(1, (performance.now() - T0) / (reduced ? 450 : 1950));
  preP = 92 * (1 - Math.pow(1 - t, 2.2));
  preBar.style.width = preP + "%";
  preCount.textContent = Math.round(preP);
  if (t < 1) requestAnimationFrame(preTick);
})();
preDone.then(() => {
  preBar.style.width = "100%"; preCount.textContent = "100";
  setTimeout(() => {
    pre.classList.add("leaving");
    document.body.classList.add("ready");          // hero intro starts
    emberOn = true;
    setTimeout(() => {
      pre.classList.add("done");
      document.body.classList.remove("no-scroll");
      if (location.hash.length > 1) {
        const el = $(location.hash);
        if (el) setTimeout(() => scrollToY(el.getBoundingClientRect().top + window.scrollY - 70, true), 350);
      }
    }, reduced ? 200 : 1550);
  }, 280);
});

/* ───────── Smooth scroll (lenis-like) ───────── */
const smooth = { target: window.scrollY, current: window.scrollY, ease: 0.1, active: !reduced && !isTouch, self: false };
const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
function scrollToY(y, instant) {
  y = clamp(y, 0, Math.max(0, maxScroll()));
  if (smooth.active && !instant) { smooth.target = y; }
  else { smooth.self = true; window.scrollTo(0, y); smooth.self = false; smooth.target = smooth.current = y; }
}
if (smooth.active) {
  addEventListener("wheel", e => {
    if (document.body.classList.contains("menu-open") || $("#lightbox").classList.contains("open")) return;
    e.preventDefault();
    let d = e.deltaY;
    if (e.deltaMode === 1) d *= 16; else if (e.deltaMode === 2) d *= innerHeight;
    smooth.target = clamp(smooth.target + d, 0, maxScroll());
  }, { passive: false });
  addEventListener("scroll", () => { if (Math.abs(window.scrollY - smooth.current) > 2) smooth.target = smooth.current = window.scrollY; }, { passive: true });
}
document.addEventListener("click", e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href");
  if (id.length < 2) { e.preventDefault(); scrollToY(0); return; }
  const el = $(id);
  if (!el) return;
  e.preventDefault();
  const wasOpen = document.body.classList.contains("menu-open");
  if (wasOpen) closeMenu();
  setTimeout(() => scrollToY(el.getBoundingClientRect().top + window.scrollY - 72), wasOpen ? 300 : 0);
});

/* ───────── Header state ───────── */
const header = $("#siteHeader");
let lastY = window.scrollY;
function headerState(y) {
  header.classList.toggle("scrolled", y > 28);
  if (y > lastY + 4 && y > 460 && !document.body.classList.contains("menu-open")) header.classList.add("hid");
  else if (y < lastY - 4) header.classList.remove("hid");
  lastY = y;
}

/* ───────── Scroll progress ───────── */
const progressEl = $("#scrollProgress");
function progressState(y) {
  const m = Math.max(1, maxScroll());
  progressEl.style.transform = `scaleX(${clamp(y / m, 0, 1)})`;
}

/* ───────── Parallax ───────── */
const parallaxEls = $$("[data-parallax]").map(el => ({ el, s: parseFloat(el.dataset.parallax) || 0 }));
function parallaxFrame() {
  if (reduced) return;
  const vh = innerHeight;
  for (const p of parallaxEls) {
    const r = p.el.getBoundingClientRect();
    if (r.bottom < -220 || r.top > vh + 220) continue;
    const off = (r.top + r.height / 2 - vh / 2) * p.s;
    p.el.style.translate = `0 ${off.toFixed(1)}px`;
  }
}

/* ───────── Custom cursor ───────── */
const dot = $("#cursorDot"), ring = $("#cursorRing");
const cur = { x: innerWidth / 2, y: innerHeight / 2, dx: innerWidth / 2, dy: innerHeight / 2, rx: innerWidth / 2, ry: innerHeight / 2, on: false };
if (!isTouch && !reduced) {
  document.body.classList.add("custom-cursor");
  addEventListener("mousemove", e => {
    cur.x = e.clientX; cur.y = e.clientY;
    if (!cur.on) { cur.on = true; cur.dx = cur.rx = e.clientX; cur.dy = cur.ry = e.clientY; }
    if (dot.style.opacity === "0") { dot.style.opacity = ring.style.opacity = "1"; }
  }, { passive: true });
  document.addEventListener("mouseleave", () => { dot.style.opacity = ring.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { dot.style.opacity = ring.style.opacity = "1"; });
  addEventListener("mousedown", () => document.body.classList.add("c-down"));
  addEventListener("mouseup",   () => document.body.classList.remove("c-down"));
  const hoverSel = "a,button,input,select,textarea,label,.g-item,.dish-card,.t-dot,.rail,[role=button]";
  document.addEventListener("mouseover", e => { if (e.target.closest(hoverSel)) document.body.classList.add("c-hover"); });
  document.addEventListener("mouseout",  e => { if (e.target.closest(hoverSel) && !e.relatedTarget?.closest?.(hoverSel)) document.body.classList.remove("c-hover"); });
}
function cursorFrame() {
  if (!cur.on) return;
  cur.dx = lerp(cur.dx, cur.x, 0.85); cur.dy = lerp(cur.dy, cur.y, 0.85);
  cur.rx = lerp(cur.rx, cur.x, 0.16); cur.ry = lerp(cur.ry, cur.y, 0.16);
  dot.style.translate  = `${cur.dx}px ${cur.dy}px`;
  ring.style.translate = `${cur.rx}px ${cur.ry}px`;
}

/* ───────── Magnetic elements ───────── */
if (!isTouch && !reduced) {
  $$("[data-magnetic]").forEach(el => {
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transition = "translate .12s linear";
      el.style.translate = `${dx * 0.28}px ${dy * 0.38}px`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transition = "translate .65s cubic-bezier(.16,1,.3,1)";
      el.style.translate = "0 0";
    });
  });
}

/* ───────── Ember sprites (shared by hero + sparks) ───────── */
const EMBER_COLORS = ["255,122,60", "255,179,71", "255,96,42", "243,212,136"];
const sprites = EMBER_COLORS.map(rgb => {
  const c = document.createElement("canvas"); c.width = c.height = 32;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, `rgba(${rgb},1)`);
  grad.addColorStop(.35, `rgba(${rgb},.55)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad; g.fillRect(0, 0, 32, 32);
  return c;
});

/* ───────── Hero embers canvas ───────── */
const eCv = $("#embers"), eCtx = eCv.getContext ? eCv.getContext("2d") : null;
let eW = 0, eH = 0, embers = [], emberOn = false, emberInView = true;
function emberResize() {
  if (!eCtx) return;
  const dpr = Math.min(2, devicePixelRatio || 1);
  const r = eCv.parentElement.getBoundingClientRect();
  eW = r.width; eH = r.height;
  eCv.width = eW * dpr; eCv.height = eH * dpr;
  eCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function spawnEmber(init) {
  return {
    x: Math.random() * eW,
    y: init ? Math.random() * eH : eH + Math.random() * 40,
    r: .7 + Math.random() * 2.4,
    vy: -(10 + Math.random() * 34),
    drift: (Math.random() - .5) * 14,
    ph: Math.random() * Math.PI * 2,
    life: 0,
    max: 4.5 + Math.random() * 5.5,
    sp: sprites[(Math.random() * sprites.length) | 0],
    fl: .5 + Math.random() * .5
  };
}
let eLast = performance.now();
function emberFrame(now) {
  if (!eCtx || !emberOn || !emberInView || document.hidden) { eLast = now; return; }
  const dt = Math.min(.05, (now - eLast) / 1000); eLast = now;
  const count = eW < 640 ? 26 : 58;
  while (embers.length < count) embers.push(spawnEmber(embers.length === 0));
  eCtx.clearRect(0, 0, eW, eH);
  eCtx.globalCompositeOperation = "lighter";
  for (let i = embers.length - 1; i >= 0; i--) {
    const p = embers[i];
    p.life += dt;
    if (p.life > p.max || p.y < -20) { embers[i] = spawnEmber(false); continue; }
    p.y += p.vy * dt;
    p.x += (p.drift + Math.sin(p.life * 1.6 + p.ph) * 12) * dt;
    const t = p.life / p.max;
    const a = Math.sin(Math.min(1, t * 1.6) * Math.PI * .5) * (1 - Math.pow(t, 2.4)) * (.5 + Math.sin(now / 130 * p.fl + p.ph) * .22 + .28);
    const s = p.r * 7;
    eCtx.globalAlpha = clamp(a, 0, 1) * .85;
    eCtx.drawImage(p.sp, p.x - s / 2, p.y - s / 2, s, s);
  }
  eCtx.globalAlpha = 1;
  eCtx.globalCompositeOperation = "source-over";
}
emberResize();
addEventListener("resize", emberResize);
new IntersectionObserver(en => { emberInView = en[0].isIntersecting; }, { threshold: 0 }).observe($(".hero"));

/* ───────── Click spark bursts ───────── */
const sCv = $("#sparks"), sCtx = sCv.getContext ? sCv.getContext("2d") : null;
let sparks = [], sLast = performance.now();
function sparkResize() {
  if (!sCtx) return;
  const dpr = Math.min(2, devicePixelRatio || 1);
  sCv.width = innerWidth * dpr; sCv.height = innerHeight * dpr;
  sCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
sparkResize(); addEventListener("resize", sparkResize);
document.addEventListener("click", e => {
  if (reduced || !sCtx || !e.target.closest("[data-spark]")) return;
  for (let i = 0; i < 18; i++) {
    const ang = Math.random() * Math.PI * 2, v = 55 + Math.random() * 240;
    sparks.push({ x: e.clientX, y: e.clientY, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - 70,
      r: .6 + Math.random() * 1.9, life: 0, max: .45 + Math.random() * .7,
      sp: sprites[(Math.random() * sprites.length) | 0] });
  }
});
function sparkFrame(now) {
  const dt = Math.min(.05, (now - sLast) / 1000); sLast = now;
  if (!sparks.length || !sCtx) return;
  sCtx.clearRect(0, 0, innerWidth, innerHeight);
  sCtx.globalCompositeOperation = "lighter";
  for (let i = sparks.length - 1; i >= 0; i--) {
    const p = sparks[i]; p.life += dt;
    if (p.life > p.max) { sparks.splice(i, 1); continue; }
    p.vy += 340 * dt; p.vx *= .985; p.vy *= .985;
    p.x += p.vx * dt; p.y += p.vy * dt;
    const a = 1 - p.life / p.max;
    const s = p.r * 6.5 * (.5 + a * .7);
    sCtx.globalAlpha = a * .9;
    sCtx.drawImage(p.sp, p.x - s / 2, p.y - s / 2, s, s);
  }
  sCtx.globalAlpha = 1;
  sCtx.globalCompositeOperation = "source-over";
  if (!sparks.length) sCtx.clearRect(0, 0, innerWidth, innerHeight);
}
function styleSparks() {
  sCv.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;z-index:996;pointer-events:none";
}
styleSparks();

/* ───────── Master rAF loop ───────── */
function frame(now) {
  if (smooth.active && !document.body.classList.contains("no-scroll")) {
    const d = smooth.target - smooth.current;
    if (Math.abs(d) > .3) {
      smooth.current += d * smooth.ease;
      smooth.self = true; window.scrollTo(0, smooth.current); smooth.self = false;
    } else if (smooth.current !== smooth.target) {
      smooth.current = smooth.target;
      smooth.self = true; window.scrollTo(0, smooth.current); smooth.self = false;
    }
  }
  const y = window.scrollY;
  headerState(y);
  progressState(y);
  parallaxFrame();
  cursorFrame();
  emberFrame(now);
  sparkFrame(now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ───────── Reveal on scroll ───────── */
$$("[data-stagger]").forEach(box => {
  $$("[data-reveal]", box).forEach((el, i) => el.style.setProperty("--d", `${i * 85}ms`));
});
const revIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("revealed"); revIO.unobserve(en.target); }
  });
}, { threshold: .12, rootMargin: "0px 0px -5% 0px" });
$$("[data-reveal]").forEach(el => revIO.observe(el));

/* ───────── Counters ───────── */
const cntIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target; cntIO.unobserve(el);
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    if (reduced) { el.textContent = target.toFixed(dec); return; }
    const t0 = performance.now(), dur = 2000;
    (function step(now) {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 4.5);
      el.textContent = (target * e).toFixed(dec);
      if (t < 1) requestAnimationFrame(step);
    })(t0);
  });
}, { threshold: .6 });
$$("[data-count]").forEach(el => cntIO.observe(el));

/* ───────── Mobile menu ───────── */
const hamburger = $("#hamburger"), mobileMenu = $("#mobileMenu");
function openMenu() {
  document.body.classList.add("menu-open", "no-scroll");
  hamburger.setAttribute("aria-expanded", "true");
  mobileMenu.setAttribute("aria-hidden", "false");
  setTimeout(() => $(".mm-nav a")?.focus(), 430);
}
function closeMenu() {
  if (!document.body.classList.contains("menu-open")) return;
  document.body.classList.remove("menu-open");
  if (pre.classList.contains("done")) document.body.classList.remove("no-scroll");
  hamburger.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
  if (mobileMenu.contains(document.activeElement)) hamburger.focus();
}
hamburger.addEventListener("click", () =>
  document.body.classList.contains("menu-open") ? closeMenu() : openMenu());
$$(".mm-nav a").forEach(a => a.addEventListener("click", closeMenu));
addEventListener("keydown", e => {
  if (e.key === "Escape") { closeMenu(); closeLB(); }
});

/* ───────── Marquee seamless clone ───────── */
const mqTrack = $("#marqueeTrack");
mqTrack.innerHTML += mqTrack.innerHTML;

/* ───────── Dishes rail ───────── */
const rail = $("#dishesRail"), railThumb = $("#railThumb");
const railNext = $("#railNext"), railPrev = $("#railPrev");
const isRTL = document.documentElement.dir === "rtl";
const cardStep = () => ($(".dish-card", rail)?.offsetWidth || 320) + 26;
function railScroll(sign) {
  const dx = sign * cardStep();
  if (rail.scrollBy) rail.scrollBy({ left: dx, behavior: reduced ? "auto" : "smooth" });
  else rail.scrollLeft += dx;
}
railNext.addEventListener("click", () => railScroll(isRTL ? -1 : 1));
railPrev.addEventListener("click", () => railScroll(isRTL ? 1 : -1));
function railUI() {
  const max = rail.scrollWidth - rail.clientWidth;
  const pos = Math.abs(rail.scrollLeft);
  const p = max > 2 ? clamp(pos / max, 0, 1) : 0;
  const trackW = railThumb.parentElement.offsetWidth;
  railThumb.style.width = Math.max(14, (rail.clientWidth / Math.max(1, rail.scrollWidth)) * trackW) + "px";
  railThumb.style.marginLeft = ((trackW - railThumb.offsetWidth) * (isRTL ? 1 - p : p)) + "px";
  railPrev.disabled = p < .015;
  railNext.disabled = p > .985;
}
rail.addEventListener("scroll", railUI, { passive: true });
addEventListener("resize", railUI);
setTimeout(railUI, 60); railUI();

let rDrag = null, rSuppress = false;
rail.addEventListener("pointerdown", e => {
  if (e.pointerType === "touch") return;
  rDrag = { x: e.clientX, sl: rail.scrollLeft };
  rail.setPointerCapture(e.pointerId);
});
rail.addEventListener("pointermove", e => {
  if (!rDrag) return;
  const dx = e.clientX - rDrag.x;
  if (Math.abs(dx) > 5) { rail.classList.add("dragging"); rSuppress = true; }
  if (rSuppress) rail.scrollLeft = rDrag.sl - dx;
});
const railUp = () => {
  rDrag = null;
  setTimeout(() => { rail.classList.remove("dragging"); }, 80);
  setTimeout(() => { rSuppress = false; }, 120);
};
rail.addEventListener("pointerup", railUp);
rail.addEventListener("pointercancel", railUp);
rail.addEventListener("click", e => { if (rSuppress) { e.preventDefault(); e.stopPropagation(); } }, true);

/* dish-link micro action */
$$(".dish-link").forEach(l => l.addEventListener("click", () => {
  toast("أضفنا الطبقَ إلى أمسيّتِك ✦ أكملْ حجزَك لنُوقدَ الجمر");
  scrollToY($("#reserve").getBoundingClientRect().top + window.scrollY - 72);
}));

/* ───────── 3D tilt on cards ───────── */
if (!isTouch && !reduced) {
  $$("[data-tilt]").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      card.style.transition = "transform .12s ease-out, border-color .5s, box-shadow .55s";
      card.style.transform = `perspective(950px) rotateX(${(-py * 5.5).toFixed(2)}deg) rotateY(${(px * 6.5).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transition = "transform .75s cubic-bezier(.16,1,.3,1), border-color .5s, box-shadow .55s";
      card.style.transform = "";
    });
  });
}

/* ───────── Menu tabs ───────── */
const tabs = $$(".menu-tab"), tabInd = $("#tabIndicator"), panels = $$(".menu-panel");
function moveInd(btn) {
  const cr = btn.parentElement.getBoundingClientRect();
  const br = btn.getBoundingClientRect();
  tabInd.style.width = br.width + "px";
  tabInd.style.transform = `translateX(${br.left - cr.left - 1}px)`;
}
function activateTab(btn) {
  tabs.forEach(t => { t.classList.toggle("active", t === btn); t.setAttribute("aria-selected", String(t === btn)); });
  moveInd(btn);
  panels.forEach(p => {
    const on = p.id === btn.dataset.panel;
    p.classList.toggle("active", on);
    if (on) {
      p.classList.remove("anim"); void p.offsetWidth;
      $$(".menu-item", p).forEach((it, i) => it.style.setProperty("--i", i));
      if (!reduced) p.classList.add("anim");
    }
  });
}
tabs.forEach(b => b.addEventListener("click", () => activateTab(b)));
const initTab = () => moveInd($(".menu-tab.active"));
requestAnimationFrame(initTab);
addEventListener("resize", initTab);
document.fonts?.ready?.then(initTab);

/* ───────── Gallery lightbox ───────── */
const gItems = $$(".g-item");
const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCaption"), lbCount = $("#lbCount");
let lbIdx = 0, lbLast = null;
function renderLB(pop) {
  const it = gItems[lbIdx], img = $("img", it);
  lbImg.src = img.src; lbImg.alt = img.alt;
  lbCap.textContent = it.dataset.caption || "";
  lbCount.textContent = `${lbIdx + 1} / ${gItems.length}`;
  if (pop) { lbImg.classList.remove("pop"); void lbImg.offsetWidth; lbImg.classList.add("pop"); }
}
function openLB(i) {
  lbIdx = i; renderLB(false);
  lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  lbLast = document.activeElement;
  setTimeout(() => $(".lb-close", lb)?.focus(), 80);
}
function closeLB() {
  if (!lb.classList.contains("open")) return;
  lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true");
  if (!document.body.classList.contains("menu-open")) document.body.classList.remove("no-scroll");
  if (lbLast && lbLast.focus) lbLast.focus();
  lbLast = null;
}
gItems.forEach((it, i) => {
  it.addEventListener("click", () => openLB(i));
  it.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLB(i); } });
});
$("#lbNext").addEventListener("click", () => { lbIdx = (lbIdx + 1) % gItems.length; renderLB(true); });
$("#lbPrev").addEventListener("click", () => { lbIdx = (lbIdx - 1 + gItems.length) % gItems.length; renderLB(true); });
$$("[data-lb-close]", lb).forEach(el => el.addEventListener("click", closeLB));
addEventListener("keydown", e => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "ArrowLeft")  $("#lbNext").click();
  if (e.key === "ArrowRight") $("#lbPrev").click();
});
let lbTouchX = null;
lb.addEventListener("touchstart", e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener("touchend", e => {
  if (lbTouchX === null) return;
  const dx = e.changedTouches[0].clientX - lbTouchX; lbTouchX = null;
  if (dx > 50) $("#lbNext").click(); else if (dx < -50) $("#lbPrev").click();
}, { passive: true });

/* ───────── Testimonials slider ───────── */
const tTrack = $("#tTrack"), tSlides = $$(".t-slide"), tDotsBox = $("#tDots"), tProg = $("#tProgress");
let tIdx = 0, tTimer = null;
tSlides.forEach((s, i) => {
  const b = document.createElement("button");
  b.className = "t-dot" + (i ? "" : " active");
  b.setAttribute("aria-label", `رأي الضيف ${i + 1}`);
  b.addEventListener("click", () => { goT(i); autoT(); });
  tDotsBox.appendChild(b);
});
const tDotEls = $$(".t-dot", tDotsBox);
function goT(i) {
  tIdx = ((i % tSlides.length) + tSlides.length) % tSlides.length;
  const w = $("#tViewport").offsetWidth;
  tTrack.style.transform = `translateX(${(isRTL ? 1 : -1) * tIdx * w}px)`;
  tSlides.forEach((s, j) => s.classList.toggle("active", j === tIdx));
  tDotEls.forEach((d, j) => d.classList.toggle("active", j === tIdx));
  tProg.classList.remove("run"); void tProg.offsetWidth;
  if (!reduced) tProg.classList.add("run");
}
function autoT() {
  clearInterval(tTimer);
  if (reduced) return;
  tTimer = setInterval(() => { if (!document.hidden) goT(tIdx + 1); }, 6500);
}
$("#tNext").addEventListener("click", () => { goT(tIdx + 1); autoT(); });
$("#tPrev").addEventListener("click", () => { goT(tIdx - 1); autoT(); });
const tCard = $(".t-card");
tCard.addEventListener("mouseenter", () => clearInterval(tTimer));
tCard.addEventListener("mouseleave", autoT);
let tTouchX = null;
tCard.addEventListener("touchstart", e => { tTouchX = e.touches[0].clientX; }, { passive: true });
tCard.addEventListener("touchend", e => {
  if (tTouchX === null) return;
  const dx = e.changedTouches[0].clientX - tTouchX; tTouchX = null;
  if (dx > 55) goT(tIdx + 1); else if (dx < -55) goT(tIdx - 1);
  autoT();
}, { passive: true });
addEventListener("resize", () => goT(tIdx));
goT(0); autoT();

/* ───────── Toasts ───────── */
const toastWrap = $("#toastWrap");
function toast(msg, err) {
  const t = document.createElement("div");
  t.className = "toast" + (err ? " err" : "");
  t.innerHTML = `<svg><use href="#i-${err ? "close" : "check"}"/></svg><span></span>`;
  $("span", t).textContent = msg;
  toastWrap.appendChild(t);
  requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add("show")));
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 650); }, 4000);
}

/* ───────── Reserve form ───────── */
const rForm = $("#reserveForm"), rCard = $(".form-card"), rSucc = $("#formSuccess"), rBtn = $("#reserveSubmit");
const guestsVal = $("#guestsVal");
let guests = 2;
$$("#guestsStepper .step-btn").forEach(b => b.addEventListener("click", () => {
  guests = clamp(guests + parseInt(b.dataset.step, 10), 1, 20);
  guestsVal.textContent = guests === 20 ? "20+" : guests;
  guestsVal.classList.remove("pop"); void guestsVal.offsetWidth; guestsVal.classList.add("pop");
}));
const fDate = $("#fDate");
fDate.min = new Date().toISOString().split("T")[0];

function setErr(name, msg) {
  const slot = $(`[data-err="${name}"]`);
  const field = slot?.closest(".field, .form-block");
  if (msg) { if (slot) slot.textContent = msg; field?.classList.add("invalid"); }
  else { if (slot) slot.textContent = ""; field?.classList.remove("invalid"); }
  return !msg;
}
["fName", "fPhone", "fDate"].forEach(id => {
  const el = $("#" + id);
  el.addEventListener("input", () => el.closest(".field")?.classList.remove("invalid"));
});
rForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = $("#fName").value.trim();
  const phone = $("#fPhone").value.replace(/[\s-]/g, "");
  const date = fDate.value;
  const time = rForm.querySelector('input[name="time"]:checked')?.value;
  let ok = true;
  ok = setErr("fName", name.length < 3 ? "فضلًا اكتبْ اسمَك الكامل (٣ أحرفٍ على الأقل)" : "") && ok;
  ok = setErr("fPhone", !/^(\+?966|0)?5\d{8}$/.test(phone) && !/^\+?\d{9,14}$/.test(phone) ? "أدخلْ رقمَ جوّالٍ صحيح (مثال: 0555555555)" : "") && ok;
  ok = setErr("fDate", !date ? "اخترْ تاريخَ الحجز" : (date < fDate.min ? "لا يمكنُ الحجزُ في تاريخٍ ماضٍ" : "")) && ok;
  ok = setErr("time", !time ? "اخترْ الوقتَ المفضّل" : "") && ok;
  if (!ok) {
    rCard.classList.remove("shake"); void rCard.offsetWidth; rCard.classList.add("shake");
    toast("تحقّقْ من الحقولِ المميّزة بالأحمر", true);
    return;
  }
  rBtn.classList.add("loading");
  setTimeout(() => {
    rBtn.classList.remove("loading");
    rBtn.classList.add("success");
    const d = new Date(date + "T00:00:00");
    const dTxt = d.toLocaleDateString("ar", { weekday: "long", day: "numeric", month: "long" });
    $("#fsSummary").textContent = `${name.split(" ")[0]} العزيز — طاولتُك لـ ${guests === 20 ? "+20" : guests} ضيفًا، ${dTxt} الساعة ${time} بتوقيت الرياض. سنتّصلُ بك خلالَ ساعةٍ لتأكيدِ التفاصيل. الجمرُ بانتظارك 🔥`;
    setTimeout(() => rSucc.classList.add("show"), 380);
    const rr = rBtn.getBoundingClientRect();
    burstAt(rr.left + rr.width / 2, rr.top + rr.height / 2, 34);
    toast("تمَّ استلامُ طلبِ حجزِك ✦ إلى اللقاءِ على الجمر");
  }, 1500);
});
$("#fsReset").addEventListener("click", () => {
  rSucc.classList.remove("show");
  rBtn.classList.remove("success", "loading");
  rForm.reset();
  buildDays();
  guests = 2; guestsVal.textContent = "2";
  fDate.min = new Date().toISOString().split("T")[0];
  $$("[data-err]").forEach(s => s.textContent = "");
  $$(".field,.form-block").forEach(f => f.classList.remove("invalid"));
});

/* ───────── Newsletter ───────── */
$("#newsForm").addEventListener("submit", e => {
  e.preventDefault();
  const v = $("#fNews").value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { toast("أدخلْ بريدًا إلكترونيًا صحيحًا", true); return; }
  $("#fNews").value = "";
  $("#fNews").blur();
  toast("اشتركتَ في نشرةِ الجمر ✦ أهلًا بك في العائلة");
});

/* ───────── Dots nav + active links ───────── */
const navSections = $$("[data-nav]");
const dotsNav = $("#dotsNav");
navSections.forEach(sec => {
  const b = document.createElement("button");
  b.className = "dot-link";
  b.innerHTML = `<i></i><span>${sec.dataset.nav}</span>`;
  b.setAttribute("aria-label", sec.dataset.nav);
  b.addEventListener("click", () => scrollToY(sec.getBoundingClientRect().top + window.scrollY - 72));
  dotsNav.appendChild(b);
});
const dotEls = $$(".dot-link", dotsNav);
const navLinks = $$(".main-nav .nav-link");
function setActiveSection(id) {
  navSections.forEach((sec, i) => {
    const on = sec.id === id;
    dotEls[i]?.classList.toggle("active", on);
  });
  navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
}
const secIO = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) setActiveSection(en.target.id); });
}, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
navSections.forEach(s => secIO.observe(s));
addEventListener("scroll", () => {
  const y = window.scrollY, m = maxScroll();
  dotsNav.classList.toggle("show", y > 420 && y < m - 320);
}, { passive: true });

/* ───────── Back to top ───────── */

/* ═══════════ V2 — UPGRADES ═══════════ */

/* ── Keyboard scrolling ── */
if (smooth.active) {
  addEventListener("keydown", e => {
    const t = e.target;
    if (t.closest && t.closest("input,textarea,select,[contenteditable]")) return;
    if (document.body.classList.contains("menu-open") || $("#lightbox").classList.contains("open")) return;
    const page = innerHeight * .85;
    let d = null;
    switch (e.key) {
      case "ArrowDown": d = 130; break;
      case "ArrowUp":   d = -130; break;
      case "PageDown":  d = page; break;
      case "PageUp":    d = -page; break;
      case " ":         d = e.shiftKey ? -page : page; break;
      case "Home": e.preventDefault(); scrollToY(0); return;
      case "End":  e.preventDefault(); scrollToY(maxScroll()); return;
    }
    if (d !== null) { e.preventDefault(); smooth.target = clamp(smooth.target + d, 0, maxScroll()); }
  });
}

/* ── Spark burst helper ── */
function burstAt(x, y, n = 22) {
  if (!sCtx) return;
  for (let i = 0; i < n; i++) {
    const ang = Math.random() * Math.PI * 2, v = 70 + Math.random() * 260;
    sparks.push({ x, y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - 90,
      r: .7 + Math.random() * 2, life: 0, max: .5 + Math.random() * .8,
      sp: sprites[(Math.random() * sprites.length) | 0] });
  }
}

/* ── Contextual cursor labels ── */
const cLabel = $("#cursorLabel");
if (document.body.classList.contains("custom-cursor")) {
  document.addEventListener("mouseover", e => {
    const el = e.target.closest("[data-cursor]");
    if (el) { cLabel.textContent = el.dataset.cursor; document.body.classList.add("c-label"); }
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest("[data-cursor]") && !e.relatedTarget?.closest?.("[data-cursor]")) document.body.classList.remove("c-label");
  });
}

/* ── Spotlight glow (mouse-tracked) ── */
if (!isTouch) $$("[data-glow]").forEach(el => {
  el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (e.clientX - r.left).toFixed(0) + "px");
    el.style.setProperty("--my", (e.clientY - r.top).toFixed(0) + "px");
  });
});

/* ── Press ripple ── */
document.addEventListener("pointerdown", e => {
  const b = e.target.closest(".btn,.rail-btn,.t-arrow,.step-btn,.news-btn,.menu-tab,.day-chip,.fab-top");
  if (!b || reduced) return;
  const r = b.getBoundingClientRect();
  const size = Math.max(r.width, r.height) * 2.3;
  const sp = document.createElement("span");
  sp.className = "ripple";
  sp.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
  b.appendChild(sp);
  setTimeout(() => sp.remove(), 750);
});

/* ── Menu floating preview ── */
const mPrev = $("#menuPreview");
let mPrevOn = false;
const mpPos = { x: innerWidth / 2, y: innerHeight / 2, tx: innerWidth / 2, ty: innerHeight / 2 };
function mpFrame() {
  if (!mPrevOn) return;
  mpPos.x = lerp(mpPos.x, mpPos.tx, .16);
  mpPos.y = lerp(mpPos.y, mpPos.ty, .16);
  mPrev.style.translate = `${clamp(mpPos.x + 30, 8, innerWidth - 258)}px ${clamp(mpPos.y - 70, 8, innerHeight - 210)}px`;
}
if (mPrev && !isTouch && !reduced) {
  const panelsBox = $("#menuPanels");
  panelsBox.addEventListener("mouseover", e => {
    const item = e.target.closest(".menu-item");
    if (!item) return;
    const key = item.closest(".menu-panel")?.dataset.img;
    const src = key && document.getElementById(key);
    const pi = $("img", mPrev);
    if (src && pi.getAttribute("src") !== src.getAttribute("src")) pi.src = src.src;
    $(".mp-name", mPrev).textContent = $("h4", item).childNodes[0]?.textContent.trim() || "";
    $(".mp-price", mPrev).textContent = ($(".mi-price", item)?.textContent || "") + " ر.س";
    mPrevOn = true; mPrev.classList.add("on");
  });
  panelsBox.addEventListener("mouseleave", () => { mPrevOn = false; mPrev.classList.remove("on"); });
  addEventListener("mousemove", e => { mpPos.tx = e.clientX; mpPos.ty = e.clientY; }, { passive: true });
}

/* ── Ritual stacked cards depth ── */
const ritCards = $$(".ritual-card");
function ritualFrame() {
  if (reduced || !ritCards.length) return;
  for (let i = 0; i < ritCards.length; i++) {
    const c = ritCards[i], nxt = ritCards[i + 1];
    if (!nxt) continue;
    const stickTop = 92 + i * 16;
    const nr = nxt.getBoundingClientRect();
    const cr = c.getBoundingClientRect();
    const range = Math.max(220, innerHeight * .75);
    const p = clamp(1 - (nr.top - stickTop) / range, 0, 1);
    if (cr.top <= stickTop + 4) {
      c.style.transform = `scale(${(1 - p * .06).toFixed(4)})`;
      c.style.filter = `brightness(${(1 - p * .32).toFixed(3)})`;
    } else { c.style.transform = ""; c.style.filter = ""; }
  }
}
(function fxLoop() { ritualFrame(); mpFrame(); requestAnimationFrame(fxLoop); })();

/* ── Day chips (next 7 days) ── */
const dayBox = $("#dayChips");
const DAY_NAMES = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const MON_NAMES = ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"];
function selectDay(b) {
  $$(".day-chip", dayBox).forEach(c => c.classList.toggle("active", c === b));
  fDate.value = b.dataset.date;
  setErr("fDate", "");
}
function buildDays() {
  if (!dayBox) return;
  dayBox.innerHTML = "";
  const t = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const b = document.createElement("button");
    b.type = "button"; b.className = "day-chip"; b.dataset.date = iso;
    b.setAttribute("aria-label", `${DAY_NAMES[d.getDay()]} ${d.getDate()} ${MON_NAMES[d.getMonth()]}`);
    b.innerHTML = `<b>${i === 0 ? "اليوم" : DAY_NAMES[d.getDay()]}</b><span>${d.getDate()}</span><small>${MON_NAMES[d.getMonth()]}</small>`;
    b.addEventListener("click", () => selectDay(b));
    dayBox.appendChild(b);
  }
  selectDay(dayBox.children[0]);
}
buildDays();

/* ── FAB back-to-top with progress ring ── */
const fab = $("#fabTop"), fabCircle = fab ? $("circle", fab) : null;
if (fab && fabCircle) {
  const CIRC = 2 * Math.PI * 28;
  fabCircle.style.strokeDasharray = CIRC;
  fabCircle.style.strokeDashoffset = CIRC;
  fab.addEventListener("click", () => scrollToY(0));
  addEventListener("scroll", () => {
    const y = window.scrollY, m = Math.max(1, maxScroll());
    fab.classList.toggle("show", y > 520);
    fabCircle.style.strokeDashoffset = String(CIRC * (1 - clamp(y / m, 0, 1)));
  }, { passive: true });
}

/* ── Live countdown (embers rest at 1:00 AM) ── */
const SPECIALS = ["ريشُ الغنمِ البلدي", "كنافةُ الجَمرة", "شيشُ طاووقٍ مدخّن", "كفتةُ الجدّة", "هامورُ الجمرِ المشوي", "مقلوبةُ الباذنجان", "فخذُ الغنمِ الملكي"];
function setUnit(id, v) {
  const el = document.getElementById(id);
  if (!el) return;
  const t = String(v).padStart(2, "0");
  if (el.textContent !== t) {
    el.textContent = t;
    const u = el.parentElement;
    u.classList.remove("tick"); void u.offsetWidth; u.classList.add("tick");
  }
}
function tickCD() {
  const now = new Date();
  const close = new Date(now); close.setHours(25, 0, 0, 0);
  let s = Math.max(0, Math.floor((close - now) / 1000));
  setUnit("cdH", Math.floor(s / 3600));
  setUnit("cdM", Math.floor((s % 3600) / 60));
  setUnit("cdS", s % 60);
}
const specialEl = $("#specialName");
if (specialEl) specialEl.textContent = SPECIALS[new Date().getDay() % 7];
tickCD(); setInterval(tickCD, 1000);

/* ── Title shine sweep on reveal ── */
const shineIO = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("shine"); shineIO.unobserve(en.target); }
}), { threshold: .4 });
$$(".section-title").forEach(t => shineIO.observe(t));

/* ── Images fade-in on load ── */
$$("img").forEach(im => {
  const done = () => im.classList.add("img-in");
  if (im.complete && im.naturalWidth) done();
  else { im.addEventListener("load", done, { once: true }); im.addEventListener("error", done, { once: true }); }
});

/* ── Hero mouse parallax vars ── */
const heroEl = $(".hero");
if (!isTouch && !reduced) heroEl.addEventListener("pointermove", e => {
  const r = heroEl.getBoundingClientRect();
  heroEl.style.setProperty("--hx", ((((e.clientX - r.left) / r.width) - .5) * 2).toFixed(3));
  heroEl.style.setProperty("--hy", ((((e.clientY - r.top) / r.height) - .5) * 2).toFixed(3));
});

})();

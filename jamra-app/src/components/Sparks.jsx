import { useEffect, useRef } from "react";

const COLORS = ["255,122,60", "255,179,71", "255,96,42", "243,212,136"];
export function makeSprites() {
  return COLORS.map(rgb => {
    const c = document.createElement("canvas"); c.width = c.height = 32;
    const g = c.getContext("2d");
    const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(.35, `rgba(${rgb},.55)`); gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr; g.fillRect(0, 0, 32, 32);
    return c;
  });
}
export function burst(x, y, n = 20) {
  addEventListener("jamra:burst", () => {}, { once: true });
  dispatchEvent(new CustomEvent("jamra:burst", { detail: { x, y, n } }));
}

export default function Sparks() {
  const cv = useRef(null);
  useEffect(() => {
    const canvas = cv.current, ctx = canvas.getContext ? canvas.getContext("2d") : null;
    if (!ctx) return;
    const sprites = makeSprites();
    let parts = [], last = performance.now();
    const resize = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); addEventListener("resize", resize);
    const spawn = (x, y, n) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 250;
        parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, r: .6 + Math.random() * 2, life: 0, max: .45 + Math.random() * .75, sp: sprites[(Math.random() * 4) | 0] });
      }
    };
    const onClick = e => { if (e.target.closest("[data-spark]")) spawn(e.clientX, e.clientY, 18); };
    const onBurst = e => spawn(e.detail.x, e.detail.y, e.detail.n || 24);
    addEventListener("click", onClick);
    addEventListener("jamra:burst", onBurst);
    let raf;
    const loop = now => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (parts.length) {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        ctx.globalCompositeOperation = "lighter";
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i]; p.life += dt;
          if (p.life > p.max) { parts.splice(i, 1); continue; }
          p.vy += 340 * dt; p.vx *= .985; p.vy *= .985;
          p.x += p.vx * dt; p.y += p.vy * dt;
          const a = 1 - p.life / p.max, s = p.r * 6.5 * (.5 + a * .7);
          ctx.globalAlpha = a * .9;
          ctx.drawImage(p.sp, p.x - s / 2, p.y - s / 2, s, s);
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
        if (!parts.length) ctx.clearRect(0, 0, innerWidth, innerHeight);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("click", onClick); removeEventListener("jamra:burst", onBurst); };
  }, []);
  return <canvas ref={cv} id="sparks" aria-hidden="true" style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 996, pointerEvents: "none" }} />;
}

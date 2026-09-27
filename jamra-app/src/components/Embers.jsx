import { useEffect, useRef } from "react";
import { makeSprites } from "./Sparks";

export default function Embers({ density = 54 }) {
  const cv = useRef(null);
  useEffect(() => {
    const canvas = cv.current, ctx = canvas.getContext ? canvas.getContext("2d") : null;
    if (!ctx || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sprites = makeSprites();
    let W = 0, H = 0, ps = [], inView = true, last = performance.now();
    const resize = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      const r = canvas.parentElement.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); addEventListener("resize", resize);
    const spawn = init => ({
      x: Math.random() * W, y: init ? Math.random() * H : H + Math.random() * 40,
      r: .7 + Math.random() * 2.4, vy: -(10 + Math.random() * 34), drift: (Math.random() - .5) * 14,
      ph: Math.random() * Math.PI * 2, life: 0, max: 4.5 + Math.random() * 5.5,
      sp: sprites[(Math.random() * 4) | 0], fl: .5 + Math.random() * .5,
    });
    const io = new IntersectionObserver(en => { inView = en[0].isIntersecting; }, { threshold: 0 });
    io.observe(canvas.parentElement);
    let raf;
    const loop = now => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (inView && !document.hidden) {
        const count = W < 640 ? density * .45 : density;
        while (ps.length < count) ps.push(spawn(ps.length === 0));
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = "lighter";
        for (let i = ps.length - 1; i >= 0; i--) {
          const p = ps[i]; p.life += dt;
          if (p.life > p.max || p.y < -20) { ps[i] = spawn(false); continue; }
          p.y += p.vy * dt; p.x += (p.drift + Math.sin(p.life * 1.6 + p.ph) * 12) * dt;
          const t = p.life / p.max;
          const a = Math.sin(Math.min(1, t * 1.6) * Math.PI * .5) * (1 - Math.pow(t, 2.4)) * (.5 + Math.sin(now / 130 * p.fl + p.ph) * .22 + .28);
          const s = p.r * 7;
          ctx.globalAlpha = Math.max(0, Math.min(1, a)) * .85;
          ctx.drawImage(p.sp, p.x - s / 2, p.y - s / 2, s, s);
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener("resize", resize); };
  }, [density]);
  return <canvas ref={cv} id="embers" aria-hidden="true" />;
}

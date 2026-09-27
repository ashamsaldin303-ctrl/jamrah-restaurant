import { useEffect, useRef } from "react";
import { RITUAL } from "../data/content";

export default function RitualStack() {
  const cards = useRef([]);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf;
    const loop = () => {
      const cs = cards.current.filter(Boolean);
      for (let i = 0; i < cs.length; i++) {
        const nxt = cs[i + 1];
        if (!nxt) continue;
        const stick = 92 + i * 16;
        const nr = nxt.getBoundingClientRect(), cr = cs[i].getBoundingClientRect();
        const range = Math.max(220, innerHeight * .75);
        const p = Math.min(1, Math.max(0, 1 - (nr.top - stick) / range));
        if (cr.top <= stick + 4) {
          cs[i].style.transform = `scale(${(1 - p * .06).toFixed(4)})`;
          cs[i].style.filter = `brightness(${(1 - p * .32).toFixed(3)})`;
        } else { cs[i].style.transform = ""; cs[i].style.filter = ""; }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className="ritual-stack">
      {RITUAL.map((r, i) => (
        <article className="ritual-card" key={r.n} style={{ "--i": i }} data-glow
          ref={el => { cards.current[i] = el; }}>
          <span className="rc-num">{r.n}</span>
          <div className="rc-body"><h3>{r.title}</h3><p>{r.text}</p></div>
          <span className="rc-icon"><svg viewBox="0 0 24 24"><use href={"#i-" + r.icon} /></svg></span>
        </article>
      ))}
    </div>
  );
}

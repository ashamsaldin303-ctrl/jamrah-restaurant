import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS } from "../data/content";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const track = useRef(null), vp = useRef(null), prog = useRef(null);
  const timer = useRef(null);
  const n = TESTIMONIALS.length;
  const go = j => setI(((j % n) + n) % n);
  useEffect(() => {
    const w = vp.current?.offsetWidth || 0;
    if (track.current) track.current.style.transform = `translateX(${i * w}px)`;
  }, [i]);
  useEffect(() => {
    const restart = () => {
      const p = prog.current;
      if (!p) return;
      p.classList.remove("run"); void p.offsetWidth; p.classList.add("run");
    };
    restart();
    timer.current = setInterval(() => { if (!document.hidden) go(i + 1); }, 6500);
    return () => clearInterval(timer.current);
  }, [i]);
  const swipe = useRef(null);
  return (
    <div className="t-card" data-glow
      onMouseEnter={() => clearInterval(timer.current)}
      onMouseLeave={() => { timer.current = setInterval(() => go(i + 1), 6500); }}
      onTouchStart={e => { swipe.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (swipe.current === null) return;
        const dx = e.changedTouches[0].clientX - swipe.current; swipe.current = null;
        if (dx > 55) go(i + 1); else if (dx < -55) go(i - 1);
      }}>
      <span className="t-quote" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-quote" /></svg></span>
      <div className="t-viewport" ref={vp}>
        <div className="t-track" ref={track}>
          {TESTIMONIALS.map((t, j) => (
            <blockquote className={"t-slide" + (j === i ? " active" : "")} key={t.name}>
              <span className="t-stars" aria-label="5 من 5">{[0, 1, 2, 3, 4].map(k => <svg key={k}><use href="#i-star" /></svg>)}</span>
              <p>{t.quote}</p>
              <footer className="t-person">
                <span className="t-avatar">{t.initial}</span>
                <span className="t-meta"><b>{t.name}</b><span>{t.role}</span></span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
      <div className="t-controls">
        <button className="t-arrow" onClick={() => go(i - 1)} aria-label="الرأي السابق"><svg><use href="#i-chevron-right" /></svg></button>
        <div className="t-dots" role="tablist" aria-label="اختيار رأي">
          {TESTIMONIALS.map((_, j) => (
            <button key={j} className={"t-dot" + (j === i ? " active" : "")} onClick={() => go(j)} aria-label={"رأي " + (j + 1)} />
          ))}
        </div>
        <button className="t-arrow" onClick={() => go(i + 1)} aria-label="الرأي التالي"><svg><use href="#i-chevron-left" /></svg></button>
      </div>
      <div className="t-progress" aria-hidden="true"><span ref={prog} /></div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

export default function Preloader() {
  const [phase, setPhase] = useState("run"); // run -> leaving -> done
  const bar = useRef(null), num = useRef(null);
  useEffect(() => {
    document.body.classList.add("no-scroll");
    const t0 = performance.now();
    let raf;
    const tick = () => {
      const t = Math.min(1, (performance.now() - t0) / 1950);
      const p = 92 * (1 - Math.pow(1 - t, 2.2));
      if (bar.current) bar.current.style.width = p + "%";
      if (num.current) num.current.textContent = Math.round(p);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const hard = setTimeout(() => {
      setPhase("leaving");
      document.body.classList.add("ready");
      setTimeout(() => { setPhase("done"); document.body.classList.remove("no-scroll"); }, 1250);
    }, 3050);
    const done = setTimeout(() => {
      if (bar.current) bar.current.style.width = "100%";
      if (num.current) num.current.textContent = "100";
      setTimeout(() => {
        setPhase("leaving");
        document.body.classList.add("ready");
        setTimeout(() => { setPhase("done"); document.body.classList.remove("no-scroll"); }, 1250);
      }, 280);
    }, 2100);
    return () => { cancelAnimationFrame(raf); clearTimeout(done); clearTimeout(hard); };
  }, []);
  if (phase === "done") return null;
  return (
    <div id="preloader" className={phase === "leaving" ? "leaving" : ""} role="status" aria-label="جارٍ التحميل">
      <div className="pre-glow" />
      <div className="pre-inner">
        <svg className="pre-flame" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22a7 7 0 0 0 7-7c0-5.25-7-13-7-13S5 9.75 5 15a7 7 0 0 0 7 7z" />
          <path d="M12 18a3 3 0 0 0 3-3c0-2.25-3-5.5-3-5.5s-3 3.25-3 5.5a3 3 0 0 0 3 3z" />
        </svg>
        <div className="pre-brand">جَمرة</div>
        <div className="pre-sub">EMBER · FIRE · FLAVOR</div>
        <div className="pre-bar"><span ref={bar} /></div>
        <div className="pre-count"><b ref={num}>0</b><small>%</small></div>
      </div>
      <div className="pre-curtain" aria-hidden="true"><i /><i /><i /></div>
    </div>
  );
}

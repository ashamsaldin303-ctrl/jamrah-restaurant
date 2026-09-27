import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export const EASE = [0.16, 1, 0.3, 1];

export function Reveal({ children, delay = 0, y = 40, className = "", as = "div" }) {
  const M = motion[as] || motion.div;
  return (
    <M className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -6% 0px" }}
      transition={{ duration: .95, delay, ease: EASE }}>
      {children}
    </M>
  );
}

export function MaskLines({ lines, className = "", delay = 0 }) {
  return (
    <span className={className}>
      {lines.map((l, i) => (
        <span className="line mask" key={i}>
          <motion.span
            initial={{ y: "112%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-6% 0px -6% 0px" }}
            transition={{ duration: 1.1, delay: delay + i * .12, ease: EASE }}
            style={{ display: "block" }}>
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Count({ to, decimals = 0, suffix = "", className = "" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(en => {
      if (en[0].isIntersecting) { setInView(true); io.disconnect(); }
    }, { threshold: .3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t0 = performance.now(), dur = 2000;
    let raf;
    const step = now => {
      const t = Math.min(1, (now - t0) / dur);
      setV(to * (1 - Math.pow(1 - t, 4.5)));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref} className={className} dir="ltr">{v.toFixed(decimals)}{suffix}</span>;
}

export function SectionHead({ label, icon, lines, desc, center = false }) {
  return (
    <div className={"section-head" + (center ? " head-center" : "")}>
      <Reveal as="span" className="section-label" y={18}><svg><use href={"#" + icon} /></svg> {label}</Reveal>
      <h2 className="section-title shine-on-view"><MaskLines lines={lines} /></h2>
      {desc && <Reveal as="p" className="section-desc" delay={.15}>{desc}</Reveal>}
    </div>
  );
}

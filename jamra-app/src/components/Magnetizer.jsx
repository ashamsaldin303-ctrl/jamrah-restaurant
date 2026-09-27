import { useEffect } from "react";
export default function Magnetizer() {
  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cur = null;
    const move = e => {
      const el = e.target.closest("[data-magnetic]");
      if (el !== cur) cur = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.transition = "translate .12s linear";
      el.style.translate = `${(e.clientX - r.left - r.width / 2) * .28}px ${(e.clientY - r.top - r.height / 2) * .38}px`;
    };
    const out = e => {
      const el = e.target.closest("[data-magnetic]");
      if (el && !e.relatedTarget?.closest?.("[data-magnetic]")) {
        el.style.transition = "translate .65s cubic-bezier(.16,1,.3,1)";
        el.style.translate = "0 0";
      }
    };
    document.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseout", out);
    return () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseout", out); };
  }, []);
  return null;
}

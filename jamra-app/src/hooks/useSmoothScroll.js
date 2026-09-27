import { useEffect } from "react";

const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = typeof matchMedia !== "undefined" && matchMedia("(pointer: coarse)").matches;
const active = !reduced && !isTouch;
const st = { target: 0, current: 0, ease: 0.1, installed: false };
const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function jumpTo(y, instant) {
  y = clamp(y, 0, Math.max(0, maxScroll()));
  if (active && !instant) st.target = y;
  else { window.scrollTo({ top: y, behavior: "instant" }); st.target = st.current = y; }
}

export default function useSmoothScroll() {
  useEffect(() => {
    if (st.installed || !active) return;
    st.installed = true;
    st.target = st.current = window.scrollY;
    const onWheel = e => {
      if (document.body.classList.contains("menu-open") || document.querySelector(".lightbox.open")) return;
      e.preventDefault();
      let d = e.deltaY;
      if (e.deltaMode === 1) d *= 16; else if (e.deltaMode === 2) d *= innerHeight;
      st.target = clamp(st.target + d, 0, maxScroll());
    };
    const onScroll = () => { if (Math.abs(window.scrollY - st.current) > 2) st.target = st.current = window.scrollY; };
    const onKey = e => {
      const t = e.target;
      if (t.closest && t.closest("input,textarea,select,[contenteditable]")) return;
      if (document.body.classList.contains("menu-open") || document.querySelector(".lightbox.open")) return;
      const page = innerHeight * .85;
      let d = null;
      switch (e.key) {
        case "ArrowDown": d = 130; break;
        case "ArrowUp": d = -130; break;
        case "PageDown": d = page; break;
        case "PageUp": d = -page; break;
        case " ": d = e.shiftKey ? -page : page; break;
        case "Home": e.preventDefault(); jumpTo(0); return;
        case "End": e.preventDefault(); jumpTo(maxScroll()); return;
      }
      if (d !== null) { e.preventDefault(); st.target = clamp(st.target + d, 0, maxScroll()); }
    };
    addEventListener("wheel", onWheel, { passive: false });
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("keydown", onKey);
    let raf;
    const loop = () => {
      if (!document.body.classList.contains("no-scroll")) {
        const d = st.target - st.current;
        if (Math.abs(d) > .3) { st.current += d * st.ease; window.scrollTo({ top: st.current }); }
        else if (st.current !== st.target) { st.current = st.target; window.scrollTo({ top: st.current }); }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener("wheel", onWheel); removeEventListener("scroll", onScroll); removeEventListener("keydown", onKey); st.installed = false; };
  }, []);
  return { jumpTo };
}

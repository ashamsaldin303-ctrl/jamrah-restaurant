import { useEffect, useRef } from "react";

export default function Cursor() {
  const dot = useRef(null), ring = useRef(null), label = useRef(null);
  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.body.classList.add("custom-cursor");
    const c = { x: innerWidth / 2, y: innerHeight / 2, dx: 0, dy: 0, rx: 0, ry: 0, on: false };
    const hoverSel = "a,button,input,select,textarea,label,.g-item,.dish-card,.t-dot,.rail,[role=button]";
    const move = e => {
      c.x = e.clientX; c.y = e.clientY;
      if (!c.on) { c.on = true; c.dx = c.rx = e.clientX; c.dy = c.ry = e.clientY; }
      if (dot.current && dot.current.style.opacity === "0") { dot.current.style.opacity = ring.current.style.opacity = "1"; }
    };
    const over = e => {
      const h = e.target.closest(hoverSel);
      if (h) document.body.classList.add("c-hover");
      const l = e.target.closest("[data-cursor]");
      if (l && label.current) { label.current.textContent = l.dataset.cursor; document.body.classList.add("c-label"); }
    };
    const out = e => {
      if (e.target.closest(hoverSel) && !e.relatedTarget?.closest?.(hoverSel)) document.body.classList.remove("c-hover");
      if (e.target.closest("[data-cursor]") && !e.relatedTarget?.closest?.("[data-cursor]")) document.body.classList.remove("c-label");
    };
    const down = () => document.body.classList.add("c-down");
    const up = () => document.body.classList.remove("c-down");
    const leave = () => { if (dot.current) dot.current.style.opacity = ring.current.style.opacity = "0"; };
    addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    addEventListener("mousedown", down); addEventListener("mouseup", up);
    document.addEventListener("mouseleave", leave);
    let raf;
    const loop = () => {
      if (c.on) {
        c.dx += (c.x - c.dx) * .85; c.dy += (c.y - c.dy) * .85;
        c.rx += (c.x - c.rx) * .16; c.ry += (c.y - c.ry) * .16;
        if (dot.current) dot.current.style.translate = `${c.dx}px ${c.dy}px`;
        if (ring.current) ring.current.style.translate = `${c.rx}px ${c.ry}px`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); document.body.classList.remove("custom-cursor"); };
  }, []);
  return (<>
    <div className="cursor-dot" ref={dot} aria-hidden="true" />
    <div className="cursor-ring" ref={ring} aria-hidden="true"><span className="cursor-label" ref={label} /></div>
  </>);
}

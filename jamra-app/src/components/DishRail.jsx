import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DISHES, IMG } from "../data/content";

function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(pointer: coarse)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      el.style.transition = "transform .12s ease-out, border-color .5s, box-shadow .55s";
      el.style.transform = `perspective(950px) rotateX(${(-py * 5.5).toFixed(2)}deg) rotateY(${(px * 6.5).toFixed(2)}deg) translateY(-6px)`;
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
    };
    const leave = () => { el.style.transition = "transform .75s cubic-bezier(.16,1,.3,1), border-color .5s, box-shadow .55s"; el.style.transform = ""; };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, []);
  return <article ref={ref} className={className} data-glow>{children}</article>;
}

export default function DishRail() {
  const rail = useRef(null), thumb = useRef(null);
  const [ui, setUi] = useState({ p: 0, w: 26 });
  const drag = useRef(null);
  const isRTL = true;
  const step = () => (rail.current?.querySelector(".dish-card")?.offsetWidth || 320) + 26;
  const scrollBy = sign => rail.current?.scrollBy({ left: sign * step(), behavior: "smooth" });
  useEffect(() => {
    const el = rail.current;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 2 ? Math.min(1, Math.max(0, Math.abs(el.scrollLeft) / max)) : 0;
      const trackW = thumb.current.parentElement.offsetWidth;
      setUi({ p, w: Math.max(14, (el.clientWidth / Math.max(1, el.scrollWidth)) * trackW) });
    };
    let nudged = false;
    const io = new IntersectionObserver(en => {
      if (en[0].isIntersecting && !nudged && matchMedia("(pointer: coarse)").matches) {
        nudged = true;
        setTimeout(() => { el.scrollBy({ left: -70, behavior: "smooth" }); setTimeout(() => el.scrollBy({ left: 70, behavior: "smooth" }), 420); }, 600);
        io.disconnect();
      }
    }, { threshold: .4 });
    io.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
    return () => { el.removeEventListener("scroll", update); removeEventListener("resize", update); };
  }, []);
  const onDown = e => { if (e.pointerType !== "touch") { drag.current = { x: e.clientX, sl: rail.current.scrollLeft, moved: false }; rail.current.setPointerCapture(e.pointerId); } };
  const onMove = e => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 5) { drag.current.moved = true; rail.current.classList.add("dragging"); }
    if (drag.current.moved) rail.current.scrollLeft = drag.current.sl - dx;
  };
  const onUp = () => { drag.current = null; setTimeout(() => rail.current?.classList.remove("dragging"), 80); };
  const trackW = typeof document !== "undefined" ? 340 : 340;
  return (<>
    <div className="rail" ref={rail} data-cursor="اسحب"
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <div className="rail-pad" aria-hidden="true" />
      {DISHES.map(d => (
        <TiltCard key={d.title} className="dish-card" >
          <div className="dish-media">
            <img src={IMG[d.img] || IMG[d.img.replace("dish_", "")]} alt={d.title} loading="lazy" decoding="async" className="img-in" />
            <span className="price-tag">{d.price} <small>ر.س</small></span>
            <span className={"dish-badge " + d.badgeCls}>{d.badge}</span>
          </div>
          <div className="dish-body">
            <div className="dish-rate"><svg><use href="#i-star" /></svg> {d.rate} <span>({d.rateCount})</span></div>
            <h3>{d.title}</h3>
            <p>{d.desc}</p>
            <Link to="/reserve" className="dish-link">احجز لتذوقه <svg><use href="#i-arrow-left" /></svg></Link>
          </div>
        </TiltCard>
      ))}
      <TiltCard className="dish-card dish-card-cta">
        <div className="dcta-inner">
          <span className="dcta-flame"><svg viewBox="0 0 24 24"><use href="#i-flame" /></svg></span>
          <h3>القائمةُ كاملةً<br />تنتظرُك</h3>
          <p>٣٠ طبقًا من المشاوي والمقبّلات والحلويات الشرقيّة</p>
          <Link to="/menu" className="btn btn-ghost btn-sm" data-magnetic><span>تصفّح القائمة</span><svg className="btn-arrow"><use href="#i-arrow-left" /></svg></Link>
        </div>
      </TiltCard>
      <div className="rail-pad" aria-hidden="true" />
    </div>
    <div className="container">
      <div className="rail-controls-row">
        <div className="rail-progress" aria-hidden="true">
          <span ref={thumb} style={{ width: ui.w + "px", marginLeft: ((trackW - ui.w) * (isRTL ? 1 - ui.p : ui.p)) + "px" }} />
        </div>
        <div className="rail-controls">
          <button className="rail-btn" disabled={ui.p < .015} onClick={() => scrollBy(1)} aria-label="السابق"><svg><use href="#i-chevron-right" /></svg></button>
          <button className="rail-btn" disabled={ui.p > .985} onClick={() => scrollBy(-1)} aria-label="التالي"><svg><use href="#i-chevron-left" /></svg></button>
        </div>
      </div>
    </div>
  </>);
}

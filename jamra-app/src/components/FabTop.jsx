import { useEffect, useRef, useState } from "react";
import { jumpTo } from "../hooks/useSmoothScroll";

export default function FabTop() {
  const [show, setShow] = useState(false);
  const circle = useRef(null);
  useEffect(() => {
    const CIRC = 2 * Math.PI * 28;
    const onScroll = () => {
      const y = window.scrollY, m = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      setShow(y > 520);
      if (circle.current) circle.current.style.strokeDashoffset = String(CIRC * (1 - Math.min(1, Math.max(0, y / m))));
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button className={"fab-top" + (show ? " show" : "")} aria-label="العودة للأعلى" onClick={() => jumpTo(0)}>
      <svg className="fab-ring" viewBox="0 0 60 60" aria-hidden="true"><circle ref={circle} cx="30" cy="30" r="28" /></svg>
      <svg className="fab-icon" viewBox="0 0 24 24"><use href="#i-flame" /></svg>
    </button>
  );
}

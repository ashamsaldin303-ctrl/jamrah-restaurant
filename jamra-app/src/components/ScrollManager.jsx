import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useSmoothScroll, { jumpTo } from "../hooks/useSmoothScroll";

export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  useSmoothScroll();
  useEffect(() => {
    const t = setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 430);
    return () => clearTimeout(t);
  }, [pathname]);
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) jumpTo(el.getBoundingClientRect().top + window.scrollY - 84);
    }, 700);
    return () => clearTimeout(t);
  }, [hash, pathname]);
  return null;
}

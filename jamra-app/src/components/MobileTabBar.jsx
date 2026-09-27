import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const TABS = [
  { to: "/", icon: "i-flame", label: "الرئيسية" },
  { to: "/menu", icon: "i-pot", label: "القائمة" },
  { to: "/reserve", icon: "i-calendar", label: "احجز", cta: true },
  { to: "/gallery", icon: "i-expand", label: "الأجواء" },
  { to: "/about", icon: "i-quote", label: "حكايتنا" },
];

export default function MobileTabBar() {
  const loc = useLocation();
  return (
    <nav className="tab-bar" aria-label="تنقل سريع">
      {TABS.map(t => (
        t.cta ? (
          <NavLink key={t.to} to={t.to} className="tb-item tb-cta" aria-label={t.label}>
            <span className="tb-cta-bub"><svg viewBox="0 0 24 24"><use href={"#" + t.icon} /></svg></span>
          </NavLink>
        ) : (
          <NavLink key={t.to} to={t.to} end={t.to === "/"} className={({ isActive }) => "tb-item" + (isActive ? " active" : "")}>
            {({ isActive }) => (<>
              <span className="tb-ico">
                {isActive && <motion.span layoutId="tb-glow" className="tb-glow" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <svg viewBox="0 0 24 24"><use href={"#" + t.icon} /></svg>
              </span>
              <span className="tb-lbl">{t.label}</span>
            </>)}
          </NavLink>
        )
      ))}
      <span className="tb-route" aria-hidden="true">{loc.pathname}</span>
    </nav>
  );
}

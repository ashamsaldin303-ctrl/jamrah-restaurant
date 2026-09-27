import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { CONTACT } from "../data/content";

const LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/about", label: "حكايتنا" },
  { to: "/menu", label: "القائمة" },
  { to: "/gallery", label: "الأجواء" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => { setOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const hdr = document.getElementById("siteHeader");
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      hdr.classList.toggle("scrolled", y > 28);
      if (y > last + 4 && y > 460 && !document.body.classList.contains("menu-open")) hdr.classList.add("hid");
      else if (y < last - 4) hdr.classList.remove("hid");
      last = y;
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  const toggle = () => {
    const next = !open;
    setOpen(next);
    document.body.classList.toggle("menu-open", next);
    document.body.classList.toggle("no-scroll", next);
  };
  return (<>
    <header className="site-header" id="siteHeader">
      <div className="container header-inner">
        <Link to="/" className="logo" aria-label="جَمرة — الرئيسية">
          <span className="logo-mark"><svg viewBox="0 0 24 24"><use href="#i-flame" /></svg></span>
          <span className="logo-type"><span className="logo-text">جَمرة</span><span className="logo-sub">JAMRAH · EST 2015</span></span>
        </Link>
        <nav className="main-nav" aria-label="التنقل الرئيسي">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"}
              className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>{l.label}</NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <a href={CONTACT.phoneHref} className="header-tel" aria-label="اتصل بنا">
            <svg><use href="#i-phone" /></svg><span dir="ltr">{CONTACT.phone}</span>
          </a>
          <Link to="/reserve" className="btn btn-ember btn-sm" data-magnetic data-spark><span>احجز طاولتك</span></Link>
          <button className={"hamburger" + (open ? " open" : "")} onClick={toggle}
            aria-label="فتح القائمة" aria-expanded={open} aria-controls="mobileMenu"><i /><i /></button>
        </div>
      </div>
    </header>

    <div className="mobile-menu" id="mobileMenu" aria-hidden={!open}>
      <div className="mm-bg" aria-hidden="true"><span className="mm-orb mm-orb-1" /><span className="mm-orb mm-orb-2" /></div>
      <nav className="mm-nav" aria-label="قائمة التنقل">
        {[...LINKS, { to: "/reserve", label: "احجز طاولتك" }].map((l, i) => (
          <Link key={l.to} to={l.to} style={{ "--i": i }} onClick={() => { setOpen(false); document.body.classList.remove("menu-open", "no-scroll"); }}>
            <span className="mm-index">0{i + 1}</span> {l.label}
          </Link>
        ))}
      </nav>
      <div className="mm-foot">
        <a href={CONTACT.phoneHref}><svg><use href="#i-phone" /></svg> <span dir="ltr">{CONTACT.phone}</span></a>
        <span><svg><use href="#i-pin" /></svg> {CONTACT.address}</span>
        <div className="mm-socials">
          <a href="#" aria-label="انستقرام"><svg><use href="#i-instagram" /></svg></a>
          <a href="#" aria-label="إكس"><svg><use href="#i-x" /></svg></a>
          <a href="#" aria-label="تيك توك"><svg><use href="#i-tiktok" /></svg></a>
        </div>
      </div>
    </div>
  </>);
}

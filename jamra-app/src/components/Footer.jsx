import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { CONTACT } from "../data/content";

export default function Footer() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const sub = e => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { toast("أدخلْ بريدًا إلكترونيًا صحيحًا", true); return; }
    setEmail(""); toast("اشتركتَ في نشرةِ الجمر ✦ أهلًا بك في العائلة");
  };
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="f-brand">
            <Link to="/" className="logo logo-f" aria-label="جَمرة">
              <span className="logo-mark"><svg viewBox="0 0 24 24"><use href="#i-flame" /></svg></span>
              <span className="logo-type"><span className="logo-text">جَمرة</span><span className="logo-sub">JAMRAH · EST 2015</span></span>
            </Link>
            <p className="f-about">بيتُ المشاوي الفاخرةِ على الجمر — حيثُ تُوقَدُ النارُ كلَّ مساء، وتُروى حكاياتُ النكهةِ على مائدةٍ واحدة.</p>
            <div className="socials">
              <a href="#" aria-label="انستقرام" data-magnetic><svg><use href="#i-instagram" /></svg></a>
              <a href="#" aria-label="إكس" data-magnetic><svg><use href="#i-x" /></svg></a>
              <a href="#" aria-label="تيك توك" data-magnetic><svg><use href="#i-tiktok" /></svg></a>
              <a href={"mailto:" + CONTACT.email} aria-label="البريد" data-magnetic><svg><use href="#i-mail" /></svg></a>
            </div>
          </div>
          <nav className="f-col" aria-label="روابط سريعة">
            <h4>تنقّل</h4>
            <Link to="/">الرئيسية</Link>
            <Link to="/about">حكايتنا</Link>
            <Link to="/menu">القائمة</Link>
            <Link to="/gallery">الأجواء</Link>
            <Link to="/reserve">احجز طاولتك</Link>
          </nav>
          <div className="f-col">
            <h4>زُرنا</h4>
            <p className="f-line"><svg><use href="#i-pin" /></svg> {CONTACT.address}</p>
            <p className="f-line"><svg><use href="#i-clock" /></svg> {CONTACT.hours}</p>
            <p className="f-line"><svg><use href="#i-phone" /></svg> <span dir="ltr">{CONTACT.phone}</span></p>
          </div>
          <div className="f-col f-news">
            <h4>نشرةُ الجمر</h4>
            <p className="f-about">أطباقٌ جديدة، أمسياتٌ خاصّة، ودعواتٌ قبلَ الجميع — مرّةً كلَّ شهر.</p>
            <form className="news-form" onSubmit={sub} noValidate>
              <div className="field field-dark">
                <input type="email" id="fNews" placeholder=" " value={email} onChange={e => setEmail(e.target.value)} required />
                <label htmlFor="fNews">بريدُك الإلكتروني</label>
              </div>
              <button type="submit" className="news-btn" aria-label="اشترك" data-spark><svg><use href="#i-arrow-left" /></svg></button>
            </form>
          </div>
        </div>
        <div className="footer-mega" aria-hidden="true">
          <span className="fm-ar">جَمرة</span>
          <span className="fm-en">JAMRAH</span>
        </div>
        <div className="footer-bottom">
          <p>© ٢٠٢٦ جَمرة — جميعُ الحقوقِ محفوظة</p>
          <p className="fb-note">صُمِّمَ على جمرٍ هادئ <svg className="fb-flame"><use href="#i-flame" /></svg></p>
        </div>
      </div>
    </footer>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import ReserveForm from "../components/ReserveForm";
import { Reveal } from "../components/Motion";
import { IMG, CONTACT } from "../data/content";
import useMeta from "../hooks/useMeta";

export default function ReservePage() {
  useMeta("احجز طاولتك | جَمرة", "احجز في ثوانٍ — نُوقد الجمر استعدادًا لوصولك.");
  const [s, setS] = useState(null);
  const [days, setDays] = useState(null);
  const onChange = (state, d) => { setS(state); setDays(d); };
  const day = days?.find(x => x.iso === s?.day);
  return (<>
    <PageHero chapter="الفصلُ الأخير — فصلُك أنت" title="ح" lines={["أمسيتُك تبدأُ", "من هنا"]} desc="احجز طاولتَك وسنُوقد الجمرَ استعدادًا لوصولك. للحفلاتِ والمناسباتِ الخاصّة، فريقُنا جاهزٌ لتصميمِ أمسيةٍ على مقاسِك." img={IMG.coffee} />
    <section className="section reserve-page">
      <div className="container reserve-grid">
        <div className="reserve-info">
          <div className="info-items">
            <Reveal className="info-item" data-glow><a href={CONTACT.phoneHref} className="ii-link">
              <span className="ii-icon"><svg><use href="#i-phone" /></svg></span>
              <span className="ii-text"><b>اتّصل بنا</b><span dir="ltr">{CONTACT.phone}</span></span></a>
            </Reveal>
            <Reveal className="info-item" data-glow delay={.08}>
              <span className="ii-icon"><svg><use href="#i-pin" /></svg></span>
              <span className="ii-text"><b>الموقع</b><span>{CONTACT.address}</span></span>
            </Reveal>
            <Reveal className="info-item" data-glow delay={.16}>
              <span className="ii-icon"><svg><use href="#i-clock" /></svg></span>
              <span className="ii-text"><b>ساعاتُ العمل</b><span>{CONTACT.hours}</span></span>
            </Reveal>
          </div>
          <Reveal className="reserve-note" delay={.2}>
            <svg><use href="#i-sparkle" /></svg>
            <p>للحجوزاتِ الكبرى (أكثرُ من ١٢ ضيفًا) والمناسباتِ الخاصّة — تواصلْ معنا مباشرةً وسنتكفّلُ بالباقي.</p>
          </Reveal>

          <div className="summary-card" aria-live="polite">
            <h4><svg><use href="#i-calendar" /></svg> ملخّصُ أمسيتك</h4>
            <ul>
              <li><span>الضيف</span><b>{s?.name ? s.name : "—"}</b></li>
              <li><span>اليوم</span><b>{day ? `${day.day} ${day.num} ${day.mon}` : "—"}</b></li>
              <li><span>الوقت</span><b>{s?.time || "—"} <small>م</small></b></li>
              <li><span>العدد</span><b>{s?.guests === 20 ? "+20" : s?.guests || "—"} ضيف</b></li>
              <li><span>المناسبة</span><b>{s?.occasion || "—"}</b></li>
            </ul>
            <p className="sc-hint">يتحدّثُ هذا الملخّصُ كلَّما غيّرتَ تفاصيلَك ✦</p>
          </div>
        </div>

        <Reveal y={30}><ReserveForm onChange={onChange} /></Reveal>
      </div>
      {s && (
        <div className="reserve-mobile-bar" aria-live="polite">
          <span className="rmb-chip"><svg><use href="#i-calendar" /></svg>{day ? `${day.day} ${day.num}/${day.mon}` : "—"}</span>
          <span className="rmb-chip"><svg><use href="#i-clock" /></svg>{s.time} م</span>
          <span className="rmb-chip"><svg><use href="#i-users" /></svg>{s.guests === 20 ? "+20" : s.guests}</span>
          <span className="rmb-chip"><svg><use href="#i-sparkle" /></svg>{s.occasion}</span>
        </div>
      )}
    </section>
  </>);
}

import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { Reveal, SectionHead, Count, MaskLines } from "../components/Motion";
import { IMG, TIMELINE, VALUES, CONTACT } from "../data/content";
import useMeta from "../hooks/useMeta";

export default function About() {
  useMeta("حكايتنا | جَمرة", "من جمرةٍ واحدةٍ عام ٢٠١٥ إلى بيتٍ كاملٍ من النكهة — حكاية جَمرة.");
  return (<>
    <PageHero chapter="الفصلُ الأول" title="ج" lines={["حكايةُ النارِ", "والفنّ"]} desc="من موقدٍ واحدٍ وستِّ طاولات، إلى بيتٍ كاملٍ تُوقَدُ نارُه كلَّ مساء — هذه حكايتُنا كما رواها الجمر." img={IMG.fire} />

    <section className="section">
      <div className="container story-grid">
        <div className="story-copy">
          <SectionHead icon="i-flame" label="البداية" lines={["جمرةٌ أولى", "في حيِّ الملقا"]}
            desc="كان الجدُّ يقول: «النارُ الطيّبةُ لا تُستعار». لذلك بنينا موقدَنا الأول بأيدينا، من طينِ الوادي وحجرِ البركان، وما زال هو نفسه قلبَ مطبخِنا اليوم." />
          <Reveal delay={.1}><p className="section-desc">اليوم، ما زلنا نُوقد جمرَ السِّمرِ كلَّ مساء، نختار اللحمَ قطعةً قطعة، ونطحن توابلَنا طازجةً كلَّ صباح — لأنّ بعضَ الأشياءِ تستحقُّ ألّا تتغيّر.</p></Reveal>
          <Reveal className="story-sign" delay={.15}>
            <span className="sign-name">خالد المطيري</span>
            <span className="sign-role">الشيف المؤسِّس — الجيلُ الثاني</span>
          </Reveal>
          <div className="stats-row">
            {[{ v: 10, s: "+", l: "سنواتٍ على الجمر" }, { v: 42, s: "", l: "طبقًا عبر المواسم" }, { v: 120, s: " ألف", l: "ضيفٍ سعيد" }, { v: 4.9, d: 1, s: "", l: "تقييمًا متوسطًا" }].map((x, i) => (
              <Reveal className="stat" key={x.l} delay={i * .09}><b><Count to={x.v} decimals={x.d || 0} />{x.s && <span className="suf">{x.s}</span>}</b><span>{x.l}</span></Reveal>
            ))}
          </div>
        </div>
        <div className="story-visual">
          <Reveal className="story-main" y={0}>
            <img src={IMG.interior} alt="الصالة الكبرى" loading="lazy" className="img-in" />
            <figcaption>الصالة الكبرى — توسعة ٢٠٢١</figcaption>
          </Reveal>
          <Reveal className="story-sub" delay={.15} y={0}><img src={IMG.spices} alt="توابل البيت" loading="lazy" className="img-in" /></Reveal>
        </div>
      </div>
    </section>

    <section className="section timeline-sec">
      <div className="container">
        <SectionHead center icon="i-clock" label="المسيرة" lines={["عشرُ سنواتٍ", "على الجمر"]} />
        <div className="timeline">
          <span className="tl-line" aria-hidden="true" />
          {TIMELINE.map((t, i) => (
            <Reveal className="tl-item" key={t.year} delay={i * .08}>
              <span className="tl-dot" aria-hidden="true" />
              <span className="tl-year">{t.year}</span>
              <div className="tl-body"><h3>{t.title}</h3><p>{t.text}</p></div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="section values-sec">
      <div className="container">
        <SectionHead center icon="i-leaf" label="ما نُؤمن به" lines={["ثلاثُ وصايا", "لا نكسرُها"]} />
        <div className="values-grid">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * .1}>
              <div className="value-card" role="button" tabIndex={0}
                onClick={e => e.currentTarget.classList.toggle("flipped")}
                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.currentTarget.classList.toggle("flipped"); } }}>
                <div className="vc-inner">
                  <div className="vc-face vc-front">
                    <span className="vc-icon"><svg viewBox="0 0 24 24"><use href={"#i-" + v.icon} /></svg></span>
                    <h3>{v.title}</h3>
                    <span className="vc-hint">المسْ لتقرأَ الوصية</span>
                  </div>
                  <div className="vc-face vc-back"><p>{v.text}</p></div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="section quote-band">
      <div className="container">
        <Reveal>
          <svg className="qb-mark" viewBox="0 0 24 24"><use href="#i-quote" /></svg>
          <blockquote className="qb-text"><MaskLines lines={["النارُ الطيّبةُ لا تُستعار،", "والضيفُ لا يُستقبلُ جائعًا —", "يُستقبلُ بالقهوةِ أولًا."]} /></blockquote>
          <p className="qb-by">— وصيةُ الجدِّ معلّقةٌ فوقَ الموقدِ منذ ٢٠١٥</p>
          <Link to="/reserve" className="btn btn-ember" data-magnetic data-spark><span>كن جزءًا من الحكاية</span><svg className="btn-arrow"><use href="#i-arrow-left" /></svg></Link>
        </Reveal>
      </div>
    </section>
  </>);
}

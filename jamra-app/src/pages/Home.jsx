import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { EASE, MaskLines, Reveal, SectionHead, Count } from "../components/Motion";
import Embers from "../components/Embers";
import ImgMarquee from "../components/ImgMarquee";
import Medal from "../components/Medal";
import Marquee from "../components/Marquee";
import DishRail from "../components/DishRail";
import { MenuTabs } from "../components/MenuList";
import Testimonials from "../components/Testimonials";
import LiveBand from "../components/LiveBand";
import RitualStack from "../components/RitualStack";
import { IMG, CONTACT } from "../data/content";
import useMeta from "../hooks/useMeta";

const hd = s => ({ initial: { opacity: 0, y: 38 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.05, delay: s, ease: EASE } });

export default function Home() {
  useMeta("جَمرة | مشاوي فاخرة على الجمر — الرياض", "حكاية نكهةٍ تُوقدها النار — مشاوي فاخرة على جمر السِّمر في قلب الرياض.");
  return (<>
    <section className="hero" id="home">
      <div className="hero-bg" aria-hidden="true">
        <img src={IMG.fire} alt="" className="img-in" />
        <div className="hero-veil" /><div className="hero-vignette" />
      </div>
      <Embers />
      <div className="container hero-inner">
        <div className="hero-copy">
          <motion.div className="pill-eyebrow" {...hd(.15)}>
            <svg className="i-spark"><use href="#i-sparkle" /></svg>
            <span>الرياض · مشاوي فاخرة على الجمر · منذ ٢٠١٥</span>
            <svg className="i-spark"><use href="#i-sparkle" /></svg>
          </motion.div>
          <h1 className="hero-title">
            <span className="line mask"><motion.span className="l1" {...hd(.35)}>في قلبِ النَّارِ</motion.span></span>
            <span className="line mask">
              <span className="l2 hero-words">
                {["تولدُ", "جَمرة"].map((w, i) => (
                  <motion.span key={w} className="hw ember-word"
                    initial={{ y: "70%", opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.15, delay: .55 + i * .16, ease: [.16, 1, .3, 1] }}>{w}</motion.span>
                ))}
              </span>
            </span>
            <svg className="hero-underline" viewBox="0 0 300 22" aria-hidden="true">
              <motion.path d="M6 14 C 60 4, 120 20, 168 11 S 268 6, 294 13" fill="none" stroke="url(#ugrad)" strokeWidth="3" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.3, delay: 1.05, ease: [.16, 1, .3, 1] }} />
              <defs><linearGradient id="ugrad" x1="0" x2="1"><stop offset="0" stopColor="#ff7a3c" /><stop offset=".55" stopColor="#ffb347" /><stop offset="1" stopColor="#e8b04b" /></linearGradient></defs>
            </svg>
          </h1>
          <motion.p className="hero-desc" {...hd(.7)}>لحمٌ مُختارٌ بعناية، جمرٌ من خشبِ السِّمر، وتوابلُ تروي سيرةَ الشرق — أمسيةٌ تُشوى على مَهَلٍ وتُقدَّمُ بشغف.</motion.p>
          <motion.div className="hero-cta" {...hd(.85)}>
            <Link to="/reserve" className="btn btn-ember" data-magnetic data-spark><span>احجز طاولتك</span><svg className="btn-arrow"><use href="#i-arrow-left" /></svg></Link>
            <Link to="/menu" className="btn btn-ghost" data-magnetic><span>تصفّح القائمة</span></Link>
          </motion.div>
          <motion.div className="hero-stats" {...hd(1)}>
            <div className="hstat"><b><Count to={10} /><span className="suf">+</span></b><span className="hstat-l">سنواتٍ من الشغف</span></div>
            <i className="hsep" aria-hidden="true" />
            <div className="hstat"><b><Count to={120} /><span className="suf">ألف+</span></b><span className="hstat-l">ضيفًا على مائدتنا</span></div>
            <i className="hsep" aria-hidden="true" />
            <div className="hstat"><b><Count to={4.9} decimals={1} /></b><span className="hstat-l">تقييم الضيوف ★</span></div>
          </motion.div>
        </div>

        <motion.div className="hero-visual" initial={{ opacity: 0, y: 46 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: .6, ease: EASE }}>
          <div className="hero-frame">
            <img src={IMG.hero} alt="تشكيلة المشاوي الملكية على الجمر المتّقد" className="img-in" />
            <span className="frame-corner frame-corner-t" aria-hidden="true" />
            <span className="frame-corner frame-corner-b" aria-hidden="true" />
            <span className="frame-glow" aria-hidden="true" />
          </div>
          <div className="hero-chip chip-rating">
            <svg className="chip-star"><use href="#i-star" /></svg>
            <div><b>4.9</b><span>٢٬٣٠ تقييمًا</span></div>
          </div>
          <div className="hero-chip chip-live"><i className="live-pulse" aria-hidden="true" /><span>الجمرُ مُوقَدٌ الآن</span></div>
          <Medal />
          <div className="rot-badge" aria-hidden="true">
            <svg viewBox="0 0 120 120">
              <defs><path id="badgeCircle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
              <text className="badge-text"><textPath href="#badgeCircle">✦ جَمْرٌ ✦ نَكْهَة ✦ أَصَالَة ✦ ضِيَافَة </textPath></text>
            </svg>
            <span className="rb-core"><svg viewBox="0 0 24 24"><use href="#i-flame" /></svg></span>
          </div>
        </motion.div>
      </div>
      <Link to="/about" className="scroll-cue" aria-label="اكتشف الحكاية">
        <span className="cue-text">اكتشف الحكاية</span>
        <span className="cue-line" aria-hidden="true"><i /></span>
      </Link>
    </section>

    <Marquee items={["جمرٌ متّقد", "لحمٌ مُختار", "توابلُ الشرق", "خبزُ التنّور", "ضيافةٌ عربيّة", "أمسياتٌ لا تُنسى"]} />

    <section className="section story">
      <div className="story-glow" aria-hidden="true" />
      <div className="container story-grid">
        <div className="story-copy">
          <SectionHead icon="i-flame" label="حكايتنا" lines={["بدأت بقصعةِ جمرٍ", "وحُلْمٍ كبير"]}
            desc="في زاويةٍ صغيرة من الرياض، أشعلَ جدُّنا أولَ جمرَةٍ عامَ ٢٠١٥. كان يؤمن أنّ النارَ لا تُطهي اللحمَ فحسب — بل تُوقظُ الحكايات." />
          <Reveal className="story-sign" delay={.1}>
            <span className="sign-name">خالد المطيري</span>
            <span className="sign-role">الشيف المؤسِّس</span>
          </Reveal>
          <div className="stats-row">
            {[{ v: 10, s: "+", l: "سنواتٍ على الجمر" }, { v: 30, s: "", l: "طبقًا في القائمة" }, { v: 120, s: " ألف", l: "ضيفٍ سعيد" }, { v: 4.9, d: 1, s: "", l: "تقييمًا متوسطًا" }].map((x, i) => (
              <Reveal className="stat" key={x.l} delay={i * .09}>
                <b><Count to={x.v} decimals={x.d || 0} />{x.s && <span className="suf">{x.s}</span>}</b><span>{x.l}</span>
              </Reveal>
            ))}
          </div>
          <Reveal delay={.2}><Link to="/about" className="btn btn-ghost" data-magnetic><span>اقرأ الحكاية كاملة</span><svg className="btn-arrow"><use href="#i-arrow-left" /></svg></Link></Reveal>
        </div>
        <div className="story-visual">
          <Reveal className="story-main" y={0}>
            <img src={IMG.interior} alt="صالة جَمرة — أضواء دافئة وأقواسٌ شرقية" loading="lazy" className="img-in" />
            <figcaption>الصالة الرئيسية — حي الملقا</figcaption>
          </Reveal>
          <Reveal className="story-sub" delay={.15} y={0}>
            <img src={IMG.spices} alt="توابل جَمرة الطازجة" loading="lazy" className="img-in" />
          </Reveal>
          <div className="story-stamp" aria-hidden="true">
            <svg className="stamp-ring" viewBox="0 0 120 120">
              <defs><path id="stampCircle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
              <text><textPath href="#stampCircle">منذ · ٢٠١٥ · جمرٌ لا يهدأ · </textPath></text>
            </svg>
            <span className="stamp-core"><svg viewBox="0 0 24 24"><use href="#i-flame" /></svg></span>
          </div>
        </div>
      </div>
    </section>

    <section className="section ritual">
      <div className="container">
        <SectionHead center icon="i-sparkle" label="طقوسُنا" lines={["أربعُ خطواتٍ…", "ثم تتكلّمُ النار"]} />
        <RitualStack />
      </div>
    </section>

    <section className="section dishes">
      <div className="container">
        <SectionHead icon="i-star" label="توقيعاتُ الجمر" lines={["أطباقٌ تحكي", "سيرةَ النار"]} desc="اسحبِ العربَةَ يمينًا وشمالًا — كلُّ بطاقةٍ جمرةٌ قائمةٌ بذاتها." />
      </div>
      <DishRail />
    </section>

    <section className="section menu-sec" id="home-menu">
      <div className="menu-bgtext" aria-hidden="true">القائمة</div>
      <div className="container">
        <SectionHead center icon="i-pot" label="من قلبِ المطبخ" lines={["كلُّ طبقٍ…", "حكايةٌ على جمر"]}
          desc="تصفّحْ أقسامَ القائمة الخمسةَ هنا، أو افتح القائمة الكاملة لتبحثَ وتفلتر." />
        <MenuTabs />
        <Reveal className="menu-foot">
          <p><svg><use href="#i-leaf" /></svg> منتجاتٌ موسميّةٌ من مزارعَ محليّة — تتبدّلُ القائمةُ مع الموسم</p>
          <Link to="/menu" className="btn btn-ghost btn-sm" data-magnetic><span>القائمة الكاملة والبحث</span><svg className="btn-arrow"><use href="#i-arrow-left" /></svg></Link>
        </Reveal>
      </div>
    </section>

    <ImgMarquee />

    <LiveBand />

    <section className="section voices">
      <div className="voices-glow" aria-hidden="true" />
      <div className="container">
        <SectionHead center icon="i-quote" label="آراء الضيوف" lines={["قالوا عن جَمرة"]} />
        <Testimonials />
      </div>
    </section>

    <section className="section cta-band">
      <Embers density={26} />
      <div className="container cta-inner">
        <Reveal as="span" className="section-label"><svg><use href="#i-calendar" /></svg> الطاولةُ تنتظر</Reveal>
        <h2 className="section-title"><MaskLines lines={["أوقِدْ مساءَك", "على جمرِنا"]} /></h2>
        <Reveal as="p" className="section-desc" delay={.15}>احجزْ في ثوانٍ — ونبدأ نحنُ بإشعالِ السِّمرِ قبلَ وصولك بساعتين. {CONTACT.hours}</Reveal>
        <Reveal delay={.25} className="cta-btns">
          <Link to="/reserve" className="btn btn-ember" data-magnetic data-spark><span>احجز طاولتك الآن</span><svg className="btn-arrow"><use href="#i-arrow-left" /></svg></Link>
          <a href={CONTACT.phoneHref} className="btn btn-ghost" data-magnetic><svg><use href="#i-phone" /></svg><span dir="ltr">{CONTACT.phone}</span></a>
        </Reveal>
      </div>
    </section>
  </>);
}

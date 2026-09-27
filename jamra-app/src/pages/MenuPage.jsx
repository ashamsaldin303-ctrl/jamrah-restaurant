import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import { MenuFull, MENU_SECTIONS } from "../components/MenuList";
import { jumpTo } from "../hooks/useSmoothScroll";
import { Reveal } from "../components/Motion";
import { IMG } from "../data/content";
import useMeta from "../hooks/useMeta";

export default function MenuPage() {
  useMeta("القائمة | جَمرة", "٣٠ طبقًا من المشاوي والمقبلات والحلويات الشرقية — تُشوى على جمر السِّمر كل مساء.");
  return (<>
    <PageHero chapter="الفصلُ الثاني" title="ق" lines={["كلُّ طبقٍ…", "حكايةٌ على جمر"]} desc="نُبدّل الفحمَ ثلاثَ مرّاتٍ كلَّ مساء، ونطحنُ التوابلَ كلَّ صباح — لتصلَ إليك النكهةُ كما وُلِدَت أوّلَ مرّة." img={IMG.grill} />
    <section className="section menu-page">
      <div className="container">
        <div className="jump-chips" aria-label="انتقال سريع للأقسام">
          {MENU_SECTIONS.map(s => (
            <button key={s.id} className="f-chip" onClick={() => {
              const el = document.getElementById(s.id);
              if (el) jumpTo(el.getBoundingClientRect().top + window.scrollY - 130);
            }}><svg><use href={"#" + s.icon} /></svg>{s.label}</button>
          ))}
        </div>
        <MenuFull />
        <Reveal className="menu-foot">
          <p><svg><use href="#i-leaf" /></svg> نستخدم منتجاتٍ موسميّةً من مزارعَ محليّة — القائمةُ قد تتبدّلُ بحسبِ الموسم</p>
          <Link to="/reserve" className="btn btn-ember btn-sm" data-magnetic data-spark><span>احجز طاولتك</span><svg className="btn-arrow"><use href="#i-arrow-left" /></svg></Link>
        </Reveal>
      </div>
    </section>
  </>);
}

import { Link } from "react-router-dom";
import Embers from "../components/Embers";
import { Reveal } from "../components/Motion";
import useMeta from "../hooks/useMeta";

export default function NotFound() {
  useMeta("٤٠ | جَمرة", "الصفحة التي تبحث عنها انطفأت جمرتها.");
  return (
    <section className="nf-page">
      <Embers density={40} />
      <div className="nf-inner">
        <Reveal as="span" className="nf-code" y={20}>٤٠</Reveal>
        <Reveal as="h1" delay={.1}>هذه الجمرةُ انطفأت</Reveal>
        <Reveal as="p" className="nf-desc" delay={.2}>الصفحةُ التي تبحثُ عنها غيرُ موجودة — لكنّ نارَنا ما زالت مشتعلةً في مكانٍ آخر.</Reveal>
        <Reveal delay={.3} className="nf-btns">
          <Link to="/" className="btn btn-ember" data-magnetic data-spark><span>عُد إلى الدفء</span><svg className="btn-arrow"><use href="#i-arrow-left" /></svg></Link>
          <Link to="/menu" className="btn btn-ghost" data-magnetic><span>تصفّح القائمة</span></Link>
        </Reveal>
      </div>
    </section>
  );
}

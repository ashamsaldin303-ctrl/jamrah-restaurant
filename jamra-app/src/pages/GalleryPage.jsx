import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "../components/PageHero";
import { Reveal } from "../components/Motion";
import { GALLERY, IMG } from "../data/content";
import useMeta from "../hooks/useMeta";

const CATS = ["الكل", "نار", "أطباق", "أجواء", "مطبخ", "ضيافة"];

export default function GalleryPage() {
  useMeta("الأجواء | جَمرة", "لقطات من أمسيتنا كل ليلة: الجمر، التنور، الفوانيس، والضيافة.");
  const [cat, setCat] = useState("الكل");
  const [open, setOpen] = useState(null);
  useEffect(() => {
    const onKey = e => {
      if (open === null) {
        const t = e.target;
        if ((e.key === "Enter" || e.key === " ") && t.classList?.contains("g-item")) { e.preventDefault(); setOpen(Number(t.dataset.idx)); }
        return;
      }
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowLeft") setOpen(o => (o + 1) % GALLERY.length);
      if (e.key === "ArrowRight") setOpen(o => (o - 1 + GALLERY.length) % GALLERY.length);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);
  const items = GALLERY.map((g, i) => ({ ...g, i })).filter(g => cat === "الكل" || g.cat === cat);
  const cur = open !== null ? GALLERY[open] : null;
  const nav = d => setOpen(o => o === null ? o : (o + d + GALLERY.length) % GALLERY.length);

  return (<>
    <PageHero chapter="الفصلُ الثالث" title="ج" lines={["ليلةٌ في جَمرة"]} desc="ضوءٌ خافت، جمرٌ يتوهّج، ورائحةٌ تسبقُك إلى الطاولة — اضغط أيَّ لقطةٍ لتدخلَ إليها." img={IMG.lanterns} />
    <section className="section gallery-page">
      <div className="container">
        <Reveal className="filter-row">
          {CATS.map(c => (
            <button key={c} className={"f-chip" + (cat === c ? " on" : "")} onClick={() => setCat(c)}>{c}</button>
          ))}
        </Reveal>
        <motion.div className="gallery-grid gg-page" layout>
          <AnimatePresence mode="popLayout">
            {items.map(g => (
              <motion.figure layout key={g.i}
                className={"g-item " + g.span} data-idx={g.i}
                initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .94 }}
                transition={{ duration: .55, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setOpen(g.i)} tabIndex={0} role="button"
                onKeyDown={e => { if (e.key === "Enter") setOpen(g.i); }}
                aria-label={"تكبير: " + g.title}>
                {open === g.i ? <span className="g-ph" /> : (
                  <motion.img layoutId={"pic-" + g.i} src={g.img} alt={g.title} loading="lazy" className="img-in" />
                )}
                <figcaption>
                  <span className="g-zoom"><svg><use href="#i-expand" /></svg></span>
                  <b>{g.title}</b><span>{g.caption}</span>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>

    <AnimatePresence>
      {cur && (
        <div className="lightbox open" role="dialog" aria-modal="true" aria-label="عارض الصور">
          <motion.div className="lb-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(null)} />
          <button className="lb-btn lb-close" onClick={() => setOpen(null)} aria-label="إغلاق"><svg><use href="#i-close" /></svg></button>
          <button className="lb-btn lb-prev" onClick={() => nav(1)} aria-label="التالية"><svg><use href="#i-chevron-right" /></svg></button>
          <button className="lb-btn lb-next" onClick={() => nav(-1)} aria-label="السابقة"><svg><use href="#i-chevron-left" /></svg></button>
          <figure className="lb-stage">
            <motion.img key={open} layoutId={"pic-" + open} src={cur.img} alt={cur.title}
              initial={{ opacity: .4 }} animate={{ opacity: 1 }} transition={{ duration: .5, ease: [0.16, 1, 0.3, 1] }} />
            <figcaption>{cur.title} — {cur.caption}</figcaption>
            <span className="lb-count">{open + 1} / {GALLERY.length}</span>
          </figure>
        </div>
      )}
    </AnimatePresence>
  </>);
}

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { MENU, IMG } from "../data/content";

const PANEL_IMG = { "p-grills": "grill", "p-mains": "lamb", "p-mezza": "mezza", "p-sweets": "kunafa", "p-drinks": "coffee" };
const TABS = [
  { id: "p-grills", label: "المشاوي", icon: "i-flame" },
  { id: "p-mains", label: "الرئيسيّة", icon: "i-pot" },
  { id: "p-mezza", label: "المقبّلات", icon: "i-leaf" },
  { id: "p-sweets", label: "الحلويات", icon: "i-sparkle" },
  { id: "p-drinks", label: "المشروبات", icon: "i-cup" },
];

export const MENU_SECTIONS = TABS;

function Item({ it, preview }) {
  return (
    <div className="menu-item" data-glow
      onMouseEnter={e => preview?.(it, e)} onMouseMove={e => preview?.(it, e)} onMouseLeave={() => preview?.(null)}>
      <div className="mi-head">
        <h4>{it.name}{it.tag && <span className={"tag " + it.tagCls}>{it.tag}</span>}</h4>
        <span className="mi-dots" />
        <span className="mi-price">{it.price}</span>
      </div>
      <p>{it.desc}</p>
    </div>
  );
}

function usePreview() {
  const [pv, setPv] = useState(null);
  const preview = (it, e) => {
    if (!it) { setPv(null); return; }
    setPv({ ...it, img: it.__img, x: e.clientX, y: e.clientY });
  };
  return { pv, preview };
}

function PreviewBox({ pv }) {
  const x = pv ? Math.min(Math.max(pv.x + 30, 8), innerWidth - 258) : 0;
  const y = pv ? Math.min(Math.max(pv.y - 70, 8), innerHeight - 210) : 0;
  return (
    <div className={"menu-preview" + (pv ? " on" : "")} style={{ translate: `${x}px ${y}px` }} aria-hidden="true">
      {pv && (<>
        <img src={pv.img} alt="" />
        <div className="mp-meta"><span className="mp-name">{pv.name}</span><span className="mp-price">{pv.price} ر.س</span></div>
      </>)}
    </div>
  );
}

export function MenuTabs() {
  const [tab, setTab] = useState("p-grills");
  const ind = useRef(null);
  const box = useRef(null);
  useLayoutEffect(() => {
    const el = box.current?.querySelector(".menu-tab.active");
    if (!el || !ind.current) return;
    const pr = el.parentElement.getBoundingClientRect(), er = el.getBoundingClientRect();
    ind.current.style.width = er.width + "px";
    ind.current.style.transform = `translateX(${er.left - pr.left - 1}px)`;
  }, [tab]);
  useEffect(() => {
    const f = () => { const e = new Event("resize"); dispatchEvent(e); };
    document.fonts?.ready?.then(f);
    addEventListener("resize", f);
    return () => removeEventListener("resize", f);
  }, []);
  const { pv, preview } = usePreview();
  const withImg = id => MENU[id].items.map(it => ({ ...it, __img: IMG[PANEL_IMG[id]] }));
  return (<>
    <div className="menu-tabs" role="tablist" aria-label="أقسام القائمة" ref={box}>
      <span className="tab-indicator" ref={ind} aria-hidden="true" />
      {TABS.map(t => (
        <button key={t.id} role="tab" aria-selected={tab === t.id}
          className={"menu-tab" + (tab === t.id ? " active" : "")}
          onClick={() => setTab(t.id)}>
          <svg><use href={"#" + t.icon} /></svg>{t.label}
        </button>
      ))}
    </div>
    <div className="menu-panels">
      <div className={"menu-panel active anim"} role="tabpanel" key={tab}>
        {withImg(tab).map((it, i) => (
          <div key={it.name} style={{ "--i": i }}><Item it={it} preview={preview} /></div>
        ))}
      </div>
    </div>
    <PreviewBox pv={pv} />
  </>);
}

export function MenuFull() {
  const [q, setQ] = useState("");
  const [veg, setVeg] = useState(false);
  const [hot, setHot] = useState(false);
  const { pv, preview } = usePreview();
  const sections = useMemo(() => TABS.map(t => {
    let items = MENU[t.id].items.map(it => ({ ...it, __img: IMG[PANEL_IMG[t.id]] }));
    if (q.trim()) items = items.filter(it => (it.name + it.desc).includes(q.trim()));
    if (veg) items = items.filter(it => it.tagCls === "tag-veg");
    if (hot) items = items.filter(it => it.tagCls === "tag-fire" || it.tagCls === "tag-hot");
    return { ...t, items };
  }).filter(s => s.items.length), [q, veg, hot]);
  const total = sections.reduce((a, s) => a + s.items.length, 0);
  return (<>
    <div className="menu-tools">
      <div className="search-box">
        <svg><use href="#i-search" /></svg>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="ابحث عن طبقٍ أو مكوّن…" aria-label="بحث في القائمة" />
      </div>
      <div className="filter-chips">
        <button className={"f-chip" + (veg ? " on" : "")} onClick={() => setVeg(v => !v)}><svg><use href="#i-leaf" /></svg> نباتي</button>
        <button className={"f-chip" + (hot ? " on" : "")} onClick={() => setHot(v => !v)}><svg><use href="#i-flame" /></svg> حرّيف</button>
      </div>
      <span className="menu-count">{total} طبقًا</span>
    </div>
    {sections.length === 0 && <p className="menu-empty">لا يوجد ما يطابق بحثك — جرّب كلمةً أخرى، أو اسألنا فكلُّ شيءٍ ممكنٌ على الجمر 🔥</p>}
    {sections.map(s => (
      <section className="menu-section" key={s.id} id={s.id}>
        <h3 className="menu-sec-title"><svg><use href={"#" + s.icon} /></svg>{s.label}<span>{s.items.length}</span></h3>
        <div className="menu-panel active">
          {s.items.map((it, i) => (
            <div key={it.name} style={{ "--i": i }}><Item it={it} preview={preview} /></div>
          ))}
        </div>
      </section>
    ))}
    <PreviewBox pv={pv} />
  </>);
}

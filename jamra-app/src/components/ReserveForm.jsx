import { useEffect, useMemo, useState } from "react";
import { useToast } from "../context/ToastContext";
import { burst } from "./Sparks";

const TIMES = ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
const TIMES_AR = ["٤:٠٠ م", "٥:٠٠ م", "٦:٠٠ م", "٧:٠٠ م", "٨:٠٠ م", "٩:٠٠ م", "١٠:٠٠ م", "١١:٠٠ م"];
const OCCASIONS = ["عشاءٌ عائلي", "عيدُ ميلاد", "اجتماعُ عمل", "ذكرى زواج", "مناسبةٌ أخرى"];
const DAY_NAMES = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const MON_NAMES = ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"];

export function buildDays() {
  const t = new Date(), out = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(t.getFullYear(), t.getMonth(), t.getDate() + i);
    out.push({
      iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
      day: i === 0 ? "اليوم" : DAY_NAMES[d.getDay()], num: d.getDate(), mon: MON_NAMES[d.getMonth()], date: d,
    });
  }
  return out;
}

export default function ReserveForm({ onChange }) {
  const toast = useToast();
  const days = useMemo(buildDays, []);
  const [f, setF] = useState({ name: "", phone: "", day: days[0].iso, time: "19:00", guests: 2, occasion: OCCASIONS[0], notes: "" });
  const [errs, setErrs] = useState({});
  const [state, setState] = useState("idle"); // idle | loading | success
  const [showOk, setShowOk] = useState(false);
  const set = (k, v) => { if (navigator.vibrate) try { navigator.vibrate(6); } catch (e) {} const n = { ...f, [k]: v }; setF(n); setErrs(e => ({ ...e, [k]: "" })); onChange?.(n, days); };
  useEffect(() => { onChange?.(f, days); }, []); // eslint-disable-line

  const submit = e => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 3) er.name = "فضلًا اكتبْ اسمَك الكامل (٣ أحرفٍ على الأقل)";
    const ph = f.phone.replace(/[\s-]/g, "");
    if (!/^(\+?966|0)?5\d{8}$/.test(ph) && !/^\+?\d{9,14}$/.test(ph)) er.phone = "أدخلْ رقمَ جوّالٍ صحيح (مثال: 0555555555)";
    if (!f.day) er.day = "اخترْ يومَ الحجز";
    setErrs(er);
    if (Object.keys(er).length) { toast("تحقّقْ من الحقولِ المميّزة بالأحمر", true); return; }
    setState("loading");
    setTimeout(() => {
      setState("success");
      const btn = document.getElementById("reserveSubmit");
      if (btn) { const r = btn.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 34); }
      setTimeout(() => setShowOk(true), 380);
      toast("تمَّ استلامُ طلبِ حجزِك ✦ إلى اللقاءِ على الجمر");
    }, 1500);
  };
  const reset = () => { setState("idle"); setShowOk(false); setF({ name: "", phone: "", day: days[0].iso, time: "19:00", guests: 2, occasion: OCCASIONS[0], notes: "" }); };
  const dayLabel = days.find(d => d.iso === f.day);

  return (
    <div className="form-card">
      <span className="fc-glow" aria-hidden="true" />
      <form id="reserveForm" noValidate onSubmit={submit}>
        <div className="form-grid">
          <div className={"field" + (errs.name ? " invalid" : "")}>
            <input id="fName" placeholder=" " autoComplete="name" value={f.name} onChange={e => set("name", e.target.value)} />
            <label htmlFor="fName">الاسمُ الكامل</label>
            <span className="field-err">{errs.name}</span>
          </div>
          <div className={"field" + (errs.phone ? " invalid" : "")}>
            <input id="fPhone" type="tel" dir="ltr" placeholder=" " autoComplete="tel" value={f.phone} onChange={e => set("phone", e.target.value)} />
            <label htmlFor="fPhone">رقمُ الجوّال</label>
            <span className="field-err">{errs.phone}</span>
          </div>
        </div>

        <div className={"form-block field-days-block" + (errs.day ? " invalid" : "")}>
          <span className="fb-label">اليوم</span>
          <div className="day-chips">
            {days.map(d => (
              <button type="button" key={d.iso} className={"day-chip" + (f.day === d.iso ? " active" : "")} onClick={() => set("day", d.iso)}
                aria-label={`${d.day} ${d.num} ${d.mon}`}>
                <b>{d.day}</b><span>{d.num}</span><small>{d.mon}</small>
              </button>
            ))}
          </div>
          <span className="field-err">{errs.day}</span>
        </div>

        <div className="form-block">
          <span className="fb-label">الوقتُ المفضّل</span>
          <div className="time-pills">
            {TIMES.map((t, i) => (
              <label key={t}>
                <input type="radio" name="time" value={t} checked={f.time === t} onChange={() => set("time", t)} />
                <span>{TIMES_AR[i]}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-block guests-block">
            <span className="fb-label">عددُ الضيوف</span>
            <div className="stepper">
              <button type="button" className="step-btn" aria-label="إنقاص" onClick={() => set("guests", Math.max(1, f.guests - 1))}><svg><use href="#i-minus" /></svg></button>
              <span className="step-val"><b key={f.guests} className="pop">{f.guests === 20 ? "20+" : f.guests}</b> <small>ضيف</small></span>
              <button type="button" className="step-btn" aria-label="زيادة" onClick={() => set("guests", Math.min(20, f.guests + 1))}><svg><use href="#i-plus" /></svg></button>
            </div>
          </div>
          <div className="field">
            <select id="fOccasion" value={f.occasion} onChange={e => set("occasion", e.target.value)}>
              {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <label htmlFor="fOccasion" className="lbl-fixed">المناسبة</label>
          </div>
        </div>

        <div className="field field-full">
          <textarea id="fNotes" rows="3" placeholder=" " value={f.notes} onChange={e => set("notes", e.target.value)} />
          <label htmlFor="fNotes">ملاحظاتٌ خاصّة (اختياري)</label>
        </div>

        <button type="submit" id="reserveSubmit" className={"btn btn-ember btn-submit" + (state === "loading" ? " loading" : "") + (state === "success" ? " success" : "")} data-magnetic data-spark>
          <span className="bs-text">تأكيدُ الحجز</span>
          <span className="bs-spinner" aria-hidden="true" />
          <span className="bs-check" aria-hidden="true"><svg viewBox="0 0 24 24"><use href="#i-check" /></svg></span>
        </button>
      </form>

      <div className={"form-success" + (showOk ? " show" : "")} aria-hidden={!showOk}>
        <span className="fs-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" className="fs-circle" /><path d="M7 12.5l3.2 3.2L17 8.5" className="fs-tick" />
          </svg>
        </span>
        <h3>تمَّ استلامُ حجزك!</h3>
        <p>{f.name.split(" ")[0]} العزيز — طاولتُك لـ {f.guests === 20 ? "+20" : f.guests} ضيفًا، {dayLabel ? `${dayLabel.day} ${dayLabel.num} ${dayLabel.mon}` : ""} الساعة {f.time} بتوقيت الرياض. سنتّصلُ بك خلالَ ساعةٍ لتأكيدِ التفاصيل 🔥</p>
        <div className="ok-steps" aria-hidden="true">
          <span className="ok-step done"><i /><b>تمّ الاستلام</b></span>
          <span className="ok-line" /><span className="ok-step done"><i /><b>نتصلُ بك للتأكيد</b></span>
          <span className="ok-line" /><span className="ok-step live"><i /><b>الجمرُ يُوقد</b></span>
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={reset}><span>حجزٌ آخر</span></button>
      </div>
    </div>
  );
}

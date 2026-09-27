import useCountdown from "../hooks/useCountdown";
import { SPECIALS } from "../data/content";

export default function LiveBand() {
  const { h, m, s } = useCountdown();
  const special = SPECIALS[new Date().getDay() % 7];
  const U = ({ v, l }) => (
    <span className="lb-unit" key={l}><b>{String(v).padStart(2, "0")}</b><small>{l}</small></span>
  );
  return (
    <div className="live-band" aria-label="طبق الليلة">
      <div className="lb-inner">
        <span className="lb-flame"><svg viewBox="0 0 24 24"><use href="#i-flame" /></svg></span>
        <p className="lb-text">طبقُ الليلةِ على الجمر: <b>{special}</b></p>
        <span className="lb-sep" />
        <p className="lb-dim">يهدأ الجمرُ بعد</p>
        <div className="lb-count" dir="ltr">
          <U v={h} l="ساعة" /><U v={m} l="دقيقة" /><U v={s} l="ثانية" />
        </div>
      </div>
    </div>
  );
}

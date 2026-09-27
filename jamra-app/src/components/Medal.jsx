export default function Medal({ className = "" }) {
  return (
    <span className={"medal " + className} aria-hidden="true">
      <span className="medal-spin">
        <span className="medal-face medal-front"><svg viewBox="0 0 24 24"><use href="#i-flame" /></svg></span>
        <span className="medal-face medal-back">ج</span>
      </span>
    </span>
  );
}

export default function Marquee({ items }) {
  const row = (key) => (
    <span className="mq-group" key={key}>
      {items.map((t, i) => (
        <span className="mq-pair" key={i}>
          <span className="mq-item">{t}</span>
          <span className="mq-sep"><svg><use href="#i-sparkle" /></svg></span>
        </span>
      ))}
    </span>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">{row(0)}{row(1)}</div>
    </div>
  );
}

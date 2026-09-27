import { Link } from "react-router-dom";
import { GALLERY } from "../data/content";

export default function ImgMarquee() {
  const row = k => (
    <span className="imq-group" key={k}>
      {GALLERY.slice(0, 6).map((g, i) => (
        <Link to="/gallery" className="imq-item" key={i} aria-label={g.title} data-cursor="عرض">
          <img src={g.img} alt={g.title} loading="lazy" decoding="async" className="img-in" />
          <span className="imq-cap">{g.title}</span>
        </Link>
      ))}
    </span>
  );
  return (
    <div className="img-marquee" aria-label="معرض مصغّر">
      <div className="imq-track">{row(0)}{row(1)}</div>
    </div>
  );
}

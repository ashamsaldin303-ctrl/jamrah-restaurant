import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageCurtain() {
  const { pathname } = useLocation();
  const [cover, setCover] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setCover(true);
    const t = setTimeout(() => setCover(false), 620);
    return () => clearTimeout(t);
  }, [pathname]);
  return (
    <div className={"route-curtain" + (cover ? " cover" : "")} aria-hidden="true">
      <i /><i /><i /><i />
    </div>
  );
}

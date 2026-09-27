import { useEffect } from "react";
export default function useMeta(title, desc) {
  useEffect(() => {
    document.title = title;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement("meta"); m.name = "description"; document.head.appendChild(m); }
    if (desc) m.content = desc;
  }, [title, desc]);
}

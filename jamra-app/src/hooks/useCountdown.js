import { useEffect, useState } from "react";
export default function useCountdown() {
  const calc = () => {
    const now = new Date();
    const close = new Date(now); close.setHours(25, 0, 0, 0);
    let s = Math.max(0, Math.floor((close - now) / 1000));
    return { h: Math.floor(s / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const i = setInterval(() => setT(calc()), 1000); return () => clearInterval(i); }, []);
  return t;
}

import { createContext, useCallback, useContext, useRef, useState } from "react";
const Ctx = createContext(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const id = useRef(0);
  const toast = useCallback((msg, err) => {
    const t = { id: ++id.current, msg, err, show: false };
    setToasts(p => [...p, t]);
    requestAnimationFrame(() => requestAnimationFrame(() =>
      setToasts(p => p.map(x => x.id === t.id ? { ...x, show: true } : x))));
    setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 4200);
  }, []);
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div className="toast-wrap" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={"toast" + (t.err ? " err" : "") + (t.show ? " show" : "")}>
            <svg><use href={t.err ? "#i-close" : "#i-check"} /></svg>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

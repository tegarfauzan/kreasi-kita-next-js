"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

interface ToastContextValue { showToast: (message: string) => void }
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = useCallback((nextMessage: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(nextMessage);
    setVisible(true);
    timer.current = setTimeout(() => setVisible(false), 2800);
  }, []);
  const value = useMemo(() => ({ showToast }), [showToast]);

  return <ToastContext.Provider value={value}>{children}<div className={`pointer-events-none fixed bottom-5 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl bg-ink-black px-5 py-4 text-center text-sm font-semibold text-white shadow-2xl transition duration-200 ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`} role="status" aria-live="polite">{message}</div></ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast harus digunakan di dalam ToastProvider.");
  return context;
}

import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast } from "../components/common/Toast";

const ToastContext = createContext(null);

// Envuelve la app entera (ver App.jsx). Cualquier componente adentro puede
// llamar useToast() para mostrar un mensaje flotante en vez de un alert()
// nativo del navegador.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const cerrarToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // tipo: "success" | "error" | "info" (por defecto "info")
  const mostrarToast = useCallback((mensaje, tipo = "info", duracionMs = 6000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => cerrarToast(id), duracionMs);
  }, [cerrarToast]);

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <Toast toasts={toasts} cerrarToast={cerrarToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast() debe usarse dentro de <ToastProvider>");
  }
  return ctx;
}

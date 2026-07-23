import React from "react";
import { C, sans } from "../../styles/tokens";

const COLOR_BORDE = {
  success: "#4B7A63",
  error: "#B3452F",
  info: C.earth,
};

export function Toast({ toasts, cerrarToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-[90vw] sm:max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-start gap-3 px-5 py-4 shadow-lg animate-[toast-in_0.2s_ease-out]"
          style={{
            backgroundColor: C.white,
            borderLeft: `4px solid ${COLOR_BORDE[t.tipo] || C.earth}`,
          }}
        >
          <p style={{ ...sans, color: C.ink }} className="text-sm flex-1 leading-snug">
            {t.mensaje}
          </p>
          <button
            onClick={() => cerrarToast(t.id)}
            style={{ color: C.inkSoft }}
            className="text-lg leading-none flex-shrink-0"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      ))}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
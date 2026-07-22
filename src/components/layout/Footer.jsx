import React from "react";
import { C, sans } from "../../styles/tokens";

export function Footer() {
  return (
    <footer style={{ backgroundColor: C.ink, borderTop: `1px solid ${C.inkSoft}` }} className="py-6">
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div style={{ ...sans, color: C.sand }} className="text-[11px] tracking-wide">
          © 2026 Cielo Boutique — Bolivar, Colombia — Todos los derechos reservados
        </div>
        <div style={{ ...sans, color: C.warm }} className="text-[11px] uppercase tracking-[0.14em] flex gap-5">
          <span>Instagram</span>
          <span>WhatsApp</span>
          <span>Pinterest</span>
        </div>
      </div>
    </footer>
  );
}

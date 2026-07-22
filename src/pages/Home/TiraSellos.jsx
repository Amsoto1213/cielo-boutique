import React from "react";
import { C, serif, sans } from "../../styles/tokens";

export function TiraSellos() {
  const sellos = [
    { t: "Origen", d: "Tejidos naturales, curtidos y algodones certificados" },
    { t: "Confección", d: "Taller propio, piezas terminadas a mano" },
    { t: "Edición limitada", d: "Lotes pequeños, sin reposición garantizada" },
    { t: "Envío nacional", d: "3–5 días hábiles a toda Colombia" },
  ];
  return (
    <section style={{ backgroundColor: C.ink }} className="py-10">
      <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {sellos.map((s, i) => (
          <div key={i} className="text-center">
            <div style={{ color: C.gold }} className="mb-1">✦</div>
            <div className="text-[13px] uppercase tracking-[0.12em] mb-1" style={{ ...sans, color: C.white }}>{s.t}</div>
            <div className="text-[12px]" style={{ ...sans, color: C.sand }}>{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

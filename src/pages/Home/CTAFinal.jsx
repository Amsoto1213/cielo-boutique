import React from "react";
import { Link } from "react-router-dom";
import { C, serif, sans } from "../../styles/tokens";

export function CTAFinal() {
  return (
    <section style={{ backgroundColor: C.ink }} className="py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl mb-4" style={{ ...serif, color: C.white }}>
            Viste tu <em style={{ color: C.gold }}>esencia</em> hoy
          </h2>
          <Link to="/contacto" className="text-sm" style={{ ...serif, fontStyle: "italic", color: C.warm }}>
            Escríbenos, con gusto asesoramos tu talla →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-6 md:justify-self-end text-right">
          <div>
            <div style={{ ...sans, color: C.sand }} className="text-[11px] uppercase tracking-[0.12em] mb-1">Boutique</div>
            <div style={{ ...sans, color: C.white }} className="text-sm leading-relaxed">Bolivar, Colombia</div>
          </div>
          <div>
            <div style={{ ...sans, color: C.sand }} className="text-[11px] uppercase tracking-[0.12em] mb-1">Escríbenos</div>
            <div style={{ ...sans, color: C.warm }} className="text-sm leading-relaxed">
              ventascielo@gmail.com.co<br />+57 311 3140639
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

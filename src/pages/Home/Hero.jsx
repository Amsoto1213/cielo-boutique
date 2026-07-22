import React from "react";
import { useNavigate } from "react-router-dom";
import { C, serif, sans } from "../../styles/tokens";
import { Sello } from "../../components/common/Marca";
import { EarthButton, GhostButton } from "../../components/common/Botones";

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-10 text-center">
      <div className="flex items-center justify-center gap-3 mb-5">
        <span className="w-8 h-px" style={{ backgroundColor: C.earth }} />
        <Sello text="Bolivar · Colección Continua" />
        <span className="w-8 h-px" style={{ backgroundColor: C.earth }} />
      </div>
      <h1 className="text-4xl md:text-6xl leading-[1.15] mb-6" style={{ ...serif, color: C.ink }}>
        Donde la moda <em style={{ color: C.earth }}>encuentra</em> la esencia
      </h1>
      <p className="max-w-xl mx-auto text-[15px] md:text-base mb-9" style={{ ...sans, color: C.inkSoft }}>
        Piezas hechas para durar una temporada de calor tras otra — tejidos naturales,
        cortes precisos y un color por cada hora del día.
      </p>
      <div className="flex items-center justify-center gap-4">
        <EarthButton onClick={() => navigate("/catalogo")}>Ver colección</EarthButton>
        <GhostButton onClick={() => navigate("/contacto")}>Nuestra historia</GhostButton>
      </div>
    </section>
  );
}

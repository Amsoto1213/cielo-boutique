import React from "react";
import { useNavigate } from "react-router-dom";
import { C, serif } from "../../styles/tokens";
import { Sello } from "../../components/common/Marca";
import { GhostButton } from "../../components/common/Botones";
import { TarjetaColeccion } from "../../components/tienda/TarjetaColeccion";

export function ColeccionesDestacadas({ productos, onAdd }) {
  const navigate = useNavigate();

  // TODOS los productos de la categoría "Novedades", sin límite.
  const destacados = productos.filter((p) => p.categoria === "Novedades");

  if (destacados.length === 0) return null;

  return (
    <section style={{ backgroundColor: C.ivory }} className="py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-px" style={{ backgroundColor: C.earth }} />
              <Sello text="Colección" />
            </div>
            <h2 className="text-3xl md:text-4xl" style={{ ...serif, color: C.ink }}>
              Piezas para tu <em style={{ color: C.earth }}>esencia</em>
            </h2>
          </div>
          <GhostButton onClick={() => navigate("/catalogo")}>Ver todo</GhostButton>
        </div>

        {/* Cuadrícula uniforme: todas las tarjetas del mismo tamaño, así las
            filas siempre quedan parejas sin importar cuántos productos haya. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {destacados.map((p) => (
            <TarjetaColeccion key={p.id} producto={p} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { C, serif } from "../../styles/tokens";
import { Sello, Star } from "../../components/common/Marca";
import { TarjetaColeccion } from "../../components/tienda/TarjetaColeccion";


export function SeleccionDorada({ productos, onAdd }) {
  // Filtra los productos que pertenecen a la categoría "Cielo Essentials", que es la que se muestra en esta sección de "Selección dorada". Si no hay ninguno, no renderiza nada.
  const enOferta = productos.filter((p) => p.categoria === "Cielo Essentials");
  
  if (enOferta.length === 0) return null;
  
  return (
    <section className="py-20" style={{ backgroundColor: C.white }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex items-center gap-2 mb-2">
          <Star />
          <Sello text="Tiempo limitado" />
        </div>
        <h2 className="text-3xl md:text-4xl mb-10" style={{ ...serif, color: C.ink }}>
          Selección <em style={{ color: C.gold }}>dorada</em>
        </h2>
        {/* Misma cuadrícula uniforme que Colecciones destacadas: 1 columna en
            celular, 2 en tablet, 3 en escritorio, filas siempre parejas. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {enOferta.map((p) => (
            <TarjetaColeccion key={p.id} producto={p} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { C, serif, sans } from "../../styles/tokens";
import { PriceTag } from "../common/PriceTag";

export function TarjetaColeccion({ producto, tall, onAdd }) {
  return (
    <div className="group">
      <Link to={`/producto/${producto.id}`}>
        <div className={`w-full overflow-hidden ${tall ? "aspect-[3/4]" : "aspect-[4/5]"}`}>
          <img
            src={producto.img}
            alt={producto.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="pt-4 flex items-start justify-between gap-3">
        <Link to={`/producto/${producto.id}`}>
          <div style={{ ...serif, color: C.ink }} className="text-lg">{producto.nombre}</div>
          <div style={{ ...sans, color: C.inkSoft }} className="text-xs mb-1.5">{producto.categoria}</div>
          <PriceTag producto={producto} />
        </Link>
        <button
          onClick={() => onAdd(producto)}
          className="text-[11px] uppercase tracking-[0.12em] px-3 py-2 whitespace-nowrap"
          style={{ ...sans, color: C.earth, border: `1px solid ${C.earth}` }}
        >
          Añadir
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { C, sans } from "../../styles/tokens";
import { formatCOP, precioFinal } from "../../utils/format";

export function PriceTag({ producto }) {
  const tiene = producto.descuento > 0;
  return (
    <div className="flex items-baseline gap-2">
      {tiene && (
        <span className="text-xs line-through" style={{ color: C.inkSoft, ...sans }}>
          {formatCOP(producto.precio)}
        </span>
      )}
      <span className="text-sm" style={{ color: tiene ? C.gold : C.ink, ...sans, fontWeight: tiene ? 600 : 400 }}>
        {formatCOP(precioFinal(producto))}
      </span>
      {tiene && (
        <span
          className="text-[10px] uppercase tracking-widest px-1.5 py-0.5"
          style={{ color: C.white, backgroundColor: C.gold, ...sans }}
        >
          -{producto.descuento}%
        </span>
      )}
    </div>
  );
}

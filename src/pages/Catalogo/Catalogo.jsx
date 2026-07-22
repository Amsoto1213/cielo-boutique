import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { C, serif, sans } from "../../styles/tokens";
import { Sello } from "../../components/common/Marca";
import { EarthButton } from "../../components/common/Botones";
import { PriceTag } from "../../components/common/PriceTag";

export function Catalogo({ productos, onAdd }) {
  const [categoria, setCategoria] = useState("Todas");
  const [tallaSel, setTallaSel] = useState({});

  // Las categorías del filtro se sacan de los productos reales, no de una
  // lista fija — así cualquier categoría nueva que agregues aparece sola,
  // sin tener que tocar código.
  const categoriasDisponibles = useMemo(
    () => Array.from(new Set(productos.map((p) => p.categoria))).sort(),
    [productos]
  );

  const filtrados = useMemo(
    () => (categoria === "Todas" ? productos : productos.filter((p) => p.categoria === categoria)),
    [categoria, productos]
  );

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-16">
      <div className="mb-10">
        <Sello text="Catálogo completo" />
        <h1 className="text-3xl md:text-4xl mt-2" style={{ ...serif, color: C.ink }}>
          Toda la <em style={{ color: C.earth }}>colección</em>
        </h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {["Todas", ...categoriasDisponibles].map((c) => (
          <button
            key={c}
            onClick={() => setCategoria(c)}
            className="px-4 py-2 text-[12px] uppercase tracking-[0.1em]"
            style={{
              ...sans,
              color: categoria === c ? C.white : C.ink,
              backgroundColor: categoria === c ? C.earth : "transparent",
              border: `1px solid ${categoria === c ? C.earth : C.sand}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
        {filtrados.map((p) => (
          <div key={p.id}>
            <Link to={`/producto/${p.id}`}>
              <div className="w-full aspect-[4/5] overflow-hidden mb-4">
                <img src={p.img} alt={p.nombre} className="w-full h-full object-cover" />
              </div>
              <div style={{ ...serif, color: C.ink }} className="text-lg">{p.nombre}</div>
            </Link>
            <div style={{ ...sans, color: C.inkSoft }} className="text-xs mb-2">{p.descripcion}</div>
            <PriceTag producto={p} />
            <div className="flex items-center gap-1.5 mt-3 mb-3 flex-wrap">
              {Object.keys(p.tallas).map((t) => {
                const stock = p.tallas[t];
                const selected = tallaSel[p.id] === t;
                return (
                  <button
                    key={t}
                    disabled={stock === 0}
                    onClick={() => setTallaSel({ ...tallaSel, [p.id]: t })}
                    className="w-9 h-9 text-[11px] flex items-center justify-center"
                    style={{
                      ...sans,
                      border: `1px solid ${selected ? C.earth : C.sand}`,
                      color: stock === 0 ? C.sand : selected ? C.white : C.ink,
                      backgroundColor: selected ? C.earth : "transparent",
                      opacity: stock === 0 ? 0.4 : 1,
                      textDecoration: stock === 0 ? "line-through" : "none",
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <EarthButton onClick={() => onAdd(p, tallaSel[p.id] || Object.keys(p.tallas)[0])} className="w-full">
              Añadir al carrito
            </EarthButton>
          </div>
        ))}
      </div>
    </section>
  );
}

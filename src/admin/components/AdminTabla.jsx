import React, { useState, useMemo } from "react";
import { C, sans } from "../../styles/tokens";
import { formatCOP } from "../../utils/format";

const OTRA = "__otra__";

function FormularioEdicionProducto({ producto, categoriasExistentes, onGuardar, onCancelar }) {
  const [categoria, setCategoria] = useState(producto.categoria);
  const [escribiendoOtra, setEscribiendoOtra] = useState(false);
  const [precio, setPrecio] = useState(producto.precio);
  const [descuento, setDescuento] = useState(producto.descuento || 0);
  const [stockPorTalla, setStockPorTalla] = useState({ ...producto.tallas });
  const [guardando, setGuardando] = useState(false);

  const opcionesCategoria = useMemo(() => {
    const base = ["Vestidos", "Accesorios", "Sets", "Novedades", "Camisas y Blusas", "Pantalones", "Faldas", "Shorts", "Enterizos", "Cielo Essentials", "Sale"];
    return Array.from(new Set([...base, ...categoriasExistentes])).sort();
  }, [categoriasExistentes]);

  const inputStyle = { ...sans, border: `1px solid ${C.sand}` };

  const submit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    const ok = await onGuardar({ categoria, precio, descuento, stockPorTalla });
    setGuardando(false);
    return ok;
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-[11px] uppercase tracking-wide block mb-1" style={{ ...sans, color: C.inkSoft }}>Categoría</label>
          {!escribiendoOtra ? (
            <select
              value={categoria}
              onChange={(e) => {
                if (e.target.value === OTRA) {
                  setEscribiendoOtra(true);
                  setCategoria("");
                } else {
                  setCategoria(e.target.value);
                }
              }}
              className="w-full px-3 py-2 text-sm outline-none"
              style={inputStyle}
            >
              {opcionesCategoria.map((c) => <option key={c} value={c}>{c}</option>)}
              <option value={OTRA}>+ Otra categoría...</option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                autoFocus
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Nombre de la categoría"
                className="w-full px-3 py-2 text-sm outline-none"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => { setEscribiendoOtra(false); setCategoria(producto.categoria); }}
                className="text-[11px] uppercase tracking-wide underline whitespace-nowrap"
                style={{ ...sans, color: C.inkSoft }}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wide block mb-1" style={{ ...sans, color: C.inkSoft }}>Precio (COP)</label>
          <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} className="w-full px-3 py-2 text-sm outline-none" style={inputStyle} />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wide block mb-1" style={{ ...sans, color: C.inkSoft }}>% Descuento</label>
          <input type="number" min="0" max="100" value={descuento} onChange={(e) => setDescuento(e.target.value)} className="w-full px-3 py-2 text-sm outline-none" style={inputStyle} />
        </div>
      </div>

      <div>
        <label className="text-[11px] uppercase tracking-wide block mb-2" style={{ ...sans, color: C.inkSoft }}>Cantidad por talla</label>
        {Object.keys(stockPorTalla).length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {Object.keys(stockPorTalla).map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="w-8 text-xs" style={{ ...sans, color: C.ink }}>{t}</span>
                <input
                  type="number"
                  min="0"
                  value={stockPorTalla[t]}
                  onChange={(e) => setStockPorTalla({ ...stockPorTalla, [t]: e.target.value })}
                  className="w-20 px-2 py-2 text-xs outline-none"
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs italic" style={{ ...sans, color: C.inkSoft }}>Este producto no tiene tallas configuradas.</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={guardando}
          className="px-5 py-2 text-[11px] uppercase tracking-wide text-white"
          style={{ backgroundColor: C.earth, opacity: guardando ? 0.6 : 1 }}
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="px-5 py-2 text-[11px] uppercase tracking-wide underline"
          style={{ ...sans, color: C.inkSoft }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export function AdminTabla({ productos, categoriasExistentes = [], onToggleActivo, onEliminarPermanente, onGuardarEdicion }) {
  const [editando, setEditando] = useState(null);

  return (
    <div className="overflow-x-auto" style={{ backgroundColor: C.white, border: `1px solid ${C.sand}` }}>
      <table className="w-full text-sm" style={sans}>
        <thead>
          <tr style={{ backgroundColor: C.ivory }}>
            {["Imagen", "Nombre", "Categoría", "Precio", "Descuento", "Stock total", "Estado", "Acciones"].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-wide" style={{ color: C.inkSoft }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => {
            const stockTotal = Object.values(p.tallas).reduce((a, b) => a + b, 0);
            const enEdicion = editando === p.id;
            return (
              <React.Fragment key={p.id}>
                <tr style={{ borderTop: `1px solid ${C.sand}`, opacity: p.activo ? 1 : 0.55 }}>
                  <td className="px-4 py-3"><img src={p.img} alt={p.nombre} className="w-12 h-14 object-cover" /></td>
                  <td className="px-4 py-3" style={{ color: C.ink }}>{p.nombre}</td>
                  <td className="px-4 py-3" style={{ color: C.inkSoft }}>{p.categoria}</td>
                  <td className="px-4 py-3" style={{ color: C.ink }}>{formatCOP(p.precio)}</td>
                  <td className="px-4 py-3">
                    {p.descuento > 0 ? <span style={{ color: C.gold, fontWeight: 600 }}>{p.descuento}%</span> : <span style={{ color: C.inkSoft }}>—</span>}
                  </td>
                  <td className="px-4 py-3" style={{ color: stockTotal === 0 ? "#B3452F" : C.ink }}>{stockTotal}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[10px] uppercase tracking-wide px-2 py-1"
                      style={{ color: C.white, backgroundColor: p.activo ? "#4B7A63" : C.inkSoft }}
                    >
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => setEditando(enEdicion ? null : p.id)}
                        className="text-[11px] uppercase tracking-wide underline text-left"
                        style={{ color: C.ink }}
                      >
                        {enEdicion ? "Cerrar edición" : "Editar"}
                      </button>
                      <button
                        onClick={() => onToggleActivo(p)}
                        className="text-[11px] uppercase tracking-wide underline text-left"
                        style={{ color: C.earth }}
                      >
                        {p.activo ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        onClick={() => onEliminarPermanente(p.id)}
                        className="text-[11px] uppercase tracking-wide underline text-left"
                        style={{ color: "#B3452F" }}
                      >
                        Eliminar permanente
                      </button>
                    </div>
                  </td>
                </tr>
                {enEdicion && (
                  <tr>
                    <td colSpan={8} className="px-6 py-6" style={{ backgroundColor: C.ivory, borderTop: `1px solid ${C.sand}` }}>
                      <FormularioEdicionProducto
                        key={p.id}
                        producto={p}
                        categoriasExistentes={categoriasExistentes}
                        onGuardar={async (cambios) => {
                          const ok = await onGuardarEdicion(p.id, cambios);
                          if (ok) setEditando(null);
                          return ok;
                        }}
                        onCancelar={() => setEditando(null)}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

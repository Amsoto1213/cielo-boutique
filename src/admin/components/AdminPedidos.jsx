import React, { useState, useMemo } from "react";
import { C, serif, sans } from "../../styles/tokens";
import { ESTADOS_PEDIDO, ESTADO_COLOR } from "../../data/constants";
import { formatCOP } from "../../utils/format";

export function AdminPedidos({ pedidos, onCambiarEstado }) {
  const [expandido, setExpandido] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const pedidosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return pedidos.filter((p) => {
      const coincideEstado = filtroEstado === "Todos" || p.estado === filtroEstado;
      if (!coincideEstado) return false;

      if (!termino) return true;

      const codigo = (p.numero_pedido || p.id || "").toLowerCase();
      const nombre = (p.cliente_nombre || "").toLowerCase();
      return codigo.includes(termino) || nombre.includes(termino);
    });
  }, [pedidos, busqueda, filtroEstado]);

  const inputStyle = { ...sans, border: `1px solid ${C.sand}` };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre del cliente o número de pedido..."
          className="flex-1 px-4 py-2.5 text-sm outline-none"
          style={{ ...inputStyle, backgroundColor: C.white }}
        />
        <div className="flex flex-wrap gap-2">
          {["Todos", ...ESTADOS_PEDIDO].map((e) => (
            <button
              key={e}
              onClick={() => setFiltroEstado(e)}
              className="px-3 py-2 text-[11px] uppercase tracking-wide"
              style={{
                ...sans,
                color: filtroEstado === e ? C.white : C.ink,
                backgroundColor: filtroEstado === e ? (ESTADO_COLOR[e] || C.earth) : "transparent",
                border: `1px solid ${filtroEstado === e ? (ESTADO_COLOR[e] || C.earth) : C.sand}`,
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {pedidos.length > 0 && (
        <div style={{ ...sans, color: C.inkSoft }} className="text-xs">
          {pedidosFiltrados.length} de {pedidos.length} pedidos
        </div>
      )}

      {pedidos.length === 0 && (
        <div className="p-8 text-center" style={{ backgroundColor: C.white, border: `1px solid ${C.sand}`, ...sans, color: C.inkSoft }}>
          Aún no hay pedidos registrados.
        </div>
      )}

      {pedidos.length > 0 && pedidosFiltrados.length === 0 && (
        <div className="p-8 text-center" style={{ backgroundColor: C.white, border: `1px solid ${C.sand}`, ...sans, color: C.inkSoft }}>
          Ningún pedido coincide con esa búsqueda o filtro.
        </div>
      )}

      {pedidosFiltrados.map((p) => (
        <div key={p.id} style={{ backgroundColor: C.white, border: `1px solid ${C.sand}` }}>
          <button onClick={() => setExpandido(expandido === p.id ? null : p.id)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
            <div>
              <div style={{ ...serif, color: C.ink }} className="text-base">{p.numero_pedido || p.id} — {p.cliente_nombre}</div>
              <div style={{ ...sans, color: C.inkSoft }} className="text-xs">
                {new Date(p.creado_en).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                {" · "}{p.ciudad}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ ...serif, color: C.ink }} className="text-base">{formatCOP(p.total)}</span>
              <span className="text-[10px] uppercase tracking-wide px-2 py-1" style={{ ...sans, color: C.white, backgroundColor: ESTADO_COLOR[p.estado] }}>{p.estado}</span>
            </div>
          </button>

          {expandido === p.id && (
            <div className="px-5 pb-5" style={{ borderTop: `1px solid ${C.sand}` }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wide mb-1" style={{ ...sans, color: C.inkSoft }}>Contacto</div>
                  <div className="text-sm" style={{ ...sans, color: C.ink }}>{p.cliente_email}<br />{p.telefono}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide mb-1" style={{ ...sans, color: C.inkSoft }}>Dirección de envío</div>
                  <div className="text-sm" style={{ ...sans, color: C.ink }}>{p.direccion}<br />{p.ciudad}, {p.departamento}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-[11px] uppercase tracking-wide mb-2" style={{ ...sans, color: C.inkSoft }}>Prendas</div>
                <ul className="space-y-1">
                  {p.items.map((it, i) => (
                    <li key={i} className="text-sm" style={{ ...sans, color: C.ink }}>{it.cantidad}× {it.nombre} — talla {it.talla}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] uppercase tracking-wide mr-1" style={{ ...sans, color: C.inkSoft }}>Estado:</span>
                {ESTADOS_PEDIDO.map((e) => (
                  <button
                    key={e}
                    onClick={() => onCambiarEstado(p.id, e)}
                    className="text-[11px] uppercase tracking-wide px-3 py-1.5"
                    style={{
                      ...sans,
                      border: `1px solid ${e === p.estado ? ESTADO_COLOR[e] : C.sand}`,
                      backgroundColor: e === p.estado ? ESTADO_COLOR[e] : "transparent",
                      color: e === p.estado ? C.white : C.ink,
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

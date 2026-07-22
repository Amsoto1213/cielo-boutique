import React, { useState } from "react";
import { C, serif, sans } from "../../styles/tokens";
import { formatCOP, precioFinal } from "../../utils/format";
import { EarthButton } from "../common/Botones";
import { Star } from "../common/Marca";
import { PriceTag } from "../common/PriceTag";
import { crearPedido } from "../../api/pedidos";

export function Carrito({ abierto, cerrar, items, quitar, actualizarCantidad, actualizarTalla, vaciarCarrito }) {
  const [paso, setPaso] = useState("carrito"); // carrito | envio | confirmado
  const [envio, setEnvio] = useState({
    nombre: "",
    email: "",
    telefono: "",
    tipoDocumento: "CC",
    documento: "",
    direccion: "",
    ciudad: "Cartagena de Indias",
    departamento: "Bolívar",
    notas: "",
  });
  const [numeroPedido, setNumeroPedido] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const subtotal = items.reduce((acc, it) => acc + precioFinal(it.producto) * it.cantidad, 0);
  const inputStyle = { ...sans, border: `1px solid ${C.sand}` };

  const cerrarPanel = () => {
    cerrar();
    setTimeout(() => {
      if (paso === "confirmado") {
        setPaso("carrito");
        setNumeroPedido(null);
      }
    }, 300);
  };

  const confirmarPedido = async (e) => {
    e.preventDefault();
    if (!envio.nombre || !envio.email || !envio.telefono || !envio.documento || !envio.direccion) {
      alert("Completa nombre, correo, teléfono, documento y dirección de envío.");
      return;
    }
    setEnviando(true);

    try {
      const pedido = await crearPedido({ envio, items, subtotal });
      setNumeroPedido(pedido.numero_pedido);
      setPaso("confirmado");
      if (vaciarCarrito) vaciarCarrito();
    } catch (error) {
      console.error("Error creando el pedido:", error.message);
      alert(
        "Hubo un problema al registrar tu pedido. Intenta de nuevo en unos segundos.\n\n" +
          "Detalle técnico: " + error.message
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <div
        onClick={cerrarPanel}
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${abierto ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 flex flex-col transition-transform duration-300 ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: C.ivory }}
      >
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${C.sand}` }}>
          <div style={{ ...serif, color: C.ink }} className="text-xl">
            {paso === "carrito" && "Tu carrito"}
            {paso === "envio" && "Datos de envío"}
            {paso === "confirmado" && "Pedido confirmado"}
          </div>
          <button onClick={cerrarPanel} style={{ ...sans, color: C.inkSoft }} className="text-xl leading-none">×</button>
        </div>

        {paso === "carrito" && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
              {items.length === 0 && (
                <div style={{ ...sans, color: C.inkSoft }} className="text-sm text-center mt-16">
                  Aún no has añadido piezas.
                </div>
              )}
              {items.map((it, i) => {
                const stockTallaActual = it.producto.tallas?.[it.talla] ?? Infinity;
                const tallasDisponibles = Object.keys(it.producto.tallas || {});
                return (
                  <div key={i} className="flex gap-4">
                    <div className="w-20 h-24 overflow-hidden flex-shrink-0">
                      <img src={it.producto.img} alt={it.producto.nombre} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div style={{ ...serif, color: C.ink }} className="text-base leading-tight">{it.producto.nombre}</div>
                      <PriceTag producto={it.producto} />

                      {tallasDisponibles.length > 1 && (
                        <div className="flex items-center gap-1.5 mt-2 mb-1 flex-wrap">
                          {tallasDisponibles.map((t) => {
                            const stockT = it.producto.tallas[t];
                            const seleccionada = it.talla === t;
                            return (
                              <button
                                key={t}
                                disabled={stockT <= 0 && !seleccionada}
                                onClick={() => actualizarTalla(i, t)}
                                className="w-7 h-7 text-[10px] flex items-center justify-center"
                                style={{
                                  ...sans,
                                  border: `1px solid ${seleccionada ? C.earth : C.sand}`,
                                  color: stockT <= 0 && !seleccionada ? C.sand : seleccionada ? C.white : C.ink,
                                  backgroundColor: seleccionada ? C.earth : "transparent",
                                  opacity: stockT <= 0 && !seleccionada ? 0.4 : 1,
                                  textDecoration: stockT <= 0 && !seleccionada ? "line-through" : "none",
                                }}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {tallasDisponibles.length <= 1 && (
                        <div style={{ ...sans, color: C.inkSoft }} className="text-xs mb-1 mt-1">Talla {it.talla}</div>
                      )}

                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => actualizarCantidad(i, -1)} disabled={it.cantidad <= 1} className="w-6 h-6 text-xs disabled:opacity-30" style={{ border: `1px solid ${C.sand}`, color: C.ink }}>−</button>
                        <span style={{ ...sans }} className="text-sm">{it.cantidad}</span>
                        <button onClick={() => actualizarCantidad(i, 1)} disabled={it.cantidad >= stockTallaActual} className="w-6 h-6 text-xs disabled:opacity-30" style={{ border: `1px solid ${C.sand}`, color: C.ink }}>+</button>
                        <button onClick={() => quitar(i)} className="ml-auto text-[11px] uppercase tracking-wide underline" style={{ ...sans, color: C.inkSoft }}>Quitar</button>
                      </div>
                      {it.cantidad >= stockTallaActual && (
                        <div style={{ ...sans, color: C.inkSoft }} className="text-[11px] mt-1">
                          Máximo disponible en talla {it.talla}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-5" style={{ borderTop: `1px solid ${C.sand}` }}>
              <div className="flex items-center justify-between mb-4">
                <span style={{ ...sans, color: C.inkSoft }} className="text-sm uppercase tracking-wide">Subtotal</span>
                <span style={{ ...serif, color: C.ink }} className="text-xl">{formatCOP(subtotal)}</span>
              </div>
              <EarthButton className={`w-full ${items.length === 0 ? "opacity-50 pointer-events-none" : ""}`} onClick={() => setPaso("envio")}>
                Continuar con el envío
              </EarthButton>
            </div>
          </>
        )}

        {paso === "envio" && (
          <form onSubmit={confirmarPedido} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3">
              <div className="text-xs mb-1" style={{ ...sans, color: C.inkSoft }}>
                {items.length} {items.length === 1 ? "prenda" : "prendas"} · Subtotal {formatCOP(subtotal)}
              </div>

              <input placeholder="Nombre completo" value={envio.nombre} onChange={(e) => setEnvio({ ...envio, nombre: e.target.value })} className="px-3 py-2.5 text-sm outline-none" style={inputStyle} />
              <input type="email" placeholder="Correo electrónico" value={envio.email} onChange={(e) => setEnvio({ ...envio, email: e.target.value })} className="px-3 py-2.5 text-sm outline-none" style={inputStyle} />
              <input placeholder="Teléfono / WhatsApp" value={envio.telefono} onChange={(e) => setEnvio({ ...envio, telefono: e.target.value })} className="px-3 py-2.5 text-sm outline-none" style={inputStyle} />

              <div className="grid grid-cols-3 gap-2">
                <select value={envio.tipoDocumento} onChange={(e) => setEnvio({ ...envio, tipoDocumento: e.target.value })} className="col-span-1 px-2 py-2.5 text-sm outline-none" style={inputStyle}>
                  <option value="CC">C.C.</option>
                  <option value="CE">C.E.</option>
                  <option value="NIT">NIT</option>
                  <option value="PAS">Pasaporte</option>
                </select>
                <input placeholder="Número de documento" value={envio.documento} onChange={(e) => setEnvio({ ...envio, documento: e.target.value })} className="col-span-2 px-3 py-2.5 text-sm outline-none" style={inputStyle} />
              </div>

              <div className="text-[11px] uppercase tracking-wide mt-2" style={{ ...sans, color: C.inkSoft }}>Dirección de envío</div>
              <input placeholder="Dirección (calle, número, barrio)" value={envio.direccion} onChange={(e) => setEnvio({ ...envio, direccion: e.target.value })} className="px-3 py-2.5 text-sm outline-none" style={inputStyle} />
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Ciudad" value={envio.ciudad} onChange={(e) => setEnvio({ ...envio, ciudad: e.target.value })} className="px-3 py-2.5 text-sm outline-none" style={inputStyle} />
                <input placeholder="Departamento" value={envio.departamento} onChange={(e) => setEnvio({ ...envio, departamento: e.target.value })} className="px-3 py-2.5 text-sm outline-none" style={inputStyle} />
              </div>
              <textarea placeholder="Notas de entrega (opcional)" rows={2} value={envio.notas} onChange={(e) => setEnvio({ ...envio, notas: e.target.value })} className="px-3 py-2.5 text-sm outline-none" style={inputStyle} />
            </div>

            <div className="px-6 py-5 flex flex-col gap-2" style={{ borderTop: `1px solid ${C.sand}` }}>
              <EarthButton type="submit" className={`w-full ${enviando ? "opacity-50 pointer-events-none" : ""}`}>
                {enviando ? "Procesando..." : `Pagar ${formatCOP(subtotal)}`}
              </EarthButton>
              <button type="button" onClick={() => setPaso("carrito")} className="text-[11px] uppercase tracking-wide underline self-center" style={{ ...sans, color: C.inkSoft }}>
                ← Volver al carrito
              </button>
            </div>
          </form>
        )}

        {paso === "confirmado" && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
            <Star />
            <div style={{ ...serif, color: C.ink }} className="text-2xl mt-4 mb-2">¡Gracias, {envio.nombre.split(" ")[0]}!</div>
            <p style={{ ...sans, color: C.inkSoft }} className="text-sm mb-1">Tu pedido fue registrado con el número:</p>
            <div style={{ ...serif, color: C.earth }} className="text-xl mb-6">{numeroPedido}</div>
            <p style={{ ...sans, color: C.inkSoft }} className="text-xs mb-8">
              Te escribiremos a {envio.email} para confirmar el pago y coordinar el envío a {envio.ciudad}.
            </p>
            <EarthButton onClick={cerrarPanel}>Seguir comprando</EarthButton>
          </div>
        )}
      </aside>
    </>
  );
}
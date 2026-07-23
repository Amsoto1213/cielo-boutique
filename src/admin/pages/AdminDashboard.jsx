import React, { useState, useMemo } from "react";
import { C, serif, sans } from "../../styles/tokens";
import { Sello } from "../../components/common/Marca";
import { toggleActivoProducto, eliminarProductoPermanente, contarPedidosDeProducto, actualizarProducto } from "../../api/productos";
import { actualizarEstadoPedido } from "../../api/pedidos";
import { AdminTabla } from "../components/AdminTabla";
import { AdminFormNuevoProducto } from "../components/AdminFormNuevoProducto";
import { AdminPedidos } from "../components/AdminPedidos";
import { AdminContenido } from "../components/AdminContenido";
import { useToast } from "../../context/ToastContext";

export function AdminDashboard({ productos, setProductos, heroImg, setHeroImg, pedidos, setPedidos, onCerrarSesion }) {
  const { mostrarToast } = useToast();
  const [tab, setTab] = useState("lista");

  const categoriasExistentes = useMemo(
    () => Array.from(new Set(productos.map((p) => p.categoria))).sort(),
    [productos]
  );

  const agregar = (producto) => {
    setProductos((prev) => [producto, ...prev]);
    setTab("lista");
  };

  const toggleActivo = async (producto) => {
    const nuevoEstado = !producto.activo;
    try {
      await toggleActivoProducto(producto.id, nuevoEstado);
      setProductos((prev) => prev.map((p) => (p.id === producto.id ? { ...p, activo: nuevoEstado } : p)));
    } catch (error) {
      console.error("Error al cambiar el estado del producto:", error.message);
      mostrarToast("No se pudo actualizar el estado: " + error.message, "error");
    }
  };

  const eliminarPermanente = async (id) => {
    let cantidadPedidos;
    try {
      cantidadPedidos = await contarPedidosDeProducto(id);
    } catch (error) {
      mostrarToast("No se pudo verificar si el producto tiene pedidos asociados: " + error.message, "error");
      return;
    }

    if (cantidadPedidos > 0) {
      mostrarToast(
        `Este producto aparece en ${cantidadPedidos} pedido(s), así que no se puede eliminar de forma permanente ` +
          `(se perdería esa información del historial). Usa "Desactivar" en su lugar.`,
        "info",
        6000
      );
      return;
    }

    // La confirmación de "sí/no" se deja como diálogo nativo del navegador,
    // ya que un toast no puede bloquear la acción esperando una respuesta.
    if (!confirm("¿Eliminar este producto de forma permanente? No tiene pedidos asociados, pero esta acción no se puede deshacer.")) return;

    try {
      await eliminarProductoPermanente(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      mostrarToast("Producto eliminado permanentemente.", "success");
    } catch (error) {
      console.error("Error al eliminar:", error.message);
      mostrarToast("Hubo un error al intentar eliminar el producto: " + error.message, "error");
    }
  };

  // Guarda categoría, precio, descuento y stock por talla de un producto
  // existente. Devuelve true/false para que AdminTabla sepa si debe cerrar
  // el formulario de edición o dejarlo abierto para reintentar.
  const guardarEdicionProducto = async (id, cambios) => {
    try {
      await actualizarProducto({ id, ...cambios });
      setProductos((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                categoria: cambios.categoria,
                precio: Number(cambios.precio) || p.precio,
                descuento: Number(cambios.descuento) || 0,
                tallas: Object.fromEntries(
                  Object.entries(cambios.stockPorTalla).map(([t, v]) => [t, Number(v) || 0])
                ),
              }
            : p
        )
      );
      mostrarToast("Cambios guardados.", "success");
      return true;
    } catch (error) {
      console.error("Error al guardar los cambios del producto:", error.message);
      mostrarToast("No se pudieron guardar los cambios: " + error.message, "error");
      return false;
    }
  };

  const cambiarEstadoPedido = async (id, estado) => {
    const anterior = pedidos.find((p) => p.id === id)?.estado;
    setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado } : p)));

    try {
      await actualizarEstadoPedido(id, estado);
    } catch (error) {
      console.error("Error al actualizar estado del pedido:", error.message);
      mostrarToast("No se pudo actualizar el estado en el servidor: " + error.message, "error");
      setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado: anterior } : p)));
    }
  };

  const tabs = [
    { key: "lista", label: `Productos (${productos.length})` },
    { key: "nuevo", label: "+ Nuevo producto" },
    { key: "pedidos", label: `Pedidos (${pedidos.length})` },
    { key: "contenido", label: "Contenido del sitio" },
  ];

  return (
    <div style={{ backgroundColor: C.ivory }} className="min-h-screen px-6 md:px-10 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <Sello text="Panel privado" />
            <h1 className="text-2xl md:text-3xl mt-1" style={{ ...serif, color: C.ink }}>Gestión de inventario</h1>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="px-4 py-2 text-[12px] uppercase tracking-wide"
                  style={{ ...sans, backgroundColor: tab === t.key ? C.earth : "transparent", color: tab === t.key ? C.white : C.ink, border: `1px solid ${C.earth}` }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={onCerrarSesion} className="text-[11px] uppercase tracking-wide underline" style={{ ...sans, color: C.inkSoft }}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {tab === "lista" && (
          <AdminTabla
            productos={productos}
            categoriasExistentes={categoriasExistentes}
            onToggleActivo={toggleActivo}
            onEliminarPermanente={eliminarPermanente}
            onGuardarEdicion={guardarEdicionProducto}
          />
        )}
        {tab === "nuevo" && <AdminFormNuevoProducto onGuardar={agregar} categoriasExistentes={categoriasExistentes} />}
        {tab === "pedidos" && <AdminPedidos pedidos={pedidos} onCambiarEstado={cambiarEstadoPedido} />}
        {tab === "contenido" && <AdminContenido heroImg={heroImg} setHeroImg={setHeroImg} />}
      </div>
    </div>
  );
}

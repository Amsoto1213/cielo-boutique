import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { C, FONT_IMPORT, sans } from "../styles/tokens";
import { fetchProductos } from "../api/productos";
import { NavBar } from "../components/layout/NavBar";
import { Footer } from "../components/layout/Footer";
import { Carrito } from "../components/carrito/Carrito";
import { Home } from "./Home";
import { Catalogo } from "./Catalogo/Catalogo";
import { ProductoDetalle } from "./ProductoDetalle/ProductoDetalle";
import { Contacto } from "./Contacto/Contacto";
import { useToast } from "../context/ToastContext";

// Tienda pública — se monta en "/" y sus subrutas internas.
export function Tienda() {
  const { mostrarToast } = useToast();
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [carritoItems, setCarritoItems] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  useEffect(() => {
    fetchProductos().then((data) => {
      setProductos(data);
      setCargando(false);
    });
  }, []);

  // Añade un producto al carrito con una talla y cantidad específicas.
  // Si ya existe una línea con el mismo producto+talla, suma la cantidad
  // (sin pasarse del stock disponible para esa talla).
  const agregarAlCarrito = (producto, talla, cantidad = 1) => {
    const tallaFinal = talla || Object.keys(producto.tallas)[0];
    const stockTalla = producto.tallas?.[tallaFinal] ?? Infinity;
    const cantidadFinal = Math.max(1, cantidad);

    setCarritoItems((prev) => {
      const idx = prev.findIndex((it) => it.producto.id === producto.id && it.talla === tallaFinal);
      if (idx >= 0) {
        const copia = [...prev];
        const nuevaCantidad = Math.min(stockTalla, copia[idx].cantidad + cantidadFinal);
        copia[idx] = { ...copia[idx], cantidad: nuevaCantidad };
        return copia;
      }
      return [...prev, { producto, talla: tallaFinal, cantidad: Math.min(stockTalla, cantidadFinal) }];
    });
    setCarritoAbierto(true);
  };

  const quitarDelCarrito = (i) => setCarritoItems((prev) => prev.filter((_, idx) => idx !== i));

  // Cambia la cantidad de una línea del carrito sin pasarse del stock
  // disponible para la talla actual de esa línea.
  const actualizarCantidad = (i, delta) =>
    setCarritoItems((prev) =>
      prev.map((it, idx) => {
        if (idx !== i) return it;
        const stockDisponible = it.producto.tallas?.[it.talla] ?? Infinity;
        const nuevaCantidad = Math.min(stockDisponible, Math.max(1, it.cantidad + delta));
        return { ...it, cantidad: nuevaCantidad };
      })
    );

  // Cambia la talla de una línea del carrito directamente desde el
  // panel del carrito, ajustando la cantidad si la nueva talla tiene
  // menos stock que la cantidad actual.
  const actualizarTalla = (i, nuevaTalla) =>
    setCarritoItems((prev) => {
      const item = prev[i];
      if (!item || item.talla === nuevaTalla) return prev;

      const yaExiste = prev.some(
        (it, idx) => idx !== i && it.producto.id === item.producto.id && it.talla === nuevaTalla
      );
      if (yaExiste) {
        mostrarToast(
          `Ya tienes la talla ${nuevaTalla} de ${item.producto.nombre} en tu carrito. Ajusta la cantidad en esa línea en vez de cambiar esta.`,
          "info"
        );
        return prev;
      }

      const stockNuevaTalla = item.producto.tallas?.[nuevaTalla] ?? 0;
      if (stockNuevaTalla <= 0) return prev;

      const cantidadAjustada = Math.min(item.cantidad, stockNuevaTalla);
      const copia = [...prev];
      copia[i] = { ...item, talla: nuevaTalla, cantidad: cantidadAjustada };
      return copia;
    });

  const vaciarCarrito = () => setCarritoItems([]);

  const carritoCount = carritoItems.reduce((a, it) => a + it.cantidad, 0);

  return (
    <div style={{ backgroundColor: C.white, minHeight: "100vh" }}>
      <style>{FONT_IMPORT}</style>

      <NavBar carritoCount={carritoCount} setCarritoAbierto={setCarritoAbierto} />

      {cargando ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <span style={{ ...sans, color: C.inkSoft }} className="text-sm uppercase tracking-wide">
            Cargando colección...
          </span>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<><Home productos={productos} onAdd={agregarAlCarrito} /><Footer /></>} />
          <Route path="/catalogo" element={<><Catalogo productos={productos} onAdd={agregarAlCarrito} /><Footer /></>} />
          <Route path="/producto/:id" element={<><ProductoDetalle onAdd={agregarAlCarrito} /><Footer /></>} />
          <Route path="/contacto" element={<><Contacto /><Footer /></>} />
        </Routes>
      )}

      <Carrito
        abierto={carritoAbierto}
        cerrar={() => setCarritoAbierto(false)}
        items={carritoItems}
        quitar={quitarDelCarrito}
        actualizarCantidad={actualizarCantidad}
        actualizarTalla={actualizarTalla}
        vaciarCarrito={vaciarCarrito}
      />
    </div>
  );
}

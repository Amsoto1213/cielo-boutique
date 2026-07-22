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

// Tienda pública — se monta en "/" y sus subrutas internas.
export function Tienda() {
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

  const agregarAlCarrito = (producto, talla, cantidad) => {
    const tallaFinal = talla || Object.keys(producto.tallas)[0];
    const stockTalla = producto.tallas?.[tallaFinal] ?? Infinity;
    const cantidadFinal = Math.max(1, cantidad || 1);
    setCarritoItems((prev) => {
      const idx = prev.findIndex((it) => it.producto.id === producto.id && it.talla === tallaFinal);
      if (idx >= 0) {
        const copia = [...prev];
        copia[idx] = { ...copia[idx], cantidad: copia[idx].cantidad + 1 };
        return copia;
      }
      return [...prev, { producto, talla: tallaFinal, cantidad: Math.min(stockTalla, cantidadFinal) }];
    });
    setCarritoAbierto(true);
  };

  const quitarDelCarrito = (i) => setCarritoItems((prev) => prev.filter((_, idx) => idx !== i));
  const actualizarCantidad = (i, delta) =>
    setCarritoItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, cantidad: Math.max(1, it.cantidad + delta) } : it)));
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
        vaciarCarrito={vaciarCarrito}
      />
    </div>
  );
}

import React, { useState, useMemo } from "react";
import { crearProducto } from "../../api/productos";
import { useToast } from "../../context/ToastContext";

const inputStyle = { fontFamily: "'Jost', sans-serif", border: `1px solid #E8DCC2` };
const OTRA = "__otra__";

export function AdminFormNuevoProducto({ onGuardar, categoriasExistentes = [] }) {
  const { mostrarToast } = useToast();
  const vacio = {
    nombre: "",
    categoria: "",
    descripcion: "",
    precio: "",
    descuento: "",
    tallasActivas: [],
    stockPorTalla: {},
  };
  const [form, setForm] = useState(vacio);
  const [archivos, setArchivos] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [escribiendoOtra, setEscribiendoOtra] = useState(false);

  // Combina las categorías que ya existen en tus productos con las 4 de
  // referencia, para que el select siempre esté al día sin tocar código.
  const opcionesCategoria = useMemo(() => {
    const base = ["Vestidos", "Sastrería", "Punto", "Accesorios"];
    return Array.from(new Set([...base, ...categoriasExistentes])).sort();
  }, [categoriasExistentes]);

  const manejarImagenes = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const nuevosArchivos = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setArchivos((prev) => [...prev, ...nuevosArchivos]);
  };

  const quitarArchivo = (index) => {
    setArchivos((prev) => {
      const nuevo = [...prev];
      URL.revokeObjectURL(nuevo[index].previewUrl);
      nuevo.splice(index, 1);
      return nuevo;
    });
  };

  const toggleTalla = (t) => {
    setForm((prev) => {
      const activas = prev.tallasActivas.includes(t)
        ? prev.tallasActivas.filter((x) => x !== t)
        : [...prev.tallasActivas, t];
      return { ...prev, tallasActivas: activas };
    });
  };

  const setStock = (t, val) => {
    setForm((prev) => ({ ...prev, stockPorTalla: { ...prev.stockPorTalla, [t]: Number(val) } }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.precio || !form.categoria || archivos.length === 0) {
      mostrarToast("Por favor completa nombre, categoría, precio y selecciona al menos una foto de tu PC.", "error");
      return;
    }
    setSubiendo(true);
    try {
      const productoFinal = await crearProducto({ form, archivos });
      onGuardar(productoFinal);
      setForm(vacio);
      setEscribiendoOtra(false);
      archivos.forEach((a) => URL.revokeObjectURL(a.previewUrl));
      setArchivos([]);
      mostrarToast("Producto creado exitosamente", "success");
    } catch (error) {
      console.error(error);
      mostrarToast("Hubo un error al guardar: " + error.message, "error");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <form onSubmit={submit} className="p-8" style={{ backgroundColor: "#FFFFFF", border: `1px solid #E8DCC2` }}>
      <div style={{ fontFamily: "'Playfair Display', serif", color: "#2A241D" }} className="text-xl mb-6">
        Añadir nueva prenda
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-[11px] uppercase tracking-wide block mb-1" style={{ fontFamily: "'Jost', sans-serif", color: "#5C5245" }}>Nombre</label>
          <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle} />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wide block mb-1" style={{ fontFamily: "'Jost', sans-serif", color: "#5C5245" }}>Categoría</label>
          {!escribiendoOtra ? (
            <select
              value={form.categoria}
              onChange={(e) => {
                if (e.target.value === OTRA) {
                  setEscribiendoOtra(true);
                  setForm({ ...form, categoria: "" });
                } else {
                  setForm({ ...form, categoria: e.target.value });
                }
              }}
              className="w-full px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
            >
              <option value="" disabled>Selecciona una categoría</option>
              {opcionesCategoria.map((c) => <option key={c} value={c}>{c}</option>)}
              <option value={OTRA}>+ Otra categoría...</option>
            </select>
          ) : (
            <div className="flex gap-2">
              <input
                autoFocus
                placeholder="Nombre de la nueva categoría"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="w-full px-3 py-2.5 text-sm outline-none"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => { setEscribiendoOtra(false); setForm({ ...form, categoria: "" }); }}
                className="text-[11px] uppercase tracking-wide underline whitespace-nowrap"
                style={{ fontFamily: "'Jost', sans-serif", color: "#5C5245" }}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="text-[11px] uppercase tracking-wide block mb-1" style={{ fontFamily: "'Jost', sans-serif", color: "#5C5245" }}>Descripción</label>
        <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={3} className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-[11px] uppercase tracking-wide block mb-1" style={{ fontFamily: "'Jost', sans-serif", color: "#5C5245" }}>Precio (COP)</label>
          <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle} />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wide block mb-1" style={{ fontFamily: "'Jost', sans-serif", color: "#5C5245" }}>% Descuento (opcional)</label>
          <input type="number" min="0" max="100" value={form.descuento} onChange={(e) => setForm({ ...form, descuento: e.target.value })} className="w-full px-3 py-2.5 text-sm outline-none" style={inputStyle} />
        </div>
      </div>

      <div className="mb-6">
        <label className="text-[11px] uppercase tracking-wide block mb-2" style={{ fontFamily: "'Jost', sans-serif", color: "#5C5245" }}>Fotos del producto</label>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {archivos.map((archivo, index) => (
            <div key={index} className="relative w-20 h-24 flex-shrink-0">
              <img src={archivo.previewUrl} alt="preview" className="w-full h-full object-cover rounded border" />
              <button type="button" onClick={() => quitarArchivo(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
            </div>
          ))}
          <label className="w-20 h-24 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:bg-gray-50 flex-shrink-0">
            <span className="text-2xl text-gray-400">+</span>
            <input type="file" multiple accept="image/*" onChange={manejarImagenes} className="hidden" />
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-[11px] uppercase tracking-wide block mb-2" style={{ fontFamily: "'Jost', sans-serif", color: "#5C5245" }}>Tallas y stock</label>
        <div className="flex flex-wrap gap-3">
          {["XS", "S", "M", "L", "XL"].map((t) => {
            const activa = form.tallasActivas.includes(t);
            return (
              <div key={t} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleTalla(t)}
                  className="w-10 h-10 text-xs"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    border: `1px solid ${activa ? "#B88A5E" : "#E8DCC2"}`,
                    backgroundColor: activa ? "#B88A5E" : "transparent",
                    color: activa ? "#FFFFFF" : "#2A241D",
                  }}
                >
                  {t}
                </button>
                {activa && (
                  <input type="number" min={0} value={form.stockPorTalla[t] ?? 0} onChange={(e) => setStock(t, e.target.value)} className="w-16 px-2 py-2 text-xs outline-none" style={inputStyle} placeholder="Stock" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button type="submit" disabled={subiendo} className={`w-full py-3 text-[12px] uppercase tracking-[0.16em] text-white bg-[#B88A5E] ${subiendo ? "opacity-50" : "hover:opacity-85"}`}>
        {subiendo ? "Subiendo fotos y guardando..." : "Guardar producto"}
      </button>
    </form>
  );
}
 
// AdminContenido.jsx
import React, { useState, useEffect } from "react";
import { subirImagenHero, obtenerImagenesHeroCarousel, eliminarImagenHero } from "../../api/contenidoSitio";

export function AdminContenido() {
  const [imagenes, setImagenes] = useState([]);
  const [subiendo, setSubiendo] = useState(false);

  // Cargar las imágenes al inicio
  useEffect(() => {
    cargarImagenes();
  }, []);

  const cargarImagenes = async () => {
    try {
      const data = await obtenerImagenesHeroCarousel();
      setImagenes(data);
    } catch (error) {
      console.error("Error al cargar imágenes:", error);
    }
  };

  const manejarSubida = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setSubiendo(true);
    try {
      // Subir múltiples archivos en paralelo
      await Promise.all(files.map(file => subirImagenHero(file)));
      await cargarImagenes();
      alert("Imágenes subidas con éxito.");
    } catch (error) {
      alert("Hubo un error al subir: " + error.message);
    } finally {
      setSubiendo(false);
    }
  };

  const manejarEliminacion = async (nombreArchivo) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta imagen?")) return;
    
    try {
      await eliminarImagenHero(nombreArchivo);
      await cargarImagenes();
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
  };

  return (
    <div className="p-8 mb-8 bg-white border border-[#E8DCC2]">
      <h2 className="text-xl mb-4 font-serif text-[#2A241D]">Diseño del Sitio Web</h2>
      <p className="text-xs mb-6 uppercase tracking-wider text-[#5C5245] font-sans">
        Administrar imágenes del Carrusel Principal (Hero)
      </p>

      <div className="mb-6">
        <label className={`inline-block px-6 py-3 text-[11px] uppercase tracking-[0.16em] text-white bg-[#B88A5E] cursor-pointer transition-all ${subiendo ? "opacity-50 pointer-events-none" : "hover:opacity-85"}`}>
          {subiendo ? "Subiendo..." : "Agregar Imágenes al Carrusel"}
          {/* Permite seleccionar múltiples archivos */}
          <input type="file" accept="image/*" multiple onChange={manejarSubida} className="hidden" disabled={subiendo} />
        </label>
      </div>

      <span className="text-[11px] uppercase tracking-wide block mb-4 text-gray-400 font-medium">Imágenes Actuales en el Servidor:</span>
      
      {imagenes.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagenes.map((img, index) => (
            <div key={index} className="relative group border bg-gray-50 aspect-[3/4]">
              <img src={img.url} alt={`Hero ${index}`} className="w-full h-full object-cover" />
              <button 
                onClick={() => manejarEliminacion(img.name)}
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-32 border-2 border-dashed flex items-center justify-center text-sm text-gray-400">
          No hay ninguna imagen asignada en el carrusel
        </div>
      )}
    </div>
  );
}
// api/contenidoSitio.js
import { supabase } from "../lib/supabaseClient";

// Función para subir una nueva imagen al carrusel
export async function subirImagenHero(file) {
  const fileExt = file.name.split(".").pop();
  // Usamos un timestamp y un número aleatorio para evitar nombres duplicados
  const fileName = `hero_${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from("contenido").upload(fileName, file);
  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage.from("contenido").getPublicUrl(fileName);
  return { name: fileName, url: publicUrl };
}

// Función para obtener TODAS las imágenes del carrusel
export async function obtenerImagenesHeroCarousel() {
  const { data: archivos, error } = await supabase.storage
    .from("contenido")
    .list("", { limit: 20, sortBy: { column: "created_at", order: "desc" } });

  if (error) throw error;

  // Filtramos solo las que son del hero
  const heroFiles = archivos?.filter((f) => f.name.startsWith("hero_")) || [];
  
  return heroFiles.map(file => {
    const { data } = supabase.storage.from("contenido").getPublicUrl(file.name);
    return { name: file.name, url: data.publicUrl };
  });
}

// Función para eliminar una imagen específica
export async function eliminarImagenHero(nombreArchivo) {
  const { error } = await supabase.storage.from("contenido").remove([nombreArchivo]);
  if (error) throw error;
  return true;
}
import { supabase } from "../lib/supabaseClient";

// Trae los productos ACTIVOS para la tienda pública (home, catálogo,
// sugerencias). Los productos desactivados nunca aparecen aquí.
export async function fetchProductos() {
  const { data, error } = await supabase
    .from("productos")
    .select("*, producto_tallas(talla, stock)")
    .eq("activo", true)
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("Error cargando productos:", error.message);
    return [];
  }

  return data.map(mapearProducto);
}

// Trae TODOS los productos (activos e inactivos) para el panel admin.
export async function fetchProductosAdmin() {
  const { data, error } = await supabase
    .from("productos")
    .select("*, producto_tallas(talla, stock)")
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("Error cargando productos (admin):", error.message);
    return [];
  }

  return data.map(mapearProducto);
}

function mapearProducto(p) {
  const tallas = {};
  (p.producto_tallas || []).forEach((t) => { tallas[t.talla] = t.stock; });
  return {
    id: p.id,
    nombre: p.nombre,
    categoria: p.categoria,
    descripcion: p.descripcion,
    precio: p.precio,
    descuento: p.descuento,
    img: p.img,
    activo: p.activo,
    tallas,
  };
}

export async function fetchProductoPorId(id) {
  const { data, error } = await supabase
    .from("productos")
    .select(`*, producto_tallas(*), producto_imagenes(*)`)
    .eq("id", id)
    .single();

  if (error) throw error;

  if (data && data.producto_imagenes) {
    data.producto_imagenes.sort((a, b) => (a.orden || 0) - (b.orden || 0));
  }
  return data;
}

// Solo sugiere productos activos.
export async function fetchSugeridos(categoria, idActual) {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("categoria", categoria)
    .eq("activo", true)
    .neq("id", idActual)
    .limit(4);

  if (error) {
    console.error("Error cargando sugerencias:", error.message);
    return [];
  }
  return data;
}

// Cuántas veces aparece este producto en pedidos ya realizados.
export async function contarPedidosDeProducto(productoId) {
  const { count, error } = await supabase
    .from("pedido_items")
    .select("id", { count: "exact", head: true })
    .eq("producto_id", productoId);

  if (error) throw error;
  return count || 0;
}

// Activa / desactiva un producto (soft delete).
export async function toggleActivoProducto(id, activo) {
  const { error } = await supabase.from("productos").update({ activo }).eq("id", id);
  if (error) throw error;
}

// Elimina el producto DE VERDAD, incluyendo sus fotos del Storage.
// El llamador debe verificar antes con contarPedidosDeProducto().
export async function eliminarProductoPermanente(id) {
  const { data: prod, error: errorFetch } = await supabase
    .from("productos")
    .select("img, producto_imagenes(url)")
    .eq("id", id)
    .single();

  if (!errorFetch && prod) {
    const archivosAEliminar = [];

    if (prod.img && prod.img.includes("/storage/v1/object/public/productos/")) {
      archivosAEliminar.push(prod.img.split("/").pop());
    }
    (prod.producto_imagenes || []).forEach((imgObj) => {
      if (imgObj.url && imgObj.url.includes("/storage/v1/object/public/productos/")) {
        archivosAEliminar.push(imgObj.url.split("/").pop());
      }
    });

    if (archivosAEliminar.length > 0) {
      const { error: storageError } = await supabase.storage.from("productos").remove(archivosAEliminar);
      if (storageError) {
        console.error("Aviso: no se pudieron borrar algunos archivos del Storage:", storageError.message);
      }
    }
  }

  const { error: deleteError } = await supabase.from("productos").delete().eq("id", id);
  if (deleteError) throw deleteError;
}

// Actualiza los datos editables de un producto ya existente: categoría
// (por ejemplo, ponerlo en "Novedades"), precio, descuento, y la cantidad
// disponible en cada una de sus tallas actuales.
export async function actualizarProducto({ id, categoria, precio, descuento, stockPorTalla }) {
  const { error: errorProducto } = await supabase
    .from("productos")
    .update({
      categoria,
      precio: Number(precio),
      descuento: Number(descuento) || 0,
    })
    .eq("id", id);

  if (errorProducto) throw errorProducto;

  const entradas = Object.entries(stockPorTalla || {});
  for (const [talla, stock] of entradas) {
    const { error: errorTalla } = await supabase
      .from("producto_tallas")
      .update({ stock: Number(stock) || 0 })
      .eq("producto_id", id)
      .eq("talla", talla);

    if (errorTalla) throw errorTalla;
  }
}

export async function crearProducto({ form, archivos }) {
  const urlsSubidas = [];
  for (const item of archivos) {
    const fileExt = item.file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("productos").upload(fileName, item.file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from("productos").getPublicUrl(fileName);
    urlsSubidas.push(publicUrl);
  }

  const imgPortada = urlsSubidas[0];

  const { data: nuevoProducto, error: errorProducto } = await supabase
    .from("productos")
    .insert({
      nombre: form.nombre,
      categoria: form.categoria,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      descuento: Number(form.descuento) || 0,
      img: imgPortada,
    })
    .select()
    .single();

  if (errorProducto) throw errorProducto;

  const tallasInsertar = form.tallasActivas.map((talla) => ({
    producto_id: nuevoProducto.id,
    talla,
    stock: Number(form.stockPorTalla[talla]) || 0,
  }));
  if (tallasInsertar.length > 0) {
    await supabase.from("producto_tallas").insert(tallasInsertar);
  }

  if (urlsSubidas.length > 0) {
    const imagenesInsertar = urlsSubidas.map((url, index) => ({
      producto_id: nuevoProducto.id,
      url,
      orden: index,
    }));
    const { error: errorImagenes } = await supabase.from("producto_imagenes").insert(imagenesInsertar);
    if (errorImagenes) throw errorImagenes;
  }

  return {
    id: nuevoProducto.id,
    nombre: nuevoProducto.nombre,
    categoria: nuevoProducto.categoria,
    descripcion: nuevoProducto.descripcion,
    precio: nuevoProducto.precio,
    descuento: nuevoProducto.descuento,
    img: nuevoProducto.img,
    activo: true,
    tallas: form.stockPorTalla,
    imagenes: urlsSubidas,
  };
}
import { supabase } from "../lib/supabaseClient";
import { precioFinal } from "../utils/format";

function generarNumeroPedido() {
  return "CB-" + Math.floor(100000 + Math.random() * 900000);
}

export async function crearPedido({ envio, items, subtotal }) {
  const numeroPedido = generarNumeroPedido();

  // 1. Crear el pedido principal
  const { data: pedido, error: errorPedido } = await supabase
    .from("pedidos")
    .insert({
      numero_pedido: numeroPedido,
      cliente_nombre: envio.nombre,
      cliente_email: envio.email,
      telefono: envio.telefono,
      tipo_documento: envio.tipoDocumento,
      documento: envio.documento,
      direccion: envio.direccion,
      ciudad: envio.ciudad,
      departamento: envio.departamento,
      notas_envio: envio.notas,
      total: subtotal,
      estado: "pendiente",
    })
    .select()
    .single();

  if (errorPedido) throw errorPedido;

  // 2. Insertar los items del pedido
  const itemsInsertar = items.map((it) => ({
    pedido_id: pedido.id,
    producto_id: it.producto.id,
    talla: it.talla,
    cantidad: it.cantidad,
    precio_unitario: precioFinal(it.producto),
  }));

  const { error: errorItems } = await supabase.from("pedido_items").insert(itemsInsertar);
  if (errorItems) throw errorItems;

  // ====================================================================
  // Descontar stock — por TALLA, en producto_tallas (no un "stock" plano
  // en productos, ya que cada talla tiene su propio inventario).
  // ====================================================================
  try {
    for (const it of items) {
      const { data: tallaDb, error: errorConsulta } = await supabase
        .from("producto_tallas")
        .select("id, stock")
        .eq("producto_id", it.producto.id)
        .eq("talla", it.talla)
        .single();

      if (!errorConsulta && tallaDb) {
        const nuevoStock = Math.max(0, tallaDb.stock - it.cantidad);
        await supabase.from("producto_tallas").update({ stock: nuevoStock }).eq("id", tallaDb.id);
      } else if (errorConsulta) {
        console.error(`No se pudo leer el stock de ${it.producto.nombre} talla ${it.talla}:`, errorConsulta.message);
      }
    }
  } catch (errorStock) {
    console.error("Error al descontar el stock:", errorStock);
  }
  // ====================================================================

  // ====================================================================
  // Notificación por correo del nuevo pedido
  // ====================================================================
  try {
    const resumenProductos = items.map(it =>
      `${it.cantidad}x ${it.producto.nombre || 'Producto'} (Talla: ${it.talla}) - $${precioFinal(it.producto)}`
    ).join('\n');

    await fetch("https://formsubmit.co/ajax/sotoromerostores@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        "Número de Pedido": numeroPedido,
        "Cliente": envio.nombre,
        "Cédula/Documento": `${envio.tipoDocumento} ${envio.documento}`,
        "Email": envio.email,
        "Teléfono": envio.telefono,
        "Dirección de Envío": `${envio.direccion}, ${envio.ciudad}, ${envio.departamento}`,
        "Notas del Cliente": envio.notas || "Ninguna",
        "Productos": resumenProductos,
        "Total de la Compra": `$${subtotal}`,
        _subject: `¡Nuevo Pedido! ${numeroPedido} - ${envio.nombre}`,
        _template: "table",
        _captcha: "false"
      }),
    });
  } catch (errorCorreo) {
    console.error("El pedido se guardó, pero falló el envío del correo:", errorCorreo);
  }

  return pedido;
}

export async function fetchPedidos() {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*, pedido_items(*, productos(nombre))")
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("Error cargando pedidos:", error.message);
    return [];
  }

  return data.map((p) => ({
    ...p,
    items: (p.pedido_items || []).map((it) => ({
      nombre: it.productos?.nombre || "Producto eliminado",
      talla: it.talla,
      cantidad: it.cantidad,
    })),
  }));
}

export async function actualizarEstadoPedido(id, estado) {
  const { error } = await supabase.from("pedidos").update({ estado }).eq("id", id);
  if (error) throw error;
}

export const CATEGORIAS = ["Vestidos", "Sastrería", "Punto", "Accesorios"];
export const TALLAS = ["XS", "S", "M", "L", "XL"];

// Contenido editorial genérico por categoría, usado en la página de detalle
// de producto. En producción podría venir de un campo "detalles" propio
// de cada producto en la tabla `productos` de Supabase.
export const DETALLES_POR_CATEGORIA = {
  Vestidos: ["95% viscosa, 5% elastano", "Lavado a mano, no usar secadora", "Hecho en taller propio, Cartagena"],
  "Sastrería": ["100% lino / algodón peinado", "Planchar a temperatura media", "Corte estructurado, ajuste regular"],
  Punto: ["70% algodón, 30% lana merino", "Lavado en frío, secar en plano", "Punto trenzado hecho a mano"],
  Accesorios: ["Cuero curtido vegetal", "Limpiar con paño seco", "Herraje en tono dorado mate"],
};

export const ESTADOS_PEDIDO = ["pendiente", "enviado", "cancelado"];

export const ESTADO_COLOR = {
  pendiente: "#B88A5E",
  pagado: "#D4AF37",
  enviado: "#4B7A63",
  cancelado: "#B3452F",
};

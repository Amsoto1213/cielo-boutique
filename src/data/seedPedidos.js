// Pedidos de ejemplo — usados como estado inicial del panel admin
// mientras la tabla `pedidos` de Supabase no esté conectada.
// En producción, reemplazar por:
//   supabase.from("pedidos").select("*, pedido_items(*, productos(nombre))")
export const seedPedidos = [
  {
    id: "CB-482913",
    cliente_nombre: "Valeria Ospino",
    cliente_email: "valeria.o@example.com",
    telefono: "+57 300 123 4567",
    direccion: "Calle 24 #6-15, Getsemaní",
    ciudad: "Cartagena de Indias",
    departamento: "Bolívar",
    total: 1890000,
    estado: "pendiente",
    creado_en: "2026-07-03T14:20:00",
    items: [
      { nombre: "Vestido Marea", talla: "M", cantidad: 1 },
      { nombre: "Cinturón Meridiano", talla: "M", cantidad: 1 },
    ],
  },
  {
    id: "CB-471205",
    cliente_nombre: "Camila Redondo",
    cliente_email: "camila.r@example.com",
    telefono: "+57 301 555 8899",
    direccion: "Carrera 3 #45-10, Bocagrande",
    ciudad: "Cartagena de Indias",
    departamento: "Bolívar",
    total: 1062500,
    estado: "pagado",
    creado_en: "2026-07-01T09:05:00",
    items: [{ nombre: "Blazer Duna", talla: "S", cantidad: 1 }],
  },
  {
    id: "CB-460877",
    cliente_nombre: "Juan Pablo Herrera",
    cliente_email: "jp.herrera@example.com",
    telefono: "+57 315 220 3344",
    direccion: "Transversal 52 #29-40",
    ciudad: "Barranquilla",
    departamento: "Atlántico",
    total: 650000,
    estado: "enviado",
    creado_en: "2026-06-27T18:40:00",
    items: [{ nombre: "Pantalón Bruma", talla: "M", cantidad: 1 }],
  },
];

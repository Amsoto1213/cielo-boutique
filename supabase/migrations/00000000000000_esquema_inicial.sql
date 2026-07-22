-- Esquema de referencia para Cielo Boutique.
-- Ajusta nombres/tipos exactos a lo que ya exista en tu proyecto Supabase;
-- este archivo es el punto de partida para versionar tu base de datos
-- junto con el código (en vez de tenerlo solo "en la nube").

create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  categoria text not null,
  descripcion text,
  precio integer not null,
  descuento integer default 0,
  img text,
  creado_en timestamptz default now()
);

create table if not exists producto_tallas (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid references productos(id) on delete cascade,
  talla text not null,
  stock integer default 0
);

create table if not exists producto_imagenes (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid references productos(id) on delete cascade,
  url text not null,
  orden integer default 0
);

create table if not exists pedidos (
  id text primary key,
  cliente_nombre text not null,
  cliente_email text not null,
  telefono text,
  tipo_documento text,
  documento text,
  direccion text,
  ciudad text,
  departamento text,
  notas_envio text,
  total integer not null,
  estado text default 'pendiente',
  creado_en timestamptz default now()
);

create table if not exists pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id text references pedidos(id) on delete cascade,
  producto_id uuid references productos(id),
  talla text,
  cantidad integer default 1,
  precio_unitario integer
);

create table if not exists contenido_sitio (
  clave text primary key,
  valor text,
  actualizado_en timestamptz default now()
);

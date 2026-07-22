# Supabase — "backend" de Cielo Boutique

Este proyecto usa Supabase como backend-as-a-service: base de datos Postgres,
autenticación del panel admin, y storage para imágenes. No hay un servidor
Node/Express propio — Supabase cumple ese rol.

## Estructura

- `migrations/` — SQL versionado de las tablas (productos, producto_tallas,
  producto_imagenes, pedidos, pedido_items, contenido_sitio).
- Buckets de Storage usados por el frontend: `productos` (fotos de prendas)
  y `contenido` (imagen hero / contenido editorial del sitio).

## Flujo recomendado

1. Instala la CLI de Supabase: `npm install -g supabase`
2. Vincula tu proyecto: `supabase link --project-ref <tu-project-ref>`
3. Trae el esquema actual (si ya existe en la nube) a este repo:
   `supabase db pull`
4. De ahora en adelante, cualquier cambio de esquema se hace como una
   nueva migración: `supabase migration new nombre_del_cambio`, editas el
   SQL generado, y lo aplicas con `supabase db push`.

Esto te da historial y control de versiones sobre tu base de datos, igual
que con el código del frontend.

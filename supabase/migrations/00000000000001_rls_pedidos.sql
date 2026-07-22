-- Habilita seguridad a nivel de fila para pedidos y sus items, y define
-- quién puede hacer qué:
--
--   * Cualquier visitante (rol "anon", es decir, el checkout público)
--     puede CREAR un pedido y sus items, pero no puede leerlos ni
--     modificarlos después.
--   * Solo un usuario autenticado (el admin que inició sesión en /admin)
--     puede LEER y ACTUALIZAR el estado de los pedidos.
--
-- Sin estas políticas, Supabase bloquea todo acceso por defecto en cuanto
-- se activa RLS, así que este paso es obligatorio para que el checkout
-- y el panel de pedidos funcionen.

alter table pedidos enable row level security;
alter table pedido_items enable row level security;

create policy "Cualquiera puede crear pedidos"
  on pedidos
  for insert
  to anon, authenticated
  with check (true);

create policy "Cualquiera puede crear items de pedido"
  on pedido_items
  for insert
  to anon, authenticated
  with check (true);

create policy "Solo admin puede ver pedidos"
  on pedidos
  for select
  to authenticated
  using (true);

create policy "Solo admin puede ver items de pedido"
  on pedido_items
  for select
  to authenticated
  using (true);

create policy "Solo admin puede actualizar pedidos"
  on pedidos
  for update
  to authenticated
  using (true)
  with check (true);
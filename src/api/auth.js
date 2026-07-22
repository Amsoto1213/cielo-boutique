import { supabase } from "../lib/supabaseClient";

export async function iniciarSesionAdmin(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function cerrarSesionAdmin() {
  return supabase.auth.signOut();
}

export async function obtenerSesionActual() {
  return supabase.auth.getSession();
}

export function suscribirseACambiosDeSesion(callback) {
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => listener.subscription.unsubscribe();
}

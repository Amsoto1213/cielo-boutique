import React, { useState, useEffect } from "react";
import { C, FONT_IMPORT, sans } from "../styles/tokens";
import { fetchProductosAdmin } from "../api/productos";
import { fetchPedidos } from "../api/pedidos";
import { obtenerSesionActual, suscribirseACambiosDeSesion, cerrarSesionAdmin } from "../api/auth";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";

// Montado solo en "/admin", invisible desde la tienda pública.
export function Admin() {
  const [productos, setProductos] = useState([]);
  const [heroImg, setHeroImg] = useState("https://picsum.photos/seed/cielo-hero/1600/800");
  const [pedidos, setPedidos] = useState([]);
  const [adminLogueado, setAdminLogueado] = useState(false);
  const [verificandoSesion, setVerificandoSesion] = useState(true);

  useEffect(() => {
    obtenerSesionActual().then(({ data }) => {
      setAdminLogueado(!!data.session);
      setVerificandoSesion(false);
    });

    const unsubscribe = suscribirseACambiosDeSesion((session) => setAdminLogueado(!!session));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (adminLogueado) {
      fetchProductosAdmin().then(setProductos);
      fetchPedidos().then(setPedidos);
    }
  }, [adminLogueado]);

  const cerrarSesion = async () => {
    await cerrarSesionAdmin();
    setAdminLogueado(false);
  };

  if (verificandoSesion) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.ivory }}>
        <span style={{ ...sans, color: C.inkSoft }} className="text-sm uppercase tracking-wide">Verificando sesión...</span>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: C.white, minHeight: "100vh" }}>
      <style>{FONT_IMPORT}</style>
      {adminLogueado ? (
        <AdminDashboard
          productos={productos}
          setProductos={setProductos}
          heroImg={heroImg}
          setHeroImg={setHeroImg}
          pedidos={pedidos}
          setPedidos={setPedidos}
          onCerrarSesion={cerrarSesion}
        />
      ) : (
        <AdminLogin onLogin={() => setAdminLogueado(true)} />
      )}
    </div>
  );
}
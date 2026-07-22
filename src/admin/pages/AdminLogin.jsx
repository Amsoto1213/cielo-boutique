import React, { useState } from "react";
import { C, sans } from "../../styles/tokens";
import { Logo } from "../../components/common/Marca";
import { EarthButton } from "../../components/common/Botones";
import { iniciarSesionAdmin } from "../../api/auth";

export function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const intentar = async () => {
    if (!email || !pass) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    setError("");
    setCargando(true);

    const { data, error: errorAuth } = await iniciarSesionAdmin(email, pass);

    setCargando(false);

    if (errorAuth) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    onLogin(data.session);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: C.ivory }}>
      <div className="w-full max-w-sm p-10 text-center" style={{ backgroundColor: C.white, border: `1px solid ${C.sand}` }}>
        <Logo size="text-xl" />
        <div style={{ ...sans, color: C.inkSoft }} className="text-[11px] uppercase tracking-[0.14em] mt-2 mb-8">
          Panel de administración
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="Correo electrónico"
          className="w-full px-4 py-3 text-sm outline-none mb-2"
          style={{ ...sans, border: `1px solid ${error ? "#B3452F" : C.sand}` }}
          onKeyDown={(e) => e.key === "Enter" && intentar()}
        />
        <input
          type="password"
          value={pass}
          onChange={(e) => { setPass(e.target.value); setError(""); }}
          placeholder="Contraseña"
          className="w-full px-4 py-3 text-sm outline-none mb-2"
          style={{ ...sans, border: `1px solid ${error ? "#B3452F" : C.sand}` }}
          onKeyDown={(e) => e.key === "Enter" && intentar()}
        />
        {error && <div style={{ ...sans, color: "#B3452F" }} className="text-xs text-left mb-3">{error}</div>}
        <EarthButton className={`w-full mt-4 ${cargando ? "opacity-50 pointer-events-none" : ""}`} onClick={intentar}>
          {cargando ? "Entrando..." : "Entrar"}
        </EarthButton>
      </div>
    </div>
  );
}

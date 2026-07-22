import React from "react";
import { Link, useLocation } from "react-router-dom";
import { C, sans } from "../../styles/tokens";
import { Logo } from "../common/Marca";

export function NavBar({ carritoCount, setCarritoAbierto }) {
  const location = useLocation();
  const links = [
    { to: "/", label: "Inicio" },
    { to: "/catalogo", label: "Colección" },
    { to: "/contacto", label: "Contacto" },
  ];
  return (
    <header className="w-full sticky top-0 z-30" style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.sand}` }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 md:px-10 py-5">
        <Link to="/" aria-label="Ir a inicio">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-[13px] uppercase tracking-[0.12em] transition-opacity hover:opacity-60"
              style={{ ...sans, color: location.pathname === l.to ? C.earth : C.ink }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setCarritoAbierto(true)}
          className="relative text-[12px] uppercase tracking-[0.14em] px-4 py-2 border"
          style={{ borderColor: C.ink, color: C.ink, ...sans }}
        >
          Carrito
          {carritoCount > 0 && (
            <span
              className="absolute -top-2 -right-2 text-[10px] w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: C.gold, color: C.white }}
            >
              {carritoCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

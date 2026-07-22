import React from "react";
import { C, sans } from "../../styles/tokens";

export function EarthButton({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-6 py-3 text-[12px] uppercase tracking-[0.16em] transition-opacity hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
      style={{ backgroundColor: C.earth, color: C.white, ...sans }}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 text-[12px] uppercase tracking-[0.16em] border transition-colors hover:bg-black/5 ${className}`}
      style={{ borderColor: C.earth, color: C.earth, ...sans }}
    >
      {children}
    </button>
  );
}

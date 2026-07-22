import React from "react";
import { C, serif, sans } from "../../styles/tokens";

export function Sello({ text }) {
  return (
    <span style={{ ...sans, letterSpacing: "0.14em", color: C.inkSoft }} className="text-[11px] uppercase">
      {text}
    </span>
  );
}

export function Star() {
  return <span style={{ color: C.gold }}>✦</span>;
}

export function Logo({ size = "text-2xl" }) {
  return (
    <div className={`${size} tracking-[0.18em]`} style={{ ...serif, color: C.ink }}>
      CIELO <span style={{ ...sans, fontSize: "0.42em", letterSpacing: "0.3em", color: C.earth }}>BOUTIQUE</span>
    </div>
  );
}

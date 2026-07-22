import React from "react";
import { Hero } from "./Hero";
import { HeroImage } from "./HeroImage";
import { TiraSellos } from "./TiraSellos";
import { ColeccionesDestacadas } from "./ColeccionesDestacadas";
import { SeleccionDorada } from "./SeleccionDorada";
import { CTAFinal } from "./CTAFinal";

export function Home({ productos, onAdd }) {
  return (
    <>
      <Hero />
      <HeroImage />
      <TiraSellos />
      <ColeccionesDestacadas productos={productos} onAdd={onAdd} />
      <SeleccionDorada productos={productos} onAdd={onAdd} />
      <CTAFinal />
    </>
  );
}

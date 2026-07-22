// HeroImage.jsx
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { C } from "../../styles/tokens";
import { obtenerImagenesHeroCarousel } from "../../api/contenidoSitio";

export function HeroImage() {
  const [imagenes, setImagenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarCarousel = async () => {
      try {
        const data = await obtenerImagenesHeroCarousel();
        setImagenes(data);
      } catch (err) {
        console.error("Error al cargar carrusel:", err);
      } finally {
        setCargando(false);
      }
    };
    cargarCarousel();
  }, []);

  if (cargando) {
    // Placeholder animado que cambia de tamaño según dispositivo
    return (
      <section className="max-w-6xl mx-auto px-0 md:px-10 pb-16">
        <div className="w-full aspect-[4/5] md:aspect-[21/9] animate-pulse" style={{ backgroundColor: C.sand }} />
      </section>
    );
  }

  // Si no hay imágenes en la BD, muestra un fallback
  if (imagenes.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-0 md:px-10 pb-16">
        <div className="w-full aspect-[4/5] md:aspect-[21/9] overflow-hidden" style={{ backgroundColor: C.ivory }}>
          <img src="https://picsum.photos/seed/cielo-empty/1600/800" alt="Fallback" className="w-full h-full object-cover" />
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-0 md:px-10 pb-16">
      {/* 
        Clases de Tailwind clave: 
        aspect-[4/5] (Alto y estrecho para móviles)
        md:aspect-[21/9] (Panorámico para escritorio) 
      */}
      <div className="w-full aspect-[4/5] md:aspect-[21/9] overflow-hidden group">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          loop={imagenes.length > 1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="w-full h-full"
        >
          {imagenes.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={img.url}
                alt={`Editorial Cielo Boutique ${idx}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
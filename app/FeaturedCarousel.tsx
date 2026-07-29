"use client";

import { useEffect, useRef } from "react";
import { PropertyCard } from "./components";
import type { Imovel } from "./data";

/* Avança sozinho a cada poucos segundos; para de vez em quando encostar o
   mouse, pra não atrapalhar quem está lendo ou clicando num card. */
export function FeaturedCarousel({ imoveis }: { imoveis: Imovel[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const id = setInterval(() => {
      if (pausedRef.current) return;
      const card = track.querySelector<HTMLElement>(".featured-carousel-item");
      const gap = 18;
      const step = card ? card.offsetWidth + gap : track.clientWidth;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      track.scrollTo({
        left: atEnd ? 0 : track.scrollLeft + step,
        behavior: "smooth",
      });
    }, 4000);

    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="featured-carousel"
      ref={trackRef}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      {imoveis.map((imovel, index) => (
        <div className="featured-carousel-item" key={imovel.codigo}>
          <PropertyCard imovel={imovel} index={index} />
        </div>
      ))}
    </div>
  );
}

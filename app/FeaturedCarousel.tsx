import { PropertyCard } from "./components";
import type { Imovel } from "./data";

/* Esteira contínua via animação CSS (compositor do navegador, não depende de
   JS pra manter o ritmo — mais confiável que requestAnimationFrame, que fica
   instável em abas em segundo plano). A lista é renderizada duas vezes; a
   animação move a trilha em -50%, exatamente a largura de uma volta — como
   as duas metades são idênticas, o reinício (0% de novo) fica invisível.
   Pausa no hover só com CSS (:hover), sem estado em JS. */
export function FeaturedCarousel({ imoveis }: { imoveis: Imovel[] }) {
  return (
    <div className="featured-carousel">
      <div className="featured-carousel-track">
        {[...imoveis, ...imoveis].map((imovel, index) => (
          <div className="featured-carousel-item" key={`${imovel.codigo}-${index}`}>
            <PropertyCard imovel={imovel} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}

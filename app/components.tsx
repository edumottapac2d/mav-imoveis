import Link from "next/link";
import { formatarMoeda, Imovel, precoPrincipal, urlImovel } from "./data";

export function Header() {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link className="logo-link" href="/" aria-label="MAV Imóveis — início">
            <img src="/logo-mav.png" alt="MAV Imóveis" />
          </Link>
          <nav className="desktop-nav" aria-label="Navegação principal">
            <Link href="/imoveis/a-venda">Comprar</Link>
            <Link href="/imoveis/para-alugar">Alugar</Link>
            <a href="/#bairros">Bairros</a>
            <a href="#contato">Contato</a>
          </nav>
          <a className="header-whatsapp" href="https://wa.me/5521964907656">
            Fale conosco <span aria-hidden="true">→</span>
          </a>
          <details className="mobile-menu">
            <summary aria-label="Abrir menu">Menu</summary>
            <nav aria-label="Navegação móvel">
              <Link href="/imoveis/a-venda">Comprar</Link>
              <Link href="/imoveis/para-alugar">Alugar</Link>
              <a href="/#bairros">Bairros</a>
              <a href="#contato">Contato</a>
            </nav>
          </details>
        </div>
      </header>
      <WhatsAppFloat />
    </>
  );
}

/* Fora de <header>: o backdrop-filter do .site-header cria um novo containing
   block para descendentes fixed, o que travaria o botão junto do cabeçalho
   em vez de fixo na viewport. */
function WhatsAppFloat() {
  return (
    <a
      className="whatsapp-float"
      href="https://wa.me/5521964907656"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.36.101 11.943c0 2.104.548 4.156 1.588 5.967L0 24l6.335-1.652a11.882 11.882 0 005.71 1.454h.005c6.581 0 11.941-5.36 11.944-11.943a11.87 11.87 0 00-3.474-8.41" />
      </svg>
    </a>
  );
}

export function PropertyVisual({
  imovel,
  index = 0,
  label,
}: {
  imovel: Imovel;
  index?: number;
  label?: string;
}) {
  return (
    <div
      className={`property-visual visual-${index % 4}`}
      role="img"
      aria-label={label ?? `Foto do imóvel ${imovel.codigo}`}
    >
      <img
        src={imovel.fotos[0]}
        alt=""
        aria-hidden="true"
      />
      <span className="visual-kind">{label ?? imovel.tipo}</span>
      <span className="visual-code">{imovel.codigo}</span>
    </div>
  );
}

export function PropertyCard({
  imovel,
  index = 0,
}: {
  imovel: Imovel;
  index?: number;
}) {
  const price = precoPrincipal(imovel);
  const aluguel = imovel.preco_venda === null;
  return (
    <article className="property-card">
      <Link href={urlImovel(imovel)} aria-label={`Ver ${imovel.tipo} ${imovel.codigo}`}>
        <PropertyVisual imovel={imovel} index={index} />
        <div className="property-content">
          <div className="property-topline">
            <span>{imovel.tipo}</span>
            <span className="mono">{imovel.codigo}</span>
          </div>
          <h3>{imovel.endereco}</h3>
          <p>{imovel.bairro}, {imovel.cidade}</p>
          <div className="property-specs mono">
            <span>{imovel.area_util} m²</span>
            <span>{imovel.quartos} qtos</span>
            <span>{imovel.vagas} {imovel.vagas === 1 ? "vaga" : "vagas"}</span>
          </div>
          <p className="property-price mono">
            {formatarMoeda(price)}
            {aluguel && <small>/mês</small>}
          </p>
        </div>
      </Link>
    </article>
  );
}

export function Footer() {
  return (
    <footer className="site-footer" id="contato">
      <div className="footer-main">
        <div>
          <img src="/logo-mav.png" alt="MAV Imóveis" />
          <p>A imobiliária que conhece o bairro de verdade.</p>
          <p className="creci">CRECI 6669J</p>
        </div>
        <div>
          <h2>Venha conversar</h2>
          <p>Rua das Camélias, 35 — Loja E<br />Vila Valqueire, Rio de Janeiro/RJ</p>
        </div>
        <div>
          <h2>Fale com a MAV</h2>
          <a href="https://wa.me/5521964907656">(21) 96490-7656</a>
          <a href="tel:+552130446511">(21) 3044-6511</a>
          <a href="tel:+552124540511">(21) 2454-0511</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Imóveis Mav Serviços Imobiliários Ltda.</span>
        <span>Facebook · Instagram · YouTube</span>
      </div>
    </footer>
  );
}

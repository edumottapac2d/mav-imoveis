import Link from "next/link";
import { formatarMoeda, Imovel, precoPrincipal, urlImovel } from "./data";

export function Header() {
  return (
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

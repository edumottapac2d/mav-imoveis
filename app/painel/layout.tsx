import type { Metadata } from "next";
import Link from "next/link";
import "./painel.css";

export const metadata: Metadata = {
  title: "Painel",
  // Área interna: nunca deve aparecer em busca.
  robots: { index: false, follow: false },
};

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="painel">
      <header className="painel-topo">
        <div className="painel-topo-inner">
          <Link className="painel-marca" href="/painel">
            <img src="/logo-mav.png" alt="MAV Imóveis" />
            <span>Painel</span>
          </Link>
          <nav className="painel-nav" aria-label="Navegação do painel">
            <Link href="/painel">Imóveis</Link>
            <Link href="/painel/leads">Leads</Link>
            <Link href="/" target="_blank">Ver o site ↗</Link>
          </nav>
        </div>
      </header>
      <div className="painel-corpo">{children}</div>
    </div>
  );
}

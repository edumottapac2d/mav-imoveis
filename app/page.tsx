import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, PropertyCard } from "./components";
import { imoveis } from "./data";

export const metadata: Metadata = {
  title: "Início",
  description:
    "Encontre imóveis em Vila Valqueire e bairros vizinhos com atendimento local, próximo e direto.",
};

const atendimentos = [
  {
    numero: "01",
    titulo: "Busca personalizada",
    texto: "A gente entende sua rotina antes de indicar um endereço.",
  },
  {
    numero: "02",
    titulo: "Conhecimento local",
    texto: "Orientação sobre ruas, comércio e mobilidade da região.",
  },
  {
    numero: "03",
    titulo: "Visita sem pressa",
    texto: "Agendamento direto com uma equipe que acompanha você.",
  },
  {
    numero: "04",
    titulo: "Negociação clara",
    texto: "Informação objetiva em cada etapa até fechar o negócio.",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="home-hero">
          <div className="home-hero-copy">
            <h1>
              <span>Encontre um</span>
              <span>lugar que combine</span>
              <span>com a sua vida.</span>
            </h1>
            <p className="home-hero-lead">
              Vila Valqueire e bairros vizinhos
            </p>
          </div>

          <div className="home-hero-media">
            <img
              src="/hero-mav.png"
              alt="Sala de apartamento clara e acolhedora com varanda"
            />
          </div>
        </section>

        <section className="hero-tools" aria-label="Busca rápida de imóveis">
          <div className="hero-actions">
            <Link className="button button-green" href="/imoveis/a-venda">
              Explorar imóveis <span aria-hidden="true">→</span>
            </Link>
            <a className="quiet-link" href="https://wa.me/5521964907656">
              Falar com um especialista
            </a>
          </div>
          <form className="home-search" action="/imoveis/a-venda">
            <label>
              Finalidade
              <select name="finalidade" defaultValue="venda">
                <option value="venda">Comprar</option>
                <option value="aluguel">Alugar</option>
              </select>
            </label>
            <label>
              Localização
              <select name="bairro" defaultValue="">
                <option value="">Todos os bairros</option>
                <option value="vila-valqueire">Vila Valqueire</option>
                <option value="praca-seca">Praça Seca</option>
                <option value="campinho">Campinho</option>
                <option value="madureira">Madureira</option>
                <option value="sulacap">Sulacap</option>
              </select>
            </label>
            <label>
              Tipo de imóvel
              <select name="tipo" defaultValue="">
                <option value="">Todos os tipos</option>
                <option value="apartamento">Apartamento</option>
                <option value="casa">Casa</option>
                <option value="cobertura">Cobertura</option>
              </select>
            </label>
            <button type="submit" aria-label="Buscar imóveis">
              Buscar <span aria-hidden="true">→</span>
            </button>
          </form>
        </section>

        <section className="section featured-section">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">Escolhas da MAV</p>
              <h2>Imóveis selecionados para você</h2>
            </div>
            <Link className="text-link" href="/imoveis/a-venda">
              Ver todos os imóveis <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="property-grid">
            {imoveis.slice(0, 3).map((imovel, index) => (
              <PropertyCard key={imovel.codigo} imovel={imovel} index={index} />
            ))}
          </div>
        </section>

        <section className="journey-section" id="bairros">
          <div className="journey-intro">
            <p className="eyebrow">Do primeiro contato às chaves</p>
            <h2>Uma jornada imobiliária mais simples.</h2>
            <p>
              Procurar um imóvel é uma decisão importante. Por isso, cada
              indicação vem com contexto, escuta e conhecimento de quem vive o
              dia a dia do bairro.
            </p>
            <a className="button button-green" href="https://wa.me/5521964907656">
              Conversar com a MAV
            </a>
          </div>

          <div className="journey-steps">
            {atendimentos.map((item) => (
              <article key={item.numero}>
                <span className="mono">{item.numero}</span>
                <h3>{item.titulo}</h3>
                <p>{item.texto}</p>
              </article>
            ))}
          </div>

          <div className="journey-image">
            <img
              src="/bairro-vila-valqueire.png"
              alt="Rua arborizada de Vila Valqueire"
            />
            <div>
              <span className="mono">CONHECIMENTO DE BAIRRO</span>
              <strong>A rua certa faz toda a diferença.</strong>
            </div>
          </div>
        </section>

        <section className="numbers-section" aria-label="MAV Imóveis em números">
          <div>
            <strong className="mono">359</strong>
            <span>imóveis ativos</span>
          </div>
          <div>
            <strong className="mono">6+</strong>
            <span>bairros atendidos</span>
          </div>
          <div>
            <strong className="mono">3</strong>
            <span>canais diretos</span>
          </div>
          <div>
            <strong className="mono">1</strong>
            <span>equipe realmente local</span>
          </div>
        </section>

        <section className="section assurance-section">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">Atendimento de verdade</p>
              <h2>O que você pode esperar da gente</h2>
            </div>
            <a className="text-link" href="#contato">
              Conhecer a MAV <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="assurance-grid">
            <article>
              <span className="quote-mark">“</span>
              <h3>Escuta antes da indicação.</h3>
              <p>
                O imóvel certo começa pela sua rotina, prioridades e planos —
                não por uma lista genérica.
              </p>
            </article>
            <article>
              <span className="quote-mark">“</span>
              <h3>Contexto além do anúncio.</h3>
              <p>
                Você recebe orientação sobre o entorno e os detalhes que ajudam
                a tomar uma decisão segura.
              </p>
            </article>
            <article>
              <span className="quote-mark">“</span>
              <h3>Contato direto e próximo.</h3>
              <p>
                Da primeira conversa à negociação, a equipe acompanha cada
                etapa sem complicação.
              </p>
            </article>
          </div>
        </section>

        <section className="contact-banner">
          <div>
            <p className="eyebrow light">Comece pela conversa</p>
            <h2>Conte como seria o imóvel ideal para você.</h2>
          </div>
          <a className="button button-cream" href="https://wa.me/5521964907656">
            Chamar no WhatsApp <span aria-hidden="true">→</span>
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}

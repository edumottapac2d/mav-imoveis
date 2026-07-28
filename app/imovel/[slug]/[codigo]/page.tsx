import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header, PropertyCard, PropertyVisual } from "../../../components";
import { formatarMoeda, imoveis, precoPrincipal } from "../../../data";

export function generateStaticParams() {
  return imoveis.map((imovel) => ({
    slug: imovel.slug,
    codigo: imovel.codigo,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ codigo: string }>;
}): Promise<Metadata> {
  const { codigo } = await params;
  const imovel = imoveis.find((item) => item.codigo === codigo);
  if (!imovel) return { title: "Imóvel não encontrado" };
  return {
    title: `${imovel.tipo} em ${imovel.bairro} — ${imovel.codigo}`,
    description: `${imovel.quartos} quartos, ${imovel.area_util} m², em ${imovel.endereco}, ${imovel.bairro}.`,
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string; codigo: string }>;
}) {
  const { codigo } = await params;
  const imovel = imoveis.find((item) => item.codigo === codigo);
  if (!imovel) notFound();

  const preco = precoPrincipal(imovel);
  const aluguel = imovel.preco_venda === null;
  const valorM2 =
    imovel.preco_venda !== null
      ? Math.round(imovel.preco_venda / imovel.area_util)
      : null;
  const semelhantes = imoveis
    .filter((item) => item.codigo !== imovel.codigo && item.bairro === imovel.bairro)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className="detail-page">
        <nav className="breadcrumbs" aria-label="Navegação estrutural">
          <Link href="/">Início</Link><span>/</span>
          <Link href={aluguel ? "/imoveis/para-alugar" : "/imoveis/a-venda"}>
            {aluguel ? "Para alugar" : "À venda"}
          </Link><span>/</span>
          <Link href={`${aluguel ? "/imoveis/para-alugar" : "/imoveis/a-venda"}/${imovel.tipo.toLowerCase()}/rio-de-janeiro/${imovel.bairro.toLowerCase().replaceAll(" ", "-")}`}>
            {imovel.bairro}
          </Link>
        </nav>

        <section className="detail-heading">
          <div>
            <div className="property-topline">
              <span>{imovel.tipo} {aluguel ? "para alugar" : "à venda"}</span>
              <span className="mono">{imovel.codigo}</span>
            </div>
            <h1>{imovel.endereco}</h1>
            <p>{imovel.bairro}, {imovel.cidade} — {imovel.uf}</p>
          </div>
          <p className="detail-price mono">
            {formatarMoeda(preco)}
            {aluguel && <small>/mês</small>}
          </p>
        </section>

        <section className="gallery gallery-single" aria-label="Galeria do imóvel">
          <div className="gallery-main">
            <PropertyVisual
              imovel={imovel}
              index={0}
              label={imovel.tipo === "Casa" ? "Fachada" : imovel.tipo === "Cobertura" ? "Terraço" : "Sala"}
            />
          </div>
          <button type="button" className="gallery-count">
            {imovel.fotos.length} foto
          </button>
        </section>

        <div className="detail-layout">
          <div className="detail-content">
            <section className="quick-specs" aria-label="Resumo técnico">
              <div><span className="mono">{imovel.area_util} m²</span><small>área útil</small></div>
              <div><span className="mono">{imovel.quartos}</span><small>quartos</small></div>
              <div><span className="mono">{imovel.banheiros}</span><small>banheiros</small></div>
              <div><span className="mono">{imovel.vagas}</span><small>vagas</small></div>
            </section>

            <section className="detail-section">
              <p className="eyebrow">Por dentro do imóvel</p>
              <h2>Espaço bom, no ritmo do bairro.</h2>
              <p className="description">{imovel.descricao}</p>
            </section>

            <section className="detail-section">
              <p className="eyebrow">Ficha técnica</p>
              <h2>Os dados, sem rodeio.</h2>
              <dl className="technical-sheet mono">
                <div><dt>Código</dt><dd>{imovel.codigo}</dd></div>
                <div><dt>Área útil</dt><dd>{imovel.area_util} m²</dd></div>
                {imovel.area_total && <div><dt>Área total</dt><dd>{imovel.area_total} m²</dd></div>}
                <div><dt>Quartos</dt><dd>{imovel.quartos}</dd></div>
                <div><dt>Banheiros</dt><dd>{imovel.banheiros}</dd></div>
                <div><dt>Vagas</dt><dd>{imovel.vagas}</dd></div>
                {imovel.andar_unidade && <div><dt>Andar</dt><dd>{imovel.andar_unidade}º</dd></div>}
                <div><dt>Condomínio</dt><dd>{formatarMoeda(imovel.condominio_valor)}</dd></div>
                <div><dt>IPTU anual</dt><dd>{formatarMoeda(imovel.iptu_anual)}</dd></div>
                {valorM2 && <div><dt>Valor por m²</dt><dd>{formatarMoeda(valorM2)}</dd></div>}
                <div><dt>Posição solar</dt><dd>{imovel.posicao_solar}</dd></div>
              </dl>
            </section>

            <section className="detail-section">
              <p className="eyebrow">O que tem aqui</p>
              <h2>Características</h2>
              <ul className="features">
                {imovel.caracteristicas.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section className="location-block">
              <div>
                <p className="eyebrow light">Conhecemos o caminho</p>
                <h2>{imovel.bairro}, rua por rua.</h2>
                <p>
                  Quer saber sobre o trecho, comércio perto e deslocamento?
                  Essa conversa acontece com quem trabalha todos os dias na região.
                </p>
              </div>
              <div className="location-stamp mono">
                <span>RIO DE JANEIRO</span>
                <strong>{imovel.bairro}</strong>
                <small>{imovel.endereco}</small>
              </div>
            </section>
          </div>

          <aside className="visit-card">
            <p className="eyebrow">Vamos abrir a porta?</p>
            <h2>Agende uma visita</h2>
            <p>Fale direto com a equipe e combine o melhor horário.</p>
            <label>
              Seu nome
              <input type="text" placeholder="Como podemos chamar você?" />
            </label>
            <label>
              Telefone
              <input type="tel" placeholder="(21) 99999-9999" />
            </label>
            <button className="button button-sun" type="button">
              Quero agendar
            </button>
            <a href={`https://wa.me/5521964907656?text=Olá! Tenho interesse no imóvel ${imovel.codigo}.`}>
              Falar pelo WhatsApp
            </a>
            <small>Formulário demonstrativo. Nenhum dado é enviado.</small>
          </aside>
        </div>

        {semelhantes.length > 0 && (
          <section className="detail-related">
            <div className="section-heading">
              <div><p className="eyebrow">Perto daqui</p><h2>Outros no bairro</h2></div>
              <Link className="text-link" href="/imoveis/a-venda">Ver busca completa →</Link>
            </div>
            <div className="property-grid">
              {semelhantes.map((item, index) => (
                <PropertyCard key={item.codigo} imovel={item} index={index + 1} />
              ))}
            </div>
          </section>
        )}
      </main>
      <div className="mobile-visit-bar">
        <div><small>{imovel.codigo}</small><strong className="mono">{formatarMoeda(preco)}</strong></div>
        <a className="button button-sun" href={`https://wa.me/5521964907656?text=Olá! Tenho interesse no imóvel ${imovel.codigo}.`}>
          Agendar visita
        </a>
      </div>
      <Footer />
    </>
  );
}

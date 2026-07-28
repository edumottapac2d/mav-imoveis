"use client";

import { useEffect, useMemo, useState } from "react";
import { Imovel, precoPrincipal } from "../../data";
import { PropertyCard } from "../../components";

const slugify = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "-");

export function ListingClient({
  imoveis,
  segments,
}: {
  imoveis: Imovel[];
  segments: string[];
}) {
  const pathAluguel = segments.includes("para-alugar");
  const [finalidade, setFinalidade] = useState(pathAluguel ? "aluguel" : "venda");
  const [tipo, setTipo] = useState(segments[1]?.replaceAll("-", " ") ?? "");
  const [bairro, setBairro] = useState(segments[3]?.replaceAll("-", " ") ?? "");
  const [precoMax, setPrecoMax] = useState("");
  const [quartos, setQuartos] = useState("");
  const [vagas, setVagas] = useState("");
  const [pet, setPet] = useState(false);
  const [elevador, setElevador] = useState(false);
  const [ordem, setOrdem] = useState("recentes");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("finalidade") === "aluguel") setFinalidade("aluguel");
    if (query.get("tipo")) setTipo(query.get("tipo") ?? "");
    if (query.get("bairro")) setBairro(query.get("bairro") ?? "");
  }, []);

  const resultado = useMemo(() => {
    const filtered = imoveis.filter((item) => {
      const atendeFinalidade =
        item.finalidade === finalidade || item.finalidade === "venda_aluguel";
      const atendeTipo = !tipo || slugify(item.tipo) === slugify(tipo);
      const atendeBairro = !bairro || slugify(item.bairro) === slugify(bairro);
      const preco = precoPrincipal(item) ?? 0;
      return (
        atendeFinalidade &&
        atendeTipo &&
        atendeBairro &&
        (!precoMax || preco <= Number(precoMax)) &&
        (!quartos || item.quartos >= Number(quartos)) &&
        (!vagas || item.vagas >= Number(vagas)) &&
        (!pet || item.aceita_pet) &&
        (!elevador || item.elevador)
      );
    });
    return [...filtered].sort((a, b) => {
      if (ordem === "menor") return (precoPrincipal(a) ?? 0) - (precoPrincipal(b) ?? 0);
      if (ordem === "maior") return (precoPrincipal(b) ?? 0) - (precoPrincipal(a) ?? 0);
      if (ordem === "area") return b.area_util - a.area_util;
      return 0;
    });
  }, [imoveis, finalidade, tipo, bairro, precoMax, quartos, vagas, pet, elevador, ordem]);

  const limpar = () => {
    setTipo(""); setBairro(""); setPrecoMax(""); setQuartos(""); setVagas("");
    setPet(false); setElevador(false);
  };

  return (
    <main className="listing-page">
      <section className="listing-hero">
        <p className="eyebrow">Busca por ruas e bairros</p>
        <h1>{finalidade === "venda" ? "Imóveis à venda" : "Imóveis para alugar"}</h1>
        <p>Comece pelos filtros. Se não aparecer, a gente procura com você.</p>
        <div className="purpose-tabs" role="group" aria-label="Finalidade">
          <button
            type="button"
            className={finalidade === "venda" ? "active" : ""}
            onClick={() => setFinalidade("venda")}
          >
            Comprar
          </button>
          <button
            type="button"
            className={finalidade === "aluguel" ? "active" : ""}
            onClick={() => setFinalidade("aluguel")}
          >
            Alugar
          </button>
        </div>
      </section>

      <div className="listing-layout">
        <aside className="filters" aria-label="Filtros de imóveis">
          <div className="filters-head">
            <h2>Filtrar</h2>
            <button type="button" onClick={limpar}>Limpar</button>
          </div>
          <label>
            Tipo de imóvel
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="">Todos os tipos</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="cobertura">Cobertura</option>
            </select>
          </label>
          <label>
            Bairro
            <select value={bairro} onChange={(e) => setBairro(e.target.value)}>
              <option value="">Toda a região</option>
              {[...new Set(imoveis.map((item) => item.bairro))].sort().map((nome) => (
                <option key={nome} value={slugify(nome)}>{nome}</option>
              ))}
            </select>
          </label>
          <label>
            Preço até
            <select value={precoMax} onChange={(e) => setPrecoMax(e.target.value)}>
              <option value="">Sem limite</option>
              <option value="300000">R$ 300.000</option>
              <option value="500000">R$ 500.000</option>
              <option value="700000">R$ 700.000</option>
              <option value="900000">R$ 900.000</option>
            </select>
          </label>
          <div className="filter-pair">
            <label>
              Quartos
              <select value={quartos} onChange={(e) => setQuartos(e.target.value)}>
                <option value="">Todos</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </label>
            <label>
              Vagas
              <select value={vagas} onChange={(e) => setVagas(e.target.value)}>
                <option value="">Todas</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
              </select>
            </label>
          </div>
          <fieldset>
            <legend>Características</legend>
            <label className="check-label">
              <input type="checkbox" checked={pet} onChange={(e) => setPet(e.target.checked)} />
              Aceita pet
            </label>
            <label className="check-label">
              <input type="checkbox" checked={elevador} onChange={(e) => setElevador(e.target.checked)} />
              Elevador
            </label>
          </fieldset>
          <a className="filters-help" href="https://wa.me/5521964907656">
            Não achou seu filtro? <strong>Fale com a gente →</strong>
          </a>
        </aside>

        <section className="results" aria-live="polite">
          <div className="results-head">
            <p><strong>{resultado.length}</strong> opções nesta amostra de imóveis ativos</p>
            <label>
              Ordenar
              <select value={ordem} onChange={(e) => setOrdem(e.target.value)}>
                <option value="recentes">Mais recentes</option>
                <option value="menor">Menor preço</option>
                <option value="maior">Maior preço</option>
                <option value="area">Maior área</option>
              </select>
            </label>
          </div>

          {resultado.length > 0 ? (
            <>
              <div className="property-grid listing-grid">
                {resultado.map((imovel, index) => (
                  <PropertyCard key={imovel.codigo} imovel={imovel} index={index} />
                ))}
              </div>
              <nav className="pagination" aria-label="Paginação de imóveis">
                <button type="button" disabled aria-label="Página anterior">←</button>
                <button type="button" className="current" aria-current="page">1</button>
                <button type="button">2</button>
                <button type="button">3</button>
                <span>…</span>
                <button type="button">36</button>
                <button type="button" aria-label="Próxima página">→</button>
                <p>Página 1 de 36 · 359 imóveis</p>
              </nav>
            </>
          ) : (
            <div className="empty-state">
              <span className="empty-pin" aria-hidden="true">×</span>
              <p className="eyebrow">Nenhum resultado por aqui</p>
              <h2>Não temos nada com esses filtros, mas a gente procura.</h2>
              <p>
                Tire um filtro ou conte no WhatsApp o que você precisa. A equipe
                cruza seu pedido com as ruas e os imóveis que chegam à loja.
              </p>
              <div>
                <button className="button button-sun" type="button" onClick={limpar}>
                  Limpar filtros
                </button>
                <a className="button empty-whatsapp" href="https://wa.me/5521964907656">
                  Pedir ajuda no WhatsApp
                </a>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatarMoeda, imoveis, precoPrincipal, type Imovel } from "../data";

/* Lê os mesmos dados que o site público (app/data.ts) — o painel não mantém
   catálogo próprio. Quando `imoveis` deixar de ser array estático e passar a
   vir do Supabase, esta tela acompanha sem mudar de forma. */

const BAIRROS = [...new Set(imoveis.map((i) => i.bairro))].sort();

/* Busca sem acento: quem cadastra digita "praca seca" ou "jacarepagua" muito
   mais do que com o acento correto. Comparar os dois lados normalizados evita
   busca que não acha nada por causa de uma cedilha. */
const semAcento = (t: string) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function etiquetaFinalidade(f: Imovel["finalidade"]) {
  if (f === "aluguel") return <span className="etiqueta aluguel">Aluguel</span>;
  if (f === "venda_aluguel") return <span className="etiqueta ambos">Venda e aluguel</span>;
  return <span className="etiqueta venda">Venda</span>;
}

export default function PainelImoveis() {
  const [busca, setBusca] = useState("");
  const [bairro, setBairro] = useState("");
  const [situacao, setSituacao] = useState("");

  const filtrados = useMemo(() => {
    const termo = semAcento(busca.trim());
    return imoveis.filter((i) => {
      if (bairro && i.bairro !== bairro) return false;
      if (situacao === "publicado" && !i.publicado_no_site) return false;
      if (situacao === "rascunho" && i.publicado_no_site) return false;
      if (termo) {
        const alvo = semAcento(`${i.codigo} ${i.endereco} ${i.bairro} ${i.tipo}`);
        if (!alvo.includes(termo)) return false;
      }
      return true;
    });
  }, [busca, bairro, situacao]);

  const publicados = imoveis.filter((i) => i.publicado_no_site).length;
  const rascunhos = imoveis.length - publicados;
  const semFoto = imoveis.filter((i) => i.fotos.length === 0).length;
  const semPreco = imoveis.filter((i) => !i.preco_venda && !i.preco_aluguel).length;

  return (
    <>
      <div className="painel-cabecalho">
        <div>
          <h1>Imóveis</h1>
          <p>O que estiver publicado aqui é o que aparece no site.</p>
        </div>
        <Link className="painel-btn destaque" href="/painel/novo">
          + Novo imóvel
        </Link>
      </div>

      <div className="painel-metricas">
        <div className="painel-metrica">
          <span>Publicados</span>
          <strong>{publicados}</strong>
        </div>
        <div className="painel-metrica">
          <span>Rascunhos</span>
          <strong>{rascunhos}</strong>
        </div>
        <div className="painel-metrica">
          <span>Sem foto</span>
          <strong>{semFoto}</strong>
        </div>
        <div className={`painel-metrica${semPreco ? " alerta" : ""}`}>
          <span>Sem preço</span>
          <strong>{semPreco}</strong>
        </div>
      </div>

      <div className="painel-filtros">
        <div className="painel-campo painel-busca">
          <label htmlFor="f-busca">Buscar</label>
          <input
            className="painel-input"
            id="f-busca"
            type="search"
            placeholder="Código, rua ou bairro…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div className="painel-campo">
          <label htmlFor="f-bairro">Bairro</label>
          <select
            className="painel-input"
            id="f-bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          >
            <option value="">Todos</option>
            {BAIRROS.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="painel-campo">
          <label htmlFor="f-situacao">Situação</label>
          <select
            className="painel-input"
            id="f-situacao"
            value={situacao}
            onChange={(e) => setSituacao(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="publicado">Publicado</option>
            <option value="rascunho">Rascunho</option>
          </select>
        </div>
      </div>

      <div className="painel-tabela-wrap">
        <table className="painel-tabela">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Código</th>
              <th>Imóvel</th>
              <th>Specs</th>
              <th>Preço</th>
              <th>Pretensão</th>
              <th>Site</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtrados.map((i) => {
              const semValor = !i.preco_venda && !i.preco_aluguel;
              return (
                <tr key={i.codigo}>
                  <td>
                    <span className="painel-miniatura">
                      {i.fotos.length ? `${i.fotos.length} foto${i.fotos.length > 1 ? "s" : ""}` : "sem foto"}
                    </span>
                  </td>
                  <td className="num">{i.codigo}</td>
                  <td>
                    <strong>{i.tipo}</strong>
                    <div className="endereco">
                      {i.endereco} · {i.bairro}
                    </div>
                  </td>
                  <td className="num">
                    {i.area_util} m² · {i.quartos} qtos · {i.vagas}{" "}
                    {i.vagas === 1 ? "vaga" : "vagas"}
                  </td>
                  <td className={`preco${semValor ? " ausente" : ""}`}>
                    {semValor ? "—" : formatarMoeda(precoPrincipal(i))}
                    {i.preco_venda === null && i.preco_aluguel ? "/mês" : ""}
                  </td>
                  <td>{etiquetaFinalidade(i.finalidade)}</td>
                  <td>
                    {i.publicado_no_site ? (
                      <span className="etiqueta no-ar">No ar</span>
                    ) : (
                      <span className="etiqueta rascunho">Rascunho</span>
                    )}
                  </td>
                  <td>
                    <Link className="painel-btn contorno pequeno" href="/painel/novo">
                      Editar
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtrados.length === 0 && (
          <p className="painel-vazio">Nenhum imóvel com esses filtros.</p>
        )}
      </div>
    </>
  );
}

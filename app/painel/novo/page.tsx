"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

/* Formulário de cadastro de imóvel — protótipo sem back-end.
   Os campos e o comportamento vêm do levantamento do sistema atual (Kenlo),
   documentado em docs/PLANO-BACKEND.md seção 1.1. Nada aqui é gravado. */

const BAIRROS = [
  "Vila Valqueire", "Praça Seca", "Campinho", "Madureira",
  "Jacarepaguá", "Sulacap", "Marechal Hermes", "Quintino", "Piedade",
];

const GRUPOS_CARACTERISTICAS: Record<string, string[]> = {
  Infraestrutura: [
    "Elevador", "Portão eletrônico", "Interfone", "Portaria 24h", "Gerador",
    "Ar condicionado", "Aquecimento a gás", "Aquecimento solar", "Depósito", "Vaga coberta",
  ],
  Lazer: [
    "Piscina", "Churrasqueira", "Salão de festas", "Playground", "Academia",
    "Quadra poliesportiva", "Sauna", "Espaço gourmet", "Quintal",
  ],
  Social: ["Varanda", "Varanda gourmet", "Sacada", "Escritório", "Aceita pet"],
  Serviços: [
    "Área de serviço", "Lavanderia", "Dorm. de empregada",
    "Banheiro de empregada", "Copa", "Despensa",
  ],
  Acabamento: [
    "Porcelanato", "Granito", "Mármore", "Laminado",
    "Taco de madeira", "Armários na cozinha", "Armários nos quartos", "Closet",
  ],
};

const FOTOS_EXEMPLO = [
  { titulo: "Sala em dois ambientes", tipo: "Foto", site: true, capa: true },
  { titulo: "Cozinha", tipo: "Foto", site: true, capa: false },
  { titulo: "Quarto principal", tipo: "Foto", site: true, capa: false },
  { titulo: "Banheiro social", tipo: "Foto", site: true, capa: false },
  { titulo: "Planta baixa", tipo: "Planta", site: false, capa: false },
];

const slugify = (t: string) =>
  t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

export default function NovoImovel() {
  const [venda, setVenda] = useState(true);
  const [locacao, setLocacao] = useState(false);

  const [codigo, setCodigo] = useState("");
  const [tipo, setTipo] = useState("");
  const [endereco, setEndereco] = useState("");
  const [bairro, setBairro] = useState("");
  const [precoVenda, setPrecoVenda] = useState("");
  const [precoAluguel, setPrecoAluguel] = useState("");
  const [areaUtil, setAreaUtil] = useState("");
  const [quartos, setQuartos] = useState("");
  const [banheiros, setBanheiros] = useState("");
  const [descricao, setDescricao] = useState("");
  const [publicado, setPublicado] = useState(false);

  const valorM2 = useMemo(() => {
    const p = parseFloat(precoVenda);
    const a = parseFloat(areaUtil);
    return p > 0 && a > 0 ? `${brl(Math.round(p / a))}/m²` : "—";
  }, [precoVenda, areaUtil]);

  const url = useMemo(() => {
    const cod = codigo.toUpperCase() || "CODIGO";
    if (!tipo && !bairro) return `/imovel/…/${cod}`;
    const partes = [slugify(tipo), "rio-de-janeiro", slugify(bairro)];
    if (quartos) partes.push(`${quartos}-quartos`);
    if (areaUtil) partes.push(`${areaUtil}-m`);
    return `/imovel/${partes.filter(Boolean).join("-")}/${cod}`;
  }, [codigo, tipo, bairro, quartos, areaUtil]);

  const pendencias = useMemo(() => {
    const faltando: string[] = [];
    if (!codigo) faltando.push("Código");
    if (!tipo) faltando.push("Tipo");
    if (!endereco) faltando.push("Logradouro");
    if (!bairro) faltando.push("Bairro");
    if (!areaUtil) faltando.push("Área útil");
    if (!quartos) faltando.push("Quartos");
    if (!banheiros) faltando.push("Banheiros");
    if (venda && !precoVenda) faltando.push("Valor de venda");
    if (locacao && !precoAluguel) faltando.push("Valor do aluguel");
    if (!descricao) faltando.push("Descrição no site");
    return faltando;
  }, [codigo, tipo, endereco, bairro, areaUtil, quartos, banheiros, venda, precoVenda, locacao, precoAluguel, descricao]);

  return (
    <>
      <div className="painel-cabecalho">
        <div>
          <h1>Novo imóvel</h1>
          <p>
            Campos com <span className="obrigatorio">*</span> são obrigatórios para publicar no site.
          </p>
        </div>
        <Link className="painel-btn contorno" href="/painel">
          ← Voltar para a lista
        </Link>
      </div>

      <div className="painel-aviso">
        <span>
          <strong>Protótipo sem back-end.</strong> Nada aqui é salvo — os botões de
          gravar não estão ligados a banco de dados. Serve para validar com a equipe
          quais campos o cadastro precisa ter antes de construir o Supabase.
        </span>
      </div>

      <div className="painel-form">
        <div>
          <section className="painel-bloco">
            <h2>Identificação</h2>
            <p className="ajuda">
              O código liga este imóvel à URL antiga do site e aos portais — não invente
              formato novo.
            </p>
            <div className="painel-grade">
              <div className="painel-campo">
                <label htmlFor="c-codigo">
                  Código <span className="obrigatorio">*</span>
                </label>
                <input
                  className="painel-input mono"
                  id="c-codigo"
                  placeholder="AP0757-MBNH"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
                <span className="painel-dica">2 letras do tipo + 4 dígitos + sufixo</span>
              </div>
              <div className="painel-campo">
                <label htmlFor="c-tipo">
                  Tipo <span className="obrigatorio">*</span>
                </label>
                <select className="painel-input" id="c-tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="">Selecione…</option>
                  {["Apartamento", "Casa", "Cobertura", "Loja", "Sala", "Terreno", "Galpão"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="painel-campo largo">
                <span>
                  Pretensão <span className="obrigatorio">*</span>
                </span>
                <div className="painel-opcoes">
                  <label className="painel-opcao">
                    <input type="checkbox" checked={venda} onChange={(e) => setVenda(e.target.checked)} /> Venda
                  </label>
                  <label className="painel-opcao">
                    <input type="checkbox" checked={locacao} onChange={(e) => setLocacao(e.target.checked)} /> Locação
                  </label>
                </div>
                <span className="painel-dica">
                  Pode marcar os dois. Os campos de valor mudam conforme a escolha.
                </span>
              </div>
            </div>
          </section>

          <section className="painel-bloco">
            <h2>Localização</h2>
            <p className="ajuda">O número do imóvel não aparece no site — só é passado na visita.</p>
            <div className="painel-grade">
              <div className="painel-campo">
                <label htmlFor="c-cep">CEP</label>
                <input className="painel-input mono" id="c-cep" placeholder="21330-000" />
              </div>
              <div className="painel-campo largo">
                <label htmlFor="c-endereco">
                  Logradouro <span className="obrigatorio">*</span>
                </label>
                <input
                  className="painel-input"
                  id="c-endereco"
                  placeholder="Rua Alves do Vale"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>
              <div className="painel-campo">
                <label htmlFor="c-numero">Número (interno)</label>
                <input className="painel-input" id="c-numero" placeholder="35" />
                <span className="painel-dica">Não vai para o site</span>
              </div>
              <div className="painel-campo">
                <label htmlFor="c-bairro">
                  Bairro <span className="obrigatorio">*</span>
                </label>
                <select className="painel-input" id="c-bairro" value={bairro} onChange={(e) => setBairro(e.target.value)}>
                  <option value="">Selecione…</option>
                  {BAIRROS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
                <span className="painel-dica">É o bairro comercial — o que o visitante procura</span>
              </div>
              <div className="painel-campo">
                <label htmlFor="c-cidade">Cidade</label>
                <input className="painel-input" id="c-cidade" defaultValue="Rio de Janeiro" />
              </div>
              <div className="painel-campo">
                <label htmlFor="c-uf">UF</label>
                <input className="painel-input mono" id="c-uf" defaultValue="RJ" maxLength={2} />
              </div>
              <div className="painel-campo largo">
                <label htmlFor="c-cond-nome">Condomínio / edifício</label>
                <input className="painel-input" id="c-cond-nome" placeholder="Nome do empreendimento (opcional)" />
              </div>
            </div>
          </section>

          <section className="painel-bloco">
            <h2>Valores</h2>
            <p className="ajuda">Preço errado no site é problema comercial. Confira antes de publicar.</p>

            {venda && (
              <div className="painel-condicional">
                <h3>Venda</h3>
                <div className="painel-grade">
                  <div className="painel-campo">
                    <label htmlFor="c-preco-venda">
                      Valor de venda <span className="obrigatorio">*</span>
                    </label>
                    <input
                      className="painel-input mono"
                      id="c-preco-venda"
                      inputMode="numeric"
                      placeholder="680000"
                      value={precoVenda}
                      onChange={(e) => setPrecoVenda(e.target.value)}
                    />
                  </div>
                  <div className="painel-campo">
                    <span>Aceita permuta</span>
                    <label className="painel-opcao">
                      <input type="checkbox" /> Sim
                    </label>
                  </div>
                </div>
              </div>
            )}

            {locacao && (
              <div className="painel-condicional">
                <h3>Locação</h3>
                <div className="painel-grade">
                  <div className="painel-campo">
                    <label htmlFor="c-preco-aluguel">
                      Valor do aluguel <span className="obrigatorio">*</span>
                    </label>
                    <input
                      className="painel-input mono"
                      id="c-preco-aluguel"
                      inputMode="numeric"
                      placeholder="2400"
                      value={precoAluguel}
                      onChange={(e) => setPrecoAluguel(e.target.value)}
                    />
                  </div>
                  <div className="painel-campo">
                    <label htmlFor="c-tipo-locacao">Tipo de locação</label>
                    <select className="painel-input" id="c-tipo-locacao">
                      {["Mensal", "Anual", "Diária", "Mensal e diária", "Anual e diária"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="painel-grade" style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--line)" }}>
              <div className="painel-campo">
                <label htmlFor="c-condominio">Condomínio (mensal)</label>
                <input className="painel-input mono" id="c-condominio" inputMode="numeric" placeholder="600" />
              </div>
              <div className="painel-campo">
                <label htmlFor="c-iptu">IPTU (anual)</label>
                <input className="painel-input mono" id="c-iptu" inputMode="numeric" placeholder="1000" />
              </div>
              <div className="painel-campo">
                <span>Valor por m²</span>
                <div className="painel-input mono" style={{ display: "flex", alignItems: "center", background: "var(--bg)", color: "#6b7471" }}>
                  {valorM2}
                </div>
                <span className="painel-dica">Calculado automaticamente</span>
              </div>
            </div>

            <div className="painel-aviso atencao" style={{ marginTop: "1.25rem", marginBottom: 0 }}>
              <span>
                <strong>O valor do condomínio não vem do Kenlo.</strong> O sistema atual
                não tem esse campo em lugar nenhum — na migração ele entra à mão, imóvel a
                imóvel. Confirmar com a equipe onde esse número é controlado hoje.
              </span>
            </div>
          </section>

          <section className="painel-bloco">
            <h2>Medidas e cômodos</h2>
            <div className="painel-grade">
              <div className="painel-campo">
                <label htmlFor="c-area-util">
                  Área útil (m²) <span className="obrigatorio">*</span>
                </label>
                <input
                  className="painel-input mono"
                  id="c-area-util"
                  inputMode="numeric"
                  placeholder="116"
                  value={areaUtil}
                  onChange={(e) => setAreaUtil(e.target.value)}
                />
              </div>
              <div className="painel-campo">
                <label htmlFor="c-area-total">Área total (m²)</label>
                <input className="painel-input mono" id="c-area-total" inputMode="numeric" />
              </div>
              <div className="painel-campo">
                <label htmlFor="c-quartos">
                  Quartos <span className="obrigatorio">*</span>
                </label>
                <input
                  className="painel-input mono"
                  id="c-quartos"
                  inputMode="numeric"
                  placeholder="3"
                  value={quartos}
                  onChange={(e) => setQuartos(e.target.value)}
                />
              </div>
              <div className="painel-campo">
                <label htmlFor="c-banheiros">
                  Banheiros <span className="obrigatorio">*</span>
                </label>
                <input
                  className="painel-input mono"
                  id="c-banheiros"
                  inputMode="numeric"
                  placeholder="1"
                  value={banheiros}
                  onChange={(e) => setBanheiros(e.target.value)}
                />
              </div>
              <div className="painel-campo">
                <label htmlFor="c-vagas">Vagas</label>
                <input className="painel-input mono" id="c-vagas" inputMode="numeric" placeholder="1" />
              </div>
              <div className="painel-campo">
                <label htmlFor="c-andar">Andar da unidade</label>
                <input className="painel-input mono" id="c-andar" inputMode="numeric" />
              </div>
              <div className="painel-campo">
                <label htmlFor="c-andares">Andares do prédio</label>
                <input className="painel-input mono" id="c-andares" inputMode="numeric" />
              </div>
              <div className="painel-campo">
                <label htmlFor="c-mobiliado">Mobiliado</label>
                <select className="painel-input" id="c-mobiliado">
                  <option value="nao">Não</option>
                  <option value="semi">Semi-mobiliado</option>
                  <option value="sim">Mobiliado</option>
                </select>
                <span className="painel-dica">Kenlo tem 3 estados; data.ts hoje só tem sim/não</span>
              </div>
              <div className="painel-campo">
                <label htmlFor="c-posicao-solar">Posição solar</label>
                <select className="painel-input" id="c-posicao-solar">
                  <option value="">Não informado</option>
                  {["Sol da manhã", "Sol da tarde", "Norte", "Sul", "Leste", "Oeste"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="painel-campo">
                <label htmlFor="c-posicao">Posição</label>
                <select className="painel-input" id="c-posicao">
                  <option value="">Não informado</option>
                  {["Frente", "Fundos", "Lateral"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="painel-bloco">
            <h2>Características</h2>
            <p className="ajuda">Aparecem na página do imóvel e viram filtro na busca do site.</p>
            {Object.entries(GRUPOS_CARACTERISTICAS).map(([grupo, itens]) => (
              <div className="painel-grupo" key={grupo}>
                <h3>{grupo}</h3>
                <div className="painel-checks">
                  {itens.map((c) => (
                    <label className="painel-check" key={c}>
                      <input type="checkbox" value={c} /> {c}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="painel-bloco">
            <h2>Fotos</h2>
            <p className="ajuda">
              Só as marcadas “Aparecer no site” são publicadas. A capa é a primeira que o
              visitante vê.
            </p>
            <div className="painel-upload">
              <strong>Arraste as fotos aqui</strong>
              <span>ou clique para buscar no computador</span>
              <div className="painel-dica" style={{ marginTop: ".5rem" }}>
                JPG ou PNG · sem marca d’água — ela é aplicada só no envio aos portais
              </div>
            </div>
            <div className="painel-fotos">
              {FOTOS_EXEMPLO.map((f, n) => (
                <div className={`painel-foto${f.capa ? " capa" : ""}`} key={f.titulo}>
                  <div className="painel-foto-img">
                    <span className="painel-foto-ordem">{n + 1}</span>
                    {f.capa && <span className="painel-foto-capa">Capa</span>}
                    IMG_{String(n + 1).padStart(2, "0")}
                  </div>
                  <div className="painel-foto-corpo">
                    <input className="painel-input" defaultValue={f.titulo} aria-label="Título da foto" />
                    <select className="painel-input" defaultValue={f.tipo} aria-label="Tipo da foto">
                      {["Foto", "Planta", "Perspectiva", "Decorado", "Banner"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    <label className="painel-check">
                      <input type="checkbox" defaultChecked={f.site} /> Aparecer no site
                    </label>
                    <div className="painel-foto-acoes">
                      <button className="painel-btn contorno pequeno" type="button">Capa</button>
                      <button className="painel-btn contorno pequeno" type="button">↑</button>
                      <button className="painel-btn contorno pequeno" type="button">↓</button>
                      <button className="painel-btn perigo pequeno" type="button">Excluir</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="painel-lateral">
          <section className="painel-bloco" style={{ marginBottom: 0 }}>
            <h2>Publicação</h2>
            <label className="painel-switch" style={{ margin: "1rem 0" }}>
              <input type="checkbox" checked={publicado} onChange={(e) => setPublicado(e.target.checked)} />
              Publicar no site
            </label>
            <label className="painel-switch" style={{ marginBottom: "1.25rem" }}>
              <input type="checkbox" /> Marcar como destaque
            </label>

            <div className="painel-campo" style={{ marginBottom: "1.25rem" }}>
              <label htmlFor="c-descricao">Descrição no site</label>
              <textarea
                className="painel-input"
                id="c-descricao"
                placeholder="Sala em dois ambientes, um quarto com closet…"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
              <span className="painel-dica">{descricao.length} caracteres</span>
            </div>

            <div className="painel-campo">
              <span>Endereço da página</span>
              <div className="painel-url">{url}</div>
              <span className="painel-dica">
                Gerado do tipo, bairro, quartos e m². O código no fim preserva o link
                antigo indexado no Google.
              </span>
            </div>
          </section>

          <section className="painel-bloco" style={{ marginBottom: 0 }}>
            <h2>Pendências</h2>
            {pendencias.length === 0 ? (
              <p className="painel-ok">✓ Pronto para publicar.</p>
            ) : (
              <>
                <p className="ajuda" style={{ marginBottom: ".5rem" }}>Falta preencher para publicar:</p>
                {pendencias.map((p) => (
                  <div className="painel-pendencia" key={p}>
                    <span>{p}</span>
                    <span className="obrigatorio">•</span>
                  </div>
                ))}
              </>
            )}
          </section>
        </aside>
      </div>

      <div className="painel-acoes">
        <span className="nota">Protótipo — nada é gravado</span>
        <Link className="painel-btn contorno" href="/painel">Cancelar</Link>
        <button className="painel-btn contorno" type="button">Salvar rascunho</button>
        <button className="painel-btn destaque" type="button">Salvar e publicar</button>
      </div>
    </>
  );
}

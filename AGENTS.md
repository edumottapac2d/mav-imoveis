# AGENTS.md — leia antes de mexer neste projeto

Site da **Imóveis Mav Serviços Imobiliários Ltda** (CRECI 6669J), imobiliária de bairro
em Vila Valqueire, Rio de Janeiro. Substitui o site atual `imoveismav.com.br`, hoje na
plataforma Kenlo.

Este arquivo registra **decisões já tomadas e o porquê delas**. Várias parecem erro à
primeira vista e não são — antes de "corrigir" qualquer item marcado com ⚠️, leia a
justificativa. Se for mudar mesmo assim, atualize este arquivo junto.

---

## Onde está publicado

Deploy no Vercel, todas as rotas confirmadas no ar:

- [Site público](https://mav-imoveis.vercel.app/)
- [Painel — imóveis](https://mav-imoveis.vercel.app/painel)
- [Cadastrar imóvel](https://mav-imoveis.vercel.app/painel/novo)
- [Leads recebidos](https://mav-imoveis.vercel.app/painel/leads)

O painel é protótipo sem gravação em banco — ver seção 5.

`git push` em `main` publica sozinho. O projeto foi criado originalmente pela CLI do
Vercel, sem ligação ao GitHub — por isso, entre 28 e 29/07/2026, pushes (incluindo o
`0c37259`) não disparavam deploy nenhum, sem erro, sem tentativa. Corrigido em
29/07/2026: Git conectado em Project Settings → Git ao repositório
`edumottapac2d/mav-imoveis`, com Production Branch Tracking em `main`. A partir deste
commit, todo push em `main` deve gerar deploy de produção automaticamente. Ainda assim,
**confirme visualmente** antes de dizer que uma mudança "está no ar" — é rápido e evita
repetir essa confusão.

---

## ⚠️ Decisões que parecem bug e não são

### 1. O logo do cabeçalho está escondido na home
```css
body:has(.home-hero) .logo-link { visibility: hidden; }
```
**Por quê:** a arte do hero da home (`/og-editorial.png`) já traz o logo grande logo
abaixo do cabeçalho — ficavam duas marcas empilhadas. O cliente pediu para remover a
de cima.

**Não remova o seletor achando que é logo sumido.** E principalmente: **não troque por
apagar o logo do componente `Header`** — ele é compartilhado com `/imoveis/*` e
`/imovel/*`, e nessas telas não existe nenhum outro logo no conteúdo; removê-lo de vez
deixaria essas páginas sem marca alguma.

`visibility: hidden` (e não `display: none`) é proposital: preserva o espaço, então a
navegação fica na mesma posição em todas as páginas em vez de pular para a esquerda só
na home.

*Pendência conhecida:* como o cabeçalho é `sticky`, depois de rolar a home ele fica sem
logo nenhum. Se incomodar, a solução é revelar o logo ao rolar (IntersectionObserver no
`.home-hero`), não remover o seletor.

### 2. `.hero-tools` tem margem superior positiva
```css
.hero-tools { margin: 2rem auto 4rem; }        /* desktop */
.hero-tools { margin: 1.5rem auto 4rem; }      /* ≤900px */
```
**Por quê:** eram `-3rem` e `-2rem` (negativas), no padrão "card flutuando sobre o
hero". Com a arte editorial atual, isso fazia a barra de busca subir por cima da foto e
cobrir parte dela. Verificado depois da correção: hero termina em 859px, busca começa
em 891px, sem sobreposição — e no mobile também.

**Não volte para margem negativa** sem antes conferir visualmente que a barra não
invade a arte.

### 3. `db/schema.ts` está vazio e o D1 não é usado
O projeto veio do template padrão com Cloudflare D1 + Drizzle (`db/`, `drizzle/`,
`wrangler`, `.openai/hosting.json`). **A decisão do cliente foi usar Supabase**, não D1.

Esse scaffolding está inerte de propósito. Não o trate como "banco a ser
implementado" — quando entrar dado real, será via cliente Supabase. Ver
`docs/PLANO-BACKEND.md`.

### 4. Não há banco conectado — é intencional, não é pendência de bug
`app/data.ts` é um array estático de propósito. A troca por consulta ao Supabase é uma
etapa planejada (seção 4.2 do `docs/PLANO-BACKEND.md`), não algo a improvisar.

---

### 5. O painel interno (`/painel`) é protótipo de validação, não produto
`app/painel/` tem três telas — lista de imóveis, cadastro e leads — **sem back-end de
propósito**. Existe para validar com a equipe da imobiliária *quais campos* o cadastro
precisa ter antes de construir o Supabase. Os botões de salvar não gravam nada.

- A lista lê `app/data.ts`, os mesmos dados do site público — o painel **não** mantém
  catálogo próprio. Quando `imoveis` passar a vir do Supabase, a tela acompanha.
- Está com `robots: noindex` no `app/painel/layout.tsx`. **Mantenha** — é área interna.
- Tipografia: a Cormorant Garamond aparece só nos títulos de página. Formulário e
  tabela usam Inter de propósito — quem opera o painel passa meia hora cadastrando
  imóvel, e serifada de display atrapalha leitura em texto pequeno e denso.
- A busca da lista compara texto **sem acento** dos dois lados. É intencional: sem
  isso, procurar "praca seca" não acha "Praça Seca".

Quando o back-end existir, este painel vira a base da versão real (autenticação,
gravação, upload de foto) — ver seção 6 do `docs/PLANO-BACKEND.md`.

---

## Contratos — mudar aqui quebra coisa fora do repositório

### Nomes de campo de `app/data.ts`
São o **contrato com a tabela `imoveis_publicos` do Supabase**, derivada do
levantamento real do sistema atual (Kenlo). Não renomeie, não "melhore" para camelCase,
não traduza:

```
codigo, tipo, finalidade, preco_venda, preco_aluguel, condominio_valor, iptu_anual,
area_util, area_total, quartos, banheiros, vagas, andar_unidade,
total_andares_predio, elevador, mobiliado, aceita_pet, aceita_permuta,
posicao_solar, endereco, bairro, cidade, uf, descricao, caracteristicas, fotos,
slug, publicado_no_site
```

Detalhes que vieram do sistema real e não são arbitrários:
- **Não existe `suites`.** O Kenlo só tem Dormitórios + N° de banheiros. Não invente o
  campo.
- **`andar_unidade` e `total_andares_predio` são campos diferentes** (andar da unidade
  vs. total de andares do prédio). Não unifique em `andares`.
- **`bairro` é o "bairro comercial"**, não o bairro oficial/cadastral — é o nome que o
  visitante procura. No Kenlo são dois campos distintos.
- **`valor_m2` não existe e não deve ser armazenado** — é derivado
  (`preco_venda / area_util`).

### Estrutura de URL (SEO — já indexada no Google)
```
/imoveis/{a-venda|para-alugar}/{tipo}/{cidade}/{bairro}
/imovel/{slug}/{codigo}
```
O site atual está indexado nesses padrões. **Alterar custa posicionamento** e exige
redirect 301. O `codigo` no fim da URL do imóvel (`AP0757-MBNH`) é o que preserva o
link antigo — nunca remova.

---

## Identidade visual

**Tipografia aprovada pelo cliente:** Cormorant Garamond (títulos, serifada) + Inter
(corpo) + Roboto Mono (números do imóvel: preço, código, m², quartos, vagas). As fontes
estão auto-hospedadas em `public/fonts/`.

> Instruções anteriores neste projeto pediam Roboto em tudo. **Ficou superado** — o
> cliente mandou uma referência editorial e aprovou este resultado. Vale o que está no
> código.

**Números do imóvel usam a mono de propósito** (`.mono`), como ficha técnica. É
deliberado, não descuido de estilo.

⚠️ **Divergência de cores em aberto:** o `globals.css` usa `--verde: #173b33` e
`--sol: #b98847`. As cores oficiais da marca, extraídas do logo, são `--verde: #2F7E68`
e `--sol: #C68A2E`. Os nomes das variáveis são os mesmos, os valores não. Isso ainda
não foi decidido com o cliente — **não "conserte" para um lado sem perguntar**, e se
for ajustar, ajuste os dois (fundo vs. texto) mantendo contraste WCAG AA.

**Regra de contraste que vale sempre:** verde escuro só como fundo (com texto claro em
cima) ou como texto sobre fundo claro. `#2F7E68` como cor de *texto* sobre o fundo
bege reprova AA (4,03:1) — por isso existe a variante mais escura.

---

## Tom do conteúdo

Posicionamento: **"a imobiliária que conhece o bairro de verdade"**. Fale de ruas e
bairros pelo nome, voz de quem atende no balcão da loja.

- **Nunca** use superlativo vazio: "excelência", "realizando sonhos", "o imóvel
  perfeito", "os melhores bairros da cidade".
- **Nunca invente número sobre a empresa** — anos de mercado, clientes atendidos, nota
  de avaliação. Onde precisar do dado, escreva `[CONFIRMAR]` visível na tela.
  - O `359` de imóveis ativos na home **é real** (levantado do sistema atual).
  - Os outros números da mesma seção ("6+ bairros", "3 canais", "1 equipe") são
    genéricos e devem ser confirmados ou removidos.

---

## Pendências técnicas conhecidas

1. **Imagens pesadas.** As fotos em `public/imoveis/` e `public/*.png` têm 2–3,5 MB
   cada, sem otimização. São 13 arquivos. Antes de qualquer publicação séria, comprimir
   e redimensionar — o público é majoritariamente mobile.
2. **O hero da home é uma imagem única** (`og-editorial.png`, ~2 MB) com logo, headline
   e foto achatados num PNG. Consequências: a headline não é texto real (tem um `<h1
   className="sr-only">` compensando a acessibilidade, mas não o SEO por completo) e a
   composição não reflui no celular — a arte encolhe inteira. É uma escolha estética
   aprovada; se for mexer, saiba o que está trocando.
3. **Fotos de imóvel não devem ter marca d'água.** No sistema atual a marca é aplicada
   só na saída para os portais, não no arquivo original.

---

## Contexto de negócio (leitura obrigatória antes do back-end)

`docs/PLANO-BACKEND.md` tem o levantamento completo do sistema atual (Kenlo): todos os
campos do cadastro, o que é dado interno que **nunca** pode aparecer no site
(proprietário, comissão, matrícula, chaves), onde estão os feeds XML dos portais, e o
pipeline de migração.

Dois pontos de alto risco documentados lá:
- **O feed XML para ZAP/Viva Real/OLX é a parte mais perigosa do projeto.** Se quebrar
  em silêncio, os imóveis somem dos portais e ninguém percebe até o telefone parar de
  tocar.
- **As URLs de feed contêm token de acesso** no parâmetro `p=`. Tratar como credencial:
  variável de ambiente, nunca em código client-side, nunca em commit.

# PLANO-BACKEND.md — Sair do Kenlo para o Supabase

> **Nota de origem (28/07/2026):** este documento nasceu no repositório
> `imoveismav-site` (protótipo HTML estático) e foi trazido pra cá quando o projeto
> principal passou a ser este — Next.js gerado pelo Codex, com o layout/tipografia
> escolhidos pelo cliente. O levantamento do Kenlo (seção 1), o schema (seção 3) e o
> plano de migração (seção 4) valem igual, independente do front-end escolhido — são
> sobre o back-end e a origem dos dados, não sobre layout. `imoveismav-site` continua
> existindo em paralelo como referência.
>
> **Decisão de banco (28/07/2026): Supabase, não Cloudflare D1.** Este projeto veio
> com D1 + Drizzle escalado por padrão (`db/schema.ts`, `.openai/hosting.json`) — está
> **intencionalmente vazio e não deve ser usado**. Todo o levantamento de campos abaixo
> foi feito pensando em Postgres/Supabase, com RLS. Ver observação técnica na seção 2.

Documento de trabalho da Fase 2 (back-end). Parte do que está aqui é **proposta**; o
que depende de olhar o painel do Kenlo está marcado como `[PRECISA DO PAINEL]`.

Premissa combinada com o cliente: o Kenlo **só é cancelado** depois do sistema novo
rodando redondo, com os dois em paralelo. Prazo alvo: 3 meses.

---

## 1. Levantamento do Kenlo — o que capturar

A tese do projeto é que a imobiliária **não usa nem metade** do que o Kenlo oferece. Antes
de replicar qualquer coisa, é preciso separar o que é usado de verdade do que é peso morto.
Para cada item abaixo, um print (ou um "não existe" / "existe mas ninguém usa").

### 1.1 Cadastro de imóvel — o que mais importa

**Capturado em 25/07/2026** (tela "Novo Imóvel", `imob.valuegaia.com.br` — Kenlo é
white-label, o painel roda em domínio da Valuegaia). Campos observados, seção por seção:

**Proprietário** — Nome*, Tel. Residencial*, Tel. Comercial*, Celular*, E-mail,
Mídia de origem* (dropdown), "Enviar atividades por e-mail" (periodicidade). Suporta
múltiplos telefones/e-mails. **Dado pessoal — não entra em `imoveis_publicos`.**

**Estrutura** — Finalidade* (Residencial/…), Tipo* (dropdown, vazio no print).
`[PENDENTE]` provavelmente destrava campos condicionais (quartos, m², preço) — ver nota
abaixo.

**Localização** — Buscar por (Logradouro), País, Estado, Cidade, Logradouro
(autocomplete). **Sem campo de bairro visível** — hipótese: vem do autocomplete de
logradouro, a confirmar.

**Características** — Cadastro por, Referência alternativa, Status* (Ativo/…),
Pretensão* (checkbox Venda/Locação — pode ser os dois), Condição de pagamento IPTU/ITR,
Valor IPTU/ITR, Valor seguro fiança, Valor seguro incêndio, Padrão, Padrão da
localização, Situação do imóvel, Locado, Autorizado p/ comercialização, Exclusividade,
Ano de construção, Ano da reforma, Usou FGTS últimos 3 anos, Aceita financiamento,
Zoneamento, Valor de venda avaliado, Valor de locação avaliado, **Comentários internos
(rótulo diz "visível apenas para a imobiliária")**, Marcadores (tags livres, ex.
"Promoção").

**Controle de Chaves** — Local das chaves (dropdown).

**Fotos** — drag-and-drop ou "Buscar imagens". Cada foto tem checkbox própria
**"Aparecer no site"** + botão Excluir — ou seja, o controle de publicação é **por
foto**, não só por imóvel. Tem modo slideshow/grade/lista (sugere reordenação por
arrastar). Sem legenda visível no print.

**Publicação na web** — **Anunciar** (Sim/Não — este é o flag real de
`publicado_no_site`), Imóvel em destaque, Imóvel em super destaque, Link YouTube, Tour
Virtual (URL), **Descrição do Site** (textarea — mapeia para `descricao`).

**Placas e faixas** — Placa no local (Sim/Não).

**Comissões e condições** — Tipo de Comissão*, Corretor*, "Captou qual pretensão"
(Venda/Locação/Somente venda/Somente locação), Comissão (%), data, +Adicionar (várias
linhas), Condição Comercial (texto). **Interno, não entra no site.**

**Confidencial** (seção com esse nome exato — reforça que é interno) — Código IPTU,
Número da Matrícula, Cartório, Código rede elétrica, Código rede água, Títulos/Direitos,
Aprovado órgão ambiental, Projeto aprovado, Observações da documentação. **Nunca vai
para `imoveis_publicos`.**

**Arquivos** — upload de arquivo genérico (contrato, laudo etc.), com autor/data/permissão.

---

**Confirmado em 25/07/2026** — os campos "que faltavam" são mesmo condicionais: só
aparecem depois de escolher Tipo = Apartamento e marcar Venda/Locação em Pretensão.

**Ao escolher Tipo = Apartamento**, aparece:
- **Nome do condomínio/edifício** — combobox de busca ("Selecione um empreendimento"),
  com ação "Adicionar condomínio/edifício". **Confirma a hipótese: condomínio é
  entidade própria vinculada, não texto livre.** A taxa mensal do condomínio não
  apareceu aqui — provavelmente vive no cadastro do próprio Condomínio (seção 1.1.1).
- Uma seção nova inteira, **"Detalhes"**, com subgrupos:
  - **Metragem:** Área total, **Área útil\*** (obrigatório), Área comum, Área
    Privativa, Posição solar/Face (Não informado/Leste/Manhã/Norte/Oeste/Sul/Tarde),
    Posição (Não informado/Frente/Fundos/Lateral).
  - **Infraestrutura** (checkboxes + alguns numéricos): Alarme, Altura do pé direito,
    Ar condicionado, Aquecimento de água a gás, Aquecimento de água c/ energia solar,
    Depósito, Elevador, Gerador, Imóvel no litoral, Imóvel sem condomínio, Interfone,
    Internet, Jardim de inverno, Lareira, Mezanino, Mobiliado, **N° de andares**
    (do prédio), **N° do andar** (da unidade — campo distinto!), Pé direito duplo,
    Portão eletrônico, Semi-Mobiliado, Terraço, TV a cabo, Vagas cobertas, Vagas
    descobertas, Vagas (total, número).
  - **Serviços:** Área de serviço, Ban. de empregada, Copa, Cozinha, Despensa,
    Dorm. Empregada, Lavanderia, Zelador.
  - **Lazer:** Adega, Campo de futebol, Churrasqueira, Ofurô, Piscina, Playground,
    Quadra de Tênis, Quadra Poliesportiva, Quintal, Sauna, Solarium, Varanda gourmet,
    Vestiário.
  - **Social:** Aceita Pet, Escritório, N° de salas, Sacada, Varanda.
  - **Íntima:** **Dormitórios\*** (obrigatório), **N° de banheiros\*** (obrigatório),
    Hidromassagem, Lavabo, Dormitório reversível. **Não existe campo de "suítes"
    separado.**
  - **Armários** (por cômodo): Área de serviço, Banheiro, Closet, Corredor, Cozinha,
    Dormitórios, Dorm. Empregada, Escritório, Home theater/cinema, Sala.
  - **Piso:** Aquecido, Ardósia, Bloquete, Carpete, Carpete de acrílico, Carpete de
    madeira, Carpete de nylon, Cerâmica, Cimento queimado, Contrapiso, Emborrachado,
    Granito, Laminado, Mármore, Porcelanato, Tábua, Taco de madeira, Vinílico.

**Ao marcar Venda:** Valor de venda\*, Valor m² de venda, Motivo Venda\* (interno —
comprar outro imóvel, investimento, dívidas, mudança...), Aceita permuta (Sim/Não).

**Ao marcar Locação** (além de Venda): Valor de locação\*, Valor m² de locação, Tipo de
Locação (Mensal/Mensal e Diária/Anual/Anual e Diária/Diária), Taxa de Administração
(%)\*, Pacote de locação. Os dois blocos (venda + locação) coexistem se as duas
pretensões estiverem marcadas.

- [x] Tela de cadastro (dados gerais) — capturado.
- [x] Campos condicionais de Tipo + Pretensão — capturado.
- [x] Cadastro de **Condomínio** — capturado, ver seção 1.1.1. **Gap real encontrado:
      não existe taxa de condomínio em lugar nenhum** (nem no imóvel, nem no
      condomínio) — ver alerta abaixo.
- [x] Bairro/endereço — capturado, ver seção 1.5. Não deu pra confirmar o autocomplete
      (o campo estava `readonly` no imóvel testado), mas achou algo mais importante:
      **dois campos de bairro diferentes**.
- [x] Fotos: ordenação e legenda — capturado, ver seção 1.6.
- [ ] Existe rascunho / publicado / despublicado além do toggle "Anunciar"? — ainda
      não verificado.

### 1.1.1 Cadastro de Condomínio — capturado em 27/07/2026

Aberto via **+Novo > Condomínio**, fechado sem salvar. Campos obrigatórios: Nome do
empreendimento\*, Status comercial\*, Tipo de condomínio\*.

Estrutura parecida com o imóvel, mas em escala de **prédio**: Localização (mesmo
padrão Buscar por/País/Estado/Cidade/Logradouro), dados primários (Sistema de vendas,
Fase da construção, Ano construção, Administradora/Arquitetura/Paisagismo (empresa),
Incorporadora, Construtora, Fachada, Padrão, **Valor mínimo/Valor máximo**, Disponível
para venda, Comentários internos), contatos de **Zelador/Porteiro/Síndico/Vigia/
Manobrista/Diarista** (nome, telefone, e-mail, cargo), e uma seção "Detalhes" com
listas de comodidades **do prédio** — bem mais rica que a do imóvel, com grupos
Plano/Governo, Comercial/Industrial, Infraestrutura, Lazer (Academia, Salão de festas,
Espaço Gourmet, Espaço Pet...), Segurança (Portaria 24h, Circuito interno de TV,
Guarita blindada...), Serviços, Social. Tem publicação no site própria (Publicar no
site, Destaque, Tour Virtual, Descrição do site) e fotos próprias do prédio.

> **⚠️ Gap real, não é só falta de investigar:** o campo que a gente esperava achar
> aqui — **valor/taxa mensal do condomínio** — não existe nem no cadastro do imóvel
> nem no do Condomínio. Existem "Valor mínimo"/"Valor máximo" no Condomínio, mas isso
> lê como faixa de preço de venda das unidades do empreendimento, não taxa condominial.
> Ou esse dado mora em algum lugar que ainda não vimos (financeiro/contratos de
> locação, talvez), ou o Kenlo simplesmente não estrutura isso e a imobiliária guarda
> em texto livre/planilha própria. **Precisa confirmar com a equipe MAV diretamente**
> — não é algo pra resolver só navegando o painel. Enquanto não confirmar, o campo
> `condominio_valor` do schema (seção 3) fica como entrada manual na importação, não
> como algo extraído automaticamente.

> **📌 Observação de escopo:** boa parte deste cadastro (Sistema de vendas, Fase da
> construção, Incorporadora, Construtora, Plantão no local, Hotsite do empreendimento,
> Valor mínimo/máximo, Minha Casa Minha Vida) é vocabulário de **incorporadora vendendo
> lançamento na planta** — não do perfil da MAV (imobiliária de bairro, imóvel usado/
> revenda). É outro exemplo de módulo do Kenlo que veio no pacote e não é usado de
> verdade. **Do cadastro de Condomínio, só interessa pro site:** nome do
> empreendimento, endereço, e as listas de comodidades do prédio (Lazer, Segurança,
> Infraestrutura) — o resto fica de fora do schema.

### 1.2 Exportação / API / feed dos portais — capturado em 27/07/2026, **decisão resolvida**

- Não existe exportador geral de imóveis (CSV/XLS/XML/JSON) em Configurações, Portais
  ou na busca. Existe um link "Excel" na tela de "Visualizar carga" de um portal, mas
  é por carga específica, não um export geral.
- Não existe API/webhook documentado nas telas visitadas.
- **Achou as URLs de feed de verdade** — a "mina de ouro" da seção 4.1 existe e foi
  localizada, em Imóveis > Portais > Configurar de cada portal:
  - GaiaWebService: `.../integra/midia.ashx?midia=GaiaWebServiceImovel&p=...`
  - OLX Premium: `.../integra/midia.ashx?midia=OLXPremium&p=...`
  - Viva Real: `https://feed-integration.ingaia.com.br/grupozap/{id}`
  - ZAP: `https://feed-integration.ingaia.com.br/grupozap/{id}`
  - (URLs completas ficam no `imoveismav-site`, não replicadas aqui — ver observação
    de segurança abaixo.)
  - 5 portais no total conectados e enviando carga automática: Chaves Na Mão,
    GaiaWebService, OLX Premium Novo, Viva Real, ZAP. Cada um com cota de anúncios do
    plano contratado (ex.: Chaves Na Mão 348/500 Normal, 7/10 Destaque).
- **Total de imóveis:** 356 ativos, mas **2.418 no total incluindo inativos** — número
  bem maior do que os ~358 do dashboard. **A migração deve pegar só os ativos**; os
  outros ~2.060 são histórico (vendido/alugado/inativo) e não interessam ao site novo.

> **⚠️ Segurança:** essas URLs de feed têm um parâmetro `p=` que funciona como um
> token de acesso — é o que autentica o portal a ler o feed. Tratar como credencial:
> não printar/colar em lugar público, não expor em código client-side. Guardar como
> segredo (variável de ambiente).

**Decisão de caminho (seção 4.1) fica resolvida:** o feed do Viva Real ou do ZAP
(formato GrupoZap, é o mais rico dos cinco pra imóvel residencial) é o caminho de
migração — dá pra buscar essa URL diretamente e parsear o XML, sem precisar de CSV
nem raspagem. Próximo passo técnico: baixar um desses feeds e inspecionar o schema
XML real pra fechar o mapeamento de campos do pipeline (seção 4.2).

> **Cobertura do feed — nem tudo que está no Kenlo está nos portais, mas é pouco.**
> Fazendo a conta com os números acima: de 356 ativos, cada portal recebe 354-355
> (ZAP 325+27+1+2=355; Viva Real 329+23+1+2=355; OLX 355; GaiaWebService 354; Chaves
> na Mão 348+7=355). A diferença é de **1 a 2 imóveis por portal**, não uma fatia
> grande — provavelmente exclusividade recente ou imóvel retirado temporariamente.
> Migração vira **híbrida**: feed importa o grosso automaticamente; depois compara os
> códigos recebidos contra a busca "Status: Ativo" (356) e cadastra manualmente o que
> faltar no painel novo. Mais barato que construir um segundo caminho de importação
> pra um punhado de exceções.
>
> **Cobertura por campo é separada da cobertura por imóvel.** O feed só carrega o que
> o portal precisa mostrar ao comprador — os campos que já decidimos excluir do site
> (proprietário, comissão, confidencial) não fazem falta por não estarem lá. Mas
> campos que o schema (seção 3) quer e que podem não ser padrão no XML do GrupoZap
> (posição solar, aceita permuta, mobiliado, classificação de foto) só vão ser
> confirmados quando o XML real for aberto — se faltarem, viram preenchimento manual
> pontual no painel novo, não bloqueiam a importação do resto.

### 1.2.1 Existe exportação geral no Kenlo? — **resolvido em 27/07/2026**

Sim, mas não é o que precisamos. Varredura em Importação de fichas (só aceita .MDB
pra importar, não exporta nada), Documentos (só upload de arquivo/modelo de proposta,
sem export), Indicadores > Estatísticas ("Ranking de bairros" tem export Excel, mas é
estatística agregada por bairro, não ficha de imóvel) e Indicadores > Kenlo
Inteligência > Relatórios:

- O relatório **"Portfólio ativo"** tem export de verdade — botão "Fazer o download
  dos dados" dentro do menu de ações da tabela.
- Mas as colunas são: `Ref. Imóvel`, `Pretensão`, `Status`, `Data de cadastro`,
  `Imóvel Atualizado`, **`Proprietário`, `E-mail`, `Telefone Proprietário`**,
  `Logradouro`, `Bairro`, `Captador`, `Total de Imóveis Fracionados`. **Sem preço, sem
  área/quartos/vagas/características.** É relatório de gestão/CRM (quem cadastrou,
  dado de contato do dono), não catálogo de vendas.

**Conclusão: não muda a decisão da seção 4.1.** O feed dos portais continua sendo o
caminho pra dados de listagem (preço, specs, fotos) — os exports que existem no Kenlo
são todos administrativos, nenhum serve pra alimentar o site. O "Portfólio ativo"
ganha um uso secundário: é a fonte mais prática pra lista de reconciliação da etapa 8
do pipeline (seção 4.2), já que trás `Ref. Imóvel` + `Status` + `Bairro` de todos os
ativos numa exportação só, em vez de ler a busca tela por tela.

### 1.3 O resto do sistema — mapeado em 27/07/2026

Mapa completo do menu, com uso observado (sem abrir dado pessoal de cliente):

| Módulo | Situação |
|---|---|
| Indicadores (+ Kenlo Inteligência, Metas e resultados, Estatísticas) | Em uso — 356 ativos, 3.207 leads aguardando transferência |
| Atendimentos (+ Agenda, Base de clientes, Envelopes, Propostas e negociações, Radar e parcerias, Transferência automática/manual) | Em uso — funil de leads é o módulo mais carregado do sistema |
| Imóveis (+ **Condomínios**, Controle de chaves, **Portais**, Roteiros de visita, **Importação de fichas**) | Em uso — Portais confirmado ativo (seção 1.2) |
| "1 koins" (Painel, Lya Editor, Lya Studio, Marketplace, Integrações) | Presente, uso não verificado — parece ser um add-on de IA do Kenlo, não confirmado se a MAV usa |
| Documentos (Captação de imóvel, Captação de empreendimentos, Documentos personalizados, Outros documentos) | Presente, uso não verificado |
| Ajuda (Chamados, FAQ, Status do sistema, Treinamentos) | Presente, uso não verificado |

- **Portais conectados:** Chaves Na Mão, GaiaWebService, OLX Premium Novo, Viva Real,
  ZAP — todos enviando carga automática (confirma seção 1.2).
- **Usuários:** 6 ativos, 6 contratados no plano (bate no limite exato). Perfis:
  Diretor, Supervisor, Gerente (Líder Equipe), Corretor, Auxiliar Adm.,
  Telefonista/Atendente.
- **Achado que merece atenção separada do escopo do site:** 3.207 leads aguardando
  transferência é um número alto e crescente (era 3.199 há alguns dias). Vale
  perguntar pro cliente se isso é backlog real (funil de atendimento afogado) — é uma
  dor operacional da imobiliária, independente do projeto do site.
- **"Imóveis > Importação de fichas"** existe como módulo próprio do Kenlo — vale uma
  olhada rápida depois: mesmo sendo import (não export), pode indicar que o Kenlo tem
  ferramenta de bulk equivalente que ajude a entender o formato de dados esperado.

> **Regra:** o sistema novo só precisa cobrir o que está em uso. "1 koins", Documentos
> e Ajuda ficam de fora do escopo até alguém confirmar uso real.

### 1.4 Contrato com o Kenlo — tentado em 27/07/2026, sem sucesso

A tela **"Planos e faturas"** (`.../admin/#/modules/assinaturas/area-do-cliente.aspx`)
está com o backend de cobrança (**Superlógica**, plataforma terceirizada de
assinaturas) fora do ar — retornou "Erro Superlógica - As informações estão
indisponíveis no momento" e falha ao carregar o chat de suporte. Nenhum dado de valor
mensal, renovação ou aviso prévio foi obtido.

- [ ] Tentar de novo em outro dia (pode ser instabilidade pontual da Superlógica).
- [ ] Se continuar fora, essa informação provavelmente só existe em contrato assinado/
      e-mail — perguntar direto pro financeiro da MAV em vez de insistir no painel.

### 1.5 Bairro / endereço — capturado em 27/07/2026

Não deu pra testar o fluxo completo de autocomplete: no imóvel aberto para edição, o
campo `Endereço:` estava **`readonly`** (só permite digitar num cadastro novo,
aparentemente, não numa edição). Mas apareceu algo que muda o schema:

- **Existem dois campos de bairro, não um:**
  - `*Bairro:` — texto livre, obrigatório (provavelmente o bairro oficial/cadastral).
  - `Bairro comercial/site:` — **lista fechada**, com nomes comerciais de bairro
    (o que aparece pro público, tipo "Vila Valqueire" como área reconhecida por quem
    procura imóvel, que pode não coincidir 1:1 com o bairro oficial do IBGE/Correios).
  - `Cidade:` é texto livre (não dropdown) no formulário observado, com `UF:` e `CEP:`
    também presentes.

**Decisão pro schema:** o site deve usar **`Bairro comercial/site`**, não `Bairro` —
é o que corresponde à forma como a MAV já pensa a navegação por bairro. Isso já bate
com o `data.ts` deste projeto, que usa nomes de bairro comerciais (Vila Valqueire,
Praça Seca etc.).

### 1.6 Fotos: ordenação e legenda — capturado em 27/07/2026

- **Ordenação:** fotos aparecem numeradas (1 a 18 no imóvel observado); não foi
  confirmado drag-and-drop, a interface mostrou numeração, não um indicador de
  arrastar.
- **Legenda:** sim — cada foto tem campos próprios `Sem título` / `Sem descrição`
  (ou seja, título + descrição por foto).
- **Classificação por foto:** Foto, Banner, Perspectiva, Decorado, **Foto planta** —
  útil: dá pra distinguir foto real de planta baixa/decorado direto nos metadados,
  em vez de adivinhar pelo nome do arquivo.
- **Limite:** nenhum limite numérico encontrado (18 fotos sem aviso de limite).
- **Marca d'água:** não é por foto no cadastro — é configurada por **portal** de
  destino (`*Inserir marca d'água nas fotos` = Sim pra OLX Premium, Viva Real, ZAP).
  Ou seja: **as fotos que migram pro nosso site devem ser as originais, sem marca
  d'água** — a marca só é aplicada na saída pros portais, não existe no arquivo fonte.
- Confirmado de novo: "Aparecer no site" é por foto, com ação em lote "Marcar todos",
  e existe flag de "Foto de capa" (uma foto marcada como capa).

---

## 2. Arquitetura proposta

```
Visitante ──> mav-imoveis (Next.js, hospedado na Vercel ou Cloudflare Workers)
                   │
                   ├── lê imóveis ──> Supabase: tabela imoveis_publicos (RLS, leitura anônima)
                   ├── fotos      ──> Supabase Storage (bucket público)
                   └── formulário ──> Supabase: tabela leads

Portais (ZAP / Viva Real / OLX)
       └── consomem <── Edge Function (Supabase) ou Route Handler (Next.js): feed XML VrSync

Equipe MAV ──> painel de cadastro (área logada, Supabase Auth)
```

Projeto Supabase: `5e43322f-bda5-4e47-8bf6-937f86328160`, compartilhado com o
Gestão Aluguéis MAV. `imoveis_publicos` fica **separada** da tabela de gestão — o que o
site expõe é um recorte publicável, não a base interna.

> **Nota técnica sobre este repositório:** o Codex montou o projeto com o template
> padrão dele (Cloudflare Workers + D1 + Drizzle — ver `db/`, `drizzle/`,
> `.openai/hosting.json`). Como a decisão foi manter Supabase, esse scaffolding **fica
> sem uso** — não apagar de cara (é inofensivo, `db/schema.ts` está vazio), mas a
> integração real de dados vai usar o cliente Supabase (`@supabase/supabase-js` ou
> equivalente para Server Components), não o `drizzle-orm/d1` que já está instalado.
> Se em algum momento o projeto for hospedado só em Cloudflare Workers (não Vercel), a
> conexão ao Supabase Postgres a partir do Workers runtime precisa usar o driver HTTP
> do Supabase (`postgres.js` puro por TCP não funciona no runtime de Workers).

## 3. Esquema inicial

Os nomes de campo **já batem com o `app/data.ts` deste repositório** — o Codex, mesmo
sem ver este documento, chegou nos mesmos nomes a partir do prompt de front-end
(`codigo`, `finalidade`, `preco_venda`, `andar_unidade`, `total_andares_predio`,
`aceita_permuta`, `posicao_solar` etc.). Isso é uma coincidência favorável: a
importação real vai popular a mesma estrutura de tipo `Imovel` que o front-end já
consome, só trocando o array estático por uma consulta ao Supabase.

Principais decisões vindas do levantamento real do Kenlo (seção 1):

- **Sem `suites`** — Kenlo não tem esse campo (só Dormitórios + N° de banheiros).
- **Andar em dois campos** — Kenlo distingue "N° do andar" (da unidade) de
  "N° de andares" (total do prédio). O `data.ts` já reflete isso corretamente.
- **`condominio_valor`** — no Kenlo é `[PENDENTE]` (seção 1.1.1): não existe um campo
  de taxa mensal em lugar nenhum do sistema. Vai precisar de confirmação manual com a
  equipe MAV, não é extraível automaticamente do feed/painel.
- `mobiliado`, `aceita_pet`, `aceita_permuta`, `posicao_solar` — existem no Kenlo e já
  estão no `data.ts`. **Diferença a ajustar:** o `data.ts` trata `mobiliado` como
  `boolean`; o Kenlo tem três estados (Mobiliado / Semi-Mobiliado / Não) — ao migrar
  dados reais, decidir se o site quer só sim/não ou os três estados.

```sql
create table imoveis_publicos (
  id                    uuid primary key default gen_random_uuid(),
  codigo                text unique not null,          -- AP0757-MBNH
  tipo                  text not null,                 -- apartamento, casa, cobertura...
  finalidade            text not null,                 -- venda | aluguel | venda_aluguel
  preco_venda           numeric,
  preco_aluguel         numeric,
  tipo_locacao          text,                          -- mensal | anual | diaria | mensal_e_diaria | anual_e_diaria
  condominio_nome       text,                          -- nome do empreendimento/edifício (Kenlo: entidade própria)
  condominio_valor      numeric,                       -- [PENDENTE] confirmar com a equipe MAV onde esse valor é controlado hoje
  iptu_anual            numeric,
  area_util             numeric not null,              -- Kenlo: obrigatório
  area_total            numeric,
  quartos               int not null,                  -- Kenlo: "Dormitórios", obrigatório
  banheiros             int not null,                  -- Kenlo: "N° de banheiros", obrigatório
  vagas                 int,
  andar_unidade         int,                            -- Kenlo: "N° do andar"
  total_andares_predio  int,                            -- Kenlo: "N° de andares"
  elevador              boolean default false,
  mobiliado             text default 'nao',             -- nao | semi | mobiliado
  aceita_pet            boolean default false,
  aceita_permuta        boolean default false,
  posicao_solar         text,                           -- leste | oeste | norte | sul | manha | tarde
  posicao               text,                           -- frente | fundos | lateral
  endereco              text,                           -- rua, sem número (número só na visita)
  bairro                text not null,                  -- Kenlo: "Bairro comercial/site" (NÃO o "*Bairro" oficial/cadastral — seção 1.5)
  cidade                text not null default 'Rio de Janeiro',
  uf                    text not null default 'RJ',
  descricao             text,
  caracteristicas       text[],                         -- flatten dos grupos Infraestrutura/Serviços/Lazer/Social/Armários/Piso marcados como "sim"
  fotos                 jsonb,                          -- [{url, ordem, capa}]
  slug                  text,                           -- para /imovel/{slug}/{codigo}
  publicado_no_site     boolean default false,          -- Kenlo: campo "Anunciar"
  criado_em             timestamptz default now(),
  atualizado_em         timestamptz default now()
);

-- valor_m2 é derivado, não se guarda: preco_venda / area_util
```

RLS: leitura anônima **só** onde `publicado_no_site = true`; escrita só autenticado.

**Dados do Kenlo que ficam de fora de propósito** (internos, nunca em `imoveis_publicos`):
Proprietário (tudo), Comentários internos, Motivo Venda, Comissões e condições,
Confidencial (matrícula, cartório, códigos de rede), Controle de Chaves, Arquivos.

## 4. Migração dos dados

### 4.1 Decisão de caminho — **resolvida em 27/07/2026**

~~1. XML do VrSync do Kenlo~~ **→ confirmado, é este o caminho.** As URLs de feed do
Viva Real e do ZAP (formato GrupoZap) foram localizadas (seção 1.2) e são a fonte —
dados já estruturados, com fotos e todos os campos que os portais exigem. Não foi
preciso CSV nem raspagem.

Próximo passo técnico (ainda não feito): baixar um desses feeds e inspecionar o XML
real pra fechar o mapeamento de campo a campo do pipeline abaixo (4.2) — o crosswalk
atual (seção 1.1) foi montado a partir da **tela de cadastro**, não do XML de saída;
os nomes de tag do XML provavelmente são diferentes (formato GrupoZap tem schema
próprio, documentado publicamente pela Grupo ZAP/OLX) e precisam de um segundo
mapeamento: **rótulo do Kenlo → tag do XML → coluna do schema**.

<details>
<summary>Caminhos alternativos descartados (mantido por histórico)</summary>

1. ~~Exportação CSV/XLS do painel~~ — não existe exportador geral (confirmado, seção 1.2).
2. ~~Raspagem do `imoveismav.com.br`~~ — desnecessária agora que o feed foi achado.
</details>

### 4.2 Pipeline (etapa a etapa)

1. **Ler a origem** (XML do feed) e carregar cru numa tabela de **staging**
   (`imoveis_staging`, mesma forma do feed, sem validar nada ainda) — nunca escrever
   direto em `imoveis_publicos`. Isso permite rodar de novo sem gambiarra se der
   problema na metade.
2. **Mapear campos**, usando o crosswalk já levantado na seção 1.1 (rótulo do Kenlo →
   coluna do schema): `Dormitórios`→`quartos`, `N° de banheiros`→`banheiros`, `Área
   útil`→`area_util`, `Valor de venda`→`preco_venda`, etc.
3. **Achatar as comodidades** dos grupos Infraestrutura/Serviços/Lazer/Social/
   Armários/Piso num único `caracteristicas text[]`, incluindo só o que fizer sentido
   pro visitante ver (ex.: incluir "Piscina", "Churrasqueira", "Elevador"; **não**
   incluir flags de modelagem de dados como "Imóvel sem condomínio").
4. **Gerar `slug`** a partir de tipo + bairro + quartos + m² (padrão que este projeto
   já usa em `data.ts`/rotas estáticas) — e **preservar o `codigo` exatamente como
   está no Kenlo**, porque as URLs antigas (`/imovel/{slug}/{codigo}`) dependem dele.
5. **Baixar as fotos de verdade** — só as marcadas "Aparecer no site" (controle é por
   foto, seção 1.1) — e subir pro Supabase Storage. Nunca apontar pra `img.kenlo.io`.
6. **Validar antes de publicar**: `area_util`, `quartos`, `banheiros` não nulos; preço
   presente pra cada finalidade marcada; pelo menos 1 foto. Falhou validação → fica de
   fora e vira item de revisão manual, não trava o resto do lote.
7. **Promover para `imoveis_publicos`** com `publicado_no_site = false` por padrão —
   a equipe MAV revisa e publica manualmente, imóvel a imóvel, antes de ir ao ar.
   Preço errado no site é problema comercial, não bug; não publicar em massa sem olhar.
8. **Reconciliar contra o Kenlo** — comparar os códigos recebidos do feed contra a
   busca "Status: Ativo" no Kenlo (356-359 nos levantamentos de 27/07 — o número
   varia um pouco entre snapshots, é normal). Os que faltarem (esperado: 1-2, ver
   seção 1.2) são cadastrados manualmente no painel novo, não pelo pipeline
   automático. **Fonte pra essa lista:** o relatório **Indicadores > Kenlo
   Inteligência > Portfólio ativo** tem botão de download ("Fazer o download dos
   dados") com colunas `Ref. Imóvel` + `Status` + `Bairro`.
9. **Trocar `app/data.ts` estático por consulta ao Supabase** — como o `Imovel` type
   já bate com o schema (seção 3), essa troca é mecânica: os componentes
   (`PropertyCard`, `ListingClient`, página de imóvel) não devem precisar mudar de
   forma, só a fonte dos dados.

### 4.3 Decisão em aberto: quem é a fonte da verdade durante os 3 meses em paralelo

Isto **não é uma migração de uma vez só**. Enquanto o Kenlo continuar sendo usado (e vai
ser, até o cancelamento), a equipe continua cadastrando imóvel novo e mudando preço lá
dentro. Se a importação for só um evento único no início, o site novo desatualiza em
dias.

Duas saídas, e vale decidir isso com o cliente **antes** de escrever o script de
importação, porque muda a arquitetura:

- **(a) Re-sincronizar periodicamente do Kenlo** (reimportar o XML toda noite, por
  exemplo) — a equipe continua cadastrando só no Kenlo, o Supabase é sempre um
  espelho. Mais simples pra equipe, mas o site novo fica sempre "atrás" pelo
  intervalo de sync, e o pipeline da seção 4.2 vira um job recorrente, não um script
  de uma vez.
- **(b) Virar a chave cedo** — o painel de cadastro novo (seção 6) vira a fonte da
  verdade assim que estiver pronto, e a equipe passa a cadastrar **só nele**; o Kenlo
  fica congelado (só para o que ainda depende dele, tipo o feed antigo até o novo
  homologar). Zero risco de desatualização, mas a equipe cadastra duas vezes durante a
  transição do feed, e o painel novo precisa estar pronto bem antes do fim dos 3 meses.

Sem essa decisão, o cronograma da seção 7 fica furado no meio.

## 5. Feed XML para os portais

É a parte de maior risco do projeto: se o feed quebrar em silêncio, os imóveis somem do
ZAP e ninguém percebe até o telefone parar de tocar.

- Gerar o XML no padrão **VrSync**, cadastrado no Canal Pro como "Desenvolvedor
  Próprio" — via Supabase Edge Function ou via Route Handler do próprio Next.js
  (`app/feed/route.ts`), o que for mais simples de manter dado o resto da stack.
- Rodar **em paralelo** com o Kenlo por 1–2 semanas, comparando a contagem de imóveis
  publicados em cada portal.
- Monitoramento: alerta se o feed cair, ficar vazio ou com contagem muito diferente da
  esperada. Sem isso, não cancelar o Kenlo.

## 6. Painel de cadastro

O que a equipe realmente precisa (confirmar com o levantamento da seção 1.3):
cadastrar/editar imóvel, subir e ordenar fotos, publicar/despublicar, e ver os leads.

Existe um protótipo navegável (sem back-end) no `imoveismav-site` (`docs/painel.html`)
que já valida os campos e o fluxo — serve de referência de UX pra construir a versão
Next.js/Supabase de verdade aqui.

Não replicar módulo que ninguém usa.

## 7. Ordem de execução

| # | Etapa | Depende de |
|---|---|---|
| 1 | Levantamento do Kenlo (seção 1) | prints do painel |
| 2 | Fechar esquema e criar tabelas + RLS no Supabase | 1 |
| 3 | Importar imóveis e fotos | 1, 2 |
| 4 | Trocar `app/data.ts` estático por consulta ao Supabase | 3 |
| 5 | Painel de cadastro (Next.js + Supabase Auth) | 2 |
| 6 | Feed XML + homologação no Canal Pro | 3 |
| 7 | Rodar em paralelo com o Kenlo, monitorando | 6 |
| 8 | Redirects 301 e virada de domínio | 7 |
| 9 | Cancelar o Kenlo | 8 + aviso prévio do contrato |

## 8. Pontos em aberto

- Quem mantém isso depois que o projeto acabar? Next.js/React exige mais conhecimento
  técnico que o `mockup.html` original — definir antes do corte, não depois.
- Onde hospedar de fato: Vercel (mais simples pra Next.js) ou Cloudflare Workers (o
  scaffolding já está no projeto, mas não foi testado em produção)?
- E-mail profissional `@imoveismav.com.br`: onde está hoje, e para onde vai.
- Onde o domínio está registrado e quem tem acesso ao DNS.
- Os leads do site vão para o Supabase, para o CRM, ou para os dois?

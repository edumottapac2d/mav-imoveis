export type Imovel = {
  codigo: string;
  tipo: string;
  finalidade: "venda" | "aluguel" | "venda_aluguel";
  preco_venda: number | null;
  preco_aluguel: number | null;
  condominio_valor: number | null;
  iptu_anual: number | null;
  area_util: number;
  area_total: number | null;
  quartos: number;
  banheiros: number;
  vagas: number;
  andar_unidade: number | null;
  total_andares_predio: number | null;
  elevador: boolean;
  mobiliado: boolean;
  aceita_pet: boolean;
  aceita_permuta: boolean;
  posicao_solar: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  descricao: string;
  caracteristicas: string[];
  fotos: string[];
  slug: string;
  publicado_no_site: boolean;
};

export const imoveis: Imovel[] = [
  {
    codigo: "AP0757-MBNH", tipo: "Apartamento", finalidade: "venda",
    preco_venda: 680000, preco_aluguel: null, condominio_valor: 600, iptu_anual: 1000,
    area_util: 116, area_total: 126, quartos: 3, banheiros: 2, vagas: 1,
    andar_unidade: 4, total_andares_predio: 6, elevador: true, mobiliado: false,
    aceita_pet: true, aceita_permuta: false, posicao_solar: "Sol da manhã",
    endereco: "Rua Alves do Vale", bairro: "Vila Valqueire", cidade: "Rio de Janeiro", uf: "RJ",
    descricao: "Apartamento amplo em uma rua tranquila de Vila Valqueire, com sala bem distribuída, circulação confortável e comércio do bairro por perto.",
    caracteristicas: ["Varanda", "Elevador", "Área de serviço", "Portaria", "Aceita pet"],
    fotos: ["/imoveis/ap0757-mbnh.png"], slug: "apartamento-rio-de-janeiro-3-quartos-116-m", publicado_no_site: true,
  },
  {
    codigo: "AP0617-MBNH", tipo: "Apartamento", finalidade: "venda",
    preco_venda: 500000, preco_aluguel: null, condominio_valor: 720, iptu_anual: 1180,
    area_util: 130, area_total: 140, quartos: 3, banheiros: 2, vagas: 1,
    andar_unidade: 2, total_andares_predio: 4, elevador: false, mobiliado: false,
    aceita_pet: true, aceita_permuta: false, posicao_solar: "Sol da tarde",
    endereco: "Rua das Verbenas", bairro: "Vila Valqueire", cidade: "Rio de Janeiro", uf: "RJ",
    descricao: "Planta generosa para quem valoriza cômodos grandes, numa rua conhecida e residencial, a poucos minutos do centro de Vila Valqueire.",
    caracteristicas: ["Sala em dois ambientes", "Área de serviço", "Dependência", "Aceita pet"],
    fotos: ["/imoveis/ap0617-mbnh.png"], slug: "apartamento-rio-de-janeiro-3-quartos-130-m", publicado_no_site: true,
  },
  {
    codigo: "AP0971-MBNH", tipo: "Apartamento", finalidade: "venda",
    preco_venda: 295000, preco_aluguel: null, condominio_valor: 480, iptu_anual: 620,
    area_util: 62, area_total: 66, quartos: 2, banheiros: 1, vagas: 1,
    andar_unidade: 3, total_andares_predio: 5, elevador: true, mobiliado: false,
    aceita_pet: true, aceita_permuta: false, posicao_solar: "Sol da manhã",
    endereco: "Rua Alves do Vale", bairro: "Vila Valqueire", cidade: "Rio de Janeiro", uf: "RJ",
    descricao: "Apartamento funcional, com dois quartos e vaga, para quem quer morar perto do comércio sem abrir mão de uma rua residencial.",
    caracteristicas: ["Elevador", "Vaga", "Área de serviço", "Aceita pet"],
    fotos: ["/imoveis/ap0971-mbnh.png"], slug: "apartamento-rio-de-janeiro-2-quartos-62-m", publicado_no_site: true,
  },
  {
    codigo: "AP0904-MBNH", tipo: "Apartamento", finalidade: "venda",
    preco_venda: 420000, preco_aluguel: null, condominio_valor: 560, iptu_anual: 890,
    area_util: 86, area_total: 92, quartos: 2, banheiros: 2, vagas: 1,
    andar_unidade: 5, total_andares_predio: 7, elevador: true, mobiliado: false,
    aceita_pet: true, aceita_permuta: false, posicao_solar: "Sol da manhã",
    endereco: "Rua das Azaléas", bairro: "Vila Valqueire", cidade: "Rio de Janeiro", uf: "RJ",
    descricao: "Dois quartos com boa área interna e varanda, numa das ruas mais práticas para a rotina de Vila Valqueire.",
    caracteristicas: ["Varanda", "Elevador", "Portaria", "Playground", "Aceita pet"],
    fotos: ["/imoveis/ap0904-mbnh.png"], slug: "apartamento-rio-de-janeiro-2-quartos-86-m", publicado_no_site: true,
  },
  {
    codigo: "CA1042-MBNH", tipo: "Casa", finalidade: "venda",
    preco_venda: 610000, preco_aluguel: null, condominio_valor: null, iptu_anual: 1450,
    area_util: 148, area_total: 210, quartos: 3, banheiros: 3, vagas: 2,
    andar_unidade: null, total_andares_predio: null, elevador: false, mobiliado: false,
    aceita_pet: true, aceita_permuta: true, posicao_solar: "Sol da manhã",
    endereco: "Rua Cândido Benício", bairro: "Praça Seca", cidade: "Rio de Janeiro", uf: "RJ",
    descricao: "Casa com área externa e duas vagas, em trecho com acesso rápido ao comércio e ao transporte da Praça Seca.",
    caracteristicas: ["Quintal", "Churrasqueira", "Área de serviço", "Aceita pet", "Aceita permuta"],
    fotos: ["/imoveis/ca1042-mbnh.png"], slug: "casa-rio-de-janeiro-3-quartos-148-m", publicado_no_site: true,
  },
  {
    codigo: "AP1108-MBNH", tipo: "Apartamento", finalidade: "aluguel",
    preco_venda: null, preco_aluguel: 1850, condominio_valor: 520, iptu_anual: 720,
    area_util: 68, area_total: 72, quartos: 2, banheiros: 1, vagas: 1,
    andar_unidade: 6, total_andares_predio: 8, elevador: true, mobiliado: false,
    aceita_pet: true, aceita_permuta: false, posicao_solar: "Sol da manhã",
    endereco: "Rua Padre Manso", bairro: "Madureira", cidade: "Rio de Janeiro", uf: "RJ",
    descricao: "Apartamento claro e arejado, perto do comércio e das conexões de transporte de Madureira.",
    caracteristicas: ["Elevador", "Portaria", "Vaga", "Aceita pet"],
    fotos: ["/imoveis/ap1108-mbnh.png"], slug: "apartamento-rio-de-janeiro-2-quartos-68-m", publicado_no_site: true,
  },
  {
    codigo: "AP1124-MBNH", tipo: "Apartamento", finalidade: "venda",
    preco_venda: 345000, preco_aluguel: null, condominio_valor: 610, iptu_anual: 780,
    area_util: 74, area_total: 80, quartos: 2, banheiros: 2, vagas: 1,
    andar_unidade: 4, total_andares_predio: 9, elevador: true, mobiliado: false,
    aceita_pet: true, aceita_permuta: false, posicao_solar: "Sol da tarde",
    endereco: "Rua Domingos Lopes", bairro: "Campinho", cidade: "Rio de Janeiro", uf: "RJ",
    descricao: "Boa distribuição interna e acesso simples à região de Madureira e Vila Valqueire.",
    caracteristicas: ["Varanda", "Elevador", "Salão de festas", "Aceita pet"],
    fotos: ["/imoveis/ap1124-mbnh.png"], slug: "apartamento-rio-de-janeiro-2-quartos-74-m", publicado_no_site: true,
  },
  {
    codigo: "CA1066-MBNH", tipo: "Casa", finalidade: "venda_aluguel",
    preco_venda: 790000, preco_aluguel: 3600, condominio_valor: 340, iptu_anual: 1680,
    area_util: 176, area_total: 230, quartos: 4, banheiros: 3, vagas: 2,
    andar_unidade: null, total_andares_predio: null, elevador: false, mobiliado: false,
    aceita_pet: true, aceita_permuta: false, posicao_solar: "Sol da manhã",
    endereco: "Rua Euzébio de Almeida", bairro: "Sulacap", cidade: "Rio de Janeiro", uf: "RJ",
    descricao: "Casa em condomínio com quintal e espaço para a família, perto do eixo comercial de Sulacap.",
    caracteristicas: ["Condomínio fechado", "Quintal", "Churrasqueira", "Aceita pet"],
    fotos: ["/imoveis/ca1066-mbnh.png"], slug: "casa-rio-de-janeiro-4-quartos-176-m", publicado_no_site: true,
  },
  {
    codigo: "AP1140-MBNH", tipo: "Apartamento", finalidade: "venda",
    preco_venda: 455000, preco_aluguel: null, condominio_valor: 690, iptu_anual: 960,
    area_util: 82, area_total: 88, quartos: 3, banheiros: 2, vagas: 1,
    andar_unidade: 7, total_andares_predio: 11, elevador: true, mobiliado: false,
    aceita_pet: true, aceita_permuta: false, posicao_solar: "Sol da manhã",
    endereco: "Estrada dos Três Rios", bairro: "Jacarepaguá", cidade: "Rio de Janeiro", uf: "RJ",
    descricao: "Apartamento de três quartos com varanda, em ponto com serviços e transporte no entorno.",
    caracteristicas: ["Varanda", "Elevador", "Piscina", "Academia", "Aceita pet"],
    fotos: ["/imoveis/ap1140-mbnh.png"], slug: "apartamento-rio-de-janeiro-3-quartos-82-m", publicado_no_site: true,
  },
  {
    codigo: "CO0228-MBNH", tipo: "Cobertura", finalidade: "venda",
    preco_venda: 735000, preco_aluguel: null, condominio_valor: 850, iptu_anual: 1820,
    area_util: 142, area_total: 156, quartos: 3, banheiros: 3, vagas: 2,
    andar_unidade: 8, total_andares_predio: 8, elevador: true, mobiliado: false,
    aceita_pet: true, aceita_permuta: false, posicao_solar: "Sol da manhã",
    endereco: "Rua Luiz Beltrão", bairro: "Vila Valqueire", cidade: "Rio de Janeiro", uf: "RJ",
    descricao: "Cobertura duplex com terraço aberto e vista para o bairro, perto do centro de Vila Valqueire.",
    caracteristicas: ["Terraço", "Churrasqueira", "Elevador", "Duas vagas", "Aceita pet"],
    fotos: ["/imoveis/co0228-mbnh.png"], slug: "cobertura-rio-de-janeiro-3-quartos-142-m", publicado_no_site: true,
  },
  {
    codigo: "AP1156-MBNH", tipo: "Apartamento", finalidade: "aluguel",
    preco_venda: null, preco_aluguel: 1450, condominio_valor: 430, iptu_anual: 560,
    area_util: 55, area_total: 60, quartos: 2, banheiros: 1, vagas: 0,
    andar_unidade: 2, total_andares_predio: 4, elevador: false, mobiliado: false,
    aceita_pet: false, aceita_permuta: false, posicao_solar: "Sol da tarde",
    endereco: "Rua Florianópolis", bairro: "Praça Seca", cidade: "Rio de Janeiro", uf: "RJ",
    descricao: "Opção compacta para alugar, perto de mercado, farmácia e linhas de ônibus da Praça Seca.",
    caracteristicas: ["Área de serviço", "Interfone", "Próximo ao comércio"],
    fotos: ["/imoveis/ap1156-mbnh.png"], slug: "apartamento-rio-de-janeiro-2-quartos-55-m", publicado_no_site: true,
  },
  {
    codigo: "CA1181-MBNH", tipo: "Casa", finalidade: "venda",
    preco_venda: 540000, preco_aluguel: null, condominio_valor: null, iptu_anual: 1220,
    area_util: 132, area_total: 190, quartos: 3, banheiros: 2, vagas: 2,
    andar_unidade: null, total_andares_predio: null, elevador: false, mobiliado: false,
    aceita_pet: true, aceita_permuta: true, posicao_solar: "Sol da manhã",
    endereco: "Rua Marina", bairro: "Marechal Hermes", cidade: "Rio de Janeiro", uf: "RJ",
    descricao: "Casa linear com quintal e duas vagas em rua residencial, com acesso fácil ao comércio de Marechal Hermes.",
    caracteristicas: ["Casa linear", "Quintal", "Duas vagas", "Aceita pet", "Aceita permuta"],
    fotos: ["/imoveis/ca1181-mbnh.png"], slug: "casa-rio-de-janeiro-3-quartos-132-m", publicado_no_site: true,
  },
];

export const formatarMoeda = (valor: number | null) =>
  valor === null
    ? "Consulte"
    : new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(valor);

export const precoPrincipal = (imovel: Imovel) =>
  imovel.preco_venda ?? imovel.preco_aluguel;

export const urlImovel = (imovel: Imovel) =>
  `/imovel/${imovel.slug}/${imovel.codigo}`;

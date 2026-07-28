import type { Metadata } from "next";
import { Footer, Header } from "../../components";
import { imoveis } from "../../data";
import { ListingClient } from "./ListingClient";

export const metadata: Metadata = {
  title: "Imóveis à venda e para alugar",
  description:
    "Busque imóveis em Vila Valqueire, Praça Seca, Campinho, Madureira e bairros vizinhos.",
};

export const dynamicParams = false;

export function generateStaticParams() {
  const paths = new Map<string, string[]>();
  const add = (segments: string[]) => paths.set(segments.join("/"), segments);
  add(["a-venda"]);
  add(["para-alugar"]);

  for (const imovel of imoveis) {
    const tipo = imovel.tipo
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-");
    const bairro = imovel.bairro
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-");
    const finalidades =
      imovel.finalidade === "venda_aluguel"
        ? ["a-venda", "para-alugar"]
        : [imovel.finalidade === "venda" ? "a-venda" : "para-alugar"];
    for (const finalidade of finalidades) {
      add([finalidade, tipo]);
      add([finalidade, tipo, "rio-de-janeiro", bairro]);
    }
  }

  return [...paths.values()].map((segments) => ({ segments }));
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}) {
  const { segments = [] } = await params;
  return (
    <>
      <Header />
      <ListingClient imoveis={imoveis} segments={segments} />
      <Footer />
    </>
  );
}

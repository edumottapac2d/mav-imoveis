import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Roboto_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = host
    ? new URL(`${protocol}://${host}`)
    : new URL("https://mav-imoveis.vercel.app");

  return {
    metadataBase,
    title: {
      default: "MAV Imóveis | Imobiliária em Vila Valqueire",
      template: "%s | MAV Imóveis",
    },
    description:
      "Imóveis à venda e para alugar em Vila Valqueire e bairros vizinhos, com atendimento local e direto.",
    icons: {
      icon: "/logo-mav.png",
      shortcut: "/logo-mav.png",
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      title: "MAV Imóveis | Vila Valqueire",
      description: "Encontre um lugar que combine com a sua vida.",
      images: [{ url: "/og-editorial.png", width: 1728, height: 972, alt: "MAV Imóveis em Vila Valqueire" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "MAV Imóveis | Vila Valqueire",
      description: "Encontre um lugar que combine com a sua vida.",
      images: ["/og-editorial.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${cormorant.variable} ${robotoMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}

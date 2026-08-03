import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://plomberie-matinier-demo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Plomberie Matinier | Plombier à Saint-Étienne-de-Chigny",
  description:
    "Détection de fuite, WC, chauffe-eau, douche, baignoire, robinetterie et installation de salle de bain à Saint-Étienne-de-Chigny.",
  applicationName: "Plomberie Matinier",
  icons: {
    icon: "/plomberie-matinier/icon.png",
    apple: "/plomberie-matinier/icon.png",
  },
  openGraph: {
    title: "Plomberie Matinier | Saint-Étienne-de-Chigny",
    description:
      "Dépannage, WC, douche, baignoire, robinetterie et salle de bain.",
    url: siteUrl,
    siteName: "Plomberie Matinier",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/plomberie-matinier/gregory-matinier-portrait.webp",
        width: 1100,
        height: 1300,
        alt: "Plomberie Matinier",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#082f36",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}

import "./globals.css";
import { Inter, Anton, Archivo_Black, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton"
});
// Police d'affichage du design system (docs/DESIGN-SYSTEM.md) : elle était
// déclarée partout (titres, cartes, admin) mais jamais chargée → la moitié du
// site tombait en « sans-serif » léger. next/font la charge réellement et
// l'expose via --font-archivo-black, utilisé par globals.css ET les
// composants qui déclarent var(--font-archivo-black, …) en priorité.
const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
});
// Monospace du formulaire « Le Terminal » : le CSS de ContactTerminal référence
// --font-jetbrains avec une pile de repli système si le webfont n'est pas dispo.
const jetbrains = JetBrains_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (      <html lang="fr" className={`${inter.variable} ${anton.variable} ${archivoBlack.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="text-text-secondary antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <SmoothScrollProvider>
              {children}
            </SmoothScrollProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
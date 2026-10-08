import "./globals.css";
import { Inter, Anton } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton"
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${anton.variable}`} suppressHydrationWarning>
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
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Bebas_Neue } from "next/font/google";
import LoadingScreen from "@/components/loading-screen";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Softonic IT Solutions | Software Company",
  description: "Innovative Software Solutions from Pakistan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${bebas.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-zinc-950 text-zinc-50">
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}

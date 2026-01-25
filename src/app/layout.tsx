import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Progressy",
  description: "Seguimiento de materias universitarias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="flex-1 lg:ml-64 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
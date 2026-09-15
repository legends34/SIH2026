import React from "react";
import type { Metadata } from "next";
import { AppStateProvider } from "@/lib/state/app-state";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "स्वास्थ्य · Swasthya — Government of Maharashtra Public Health Portal",
  description: "SIH 2026 Rural Healthcare Access Prototype — Government of Maharashtra Public Health Department",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <body>
        <AppStateProvider>
          <Header />
          <main className="app-main">{children}</main>
          <Footer />
        </AppStateProvider>
      </body>
    </html>
  );
}

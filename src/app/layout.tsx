import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veritas Legal AI - Autonomous Compliance & Contract Operations Swarm",
  description: "Democratizing legal operations and state compliance research for small businesses using Google Gemini and agentic automation.",
  keywords: "AI lawyer, compliance checklist, contract auditor, startup legal, Veritas AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

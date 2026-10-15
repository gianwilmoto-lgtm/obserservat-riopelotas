import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Landmark, ArrowUpRight } from "lucide-react";
import "./globals.css";
import { Pwa } from "@/components/pwa";
export const metadata: Metadata = {
  title: {
    default: "Observatório Municipal de Pelotas",
    template: "%s | Observatório de Pelotas",
  },
  description:
    "Transparência, obras e participação cidadã. Protótipo independente com dados demonstrativos.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { themeColor: "#163c37" };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip" href="#conteudo">
          Pular para conteúdo
        </a>
        <header>
          <div className="topbar">
            <Link href="/" className="brand">
              <span className="brand-icon">
                <Landmark size={25} />
              </span>
              <span>
                Observatório de Pelotas<small>DADOS PÚBLICOS · CIDADANIA</small>
              </span>
            </Link>
            <nav aria-label="Principal" className="nav">
              <Link href="/dashboard">Transparência</Link>
              <Link href="/obras">Obras</Link>
              <Link href="/contratos">Contratos</Link>
              <Link href="/participar">Participar</Link>
              <Link href="/lai">Pedidos LAI</Link>
              <Link href="/conta" className="btn secondary">
                Minha conta <ArrowUpRight size={14} />
              </Link>
            </nav>
          </div>
        </header>
        <div className="demo">
          AMBIENTE DEMONSTRATIVO · Valores, empresas e obras fictícios. Projeto
          independente, sem vínculo com a Prefeitura.
        </div>
        <main id="conteudo" className="container">
          {children}
        </main>
        <footer>
          <div className="footer-inner">
            <div>
              <strong>Informação pública. Participação de todos.</strong>
              <br />
              Observatório Municipal de Pelotas · Protótipo 2026
            </div>
            <div>
              <Link href="/fontes">Fontes e metodologia</Link> ·{" "}
              <Link href="/privacidade">Privacidade</Link> ·{" "}
              <Link href="/admin">Administração</Link>
              <br />
              Relatos cidadãos não constituem prova de irregularidade.
            </div>
          </div>
        </footer>
        <Pwa />
      </body>
    </html>
  );
}

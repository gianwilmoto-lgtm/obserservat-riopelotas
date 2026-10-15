import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, Search } from "lucide-react";
import { Summary } from "@/components/summary";
import { WorkCard } from "@/components/work-card";
import { works } from "@/lib/data";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">PELOTAS, RIO GRANDE DO SUL</span>
          <h1>
            Uma cidade melhor
            <br />
            começa com
            <br />
            <span style={{ color: "#638653" }}>informação.</span>
          </h1>
          <p className="muted">
            Entenda como os recursos públicos se transformam em serviços.
            Acompanhe obras, consulte contratos e participe da sua cidade.
          </p>
          <div className="actions">
            <Link href="/dashboard" className="btn">
              Explorar transparência <ArrowRight size={16} />
            </Link>
            <Link href="/participar" className="btn secondary">
              Quero participar
            </Link>
          </div>
          <p className="small muted" style={{ marginTop: 18 }}>
            <ShieldCheck size={14} className="inline" /> Aberto, independente e
            feito para o cidadão.
          </p>
        </div>
        <div
          className="map-placeholder"
          role="img"
          aria-label="Ilustração esquemática da cidade, sem precisão geográfica"
        >
          <div className="river" />
          {[
            [25, 30],
            [52, 48],
            [35, 65],
            [70, 22],
          ].map(([l, t], i) => (
            <span
              key={i}
              className="map-dot"
              style={{ left: l + "%", top: t + "%" }}
            />
          ))}
          <div className="map-label">
            <strong>Pelotas em perspectiva</strong>
            <br />4 obras fictícias · 4 bairros
            <br />
            <span className="muted">Ilustração demonstrativa</span>
          </div>
        </div>
      </section>
      <Summary />
      <div className="section-title">
        <div>
          <span className="eyebrow">ACOMPANHE DE PERTO</span>
          <h2>O que acontece nos bairros</h2>
        </div>
        <Link href="/obras" className="small">
          Ver todas as obras →
        </Link>
      </div>
      <div className="grid works-grid">
        {works.slice(0, 2).map((w) => (
          <WorkCard key={w.id} work={w} />
        ))}
      </div>
      <div className="grid works-grid" style={{ marginTop: 28 }}>
        <article className="card">
          <Search size={24} />
          <h3 style={{ marginTop: 14 }}>O dinheiro público, explicado</h3>
          <p className="muted">
            Pesquise contratos por assunto e bairro, com valores apresentados de
            forma simples.
          </p>
          <Link href="/contratos" className="small">
            Consultar contratos →
          </Link>
        </article>
        <article className="card">
          <Users size={24} />
          <h3 style={{ marginTop: 14 }}>Sua participação faz diferença</h3>
          <p className="muted">
            Registre uma observação ou organize um pedido de acesso à
            informação.
          </p>
          <Link href="/participar" className="small">
            Conhecer os canais de participação →
          </Link>
        </article>
      </div>
    </>
  );
}

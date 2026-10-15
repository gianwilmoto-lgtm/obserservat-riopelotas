import Link from "next/link";
import { notFound } from "next/navigation";
import { works, contracts, money } from "@/lib/data";
import { WorkMap } from "@/components/map";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const w = works.find((w) => w.id === id);
  if (!w) notFound();
  const c = contracts.find((c) => c.id === w.contractId)!;
  return (
    <>
      <Link href="/obras" className="back">
        ← Todas as obras
      </Link>
      <span className="eyebrow">
        {w.neighborhood} · {w.subject}
      </span>
      <h1 className="page-title">{w.title}</h1>
      <p className="subtitle muted">{w.description}</p>
      <div className="two-col">
        <section className="card">
          <div className="row">
            <h2>Execução da obra</h2>
            <span className="pill">{w.status}</span>
          </div>
          <div className="progress">
            <span style={{ width: w.progress + "%" }} />
          </div>
          <p>{w.progress}% de execução física simulada</p>
          <WorkMap lat={w.lat} lng={w.lng} title={w.title} />
          <h3 style={{ marginTop: 24 }}>Histórico demonstrativo</h3>
          <ul className="list">
            <li>01/08/2026 · Cadastro fictício da obra.</li>
            <li>01/10/2026 · Atualização simulada de acompanhamento.</li>
          </ul>
        </section>
        <aside>
          <section className="card">
            <h3>Contrato relacionado</h3>
            <p className="small muted">{c.number}</p>
            <p>{c.company}</p>
            <div className="row">
              <span>Contratado</span>
              <strong>{money(w.budget)}</strong>
            </div>
            <div className="row">
              <span>Pago (simulado)</span>
              <strong>{money(w.paid)}</strong>
            </div>
            <hr
              style={{
                border: 0,
                borderTop: "1px solid #dce5df",
                margin: "20px 0",
              }}
            />
            <h3>Fonte e documentos</h3>
            <p className="small muted">
              Base demonstrativa local · referência: 01/10/2026. Não existe
              documento oficial associado a este exemplo.
            </p>
            <Link href="/fontes" className="small">
              Consultar metodologia →
            </Link>
          </section>
          <section className="notice">
            <strong>Viu algo que merece atenção?</strong>
            <p className="small">
              Registre uma observação com responsabilidade. Relatos passam por
              moderação.
            </p>
            <Link href="/participar" className="btn secondary">
              Registrar ocorrência
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}

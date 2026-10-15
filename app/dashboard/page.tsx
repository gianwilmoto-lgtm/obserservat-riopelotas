import { Summary } from "@/components/summary";
import { works, money } from "@/lib/data";
export default function Dashboard() {
  return (
    <>
      <span className="eyebrow">VISÃO GERAL · BASE DEMONSTRATIVA</span>
      <h1 className="page-title">Transparência que faz sentido.</h1>
      <p className="muted">
        Uma leitura simples dos recursos e das obras da cidade. Referência
        fictícia: outubro de 2026.
      </p>
      <Summary />
      <div className="grid works-grid" style={{ marginTop: 28 }}>
        <section className="card">
          <h2>Recursos por assunto</h2>
          <p className="small muted">
            Valores contratados · exemplos fictícios
          </p>
          <div
            className="bar-chart"
            role="img"
            aria-label={works
              .map((w) => w.subject + ": " + money(w.budget))
              .join("; ")}
          >
            {works.map((w) => (
              <div className="bar-col" key={w.id}>
                <span className="small">
                  {(w.budget / 1000000).toFixed(2)} mi
                </span>
                <div
                  className="bar"
                  style={{ height: (w.budget / 2400000) * 125 + "px" }}
                />
                {w.subject}
              </div>
            ))}
          </div>
          <p className="chart-legend">
            Os mesmos valores estão disponíveis na tabela de contratos.
          </p>
        </section>
        <section className="card">
          <h2>Execução financeira</h2>
          {works.map((w) => (
            <div key={w.id} style={{ marginTop: 18 }}>
              <div className="row small">
                <span>{w.subject}</span>
                <strong>
                  {money(w.paid)} / {money(w.budget)}
                </strong>
              </div>
              <div className="progress">
                <span style={{ width: (w.paid / w.budget) * 100 + "%" }} />
              </div>
            </div>
          ))}
          <p className="small muted">
            Pagamento não equivale à conclusão física da obra.
          </p>
        </section>
      </div>
      <div className="notice">
        <strong>Como interpretar estes dados</strong>
        <p className="small" style={{ marginBottom: 0 }}>
          O painel usa uma base fictícia para testar navegação e cálculos. Não
          permite avaliar a gestão municipal. Dados oficiais só serão exibidos
          após importação, rastreabilidade e revisão.
        </p>
      </div>
    </>
  );
}

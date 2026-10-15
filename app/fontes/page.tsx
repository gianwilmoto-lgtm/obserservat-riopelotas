import { modules } from "@/lib/data";
export default function Sources() {
  return (
    <>
      <h1 className="page-title">Fontes, contexto e metodologia</h1>
      <p className="subtitle muted">
        O Observatório separa registros oficiais, relatos cidadãos e análises.
        Nenhum alerta automatizado é prova de irregularidade.
      </p>
      <section className="card">
        <h2>Base atual: demonstração</h2>
        <p>
          Os quatro contratos e obras foram criados exclusivamente para este
          protótipo. Valores, empresas, datas e coordenadas não descrevem
          despesas ou intervenções reais. Não há documentos oficiais associados.
        </p>
        <h3>Fontes em investigação</h3>
        <ul className="list">
          <li>
            <a href="https://www.pelotas.com.br" rel="noreferrer">
              Prefeitura de Pelotas
            </a>
          </li>
          <li>
            <a href="https://pncp.gov.br" rel="noreferrer">
              Portal Nacional de Contratações Públicas
            </a>
          </li>
          <li>
            <a href="https://www.tce.rs.gov.br" rel="noreferrer">
              Tribunal de Contas do Estado do RS
            </a>
          </li>
          <li>
            <a
              href="https://www.diariomunicipal.com.br/famurs/"
              rel="noreferrer"
            >
              Diário Municipal / FAMURS
            </a>
          </li>
        </ul>
        <p>
          Consultas bloqueadas pela política de rede do ambiente de
          desenvolvimento. Endpoints, campos e periodicidade ainda não foram
          verificados. A importação manual mantém arquivos em revisão.
        </p>
      </section>
      <div className="section-title">
        <h2>Uma estrutura para crescer</h2>
      </div>
      <div className="module-list">
        {modules.map((m, i) => (
          <div key={m}>
            <span className="eyebrow">
              MÓDULO {String(i + 1).padStart(2, "0")}
            </span>
            {m}
            <p className="small muted">
              {i < 5
                ? "Núcleo e protótipo inicial"
                : "Planejado para etapas futuras"}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

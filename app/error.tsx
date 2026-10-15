"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="empty">
      <h1 className="page-title">Não foi possível carregar esta página.</h1>
      <p>Tente novamente. Nenhuma informação foi enviada por esta tela.</p>
      <button className="btn" onClick={reset}>
        Tentar novamente
      </button>
    </div>
  );
}

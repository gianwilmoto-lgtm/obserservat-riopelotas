"use client";
import { useState } from "react";
export function Moderation({ id }: { id: string }) {
  const [msg, M] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.set("id", id);
        const r = await fetch("/api/admin/moderate", {
          method: "POST",
          body: fd,
        });
        M(
          r.ok
            ? "Revisão registrada. Atualize a página para consultar a fila."
            : "Não foi possível concluir a revisão.",
        );
      }}
    >
      <label>
        Decisão
        <select name="status">
          <option value="rejected">Rejeitar</option>
          <option value="published">Publicar texto revisado</option>
        </select>
      </label>
      <label>
        Justificativa da revisão
        <input name="reason" required minLength={10} maxLength={500} />
      </label>
      <button className="btn secondary">Registrar revisão</button>
      <p role="status">{msg}</p>
    </form>
  );
}
export function ImportForm() {
  const [msg, M] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const r = await fetch("/api/admin/import", {
          method: "POST",
          body: new FormData(e.currentTarget),
        });
        const d = await r.json();
        M(d.message);
      }}
    >
      <label>
        Arquivo CSV ou PDF
        <input name="file" type="file" accept=".csv,.pdf" required />
      </label>
      <label>
        URL oficial de origem
        <input name="source_url" type="url" required />
      </label>
      <label>
        Data de coleta
        <input name="collected_at" type="date" required />
      </label>
      <p className="small muted">
        Até 5 MB. Arquivos ficam privados e não são publicados. PDFs exigem
        extração e revisão humana; CSVs podem ser normalizados pelo coletor
        Python.
      </p>
      <button className="btn">Enviar para revisão</button>
      <p role="status">{msg}</p>
    </form>
  );
}

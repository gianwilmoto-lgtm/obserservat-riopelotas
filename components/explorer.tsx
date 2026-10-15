"use client";
import { useState } from "react";
import Link from "next/link";
import { works, contracts, money, filterRecords } from "@/lib/data";
import { WorkCard } from "./work-card";
export function Explorer({ kind }: { kind: "works" | "contracts" }) {
  const [q, Q] = useState(""),
    [n, N] = useState(""),
    [s, S] = useState("");
  const rows = filterRecords(works, q, n, s);
  return (
    <>
      <div className="filters">
        <label>
          Pesquisar
          <input
            type="search"
            value={q}
            onChange={(e) => Q(e.target.value)}
            placeholder="Nome da obra ou objeto do contrato"
          />
        </label>
        <label>
          Bairro
          <select value={n} onChange={(e) => N(e.target.value)}>
            <option value="">Todos os bairros</option>
            {works.map((w) => (
              <option key={w.id}>{w.neighborhood}</option>
            ))}
          </select>
        </label>
        <label>
          Assunto
          <select value={s} onChange={(e) => S(e.target.value)}>
            <option value="">Todos os assuntos</option>
            {works.map((w) => (
              <option key={w.id}>{w.subject}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="small muted" role="status">
        {rows.length} resultado(s) · dados demonstrativos
      </p>
      {!rows.length ? (
        <div className="empty">
          Nenhum resultado para estes filtros.
          <br />
          <button
            className="btn secondary"
            onClick={() => {
              Q("");
              N("");
              S("");
            }}
          >
            Limpar filtros
          </button>
        </div>
      ) : kind === "works" ? (
        <div className="grid works-grid">
          {rows.map((w) => (
            <WorkCard key={w.id} work={w} />
          ))}
        </div>
      ) : (
        <div className="card table-wrap">
          <table>
            <caption className="sr-only">
              Contratos demonstrativos filtrados
            </caption>
            <thead>
              <tr>
                <th>Número / Objeto</th>
                <th>Empresa fictícia</th>
                <th>Bairro</th>
                <th>Valor</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {contracts
                .filter((c) => rows.some((w) => w.id === c.workId))
                .map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="small muted">{c.number}</span>
                      <br />
                      {c.title}
                    </td>
                    <td>{c.company}</td>
                    <td>{c.neighborhood}</td>
                    <td>{money(c.amount)}</td>
                    <td>
                      <Link href={"/obras/" + c.workId}>Ver obra →</Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

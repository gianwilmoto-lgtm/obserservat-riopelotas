import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Work, money } from "@/lib/data";
export function WorkCard({ work: w }: { work: Work }) {
  return (
    <article className="card work-card">
      <div className="work-header">
        <span className="meta">
          <MapPin size={13} className="inline" /> {w.neighborhood} · {w.subject}
        </span>
        <span className={"pill " + (w.status === "Planejada" ? "amber" : "")}>
          {w.status}
        </span>
      </div>
      <h3>
        <Link href={"/obras/" + w.id}>
          {w.title} <ArrowUpRight size={15} className="inline" />
        </Link>
      </h3>
      <div className="row small muted">
        <span>Execução demonstrativa</span>
        <strong>{w.progress}%</strong>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label={"Execução de " + w.title}
        aria-valuenow={w.progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: w.progress + "%" }} />
      </div>
      <div className="row small">
        <span className="muted">Valor contratado</span>
        <strong>{money(w.budget)}</strong>
      </div>
    </article>
  );
}

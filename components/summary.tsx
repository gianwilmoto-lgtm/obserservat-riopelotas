import { Banknote, HardHat, FileText, CircleCheck } from "lucide-react";
import { works, money } from "@/lib/data";
export function Summary() {
  const stats = [
    {
      name: "Valor contratado",
      value: money(works.reduce((a, w) => a + w.budget, 0)),
      note: "Soma dos 4 contratos fictícios",
      Icon: Banknote,
    },
    {
      name: "Obras acompanhadas",
      value: "04",
      note: "Em 4 bairros de Pelotas",
      Icon: HardHat,
    },
    {
      name: "Contratos disponíveis",
      value: "04",
      note: "Base exclusivamente demonstrativa",
      Icon: FileText,
    },
    {
      name: "Obras concluídas",
      value: "01",
      note: "Conclusão simulada",
      Icon: CircleCheck,
    },
  ];
  return (
    <div className="grid stats">
      {stats.map((s) => (
        <article className="card stat" key={s.name}>
          <s.Icon className="symbol" size={32} />
          <span className="small muted">{s.name}</span>
          <strong>{s.value}</strong>
          <p className="muted">{s.note}</p>
        </article>
      ))}
    </div>
  );
}

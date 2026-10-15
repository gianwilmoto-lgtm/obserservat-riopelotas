import { Explorer } from "@/components/explorer";
export default function Page() {
  return (
    <>
      <span className="eyebrow">TRANSPARÊNCIA MUNICIPAL</span>
      <h1 className="page-title">Obras públicas</h1>
      <p className="muted">
        Acompanhe intervenções por bairro e assunto. Todos os registros abaixo
        são fictícios.
      </p>
      <Explorer kind="works" />
    </>
  );
}

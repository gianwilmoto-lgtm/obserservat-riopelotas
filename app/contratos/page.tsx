import { Explorer } from "@/components/explorer";
export default function Page() {
  return (
    <>
      <span className="eyebrow">TRANSPARÊNCIA MUNICIPAL</span>
      <h1 className="page-title">Contratos com transparência</h1>
      <p className="muted">
        Consulte objetos, empresas e valores da base demonstrativa.
      </p>
      <Explorer kind="contracts" />
    </>
  );
}

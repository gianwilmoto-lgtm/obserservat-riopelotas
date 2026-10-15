import { CitizenForm } from "@/components/forms";
import { configured } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <>
      <span className="eyebrow">PARTICIPAÇÃO CIDADÃ</span>
      <h1 className="page-title">Sua cidade, seu olhar.</h1>
      <p className="subtitle muted">
        Registre uma observação sobre serviços ou obras. Não inclua acusações,
        dados pessoais de terceiros ou informações sensíveis.
      </p>
      <div className="notice">
        {configured()
          ? "Entre na sua conta para salvar e acompanhar registros."
          : "Modo demonstrativo: formulários validam o preenchimento, mas não salvam nem enviam dados."}
      </div>
      <div className="card">
        <CitizenForm kind="occurrence" enabled={configured()} />
      </div>
    </>
  );
}

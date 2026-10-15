import { CitizenForm } from "@/components/forms";
import { configured } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <>
      <span className="eyebrow">PARTICIPAÇÃO CIDADÃ</span>
      <h1 className="page-title">A informação pública é um direito.</h1>
      <p className="subtitle muted">
        Organize pedidos de acesso à informação e acompanhe o protocolo obtido
        no canal oficial do órgão.
      </p>
      <div className="notice">
        {configured()
          ? "Entre na sua conta para salvar e acompanhar registros."
          : "Modo demonstrativo: formulários validam o preenchimento, mas não salvam nem enviam dados."}
      </div>
      <div className="card">
        <CitizenForm kind="lai" enabled={configured()} />
      </div>
    </>
  );
}

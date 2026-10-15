import { AuthForm, Logout, LaiProgress } from "@/components/forms";
import { supabase, configured } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export default async function Account() {
  const db = await supabase();
  const user = db ? (await db.auth.getUser()).data.user : null;
  if (!user)
    return (
      <section className="auth card form">
        <AuthForm enabled={configured()} />
      </section>
    );
  const { data: reports, error: re } = await db!
    .from("occurrences")
    .select("id,title,status")
    .eq("citizen_id", user.id)
    .order("created_at", { ascending: false });
  const { data: requests, error: le } = await db!
    .from("lai_requests")
    .select("id,title,status,external_protocol")
    .eq("citizen_id", user.id)
    .order("created_at", { ascending: false });
  return (
    <>
      <div className="row">
        <h1 className="page-title">Minha participação</h1>
        <Logout />
      </div>
      <p className="muted">
        Você acessa apenas seus registros privados e informações públicas.
      </p>
      {(re || le) && (
        <p role="alert">
          Não foi possível carregar registros. Verifique a configuração do
          banco.
        </p>
      )}
      <div className="grid works-grid">
        <section className="card">
          <h2>Minhas ocorrências</h2>
          {reports?.length ? (
            reports.map((r) => (
              <p key={r.id}>
                {r.title} · {r.status}
                <br />
                <small>Identificador: {r.id}</small>
              </p>
            ))
          ) : (
            <p>Nenhuma ocorrência cadastrada.</p>
          )}
        </section>
        <section className="card">
          <h2>Meus pedidos LAI</h2>
          {requests?.length ? (
            requests.map((r) => (
              <article key={r.id}>
                <h3>{r.title}</h3>
                <p className="small">
                  Identificador interno: {r.id}
                  <br />
                  Protocolo externo: {r.external_protocol || "Não informado"}
                </p>
                <LaiProgress id={r.id} status={r.status} />
              </article>
            ))
          ) : (
            <p>Nenhum pedido cadastrado.</p>
          )}
        </section>
      </div>
    </>
  );
}

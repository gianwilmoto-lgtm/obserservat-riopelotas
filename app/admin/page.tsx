import Link from "next/link";
import { identity } from "@/lib/api";
import { canModerate } from "@/lib/validation";
import { Moderation, ImportForm } from "@/components/admin";
export const dynamic = "force-dynamic";
export default async function Admin() {
  const { db, user } = await identity();
  if (!db || !user)
    return (
      <section className="empty">
        <h1 className="page-title">Área administrativa protegida</h1>
        <p>
          É necessário entrar com uma conta de analista, revisor ou
          administrador.
        </p>
        <Link className="btn" href="/conta">
          Ir para minha conta
        </Link>
      </section>
    );
  const { data: profile } = await db
    .from("citizens")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || !["analyst", "reviewer", "admin"].includes(profile.role))
    return (
      <section className="empty">
        <h1 className="page-title">Acesso restrito</h1>
        <p>Sua conta não tem permissão administrativa.</p>
      </section>
    );
  const { data: reports, error } = canModerate(profile.role)
    ? await db
        .from("occurrences")
        .select("id,title,description,status")
        .eq("status", "pending")
    : { data: [], error: null };
  return (
    <>
      <h1 className="page-title">Revisão e importação</h1>
      <p className="muted">
        Perfil autorizado: {profile.role}. Todas as alterações geram auditoria.
      </p>
      <div className="two-col">
        <section className="card">
          <h2>Moderação de relatos</h2>
          {error && <p>Fila indisponível.</p>}
          {!reports?.length && (
            <p>Nenhum relato disponível para sua revisão.</p>
          )}
          {reports?.map((r) => (
            <article key={r.id}>
              <h3>{r.title}</h3>
              <p>{r.description}</p>
              <Moderation id={r.id} />
            </article>
          ))}
        </section>
        <section className="card">
          <h2>Importação manual</h2>
          <ImportForm />
        </section>
      </div>
    </>
  );
}

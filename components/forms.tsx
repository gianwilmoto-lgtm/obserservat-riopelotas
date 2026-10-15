"use client";
import { useState } from "react";
import { reportSchema, laiSchema } from "@/lib/validation";
export function CitizenForm({
  kind,
  enabled,
}: {
  kind: "occurrence" | "lai";
  enabled: boolean;
}) {
  const [message, M] = useState(""),
    [busy, B] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    M("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const obj = Object.fromEntries(fd);
    const parsed = (kind === "lai" ? laiSchema : reportSchema).safeParse(obj);
    if (!parsed.success) {
      M(parsed.error.issues.map((i) => i.message).join("; "));
      return;
    }
    const file = fd.get("photo");
    if (file instanceof File && file.size > 5 * 1024 * 1024) {
      M("A fotografia deve ter até 5 MB.");
      return;
    }
    if (!enabled) {
      M(
        "Demonstração validada. Nada foi salvo ou enviado. Não insira dados pessoais neste modo.",
      );
      return;
    }
    B(true);
    try {
      const r = await fetch(
        "/api/" + (kind === "lai" ? "lai" : "occurrences"),
        { method: "POST", body: fd },
      );
      const data = await r.json();
      M(data.message);
      if (r.ok) form.reset();
    } catch {
      M(
        "Falha de conexão. Verifique sua lista antes de reenviar para evitar duplicidade.",
      );
    } finally {
      B(false);
    }
  }
  return (
    <form className="form" onSubmit={submit}>
      <label>
        Título
        <input name="title" required minLength={8} maxLength={120} />
      </label>
      {kind === "lai" ? (
        <>
          <label>
            Órgão destinatário
            <input name="agency" required minLength={2} maxLength={160} />
          </label>
          <label>
            Informação solicitada
            <textarea name="body" required minLength={20} maxLength={5000} />
          </label>
        </>
      ) : (
        <>
          <label>
            Bairro
            <input name="neighborhood" required minLength={2} maxLength={80} />
          </label>
          <label>
            Assunto
            <select name="subject">
              {[
                "Infraestrutura",
                "Saúde",
                "Educação",
                "Urbanismo",
                "Outro",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            O que você observou?
            <textarea
              name="description"
              required
              minLength={20}
              maxLength={3000}
            />
          </label>
          <label>
            Fotografia (opcional)
            <input name="photo" type="file" accept="image/jpeg,image/png" />
            <span className="file-note">
              JPEG ou PNG, até 5 MB. Evite rostos, placas e documentos pessoais.
              A foto fica privada, em quarentena para revisão.
            </span>
          </label>
        </>
      )}
      <p className="small muted">
        {kind === "lai"
          ? "Este sistema organiza o pedido. O envio ao órgão público deve ser feito pelo canal oficial; cadastrar aqui não inicia prazo legal."
          : "Relatos são privados até a revisão. A publicação ocorre apenas após moderação do texto; fotos não são publicadas automaticamente."}
      </p>
      <label>
        <input
          type="checkbox"
          required
          style={{ width: "auto", display: "inline", marginRight: 8 }}
        />{" "}
        Li as orientações de privacidade e revisei o conteúdo.
      </label>
      <button className="btn" disabled={busy}>
        {busy
          ? "Processando…"
          : enabled
            ? "Salvar para acompanhamento"
            : "Validar demonstração"}
      </button>
      <p role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
export function AuthForm({ enabled }: { enabled: boolean }) {
  const [mode, S] = useState<"login" | "signup">("login"),
    [msg, M] = useState(""),
    [busy, B] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        B(true);
        try {
          const fd = new FormData(e.currentTarget);
          fd.set("mode", mode);
          const r = await fetch("/api/auth", { method: "POST", body: fd });
          const data = await r.json();
          M(data.message);
          if (r.ok && mode === "login") window.location.assign("/conta");
        } catch {
          M("Não foi possível conectar. Tente novamente.");
        } finally {
          B(false);
        }
      }}
    >
      <h2>{mode === "login" ? "Acesse sua conta" : "Crie sua conta"}</h2>
      <p className="small muted">
        {enabled
          ? "Use seu e-mail e senha."
          : "Autenticação indisponível: configure o Supabase para habilitar contas reais."}
      </p>
      <label>
        E-mail
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
        />
      </label>
      <label>
        Senha
        <input
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={12}
          maxLength={128}
        />
      </label>
      <p className="small muted">
        Mínimo de 12 caracteres. O cadastro não solicita CPF.
      </p>
      <button className="btn" disabled={!enabled || busy}>
        {mode === "login" ? "Entrar" : "Cadastrar"}
      </button>
      <button
        type="button"
        className="btn secondary"
        style={{ marginLeft: 8 }}
        onClick={() => S(mode === "login" ? "signup" : "login")}
      >
        {mode === "login" ? "Criar conta" : "Já tenho conta"}
      </button>
      <p role="status">{msg}</p>
    </form>
  );
}
export function Logout() {
  return (
    <button
      className="btn secondary"
      onClick={async () => {
        const r = await fetch("/api/auth", { method: "DELETE" });
        if (r.ok) window.location.assign("/conta");
      }}
    >
      Sair
    </button>
  );
}
export function LaiProgress({ id, status }: { id: string; status: string }) {
  const [msg, M] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.set("id", id);
        const r = await fetch("/api/lai", { method: "PATCH", body: fd });
        M(r.ok ? "Acompanhamento atualizado." : "Não foi possível atualizar.");
      }}
    >
      <label>
        Situação
        <select name="status" defaultValue={status}>
          {["draft", "submitted", "answered", "closed"].map((s) => (
            <option key={s} value={s}>
              {
                {
                  draft: "Rascunho",
                  submitted: "Enviado pelo cidadão",
                  answered: "Respondido",
                  closed: "Encerrado",
                }[s]
              }
            </option>
          ))}
        </select>
      </label>
      <label>
        Protocolo no órgão (se houver)
        <input name="protocol" maxLength={120} />
      </label>
      <button className="btn secondary">Atualizar acompanhamento</button>
      <span role="status"> {msg}</span>
    </form>
  );
}

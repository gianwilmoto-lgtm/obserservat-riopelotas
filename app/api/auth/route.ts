import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { credentialsSchema } from "@/lib/validation";
import { json, unsafeRequest } from "@/lib/api";
export async function POST(req: NextRequest) {
  if (unsafeRequest(req)) return json("Requisição inválida.", 403);
  const db = await supabase();
  if (!db) return json("Autenticação não configurada.", 503);
  const fd = await req.formData();
  const parsed = credentialsSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success)
    return json("Informe e-mail válido e senha com 12 a 128 caracteres.", 400);
  const mode = fd.get("mode");
  if (!["login", "signup"].includes(String(mode)))
    return json("Operação inválida.", 400);
  const result =
    mode === "signup"
      ? await db.auth.signUp(parsed.data)
      : await db.auth.signInWithPassword(parsed.data);
  if (result.error)
    return json(
      "Não foi possível autenticar. Confira os dados, a confirmação do e-mail e tente mais tarde.",
      400,
    );
  return json(
    mode === "signup"
      ? "Se o cadastro estiver disponível, você receberá instruções por e-mail."
      : "Acesso autorizado.",
  );
}
export async function DELETE(req: NextRequest) {
  if (unsafeRequest(req)) return json("Requisição inválida.", 403);
  const db = await supabase();
  if (db) await db.auth.signOut();
  return json("Sessão encerrada.");
}

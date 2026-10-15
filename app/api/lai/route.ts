import { NextRequest } from "next/server";
import { z } from "zod";
import { identity, json, unsafeRequest } from "@/lib/api";
import { laiSchema } from "@/lib/validation";
export async function POST(req: NextRequest) {
  if (unsafeRequest(req)) return json("Requisição inválida.", 403);
  const { db, user } = await identity();
  if (!db || !user)
    return json("Entre na sua conta para salvar um pedido.", 401);
  const parsed = laiSchema.safeParse(Object.fromEntries(await req.formData()));
  if (!parsed.success) return json("Revise os campos do pedido.", 400);
  const { data, error } = await db
    .from("lai_requests")
    .insert({ ...parsed.data, citizen_id: user.id })
    .select("id")
    .single();
  return error
    ? json("Não foi possível salvar o pedido.", 502)
    : json(
        "Rascunho salvo. Envie pelo canal oficial e registre o protocolo em Minha conta.",
        201,
        { id: data.id },
      );
}
export async function PATCH(req: NextRequest) {
  if (unsafeRequest(req)) return json("Requisição inválida.", 403);
  const { db, user } = await identity();
  if (!db || !user) return json("Acesso não autorizado.", 401);
  const parsed = z
    .object({
      id: z.uuid(),
      status: z.enum(["draft", "submitted", "answered", "closed"]),
      protocol: z.string().trim().max(120),
    })
    .safeParse(Object.fromEntries(await req.formData()));
  if (!parsed.success) return json("Dados inválidos.", 400);
  if (parsed.data.status === "submitted" && !parsed.data.protocol)
    return json("Informe o protocolo externo.", 400);
  const { error } = await db.rpc("update_lai", {
    request_id: parsed.data.id,
    new_status: parsed.data.status,
    protocol: parsed.data.protocol,
  });
  return error
    ? json("Não foi possível atualizar.", 403)
    : json("Acompanhamento atualizado.");
}

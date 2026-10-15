import { NextRequest } from "next/server";
import { z } from "zod";
import { identity, json, unsafeRequest } from "@/lib/api";
export async function POST(req: NextRequest) {
  if (unsafeRequest(req)) return json("Requisição inválida.", 403);
  const { db, user } = await identity();
  if (!db || !user) return json("Acesso não autorizado.", 401);
  const parsed = z
    .object({
      id: z.uuid(),
      status: z.enum(["published", "rejected"]),
      reason: z.string().trim().min(10).max(500),
    })
    .safeParse(Object.fromEntries(await req.formData()));
  if (!parsed.success) return json("Dados inválidos.", 400);
  const { error } = await db.rpc("moderate_occurrence", {
    record_id: parsed.data.id,
    decision: parsed.data.status,
    reason: parsed.data.reason,
  });
  return error
    ? json("Revisão não autorizada ou registro indisponível.", 403)
    : json("Revisão registrada.");
}

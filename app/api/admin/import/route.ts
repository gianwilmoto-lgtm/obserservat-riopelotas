import { NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { identity, json, unsafeRequest } from "@/lib/api";
export async function POST(req: NextRequest) {
  if (unsafeRequest(req)) return json("Requisição inválida.", 403);
  const { db, user } = await identity();
  if (!db || !user) return json("Acesso não autorizado.", 401);
  const { data: p } = await db
    .from("citizens")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!p || !["analyst", "reviewer", "admin"].includes(p.role))
    return json("Sem permissão.", 403);
  const fd = await req.formData();
  const f = fd.get("file");
  let url: URL;
  try {
    url = new URL(String(fd.get("source_url")));
    if (url.protocol !== "https:") throw new Error();
  } catch {
    return json("Informe uma URL HTTPS de origem.", 400);
  }
  const date = String(fd.get("collected_at"));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)))
    return json("Data inválida.", 400);
  if (!(f instanceof File) || !f.size || f.size > 5 * 1024 * 1024)
    return json("Envie um arquivo de até 5 MB.", 400);
  const bytes = Buffer.from(await f.arrayBuffer());
  const pdf =
    f.name.toLowerCase().endsWith(".pdf") &&
    bytes.subarray(0, 5).toString() === "%PDF-";
  const csv =
    f.name.toLowerCase().endsWith(".csv") &&
    !bytes.includes(0) &&
    !bytes.subarray(0, 100).toString().includes("<");
  if (!pdf && !csv) return json("Formato inválido. Use CSV ou PDF.", 400);
  const hash = createHash("sha256").update(bytes).digest("hex");
  const path = `${user.id}/${hash}.${pdf ? "pdf" : "csv"}`;
  const { error: upload } = await db.storage
    .from("import-quarantine")
    .upload(path, bytes, {
      contentType: pdf ? "application/pdf" : "text/csv",
      upsert: false,
    });
  if (upload)
    return json("Arquivo já enviado ou armazenamento indisponível.", 409);
  const { error } = await db
    .from("import_jobs")
    .insert({
      submitted_by: user.id,
      source_url: url.href,
      collected_at: date,
      sha256: hash,
      path,
      format: pdf ? "pdf" : "csv",
    });
  if (error) {
    await db.storage.from("import-quarantine").remove([path]);
    return json("Não foi possível registrar a importação.", 502);
  }
  return json(
    "Arquivo privado recebido para revisão. Nenhum dado foi publicado ou validado como oficial.",
    201,
  );
}

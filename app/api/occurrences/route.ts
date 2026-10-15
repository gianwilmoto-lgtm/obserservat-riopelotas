import { NextRequest } from "next/server";
import sharp from "sharp";
import { identity, json, unsafeRequest } from "@/lib/api";
import { reportSchema, photoType } from "@/lib/validation";
export async function POST(req: NextRequest) {
  if (unsafeRequest(req))
    return json("Requisição inválida ou arquivo muito grande.", 403);
  const { db, user } = await identity();
  if (!db || !user)
    return json("Entre na sua conta para registrar uma ocorrência.", 401);
  const fd = await req.formData();
  const parsed = reportSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success)
    return json("Revise os campos: título, descrição, bairro e assunto.", 400);
  const photo = fd.get("photo");
  let bytes: Buffer | undefined;
  if (photo instanceof File && photo.size) {
    if (photo.size > 5 * 1024 * 1024)
      return json("Limite de 5 MB por foto.", 400);
    const raw = Buffer.from(await photo.arrayBuffer());
    if (!photoType(raw))
      return json("Use apenas fotografias JPEG ou PNG válidas.", 400);
    try {
      bytes = await sharp(raw, { limitInputPixels: 20000000 })
        .rotate()
        .resize({
          width: 1600,
          height: 1600,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer();
    } catch {
      return json("Não foi possível decodificar esta imagem.", 400);
    }
  }
  const id = crypto.randomUUID();
  let photoPath: string | null = null;
  if (bytes) {
    photoPath = `${user.id}/${id}.jpg`;
    const { error } = await db.storage
      .from("private-evidence")
      .upload(photoPath, bytes, { contentType: "image/jpeg", upsert: false });
    if (error)
      return json(
        "Não foi possível armazenar a foto. Nenhuma ocorrência foi criada.",
        502,
      );
  }
  const { error } = await db
    .from("occurrences")
    .insert({ ...parsed.data, id, citizen_id: user.id, photo_path: photoPath });
  if (error) {
    if (photoPath)
      await db.storage.from("private-evidence").remove([photoPath]);
    return json("Não foi possível salvar. Tente mais tarde.", 502);
  }
  return json(
    "Ocorrência registrada e aguardando revisão. Acompanhe em Minha conta.",
    201,
    { id },
  );
}

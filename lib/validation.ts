import { z } from "zod";
export const reportSchema = z.object({
  title: z.string().trim().min(8).max(120),
  description: z.string().trim().min(20).max(3000),
  neighborhood: z.string().trim().min(2).max(80),
  subject: z.enum([
    "Infraestrutura",
    "Saúde",
    "Educação",
    "Urbanismo",
    "Outro",
  ]),
});
export const laiSchema = z.object({
  title: z.string().trim().min(8).max(120),
  body: z.string().trim().min(20).max(5000),
  agency: z.string().trim().min(2).max(160),
});
export const credentialsSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(12).max(128),
});
export function photoType(
  bytes: Uint8Array,
): "image/jpeg" | "image/png" | null {
  if (
    bytes.length >= 8 &&
    [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => bytes[i] === v)
  )
    return "image/png";
  if (
    bytes.length >= 3 &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255
  )
    return "image/jpeg";
  return null;
}
export function canModerate(role: string) {
  return ["reviewer", "admin"].includes(role);
}

import { sql } from "./db";

function slugify(titulo: string): string {
  return titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generarSlugUnico(titulo: string): Promise<string> {
  const base = slugify(titulo) || "titulo";
  let candidato = base;
  let i = 1;
  while (true) {
    const existe = await sql`SELECT 1 FROM contenido WHERE slug = ${candidato} LIMIT 1`;
    if (existe.length === 0) return candidato;
    i += 1;
    candidato = `${base}-${i}`;
  }
}

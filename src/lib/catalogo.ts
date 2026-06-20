import { sql } from "./db";
import type { CatalogItem } from "@/components/CatalogPage";

const SERVER_LABEL: Record<string, string> = { onedrive: "OneDrive", gdrive: "GDrive", mega: "Mega" };

type Row = Record<string, unknown>;

export async function getCatalogoEpisodico(tipo: "anime" | "serie"): Promise<CatalogItem[]> {
  const rows = (await sql`
    SELECT
      c.id, c.titulo, c.genero, c.anio, c.estado_publicacion, c.idioma,
      COUNT(e.id)::int AS episodios_cargados,
      bool_or(e.urls->>'onedrive' IS NOT NULL) AS has_onedrive,
      bool_or(e.urls->>'gdrive' IS NOT NULL) AS has_gdrive,
      bool_or(e.urls->>'mega' IS NOT NULL) AS has_mega
    FROM contenido c
    LEFT JOIN episodio e ON e.contenido_id = c.id
    WHERE c.tipo = ${tipo}
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `) as Row[];

  return rows.map((r) => ({
    id: r.id as number,
    title: r.titulo as string,
    genre: ((r.genero as string[] | null)?.[0]) || "—",
    year: r.anio as number,
    status: r.estado_publicacion as CatalogItem["status"],
    episodes: r.episodios_cargados as number,
    lang: (r.idioma as string) || "—",
    servers: [
      r.has_onedrive ? SERVER_LABEL.onedrive : null,
      r.has_gdrive ? SERVER_LABEL.gdrive : null,
      r.has_mega ? SERVER_LABEL.mega : null,
    ].filter((s): s is string => Boolean(s)),
  }));
}

export async function getCatalogoPeliculas(): Promise<CatalogItem[]> {
  const rows = (await sql`
    SELECT id, titulo, genero, anio, estado_publicacion, idioma, servidores
    FROM contenido
    WHERE tipo = 'pelicula'
    ORDER BY created_at DESC
  `) as Row[];

  return rows.map((r) => {
    const sv = (r.servidores as Record<string, { enabled?: boolean }> | null) || {};
    const servers = (["onedrive", "gdrive", "mega"] as const)
      .filter((k) => sv[k]?.enabled)
      .map((k) => SERVER_LABEL[k]);
    return {
      id: r.id as number,
      title: r.titulo as string,
      genre: ((r.genero as string[] | null)?.[0]) || "—",
      year: r.anio as number,
      status: r.estado_publicacion as CatalogItem["status"],
      lang: (r.idioma as string) || "—",
      servers,
    };
  });
}

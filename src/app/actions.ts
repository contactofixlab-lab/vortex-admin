"use server";

import { sql } from "@/lib/db";
import { generarSlugUnico } from "@/lib/slug";

export type EstadoPublicacion = "draft" | "on" | "off";
export type EstadoEmision = "en emisión" | "completo" | "próximamente" | null;

export interface EpisodioPayload {
  numero: number;
  titulo: string;
  temporada: number;
  urls: { onedrive: string; gdrive: string; mega: string };
}

export interface ServidorPayload {
  enabled: boolean;
  url: string;
}

export interface CrearContenidoPayload {
  tipo: "anime" | "serie" | "pelicula";
  titulo: string;
  sinopsis: string;
  estadoPublicacion: EstadoPublicacion;
  estadoEmision: EstadoEmision;
  portada: string;
  anio: number;
  episodiosTotal: number | null;
  duracion: number | null;
  studio: string;
  pais: string;
  trailerUrl: string;
  genero: string[];
  idioma: string;
  rating: string;
  tags: string[];
  malId: string;
  tmdbId: string;
  servidores: { onedrive: ServidorPayload; gdrive: ServidorPayload; mega: ServidorPayload };
  episodios: EpisodioPayload[];
}

export async function crearContenido(payload: CrearContenidoPayload) {
  const slug = await generarSlugUnico(payload.titulo);

  const rows = await sql`
    INSERT INTO contenido (
      tipo, titulo, slug, portada, sinopsis, anio, genero, idioma, rating, tags,
      estado_publicacion, estado_emision, episodios_total, duracion, studio, pais,
      trailer_url, mal_id, tmdb_id, servidores
    ) VALUES (
      ${payload.tipo}, ${payload.titulo}, ${slug}, ${payload.portada || null}, ${payload.sinopsis || null},
      ${payload.anio}, ${payload.genero}, ${payload.idioma || null}, ${payload.rating || null}, ${payload.tags},
      ${payload.estadoPublicacion}, ${payload.estadoEmision}, ${payload.episodiosTotal}, ${payload.duracion},
      ${payload.studio || null}, ${payload.pais || null}, ${payload.trailerUrl || null},
      ${payload.malId || null}, ${payload.tmdbId || null}, ${JSON.stringify(payload.servidores)}
    )
    RETURNING id
  `;
  const contenidoId = rows[0].id as number;

  for (const ep of payload.episodios) {
    const urls = {
      onedrive: ep.urls.onedrive || null,
      gdrive: ep.urls.gdrive || null,
      mega: ep.urls.mega || null,
    };
    await sql`
      INSERT INTO episodio (contenido_id, temporada, numero, titulo, urls)
      VALUES (${contenidoId}, ${ep.temporada}, ${ep.numero}, ${ep.titulo || null}, ${JSON.stringify(urls)})
    `;
  }

  return { id: contenidoId, slug };
}

export async function eliminarContenido(id: number) {
  await sql`DELETE FROM contenido WHERE id = ${id}`;
}

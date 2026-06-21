import "server-only";
import { sql } from "./db";

export type UsuarioRegistro = {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  pais?: string;
  username?: string;
  createdAt: string;
  createdAtRaw: string;
  ultimaConexion: string;
};

export async function obtenerTodosLosUsuarios(): Promise<UsuarioRegistro[]> {
  const rows = await sql`
    SELECT
      u.id,
      u.nombre,
      u.email,
      COALESCE(u.telefono, NULL) as "telefono",
      COALESCE(u.pais, NULL) as "pais",
      COALESCE(u.username, NULL) as "username",
      u.created_at as "createdAt",
      MAX(s.expires_at) as "maxExpires"
    FROM usuario u
    LEFT JOIN sesion s ON s.usuario_id = u.id
    GROUP BY u.id, u.nombre, u.email, u.created_at
    ORDER BY u.created_at DESC
  `;

  return rows.map((r) => {
    const maxExpires = r.maxExpires ? new Date(r.maxExpires as string) : null;
    const now = new Date();
    let ultimaConexion = "Nunca se conectó";

    if (maxExpires) {
      if (maxExpires > now) {
        ultimaConexion = "Conectado ahora";
      } else {
        ultimaConexion = `Última: ${maxExpires.toLocaleString("es-CL")}`;
      }
    }

    return {
      id: r.id as number,
      nombre: r.nombre as string,
      email: r.email as string,
      telefono: r.telefono as string | undefined,
      pais: r.pais as string | undefined,
      username: r.username as string | undefined,
      createdAt: new Date(r.createdAt as string).toLocaleString("es-CL"),
      createdAtRaw: r.createdAt as string,
      ultimaConexion,
    };
  });
}

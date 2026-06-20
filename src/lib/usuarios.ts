import "server-only";
import { sql } from "./db";

export type UsuarioRegistro = {
  id: number;
  nombre: string;
  email: string;
  createdAt: string;
  ultimaConexion: string | null;
};

export async function obtenerTodosLosUsuarios(): Promise<UsuarioRegistro[]> {
  const rows = await sql`
    SELECT
      u.id,
      u.nombre,
      u.email,
      u.created_at as "createdAt",
      CASE
        WHEN COUNT(s.id) > 0 AND MAX(s.expires_at) > now() THEN 'Conectado ahora'
        WHEN COUNT(s.id) > 0 THEN 'Última: ' || to_char(MAX(s.expires_at), 'DD/MM/YYYY HH24:MI')
        ELSE 'Nunca se conectó'
      END as "ultimaConexion"
    FROM usuario u
    LEFT JOIN sesion s ON s.usuario_id = u.id
    GROUP BY u.id, u.nombre, u.email, u.created_at
    ORDER BY u.created_at DESC
  `;

  return rows.map((r) => ({
    id: r.id as number,
    nombre: r.nombre as string,
    email: r.email as string,
    createdAt: new Date(r.createdAt as string).toLocaleString("es-CL"),
    ultimaConexion: r.ultimaConexion as string,
  }));
}
